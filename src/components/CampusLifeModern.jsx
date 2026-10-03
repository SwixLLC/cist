import React, { useState, useEffect } from 'react';
import { Camera, X, Trophy, Music, BookOpen, Heart, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getGallery } from '../lib/cmsData';

const CampusLifeModern = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
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

    const element = document.getElementById('campus-life');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const categories = [
    { id: 'all', name: t('campus.all'), icon: Camera },
    { id: 'sports', name: t('campus.sports'), icon: Trophy },
    { id: 'arts', name: t('campus.arts'), icon: Music },
    { id: 'academics', name: t('campus.academics'), icon: BookOpen },
    { id: 'community', name: t('campus.community'), icon: Heart },
  ];

  const INITIAL_GALLERY = [
    // Sports - New images first
    { id: 13, src: '/images/sport/match.webp', category: 'sports', title: 'Football Match' },
    { id: 14, src: '/images/sport/plan.webp', category: 'sports', title: 'Team Strategy' },
    { id: 15, src: '/images/sport/plan1.webp', category: 'sports', title: 'Game Plan' },
    { id: 16, src: '/images/sport/team%20C.webp', category: 'sports', title: 'Team C' },
    // Original sports images
    { id: 1, src: '/images/sport/sport1.webp', category: 'sports', title: 'Football Tournament' },
    { id: 2, src: '/images/sport/sport2.webp', category: 'sports', title: 'Football Match' },
    { id: 3, src: '/images/sport/sport3.webp', category: 'sports', title: 'Football Championship' },
    { id: 4, src: '/images/sport/sport4.webp', category: 'sports', title: 'Football Game' },
    { id: 5, src: '/images/sport/sport5.webp', category: 'sports', title: 'Football Finals' },
    { id: 6, src: '/images/sport/sport6.webp', category: 'sports', title: 'Football Competition' },
    { id: 7, src: '/images/sport/sport7.webp', category: 'sports', title: 'Football Training' },
    { id: 8, src: '/images/sport/sport8.webp', category: 'sports', title: 'Football Practice' },
    { id: 9, src: '/images/sport/sport9.webp', category: 'sports', title: 'Football Championship' },
    { id: 10, src: '/images/sport/sport10.webp', category: 'sports', title: 'Football Tournament' },
    { id: 11, src: '/images/sport/sport11.webp', category: 'sports', title: 'Football Match' },
    { id: 12, src: '/images/sport/sport12.webp', category: 'sports', title: 'Inter School Football' },
    // Community Service - Supporting students in need and special needs
    { id: 101, src: '/images/community/easter1.webp', category: 'community', title: 'Easter Celebration' },
    { id: 102, src: '/images/community/students.webp', category: 'community', title: 'Community' },
    { id: 103, src: '/images/community/graduation4.jpg', category: 'community', title: 'Community' },
    { id: 104, src: '/images/community/kids1.webp', category: 'community', title: 'Kids Activities' },
    { id: 202, src: '/images/community/community.webp', category: 'community', title: 'Special Needs Workshop' },
    { id: 203, src: '/images/community/community%20(2).webp', category: 'community', title: 'Special Needs Workshop' },
    { id: 204, src: '/images/community/community%20(3).webp', category: 'community', title: 'Special Needs Workshop' },
    { id: 205, src: '/images/community/community%20(4).webp', category: 'community', title: 'Special Needs Workshop' },
    { id: 206, src: '/images/community/community%20(5).webp', category: 'community', title: 'Special Needs Workshop' },
    { id: 207, src: '/images/community/community%20(6).webp', category: 'community', title: 'Special Needs Workshop' },
    // Academics - Academy pictures
    { id: 301, src: '/images/academy/graduation1.webp', category: 'academics', title: 'Graduation Celebration' },
    { id: 302, src: '/images/academy/graduation2.webp', category: 'academics', title: 'Graduation Ceremony' },
    { id: 303, src: '/images/academy/graduation3.webp', category: 'academics', title: 'Class of 2024' },
    { id: 304, src: '/images/academy/graduation0.webp', category: 'academics', title: 'Graduation Day' },
    { id: 305, src: '/images/academy/art-4.webp', category: 'academics', title: 'Classroom' },
    // Arts
    { id: 401, src: '/images/art/art-1.webp', category: 'arts', title: 'Art Exhibition' },
    { id: 402, src: '/images/art/art-2.webp', category: 'arts', title: 'Visual Arts' },
    { id: 405, src: '/images/art/art-5.webp', category: 'arts', title: 'Art Gallery' },
  ];

  const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY);

  useEffect(() => {
    const loadGallery = async () => {
      const items = await getGallery();
      if (items && items.length > 0) {
        const initialMap = new Map(INITIAL_GALLERY.map((i) => [i.id, i]));
        // Put newly uploaded photos first
        const customItems = items.filter((i) => !initialMap.has(i.id));
        setGalleryItems([...customItems, ...INITIAL_GALLERY]);
      }
    };
    loadGallery();

    window.addEventListener('cist_content_updated', loadGallery);
    return () => window.removeEventListener('cist_content_updated', loadGallery);
  }, []);

  const activities = [
    {
      title: t('campus.sportsTitle'),
      icon: Trophy,
      items: t('campus.sportsItems', { returnObjects: true }),
      color: '#FF6B6B',
    },
    {
      title: t('campus.artsTitle'),
      icon: Music,
      items: t('campus.artsItems', { returnObjects: true }),
      color: '#4ECDC4',
    },
    {
      title: t('campus.clubsTitle'),
      icon: BookOpen,
      items: t('campus.clubsItems', { returnObjects: true }),
      color: '#667eea',
    },
    {
      title: t('campus.serviceTitle'),
      icon: Heart,
      items: t('campus.serviceItems', { returnObjects: true }),
      color: '#F7B731',
    },
  ];

  // Get one representative item from each category for "All" view
  const getMixedGalleryItems = () => {
    const sports = galleryItems.filter(item => item.category === 'sports');
    const community = galleryItems.filter(item => item.category === 'community');
    const arts = galleryItems.filter(item => item.category === 'arts');
    const academics = galleryItems.filter(item => item.category === 'academics');
    
    // Pick one from each category (now including arts)
    const mixed = [
      sports[0],           // 1 sport
      community[0],      // 1 community
      arts[0],           // 1 arts
      academics[0],      // 1 academics (graduation)
      sports[1] || community[1],  // 5th item
      academics[1] || arts[1],   // 6th item
    ].filter(Boolean); // Remove any undefined
    
    return mixed;
  };

  const filteredItems = selectedCategory === 'all'
    ? (showMore ? galleryItems : getMixedGalleryItems())
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section
      id="campus-life"
      style={{
        padding: '6rem 0',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <span
            style={{
              color: '#D32F2F',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {t('campus.label')}
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#1a1a1a',
              margin: '1rem 0',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            {t('campus.title')}
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {t('campus.subtitle')}
          </p>
        </div>

        {/* Gallery Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '4rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.2s',
          }}
        >
          {/* Category Filter */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setShowMore(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat.id ? '#D32F2F' : '#f0f0f0',
                  color: selectedCategory === cat.id ? 'white' : '#666',
                  transition: 'all 0.3s ease',
                }}
              >
                <cat.icon size={18} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  height: '250px',
                  transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: `all 0.5s ease-out ${index * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1.5rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  className="gallery-overlay"
                >
                  <h4 style={{ color: 'white', fontWeight: 600 }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button - Only for All category */}
          {selectedCategory === 'all' && galleryItems.length > 6 && (
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
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(211, 47, 47, 0.3)';
                }}
              >
                {showMore ? t('campus.viewLess') : t('campus.viewMore')}
              </button>
            </div>
          )}
        </div>

        {/* Activities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.4s',
          }}
        >
          {activities.map((activity, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: activity.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'white',
                }}
              >
                <activity.icon size={28} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1a1a1a' }}>
                {activity.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {activity.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0',
                      color: '#666',
                      fontSize: '0.9rem',
                    }}
                  >
                    <MapPin size={14} style={{ color: activity.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              style={{
                maxWidth: '90%',
                maxHeight: '80vh',
                borderRadius: '12px',
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        .gallery-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};

export default CampusLifeModern;
