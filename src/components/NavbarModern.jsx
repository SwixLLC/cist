import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useSite } from '../lib/siteContent';

const NavbarModern = ({ scrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { images } = useSite();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoError, setLogoError] = useState(false);

  const navItems = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.academics'), href: '#academics' },
    { name: t('nav.campus'), href: '#campus-life' },
    { name: t('nav.news'), href: '#news' },
    { name: t('nav.admissions'), href: '#admissions' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'academics', 'campus-life', 'news', 'admissions', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    const sectionId = href.slice(1);
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? '#ffffff' : 'transparent',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
      padding: scrolled ? '0' : '0.125rem 0',
      transition: 'all 0.3s ease',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
            role="link"
            aria-label="Go to home page"
          >
            {!logoError ? (
              <img
                src={images.logo}
                alt="CIST"
                style={{
                  height: 'clamp(56px, 10vw, 90px)',
                  width: 'clamp(100px, 18vw, 160px)',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '8px',
                }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div
                style={{
                  width: 'clamp(100px, 18vw, 160px)',
                  height: 'clamp(56px, 10vw, 90px)',
                  background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
              >
                <GraduationCap size={36} color="white" />
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.25rem',
          }} className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                style={{
                  color: activeSection === item.href.slice(1) ? '#D32F2F' : scrolled ? '#333' : '#fff',
                  fontWeight: activeSection === item.href.slice(1) ? 600 : 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.href.slice(1)) {
                    e.target.style.backgroundColor = scrolled ? '#f5f5f5' : 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {item.name}
              </button>
            ))}
            <LanguageSwitcher scrolled={scrolled} />
            <button
              onClick={() => navigate('/enroll')}
              style={{
                background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                color: '#fff',
                padding: '0.6rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: '0.5rem',
                boxShadow: '0 4px 15px rgba(211,47,47,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(211,47,47,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(211,47,47,0.3)';
              }}
            >
              {t('nav.register')}
            </button>
          </div>

          {/* Mobile: Language + Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-menu-btn">
            <LanguageSwitcher scrolled={scrolled} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: scrolled ? '#f5f5f5' : 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
                color: scrolled ? '#333' : '#fff',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: '16px',
            marginTop: '1rem',
            padding: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          }} className="mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                style={{
                  padding: '0.875rem 1rem',
                  textAlign: 'left',
                  background: activeSection === item.href.slice(1) ? '#FFF5F5' : 'transparent',
                  border: 'none',
                  fontSize: '1rem',
                  color: activeSection === item.href.slice(1) ? '#D32F2F' : '#333',
                  fontWeight: activeSection === item.href.slice(1) ? 600 : 500,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  marginBottom: '0.25rem',
                }}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/enroll');
                setIsMenuOpen(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                color: '#fff',
                padding: '0.875rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {t('nav.register')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarModern;
