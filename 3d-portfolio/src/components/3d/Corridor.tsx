import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { DOORS } from '../../data/content'

// ── Recessed section door fitted into the corridor wall ──────────────────────
function SectionDoor({ position, rotation, title, color, onOpen, isDark }: any) {
  const doorMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const hovRef = useRef(false)

  useFrame((_, d) => {
    if (doorMaterial.current)
      doorMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(doorMaterial.current.emissiveIntensity, hovRef.current ? 0.18 : 0, d * 5)
  })

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); hovRef.current = true; document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { hovRef.current = false; document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onOpen?.() }}
    >
      {/* Slim jambs and lintel sit in the wall plane, with a shallow reveal. */}
      <mesh position={[-1.42, 2.15, 0.015]}><boxGeometry args={[0.14, 4.3, 0.12]} /><meshStandardMaterial color="#d0b58e" roughness={0.48} /></mesh>
      <mesh position={[1.42, 2.15, 0.015]}><boxGeometry args={[0.14, 4.3, 0.12]} /><meshStandardMaterial color="#d0b58e" roughness={0.48} /></mesh>
      <mesh position={[0, 4.23, 0.015]}><boxGeometry args={[2.98, 0.16, 0.12]} /><meshStandardMaterial color="#d0b58e" roughness={0.48} /></mesh>
      {/* Solid wooden leaf is flush with the inner wall surface. */}
      <mesh position={[0, 2.08, 0.045]}>
        <boxGeometry args={[2.68, 4.08, 0.09]} />
        <meshStandardMaterial ref={doorMaterial} color="#765638" roughness={0.42} metalness={0.04} emissive="#d6a766" />
      </mesh>
      {/* Three restrained inset panels */}
      {[3.18, 2.03, 0.88].map((y) => (
        <mesh key={y} position={[0, y, 0.105]}>
          <boxGeometry args={[2.18, 0.82, 0.025]} />
          <meshStandardMaterial color="#684a32" roughness={0.52} />
        </mesh>
      ))}
      {/* Simple brass lever and a small room plaque above the frame */}
      <mesh position={[1.02, 2.04, 0.14]}><boxGeometry args={[0.22, 0.055, 0.045]} /><meshStandardMaterial color="#bd9255" metalness={0.72} roughness={0.25} /></mesh>
      <mesh position={[0, 4.67, 0.08]}><boxGeometry args={[2.72, 0.42, 0.09]} /><meshStandardMaterial color={isDark ? '#29251f' : '#eee4d2'} roughness={0.55} /></mesh>
      <mesh position={[-1.27, 4.67, 0.135]}><boxGeometry args={[0.055, 0.3, 0.018]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
      <Text position={[0.05, 4.67, 0.14]} fontSize={0.17} color={isDark ? '#f0e8d0' : '#3a3026'} anchorX="center" anchorY="middle" maxWidth={2.35} textAlign="center" letterSpacing={0.015}>
        {title}
      </Text>
    </group>
  )
}

// ── Hanging lamp ──────────────────────────────────────────────────────────────
function HangingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.055, 24]} />
        <meshStandardMaterial color="#d9d0c2" emissive="#fff0ce" emissiveIntensity={0.65} roughness={0.35} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={0.75} color="#fff0d2" distance={9} decay={2} />
    </group>
  )
}

// ── Tile pattern on corridor walls ────────────────────────────────────────────
function WallTilePattern({ position, rotation, w, h, isDark }: any) {
  const tileColors = isDark
    ? ['#34342f','#2c2c27','#3b3a34','#302d28']
    : ['#e9e3d9','#ddd5c8','#f1ece4','#d7d0c4']
  const cols = Math.floor(w / 0.9)
  const rows = Math.floor(h / 0.9)
  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      <mesh><planeGeometry args={[w, h]} /><meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <mesh key={`${r}-${c}`} position={[-w/2 + c*0.9 + 0.45, -h/2 + r*0.9 + 0.45, 0.01]}>
            <boxGeometry args={[0.84, 0.84, 0.025]} />
            <meshStandardMaterial color={tileColors[(r + c) % 4]} roughness={0.32} metalness={0.02} />
          </mesh>
        ))
      )}
    </group>
  )
}

function BaseboardSegment({ side, centerZ, length }: { side: -1 | 1; centerZ: number; length: number }) {
  return (
    <mesh position={[side * 3.91, 0.16, centerZ]}>
      <boxGeometry args={[0.16, 0.32, length]} />
      <meshStandardMaterial color="#806044" roughness={0.48} />
    </mesh>
  )
}

