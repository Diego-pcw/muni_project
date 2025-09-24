// src/pages/Dashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { formularioService } from '../services/formulario.service';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { Formulario, Paginated } from '../types';
import '../styles/dashboard.shared.css'; // asume que ya existe

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const isAdmin = useMemo(() => user?.rol === 'admin', [user]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Formulario[]>([]);
  const [total, setTotal] = useState<number>(0);

  // stats derived
  const stats = useMemo(() => {
    const s = { total: 0, thisMonth: 0, withRuc: 0, propiedadCount: 0, charlas: { virtual: 0, presencial: 0, ninguno: 0 } };
    const now = new Date();
    items.forEach((it) => {
      s.total += 1;
      if (it.ruc) s.withRuc += 1;
      if (it.propiedad) s.propiedadCount += 1;
      if (it.charlas === 'virtual') s.charlas.virtual += 1;
      else if (it.charlas === 'presencial') s.charlas.presencial += 1;
      else s.charlas.ninguno += 1;

      // this month
      try {
        if (it.created_at) {
          const d = new Date(it.created_at);
          if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) s.thisMonth += 1;
        }
      } catch (e) { /* ignore parse errors */ }
    });
    return s;
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // primero pedimos 1 item para conseguir total rápido
        const head = await formularioService.list(1, '', 1, false);
        const hd = head.data as Paginated<Formulario>;
        const totalItems = hd.total ?? (hd.data?.length ?? 0);
        if (cancelled) return;

        setTotal(totalItems);

        // si total pequeño, solicitar todo; si no, solicitar N (ej. 1000) para mostrar stats y recientes
        const fetchCount = totalItems <= 2000 ? totalItems || 0 : 1000;
        // si fetchCount es 0, no pedir
        if (fetchCount > 0) {
          const pageSize = Math.min(Math.max(fetchCount, 10), 2000);
          const res = await formularioService.list(1, '', pageSize, false);
          const data = res.data as Paginated<Formulario>;
          if (!cancelled) {
            setItems(data.data ?? []);
          }
        } else {
          setItems([]);
        }
      } catch (err: any) {
        console.error('dashboard load error', err);
        setError(err?.response?.data?.message || err.message || 'Error cargando datos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers para mini-chart: porcentaje por charlas (retorna array)
  const charlaData = useMemo(() => {
    const total = stats.charlas.virtual + stats.charlas.presencial + stats.charlas.ninguno || 1;
    return [
      { label: 'Virtual', value: stats.charlas.virtual, pct: Math.round((stats.charlas.virtual / total) * 100) },
      { label: 'Presencial', value: stats.charlas.presencial, pct: Math.round((stats.charlas.presencial / total) * 100) },
      { label: 'Ninguno', value: stats.charlas.ninguno, pct: Math.round((stats.charlas.ninguno / total) * 100) },
    ];
  }, [stats]);

  const latest = [...items].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  }).slice(0, 6);

  return (
    <div className="form-page" style={{ paddingTop: 20 }}>
      <div className="form-card" style={{ maxWidth: 1100 }}>
        <div className="form-card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <h2 className="form-title">Panel de administración</h2>
              <p className="form-subtitle">Resumen en tiempo real (datos agregados en cliente)</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {isAdmin && <Link to="/formularios" className="btn btn-secondary">Ir a Formularios</Link>}
              {isAdmin && <Link to="/usuarios" className="btn btn-primary">Administrar usuarios</Link>}
            </div>
          </div>
        </div>

        <div className="form-body">
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>Cargando dashboard...</div>
          ) : error ? (
            <div style={{ padding: 20, color: 'red' }}>{error}</div>
          ) : (
            <>
              {/* KPI row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                <div className="quick-stats" style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total formularios</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{total ?? stats.total}</div>
                </div>

                <div className="quick-stats" style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Este mes</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{stats.thisMonth}</div>
                </div>

                <div className="quick-stats" style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Con RUC</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{stats.withRuc}</div>
                </div>

                <div className="quick-stats" style={{ padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Con propiedad</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{stats.propiedadCount}</div>
                </div>
              </div>

              {/* Main content: chart + recent list */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
                {/* Chart box */}
                <div className="service-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700 }}>Charlas (por tipo)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{charlaData.reduce((s, x) => s + x.value, 0)} items</div>
                  </div>

                  {/* simple horizontal bars */}
                  <div>
                    {charlaData.map((c) => (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ minWidth: 90, fontSize: 13 }}>{c.label}</div>
                        <div style={{ flex: 1, height: 12, background: 'var(--light-blue)', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{
                            width: `${c.pct}%`,
                            height: '100%',
                            background: c.label === 'Virtual' ? 'var(--primary-blue)' : c.label === 'Presencial' ? 'var(--secondary-blue)' : 'var(--accent-yellow)',
                            borderRadius: 6,
                            transition: 'width .4s ease'
                          }} />
                        </div>
                        <div style={{ minWidth: 36, textAlign: 'right', fontSize: 13 }}>{c.pct}%</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 13 }}>
                    Nota: estadísticas calculadas en cliente con los registros descargados (puede estar limitado si hay muchos).
                  </div>
                </div>

                {/* Recent submissions */}
                <div className="service-card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Últimos envíos</div>
                  {latest.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)' }}>No hay envíos recientes.</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {latest.map((it) => (
                        <li key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{it.nombres_apellidos}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{it.dni} • {it.celular} · {it.asociacion ?? '-'}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Link to={`/formularios/${it.id}`} className="btn">Ver</Link>
                            {isAdmin && <Link to={`/formularios/${it.id}/edit`} className="btn btn-primary">Editar</Link>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* quick link row */}
              <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Link to="/formularios" className="btn btn-secondary">Ver todos los formularios</Link>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // Exportar CSV (cliente) con todos los campos solicitados
                    const headers = [
                    'nombres_apellidos',
                    'dni',
                    'ruc',
                    'celular',
                    'direccion',
                    'asociacion',
                    'propiedad',
                    'titulo',
                    'reg_publico',
                    'charlas',
                    'adicional'
                    ];

                    const escapeCsv = (value: any) => {
                    const s = value === null || value === undefined ? '' : String(value);
                    return `"${s.replace(/"/g, '""')}"`;
                    };

                    const rows = items.map(i => ({
                    nombres_apellidos: i.nombres_apellidos ?? '',
                    dni: i.dni ?? '',
                    ruc: i.ruc ?? '',
                    celular: i.celular ?? '',
                    direccion: i.direccion ?? '',
                    asociacion: i.asociacion ?? '',
                    propiedad: (i.propiedad ? 'Sí' : 'No'),
                    titulo: (i.titulo ? 'Sí' : 'No'),
                    reg_publico: (i.reg_publico ? 'Sí' : 'No'),
                    charlas: i.charlas ?? '',
                    adicional: i.adicional ?? ''
                    }));

                    if (rows.length === 0) {
                    alert('No hay registros descargados para exportar.');
                    } else {
                    const csvLines = [
                        headers.join(','), // header row
                        ...rows.map(r =>
                        headers.map(h => escapeCsv((r as any)[h])).join(',')
                        )
                    ];
                      // Añadir BOM para Excel (UTF-8)
                    const csvContent = '\uFEFF' + csvLines.join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'formularios_export.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                    }
                  }}
                >
                  Exportar CSV
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
