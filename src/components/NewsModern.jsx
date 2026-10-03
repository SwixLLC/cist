import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowRight, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getNews, getEvents, DEFAULT_NEWS, DEFAULT_EVENTS } from '../lib/cmsData';

const NewsModern = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('news');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const filters = [
    { id: 'all', label: t('news.all') },
    { id: 'achievements', label: t('news.achievements') },
    { id: 'events', label: t('news.events') },
    { id: 'announcements', label: t('news.announcements') },
  ];

  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS);
  const [upcomingEvents, setUpcomingEvents] = useState(DEFAULT_EVENTS);

  useEffect(() => {
    const loadContent = async () => {
      const news = await getNews();
      const events = await getEvents();
      if (news && news.length > 0) setNewsItems(news);
      if (events && events.length > 0) setUpcomingEvents(events);
    };
    loadContent();

    window.addEventListener('cist_content_updated', loadContent);
    return () => window.removeEventListener('cist_content_updated', loadContent);
  }, []);

  const filteredNews = activeFilter === 'all'
    ? (showMore ? newsItems : newsItems.slice(0, 2))
    : newsItems.filter(item => item.category === activeFilter);

  return (
    <section id="news" style={{ padding: '6rem 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out',
        }}>
          <span style={{
            color: '#D32F2F',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            {t('news.label')}
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '1rem 0',
            fontFamily: 'Playfair Display, serif',
          }}>
            {t('news.title')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            {t('news.subtitle')}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* News Column */}
          <div className="news-main-col" style={{ gridColumn: 'span 2' }}>
            {/* Filters */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => { setActiveFilter(filter.id); setShowMore(false); }}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '50px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    backgroundColor: activeFilter === filter.id ? '#D32F2F' : '#f0f0f0',
                    color: activeFilter === filter.id ? 'white' : '#666',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* News Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredNews.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease-out ${index * 0.1}s`,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {/* Image - Clickable */}
                    <div
                      onClick={() => setLightboxImage(item.image)}
                      style={{
                        width: 'clamp(120px, 30%, 200px)',
                        minHeight: '160px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          minHeight: '160px',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '1.5rem', minWidth: '250px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          backgroundColor: '#FFF5F5',
                          color: '#D32F2F',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {item.categoryLabel}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          {item.date}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} />
                          {item.readTime} {t('news.minRead')}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '0.5rem',
                      }}>
                        {item.title}
                      </h3>

                      <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        {expandedArticle === item.id ? item.content : item.excerpt}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#888',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <User size={14} />
                          {item.author}
                        </span>

                        <button
                          onClick={() => setExpandedArticle(expandedArticle === item.id ? null : item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#D32F2F',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.9rem',
                          }}
                        >
                          {expandedArticle === item.id ? t('news.showLess') : t('news.readMore')}
                          <ChevronRight size={16} style={{
                            transform: expandedArticle === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* View More/Less Button - Only for All filter */}
              {activeFilter === 'all' && newsItems.length > 2 && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    onClick={() => setShowMore(!showMore)}
                    style={{
                      background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                      color: 'white',
                      padding: '1rem 2.5rem',
                      borderRadius: '50px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(211, 47, 47, 0.3)';
                    }}
                  >
                    {showMore ? t('news.viewLess') : t('news.viewMore')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Upcoming Events */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '20px',
            padding: '2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.3s',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              color: '#1a1a1a',
            }}>
              {t('news.upcoming')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    backgroundColor: '#D32F2F',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    minWidth: '60px',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {event.date.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {event.date.split(' ')[1]}
                    </div>
                  </div>

                  <div>
                    <h4 style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '0.25rem',
                      color: '#1a1a1a',
                    }}>
                      {event.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{event.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.875rem',
              backgroundColor: 'transparent',
              border: '2px solid #D32F2F',
              borderRadius: '12px',
              color: '#D32F2F',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#D32F2F';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#D32F2F';
            }}
            >
              {t('news.viewAll')}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Images */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            cursor: 'pointer',
          }}
        >
          <img 
            src={lightboxImage}
            alt="News Image"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            aria-label="Close image"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0.25rem',
            }}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsModern;
