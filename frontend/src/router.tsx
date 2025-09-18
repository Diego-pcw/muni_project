// src/router.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard'; // admin dashboard
import Layout from './components/Layout';

import FormulariosList from './pages/Formularios/FormulariosList';
import FormularioCreate from './pages/Formularios/FormularioCreate';
import FormularioEdit from './pages/Formularios/FormularioEdit';

import ComunicadosList from './pages/Comunicados/ComunicadosList';
import ComunicadoCreate from './pages/Comunicados/ComunicadoCreate';
import ComunicadoEdit from './pages/Comunicados/ComunicadoEdit';

import { ProtectedRoute } from './components/ProtectedRoute';
import UserHome from './pages/UserHome';

export default function Router() {
  return (
    <Routes>
      {/* Public auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout wrapper (Header + Outlet) */}
      <Route element={<Layout />}>
        {/* Public home */}
        <Route path="/" element={<UserHome />} />

        {/* Public reading routes (accessible to anyone) */}
        <Route path="/comunicados" element={<ComunicadosList />} />
        <Route path="/comunicados/:id" element={<ComunicadoEdit />} /> {/* si quieres vista pública usa otro componente */}
        <Route path="/formularios" element={<FormulariosList />} />
        <Route path="/formularios/create" element={<FormularioCreate />} /> {/* público: registrar formulario */}

        {/* Routes that require authentication (any user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/comunicados/create" element={<ComunicadoCreate />} />
          <Route path="/comunicados/:id/edit" element={<ComunicadoEdit />} />
          <Route path="/formularios/:id" element={<FormularioEdit />} />
        </Route>
      </Route>

      {/* Fallback: redirect to public home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
