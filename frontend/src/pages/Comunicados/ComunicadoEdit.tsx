// src/pages/Comunicados/ComunicadoEdit.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { comunicadoService } from '../../services/comunicado.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { Comunicado } from '../../types';

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
    if (imagenFiles && imagenFiles.length > 0) {
      const file = imagenFiles[0];
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

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2>Editar Comunicado</h2>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
        <div style={{ marginBottom: 10 }}>
          <label>Título*</label>
          <input {...register('titulo', { required: 'El título es obligatorio', maxLength: { value: 255, message: 'Máx 255 caracteres' } })} />
          {errors.titulo && <small style={{ color: 'red' }}>{errors.titulo.message}</small>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Imagen actual</label>
          {existingImageUrl ? (
            <div style={{ marginBottom: 8 }}>
              <img
                src={existingImageUrl}
                alt="actual"
                style={{ maxWidth: 300, maxHeight: 200, objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 8, color: '#666' }}>
              No hay imagen asociada
            </div>
          )}
        
          <label>Reemplazar imagen (jpg, png | &lt;= 2MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            {...register('imagen', {
              validate: {
                lessThan2MB: (files) =>
                  !files[0] || files[0].size <= 2 * 1024 * 1024 || 'El archivo debe pesar menos de 2MB',
                acceptedFormats: (files) =>
                  !files[0] ||
                  ['image/jpeg', 'image/png'].includes(files[0].type) ||
                  'Solo se permiten imágenes JPG o PNG',
              },
            })}
          />
          {errors.imagen && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.imagen.message as string}</p>
          )}
        
          {preview && (
            <div style={{ marginTop: 8 }}>
              <small>Preview (nueva imagen):</small>
              <div>
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxWidth: 300, maxHeight: 200, objectFit: 'cover' }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Descripción*</label>
          <textarea {...register('descripcion', { required: 'La descripción es obligatoria' })} rows={5} />
          {errors.descripcion && <small style={{ color: 'red' }}>{errors.descripcion.message}</small>}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Fecha publicación*</label>
            <input {...register('fecha_publicacion', { required: 'Fecha obligatoria', pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD' } })} placeholder="YYYY-MM-DD" />
            {errors.fecha_publicacion && <small style={{ color: 'red' }}>{errors.fecha_publicacion.message}</small>}
          </div>

          <div style={{ width: 140 }}>
            <label>Hora publicación*</label>
            <input {...register('hora_publicacion', { required: 'Hora obligatoria', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:mm' } })} placeholder="HH:mm" />
            {errors.hora_publicacion && <small style={{ color: 'red' }}>{errors.hora_publicacion.message}</small>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Publicador*</label>
            <input {...register('publicador', { required: 'Campo requerido', maxLength: 255 })} />
            {errors.publicador && <small style={{ color: 'red' }}>{errors.publicador.message}</small>}
          </div>

          <div style={{ flex: 1 }}>
            <label>Entidad*</label>
            <input {...register('entidad', { required: 'Campo requerido', maxLength: 255 })} />
            {errors.entidad && <small style={{ color: 'red' }}>{errors.entidad.message}</small>}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Estado*</label>
          <select {...register('estado', { required: true })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px' }}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar Comunicado'}
          </button>
          <button type="button" onClick={() => navigate('/comunicados')} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
