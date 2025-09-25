import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/users.shared.css';

type Form = { email: string; password: string };

export default function Login(): JSX.Element {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      // AuthContext refresca el perfil; luego navegamos
      navigate('/dashboard');
    } catch (err: any) {
      console.error('login error', err);
      const msg = err?.response?.data?.message || 'Error en login';
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" role="main" aria-labelledby="loginTitle">
        <div className="auth-header">
          <h2 id="loginTitle" className="auth-title">Iniciar sesión</h2>
          <div className="auth-subtitle">Ingresa con tus credenciales</div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email', { required: 'Email requerido' })} />
            {errors.email && <small className="field-error">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" {...register('password', { required: 'Contraseña requerida' })} />
            {errors.password && <small className="field-error">{errors.password.message}</small>}
          </div>

          <div className="auth-actions">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? 'Cargando...' : 'Entrar'}
            </button>
            <Link to="/register" className="btn btn-outline">Registrarse</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

