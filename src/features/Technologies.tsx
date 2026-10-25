import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Pause, Zap, Layers, Globe, Sun } from 'lucide-react';

// ═══════════════════════════════════════════
// SYNAPSE — Responsive Human-Interface
// ═══════════════════════════════════════════

function Synapse() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const nodes = useMemo(() => [
    { id: 0, x: 50, y: 30, label: 'Input Layer', desc: 'Receives and processes external signals' },
    { id: 1, x: 25, y: 55, label: 'Processing Core', desc: 'Transforms data through adaptive algorithms' },
    { id: 2, x: 75, y: 55, label: 'Response Matrix', desc: 'Generates contextual output patterns' },
    { id: 3, x: 35, y: 80, label: 'Memory Buffer', desc: 'Stores interaction history for learning' },
    { id: 4, x: 65, y: 80, label: 'Output Interface', desc: 'Renders the final user experience' },
    { id: 5, x: 50, y: 55, label: 'Nexus Hub', desc: 'Central coordination of all subsystems' },
  ], []);

  const connections = useMemo(() => [
    [0, 5], [5, 1], [5, 2], [1, 3], [2, 4], [3, 4], [0, 1], [0, 2],
  ], []);

  const triggerPulse = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden bg-obsidian border border-white/5">
        <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Synapse network diagram">
          {/* Connections */}
          {connections.map(([from, to], i) => (
            <line
              key={i}
              x1={nodes[from].x}
              y1={nodes[from].y}
              x2={nodes[to].x}
              y2={nodes[to].y}
              stroke={selectedNode === from || selectedNode === to ? '#65F4FF' : 'rgba(146,153,173,0.2)'}
              strokeWidth={selectedNode === from || selectedNode === to ? 0.3 : 0.15}
              className="transition-all duration-500"
            />
          ))}
          {/* Animated pulse */}
          {animating && connections.map(([from, to], i) => (
            <circle key={`pulse-${i}`} r="0.8" fill="#65F4FF" opacity="0.8">
              <animateMotion
                dur={`${1 + i * 0.2}s`}
                repeatCount="2"
                path={`M${nodes[from].x},${nodes[from].y} L${nodes[to].x},${nodes[to].y}`}
              />
            </circle>
          ))}
          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer" role="button" tabIndex={0} aria-label={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={selectedNode === node.id ? 3.5 : 2.5}
                fill={selectedNode === node.id ? '#65F4FF' : '#191C27'}
                stroke={selectedNode === node.id ? '#65F4FF' : '#9299AD'}
                strokeWidth={0.3}
                className="transition-all duration-300"
              />
              {selectedNode === node.id && (
                <circle cx={node.x} cy={node.y} r="5" fill="none" stroke="#65F4FF" strokeWidth="0.15" opacity="0.5">
                  <animate attributeName="r" from="3" to="7" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fill={selectedNode === node.id ? '#65F4FF' : '#9299AD'}
                fontSize="2.2"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {selectedNode !== null ? (
            <div>
              <p className="text-cyan font-medium">{nodes[selectedNode].label}</p>
              <p className="text-silver text-xs mt-1">{nodes[selectedNode].desc}</p>
            </div>
          ) : (
            <p className="text-silver text-xs">Select a node to explore</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={triggerPulse} className="p-2 rounded-lg bg-white/5 hover:bg-cyan/10 text-silver hover:text-cyan transition-all" aria-label="Trigger pulse animation">
            <Play className="w-4 h-4" />
          </button>
          <button onClick={() => setSelectedNode(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-silver hover:text-frost transition-all" aria-label="Reset selection">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PRISM — Visual Information Processing
// ═══════════════════════════════════════════

function Prism() {
  const [mode, setMode] = useState<'refract' | 'diffuse' | 'converge'>('refract');
  const [intensity, setIntensity] = useState(50);

  const modes = [
    { id: 'refract' as const, label: 'Refract', desc: 'Light splits through prismatic layers creating spectral separation.' },
    { id: 'diffuse' as const, label: 'Diffuse', desc: 'Energy disperses uniformly through translucent surfaces.' },
    { id: 'converge' as const, label: 'Converge', desc: 'Multiple streams focus into a singular luminous point.' },
  ];

  const currentMode = modes.find(m => m.id === mode)!;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden bg-obsidian border border-white/5">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <defs>
            <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#65F4FF" stopOpacity={intensity / 100} />
              <stop offset="50%" stopColor="#A477FF" stopOpacity={intensity / 100} />
              <stop offset="100%" stopColor="#C9FF64" stopOpacity={intensity / 100} />
            </linearGradient>
          </defs>
          
          {mode === 'refract' && (
            <g>
              <polygon points="50,10 35,50 65,50" fill="none" stroke="url(#prism-grad)" strokeWidth="0.5" />
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="20" y1={20 + i * 5} x2="35" y2={30 + i * 3} stroke={`hsl(${180 + i * 30}, 80%, 60%)`} strokeWidth="0.3" opacity={intensity / 100}>
                  <animate attributeName="opacity" values={`${intensity/100};${intensity/200};${intensity/100}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                </line>
              ))}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`out-${i}`} x1="65" y1={30 + i * 3} x2="85" y2={15 + i * 8} stroke={`hsl(${180 + i * 30}, 80%, 60%)`} strokeWidth="0.3" opacity={intensity / 100}>
                  <animate attributeName="opacity" values={`${intensity/100};${intensity/200};${intensity/100}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                </line>
              ))}
            </g>
          )}
          
          {mode === 'diffuse' && (
            <g>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const r = 15 + (intensity / 100) * 10;
                return (
                  <circle
                    key={i}
                    cx={50 + Math.cos(angle) * r}
                    cy={30 + Math.sin(angle) * r}
                    r={2 + (intensity / 100) * 3}
                    fill="none"
                    stroke={`hsl(${200 + i * 15}, 70%, 60%)`}
                    strokeWidth="0.3"
                    opacity={0.5}
                  >
                    <animate attributeName="r" values={`${2};${4 + intensity/50};${2}`} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
              <circle cx="50" cy="30" r="3" fill="url(#prism-grad)" opacity={intensity / 100} />
            </g>
          )}
          
          {mode === 'converge' && (
            <g>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const startR = 25;
                return (
                  <line
                    key={i}
                    x1={50 + Math.cos(angle) * startR}
                    y1={30 + Math.sin(angle) * startR}
                    x2="50"
                    y2="30"
                    stroke={`hsl(${180 + i * 20}, 80%, 60%)`}
                    strokeWidth="0.4"
                    opacity={intensity / 100}
                  >
                    <animate attributeName="opacity" values={`${intensity/100};${intensity/200};${intensity/100}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                  </line>
                );
              })}
              <circle cx="50" cy="30" r={2 + intensity / 30} fill="url(#prism-grad)">
                <animate attributeName="r" values={`${2 + intensity/30};${4 + intensity/20};${2 + intensity/30}`} dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </svg>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === m.id ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-silver hover:text-frost border border-white/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="annotation text-[10px]">INTENSITY</label>
          <input
            type="range"
            min="10"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="flex-1 h-1 appearance-none bg-white/10 rounded-full accent-cyan"
            aria-label="Processing intensity"
          />
          <span className="text-xs text-silver font-mono w-8">{intensity}%</span>
        </div>
        <p className="text-xs text-silver">{currentMode.desc}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ATLAS — Autonomous Network
// ═══════════════════════════════════════════

function Atlas() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [route, setRoute] = useState<number[]>([]);

  const nodes = useMemo(() => [
    { id: 0, x: 15, y: 25, label: 'Alpha', type: 'hub' },
    { id: 1, x: 40, y: 15, label: 'Beta', type: 'relay' },
    { id: 2, x: 70, y: 20, label: 'Gamma', type: 'node' },
    { id: 3, x: 85, y: 45, label: 'Delta', type: 'hub' },
    { id: 4, x: 60, y: 60, label: 'Epsilon', type: 'relay' },
    { id: 5, x: 30, y: 55, label: 'Zeta', type: 'node' },
    { id: 6, x: 50, y: 80, label: 'Eta', type: 'hub' },
    { id: 7, x: 20, y: 75, label: 'Theta', type: 'node' },
    { id: 8, x: 80, y: 75, label: 'Iota', type: 'relay' },
  ], []);

  const edges = useMemo(() => [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[5,6],[6,7],[7,0],[4,8],[8,3],[6,8],[1,5],[2,4],
  ], []);

  const generateRoute = useCallback(() => {
    // Deterministic route generation using BFS-like approach
    const start = Math.floor(Math.random() * nodes.length);
    const end = (start + 3 + Math.floor(Math.random() * 3)) % nodes.length;
    const path = [start];
    const visited = new Set([start]);
    let current = start;
    
    for (let step = 0; step < 5; step++) {
      const neighbors = edges
        .filter(([a, b]) => a === current || b === current)
        .map(([a, b]) => a === current ? b : a)
        .filter(n => !visited.has(n));
      
      if (neighbors.length === 0) break;
      
      // Prefer nodes closer to target
      const target = nodes[end];
      const sorted = neighbors.sort((a, b) => {
        const distA = Math.hypot(nodes[a].x - target.x, nodes[a].y - target.y);
        const distB = Math.hypot(nodes[b].x - target.x, nodes[b].y - target.y);
        return distA - distB;
      });
      
      const next = sorted[0];
      path.push(next);
      visited.add(next);
      current = next;
      if (current === end) break;
    }
    
    if (path[path.length - 1] !== end) path.push(end);
    setRoute(path);
  }, [nodes, edges]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden bg-obsidian border border-white/5">
        <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Atlas network visualization">
          {/* Edges */}
          {edges.map(([from, to], i) => {
            const isRouteEdge = route.some((n, idx) => 
              (n === from && route[idx + 1] === to) || (n === to && route[idx + 1] === from)
            );
            return (
              <line
                key={i}
                x1={nodes[from].x}
                y1={nodes[from].y}
                x2={nodes[to].x}
                y2={nodes[to].y}
                stroke={isRouteEdge ? '#C9FF64' : selectedNode === from || selectedNode === to ? '#65F4FF' : 'rgba(146,153,173,0.15)'}
                strokeWidth={isRouteEdge ? 0.5 : 0.2}
                strokeDasharray={isRouteEdge ? '1,1' : 'none'}
                className="transition-all duration-500"
              />
            );
          })}
          {/* Route animation */}
          {route.length > 1 && (
            <circle r="1" fill="#C9FF64">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={route.map((n, i) => `${i === 0 ? 'M' : 'L'}${nodes[n].x},${nodes[n].y}`).join(' ')}
              />
            </circle>
          )}
          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer" role="button" tabIndex={0} aria-label={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'hub' ? 3 : 2}
                fill={selectedNode === node.id ? '#65F4FF' : route.includes(node.id) ? '#C9FF64' : '#191C27'}
                stroke={selectedNode === node.id ? '#65F4FF' : route.includes(node.id) ? '#C9FF64' : '#9299AD'}
                strokeWidth="0.3"
                className="transition-all duration-300"
              />
              <text x={node.x} y={node.y - 4} textAnchor="middle" fill="#9299AD" fontSize="2" fontFamily="monospace">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {selectedNode !== null ? (
            <div>
              <p className="text-cyan font-medium">{nodes[selectedNode].label} <span className="text-silver text-xs">({nodes[selectedNode].type})</span></p>
              <p className="text-silver text-xs mt-1">Node {selectedNode} — {edges.filter(([a,b]) => a === selectedNode || b === selectedNode).length} connections</p>
            </div>
          ) : route.length > 0 ? (
            <p className="text-lime text-xs">Route: {route.map(r => nodes[r].label).join(' → ')}</p>
          ) : (
            <p className="text-silver text-xs">Select nodes or generate a route</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={generateRoute} className="p-2 rounded-lg bg-white/5 hover:bg-lime/10 text-silver hover:text-lime transition-all" aria-label="Generate route">
            <Zap className="w-4 h-4" />
          </button>
          <button onClick={() => { setRoute([]); setSelectedNode(null); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-silver hover:text-frost transition-all" aria-label="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LUMEN — Adaptive Environment
// ═══════════════════════════════════════════

function Lumen() {
  const [preset, setPreset] = useState<'dawn' | 'deep' | 'aurora' | 'void'>('dawn');

  const presets = {
    dawn: { bg: 'from-orange-900/20 via-rose-900/10 to-obsidian', accent: '#FF9F43', label: 'Dawn', desc: 'Warm emergence, gentle gradients of amber and rose.' },
    deep: { bg: 'from-blue-900/30 via-indigo-900/20 to-obsidian', accent: '#4A9EFF', label: 'Deep Ocean', desc: 'Cool depths with bioluminescent undertones.' },
    aurora: { bg: 'from-green-900/20 via-teal-900/10 to-obsidian', accent: '#C9FF64', label: 'Aurora', desc: 'Northern lights dancing across digital horizons.' },
    void: { bg: 'from-purple-900/20 via-violet-900/10 to-obsidian', accent: '#A477FF', label: 'Void', desc: 'The space between stars, absolute and infinite.' },
  };

  const current = presets[preset];

  return (
    <div className="space-y-4">
      <div className={`relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden border border-white/5 bg-gradient-to-br ${current.bg} transition-all duration-1000`}>
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Atmospheric layers */}
          {[0, 1, 2, 3, 4].map(i => (
            <ellipse
              key={i}
              cx={50 + Math.sin(i * 1.5) * 15}
              cy={30 + i * 5}
              rx={30 - i * 3}
              ry={8 - i}
              fill="none"
              stroke={current.accent}
              strokeWidth="0.2"
              opacity={0.3 - i * 0.05}
            >
              <animate attributeName="rx" values={`${30 - i * 3};${32 - i * 3};${30 - i * 3}`} dur={`${4 + i}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
          {/* Central light source */}
          <circle cx="50" cy="25" r="5" fill={current.accent} opacity="0.3">
            <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="25" r="2" fill={current.accent} opacity="0.8" />
          {/* Horizon line */}
          <line x1="10" y1="45" x2="90" y2="45" stroke={current.accent} strokeWidth="0.2" opacity="0.3" />
          {/* Reflection particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              cx={20 + i * 12}
              cy={48 + Math.sin(i) * 3}
              r="0.5"
              fill={current.accent}
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPreset(key as typeof preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === key ? 'border border-cyan/30 text-cyan bg-cyan/5' : 'text-silver hover:text-frost border border-white/5'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-silver">{current.desc}</p>
        <button
          onClick={() => setPreset('dawn')}
          className="flex items-center gap-1.5 text-xs text-silver hover:text-frost transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Dawn
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Technologies Section
// ═══════════════════════════════════════════

const TECH_ITEMS = [
  { id: 'synapse', label: 'SYNAPSE', subtitle: 'Responsive Human-Interface', icon: <Layers className="w-4 h-4" />, component: Synapse },
  { id: 'prism', label: 'PRISM', subtitle: 'Visual Information Processing', icon: <Zap className="w-4 h-4" />, component: Prism },
  { id: 'atlas', label: 'ATLAS', subtitle: 'Autonomous Network', icon: <Globe className="w-4 h-4" />, component: Atlas },
  { id: 'lumen', label: 'LUMEN', subtitle: 'Adaptive Environment', icon: <Sun className="w-4 h-4" />, component: Lumen },
];

export default function Technologies() {
  const [activeTech, setActiveTech] = useState('synapse');
  const ActiveComponent = TECH_ITEMS.find(t => t.id === activeTech)?.component || Synapse;

  return (
    <section id="technologies" className="relative py-20 sm:py-32" aria-label="Technology Explorer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="annotation mb-3">TECHNOLOGY EXPLORER</p>
          <h2 className="font-display font-bold text-fluid-h1">
            Experimental<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ultraviolet">Interfaces</span>
          </h2>
          <p className="text-silver mt-4 max-w-lg text-fluid-body">
            Four speculative technology concepts exploring the boundaries of digital interaction. 
            Each demonstrates a different approach to responsive, adaptive interfaces.
          </p>
        </div>

        {/* Tech selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TECH_ITEMS.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setActiveTech(tech.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTech === tech.id
                  ? 'glass text-cyan border-cyan/20 glow-cyan'
                  : 'text-silver hover:text-frost hover:bg-white/5 border border-white/5'
              }`}
              aria-pressed={activeTech === tech.id}
            >
              {tech.icon}
              <span className="hidden sm:inline">{tech.label}</span>
              <span className="sm:hidden">{tech.label.slice(0, 3)}</span>
            </button>
          ))}
        </div>

        {/* Active technology */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTech}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <ActiveComponent />
            </div>
            <div className="glass rounded-xl p-6 space-y-4">
              <div>
                <p className="annotation mb-2">CONCEPT</p>
                <h3 className="font-display font-semibold text-lg">
                  {TECH_ITEMS.find(t => t.id === activeTech)?.label}
                </h3>
                <p className="text-silver text-sm mt-1">
                  {TECH_ITEMS.find(t => t.id === activeTech)?.subtitle}
                </p>
              </div>
              <div className="separator" />
              <div>
                <p className="annotation mb-2">STATUS</p>
                <p className="text-xs text-silver">
                  <span className="status-dot active mr-2" />
                  Interactive demonstration
                </p>
              </div>
              <div className="separator" />
              <div>
                <p className="annotation mb-2">CLASSIFICATION</p>
                <p className="text-xs text-silver">
                  Speculative interface concept — not a deployed technology. 
                  Demonstrates potential directions for human-computer interaction research.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
