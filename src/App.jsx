import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import NavbarModern from './components/NavbarModern';
import HeroModern from './components/HeroModern';
import AboutModern from './components/AboutModern';
import AcademicsModern from './components/AcademicsModern';
import CampusLifeModern from './components/CampusLifeModern';
import NewsModern from './components/NewsModern';
import ContactModern from './components/ContactModern';
import MapSection from './components/MapSection';
import FooterModern from './components/FooterModern';
import EnrollmentPage from './pages/EnrollmentPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (sectionId) {
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="App">
      <NavbarModern scrolled={scrolled} />
      <main>
        <HeroModern />
        <AboutModern />
        <AcademicsModern />
        <CampusLifeModern />
        <NewsModern />
        <ContactModern />
        <MapSection />
      </main>
      <FooterModern />
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send/?phone=212665696565&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          textDecoration: 'none',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        <MessageCircle size={32} color="white" fill="white" />
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/enroll" element={<EnrollmentPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
