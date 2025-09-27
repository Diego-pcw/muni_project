// src/components/HeroSection.tsx
import React from 'react';

interface HeroSectionProps {
  backgroundImage?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  className?: string;
}

export default function HeroSection({
  backgroundImage,
  title,
  subtitle,
  children,
  className = ''
}: HeroSectionProps): JSX.Element {
  // patrón SVG simple y seguro (escapado). Si quieres otro patrón, reemplaza aquí.
  const patternSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'>
      <g fill='none' fill-rule='evenodd'>
        <g fill='%23ffffff' fill-opacity='0.18'>
          <circle cx='30' cy='30' r='2'/>
        </g>
      </g>
    </svg>`
  );

  const bgStyle: React.CSSProperties = {
    position: 'relative',
    background: backgroundImage
      ? `linear-gradient(rgba(27, 36, 49, 0.65), rgba(82, 183, 230, 0.77)), url(${backgroundImage})`
      : 'linear-gradient(135deg, var(--primary-blue), var(--secondary-blue))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    /* NOTE: fixed causes problems on mobile — we keep scroll by default and override on large screens */
    backgroundAttachment: 'scroll',
    color: 'white',
    padding: '80px 32px',
    textAlign: 'center',
    overflow: 'hidden'
  };

  return (
    <section className={`hero-section ${className}`} style={bgStyle}>
      {/* Patrón decorativo con data-url SVG */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,${patternSvg}")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 64, marginBottom: 20, textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
          🐔
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 48px)',
          fontWeight: 800,
          marginBottom: 12,
          textShadow: '0 2px 6px rgba(0,0,0,0.35)',
          lineHeight: 1.15
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2.6vw, 20px)',
          marginBottom: 22,
          opacity: 0.95,
          lineHeight: 1.6,
          textShadow: '0 1px 2px rgba(0,0,0,0.25)'
        }}>
          {subtitle}
        </p>

        {children}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 20,
          marginTop: 40,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {[
            { value: '500+', label: 'Beneficiados' }, //se puede agregar mas
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, opacity: 0.95 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        animation: 'hero-bounce 2s infinite'
      }}>
        <div style={{
          width: 22,
          height: 22,
          border: '2px solid rgba(255,255,255,0.9)',
          borderTop: 'none',
          borderLeft: 'none',
          transform: 'rotate(45deg)'
        }}/>
      </div>

      <style>{`
        @keyframes hero-bounce {
          0%,20%,50%,80%,100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-8px); }
          60% { transform: translateX(-50%) translateY(-4px); }
        }

        /* large screens: allow parallax-like fixed background (optional) */
        @media (min-width: 1200px) {
          .hero-section { background-attachment: fixed; }
        }

        /* mobile safety: force scroll for background & reduced padding */
        @media (max-width: 768px) {
          .hero-section { background-attachment: scroll !important; padding: 56px 18px; }
        }
      `}</style>
    </section>
  );
}
