import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, X, Maximize2 } from 'lucide-react';
import * as THREE from 'three';

// ═══════════════════════════════════════════
// Spatial Objects
// ═══════════════════════════════════════════

interface SpatialObject {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
  type: 'monument' | 'artifact' | 'beacon' | 'crystal' | 'ring';
}

const SPATIAL_OBJECTS: SpatialObject[] = [
  { id: 'monument', position: [0, 0, 0], label: 'The Monument', description: 'Central architectural structure — the axis of the spatial environment.', type: 'monument' },
  { id: 'crystal-a', position: [-4, 1, -3], label: 'Crystal Alpha', description: 'A refractive formation that captures and redirects ambient light.', type: 'crystal' },
  { id: 'crystal-b', position: [4, 0.5, -2], label: 'Crystal Beta', description: 'Secondary formation with unique spectral properties.', type: 'crystal' },
  { id: 'beacon', position: [3, 2, 3], label: 'Signal Beacon', description: 'Emits rhythmic pulses used for spatial orientation.', type: 'beacon' },
  { id: 'ring', position: [-3, -1, 4], label: 'Orbital Ring', description: 'A rotating structure that defines the environment boundary.', type: 'ring' },
  { id: 'artifact', position: [0, 3, -5], label: 'The Artifact', description: 'An ancient digital relic suspended in the upper atmosphere.', type: 'artifact' },
];

function Monument() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 3, 8]} />
        <meshStandardMaterial color="#191C27" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#65F4FF" emissive="#65F4FF" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]} scale={1.3}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#65F4FF" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function Crystal({ position, color = '#A477FF' }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.7} roughness={0.2} transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

function Beacon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#C9FF64" emissive="#C9FF64" emissiveIntensity={0.5} />
      </mesh>
      <pointLight ref={ref} color="#C9FF64" intensity={1} distance={5} />
    </group>
  );
}

function OrbitalRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1, 0.05, 8, 32]} />
      <meshStandardMaterial color="#65F4FF" emissive="#65F4FF" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function FloatingArtifact({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#FF6B79" emissive="#FF6B79" emissiveIntensity={0.2} metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh scale={1.5}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#FF6B79" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function Particles() {
  const positions = useMemo(() => {
    const count = 300;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#65F4FF" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#07080D" metalness={0.5} roughness={0.8} />
    </mesh>
  );
}

function SceneContent({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <>
      <Monument />
      <Crystal position={[-4, 1, -3]} color="#A477FF" />
      <Crystal position={[4, 0.5, -2]} color="#65F4FF" />
      <Beacon position={[3, 2, 3]} />
      <OrbitalRing position={[-3, -1, 4]} />
      <FloatingArtifact position={[0, 3, -5]} />
      <Particles />
      <Ground />

      {/* Labels */}
      {SPATIAL_OBJECTS.map((obj) => (
        <Text
          key={obj.id}
          position={[obj.position[0], obj.position[1] + 1.5, obj.position[2]]}
          fontSize={0.2}
          color={selectedId === obj.id ? '#65F4FF' : '#9299AD'}
          anchorX="center"
          anchorY="middle"
          onClick={() => onSelect(obj.id)}
        >
          {obj.label}
        </Text>
      ))}

      {/* Clickable areas */}
      {SPATIAL_OBJECTS.map((obj) => (
        <mesh
          key={`click-${obj.id}`}
          position={obj.position}
          onClick={() => onSelect(obj.id)}
          visible={false}
        >
          <sphereGeometry args={[1.2, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <Environment preset="night" />
    </>
  );
}

// ═══════════════════════════════════════════
// Spatial Mode Component
// ═══════════════════════════════════════════

export default function SpatialMode() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [webglSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch { return false; }
  });

  const selectedObject = SPATIAL_OBJECTS.find(o => o.id === selectedId);

  return (
    <section className="relative min-h-screen py-20 sm:py-32" aria-label="Spatial Mode">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="annotation mb-3">SPATIAL MODE</p>
          <h2 className="font-display font-bold text-fluid-h1">
            Immersive<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-lime">Environment</span>
          </h2>
          <p className="text-silver mt-4 max-w-lg text-fluid-body">
            Navigate a spatial digital environment. Select objects to inspect them. 
            Drag to rotate, scroll to zoom.
          </p>
        </div>

        {/* 3D Viewport */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/5 bg-void">
          {webglSupported ? (
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border border-cyan/30 rounded-full animate-spin mx-auto" />
                  <p className="text-silver text-sm">Loading spatial environment...</p>
                </div>
              </div>
            }>
              <Canvas
                camera={{ position: [0, 3, 10], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
              >
                <SceneContent selectedId={selectedId} onSelect={setSelectedId} />
                <OrbitControls
                  enablePan={false}
                  minDistance={5}
                  maxDistance={20}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2.2}
                  enableDamping
                  dampingFactor={0.05}
                />
              </Canvas>
            </Suspense>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center grid-pattern">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto border border-cyan/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 border border-ultraviolet/30 rounded-full" />
                </div>
                <p className="text-silver text-sm">WebGL unavailable — showing simplified view</p>
              </div>
            </div>
          )}

          {/* Overlay info */}
          <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
            <p className="annotation text-[10px]">
              <span className="status-dot active mr-1.5" />
              SPATIAL VIEW — {SPATIAL_OBJECTS.length} OBJECTS
            </p>
          </div>

          {/* Object list */}
          <div className="absolute top-4 right-4 glass rounded-lg p-3 hidden sm:block max-w-48">
            <p className="annotation text-[10px] mb-2">OBJECTS</p>
            <div className="space-y-1">
              {SPATIAL_OBJECTS.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedId(obj.id)}
                  className={`block w-full text-left px-2 py-1 rounded text-[11px] transition-all ${
                    selectedId === obj.id ? 'text-cyan bg-cyan/10' : 'text-silver hover:text-frost'
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected object detail */}
        <AnimatePresence>
          {selectedObject && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 glass rounded-xl p-6 flex items-start justify-between gap-4"
            >
              <div>
                <p className="annotation mb-1">SELECTED</p>
                <h3 className="font-display font-semibold text-lg text-cyan">{selectedObject.label}</h3>
                <p className="text-silver text-sm mt-2">{selectedObject.description}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-silver hover:text-frost transition-colors flex-shrink-0"
                aria-label="Deselect"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile object selector */}
        <div className="mt-4 sm:hidden">
          <p className="annotation mb-2">SELECT OBJECT</p>
          <div className="flex flex-wrap gap-2">
            {SPATIAL_OBJECTS.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedId(obj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  selectedId === obj.id ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-silver border border-white/5'
                }`}
              >
                {obj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls hint */}
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="annotation">DRAG: ROTATE</span>
          <span className="annotation">SCROLL: ZOOM</span>
          <span className="annotation">CLICK: SELECT</span>
        </div>
      </div>
    </section>
  );
}
