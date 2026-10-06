import React, { useState, useEffect } from 'react';
import { ArrowRight, CalendarCheck, Landmark, Languages, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSite } from '../lib/siteContent';
import ThemeDecor from './ThemeDecor';

/** Scrolls to the contact form and pre-selects "Book a visit" as the subject. */
export const requestVisit = () => {
  window.dispatchEvent(new CustomEvent('cist:prefill-subject', { detail: 'visit' }));
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

const HeroModern = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { images, theme } = useSite();
  // A theme can put its own photo first in the banner
  const slides = [theme?.heroImage, ...images.heroSlides].filter(Boolean);
  const ThemeIcon = theme?.icon;
  const [currentSlide, setCurrentSlide] = useState(0);
  const active = currentSlide % slides.length;

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const facts = [
    { icon: Landmark, label: t('hero.fact_founded') },
    { icon: Languages, label: t('hero.fact_english') },
    { icon: GraduationCap, label: t('hero.fact_grades') },
    { icon: MapPin, label: t('hero.fact_city') },
  ];

  return (
    <section
      id="home"
      className={`lp-hero${theme ? ` lp-hero--theme lp-hero--${theme.id}` : ''}`}
      style={theme ? { '--theme-accent': theme.accent } : undefined}
    >
      {slides.map((src, index) => (
        <div key={`${src}-${index}`} className={`lp-hero__slide${index === active ? ' is-active' : ''}`} aria-hidden={index !== active}>
          <img
            src={src}
            alt={index === 0 ? 'Canadian International School Tangier' : ''}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : undefined}
          />
        </div>
      ))}

      {theme && <ThemeDecor theme={theme} />}

      <div className="container lp-hero__inner">
        {theme && (
          <p className="lp-theme-badge" key={theme.id}>
            <span className="lp-theme-badge__medal" aria-hidden="true">
              <ThemeIcon size={19} strokeWidth={2} />
            </span>
            <span className="lp-theme-badge__text">{theme.message[i18n.language] || theme.message.en}</span>
            <span className="lp-theme-badge__rule" aria-hidden="true" />
          </p>
        )}
        <h1 className="lp-hero__title">
          {t('hero.line1')} <span>{t('hero.line2')}</span>
        </h1>
        <p className="lp-hero__lead">{t('hero.subtitle')}</p>

        <div className="lp-hero__ctas">
          <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate('/enroll')}>
            {t('hero.register')} <ArrowRight size={19} />
          </button>
          <button type="button" className="lp-btn lp-btn--ghost-light" onClick={requestVisit}>
            <CalendarCheck size={18} /> {t('hero.tour')}
          </button>
        </div>

        <ul className="lp-hero__facts">
          {facts.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={20} aria-hidden="true" /> {label}
            </li>
          ))}
          {slides.length > 1 && (
          <li className="lp-hero__dots" aria-label="Slides">
            {slides.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                aria-pressed={index === active}
                aria-label={t('hero.slide', { n: index + 1 })}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default HeroModern;
