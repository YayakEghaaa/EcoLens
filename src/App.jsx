import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';

import SplashScreen from './components/ui/SplashScreen';
import Toast        from './components/ui/Toast';
import Navbar       from './components/layout/Navbar';
import BottomNav    from './components/layout/BottomNav';
import ProfileModal from './components/ui/ProfileModal';

import LandingPage   from './pages/LandingPage';
import AuthPage      from './pages/AuthPage';
import HomePage      from './pages/HomePage';
import ScanPage      from './pages/ScanPage';
import RecyclePage   from './pages/RecyclePage';
import DashboardPage from './pages/DashboardPage';
import EduHubPage    from './pages/EduHubPage';

const PAGE_MAP = {
  landing:   LandingPage,
  auth:      AuthPage,
  home:      HomePage,
  scan:      ScanPage,
  recycle:   RecyclePage,
  dashboard: DashboardPage,
  eduhub:    EduHubPage,
};

function AppShell() {
  const { currentPage, user, authLoading, showToast, profileOpen } = useApp();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (splashDone && !authLoading && user) {
      setTimeout(() => showToast(`Selamat datang, ${user.displayName?.split(' ')[0] || 'EcoHero'}! 🌿`), 400);
    }
  }, [splashDone, authLoading, user]);

  const PageComponent = PAGE_MAP[currentPage] ?? LandingPage;
  const isLanding     = currentPage === 'landing';
  const isAuth        = currentPage === 'auth';
  const isScan        = currentPage === 'scan';
  const showNav       = !isLanding && !isAuth && !isScan;
  const showSplash    = !splashDone || authLoading;

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setSplashDone(true)} />}

      {!showSplash && (
        <div className="min-h-screen bg-[#0A0F0D] font-poppins overflow-x-hidden">
          {showNav && <Navbar />}

          <main className={`${showNav ? 'pt-16' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <PageComponent />
              </motion.div>
            </AnimatePresence>
          </main>

          {showNav && <BottomNav />}
          <AnimatePresence>
            {profileOpen && <ProfileModal />}
          </AnimatePresence>
          <Toast />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}