import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Command } from 'lucide-react';
import { useAppState, NAV_ITEMS, type VisualMode } from '../store';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { updateConfig, resetConfig, setCoreState } = useAppState();

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    ...NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: `Go to ${item.label}`,
      category: 'Navigation',
      action: () => { navigate(item.path); setOpen(false); },
    })),
    // Visual modes
    ...(['quantum', 'holographic', 'monolithic', 'aurora'] as VisualMode[]).map((mode) => ({
      id: `mode-${mode}`,
      label: `Set visual mode: ${mode}`,
      category: 'Visual Mode',
      action: () => { updateConfig({ visualMode: mode, isModified: true }); setOpen(false); },
    })),
    // Core states
    ...(['dormant', 'active', 'transcendent'] as const).map((state) => ({
      id: `core-${state}`,
      label: `Set core state: ${state}`,
      category: 'Core State',
      action: () => { setCoreState(state); setOpen(false); },
    })),
    // Actions
    { id: 'reset', label: 'Reset all settings', category: 'Actions', action: () => { resetConfig(); setOpen(false); } },
    { id: 'lab', label: 'Open Interface Lab', category: 'Actions', action: () => { navigate('/lab'); setOpen(false); } },
  ], [navigate, updateConfig, resetConfig, setCoreState]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, commands]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-command-palette', handler);
    return () => window.removeEventListener('open-command-palette', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    }
  };

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filtered]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative glass-strong rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-4 h-4 text-silver flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              className="flex-1 bg-transparent text-sm text-frost placeholder-silver focus:outline-none"
              aria-label="Search commands"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-silver">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-silver text-sm">No commands found</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-silver/50">
                    {category}
                  </p>
                  {items.map((cmd) => {
                    const globalIndex = filtered.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          globalIndex === selectedIndex
                            ? 'bg-cyan/10 text-cyan'
                            : 'text-frost hover:bg-white/5'
                        }`}
                      >
                        <span>{cmd.label}</span>
                        {globalIndex === selectedIndex && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-silver/50">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span className="text-[10px] text-silver/50">{filtered.length} commands</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
