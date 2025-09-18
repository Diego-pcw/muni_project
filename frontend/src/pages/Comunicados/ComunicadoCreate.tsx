// src/pages/Comunicados/ComunicadoCreate.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { comunicadoService } from '../../services/comunicado.service';
import { useNavigate } from 'react-router-dom';

type Form = {
  titulo: string;
  imagen?: FileList;
  descripcion: string;
  fecha_publicacion: string; // YYYY-MM-DD
  hora_publicacion: string;  // HH:mm
  publicador: string;
  entidad: string;
  estado: 'activo' | 'inactivo';
};

export default function ComunicadoCreate(): JSX.Element {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<Form>({
    defaultValues: { estado: 'activo', hora_publicacion: '08:00' }
  });
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  // watch file input for preview
  const watched = watch('imagen');
  React.useEffect(() => {
    if (watched && watched.length > 0) {
      const f = watched[0];
      const url = URL.createObjectURL(f);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [watched]);

  const onSubmit = async (data: Form) => {
    try {
      const fd = new FormData();
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

      const res = await comunicadoService.create(fd);
      alert(res.data?.message || 'Comunicado creado');
      navigate('/comunicados');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || JSON.stringify(err?.response?.data) || err.message;
      alert('Error: ' + msg);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crear Comunicado</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
        <div className="form-field">
          <label>Título</label>
          <input {...register('titulo', { required: 'Título requerido', maxLength: 255 })} />
          {errors.titulo && <small style={{ color: 'red' }}>{errors.titulo.message}</small>}
        </div>

        <div className="form-field">
          <label>Imagen (jpg/png, &lt;= 2MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            {...register('imagen')}
          />
          {preview && (
            <div style={{ marginTop: 8 }}>
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: 320, maxHeight: 180, objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <div className="form-field">
          <label>Descripción</label>
          <textarea {...register('descripcion', { required: 'Descripción requerida' })} rows={5} />
          {errors.descripcion && <small style={{ color: 'red' }}>{errors.descripcion.message}</small>}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Fecha publicación (YYYY-MM-DD)</label>
            <input {...register('fecha_publicacion', { required: 'Fecha requerida', pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD' } })} placeholder="2025-09-20" />
            {errors.fecha_publicacion && <small style={{ color: 'red' }}>{errors.fecha_publicacion.message}</small>}
          </div>

          <div style={{ width: 140 }}>
            <label>Hora (HH:mm)</label>
            <input {...register('hora_publicacion', { required: 'Hora requerida', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:mm' } })} placeholder="08:00" />
            {errors.hora_publicacion && <small style={{ color: 'red' }}>{errors.hora_publicacion.message}</small>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Publicador</label>
            <input {...register('publicador', { required: 'Publicador requerido', maxLength: 255 })} />
            {errors.publicador && <small style={{ color: 'red' }}>{errors.publicador.message}</small>}
          </div>

          <div style={{ flex: 1 }}>
            <label>Entidad</label>
            <input {...register('entidad', { required: 'Entidad requerida', maxLength: 255 })} />
            {errors.entidad && <small style={{ color: 'red' }}>{errors.entidad.message}</small>}
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Estado</label>
          <select {...register('estado', { required: true })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Crear</button>
          <button type="button" className="btn" onClick={() => navigate('/comunicados')} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
