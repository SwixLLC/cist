import React, { useRef, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSite } from '../lib/siteContent';

const PROGRAMS = [
  { id: 'kindergarten', imageKey: 'programKindergarten', features: ['f_english', 'f_play', 'f_social', 'f_opening'] },
  { id: 'primary', imageKey: 'programPrimary', features: ['f_english', 'f_ontario', 'f_stem', 'f_project'] },
  { id: 'middle', imageKey: 'programMiddle', features: ['f_english', 'f_ontario', 'f_critical', 'f_leadership'] },
  { id: 'high', imageKey: 'programHigh', features: ['f_english', 'f_diploma', 'f_ap', 'f_university'] },
];

const AcademicsModern = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { images } = useSite();
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const program = PROGRAMS[active];

  // Arrow keys move between stages (WAI-ARIA tabs pattern)
  const onKeyDown = (e) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + PROGRAMS.length) % PROGRAMS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="academics" className="lp-section lp-section--tint">
      <div className="container">
        <header className="lp-head">
          <h2>{t('academics.title')}</h2>
          <p>{t('academics.subtitle')}</p>
        </header>

        <div className="lp-stages" role="tablist" aria-label={t('academics.stagesLabel')} onKeyDown={onKeyDown}>
          {PROGRAMS.map((p, index) => (
            <button
              key={p.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`stage-tab-${p.id}`}
              aria-selected={index === active}
              aria-controls="stage-panel"
              tabIndex={index === active ? 0 : -1}
              className="lp-stage-tab"
              onClick={() => setActive(index)}
            >
              <span className="lp-stage-tab__dot" aria-hidden="true" />
              <span className="lp-stage-tab__sub">{t(`academics.${p.id}Sub`)}</span>
              <span className="lp-stage-tab__title">{t(`academics.${p.id}Title`)}</span>
            </button>
          ))}
        </div>

        <article
          key={program.id}
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${program.id}`}
          className="lp-stage"
        >
          <div className="lp-stage__media">
            <img src={images[program.imageKey]} alt={t(`academics.${program.id}Title`)} loading="lazy" />
          </div>
          <div className="lp-stage__body">
            <p className="lp-stage__sub">{t(`academics.${program.id}Sub`)}</p>
            <h3>{t(`academics.${program.id}Title`)}</h3>
            <p>{t(`academics.${program.id}Desc`)}</p>
            <ul className="lp-checks">
              {program.features.map((key) => (
                <li key={key}>
                  <Check size={18} aria-hidden="true" /> {t(`academics.${key}`)}
                </li>
              ))}
            </ul>
            <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate('/enroll')}>
              {t('academics.apply')} <ArrowRight size={18} />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AcademicsModern;
