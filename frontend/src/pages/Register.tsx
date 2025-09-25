import React from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/users.shared.css';

type Form = { name: string; email: string; password: string; password_confirmation?: string; rol?: string };

export default function Register(): JSX.Element {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Form>();
  const pw = watch('password');

  const onSubmit = async (data: Form) => {
    try {
      // incluir password_confirmation por compatibilidad (muchos backends lo esperan)
      const payload = { ...data, password_confirmation: data.password };
      await authService.register(payload);
      alert('Registro exitoso. Ahora inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      console.error('register error', err);
      const msg = err?.response?.data?.message
        || (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null)
        || 'Error en registro';
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" role="main" aria-labelledby="registerTitle">
        <div className="auth-header">
          <h2 id="registerTitle" className="auth-title">Registro</h2>
          <div className="auth-subtitle">Crea tu cuenta para acceder al sistema</div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" {...register('name', { required: 'Nombre requerido' })} />
            {errors.name && <small className="field-error">{errors.name.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email', { required: 'Email requerido' })} />
            {errors.email && <small className="field-error">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" {...register('password', { required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' }})} />
            {errors.password && <small className="field-error">{errors.password.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password_confirmation">Confirmar contraseña</label>
            <input id="password_confirmation" type="password" {...register('password_confirmation', { validate: val => val === pw || 'Las contraseñas no coinciden' })} />
            {errors.password_confirmation && <small className="field-error">{errors.password_confirmation.message}</small>}
          </div>

          <div className="auth-actions">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Registrar</button>
            <Link to="/login" className="btn btn-outline">Ir a login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


