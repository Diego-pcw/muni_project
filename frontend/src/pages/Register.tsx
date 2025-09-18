// src/pages/Register.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';

type Form = { name: string; email: string; password: string; password_confirmation?: string; rol?: string };

export default function Register(): JSX.Element {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Form>();
  const pw = watch('password');

  const onSubmit = async (data: Form) => {
    try {
      // incluye password_confirmation si no lo envía el backend, opcional
      const payload = { ...data, password_confirmation: data.password };
      await authService.register(payload);
      alert('Registro exitoso. Ahora inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      console.error('register error', err);
      alert(err?.response?.data?.message || JSON.stringify(err?.response?.data) || 'Error en registro');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Nombre</label>
          <input {...register('name', { required: 'Nombre requerido' })} />
          {errors.name && <small style={{ color: 'red' }}>{errors.name.message}</small>}
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" {...register('email', { required: 'Email requerido' })} />
          {errors.email && <small style={{ color: 'red' }}>{errors.email.message}</small>}
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" {...register('password', { required: 'Contraseña requerida', minLength: 6 })} />
          {errors.password && <small style={{ color: 'red' }}>{errors.password.message}</small>}
        </div>

        <div className="form-field">
          <label>Confirmar contraseña</label>
          <input type="password" {...register('password_confirmation', { validate: val => val === pw || 'Las contraseñas no coinciden' })} />
          {errors.password_confirmation && <small style={{ color: 'red' }}>{errors.password_confirmation.message}</small>}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Registrar</button>
          <Link to="/login" style={{ marginLeft: 8 }} className="btn">Ir a login</Link>
        </div>
      </form>
    </div>
  );
}
