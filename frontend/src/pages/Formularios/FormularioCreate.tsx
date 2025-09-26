// src/pages/Formularios/FormularioCreate.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { formularioService } from '../../services/formulario.service';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext'; 
import '../../styles/formularios.shared.css';

type Form = {
  nombres_apellidos: string;
  dni: string;
  ruc?: string;
  celular: string;
  direccion: string;
  asociacion?: string;
  propiedad?: boolean;
  titulo?: boolean;
  reg_publico?: boolean;
  charlas: 'virtual' | 'presencial' | 'ninguno';
  adicional?: string;
};

export default function FormularioCreate(): JSX.Element {
  const navigate = useNavigate();
  const { push } = useToast(); 
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    defaultValues: {
      propiedad: false,
      titulo: false,
      reg_publico: false,
      charlas: 'ninguno',
      adicional: '',
    }
  });

  const onSubmit = async (data: Form) => {
    try {
      const payload: Partial<Form> = {
        ...data,
        propiedad: Boolean(data.propiedad),
        titulo: Boolean(data.titulo),
        reg_publico: Boolean(data.reg_publico),
      };

      const res = await formularioService.create(payload);

      // 👇 antes era alert, ahora es toast
      push('Formulario creado con éxito', 'success');

      navigate('/formularios');
    } catch (err: any) {
      console.error('create error', err);

      // 👇 mismo para error
      push(err?.response?.data?.message || 'Error al crear formulario', 'error');
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-card-header">
          <h2 className="form-title">Crear Formulario</h2>
          <p className="form-subtitle">Registra la solicitud con los datos solicitados</p>
        </div>

        <form className="form-body" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nombres y apellidos</label>
              <input className="form-input" {...register('nombres_apellidos', { required: 'Nombre obligatorio', maxLength: 255 })} />
              {errors.nombres_apellidos && <small className="form-error">{errors.nombres_apellidos.message}</small>}
            </div>

            <div className="form-field">
              <label className="form-label">DNI</label>
              <input className="form-input" {...register('dni', { required: 'DNI requerido', pattern: { value: /^\d{8}$/, message: 'DNI debe tener 8 dígitos' } })} />
              {errors.dni && <small className="form-error">{errors.dni.message}</small>}
            </div>

            <div className="form-field">
              <label className="form-label">RUC (opcional)</label>
              <input className="form-input" {...register('ruc', { pattern: { value: /^\d{11}$/, message: 'RUC debe tener 11 dígitos' } })} />
              {errors.ruc && <small className="form-error">{errors.ruc.message}</small>}
            </div>

            <div className="form-field">
              <label className="form-label">Celular</label>
              <input className="form-input" {...register('celular', { required: 'Celular requerido' })} />
              {errors.celular && <small className="form-error">{errors.celular.message}</small>}
            </div>

            <div className="form-field form-field-full">
              <label className="form-label">Dirección</label>
              <input className="form-input" {...register('direccion', { required: 'Dirección requerida' })} />
              {errors.direccion && <small className="form-error">{errors.direccion.message}</small>}
            </div>

            <div className="form-field">
              <label className="form-label">Asociación (opcional)</label>
              <input className="form-input" {...register('asociacion')} />
            </div>

            <div className="form-field form-checkboxes form-field-full">
              <label className="form-label">Documentos</label>
              <div className="checkbox-group">
                <label className="checkbox-item"><input type="checkbox" {...register('propiedad')} /> <span>Propiedad</span></label>
                <label className="checkbox-item"><input type="checkbox" {...register('titulo')} /> <span>Título</span></label>
                <label className="checkbox-item"><input type="checkbox" {...register('reg_publico')} /> <span>Registro público</span></label>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Charlas</label>
              <select className="form-input" {...register('charlas')}>
                <option value="virtual">virtual</option>
                <option value="presencial">presencial</option>
                <option value="ninguno">ninguno</option>
              </select>
            </div>

            <div className="form-field form-field-full">
              <label className="form-label">Adicional (opcional)</label>
              <textarea className="form-textarea" {...register('adicional')} rows={4} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Enviar</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/formularios')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

