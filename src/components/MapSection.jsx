import React from 'react';
import { Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSite } from '../lib/siteContent';

// Continues the contact section: same background, no separate header.
const MapSection = () => {
  const { t } = useTranslation();
  const { settings } = useSite();

  return (
    <section id="map-section" className="lp-map-section" aria-label={t('map.title')}>
      <div className="container">
        <div className="lp-map">
          <iframe
            src={settings.mapEmbedUrl}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('map.title')}
          />
          <div className="lp-map__card">
            <h3>{t('map.title')}</h3>
            <p>{t('map.subtitle')}</p>
            <a className="lp-btn lp-btn--primary" href={settings.mapDirectionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={18} /> {t('map.directions')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
