import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavbarModern from './components/NavbarModern';
import HeroModern from './components/HeroModern';
import AboutModern from './components/AboutModern';
import AcademicsModern from './components/AcademicsModern';
import CampusLifeModern from './components/CampusLifeModern';
import NewsModern from './components/NewsModern';
import AdmissionsSection from './components/AdmissionsSection';
import ContactModern from './components/ContactModern';
import MapSection from './components/MapSection';
import FooterModern from './components/FooterModern';
import WhatsAppButton from './components/WhatsAppButton';
import { SiteContentProvider } from './lib/siteContent';
import './components/landing.css';
import EnrollmentPage from './pages/EnrollmentPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPanelPage from './pages/AdminPanelPage';

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
        <AdmissionsSection />
        <ContactModern />
        <MapSection />
      </main>
      <FooterModern />
      
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </SiteContentProvider>
  );
}

export default App;
