import { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './features/Hero';
import Technologies from './features/Technologies';
import InterfaceLab from './features/InterfaceLab';
import SpatialMode from './features/SpatialMode';
import Archive from './features/Archive';
import CommandPalette from './features/CommandPalette';
import { AppContext, DEFAULT_CONFIG, PRESETS, type LabConfig, type CoreState } from './store';

// ═══════════════════════════════════════════
// Page Transition Wrapper
// ═══════════════════════════════════════════

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Discover Page (Hero + Technologies preview)
// ═══════════════════════════════════════════

function DiscoverPage() {
  return (
    <PageTransition>
      <Hero />
      <div className="separator my-0" />
      <Technologies />
    </PageTransition>
  );
}

function TechnologiesPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <Technologies />
      </div>
    </PageTransition>
  );
}

function LabPage() {
  return (
    <PageTransition>
      <div className="pt-8">
        <InterfaceLab />
      </div>
    </PageTransition>
  );
}

function SpatialPage() {
  return (
    <PageTransition>
      <div className="pt-8">
        <SpatialMode />
      </div>
    </PageTransition>
  );
}

function ArchivePage() {
  return (
    <PageTransition>
      <div className="pt-8">
        <Archive />
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <p className="font-display font-semibold text-lg">NEXUS <span className="text-cyan">∞</span></p>
            <p className="text-silver text-sm">Beyond the Interface.</p>
            <p className="text-silver text-xs">A speculative interface laboratory from 2085.</p>
          </div>
          <div className="space-y-2">
            <p className="annotation">EXPLORE</p>
            <p className="text-silver text-sm">Discover</p>
            <p className="text-silver text-sm">Technologies</p>
            <p className="text-silver text-sm">Interface Lab</p>
          </div>
          <div className="space-y-2">
            <p className="annotation">INTERACT</p>
            <p className="text-silver text-sm">Spatial Mode</p>
            <p className="text-silver text-sm">Archive</p>
            <p className="text-silver text-sm">Command Palette (⌘K)</p>
          </div>
          <div className="space-y-2">
            <p className="annotation">SYSTEM</p>
            <p className="text-silver text-xs">Core v2.085</p>
            <p className="text-silver text-xs">Render Engine: Active</p>
            <p className="text-silver text-xs">Status: Operational</p>
          </div>
        </div>
        <div className="separator mt-8 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="annotation">© 2085 NEXUS LABORATORIES — ALL RIGHTS RESERVED</p>
          <p className="annotation">DESIGNED FOR THE FUTURE</p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// Scroll to top on route change
// ═══════════════════════════════════════════

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// ═══════════════════════════════════════════
// App Content (with context)
// ═══════════════════════════════════════════

function AppContent() {
  const [config, setConfig] = useState<LabConfig>(DEFAULT_CONFIG);
  const [coreState, setCoreState] = useState<CoreState>('active');
  const [savedConfigs, setSavedConfigs] = useState<LabConfig[]>([]);
  const [savedExperiments, setSavedExperiments] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexus-saved-experiments');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const updateConfig = useCallback((partial: Partial<LabConfig>) => {
    setConfig(prev => ({ ...prev, ...partial, isModified: true }));
  }, []);

  const applyPreset = useCallback((name: string) => {
    const preset = PRESETS[name];
    if (preset) {
      setConfig({ ...preset, isModified: false });
    }
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG, isModified: false });
  }, []);

  const saveConfig = useCallback(() => {
    setSavedConfigs(prev => [...prev, { ...config }]);
  }, [config]);

  const toggleSaveExperiment = useCallback((id: string) => {
    setSavedExperiments(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('nexus-saved-experiments', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const contextValue = {
    config,
    setConfig,
    updateConfig,
    applyPreset,
    resetConfig,
    coreState,
    setCoreState,
    savedConfigs,
    saveConfig,
    savedExperiments,
    toggleSaveExperiment,
    commandPaletteOpen,
    setCommandPaletteOpen,
  };

  const location = useLocation();

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-void text-frost">
        <div className="ambient-bg" aria-hidden="true" />
        <Navigation />
        <ScrollToTop />
        <CommandPalette />
        
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/spatial" element={<SpatialPage />} />
              <Route path="/archive" element={<ArchivePage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </AppContext.Provider>
  );
}

// ═══════════════════════════════════════════
// App Root
// ═══════════════════════════════════════════

function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-void flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="w-16 h-16 mx-auto border border-cyan/30 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border border-cyan/50 rounded-full"
              style={{ borderTopColor: '#65F4FF' }}
            />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-cyan/5 blur-xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="font-display text-2xl font-light tracking-widest text-frost">
            NEXUS <span className="text-cyan">∞</span>
          </p>
          <p className="annotation mt-2">INITIALIZING INTERFACE</p>
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '120px' }}
          transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
          className="h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent mx-auto"
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <HashRouter>
      <AnimatePresence>
        {!introComplete && (
          <IntroScreen onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>
      {introComplete && <AppContent />}
    </HashRouter>
  );
}
