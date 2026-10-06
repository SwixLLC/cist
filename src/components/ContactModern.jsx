import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSite, telHref } from '../lib/siteContent';

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

const ContactModern = () => {
  const { t } = useTranslation();
  const { settings } = useSite();
  const socialLinks = [
    { icon: Facebook, href: settings.facebookUrl, label: 'Facebook' },
    { icon: Instagram, href: settings.instagramUrl, label: 'Instagram' },
    { icon: Linkedin, href: settings.linkedinUrl, label: 'LinkedIn' },
  ];
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const nameRef = useRef(null);

  // "Book a tour" elsewhere on the page pre-selects the visit subject
  useEffect(() => {
    const onPrefill = (e) => {
      setIsSubmitted(false);
      setFormData((f) => ({ ...f, subject: e.detail }));
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 600);
    };
    window.addEventListener('cist:prefill-subject', onPrefill);
    return () => window.removeEventListener('cist:prefill-subject', onPrefill);
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
        setFormData(EMPTY_FORM);
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

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    className: 'lp-input',
    'aria-invalid': !!validationErrors[name],
    'aria-describedby': validationErrors[name] ? `contact-${name}-error` : undefined,
  });

  const errorFor = (name) => validationErrors[name] && (
    <span id={`contact-${name}-error`} className="lp-field__error">{validationErrors[name]}</span>
  );

  return (
    <section id="contact" className="lp-section">
      <div className="container">
        <header className="lp-head">
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
        </header>

        <div className="lp-contact">
          <div>
            <ul className="lp-info">
              <li>
                <span className="lp-info__icon"><MapPin size={20} aria-hidden="true" /></span>
                <strong>{t('contact.addressLabel')}</strong>
                <a href="#map-section">{settings.addressLine1}<br />{settings.addressLine2}</a>
              </li>
              <li>
                <span className="lp-info__icon"><Phone size={20} aria-hidden="true" /></span>
                <strong>{t('contact.phoneLabel')}</strong>
                <a href={telHref(settings.phone)}>{settings.phone}</a>
              </li>
              <li>
                <span className="lp-info__icon"><Mail size={20} aria-hidden="true" /></span>
                <strong>{t('contact.emailLabel')}</strong>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>
                <span className="lp-info__icon"><Clock size={20} aria-hidden="true" /></span>
                <strong>{t('contact.hoursLabel')}</strong>
                <span>{t('contact.hours1')}<br />{t('contact.hours2')}</span>
              </li>
            </ul>

            <div className="lp-social">
              <span>{t('contact.followUs')}</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>

          <div className="lp-form-card">
            <h3>{t('contact.formTitle')}</h3>
            <p>{t('contact.formSubtitle')}</p>

            {isSubmitted ? (
              <div className="lp-success" role="status">
                <CheckCircle size={52} aria-hidden="true" />
                <h4>{t('contact.successTitle')}</h4>
                <p>{t('contact.successMsg')}</p>
              </div>
            ) : (
              <form className="lp-form" onSubmit={handleSubmit} noValidate>
                <div className="lp-form__row">
                  <div className="lp-field">
                    <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
                    <input type="text" autoComplete="name" required ref={nameRef} {...fieldProps('name')} />
                    {errorFor('name')}
                  </div>
                  <div className="lp-field">
                    <label htmlFor="contact-email">{t('contact.emailFieldLabel')}</label>
                    <input type="email" autoComplete="email" required {...fieldProps('email')} />
                    {errorFor('email')}
                  </div>
                </div>

                <div className="lp-form__row">
                  <div className="lp-field">
                    <label htmlFor="contact-phone">{t('contact.phoneFieldLabel')}</label>
                    <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
                    {errorFor('phone')}
                  </div>
                  <div className="lp-field">
                    <label htmlFor="contact-subject">{t('contact.subjectLabel')}</label>
                    <select required {...fieldProps('subject')}>
                      <option value="">{t('contact.subjectDefault')}</option>
                      <option value="admissions">{t('contact.admissions')}</option>
                      <option value="general">{t('contact.general')}</option>
                      <option value="visit">{t('contact.visit')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                    {errorFor('subject')}
                  </div>
                </div>

                <div className="lp-field">
                  <label htmlFor="contact-message">{t('contact.messageLabel')}</label>
                  <textarea rows={5} required {...fieldProps('message')} />
                  {errorFor('message')}
                </div>

                {submitError && <p role="alert" className="lp-form__alert">{submitError}</p>}

                <button type="submit" className="lp-btn lp-btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactModern;
