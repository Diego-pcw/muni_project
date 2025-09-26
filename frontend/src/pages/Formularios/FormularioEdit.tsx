// src/pages/Formularios/FormularioEdit.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formularioService } from '../../services/formulario.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { Formulario } from '../../types';
import '../../styles/formularios.shared.css';
import { useToast } from '../../context/ToastContext';

export default function FormularioEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<Partial<Formulario>>();
  const { push } = useToast(); // <-- toast

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    formularioService.show(Number(id))
      .then((r) => {
        const d = r.data as Formulario;
        const normalized: any = {
          ...d,
          propiedad: Boolean((d as any).propiedad),
          titulo: Boolean((d as any).titulo),
          reg_publico: Boolean((d as any).reg_publico),
          adicional: (d as any).adicional ?? '',
        };
        reset(normalized);
      })
      .catch((err) => {
        console.error(err);
        // usar toast en vez de alert
        push('Error cargando formulario', 'error');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: Partial<Formulario>) => {
    if (!id) return;
    try {
      const payload = {
        ...data,
        propiedad: Boolean(data.propiedad),
        titulo: Boolean(data.titulo),
        reg_publico: Boolean(data.reg_publico),
      };
      await formularioService.update(Number(id), payload);

      // toast success
      push('Formulario actualizado', 'success');

      navigate('/formularios');
    } catch (err: any) {
      console.error(err);
      // preferir mensaje devuelto por backend si existe
      const msg = err?.response?.data?.message || err.message || 'Error al actualizar formulario';
      push(String(msg), 'error');
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-card" style={{ textAlign: 'center', padding: 28 }}>
          <div className="form-card-header">
            <h2 className="form-title">Editar Formulario</h2>
            <p className="form-subtitle">Cargando datos...</p>
          </div>
          <div className="form-body" style={{ padding: 20 }}>
            <div className="loading" aria-live="polite" style={{ display: 'inline-block', padding: 20 }}>
              Cargando...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-card-header">
          <h2 className="form-title">Editar Formulario</h2>
          <p className="form-subtitle">Actualiza la información del formulario</p>
        </div>

        <form className="form-body" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="nombres_apellidos">Nombres y apellidos</label>
              <input id="nombres_apellidos" className="form-input" {...register('nombres_apellidos' as any, { required: 'Nombre requerido' })} />
              {errors?.nombres_apellidos && <small className="form-error">{(errors as any).nombres_apellidos?.message}</small>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="dni">DNI</label>
              <input id="dni" className="form-input" {...register('dni' as any)} />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="ruc">RUC</label>
              <input id="ruc" className="form-input" {...register('ruc' as any)} />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="celular">Celular</label>
              <input id="celular" className="form-input" {...register('celular' as any)} />
            </div>

            <div className="form-field form-field-full">
              <label className="form-label" htmlFor="direccion">Dirección</label>
              <input id="direccion" className="form-input" {...register('direccion' as any)} />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="asociacion">Asociación</label>
              <input id="asociacion" className="form-input" {...register('asociacion' as any)} />
            </div>

            <div className="form-field form-field-full">
              <label className="form-label">Documentos</label>
              <div className="checkbox-group" style={{ marginTop: 6 }}>
                <label className="checkbox-item">
                  <input type="checkbox" {...register('propiedad' as any)} /> <span>Propiedad</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" {...register('titulo' as any)} /> <span>Título</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" {...register('reg_publico' as any)} /> <span>Registro público</span>
                </label>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="charlas">Charlas</label>
              <select id="charlas" className="form-input" {...register('charlas' as any)}>
                <option value="virtual">virtual</option>
                <option value="presencial">presencial</option>
                <option value="ninguno">ninguno</option>
              </select>
            </div>

            <div className="form-field form-field-full">
              <label className="form-label" htmlFor="adicional">Adicional</label>
              <textarea id="adicional" className="form-textarea" {...register('adicional' as any)} rows={3} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Actualizar</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/formularios')} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
