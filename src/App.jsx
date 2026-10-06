import React, { useState, useEffect, lazy, Suspense } from 'react';
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
// Secondary pages load on demand, so home page visitors don't download the admin panel
const EnrollmentPage = lazy(() => import('./pages/EnrollmentPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'));

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
        <Suspense fallback={<div style={{ minHeight: '100dvh' }} aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </Router>
    </SiteContentProvider>
  );
}

export default App;
