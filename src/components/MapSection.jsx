import React, { useState } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSite } from '../lib/siteContent';

const CONSENT_KEY = 'cist-map-consent';

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'yes';
  } catch {
    return false;
  }
};

// Continues the contact section: same background, no separate header.
// Google Maps only loads after the visitor agrees, because it shares their IP address with Google.
const MapSection = () => {
  const { t } = useTranslation();
  const { settings } = useSite();
  const [showMap, setShowMap] = useState(readConsent);

  const allowMap = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'yes');
    } catch {
      // Private mode: show the map for this visit only
    }
    setShowMap(true);
  };

  return (
    <section id="map-section" className="lp-map-section" aria-label={t('map.title')}>
      <div className="container">
        <div className="lp-map">
          {showMap ? (
            <iframe
              src={settings.mapEmbedUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('map.title')}
            />
          ) : (
            <div className="lp-map__consent">
              <MapPin size={28} aria-hidden="true" />
              <p>{t('map.consentText')}</p>
              <button type="button" className="lp-btn lp-btn--outline" onClick={allowMap}>
                {t('map.showMap')}
              </button>
            </div>
          )}
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
