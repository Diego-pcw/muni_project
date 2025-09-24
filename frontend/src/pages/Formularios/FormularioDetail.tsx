// src/pages/Formularios/FormularioDetail.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formularioService } from '../../services/formulario.service';
import { useAuth } from '../../context/AuthContext';
import type { Formulario } from '../../types';

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

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!item) return <div style={{ padding: 20 }}>No encontrado.</div>;

  // SOLO admin verá Edit y Delete (clientes NO verán Edit)
  const canEdit = Boolean(isAdmin);
  const canDelete = Boolean(isAdmin);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2>Detalle del Formulario</h2>

      <div className="card" style={{ padding: 12 }}>
        <p><strong>ID:</strong> {item.id}</p>
        <p><strong>Nombres y apellidos:</strong> {item.nombres_apellidos}</p>
        <p><strong>DNI:</strong> {item.dni}</p>
        <p><strong>RUC:</strong> {item.ruc ?? '-'}</p>
        <p><strong>Celular:</strong> {item.celular}</p>
        <p><strong>Dirección:</strong> {item.direccion}</p>
        <p><strong>Asociación:</strong> {item.asociacion ?? '-'}</p>
        <p><strong>Propiedad:</strong> {item.propiedad ? 'Sí' : 'No'}</p>
        <p><strong>Título:</strong> {item.titulo ? 'Sí' : 'No'}</p>
        <p><strong>Registro público:</strong> {item.reg_publico ? 'Sí' : 'No'}</p>
        <p><strong>Charlas:</strong> {item.charlas}</p>
        <p><strong>Adicional:</strong> {item.adicional ?? '-'}</p>
        <p><strong>Creado:</strong> {new Date(item.created_at).toLocaleString()}</p>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={() => navigate('/formularios')}>Volver a la lista</button>

        {canEdit && (
          <Link to={`/formularios/${item.id}/edit`} className="btn btn-primary">Editar</Link>
        )}

        {canDelete && (
          <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
