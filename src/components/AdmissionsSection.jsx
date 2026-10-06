import React from 'react';
import { ArrowRight, Check, MessageCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSite, telHref, whatsappHref } from '../lib/siteContent';

const AdmissionsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSite();

  // why3 (class ratio) and why6 (university acceptance) are left out until the figures are confirmed
  const reasons = [1, 2, 4, 5].map((n) => t(`contact.why${n}`));
  const steps = [1, 2, 3].map((n) => ({
    title: t(`admissions.step${n}Title`),
    description: t(`admissions.step${n}Desc`),
  }));

  return (
    <section id="admissions" className="lp-admissions">
      <div className="container lp-admissions__grid">
        <div>
          <h2>{t('admissions.title')}</h2>
          <p className="lp-admissions__lead">{t('admissions.subtitle')}</p>

          <p className="lp-admissions__why">{t('contact.whyTitle')}</p>
          <ul className="lp-checks">
            {reasons.map((reason) => (
              <li key={reason}><Check size={18} aria-hidden="true" /> {reason}</li>
            ))}
          </ul>

          <div className="lp-admissions__ctas">
            <button type="button" className="lp-btn lp-btn--light" onClick={() => navigate('/enroll')}>
              {t('admissions.apply')} <ArrowRight size={18} />
            </button>
            <a className="lp-btn lp-btn--ghost-light" href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> {t('admissions.whatsapp')}
            </a>
            <a className="lp-btn lp-btn--ghost-light" href={telHref(settings.phone)}>
              <Phone size={18} /> {t('admissions.call')}
            </a>
          </div>
        </div>

        <ol className="lp-steps">
          {steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AdmissionsSection;
