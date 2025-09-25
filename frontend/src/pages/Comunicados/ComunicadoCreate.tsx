import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { comunicadoService } from '../../services/comunicado.service';
import { useNavigate } from 'react-router-dom';
import '../../styles/comunicados.shared.css';

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
    if (watched && (watched as any).length > 0) {
      const f = (watched as any)[0] as File;
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
    <div className="comunicado-page">
      <div className="comunicado-card">
        <div className="comunicado-card-header">
          <h2 className="comunicado-title">Crear Comunicado</h2>
          <p className="comunicado-subtitle">Registra la publicación que desees compartir</p>
        </div>

        <div className="comunicado-body">
          <form className="comunicado-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Título</label>
              <input className="comunicado-input" {...register('titulo', { required: 'Título requerido', maxLength: 255 })} />
              {errors.titulo && <small className="comunicado-error">{errors.titulo.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Imagen (jpg/png, &lt;= 2MB)</label>
              <input className="comunicado-file" type="file" accept="image/jpeg,image/png" {...register('imagen')} />
              {preview && (
                <div className="comunicado-image-preview" aria-hidden>
                  <img src={preview} alt="preview" />
                </div>
              )}
            </div>

            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Descripción</label>
              <textarea className="comunicado-textarea" {...register('descripcion', { required: 'Descripción requerida' })} rows={5} />
              {errors.descripcion && <small className="comunicado-error">{errors.descripcion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Fecha publicación (YYYY-MM-DD)</label>
              <input className="comunicado-input" {...register('fecha_publicacion', { required: 'Fecha requerida', pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD' } })} placeholder="2025-09-20" />
              {errors.fecha_publicacion && <small className="comunicado-error">{errors.fecha_publicacion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Hora (HH:mm)</label>
              <input className="comunicado-input" {...register('hora_publicacion', { required: 'Hora requerida', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:mm' } })} placeholder="08:00" />
              {errors.hora_publicacion && <small className="comunicado-error">{errors.hora_publicacion.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Publicador</label>
              <input className="comunicado-input" {...register('publicador', { required: 'Publicador requerido', maxLength: 255 })} />
              {errors.publicador && <small className="comunicado-error">{errors.publicador.message}</small>}
            </div>

            <div className="comunicado-field">
              <label className="comunicado-label">Entidad</label>
              <input className="comunicado-input" {...register('entidad', { required: 'Entidad requerida', maxLength: 255 })} />
              {errors.entidad && <small className="comunicado-error">{errors.entidad.message}</small>}
            </div>

            <div className="comunicado-field comunicado-field-full">
              <label className="comunicado-label">Estado</label>
              <select className="comunicado-select" {...register('estado', { required: true })}>
                <option value="activo">activo</option>
                <option value="inactivo">inactivo</option>
              </select>
            </div>

            <div className="comunicado-field comunicado-field-full comunicado-actions">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Crear</button>
              <button type="button" className="btn" onClick={() => navigate('/comunicados')}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