// ── Main corridor ─────────────────────────────────────────────────────────────
export default function Corridor({ onSectionOpen, isDark, controlsEnabled = true }: { onSectionOpen: (id: string) => void; isDark?: boolean; controlsEnabled?: boolean }) {
  const { camera, gl } = useThree()
  // Keep the shell's raw entrance cut well behind the initial forward view.
  const corridorStart = 24
  const corridorEnd = -84
  const keys = useRef(new Set<string>())
  const look = useRef({ yaw: 0, pitch: 0 })
  const wheelSpeed = useRef(0)
  const touchForward = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement
    const heldKeys = keys.current
    let dragging = false
    let touchDragging = false
    let previousPointer = { x: 0, y: 0 }
    const oldTouchAction = canvas.style.touchAction
    canvas.style.touchAction = 'none'

    const onKeyDown = (event: KeyboardEvent) => {
      if (!controlsEnabled || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyR', 'KeyF', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault()
        heldKeys.add(event.code)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => heldKeys.delete(event.code)
    const onBlur = () => heldKeys.clear()
    const onWheel = (event: WheelEvent) => {
      if (!controlsEnabled) return
      event.preventDefault()
      wheelSpeed.current = THREE.MathUtils.clamp(wheelSpeed.current + event.deltaY * 0.025, -12, 12)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!controlsEnabled || event.button !== 0) return
      dragging = true
      touchDragging = event.pointerType === 'touch'
      previousPointer = { x: event.clientX, y: event.clientY }
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!controlsEnabled || !dragging) return
      const dx = event.clientX - previousPointer.x
      const dy = event.clientY - previousPointer.y
      previousPointer = { x: event.clientX, y: event.clientY }
      look.current.yaw -= dx * 0.004
      if (touchDragging) {
        // On touch screens, a vertical swipe walks the camera through the corridor.
        touchForward.current = THREE.MathUtils.clamp(touchForward.current - dy * 0.025, -3, 3)
      } else {
        look.current.pitch = THREE.MathUtils.clamp(look.current.pitch - dy * 0.004, -0.75, 0.75)
      }
    }
    const onPointerUp = () => { dragging = false; touchDragging = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      canvas.style.touchAction = oldTouchAction
      heldKeys.clear()
    }
  }, [controlsEnabled, gl])

  useFrame((_, delta) => {
    const yaw = look.current.yaw
    camera.rotation.order = 'YXZ'
    camera.rotation.set(look.current.pitch, yaw, 0)

    if (!controlsEnabled) {
      wheelSpeed.current = 0
      return
    }

    const forward = Number(keys.current.has('KeyW') || keys.current.has('ArrowUp')) - Number(keys.current.has('KeyS') || keys.current.has('ArrowDown'))
    const strafe = Number(keys.current.has('KeyD') || keys.current.has('ArrowRight')) - Number(keys.current.has('KeyA') || keys.current.has('ArrowLeft'))
    const vertical = Number(keys.current.has('KeyR')) - Number(keys.current.has('KeyF'))
    const forwardX = -Math.sin(yaw)
    const forwardZ = -Math.cos(yaw)
    const rightX = Math.cos(yaw)
    const rightZ = -Math.sin(yaw)
    const length = Math.hypot(forward, strafe) || 1
    const speed = 5 * delta

    camera.position.x += ((forward * forwardX + strafe * rightX) / length) * speed + touchForward.current * forwardX
    camera.position.z += ((forward * forwardZ + strafe * rightZ) / length + wheelSpeed.current) * speed + touchForward.current * forwardZ
    camera.position.y += vertical * speed
    wheelSpeed.current *= Math.exp(-4 * delta)
    touchForward.current *= Math.exp(-8 * delta)

    // Keep the camera inside the walkable corridor volume.
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -3.1, 3.1)
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.7, 4.8)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -79, 10)
  })

  const DOOR_Z_POSITIONS = [-10, -20, -30, -42, -54, -64, -74]
  const buildSideWall = (side: -1 | 1) => {
    const doorsOnSide = DOOR_Z_POSITIONS
      .map((z, index) => ({ z, index }))
      .filter(({ index }) => (index % 2 === 0 ? -1 : 1) === side)
    const pieces: React.ReactNode[] = []
    let segmentStart = corridorStart

    doorsOnSide.forEach(({ z, index }) => {
      const openingStart = z + 1.55
      const openingEnd = z - 1.55
      const segmentLength = segmentStart - openingStart
      if (segmentLength > 0) {
        pieces.push(
          <mesh key={`backing-${side}-${index}`} position={[side * 4.1, 2.75, (segmentStart + openingStart) / 2]}>
            <boxGeometry args={[0.2, 5.5, segmentLength]} />
            <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
          </mesh>,
        )
        pieces.push(
          <WallTilePattern
            key={`wall-${side}-${index}`}
            position={[side * 4, 2.75, (segmentStart + openingStart) / 2]}
            rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            w={segmentLength}
            h={5.5}
            isDark={isDark}
          />,
        )
        pieces.push(
          <BaseboardSegment key={`baseboard-${side}-${index}`} side={side} centerZ={(segmentStart + openingStart) / 2} length={segmentLength} />,
        )
      }
      pieces.push(
        <mesh key={`backing-header-${side}-${index}`} position={[side * 4.1, 4.9, z]}>
          <boxGeometry args={[0.2, 1.2, 3.1]} />
          <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
        </mesh>,
      )
      pieces.push(
        <WallTilePattern
          key={`header-${side}-${index}`}
          position={[side * 4, 4.9, z]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          w={3.1}
          h={1.2}
          isDark={isDark}
        />,
      )
      segmentStart = openingEnd
    })

    const lastLength = segmentStart - corridorEnd
    if (lastLength > 0) {
      pieces.push(
        <mesh key={`backing-${side}-end`} position={[side * 4.1, 2.75, (segmentStart + corridorEnd) / 2]}>
          <boxGeometry args={[0.2, 5.5, lastLength]} />
          <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
        </mesh>,
      )
      pieces.push(
        <WallTilePattern
          key={`wall-${side}-end`}
          position={[side * 4, 2.75, (segmentStart + corridorEnd) / 2]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          w={lastLength}
          h={5.5}
          isDark={isDark}
        />,
      )
      pieces.push(
        <BaseboardSegment key={`baseboard-${side}-end`} side={side} centerZ={(segmentStart + corridorEnd) / 2} length={lastLength} />,
      )
    }
    return pieces
  }

  return (
    <group>
      {/* ── CORRIDOR SHELL ── */}
      {/* Floor — tiled */}
      <mesh position={[0, -0.05, (corridorStart + corridorEnd) / 2]}>
        <boxGeometry args={[8, 0.14, corridorStart - corridorEnd]} />
        <meshStandardMaterial color={isDark ? '#252520' : '#e8e3da'} roughness={0.72} />
      </mesh>
      <WallTilePattern position={[0, 0.02, (corridorStart + corridorEnd) / 2]} rotation={[-Math.PI / 2, 0, 0]} w={8} h={corridorStart - corridorEnd} isDark={isDark} />
      {/* Ceiling */}
      <mesh position={[0, 5.6, (corridorStart + corridorEnd) / 2]}>
        <boxGeometry args={[8, 0.2, corridorStart - corridorEnd]} />
        <meshStandardMaterial color={isDark ? '#1e1e1a' : '#e4dfd6'} roughness={0.82} />
      </mesh>
      <mesh position={[0, 5.5, (corridorStart + corridorEnd) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, corridorStart - corridorEnd]} />
        <meshStandardMaterial color={isDark ? '#1e1e1a' : '#e4dfd6'} roughness={0.82} />
      </mesh>
      {/* Side walls are built around real door openings instead of behind them. */}
      {buildSideWall(-1)}
      {buildSideWall(1)}
      {/* Close the shell's starting cut with a matching tiled end wall. */}
      <mesh position={[0, 2.75, corridorStart + 0.1]}>
        <boxGeometry args={[8, 5.5, 0.2]} />
        <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
      </mesh>
      <WallTilePattern position={[0, 2.75, corridorStart]} rotation={[0, 0, 0]} w={8} h={5.5} isDark={isDark} />
      {/* ── Lamps ── */}
      {[-8, -20, -32, -44, -56, -68, -78].map(z => <HangingLamp key={z} position={[0, 5.46, z]} />)}

      {/* ── Section Doors (alternating sides) ── */}
      {DOORS.map((door, i) => {
        const z = DOOR_Z_POSITIONS[i]
        const side = i % 2 === 0 ? -1 : 1
        const rotY = i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2
        return (
          <group key={door.id}>
            <SectionDoor
              position={[side * 4, 0, z]}
              rotation={[0, rotY, 0]}
              title={door.label}
              color={door.color}
              isDark={isDark}
              onOpen={() => onSectionOpen(door.id)}
            />
          </group>
        )
      })}

      {/* ── End wall ── */}
      <mesh position={[0, 2.75, corridorEnd - 0.1]}>
        <boxGeometry args={[8, 5.5, 0.2]} />
        <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.75, corridorEnd]}>
        <planeGeometry args={[8, 5.5]} />
        <meshStandardMaterial color={isDark ? '#262621' : '#e8e3da'} roughness={0.72} />
      </mesh>
      <Text position={[0, 3.6, corridorEnd + 0.2]} fontSize={0.8} color={isDark ? '#e0d8c8' : '#2b2b2b'} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        BUILDsy
      </Text>
      <Text position={[0, 2.5, corridorEnd + 0.2]} fontSize={0.28} color={isDark ? '#a8a49a' : '#5a5650'} anchorX="center" anchorY="middle" maxWidth={5} textAlign="center" lineHeight={1.5}>
        {'Tiles & Sanitaryware · Dehradun\nhello@buildsy.in'}
      </Text>
    </group>
  )
}
