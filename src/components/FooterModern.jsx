import React, { useState } from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, ArrowRight, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const FooterModern = () => {
  const { t } = useTranslation();
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
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    [t('footer.quickLinks')]: [
      { name: t('footer.about'), href: '#about' },
      { name: t('footer.academics'), href: '#academics' },
      { name: t('footer.admissions'), href: '/enroll' },
      { name: t('footer.campus'), href: '#campus-life' },
      { name: t('footer.news'), href: '#news' },
      { name: t('footer.contact'), href: '#contact' },
    ],
    [t('footer.contact')]: [
      { name: 'Route du Charf, Km 5', href: '#map-section' },
      { name: 'Tangier 90000, Morocco', href: '#map-section' },
      { name: '+212 665-696565', href: 'tel:+212665696565' },
      { name: 'contact@cist.ma', href: 'mailto:contact@cist.ma' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/cis.ac.ma/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/cis_tangier/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://ma.linkedin.com/company/canadian-international-school-of-tangier', label: 'LinkedIn' },
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
                    src="/images/logo.webp"
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
                      backgroundColor: '#D32F2F',
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
                      e.currentTarget.style.backgroundColor = '#D32F2F';
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
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s',
                    };
                    
                    const handleMouseEnter = (e) => e.target.style.color = '#D32F2F';
                    const handleMouseLeave = (e) => e.target.style.color = '#888';

                    if (isInternal) {
                      return (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
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
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
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

          {/* Newsletter */}
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: '#2a2a2a',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {t('footer.newsletter')}
              </h4>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                {t('footer.newsletterDesc')}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="footer-newsletter-form" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888',
                }} />
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="footer-newsletter-input"
                  style={{
                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    width: '100%',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: isSubscribed ? '#4CAF50' : '#D32F2F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {isSubscribed ? t('footer.subscribed') : t('footer.subscribe')}
                <ArrowRight size={18} />
              </button>
            </form>
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
            <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
              © {new Date().getFullYear()} {t('footer.rights')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link
                to="/privacy"
                style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#D32F2F'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = '#D32F2F'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                {t('footer.terms')}
              </Link>
              
              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#D32F2F',
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
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(211,47,47,0.4)';
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
