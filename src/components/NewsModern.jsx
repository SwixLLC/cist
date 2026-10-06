import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getNews, getEvents, DEFAULT_NEWS, DEFAULT_EVENTS } from '../lib/cmsData';
import Lightbox from './Lightbox';

const FILTERS = ['all', 'achievements', 'events', 'announcements'];

const NewsModern = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS);
  const [upcomingEvents, setUpcomingEvents] = useState(DEFAULT_EVENTS);

  useEffect(() => {
    const loadContent = async () => {
      const [news, events] = await Promise.all([getNews(), getEvents()]);
      if (Array.isArray(news)) setNewsItems(news);
      if (Array.isArray(events)) setUpcomingEvents(events);
    };
    loadContent();
    window.addEventListener('cist_content_updated', loadContent);
    return () => window.removeEventListener('cist_content_updated', loadContent);
  }, []);

  const visible = filter === 'all'
    ? (showMore ? newsItems : newsItems.slice(0, 3))
    : newsItems.filter((item) => item.category === filter);

  const close = useCallback(() => setLightbox(null), []);

  return (
    <section id="news" className="lp-section lp-section--tint">
      <div className="container">
        <header className="lp-head">
          <h2>{t('news.title')}</h2>
          <p>{t('news.subtitle')}</p>
        </header>

        <div className="lp-chips" role="group" aria-label={t('news.label')}>
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              className="lp-chip"
              aria-pressed={filter === id}
              onClick={() => { setFilter(id); setShowMore(false); }}
            >
              {t(`news.${id}`)}
            </button>
          ))}
        </div>

        <div className="lp-news">
          <div>
            <div className="lp-news__list">
              {visible.map((item, index) => {
                const isOpen = expanded === item.id;
                const featured = index === 0;
                return (
                  <article key={item.id} className={`lp-article${featured ? ' lp-article--featured' : ''}`}>
                    {item.image && (
                      <button type="button" className="lp-article__img" onClick={() => setLightbox(item)} aria-label={item.title}>
                        <img src={item.image} alt="" loading="lazy" />
                      </button>
                    )}
                    <div className="lp-article__body">
                      <div className="lp-meta">
                        <span className="lp-tag">{FILTERS.includes(item.category) ? t(`news.${item.category}`) : item.categoryLabel}</span>
                        <span><Calendar size={14} aria-hidden="true" /> {item.date}</span>
                        {parseInt(item.readTime, 10) > 0 && (
                          <span><Clock size={14} aria-hidden="true" /> {parseInt(item.readTime, 10)} {t('news.minRead')}</span>
                        )}
                      </div>
                      <h3>{item.title}</h3>
                      <p className="lp-article__text">{isOpen ? item.content : item.excerpt}</p>
                      <div className="lp-article__foot">
                        <span><User size={14} aria-hidden="true" /> {item.author}</span>
                        {item.content && item.content !== item.excerpt && (
                          <button type="button" className="lp-link" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : item.id)}>
                            {isOpen ? t('news.showLess') : t('news.readMore')}
                            <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filter === 'all' && newsItems.length > 3 && (
              <div className="lp-more">
                <button type="button" className="lp-btn lp-btn--outline" onClick={() => setShowMore((v) => !v)}>
                  {showMore ? t('news.viewLess') : t('news.viewMore')}
                </button>
              </div>
            )}
          </div>

          {upcomingEvents.length > 0 && (
            <aside className="lp-events">
              <h3>{t('news.upcoming')}</h3>
              <ol>
                {upcomingEvents.map((event) => {
                  const [mon, day] = (event.date || '').split(' ');
                  return (
                    <li key={event.id ?? `${event.date}-${event.title}`}>
                      <div className="lp-date" aria-hidden="true">
                        <b>{mon}</b>
                        <span>{day}</span>
                      </div>
                      <div>
                        <strong>{event.title}</strong>
                        <small>{event.date} · {event.time}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>
          )}
        </div>
      </div>

      {lightbox && <Lightbox src={lightbox.image} caption={lightbox.title} onClose={close} />}
    </section>
  );
};

export default NewsModern;
