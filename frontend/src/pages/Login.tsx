// src/pages/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    <div style={{ padding: 20, maxWidth: 520, margin: '0 auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Email</label>
          <input type="email" {...register('email', { required: 'Email requerido' })} />
          {errors.email && <small style={{ color: 'red' }}>{errors.email.message}</small>}
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" {...register('password', { required: 'Contraseña requerida' })} />
          {errors.password && <small style={{ color: 'red' }}>{errors.password.message}</small>}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Cargando...' : 'Entrar'}
          </button>
          <Link to="/register" style={{ marginLeft: 8 }} className="btn">Registrarse</Link>
        </div>
      </form>
    </div>
  );
}

