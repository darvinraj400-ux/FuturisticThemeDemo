import { createContext, useContext } from 'react';

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

export type VisualMode = 'quantum' | 'holographic' | 'monolithic' | 'aurora';
export type MotionLevel = 'still' | 'balanced' | 'kinetic';
export type CoreState = 'dormant' | 'active' | 'transcendent';
export type GeometryType = 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torus';

export interface LabConfig {
  visualMode: VisualMode;
  accentColor: string;
  motionIntensity: MotionLevel;
  depth: number;
  transparency: number;
  geometry: GeometryType;
  isModified: boolean;
}

export interface Experiment {
  id: string;
  title: string;
  description: string;
  category: string;
  config: Partial<LabConfig>;
  visual: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface Command {
  id: string;
  label: string;
  action: () => void;
  category: string;
}

// ═══════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════

export const NAV_ITEMS: NavItem[] = [
  { id: 'discover', label: 'Discover', path: '/' },
  { id: 'technologies', label: 'Technologies', path: '/technologies' },
  { id: 'lab', label: 'Interface Lab', path: '/lab' },
  { id: 'spatial', label: 'Spatial Mode', path: '/spatial' },
  { id: 'archive', label: 'Archive', path: '/archive' },
];

// ═══════════════════════════════════════════
// Default Config
// ═══════════════════════════════════════════

export const DEFAULT_CONFIG: LabConfig = {
  visualMode: 'quantum',
  accentColor: '#65F4FF',
  motionIntensity: 'balanced',
  depth: 50,
  transparency: 70,
  geometry: 'icosahedron',
  isModified: false,
};

export const PRESETS: Record<string, LabConfig> = {
  'Quantum Default': {
    visualMode: 'quantum',
    accentColor: '#65F4FF',
    motionIntensity: 'balanced',
    depth: 50,
    transparency: 70,
    geometry: 'icosahedron',
    isModified: false,
  },
  'Holographic Dream': {
    visualMode: 'holographic',
    accentColor: '#A477FF',
    motionIntensity: 'kinetic',
    depth: 80,
    transparency: 50,
    geometry: 'dodecahedron',
    isModified: false,
  },
  'Monolithic': {
    visualMode: 'monolithic',
    accentColor: '#F1F4FA',
    motionIntensity: 'still',
    depth: 20,
    transparency: 90,
    geometry: 'octahedron',
    isModified: false,
  },
  'Aurora': {
    visualMode: 'aurora',
    accentColor: '#C9FF64',
    motionIntensity: 'kinetic',
    depth: 70,
    transparency: 60,
    geometry: 'torus',
    isModified: false,
  },
};

export const ACCENT_COLORS = [
  { name: 'Electric Cyan', value: '#65F4FF' },
  { name: 'Ultraviolet', value: '#A477FF' },
  { name: 'Signal Lime', value: '#C9FF64' },
  { name: 'Alert Coral', value: '#FF6B79' },
  { name: 'Frost', value: '#F1F4FA' },
  { name: 'Solar Gold', value: '#FFD700' },
];

// ═══════════════════════════════════════════
// Experiments Data
// ═══════════════════════════════════════════

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-001',
    title: 'Phase Shift',
    description: 'Exploring dimensional transitions through geometric morphing and spectral color mapping.',
    category: 'Geometry',
    config: { visualMode: 'quantum', accentColor: '#65F4FF', geometry: 'icosahedron', depth: 60 },
    visual: 'phase-shift',
  },
  {
    id: 'exp-002',
    title: 'Void Resonance',
    description: 'A study in negative space and luminous geometry against absolute darkness.',
    category: 'Light',
    config: { visualMode: 'monolithic', accentColor: '#F1F4FA', geometry: 'octahedron', depth: 30 },
    visual: 'void-resonance',
  },
  {
    id: 'exp-003',
    title: 'Chromatic Drift',
    description: 'Continuous spectral evolution through holographic material systems.',
    category: 'Material',
    config: { visualMode: 'holographic', accentColor: '#A477FF', geometry: 'dodecahedron', transparency: 50 },
    visual: 'chromatic-drift',
  },
  {
    id: 'exp-004',
    title: 'Neural Bloom',
    description: 'Organic growth patterns emerging from structured geometric foundations.',
    category: 'Organic',
    config: { visualMode: 'aurora', accentColor: '#C9FF64', geometry: 'torus', motionIntensity: 'kinetic' },
    visual: 'neural-bloom',
  },
  {
    id: 'exp-005',
    title: 'Signal Decay',
    description: 'Entropy visualization through progressive geometric dissolution.',
    category: 'Entropy',
    config: { visualMode: 'quantum', accentColor: '#FF6B79', geometry: 'icosahedron', transparency: 40 },
    visual: 'signal-decay',
  },
  {
    id: 'exp-006',
    title: 'Frozen Lattice',
    description: 'Crystalline structures captured at absolute zero motion.',
    category: 'Geometry',
    config: { visualMode: 'monolithic', accentColor: '#65F4FF', geometry: 'dodecahedron', motionIntensity: 'still' },
    visual: 'frozen-lattice',
  },
  {
    id: 'exp-007',
    title: 'Spectral Weave',
    description: 'Interlaced light patterns creating emergent chromatic textures.',
    category: 'Light',
    config: { visualMode: 'aurora', accentColor: '#A477FF', geometry: 'torus', depth: 80 },
    visual: 'spectral-weave',
  },
  {
    id: 'exp-008',
    title: 'Deep Field',
    description: 'An exploration of infinite depth through layered transparent geometry.',
    category: 'Material',
    config: { visualMode: 'holographic', accentColor: '#C9FF64', geometry: 'icosahedron', transparency: 30, depth: 90 },
    visual: 'deep-field',
  },
  {
    id: 'exp-009',
    title: 'Pulse Grid',
    description: 'Rhythmic geometric patterns synchronized to mathematical sequences.',
    category: 'Geometry',
    config: { visualMode: 'quantum', accentColor: '#FFD700', geometry: 'octahedron', motionIntensity: 'kinetic' },
    visual: 'pulse-grid',
  },
  {
    id: 'exp-010',
    title: 'Ether Cascade',
    description: 'Flowing luminous streams through dimensional boundaries.',
    category: 'Light',
    config: { visualMode: 'aurora', accentColor: '#65F4FF', geometry: 'torus', depth: 70, transparency: 55 },
    visual: 'ether-cascade',
  },
];

export const CATEGORIES = ['All', 'Geometry', 'Light', 'Material', 'Organic', 'Entropy'];

// ═══════════════════════════════════════════
// Context
// ═══════════════════════════════════════════

export interface AppState {
  config: LabConfig;
  setConfig: (config: LabConfig) => void;
  updateConfig: (partial: Partial<LabConfig>) => void;
  applyPreset: (name: string) => void;
  resetConfig: () => void;
  coreState: CoreState;
  setCoreState: (state: CoreState) => void;
  savedConfigs: LabConfig[];
  saveConfig: () => void;
  savedExperiments: string[];
  toggleSaveExperiment: (id: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
