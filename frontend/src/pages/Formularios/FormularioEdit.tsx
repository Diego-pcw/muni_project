// src/pages/Formularios/FormularioEdit.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formularioService } from '../../services/formulario.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { Formulario } from '../../types';

export default function FormularioEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<Partial<Formulario>>();

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
        };
        reset(normalized);
      })
      .catch((err) => {
        console.error(err);
        alert('Error cargando formulario');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: Partial<Formulario>) => {
    if (!id) return;
    try {
      await formularioService.update(Number(id), data);
      alert('Formulario actualizado');
      navigate('/formularios');
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Editar Formulario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Nombres y apellidos</label>
          <input {...register('nombres_apellidos' as any, { required: 'Nombre requerido' })} />
          {errors?.nombres_apellidos && <small style={{ color: 'red' }}>{(errors as any).nombres_apellidos?.message}</small>}
        </div>

        <div className="form-field">
          <label>DNI</label>
          <input {...register('dni' as any)} />
        </div>

        <div className="form-field">
          <label>RUC</label>
          <input {...register('ruc' as any)} />
        </div>

        <div className="form-field">
          <label>Celular</label>
          <input {...register('celular' as any)} />
        </div>

        <div className="form-field">
          <label>Dirección</label>
          <input {...register('direccion' as any)} />
        </div>

        <div className="form-field">
          <label>Asociación</label>
          <input {...register('asociacion' as any)} />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <label><input type="checkbox" {...register('propiedad' as any)} /> Propiedad</label>
          <label><input type="checkbox" {...register('titulo' as any)} /> Título</label>
          <label><input type="checkbox" {...register('reg_publico' as any)} /> Registro público</label>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Charlas</label>
          <select {...register('charlas' as any)}>
            <option value="virtual">virtual</option>
            <option value="presencial">presencial</option>
            <option value="ninguno">ninguno</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Actualizar</button>
          <button type="button" className="btn" onClick={() => navigate('/formularios')} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
