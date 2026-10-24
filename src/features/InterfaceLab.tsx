import React, { useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, Save, Check, Sliders } from 'lucide-react';
import { useAppState, PRESETS, ACCENT_COLORS, type LabConfig, type VisualMode, type GeometryType } from '../store';
import * as THREE from 'three';

// ═══════════════════════════════════════════
// Preview 3D Scene
// ═══════════════════════════════════════════

function LabPreview({ config }: { config: LabConfig }) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const speed = config.motionIntensity === 'still' ? 0.1 : config.motionIntensity === 'kinetic' ? 2.5 : 1;
  const depthScale = 0.5 + (config.depth / 100) * 1.5;
  const opacity = config.transparency / 100;

  const getGeometry = () => {
    switch (config.geometry) {
      case 'octahedron': return <octahedronGeometry args={[1.2 * depthScale, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1.2 * depthScale, 0]} />;
      case 'torus': return <torusGeometry args={[1 * depthScale, 0.4 * depthScale, 16, 32]} />;
      default: return <icosahedronGeometry args={[1.2 * depthScale, 1]} />;
    }
  };

  const getMaterial = () => {
    switch (config.visualMode) {
      case 'holographic':
        return <MeshDistortMaterial color={config.accentColor} distort={0.4} speed={2 * speed} roughness={0.1} metalness={0.8} transparent opacity={opacity} />;
      case 'monolithic':
        return <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} transparent opacity={opacity} />;
      case 'aurora':
        return <MeshDistortMaterial color={config.accentColor} distort={0.6} speed={3 * speed} roughness={0.2} metalness={0.6} transparent opacity={opacity} />;
      default:
        return <meshStandardMaterial color={config.accentColor} roughness={0.3} metalness={0.7} transparent opacity={opacity} emissive={config.accentColor} emissiveIntensity={0.3} />;
    }
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.3;
  });

  return (
    <>
      <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {getGeometry()}
          {getMaterial()}
        </mesh>
      </Float>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color={config.accentColor} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#A477FF" />
      <Environment preset="night" />
    </>
  );
}

function PreviewScene() {
  const { config } = useAppState();
  const [webglSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch { return false; }
  });

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-obsidian rounded-xl border border-white/5">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full border-2 transition-all duration-500" style={{ borderColor: config.accentColor, opacity: config.transparency / 100 }} />
          <p className="text-silver text-sm">WebGL unavailable — showing simplified preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/5">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-obsidian">
          <div className="w-12 h-12 border border-cyan/30 rounded-full animate-spin" />
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <LabPreview config={config} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// ═══════════════════════════════════════════
// Controls Panel
// ═══════════════════════════════════════════

function Slider({ label, value, min, max, step, onChange, unit }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="annotation text-[10px]">{label}</label>
        <span className="text-xs text-silver font-mono">{value}{unit || ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none bg-white/10 rounded-full accent-cyan cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

function ControlsPanel() {
  const { config, updateConfig, applyPreset, resetConfig, saveConfig, savedConfigs } = useAppState();
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handlePreset = (name: string) => {
    applyPreset(name);
    setActivePreset(name);
  };

  const handleSave = () => {
    saveConfig();
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  const handleChange = (partial: Partial<LabConfig>) => {
    updateConfig(partial);
    setActivePreset(null);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-3">
        <p className="annotation">PRESETS</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => handlePreset(name)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                activePreset === name
                  ? 'bg-cyan/10 text-cyan border border-cyan/30'
                  : 'text-silver hover:text-frost border border-white/5 hover:border-white/10'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Mode */}
      <div className="space-y-3">
        <p className="annotation">VISUAL MODE</p>
        <div className="grid grid-cols-2 gap-2">
          {(['quantum', 'holographic', 'monolithic', 'aurora'] as VisualMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleChange({ visualMode: mode })}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                config.visualMode === mode
                  ? 'bg-cyan/10 text-cyan border border-cyan/30'
                  : 'text-silver hover:text-frost border border-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <p className="annotation">ACCENT COLOR</p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleChange({ accentColor: color.value })}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                config.accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-obsidian scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Motion */}
      <div className="space-y-3">
        <p className="annotation">MOTION INTENSITY</p>
        <div className="flex gap-2">
          {(['still', 'balanced', 'kinetic'] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleChange({ motionIntensity: level })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                config.motionIntensity === level
                  ? 'bg-cyan/10 text-cyan border border-cyan/30'
                  : 'text-silver hover:text-frost border border-white/5'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Geometry */}
      <div className="space-y-3">
        <p className="annotation">GEOMETRY</p>
        <div className="grid grid-cols-2 gap-2">
          {(['icosahedron', 'octahedron', 'dodecahedron', 'torus'] as GeometryType[]).map((geo) => (
            <button
              key={geo}
              onClick={() => handleChange({ geometry: geo })}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                config.geometry === geo
                  ? 'bg-cyan/10 text-cyan border border-cyan/30'
                  : 'text-silver hover:text-frost border border-white/5'
              }`}
            >
              {geo}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <Slider label="DEPTH" value={config.depth} min={10} max={100} step={5} onChange={(v) => handleChange({ depth: v })} unit="%" />
        <Slider label="TRANSPARENCY" value={config.transparency} min={10} max={100} step={5} onChange={(v) => handleChange({ transparency: v })} unit="%" />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={resetConfig}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-silver hover:text-frost border border-white/5 hover:border-white/10 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            saveConfirm
              ? 'bg-lime/10 text-lime border border-lime/30'
              : 'bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20'
          }`}
        >
          {saveConfirm ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saveConfirm ? 'Saved!' : 'Save Config'}
        </button>
      </div>

      {/* Modified indicator */}
      {config.isModified && !activePreset && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-ultraviolet"
        >
          ✦ Configuration modified from preset
        </motion.p>
      )}

      {/* Saved configs count */}
      {savedConfigs.length > 0 && (
        <p className="text-xs text-silver">
          {savedConfigs.length} saved configuration{savedConfigs.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Interface Lab
// ═══════════════════════════════════════════

export default function InterfaceLab() {
  const { config } = useAppState();
  return (
    <section id="lab" className="relative py-20 sm:py-32" aria-label="Interface Lab">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="annotation mb-3">INTERFACE LAB</p>
          <h2 className="font-display font-bold text-fluid-h1">
            Customize the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultraviolet to-cyan">Experience</span>
          </h2>
          <p className="text-silver mt-4 max-w-lg text-fluid-body">
            Experiment with visual modes, materials, motion, and geometry. 
            Every change updates the preview in real-time.
          </p>
        </div>

        {/* Lab workspace */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="aspect-square sm:aspect-[4/3] lg:aspect-[16/10]">
              <PreviewScene />
            </div>
            {/* Current config readout */}
            <div className="mt-4 glass rounded-xl p-4">
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="annotation">MODE: <span className="text-cyan ml-1">{config.visualMode.toUpperCase()}</span></span>
                <span className="annotation">GEO: <span className="text-cyan ml-1">{config.geometry.toUpperCase()}</span></span>
                <span className="annotation">MOTION: <span className="text-cyan ml-1">{config.motionIntensity.toUpperCase()}</span></span>
                <span className="annotation">DEPTH: <span className="text-cyan ml-1">{config.depth}%</span></span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-4 h-4 text-cyan" />
                <p className="font-display font-medium text-sm">Controls</p>
              </div>
              <ControlsPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
