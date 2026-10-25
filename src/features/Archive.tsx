import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bookmark, BookmarkCheck, ArrowRight, Filter } from 'lucide-react';
import { useAppState, EXPERIMENTS, CATEGORIES, type Experiment } from '../store';

// ═══════════════════════════════════════════
// Visual Preview Generator
// ═══════════════════════════════════════════

function ExperimentPreview({ experiment }: { experiment: Experiment }) {
  const colors = {
    'phase-shift': { from: '#65F4FF', to: '#A477FF' },
    'void-resonance': { from: '#F1F4FA', to: '#191C27' },
    'chromatic-drift': { from: '#A477FF', to: '#65F4FF' },
    'neural-bloom': { from: '#C9FF64', to: '#65F4FF' },
    'signal-decay': { from: '#FF6B79', to: '#A477FF' },
    'frozen-lattice': { from: '#65F4FF', to: '#F1F4FA' },
    'spectral-weave': { from: '#A477FF', to: '#C9FF64' },
    'deep-field': { from: '#C9FF64', to: '#A477FF' },
    'pulse-grid': { from: '#FFD700', to: '#65F4FF' },
    'ether-cascade': { from: '#65F4FF', to: '#C9FF64' },
  };

  const c = colors[experiment.visual as keyof typeof colors] || { from: '#65F4FF', to: '#A477FF' };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.from}20, ${c.to}10)` }} />
      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
        {/* Background grid */}
        <defs>
          <pattern id={`grid-${experiment.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={c.from} strokeWidth="0.2" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${experiment.id})`} />
        
        {/* Central form based on geometry */}
        {experiment.config.geometry === 'torus' ? (
          <ellipse cx="50" cy="50" rx="25" ry="15" fill="none" stroke={c.from} strokeWidth="1" opacity="0.6" />
        ) : experiment.config.geometry === 'octahedron' ? (
          <polygon points="50,25 70,50 50,75 30,50" fill="none" stroke={c.from} strokeWidth="1" opacity="0.6" />
        ) : experiment.config.geometry === 'dodecahedron' ? (
          <polygon points="50,20 65,30 70,50 60,68 40,68 30,50 35,30" fill="none" stroke={c.from} strokeWidth="1" opacity="0.6" />
        ) : (
          <circle cx="50" cy="50" r="20" fill="none" stroke={c.from} strokeWidth="1" opacity="0.6" />
        )}
        
        {/* Accent elements */}
        <circle cx="50" cy="50" r="5" fill={c.from} opacity="0.3" />
        <circle cx="50" cy="50" r="2" fill={c.from} opacity="0.8" />
        
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i / 4) * Math.PI * 2;
          const r = 30;
          return (
            <circle
              key={i}
              cx={50 + Math.cos(angle) * r}
              cy={50 + Math.sin(angle) * r}
              r="1.5"
              fill={c.to}
              opacity="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════
// Experiment Card
// ═══════════════════════════════════════════

function ExperimentCard({ experiment, onSelect, isSaved, onToggleSave }: {
  experiment: Experiment;
  onSelect: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group glass rounded-xl overflow-hidden hover:border-cyan/20 transition-all duration-300"
    >
      {/* Visual preview */}
      <div className="aspect-[4/3] relative cursor-pointer" onClick={onSelect}>
        <ExperimentPreview experiment={experiment} />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs text-cyan font-medium flex items-center gap-1">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-medium text-sm group-hover:text-cyan transition-colors">{experiment.title}</h3>
            <p className="text-silver text-xs mt-1 line-clamp-2">{experiment.description}</p>
          </div>
          <button
            onClick={onToggleSave}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label={isSaved ? 'Remove from saved' : 'Save experiment'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-cyan" />
            ) : (
              <Bookmark className="w-4 h-4 text-silver" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="annotation text-[10px]">{experiment.category}</span>
          <button
            onClick={onSelect}
            className="text-[10px] text-silver hover:text-cyan transition-colors"
          >
            INSPECT →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Detail Modal
// ═══════════════════════════════════════════

function ExperimentDetail({ experiment, onClose, onLoadInLab, isSaved, onToggleSave }: {
  experiment: Experiment;
  onClose: () => void;
  onLoadInLab: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={experiment.title}
    >
      <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-silver hover:text-frost transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Preview */}
        <div className="aspect-[16/9] relative">
          <ExperimentPreview experiment={experiment} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="annotation mb-1">{experiment.category}</p>
            <h2 className="font-display font-bold text-xl">{experiment.title}</h2>
            <p className="text-silver text-sm mt-2">{experiment.description}</p>
          </div>

          <div className="separator" />

          {/* Config parameters */}
          <div>
            <p className="annotation mb-2">CONFIGURATION</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {experiment.config.visualMode && (
                <div className="machined rounded-lg p-2">
                  <p className="text-[10px] text-silver">MODE</p>
                  <p className="text-xs text-frost capitalize">{experiment.config.visualMode}</p>
                </div>
              )}
              {experiment.config.geometry && (
                <div className="machined rounded-lg p-2">
                  <p className="text-[10px] text-silver">GEOMETRY</p>
                  <p className="text-xs text-frost capitalize">{experiment.config.geometry}</p>
                </div>
              )}
              {experiment.config.motionIntensity && (
                <div className="machined rounded-lg p-2">
                  <p className="text-[10px] text-silver">MOTION</p>
                  <p className="text-xs text-frost capitalize">{experiment.config.motionIntensity}</p>
                </div>
              )}
              {experiment.config.depth && (
                <div className="machined rounded-lg p-2">
                  <p className="text-[10px] text-silver">DEPTH</p>
                  <p className="text-xs text-frost">{experiment.config.depth}%</p>
                </div>
              )}
              {experiment.config.accentColor && (
                <div className="machined rounded-lg p-2">
                  <p className="text-[10px] text-silver">ACCENT</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: experiment.config.accentColor }} />
                    <p className="text-xs text-frost font-mono">{experiment.config.accentColor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={onLoadInLab}
              className="px-4 py-2 bg-cyan/10 text-cyan text-sm font-medium rounded-lg border border-cyan/30 hover:bg-cyan/20 transition-all"
            >
              Load in Interface Lab
            </button>
            <button
              onClick={onToggleSave}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                isSaved
                  ? 'bg-lime/10 text-lime border-lime/30'
                  : 'text-silver border-white/10 hover:border-white/20'
              }`}
            >
              {isSaved ? '✓ Saved' : 'Save to Collection'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Archive Component
// ═══════════════════════════════════════════

export default function Archive() {
  const { updateConfig, savedExperiments, toggleSaveExperiment } = useAppState();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);

  const filtered = useMemo(() => {
    return EXPERIMENTS.filter((exp) => {
      const matchesSearch = search === '' ||
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || exp.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleLoadInLab = (exp: Experiment) => {
    updateConfig({
      ...exp.config,
      isModified: true,
    } as any);
    setSelectedExp(null);
  };

  return (
    <section className="relative py-20 sm:py-32" aria-label="Archive">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="annotation mb-3">ARCHIVE</p>
          <h2 className="font-display font-bold text-fluid-h1">
            Digital<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultraviolet to-lime">Experiments</span>
          </h2>
          <p className="text-silver mt-4 max-w-lg text-fluid-body">
            A curated collection of experimental configurations. 
            Search, filter, and load them into the Interface Lab.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiments..."
              className="w-full pl-10 pr-4 py-2.5 bg-obsidian border border-white/10 rounded-lg text-sm text-frost placeholder-silver focus:border-cyan/30 focus:outline-none transition-colors"
              aria-label="Search experiments"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-cyan/10 text-cyan border border-cyan/30'
                    : 'text-silver hover:text-frost border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="annotation mb-4">
          {filtered.length} experiment{filtered.length !== 1 ? 's' : ''}
          {search && <span className="text-cyan"> — matching "{search}"</span>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  onSelect={() => setSelectedExp(exp)}
                  isSaved={savedExperiments.includes(exp.id)}
                  onToggleSave={() => toggleSaveExperiment(exp.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full border border-white/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-silver" />
            </div>
            <p className="text-silver text-sm">No experiments found</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="text-cyan text-xs hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedExp && (
          <ExperimentDetail
            experiment={selectedExp}
            onClose={() => setSelectedExp(null)}
            onLoadInLab={() => handleLoadInLab(selectedExp)}
            isSaved={savedExperiments.includes(selectedExp.id)}
            onToggleSave={() => toggleSaveExperiment(selectedExp.id)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
