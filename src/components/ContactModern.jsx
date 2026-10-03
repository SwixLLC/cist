import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactModern = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('contact.nameError');
    if (!formData.email.trim()) {
      errors.email = t('contact.emailError');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('contact.emailInvalid');
    }
    if (formData.phone && !/^[+\d\s\-().]{7,20}$/.test(formData.phone)) {
      errors.phone = t('contact.phoneInvalid');
    }
    if (!formData.subject) errors.subject = t('contact.subjectError');
    if (!formData.message.trim()) errors.message = t('contact.messageError');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    setIsSubmitting(true);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        form_type: 'Contact Form',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'N/A',
        subject: formData.subject,
        message: formData.message,
        to_email: 'archsudo@gmail.com',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      })
      .catch(() => {
        setIsSubmitting(false);
        setSubmitError(t('contact.errorMsg'));
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.addressLabel'),
      content: ['Route du Charf, Km 5', 'Tangier 90000, Morocco'],
      color: '#D32F2F',
    },
    {
      icon: Phone,
      title: t('contact.phoneLabel'),
      content: ['+212 80 857 0841'],
      color: '#4ECDC4',
    },
    {
      icon: Mail,
      title: t('contact.emailLabel'),
      content: ['contact@cist.ma'],
      color: '#667eea',
    },
    {
      icon: Clock,
      title: t('contact.hoursLabel'),
      content: [t('contact.hours1'), t('contact.hours2')],
      color: '#F7B731',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/cis.ac.ma/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/cis_tangier/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://ma.linkedin.com/company/canadian-international-school-of-tangier', label: 'LinkedIn' },
  ];

  return (
    <section id="contact" style={{ padding: '6rem 0', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out',
        }}>
          <span style={{
            color: '#D32F2F',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            {t('contact.label')}
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '1rem 0',
            fontFamily: 'Playfair Display, serif',
          }}>
            {t('contact.title')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}>
          {contactInfo.map((info, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease-out ${index * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: info.color,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: 'white',
              }}>
                <info.icon size={28} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: '#1a1a1a',
              }}>
                {info.title}
              </h3>
              {info.content.map((line, i) => (
                <p key={i} style={{ color: '#666', marginBottom: '0.25rem' }}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Form */}
          <div style={{
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s ease-out 0.4s',
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: '#1a1a1a',
            }}>
              {t('contact.formTitle')}
            </h3>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              {t('contact.formSubtitle')}
            </p>

            {isSubmitted ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                textAlign: 'center',
              }}>
                <CheckCircle size={60} color="#4CAF50" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('contact.successTitle')}</h4>
                <p style={{ color: '#666' }}>{t('contact.successMsg')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-invalid={!!validationErrors.name}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: `2px solid ${validationErrors.name ? '#D32F2F' : '#e0e0e0'}`,
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D32F2F'}
                      onBlur={(e) => e.target.style.borderColor = validationErrors.name ? '#D32F2F' : '#e0e0e0'}
                    />
                    {validationErrors.name && <p style={{ color: '#D32F2F', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                      {t('contact.emailFieldLabel')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-invalid={!!validationErrors.email}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: `2px solid ${validationErrors.email ? '#D32F2F' : '#e0e0e0'}`,
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D32F2F'}
                      onBlur={(e) => e.target.style.borderColor = validationErrors.email ? '#D32F2F' : '#e0e0e0'}
                    />
                    {validationErrors.email && <p style={{ color: '#D32F2F', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.email}</p>}
                  </div>
                </div>

                <div className="form-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                      {t('contact.phoneFieldLabel')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={!!validationErrors.phone}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: `2px solid ${validationErrors.phone ? '#D32F2F' : '#e0e0e0'}`,
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D32F2F'}
                      onBlur={(e) => e.target.style.borderColor = validationErrors.phone ? '#D32F2F' : '#e0e0e0'}
                    />
                    {validationErrors.phone && <p style={{ color: '#D32F2F', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.phone}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                      {t('contact.subjectLabel')}
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">{t('contact.subjectDefault')}</option>
                      <option value="admissions">{t('contact.admissions')}</option>
                      <option value="general">{t('contact.general')}</option>
                      <option value="visit">{t('contact.visit')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '12px',
                      border: '2px solid #e0e0e0',
                      fontSize: '1rem',
                      resize: 'vertical',
                      transition: 'all 0.3s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D32F2F'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {submitError && (
                  <p role="alert" style={{ color: '#D32F2F', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: isSubmitting ? '#ccc' : '#D32F2F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
            padding: '2.5rem',
            borderRadius: '24px',
            color: 'white',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.8s ease-out 0.5s',
          }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              {t('contact.whyTitle')}
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
              {[
                t('contact.why1'),
                t('contact.why2'),
                t('contact.why3'),
                t('contact.why4'),
                t('contact.why5'),
                t('contact.why6'),
              ].map((item, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0',
                }}>
                  <CheckCircle size={20} />
                  {item}
                </li>
              ))}
            </ul>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              {t('contact.followUs')}
            </h4>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#D32F2F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactModern;
