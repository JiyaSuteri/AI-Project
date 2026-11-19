import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Users, User, Clock, AlertCircle, RefreshCw, Eye } from 'lucide-react';

// Status color mapping for 3D meshes
const STATUS_COLORS = {
  AVAILABLE: {
    hex: '#55745E',
    darkHex: '#6E9A7B',
    emissive: '#1F2A23',
    label: 'Available',
    border: 'border-[#55745E]/30',
  },
  OCCUPIED: {
    hex: '#D97706',
    darkHex: '#F59E0B',
    emissive: '#451A03',
    label: 'Occupied',
    border: 'border-amber-400',
  },
  RESERVED: {
    hex: '#7C3AED',
    darkHex: '#8B5CF6',
    emissive: '#2E1065',
    label: 'Reserved',
    border: 'border-violet-400',
  },
  CLEANING: {
    hex: '#0284C7',
    darkHex: '#0EA5E9',
    emissive: '#082F49',
    label: 'Cleaning',
    border: 'border-sky-400',
  },
};

// Fallback visualization coordinates for the 14 restaurant tables
// Grouped into realistic dining zones
const TABLE_COORDINATES = {
  1: { x: -6.5, z: -4.0, shape: 'round', section: 'Main Hall' },
  2: { x: -2.2, z: -4.0, shape: 'round', section: 'Main Hall' },
  3: { x: 2.2, z: -4.0, shape: 'rect', section: 'Main Hall' },
  4: { x: 6.5, z: -4.0, shape: 'rect', section: 'Main Hall' },
  5: { x: -6.5, z: 0.0, shape: 'rect', section: 'Window Bay' },
  6: { x: -2.2, z: 0.0, shape: 'round', section: 'Window Bay' },
  7: { x: 2.2, z: 0.0, shape: 'round', section: 'Window Bay' },
  8: { x: 6.5, z: 0.0, shape: 'rect', section: 'Patio Terrace' },
  9: { x: -6.5, z: 4.2, shape: 'round', section: 'Patio Terrace' },
  10: { x: -2.2, z: 4.2, shape: 'rect', section: 'Patio Terrace' },
  11: { x: 2.2, z: 4.2, shape: 'rect', section: 'Private Booth' },
  12: { x: 6.5, z: 4.2, shape: 'round', section: 'Private Booth' },
  13: { x: -4.4, z: 8.0, shape: 'rect', section: 'Chef Table' },
  14: { x: 4.4, z: 8.0, shape: 'rect', section: 'Chef Table' },
};

