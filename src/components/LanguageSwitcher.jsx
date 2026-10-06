import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English',  img: 'https://flagcdn.com/w40/gb.png' },
  { code: 'fr', name: 'Français', img: 'https://flagcdn.com/w40/fr.png' },
  { code: 'es', name: 'Español',  img: 'https://flagcdn.com/w40/es.png' },
];

const Flag = ({ src, name, size = 22 }) => (
  <img
    src={src}
    alt={name}
    width={size}
    height={Math.round(size * 0.67)}
    style={{ borderRadius: '3px', objectFit: 'cover', display: 'block', flexShrink: 0 }}
  />
);

const LanguageSwitcher = ({ scrolled }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = languages.find(l => l.code === i18n.language) || languages[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('cist-lang', code);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${current.name}`}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: scrolled ? '#f5f5f5' : 'rgba(255,255,255,0.15)',
          border: scrolled ? '1px solid #e0e0e0' : '1px solid rgba(255,255,255,0.3)',
          minHeight: '40px',
          padding: '0 0.7rem',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: scrolled ? '#333' : '#fff',
        }}
      >
        <Flag src={current.img} name={current.name} size={22} />
        <ChevronDown size={14} style={{ opacity: 0.75 }} aria-hidden="true" />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            zIndex: 1000,
            minWidth: '145px',
          }}>
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  width: '100%',
                  padding: '0.6rem 1rem',
                  background: i18n.language === lang.code ? 'var(--canadian-red-wash)' : 'transparent',
                  border: 'none',
                  color: i18n.language === lang.code ? 'var(--canadian-red)' : '#333',
                  fontWeight: i18n.language === lang.code ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (i18n.language !== lang.code) e.currentTarget.style.background = '#f9f9f9'; }}
                onMouseLeave={e => { if (i18n.language !== lang.code) e.currentTarget.style.background = 'transparent'; }}
              >
                <Flag src={lang.img} name={lang.name} size={22} />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
