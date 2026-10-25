import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ChevronDown, RotateCcw, Eye, Zap, Layers } from 'lucide-react';
import { useAppState, type VisualMode, type GeometryType } from '../store';
import * as THREE from 'three';

// ═══════════════════════════════════════════
// 3D NEXUS Core
// ═══════════════════════════════════════════

function NexusCore({ mode, geometry, accentColor, depth, transparency, motionIntensity }: {
  mode: VisualMode;
  geometry: GeometryType;
  accentColor: string;
  depth: number;
  transparency: number;
  motionIntensity: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const speedMultiplier = motionIntensity === 'still' ? 0.1 : motionIntensity === 'kinetic' ? 2 : 1;
  const depthScale = 0.5 + (depth / 100) * 1.5;
  const opacity = transparency / 100;

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  const getGeometry = () => {
    switch (geometry) {
      case 'octahedron': return <octahedronGeometry args={[1.2 * depthScale, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1.2 * depthScale, 0]} />;
      case 'torus': return <torusGeometry args={[1 * depthScale, 0.4 * depthScale, 16, 32]} />;
      default: return <icosahedronGeometry args={[1.2 * depthScale, 1]} />;
    }
  };

  const getMaterial = () => {
    switch (mode) {
      case 'holographic':
        return (
          <MeshDistortMaterial
            color={accentColor}
            distort={0.3}
            speed={2 * speedMultiplier}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={opacity}
          />
        );
      case 'monolithic':
        return (
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.9}
            metalness={0.1}
            transparent
            opacity={opacity}
          />
        );
      case 'aurora':
        return (
          <MeshDistortMaterial
            color={accentColor}
            distort={0.5}
            speed={3 * speedMultiplier}
            roughness={0.2}
            metalness={0.6}
            transparent
            opacity={opacity}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color={accentColor}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={opacity}
            emissive={accentColor}
            emissiveIntensity={0.2}
          />
        );
    }
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speedMultiplier;
    
    // Smooth pointer following
    meshRef.current.rotation.y += (pointer.x * 0.5 - meshRef.current.rotation.y) * 0.02;
    meshRef.current.rotation.x += (-pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    
    // Idle animation
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    
    if (wireRef.current) {
      wireRef.current.rotation.y = meshRef.current.rotation.y + t * 0.1;
      wireRef.current.rotation.x = meshRef.current.rotation.x + t * 0.05;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      particlesRef.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group>
      <Float speed={1.5 * speedMultiplier} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {getGeometry()}
          {getMaterial()}
        </mesh>
        <mesh ref={wireRef} scale={1.3}>
          {getGeometry()}
          <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={accentColor}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={accentColor} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#A477FF" />
      <Environment preset="night" />
    </group>
  );
}

function Scene() {
  const { config, coreState } = useAppState();
  
  // Core state affects visual intensity
  const stateMultiplier = coreState === 'dormant' ? 0.5 : coreState === 'transcendent' ? 1.5 : 1;
  const adjustedDepth = Math.min(100, config.depth * stateMultiplier);
  const adjustedMotion = coreState === 'dormant' ? 'still' : coreState === 'transcendent' ? 'kinetic' : config.motionIntensity;
  
  return (
    <NexusCore
      mode={config.visualMode}
      geometry={config.geometry}
      accentColor={config.accentColor}
      depth={adjustedDepth}
      transparency={config.transparency}
      motionIntensity={adjustedMotion}
    />
  );
}

// ═══════════════════════════════════════════
// Hero Component
// ═══════════════════════════════════════════

const VISUAL_MODES: { id: VisualMode; label: string; icon: React.ReactNode }[] = [
  { id: 'quantum', label: 'Quantum', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'holographic', label: 'Holographic', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'monolithic', label: 'Monolithic', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'aurora', label: 'Aurora', icon: <Zap className="w-3.5 h-3.5" /> },
];

export default function Hero() {
  const { config, updateConfig, resetConfig, coreState, setCoreState } = useAppState();
  const [webglSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch { return false; }
  });

  const handleModeChange = (mode: VisualMode) => {
    updateConfig({ visualMode: mode, isModified: true });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" aria-label="Hero">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void" />

      {/* 3D Canvas */}
      {webglSupported ? (
        <div className="canvas-container">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-cyan/30 rounded-full animate-spin" />
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-cyan/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-ultraviolet/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-cyan/10 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
          {/* Text content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="annotation mb-4">
                <span className="status-dot active mr-2" />
                NEXUS CORE — {coreState.toUpperCase()} STATE
              </p>
            </motion.div>

            <motion.h1
              className="font-display font-bold text-fluid-hero tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              BEYOND<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ultraviolet">
                THE INTERFACE.
              </span>
            </motion.h1>

            <motion.p
              className="text-silver text-fluid-body max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Explore a new dimension of digital interaction. A speculative interface laboratory 
              from 2085 where technology responds to your presence.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <a
                href="#technologies"
                className="px-6 py-3 bg-cyan text-void font-medium text-sm rounded-lg hover:bg-cyan/90 transition-all duration-200 hover:shadow-[0_0_30px_rgba(101,244,255,0.3)]"
              >
                ENTER THE EXPERIENCE
              </a>
              <a
                href="#lab"
                className="px-6 py-3 border border-white/10 text-frost font-medium text-sm rounded-lg hover:border-cyan/30 hover:bg-white/5 transition-all duration-200"
              >
                EXPLORE THE LAB
              </a>
            </motion.div>
          </div>

          {/* Right side controls */}
          <div className="hidden lg:flex flex-col items-end gap-6">
            {/* Visual mode selector */}
            <motion.div
              className="glass rounded-xl p-4 space-y-3 w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="annotation">VISUAL MODE</p>
              <div className="grid grid-cols-2 gap-2">
                {VISUAL_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      config.visualMode === mode.id
                        ? 'bg-cyan/10 text-cyan border border-cyan/30'
                        : 'text-silver hover:text-frost hover:bg-white/5 border border-transparent'
                    }`}
                    aria-pressed={config.visualMode === mode.id}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Core state selector */}
            <motion.div
              className="glass rounded-xl p-4 space-y-3 w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <p className="annotation">CORE STATE</p>
              <div className="flex gap-2">
                {(['dormant', 'active', 'transcendent'] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => setCoreState(state)}
                    className={`flex-1 px-2 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                      coreState === state
                        ? 'bg-cyan/10 text-cyan border border-cyan/30'
                        : 'text-silver hover:text-frost border border-white/5'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Reset button */}
            <motion.button
              onClick={resetConfig}
              className="flex items-center gap-2 text-silver hover:text-frost text-xs transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              aria-label="Reset to default view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset View
            </motion.button>
          </div>
        </div>

        {/* Technical annotations */}
        <motion.div
          className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="annotation">LAT 47.6062° N</span>
          <span className="annotation">CORE v2.085</span>
          <span className="annotation hidden sm:inline">RENDER: ACTIVE</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="annotation text-[10px]">SCROLL</span>
          <ChevronDown className="w-4 h-4 text-silver animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
