import React, { useState } from 'react';
import { GraduationCap, Facebook, Instagram, Linkedin, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSite, telHref } from '../lib/siteContent';

const FooterModern = () => {
  const { t } = useTranslation();
  const { images, settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.slice(1);
      if (isHomePage) {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
    }
  };
  const [logoError, setLogoError] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    [t('footer.quickLinks')]: [
      { name: t('footer.about'), href: '#about' },
      { name: t('footer.academics'), href: '#academics' },
      { name: t('footer.admissions'), href: '#admissions' },
      { name: t('footer.campus'), href: '#campus-life' },
      { name: t('footer.news'), href: '#news' },
      { name: t('footer.contact'), href: '#contact' },
    ],
    [t('footer.contact')]: [
      { name: settings.addressLine1, href: '#map-section' },
      { name: settings.addressLine2, href: '#map-section' },
      { name: settings.phone, href: telHref(settings.phone) },
      { name: settings.email, href: `mailto:${settings.email}` },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: settings.facebookUrl, label: 'Facebook' },
    { icon: Instagram, href: settings.instagramUrl, label: 'Instagram' },
    { icon: Linkedin, href: settings.linkedinUrl, label: 'LinkedIn' },
  ];

  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
      {/* Main Footer */}
      <div style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}>
            {/* Brand Column */}
            <div className="footer-brand-col" style={{ gridColumn: 'span 2' }}>
              {/* Logo Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                {/* Logo Image */}
                {!logoError ? (
                  <img
                    src={images.logo}
                    alt="CIST logo"
                    style={{
                      height: 'clamp(56px, 10vw, 90px)',
                      width: 'clamp(100px, 18vw, 160px)',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: 'clamp(100px, 18vw, 160px)',
                      height: 'clamp(56px, 10vw, 90px)',
                      backgroundColor: 'var(--canadian-red)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GraduationCap size={36} color="white" />
                  </div>
                )}
                {/* Text under logo */}
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>CIST</h3>
                  <p style={{ fontSize: '1rem', color: '#888', margin: '0.25rem 0 0 0' }}>Canadian International School Tangier</p>
                </div>
              </div>

              <p style={{
                color: '#888',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                maxWidth: '300px',
              }}>
                {t('footer.tagline')}
              </p>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#2a2a2a',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#888',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--canadian-red)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                      e.currentTarget.style.color = '#888';
                    }}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'white',
                }}>
                  {title}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {links.map((link, index) => {
                    const isInternal = link.href.startsWith('/');
                    
                    const commonStyle = {
                      display: 'inline-block',
                      padding: '6px 0',
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s',
                    };
                    
                    const handleMouseEnter = (e) => e.target.style.color = 'var(--canadian-red)';
                    const handleMouseLeave = (e) => e.target.style.color = '#888';

                    if (isInternal) {
                      return (
                        <li key={index}>
                          <Link
                            to={link.href}
                            style={commonStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={index}>
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          style={commonStyle}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {link.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid #2a2a2a',
        padding: '1.5rem 0',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <p style={{ color: '#a3a3a3', fontSize: '0.85rem', margin: 0 }}>
              © {new Date().getFullYear()} {t('footer.rights')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link
                to="/privacy"
                style={{ display: 'inline-block', padding: '10px 0', color: '#a3a3a3', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--canadian-red)'}
                onMouseLeave={(e) => e.target.style.color = '#a3a3a3'}
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                style={{ display: 'inline-block', padding: '10px 0', color: '#a3a3a3', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--canadian-red)'}
                onMouseLeave={(e) => e.target.style.color = '#a3a3a3'}
              >
                {t('footer.terms')}
              </Link>
              
              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--canadian-red)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px color-mix(in srgb, var(--canadian-red) 40%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <ChevronUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterModern;
