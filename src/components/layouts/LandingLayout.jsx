import React from 'react';
import './LandingLayout.css';
import { Outlet } from 'react-router-dom';
import LandingNavbar from '../shared/LandingNavbar';
import LandingFooter from '../shared/LandingFooter';
import ScrollToTop from '../shared/ScrollToTop';
import ErrorBoundary from '../ErrorBoundary';

const LandingLayout = () => {
  return (
    <div className="landing-layout">
      <LandingNavbar />
      <main className="landing-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <LandingFooter />
      <ScrollToTop />
    </div>
  );
};

export default LandingLayout; 