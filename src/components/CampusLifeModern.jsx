import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Music, BookOpen, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getGallery } from '../lib/cmsData';
import { DEFAULT_GALLERY } from '../lib/defaultContent';
import Lightbox from './Lightbox';

const CATEGORY_IDS = ['all', 'sports', 'arts', 'academics', 'community'];

/** One photo from each category first, so the collapsed "All" view shows the range of school life. */
const featuredMix = (items) => {
  const by = (cat) => items.filter((i) => i.category === cat);
  const [sports, community, arts, academics] = ['sports', 'community', 'arts', 'academics'].map(by);
  return [academics[0], sports[0], arts[0], community[0], sports[1] || community[1]].filter(Boolean);
};

const CampusLifeModern = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY);

  useEffect(() => {
    const loadGallery = async () => {
      const items = await getGallery();
      if (Array.isArray(items)) setGalleryItems(items);
    };
    loadGallery();
    window.addEventListener('cist_content_updated', loadGallery);
    return () => window.removeEventListener('cist_content_updated', loadGallery);
  }, []);

  const collapsed = category === 'all' && !showAll;
  const visible = category === 'all'
    ? (showAll ? galleryItems : featuredMix(galleryItems))
    : galleryItems.filter((item) => item.category === category);

  const activities = [
    { icon: Trophy, title: t('campus.sportsTitle'), items: t('campus.sportsItems', { returnObjects: true }) },
    { icon: Music, title: t('campus.artsTitle'), items: t('campus.artsItems', { returnObjects: true }) },
    { icon: BookOpen, title: t('campus.clubsTitle'), items: t('campus.clubsItems', { returnObjects: true }) },
    { icon: Heart, title: t('campus.serviceTitle'), items: t('campus.serviceItems', { returnObjects: true }) },
  ];

  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="campus-life" className="lp-section">
      <div className="container">
        <header className="lp-head">
          <h2>{t('campus.title')}</h2>
          <p>{t('campus.subtitle')}</p>
        </header>

        <div className="lp-chips" role="group" aria-label={t('campus.label')}>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className="lp-chip"
              aria-pressed={category === id}
              onClick={() => { setCategory(id); setShowAll(false); }}
            >
              {t(`campus.${id}`)}
            </button>
          ))}
        </div>

        <div className={`lp-mosaic${collapsed && visible.length >= 5 ? ' lp-mosaic--feature' : ''}`}>
          {visible.map((item) => (
            <button key={item.id} type="button" className="lp-tile" onClick={() => setSelected(item)}>
              <img src={item.src} alt={item.title} loading="lazy" />
              <span className="lp-tile__cap">{item.title}</span>
            </button>
          ))}
        </div>

        {category === 'all' && galleryItems.length > 5 && (
          <div className="lp-more">
            <button type="button" className="lp-btn lp-btn--outline" onClick={() => setShowAll((v) => !v)}>
              {showAll ? t('campus.viewLess') : t('campus.viewMore')}
            </button>
          </div>
        )}

        <div className="lp-activities">
          {activities.map(({ icon: Icon, title, items }) => (
            <div key={title}>
              <h3><Icon size={20} aria-hidden="true" /> {title}</h3>
              <ul>
                {(Array.isArray(items) ? items : []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {selected && <Lightbox src={selected.src} caption={selected.title} onClose={close} />}
    </section>
  );
};

export default CampusLifeModern;
