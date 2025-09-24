import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formularioService } from '../../services/formulario.service';
import { useAuth } from '../../context/AuthContext';
import type { Formulario } from '../../types';
import '../../styles/formularios.shared.css';

export default function FormularioDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<Formulario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => user?.rol === 'admin', [user]);

  useEffect(() => {
    if (!id) {
      setError('ID inválido');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    formularioService.show(Number(id))
      .then((res) => {
        setItem(res.data as Formulario);
      })
      .catch((err: any) => {
        console.error('fetch form error', err);
        const status = err?.response?.status;
        if (status === 403) setError('No autorizado para ver este formulario.');
        else if (status === 401) setError('No autenticado. Inicia sesión para ver este formulario.');
        else setError(err?.response?.data?.message || 'Error al cargar formulario');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!item?.id) return;
    if (!confirm('¿Eliminar este formulario? Esta acción es irreversible.')) return;
    try {
      await formularioService.destroy(item.id);
      alert('Formulario eliminado');
      navigate('/formularios');
    } catch (err: any) {
      console.error('delete error', err);
      alert(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return (
    <div className="form-page">
      <div className="form-card" style={{ textAlign: 'center', padding: 28 }}>
        <div className="form-card-header">
          <h2 className="form-title">Detalle del Formulario</h2>
          <p className="form-subtitle">Cargando...</p>
        </div>
        <div className="form-body">Cargando...</div>
      </div>
    </div>
  );

  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!item) return <div style={{ padding: 20 }}>No encontrado.</div>;

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-card-header">
          <h2 className="form-title">Detalle del Formulario</h2>
          <p className="form-subtitle">Información detallada de la solicitud</p>
        </div>

        <div className="form-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--soft-white)', padding: 12, borderRadius: 8 }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>ID</p>
              <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{item.id}</p>
            </div>

            <div style={{ background: 'var(--soft-white)', padding: 12, borderRadius: 8 }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Creado</p>
              <p style={{ margin: '6px 0 0' }}>{new Date(item.created_at).toLocaleString()}</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'var(--pure-white)' }}>
              <div style={{ padding: 12 }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Nombres y apellidos</p>
                <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{item.nombres_apellidos}</p>

                <p style={{ margin: '12px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>Dirección</p>
                <p style={{ margin: '6px 0 0' }}>{item.direccion}</p>

                <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>DNI</p>
                    <p style={{ margin: '6px 0 0' }}>{item.dni}</p>
                  </div>

                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>RUC</p>
                    <p style={{ margin: '6px 0 0' }}>{item.ruc ?? '-'}</p>
                  </div>

                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Celular</p>
                    <p style={{ margin: '6px 0 0' }}>{item.celular}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Propiedad</p>
                    <p style={{ margin: '6px 0 0' }}>{item.propiedad ? 'Sí' : 'No'}</p>
                  </div>

                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Título</p>
                    <p style={{ margin: '6px 0 0' }}>{item.titulo ? 'Sí' : 'No'}</p>
                  </div>

                  <div style={{ minWidth: 160 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Registro público</p>
                    <p style={{ margin: '6px 0 0' }}>{item.reg_publico ? 'Sí' : 'No'}</p>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Charlas</p>
                  <p style={{ margin: '6px 0 0' }}>{item.charlas}</p>
                </div>

                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Adicional</p>
                  <p style={{ margin: '6px 0 0' }}>{item.adicional ?? '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => navigate('/formularios')}>Volver a la lista</button>

            {isAdmin && (
              <>
                <Link to={`/formularios/${item.id}/edit`} className="btn btn-primary">Editar</Link>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

