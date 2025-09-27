// src/components/WhatsAppButton.tsx
import React from 'react';

type Props = {
  inviteUrl?: string; // URL de invitación al grupo WhatsApp (chat.whatsapp.com/...)
  label?: string;
};

export default function WhatsAppButton({
  inviteUrl = 'https://chat.whatsapp.com/KfDBeR4z8H49yDN1NjLHEq?mode=ems_share_t',
  label = 'Chat comunitario'
}: Props): JSX.Element {
  return (
    <a
      href={inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label={`Abrir ${label} en WhatsApp`}
      title={label}
    >
      {/* Icono SVG (WhatsApp) */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
        <path fill="currentColor" d="M20.52 3.48A11.92 11.92 0 0 0 12 .5C6.13.5 1.5 5.13 1.5 11 1.5 13.46 2.33 15.77 3.78 17.69L2 21l3.41-1.09A11.9 11.9 0 0 0 12 22.5c5.87 0 10.5-4.63 10.5-10.5 0-2.83-1.09-5.45-2.0-7.52zM12 20c-1.46 0-2.89-.38-4.16-1.1l-.3-.17L6 19l.3-1.05-.2-.33A8.5 8.5 0 0 1 3.5 11c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5S16.7 20 12 20z"/>
        <path fill="currentColor" d="M17.2 14.1c-.3-.15-1.7-.85-1.9-.95-.2-.1-.4-.15-.6.15-.2.3-.7.95-.9 1.15-.2.2-.4.25-.7.1-1.3-.65-2.2-1.17-3.1-2.7-.2-.35.2-.33.6-1.08.1-.25 0-.45-.05-.6-.05-.15-.6-1.4-.85-1.9-.22-.45-.45-.4-.6-.4-.15 0-.32 0-.5 0-.2 0-.5.07-.75.35-.25.29-.95.94-.95 2.3 0 1.36.98 2.7 1.1 2.9.13.2 1.9 3 4.6 4.1 3 .95 3.3.9 3.6.85.3-.05 1.7-.7 1.9-1.4.2-.7.2-1.35.15-1.45-.05-.1-.2-.15-.45-.27z"/>
      </svg>

      <span className="whatsapp-fab-label">WhatsApp</span>
    </a>
  );
}
