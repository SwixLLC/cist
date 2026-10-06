import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowLeft, CheckCircle, User, Phone, Mail, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NavbarModern from '../components/NavbarModern';
import FooterModern from '../components/FooterModern';
import WhatsAppButton from '../components/WhatsAppButton';

const EnrollmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: '',
    gradeApplying: '',
    parentName: '',
    phone: '',
    whatsapp: '',
    email: ''
  });

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        form_type: 'Pre-Registration',
        student_name: formData.studentName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        grade_applying: formData.gradeApplying,
        parent_name: formData.parentName,
        phone: formData.phone,
        whatsapp: formData.whatsapp || 'N/A',
        from_email: formData.email,
        to_email: 'archsudo@gmail.com',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitError(t('enrollment.errorMsg'));
      });
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a1a' }}>
            {t('enrollment.successTitle')}
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
            {t('enrollment.successMsg')}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, var(--canadian-red) 0%, var(--canadian-red-dark) 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft size={20} />
            {t('enrollment.returnHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <NavbarModern scrolled={true} />
      
      {/* Header - with margin to clear navbar (logo is 100px tall) */}
      <div style={{
        background: 'linear-gradient(135deg, var(--canadian-red) 0%, var(--canadian-red-dark) 100%)',
        color: 'white',
        padding: '2rem 0',
        marginTop: '100px'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
                {t('enrollment.title')}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>
                {t('enrollment.school')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Form */}
      <div className="container" style={{ padding: '5rem 1rem 3rem', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={24} color="var(--canadian-red)" />
              {t('enrollment.studentInfo')}
            </h2>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-studentName">
                  {t('enrollment.fullName')}
                </label>
                <input
                  id="enroll-studentName"
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                  placeholder={t('enrollment.namePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-dateOfBirth">
                    {t('enrollment.dob')}
                  </label>
                  <input
                  id="enroll-dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-gender">
                    {t('enrollment.gender')}
                  </label>
                  <select
                  id="enroll-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">{t('enrollment.selectGender')}</option>
                    <option value="male">{t('enrollment.male')}</option>
                    <option value="female">{t('enrollment.female')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-gradeApplying">
                  {t('enrollment.grade')}
                </label>
                <select
                  id="enroll-gradeApplying"
                  name="gradeApplying"
                  value={formData.gradeApplying}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">{t('enrollment.selectGrade')}</option>
                  <option value="kindergarten">Kindergarten</option>
                  <option value="grade1">Grade 1</option>
                  <option value="grade2">Grade 2</option>
                  <option value="grade3">Grade 3</option>
                  <option value="grade4">Grade 4</option>
                  <option value="grade5">Grade 5</option>
                  <option value="grade6">Grade 6</option>
                  <option value="grade7">Grade 7</option>
                  <option value="grade8">Grade 8</option>
                  <option value="grade9">Grade 9</option>
                  <option value="grade10">Grade 10</option>
                  <option value="grade11">Grade 11</option>
                  <option value="grade12">Grade 12</option>
                </select>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={24} color="var(--canadian-red)" />
              {t('enrollment.parentInfo')}
            </h2>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-parentName">
                  {t('enrollment.parentName')}
                </label>
                <input
                  id="enroll-parentName"
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  placeholder={t('enrollment.parentPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-phone">
                    <Phone size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    {t('enrollment.phone')}
                  </label>
                  <input
                  id="enroll-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder={t('enrollment.phonePlaceholder')}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-whatsapp">
                    {t('enrollment.whatsapp')}
                  </label>
                  <input
                  id="enroll-whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder={t('enrollment.whatsappPlaceholder')}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }} htmlFor="enroll-email">
                  <Mail size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {t('enrollment.emailLabel')}
                </label>
                <input
                  id="enroll-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t('enrollment.emailPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="agreement"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  required
                  style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--canadian-red)' }}
                />
                <span style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.5 }}>
                  {t('enrollment.agreementText')}{' '}
                  <a
                    href="/pdfs/parent-school-agreement.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--canadian-red)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                  >
                    <FileText size={14} />
                    {t('enrollment.agreementLink')}
                  </a>
                  {' '}{t('enrollment.agreementEnd')}
                </span>
              </label>
            </div>

            {submitError && (
              <p role="alert" style={{ color: 'var(--canadian-red)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="hv-lift"
              disabled={!agreementChecked}
              style={{
                width: '100%',
                background: agreementChecked 
                  ? 'linear-gradient(135deg, var(--canadian-red) 0%, var(--canadian-red-dark) 100%)' 
                  : 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: agreementChecked ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: agreementChecked ? 1 : 0.6
              }}
            >
              {t('enrollment.submit')}
            </button>
          </div>
        </form>
      </div>

      <WhatsAppButton />
      
      <FooterModern />
    </div>
  );
};

export default EnrollmentPage;