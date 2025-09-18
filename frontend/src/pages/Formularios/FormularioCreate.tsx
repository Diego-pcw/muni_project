// src/pages/Formularios/FormularioCreate.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { formularioService } from '../../services/formulario.service';
import { useNavigate } from 'react-router-dom';

type Form = {
  nombres_apellidos: string;
  dni: string;
  ruc?: string;
  celular: string;
  direccion: string;
  asociacion?: string;
  propiedad: boolean;
  titulo: boolean;
  reg_publico: boolean;
  charlas: 'virtual' | 'presencial' | 'ninguno';
};

export default function FormularioCreate(): JSX.Element {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    defaultValues: { propiedad: false, titulo: false, reg_publico: false, charlas: 'ninguno' }
  });
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      const res = await formularioService.create(data);
      alert('Formulario creado: ' + (res.data?.data?.id ?? 'OK'));
      // navegar a la lista
      navigate('/formularios');
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + JSON.stringify(err.response?.data || err.message || err));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crear Formulario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Nombres y apellidos</label>
          <input {...register('nombres_apellidos', { required: 'Nombre obligatorio', maxLength: 255 })} />
          {errors.nombres_apellidos && <small style={{ color: 'red' }}>{errors.nombres_apellidos.message}</small>}
        </div>

        <div className="form-field">
          <label>DNI</label>
          <input {...register('dni', { required: 'DNI requerido', pattern: { value: /^\d{8}$/, message: 'DNI debe tener 8 dígitos' } })} />
          {errors.dni && <small style={{ color: 'red' }}>{errors.dni.message}</small>}
        </div>

        <div className="form-field">
          <label>RUC (opcional)</label>
          <input {...register('ruc', { pattern: { value: /^\d{11}$/, message: 'RUC debe tener 11 dígitos' } })} />
          {errors.ruc && <small style={{ color: 'red' }}>{errors.ruc.message}</small>}
        </div>

        <div className="form-field">
          <label>Celular</label>
          <input {...register('celular', { required: 'Celular requerido' })} />
          {errors.celular && <small style={{ color: 'red' }}>{errors.celular.message}</small>}
        </div>

        <div className="form-field">
          <label>Dirección</label>
          <input {...register('direccion', { required: 'Dirección requerida' })} />
          {errors.direccion && <small style={{ color: 'red' }}>{errors.direccion.message}</small>}
        </div>

        <div className="form-field">
          <label>Asociación (opcional)</label>
          <input {...register('asociacion')} />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <label><input type="checkbox" {...register('propiedad')} /> Propiedad</label>
          <label><input type="checkbox" {...register('titulo')} /> Título</label>
          <label><input type="checkbox" {...register('reg_publico')} /> Registro público</label>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Charlas</label>
          <select {...register('charlas')}>
            <option value="virtual">virtual</option>
            <option value="presencial">presencial</option>
            <option value="ninguno">ninguno</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Enviar</button>
          <button type="button" className="btn" onClick={() => navigate('/formularios')} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
