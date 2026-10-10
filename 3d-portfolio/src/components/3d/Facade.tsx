import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'

function EntryDoor({ onEnter, isDark }: { onEnter: () => void; isDark?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const frameMaterial = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    if (frameMaterial.current) {
      frameMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(
        frameMaterial.current.emissiveIntensity,
        hovered ? 0.16 : 0,
        delta * 5,
      )
    }
  })

  return (
    <group position={[0, 0, -0.5]}>
      {/* The hit area shares the doorway opening; the glass remains recessed. */}
      <mesh
        position={[0, 2.15, 0.12]}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(event) => { event.stopPropagation(); onEnter() }}
      >
        <boxGeometry args={[3.75, 6, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Recessed metal jambs and head trim */}
      <mesh position={[-1.96, 2.15, 0.015]}>
        <boxGeometry args={[0.16, 6.05, 0.16]} />
        <meshStandardMaterial ref={frameMaterial} color="#604d38" emissive="#d4a76c" metalness={0.42} roughness={0.38} />
      </mesh>
      <mesh position={[1.96, 2.15, 0.015]}>
        <boxGeometry args={[0.16, 6.05, 0.16]} />
        <meshStandardMaterial color="#604d38" metalness={0.42} roughness={0.38} />
      </mesh>
      <mesh position={[0, 5.18, 0.015]}>
        <boxGeometry args={[4.06, 0.16, 0.16]} />
        <meshStandardMaterial color="#604d38" metalness={0.42} roughness={0.38} />
      </mesh>

      {/* Tinted full-height glass leaves sit behind the facade face. */}
      {[-0.88, 0.88].map((x) => (
        <mesh key={x} position={[x, 2.15, -0.09]}>
          <boxGeometry args={[1.72, 6, 0.075]} />
          <meshPhysicalMaterial color="#62756e" transparent opacity={0.52} roughness={0.18} metalness={0.2} clearcoat={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 2.15, -0.045]}>
        <boxGeometry args={[0.045, 6, 0.045]} />
        <meshStandardMaterial color="#806a4c" metalness={0.48} roughness={0.3} />
      </mesh>

      {/* Long brass pull handles */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 2.55, -0.035]}>
          <boxGeometry args={[0.045, 0.72, 0.055]} />
          <meshStandardMaterial color="#c39b5d" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}

      {/* Warm interior light gives the glass a readable showroom depth. */}
      <mesh position={[0, 2.15, -0.48]}>
        <boxGeometry args={[3.5, 6, 0.12]} />
        <meshStandardMaterial color={isDark ? '#39342b' : '#aa8e69'} roughness={0.86} />
      </mesh>
      <pointLight position={[0, 3.5, -0.72]} intensity={1.2} color="#ffdba8" distance={8} />

      <mesh position={[0, 4.88, 0.02]}>
        <boxGeometry args={[2.7, 0.42, 0.13]} />
        <meshStandardMaterial color={isDark ? '#26231f' : '#eee5d6'} roughness={0.52} />
      </mesh>
      <Text position={[0, 4.88, 0.095]} fontSize={0.19} color={isDark ? '#f0e8d0' : '#403629'} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        ENTER SHOWROOM
      </Text>

      {hovered && (
        <Html position={[0, -0.25, 0.2]} center style={{ pointerEvents: 'none', fontFamily: "'Permanent Marker', cursive", color: '#c47c27', fontSize: '16px', whiteSpace: 'nowrap' }}>
          ✦ Click to Enter ✦
        </Html>
      )}
    </group>
  )
}

function ExteriorTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.25, 2.7, 10]} />
        <meshStandardMaterial color="#735037" roughness={0.92} />
      </mesh>
      {[
        [0, 3.0, 0, 1.25], [-0.72, 2.75, 0.12, 0.82], [0.7, 2.85, 0.08, 0.9], [0, 3.85, 0, 0.83],
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[radius, 1]} />
          <meshStandardMaterial color={['#55734a', '#668254', '#4c6943', '#718a5e'][index]} roughness={0.88} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Planter({ position, isDark }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.42, 0.76, 20]} />
        <meshStandardMaterial color={isDark ? '#564638' : '#a77c58'} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.07, 20]} />
        <meshStandardMaterial color="#5d4836" roughness={0.9} />
      </mesh>
      {[-0.32, 0, 0.32].map((x, index) => (
        <mesh key={x} position={[x, 1.42 + (index === 1 ? 0.25 : 0), 0]} castShadow>
          <sphereGeometry args={[0.52, 12, 10]} />
          <meshStandardMaterial color={index === 1 ? '#58764a' : '#6f8a58'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default function BuildsyFacade({ onEnter, isDark }: { onEnter: () => void; isDark?: boolean }) {
  const wallColor = isDark ? '#34332e' : '#d9d1c3'
  const trimColor = isDark ? '#4a453b' : '#c1b29c'
  const pavingColor = isDark ? '#292924' : '#bdb7ab'

  return (
    <group>
      {/* Quiet sky and a broad paved forecourt */}
      <mesh position={[0, 5, -5]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color={isDark ? '#20232b' : '#dfe7ec'} />
      </mesh>
      <mesh position={[0, -1.02, -1.2]} receiveShadow>
        <boxGeometry args={[24, 0.2, 20]} />
        <meshStandardMaterial color={pavingColor} roughness={0.82} />
      </mesh>
      {[-6, -4, -2, 0, 2, 4, 6].map((x) => (
        <mesh key={x} position={[x, -0.91, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.92, 4.8]} />
          <meshStandardMaterial color={x % 4 === 0 ? (isDark ? '#35352f' : '#d4cbbb') : pavingColor} roughness={0.56} />
        </mesh>
      ))}

      {/* Stone-clad facade is assembled around a real recessed doorway. */}
      <mesh position={[-6.15, 3.4, -0.58]} castShadow receiveShadow>
        <boxGeometry args={[7.7, 8, 0.62]} />
        <meshStandardMaterial color={wallColor} roughness={0.72} />
      </mesh>
      <mesh position={[6.15, 3.4, -0.58]} castShadow receiveShadow>
        <boxGeometry args={[7.7, 8, 0.62]} />
        <meshStandardMaterial color={wallColor} roughness={0.72} />
      </mesh>
      <mesh position={[0, 6.3, -0.58]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 2.2, 0.62]} />
        <meshStandardMaterial color={wallColor} roughness={0.72} />
      </mesh>

      {/* Stone pilasters and a continuous plinth add depth without busy ornament. */}
      {[-9.7, -2.22, 2.22, 9.7].map((x) => (
        <mesh key={x} position={[x, 3.4, -0.2]} castShadow>
          <boxGeometry args={[0.28, 8, 0.18]} />
          <meshStandardMaterial color={trimColor} roughness={0.64} />
        </mesh>
      ))}
      <mesh position={[-6.15, -0.68, -0.18]}>
        <boxGeometry args={[7.7, 0.48, 0.2]} />
        <meshStandardMaterial color={trimColor} roughness={0.62} />
      </mesh>
      <mesh position={[6.15, -0.68, -0.18]}>
        <boxGeometry args={[7.7, 0.48, 0.2]} />
        <meshStandardMaterial color={trimColor} roughness={0.62} />
      </mesh>

      {/* Wall-mounted brand sign */}
      <group position={[0, 6.48, -0.28]}>
        <mesh castShadow>
          <boxGeometry args={[5.7, 1.15, 0.18]} />
          <meshStandardMaterial color={isDark ? '#3d3024' : '#765238'} roughness={0.48} />
        </mesh>
        <Text position={[0, 0.15, 0.105]} fontSize={0.52} color="#f3e4c7" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          BUILDsy
        </Text>
        <Text position={[0, -0.32, 0.105]} fontSize={0.19} color="#e2cda9" anchorX="center" anchorY="middle" letterSpacing={0.025}>
          TILES & SANITARYWARE
        </Text>
      </group>

      {/* The glass entry is recessed into the facade opening. */}
      <mesh position={[0, 2.15, -0.62]}>
        <boxGeometry args={[4.25, 6, 0.12]} />
        <meshStandardMaterial color={isDark ? '#171815' : '#3e403c'} roughness={0.88} />
      </mesh>
      <EntryDoor onEnter={onEnter} isDark={isDark} />
      <mesh position={[0, -0.84, -0.05]} castShadow>
        <boxGeometry args={[4.25, 0.16, 1.05]} />
        <meshStandardMaterial color={isDark ? '#696052' : '#c2ad8c'} roughness={0.4} />
      </mesh>

      <ExteriorTree position={[-6.2, -0.9, 0.8]} />
      <Planter position={[6.3, -0.9, 0.8]} isDark={isDark} />
      <Planter position={[3.05, -0.9, 1.3]} isDark={isDark} />

    </group>
  )
}
