import React from 'react';
import { Award, Globe, Heart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSite } from '../lib/siteContent';

const AboutModern = () => {
  const { t } = useTranslation();
  const { images } = useSite();

  const pillars = [
    { icon: Award, title: t('about.ontarioLabel'), description: t('about.ontarioDesc') },
    { icon: Globe, title: t('about.ministryLabel'), description: t('about.ministryDesc') },
    { icon: Users, title: t('about.classesLabel'), description: t('about.classesDesc') },
    { icon: Heart, title: t('about.holisticLabel'), description: t('about.holisticDesc') },
  ];

  const values = [
    { title: t('about.excellenceLabel'), description: t('about.excellenceDesc') },
    { title: t('about.communityLabel'), description: t('about.communityDesc') },
    { title: t('about.globalLabel'), description: t('about.globalDesc') },
  ];

  return (
    <section id="about" className="lp-section">
      <div className="container">
        <header className="lp-head">
          <h2>{t('about.title')}</h2>
          <p>{t('about.description')}</p>
        </header>

        <div className="lp-about">
          <div className="lp-about__media">
            <img className="lp-about__main" src={images.aboutMain} alt="Students and teachers at CIST" loading="lazy" />
            <img className="lp-about__inset" src={images.aboutInset} alt="A CIST classroom" loading="lazy" />
          </div>

          <div className="lp-about__body">
            <h3>{t('about.worldClassTitle')}</h3>
            <p>{t('about.worldClassDesc')}</p>

            <ul className="lp-pillars">
              {pillars.map(({ icon: Icon, title, description }) => (
                <li key={title}>
                  <span className="lp-pillars__icon"><Icon size={20} aria-hidden="true" /></span>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lp-values" aria-label={t('about.valuesTitle')}>
          {values.map((value) => (
            <div key={value.title}>
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutModern;
