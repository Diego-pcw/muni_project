import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