function Chair({ position, rotation, isDark }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.5]} />
        <meshStandardMaterial
          color={isDark ? '#2D3A32' : '#E2DDD4'}
          roughness={0.7}
        />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.85, -0.22]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.06]} />
        <meshStandardMaterial
          color={isDark ? '#26332B' : '#D0C9BE'}
          roughness={0.6}
        />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.22, 0.22, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.45]} />
        <meshStandardMaterial color={isDark ? '#18201B' : '#736B5E'} metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.22, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.45]} />
        <meshStandardMaterial color={isDark ? '#18201B' : '#736B5E'} metalness={0.3} />
      </mesh>
      <mesh position={[-0.22, 0.22, 0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.45]} />
        <meshStandardMaterial color={isDark ? '#18201B' : '#736B5E'} metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.22, 0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.45]} />
        <meshStandardMaterial color={isDark ? '#18201B' : '#736B5E'} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Table3D({ table, isHovered, onHover, onSelect, isDark }) {
  const meshRef = useRef();
  const coord = TABLE_COORDINATES[table.id] || {
    x: ((table.id - 1) % 4) * 4.2 - 6,
    z: Math.floor((table.id - 1) / 4) * 4.0 - 4,
    shape: table.capacity > 4 ? 'rect' : 'round',
    section: table.location || 'Dining Room',
  };

  const statusConfig = STATUS_COLORS[table.status] || STATUS_COLORS.AVAILABLE;
  const tableColor = isDark ? statusConfig.darkHex : statusConfig.hex;

  // Gentle breathing animation for occupied / cleaning tables
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (table.status === 'OCCUPIED' || isHovered) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = isHovered ? 0.15 : Math.sin(t * 2 + table.id) * 0.04;
    } else {
      meshRef.current.position.y = 0;
    }
  });

  // Calculate chair positions around table
  const chairs = useMemo(() => {
    const list = [];
    const count = Math.min(table.capacity || 4, 8);
    const radius = coord.shape === 'rect' ? 1.4 : 1.25;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const cx = Math.sin(angle) * radius;
      const cz = Math.cos(angle) * radius;
      list.push({
        position: [cx, 0, cz],
        rotation: [0, angle + Math.PI, 0],
      });
    }
    return list;
  }, [table.capacity, coord.shape]);

  const isRect = coord.shape === 'rect';

  return (
    <group
      position={[coord.x, 0, coord.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(table);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(table.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <group ref={meshRef}>
        {/* Table Top Surface */}
        {isRect ? (
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.12, 1.4]} />
            <meshStandardMaterial
              color={tableColor}
              roughness={0.3}
              metalness={0.15}
              emissive={isHovered ? tableColor : statusConfig.emissive}
              emissiveIntensity={isHovered ? 0.35 : 0.08}
            />
          </mesh>
        ) : (
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.12, 32]} />
            <meshStandardMaterial
              color={tableColor}
              roughness={0.3}
              metalness={0.15}
              emissive={isHovered ? tableColor : statusConfig.emissive}
              emissiveIntensity={isHovered ? 0.35 : 0.08}
            />
          </mesh>
        )}

        {/* Central Pedestal / Legs */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.22, 0.9, 16]} />
          <meshStandardMaterial color={isDark ? '#26332B' : '#8A8275'} metalness={0.4} />
        </mesh>
        {/* Pedestal Base */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.06, 24]} />
          <meshStandardMaterial color={isDark ? '#1F2A23' : '#686053'} metalness={0.3} />
        </mesh>

        {/* Center Tabletop Decal / Dishware marker */}
        <mesh position={[0, 0.97, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          <meshStandardMaterial color={isDark ? '#FFFFFF' : '#FAF7F2'} opacity={0.8} transparent />
        </mesh>
      </group>

      {/* Chairs around table */}
      {chairs.map((c, idx) => (
        <Chair key={idx} position={c.position} rotation={c.rotation} isDark={isDark} />
      ))}

      {/* Table Label Badge Floating Above */}
      <Html position={[0, 1.6, 0]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div
          className={`pointer-events-none select-none px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-md transition-all duration-200 ${
            isHovered ? 'scale-125' : 'scale-100'
          } ${
            isDark
              ? 'bg-[#18201B]/90 text-[#F3EFEA] border border-[#2A382F]'
              : 'bg-white/95 text-[#28352D] border border-[#E8E3DA]'
          }`}
        >
          {table.table_number}
        </div>
      </Html>

      {/* Hover Information Tooltip */}
      {isHovered && (
        <Html position={[0, 2.5, 0]} center distanceFactor={11} zIndexRange={[200, 0]}>
          <div
            className={`w-48 p-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-in fade-in duration-150 ${
              isDark
                ? 'bg-[#18201B]/95 border-[#2A382F] text-[#F3EFEA]'
                : 'bg-white/95 border-[#E8E3DA] text-[#28352D]'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800">
              <span className="font-bold text-xs">{table.table_number} • {coord.section}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                  table.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : table.status === 'OCCUPIED'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : table.status === 'RESERVED'
                    ? 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300'
                    : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                }`}
              >
                {statusConfig.label}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-[11px] leading-tight">
              <div className="flex items-center justify-between text-stone-500 dark:text-[#98A89E]">
                <span>Capacity:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{table.capacity} Guests</span>
              </div>
              <div className="flex items-center justify-between text-stone-500 dark:text-[#98A89E]">
                <span>Waiter:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{table.waiter_name || 'Unassigned'}</span>
              </div>
              {table.group_name && (
                <div className="flex items-center justify-between text-stone-500 dark:text-[#98A89E]">
                  <span>Seated:</span>
                  <span className="font-semibold text-[#C47A59] dark:text-[#DC8A66] truncate max-w-[90px]">
                    {table.group_name}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-800 text-[10px] text-center text-[#55745E] dark:text-[#6E9A7B] font-semibold">
              Click to manage seating &amp; service →
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Isometric Restaurant Floor Room Mesh
function RestaurantRoom({ isDark }) {
  return (
    <group position={[0, -0.01, 2]}>
      {/* Floor surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial
          color={isDark ? '#141B16' : '#F5F1E8'}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Decorative Perimeter Wall Bases / Low partitions */}
      <mesh position={[0, 0.4, -9.5]} receiveShadow>
        <boxGeometry args={[26, 0.8, 0.3]} />
        <meshStandardMaterial color={isDark ? '#1F2A23' : '#E5DFD4'} roughness={0.7} />
      </mesh>
      <mesh position={[-12.8, 0.4, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.8, 22]} />
        <meshStandardMaterial color={isDark ? '#1F2A23' : '#E5DFD4'} roughness={0.7} />
      </mesh>
      <mesh position={[12.8, 0.4, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.8, 22]} />
        <meshStandardMaterial color={isDark ? '#1F2A23' : '#E5DFD4'} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Error Boundary fallback for systems without WebGL
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('WebGL 3D Floor Plan rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-stone-50 dark:bg-[#18201B] rounded-2xl border border-stone-200 dark:border-stone-800">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="font-semibold text-sm">3D View Unavailable</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your browser or device does not have hardware WebGL acceleration enabled. Switch to 2D view above for the full interactive floor map.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FloorPlan3D({ tables, onSelectTable, isDark, filter = 'ALL' }) {
  const [hoveredTableId, setHoveredTableId] = useState(null);
  const controlsRef = useRef();

  const filteredTables = useMemo(() => {
    if (filter === 'ALL') return tables;
    return tables.filter((t) => t.status === filter);
  }, [tables, filter]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <WebGLErrorBoundary>
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF7F2] to-[#ECE5D8] dark:from-[#111613] dark:to-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] shadow-inner">
        {/* Top Controls Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/90 dark:bg-[#1F2A23]/90 text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs hover:bg-white dark:hover:bg-[#1F2A23] transition-all cursor-pointer"
            title="Reset to default isometric camera angle"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
            <span>Reset View</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-white/80 dark:bg-[#1F2A23]/80 border border-[#E8E3DA] dark:border-[#2A382F] text-stone-600 dark:text-[#98A89E]">
            <Eye className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
            <span>Drag to rotate • Scroll to zoom • Click table to manage</span>
          </div>
        </div>

        {/* 3D Canvas */}
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-stone-500 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#55745E]" />
              <span>Rendering 3D Dining Space...</span>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [0, 18, 22], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            {/* Ambient & Directional Lighting */}
            <ambientLight intensity={isDark ? 0.75 : 0.9} />
            <directionalLight
              position={[12, 24, 14]}
              intensity={isDark ? 1.0 : 1.35}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={60}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
            />
            <pointLight position={[-8, 10, -5]} intensity={isDark ? 0.4 : 0.6} color="#FDF6E2" />

            {/* Orbit Controls (Constrained for restaurant viewing) */}
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              minDistance={10}
              maxDistance={38}
              maxPolarAngle={Math.PI / 2.3}
              minPolarAngle={Math.PI / 6}
              target={[0, 0, 1.5]}
            />

            {/* Room Architecture */}
            <RestaurantRoom isDark={isDark} />

            {/* Render 3D Tables */}
            {filteredTables.map((table) => (
              <Table3D
                key={table.id}
                table={table}
                isHovered={hoveredTableId === table.id}
                onHover={setHoveredTableId}
                onSelect={onSelectTable}
                isDark={isDark}
              />
            ))}
          </Canvas>
        </Suspense>
      </div>
    </WebGLErrorBoundary>
  );
}
