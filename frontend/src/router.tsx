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
import FormularioDetail from './pages/Formularios/FormularioDetail';

import ComunicadosList from './pages/Comunicados/ComunicadosList';
import ComunicadoCreate from './pages/Comunicados/ComunicadoCreate';
import ComunicadoEdit from './pages/Comunicados/ComunicadoEdit';
import ComunicadoDetail from './pages/Comunicados/ComunicadoDetail';

import { ProtectedRoute } from './components/ProtectedRoute';
import UserHome from './pages/UserHome';

export default function Router() {
  return (
    <Routes>
      {/* Public auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout wrapper: header/footer etc. Layout must render <Outlet /> */}
      <Route element={<Layout />}>
        {/* Public home */}
        <Route path="/" element={<UserHome />} />

        {/* Public listing and reading */}
        <Route path="/comunicados" element={<ComunicadosList />} />
        <Route path="/comunicados/:id" element={<ComunicadoDetail />} />

        <Route path="/formularios" element={<FormulariosList />} />
        <Route path="/formularios/create" element={<FormularioCreate />} /> {/* public: anyone can create */}
        <Route path="/formularios/:id" element={<FormularioDetail />} />   {/* public detail reading (will 403 if backend denies) */}

        {/* Authenticated routes (any logged user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          {/* If you want clients to edit their own form, protect edit with ProtectedRoute (no role), backend will enforce ownership */}
          <Route path="/formularios/:id/edit" element={<FormularioEdit />} />
        </Route>

        {/* Admin-only routes (explicit admin) */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/comunicados/create" element={<ComunicadoCreate />} />
          <Route path="/comunicados/:id/edit" element={<ComunicadoEdit />} />
          {/* Admin may also want a different edit route for formularios; keep same /formularios/:id/edit as above */}
        </Route>
      </Route>

      {/* Fallback: redirect to public home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

