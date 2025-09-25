import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { comunicadoService } from '../../services/comunicado.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { Comunicado } from '../../types';
import '../../styles/comunicados.shared.css';

type FormInputs = {
  titulo: string;
  descripcion: string;
  fecha_publicacion: string; // YYYY-MM-DD
  hora_publicacion: string;  // HH:mm
  publicador: string;
  entidad: string;
  estado: 'activo' | 'inactivo';
  imagen?: FileList;
};

export default function ComunicadoEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    defaultValues: { estado: 'activo', hora_publicacion: '08:00' }
  });

  // watch imagen to generate preview
  const imagenFiles = watch('imagen');
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (imagenFiles && (imagenFiles as any).length > 0) {
      const file = (imagenFiles as any)[0] as File;
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [imagenFiles]);

  // compute base url to serve images (remove trailing /api if present)
  const apiBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    comunicadoService.show(Number(id))
      .then((res) => {
        const data = res.data as Comunicado;
        // prepare values
        const fecha = data.fecha_publicacion ? data.fecha_publicacion.slice(0,10) : '';
        const hora = data.hora_publicacion ? (data.hora_publicacion.slice(0,5)) : '08:00';
        reset({
          titulo: data.titulo ?? '',
          descripcion: data.descripcion ?? '',
          fecha_publicacion: fecha,
          hora_publicacion: hora,
          publicador: data.publicador ?? '',
          entidad: data.entidad ?? '',
          estado: data.estado ?? 'activo',
        });
        if (data.imagen) {
          setExistingImageUrl(`${apiBase}/storage/${data.imagen}`);
        } else {
          setExistingImageUrl(null);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error cargando comunicado');
      })
      .finally(() => setLoading(false));
  }, [id, reset, apiBase]);

  const onSubmit = async (data: FormInputs) => {
    if (!id) { alert('ID inválido'); return; }
    try {
      const fd = new FormData();
      fd.append('_method', 'PUT'); // in case backend expects PUT via POST with _method
      fd.append('titulo', data.titulo);
      fd.append('descripcion', data.descripcion);
      fd.append('fecha_publicacion', data.fecha_publicacion);
      fd.append('hora_publicacion', data.hora_publicacion);
      fd.append('publicador', data.publicador);
      fd.append('entidad', data.entidad);
      fd.append('estado', data.estado);

      if (data.imagen && data.imagen.length > 0) {
        fd.append('imagen', data.imagen[0]);
      }

      const res = await comunicadoService.update(Number(id), fd);
      alert(res.data?.message || 'Comunicado actualizado');
      navigate('/comunicados');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || JSON.stringify(err?.response?.data) || err.message;
      alert('Error: ' + msg);
    }
  };

  if (loading) {
    return (
      <div className="comunicado-page">
        <div className="comunicado-card comunicado-center" style={{ padding: 28 }}>
          <div className="loading" aria-live="polite">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="comunicado-page">
      <div className="comunicado-card">
        <div className="comunicado-card-header">
          <h2 className="comunicado-title">Editar Comunicado</h2>
          <p className="comunicado-subtitle">Actualiza los datos del comunicado</p>
        </div>

        <div className="comunicado-body">
          <form className="comunicado-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Título*</label>
              <input className="comunicado-input" {...register('titulo', { required: 'El título es obligatorio', maxLength: { value: 255, message: 'Máx 255 caracteres' } })} />
              {errors.titulo && <small className="comunicado-error">{errors.titulo.message}</small>}
            </div>

            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Imagen actual</label>
              {existingImageUrl ? (
                <div style={{ marginBottom: 8 }}>
                  <div className="comunicado-image-preview" aria-hidden>
                    <img src={existingImageUrl} alt="actual" />
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 8, color: '#666' }}>No hay imagen asociada</div>
              )}

              <label className="comunicado-label">Reemplazar imagen (jpg, png | &lt;= 2MB)</label>
              <input className="comunicado-file" type="file" accept="image/jpeg,image/png" {...register('imagen', {
                validate: {
                  lessThan2MB: (files: FileList) =>
                    !files[0] || files[0].size <= 2 * 1024 * 1024 || 'El archivo debe pesar menos de 2MB',
                  acceptedFormats: (files: FileList) =>
                    !files[0] ||
                    ['image/jpeg', 'image/png'].includes(files[0].type) ||
                    'Solo se permiten imágenes JPG o PNG',
                },
              })} />
              {errors.imagen && <p className="comunicado-error" style={{ marginTop: 4 }}>{(errors.imagen as any).message as string}</p>}

              {preview && (
                <div style={{ marginTop: 8 }}>
                  <small>Preview (nueva imagen):</small>
                  <div className="comunicado-image-preview" aria-hidden>
                    <img src={preview} alt="preview" />
                  </div>
                </div>
              )}
            </div>

            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Descripción*</label>
              <textarea className="comunicado-textarea" {...register('descripcion', { required: 'La descripción es obligatoria' })} rows={5} />
              {errors.descripcion && <small className="comunicado-error">{errors.descripcion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Fecha publicación*</label>
              <input className="comunicado-input" {...register('fecha_publicacion', { required: 'Fecha obligatoria', pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD' } })} placeholder="YYYY-MM-DD" />
              {errors.fecha_publicacion && <small className="comunicado-error">{errors.fecha_publicacion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Hora publicación*</label>
              <input className="comunicado-input" {...register('hora_publicacion', { required: 'Hora obligatoria', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:mm' } })} placeholder="HH:mm" />
              {errors.hora_publicacion && <small className="comunicado-error">{errors.hora_publicacion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Publicador*</label>
              <input className="comunicado-input" {...register('publicador', { required: 'Campo requerido', maxLength: 255 })} />
              {errors.publicador && <small className="comunicado-error">{errors.publicador.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Entidad*</label>
              <input className="comunicado-input" {...register('entidad', { required: 'Campo requerido', maxLength: 255 })} />
              {errors.entidad && <small className="comunicado-error">{errors.entidad.message}</small>}
            </div>

            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Estado*</label>
              <select className="comunicado-select" {...register('estado', { required: true })}>
                <option value="activo">activo</option>
                <option value="inactivo">inactivo</option>
              </select>
            </div>

            <div className="comunicado-field comunicado-field-full comunicado-actions">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar Comunicado'}
              </button>
              <button type="button" className="btn" onClick={() => navigate('/comunicados')}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

