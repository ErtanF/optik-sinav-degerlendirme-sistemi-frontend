import React, { Suspense, lazy, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Landing.css';
import HeroSection from './components/HeroSection';

// Lazy load components for better performance
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'));
const ScreenshotsSection = lazy(() => import('./components/ScreenshotsSection'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const CTASection = lazy(() => import('./components/CTASection'));

// Loading component
const SectionLoader = () => (
  <div className="section-loader">
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>Yükleniyor...</p>
    </div>
  </div>
);

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    // Navbar'dan gelen scroll state'ini kontrol et
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Sayfa yüklendikten sonra scroll yap

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="landing-page">
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <HowItWorksSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ScreenshotsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>
    </div>
  );
};

export default Landing; 