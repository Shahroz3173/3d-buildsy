import { useRef } from 'react'
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import { useScroll, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { PaintRevealMaterial } from '../../shaders/PaintRevealMaterial'
import { DOORS } from '../../data/content'

extend({ PaintRevealMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      paintRevealMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof PaintRevealMaterial>
    }
  }
}

// ── Section door at end of corridor ──────────────────────────────────────────
function SectionDoor({ position, title, icon, color, onOpen, isDark }: any) {
  const matRef = useRef<any>(null)
  const doorRef = useRef<THREE.Group>(null)
  const hovRef = useRef(false)

  useFrame((_, d) => {
    if (matRef.current) {
      matRef.current.uTime += d
      const t = hovRef.current ? 1 : 0
      matRef.current.uReveal = THREE.MathUtils.lerp(matRef.current.uReveal ?? 0, t, d * 5)
    }
    if (doorRef.current)
      doorRef.current.scale.setScalar(THREE.MathUtils.lerp(doorRef.current.scale.x, hovRef.current ? 1.04 : 1.0, d * 7))
  })

  return (
    <group
      ref={doorRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); hovRef.current = true; document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { hovRef.current = false; document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onOpen?.() }}
    >
      {/* Outer frame */}
      <mesh position={[0, 1.6, -0.03]}><planeGeometry args={[3.2, 5.8]} /><meshBasicMaterial color="#5c3d1e" /></mesh>
      {/* Canvas / door panel */}
      <mesh position={[0, 1.6, 0]}>
        <planeGeometry args={[2.8, 5.4]} />
        <paintRevealMaterial ref={matRef} transparent uColorPainted={new THREE.Color(color)} uColorSketch={new THREE.Color('#2b2b2b')} />
      </mesh>
      {/* Title */}
      <Text position={[0, 3.8, 0.06]} fontSize={0.38} color={isDark ? '#f0e8d0' : '#2b2b2b'} anchorX="center" anchorY="middle" maxWidth={2.5} textAlign="center" letterSpacing={0.04}>
        {title}
      </Text>
      {/* Icon */}
      <Text position={[0, 2.2, 0.06]} fontSize={0.8} anchorX="center" anchorY="middle">{icon}</Text>
      {/* Handle */}
      <mesh position={[0.5, 1.5, 0.12]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#c47c27" /></mesh>
    </group>
  )
}

// ── Hanging lamp ──────────────────────────────────────────────────────────────
function HangingLamp({ position }: { position: [number, number, number] }) {
  const gRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (gRef.current) gRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.05
  })
  return (
    <group position={position} ref={gRef}>
      <mesh><cylinderGeometry args={[0.02, 0.02, 1.2, 6]} /><meshBasicMaterial color="#444" /></mesh>
      <mesh position={[0, -0.9, 0]}><coneGeometry args={[0.4, 0.55, 10, 1, true]} /><meshBasicMaterial color="#DAC090" side={THREE.DoubleSide} /></mesh>
      <pointLight position={[0, -1.1, 0]} intensity={1.2} color="#fff5c0" distance={8} decay={2} />
    </group>
  )
}

// ── Tile pattern on corridor walls ────────────────────────────────────────────
function WallTilePattern({ position, rotation, w, h, isDark }: any) {
  const tileColors = isDark
    ? ['#303028','#282824','#383830','#302c28']
    : ['#e8dcc8','#d4c8b0','#f0e8d8','#c8bca8']
  const cols = Math.floor(w / 0.9)
  const rows = Math.floor(h / 0.9)
  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial color={isDark ? '#1e1e18' : '#EAE6DC'} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <mesh key={`${r}-${c}`} position={[-w/2 + c*0.9 + 0.45, -h/2 + r*0.9 + 0.45, 0.01]}>
            <planeGeometry args={[0.84, 0.84]} />
            <meshBasicMaterial color={tileColors[(r + c) % 4]} />
          </mesh>
        ))
      )}
    </group>
  )
}

// ── Main corridor ─────────────────────────────────────────────────────────────
export default function Corridor({ onSectionOpen, isDark }: { onSectionOpen: (id: string) => void; isDark?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const TOTAL_Z = 80

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const target = scroll.offset * TOTAL_Z
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, target, delta * 5)
    state.camera.position.y = 1.6 + Math.sin(scroll.offset * Math.PI * 10) * 0.08
  })

  const DOOR_Z_POSITIONS = [-10, -20, -30, -42, -54, -64, -74]

  return (
    <group ref={groupRef}>
      {/* ── CORRIDOR SHELL ── */}
      {/* Floor — tiled */}
      <WallTilePattern position={[0, 0.02, -40]} rotation={[-Math.PI / 2, 0, 0]} w={8} h={88} isDark={isDark} />
      {/* Ceiling */}
      <mesh position={[0, 5.5, -40]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 88]} />
        <meshBasicMaterial color={isDark ? '#1a1a16' : '#EAE6DC'} />
      </mesh>
      {/* Left wall */}
      <WallTilePattern position={[-4, 2.75, -40]} rotation={[0, Math.PI / 2, 0]} w={88} h={5.5} isDark={isDark} />
      {/* Right wall */}
      <WallTilePattern position={[4, 2.75, -40]} rotation={[0, -Math.PI / 2, 0]} w={88} h={5.5} isDark={isDark} />
      {/* Baseboard left */}
      <mesh position={[-3.95, 0.15, -40]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[88, 0.3]} />
        <meshBasicMaterial color="#8B5E3C" />
      </mesh>
      {/* Baseboard right */}
      <mesh position={[3.95, 0.15, -40]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[88, 0.3]} />
        <meshBasicMaterial color="#8B5E3C" />
      </mesh>

      {/* ── Lamps ── */}
      {[-8, -25, -45, -65].map(z => <HangingLamp key={z} position={[0, 5.5, z]} />)}

      {/* ── Section Doors (alternating sides) ── */}
      {DOORS.map((door, i) => {
        const z = DOOR_Z_POSITIONS[i]
        const side = i % 2 === 0 ? -3.5 : 3.5
        const rotY = i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2
        return (
          <group key={door.id}>
            <SectionDoor
              position={[side, 0, z]}
              rotation={[0, rotY, 0]}
              title={door.label}
              icon={door.icon}
              color={door.color}
              isDark={isDark}
              onOpen={() => onSectionOpen(door.id)}
            />
            {/* Label on opposite wall */}
            <Html
              position={[-side * 0.8, 2.5, z]}
              rotation={[0, i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
              center
              style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: '18px',
                color: isDark ? '#e0d8c8' : '#2b2b2b',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: 0.7,
              }}
            >
              {door.icon} {door.label}
            </Html>
          </group>
        )
      })}

      {/* ── End wall ── */}
      <mesh position={[0, 2.75, -82]}>
        <planeGeometry args={[8, 5.5]} />
        <meshBasicMaterial color={isDark ? '#1e1e18' : '#EAE6DC'} />
      </mesh>
      <Text position={[0, 3.6, -81.8]} fontSize={0.8} color={isDark ? '#e0d8c8' : '#2b2b2b'} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        BUILDsy
      </Text>
      <Text position={[0, 2.5, -81.8]} fontSize={0.28} color={isDark ? '#a8a49a' : '#5a5650'} anchorX="center" anchorY="middle" maxWidth={5} textAlign="center" lineHeight={1.5}>
        {'Tiles & Sanitaryware · Dehradun\nhello@buildsy.in'}
      </Text>
    </group>
  )
}
