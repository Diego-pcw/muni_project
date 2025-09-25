// src/pages/DebugServices.tsx
/** 
import React from 'react';
import { authService } from '../services/auth.service';
import { formularioService } from '../services/formulario.service';

export default function DebugServices() {
  const testLogin = async () => {
    try {
      const res = await authService.login('admin@demo.com', 'admin123');
      console.log('login res', res.data);
      localStorage.setItem('token', res.data.token);
      alert('token guardado en localStorage');
    } catch (err) {
      console.error(err);
      alert('Error en login (ver consola)');
    }
  };

  const testCreateForm = async () => {
    try {
      const payload = {
        nombres_apellidos: 'Prueba Test',
        dni: '12345678',
        celular: '999999999',
        direccion: 'Calle prueba 123',
        propiedad: false,
        titulo: false,
        reg_publico: false,
        charlas: 'ninguno',
      };
      const res = await formularioService.create(payload);
      console.log('create formulario', res.data);
      alert('Formulario creado: ' + JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      alert('Error creando formulario (ver consola)');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Debug Services</h2>
      <button onClick={testLogin}>Probar Login (admin@demo.com)</button>
      <button onClick={testCreateForm} style={{ marginLeft: 8 }}>
        Probar Crear Formulario
      </button>
      <p>⚡ Después de login, revisa en DevTools → Application → Local Storage → token.</p>
    </div>
  );
}
*/