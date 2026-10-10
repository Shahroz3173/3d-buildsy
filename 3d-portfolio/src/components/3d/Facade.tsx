import { useRef, useState } from 'react'
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { PaintRevealMaterial, SketchLineMaterial } from '../../shaders/PaintRevealMaterial'

extend({ PaintRevealMaterial, SketchLineMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sketchLineMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof SketchLineMaterial>
      paintRevealMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof PaintRevealMaterial>
    }
  }
}

// ── Sketch wall plane ─────────────────────────────────────────────────────────
function SketchWall({ position, args, rotation }: any) {
  const mat = useRef<any>(null)
  useFrame((_, d) => { if (mat.current) mat.current.uTime += d })
  return (
    <mesh position={position} rotation={rotation ?? [0,0,0]}>
      <planeGeometry args={args} />
      <sketchLineMaterial ref={mat} uColor={new THREE.Color('#2b2b2b')} uOpacity={0.45} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Product sticker (tile/sanitary icon) ──────────────────────────────────────
function ProductSticker({ position, emoji, color }: { position:[number,number,number]; emoji:string; color:string }) {
  const [hov, setHov] = useState(false)
  return (
    <group position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); document.body.style.cursor = 'default' }}
      onPointerOut={() => setHov(false)}>
      <mesh>
        <circleGeometry args={[0.30, 32]} />
        <meshBasicMaterial color={hov ? '#fff' : color} />
      </mesh>
      <mesh position={[0,0,0.01]}>
        <circleGeometry args={[0.32, 32]} />
        <meshBasicMaterial color="#2b2b2b" side={THREE.BackSide} />
      </mesh>
      <Text position={[0,0,0.03]} fontSize={0.22} anchorX="center" anchorY="middle" color={hov ? color : '#fff'}>
        {emoji}
      </Text>
    </group>
  )
}

// ── Wooden hanging sign ───────────────────────────────────────────────────────
function WoodenSign({ position, line1, line2 }: { position:[number,number,number]; line1:string; line2?:string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.04
  })
  return (
    <group position={position}>
      <mesh position={[-0.8,0.55,0]}><cylinderGeometry args={[0.025,0.025,1.1,6]}/><meshBasicMaterial color="#5c3d1e"/></mesh>
      <mesh position={[0.8,0.55,0]}><cylinderGeometry args={[0.025,0.025,1.1,6]}/><meshBasicMaterial color="#5c3d1e"/></mesh>
      <group ref={ref}>
        <mesh><boxGeometry args={[4.0, 1.05, 0.14]}/><meshBasicMaterial color="#8B5E3C"/></mesh>
        {[-0.18,0.18].map((y,i) => (
          <mesh key={i} position={[0,y,0.072]}><planeGeometry args={[3.8,0.018]}/><meshBasicMaterial color="#6b4826"/></mesh>
        ))}
        <Text position={[0, line2 ? 0.28 : 0, 0.08]} fontSize={0.42} color="#F5E6C8" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          {line1}
        </Text>
        {line2 && (
          <Text position={[0, -0.28, 0.08]} fontSize={0.20} color="#F0D9B5" anchorX="center" anchorY="middle" letterSpacing={0.02}>
            {line2}
          </Text>
        )}
      </group>
    </group>
  )
}

// ── Main store entrance door ──────────────────────────────────────────────────
function StoreDoor({ position, onEnter, isDark }: { position:[number,number,number]; onEnter:()=>void; isDark?:boolean }) {
  const [hov, setHov] = useState(false)
  const gRef = useRef<THREE.Group>(null)
  const matL = useRef<any>(null)
  const matR = useRef<any>(null)

  useFrame((_,d) => {
    const t = hov ? 1 : 0
    if (matL.current) { matL.current.uTime += d; matL.current.uReveal = THREE.MathUtils.lerp(matL.current.uReveal??0,t,d*4) }
    if (matR.current) { matR.current.uTime += d; matR.current.uReveal = THREE.MathUtils.lerp(matR.current.uReveal??0,t,d*4) }
    if (gRef.current) gRef.current.scale.setScalar(THREE.MathUtils.lerp(gRef.current.scale.x, hov?1.03:1.0, d*6))
  })

  return (
    <group ref={gRef} position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); document.body.style.cursor='pointer' }}
      onPointerOut={() => { setHov(false); document.body.style.cursor='auto' }}
      onClick={(e) => { e.stopPropagation(); onEnter() }}>
      {/* Outer frame */}
      <mesh position={[0,1.5,-0.02]}><planeGeometry args={[4.0,6.2]}/><meshBasicMaterial color="#5c3d1e"/></mesh>
      {/* Door backing */}
      <mesh position={[0,1.5,0]}><planeGeometry args={[3.6,5.8]}/><meshBasicMaterial color={isDark?'#101010':'#1a1614'}/></mesh>
      {/* Tile texture on floor strip */}
      <mesh position={[0,0.02,0.08]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.6,0.5]}/><meshBasicMaterial color="#c8b49a"/></mesh>
      {/* Left door panel */}
      <mesh position={[-0.9,1.5,0.03]}><planeGeometry args={[1.65,5.4]}/><paintRevealMaterial ref={matL} transparent uColorPainted={new THREE.Color('#c8a878')} uColorSketch={new THREE.Color('#2b2b2b')}/></mesh>
      {/* Right door panel */}
      <mesh position={[0.9,1.5,0.03]}><planeGeometry args={[1.65,5.4]}/><paintRevealMaterial ref={matR} transparent uColorPainted={new THREE.Color('#c8a878')} uColorSketch={new THREE.Color('#2b2b2b')}/></mesh>
      {/* Door handle knobs */}
      <mesh position={[-0.18,1.4,0.16]}><sphereGeometry args={[0.1,8,8]}/><meshBasicMaterial color={hov?'#c47c27':'#888'}/></mesh>
      <mesh position={[ 0.18,1.4,0.16]}><sphereGeometry args={[0.1,8,8]}/><meshBasicMaterial color={hov?'#c47c27':'#888'}/></mesh>
      {/* "OPEN" sign on door */}
      <mesh position={[0,3.2,0.1]}><planeGeometry args={[1.2,0.5]}/><meshBasicMaterial color={hov?'#22c55e':'#888'}/></mesh>
      <Text position={[0,3.2,0.16]} fontSize={0.24} color="#fff" anchorX="center" anchorY="middle">OPEN</Text>
      {/* Hover prompt */}
      {hov && (
        <Html position={[0,-0.4,0.2]} center style={{ pointerEvents:'none', fontFamily:"'Permanent Marker',cursive", color:'#c47c27', fontSize:'16px', whiteSpace:'nowrap' }}>
          ✦ Click to Enter ✦
        </Html>
      )}
    </group>
  )
}

// ── Tile pattern window ───────────────────────────────────────────────────────
function TileWindow({ position }: { position:[number,number,number] }) {
  const TILE_COLS = ['#c8b49a','#a87d5a','#f0e8d8','#7c6248','#e0d4c0']
  return (
    <group position={position}>
      {/* Blue-glass window */}
      <mesh><planeGeometry args={[2.2,2.4]}/><meshBasicMaterial color="#b8d4ea" opacity={0.8} transparent/></mesh>
      <mesh position={[0,0,0.02]}><planeGeometry args={[2.4,2.6]}/><meshBasicMaterial color="#5c3d1e" wireframe/></mesh>
      {/* Tile swatches inside window */}
      {TILE_COLS.map((c,i) => (
        <mesh key={i} position={[-0.72 + (i%3)*0.72, 0.5 - Math.floor(i/3)*0.72, 0.04]}>
          <planeGeometry args={[0.6,0.6]}/>
          <meshBasicMaterial color={c}/>
        </mesh>
      ))}
      {/* Grid lines */}
      <mesh position={[0,0,0.05]}><planeGeometry args={[0.03,2.2]}/><meshBasicMaterial color="#5c3d1e"/></mesh>
      <mesh position={[0,0,0.05]}><planeGeometry args={[2.2,0.03]}/><meshBasicMaterial color="#5c3d1e"/></mesh>
    </group>
  )
}

// ── Potted plant ──────────────────────────────────────────────────────────────
function PottedPlant({ position }: { position:[number,number,number] }) {
  return (
    <group position={position}>
      <mesh position={[0,-0.1,0]}><cylinderGeometry args={[0.28,0.22,0.55,8]}/><meshBasicMaterial color="#c8a060" wireframe/></mesh>
      {[[0,0.9,0,0.55],[-.3,0.7,.1,.35],[.3,0.75,.1,.35],[0,1.2,0,.38]].map(([x,y,z,r],i)=>(
        <mesh key={i} position={[x as number,y as number,z as number]}><sphereGeometry args={[r as number,8,6]}/><meshBasicMaterial color="#2b5c28" wireframe/></mesh>
      ))}
    </group>
  )
}

// ── Sketched cat ──────────────────────────────────────────────────────────────
function Cat({ position }: { position:[number,number,number] }) {
  const catRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (catRef.current) catRef.current.position.y = (position[1]) + Math.sin(clock.elapsedTime * 0.8) * 0.06
  })
  return (
    <group ref={catRef} position={position}>
      <mesh position={[0,0.28,0]}><capsuleGeometry args={[0.2,0.5,5,8]}/><meshBasicMaterial color="#DEDAD4" wireframe/></mesh>
      <mesh position={[0,0.92,0]}><sphereGeometry args={[0.22,8,7]}/><meshBasicMaterial color="#DEDAD4" wireframe/></mesh>
      <mesh position={[-0.13,1.12,0]} rotation={[0,0,0.4]}><coneGeometry args={[0.07,0.18,4]}/><meshBasicMaterial color="#DEDAD4" wireframe/></mesh>
      <mesh position={[0.13,1.12,0]} rotation={[0,0,-0.4]}><coneGeometry args={[0.07,0.18,4]}/><meshBasicMaterial color="#DEDAD4" wireframe/></mesh>
    </group>
  )
}

// ── Sketch tree ───────────────────────────────────────────────────────────────
function SketchTree({ position }: { position:[number,number,number] }) {
  return (
    <group position={position}>
      <mesh position={[0,1.0,0]}><cylinderGeometry args={[0.14,0.2,3.4,6]}/><meshBasicMaterial color="#5c3d1e" wireframe/></mesh>
      {([[0,3.4,0,1.5],[-0.8,3.0,0.1,1.0],[0.8,3.1,0.1,1.0],[0,4.5,0,1.0]] as [number,number,number,number][]).map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]}><sphereGeometry args={[r,8,6]}/><meshBasicMaterial color="#2b2b2b" wireframe/></mesh>
      ))}
    </group>
  )
}

// ── "SALE / NEW" banner ───────────────────────────────────────────────────────
function SaleBanner({ position }: { position:[number,number,number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z = Math.sin(Date.now()*0.001) * 0.06 })
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1.6, 0.45]}/>
      <meshBasicMaterial color="#ef4444"/>
      <Text position={[0.001,0.001,0.04]} fontSize={0.22} color="#fff" anchorX="center" anchorY="middle" letterSpacing={0.06}>SALE</Text>
    </mesh>
  )
}

// ── Main BUILDsy Facade ───────────────────────────────────────────────────────
export default function BuildsyFacade({ onEnter, isDark }: { onEnter:()=>void; isDark?:boolean }) {
  const bgWall  = isDark ? '#242420' : '#eae6dc'
  const bgFloor = isDark ? '#1c1c18' : '#d5d1c5'
  const bgSky   = isDark ? '#1a1a2e' : '#e8e4f0'

  return (
    <group>
      {/* Sky */}
      <mesh position={[0,4,-3]}><planeGeometry args={[28,14]}/><meshBasicMaterial color={bgSky}/></mesh>

      {/* Main wall fill */}
      <mesh position={[0,3,-0.6]}><planeGeometry args={[20,12]}/><meshBasicMaterial color={bgWall}/></mesh>

      {/* Tile/brick hatching left */}
      <SketchWall position={[-6,3,-0.55]} args={[8,12]} rotation={[0,0,0]}/>
      {/* Brick hatching right */}
      <SketchWall position={[6,3,-0.55]} args={[8,12]} rotation={[0,0,0]}/>
      {/* Wall above door */}
      <SketchWall position={[0,6.2,-0.55]} args={[5,2.5]} rotation={[0,0,0]}/>

      {/* Ground pavement — tile grid */}
      <mesh position={[0,-0.88,1.0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[20,5]}/><meshBasicMaterial color={bgFloor}/></mesh>
      <SketchWall position={[0,-0.87,1.0]} args={[20,5]} rotation={[-Math.PI/2,0,0]}/>

      {/* Hanging sign */}
      <WoodenSign position={[0,5.8,0.12]} line1="BUILDsy" line2="Tiles & Sanitaryware"/>

      {/* Store entrance door */}
      <StoreDoor position={[0,0,0]} onEnter={onEnter} isDark={isDark}/>

      {/* Tile sample window (right) */}
      <TileWindow position={[4.5,1.8,0.05]}/>

      {/* Secondary window (left) — sanitary display */}
      <group position={[-4.5,1.8,0.05]}>
        <mesh><planeGeometry args={[2.2,2.4]}/><meshBasicMaterial color={isDark?'#2a2a3e':'#b8d4ea'} opacity={0.8} transparent/></mesh>
        <mesh position={[0,0,0.02]}><planeGeometry args={[2.4,2.6]}/><meshBasicMaterial color="#5c3d1e" wireframe/></mesh>
        <Text position={[0,0,0.06]} fontSize={0.28} color={isDark?'#e0d8c8':'#2b2b2b'} anchorX="center" anchorY="middle" maxWidth={2.0} textAlign="center" lineHeight={1.4}>
          {'🚿 Sanitaryware\nDisplay'}
        </Text>
      </group>

      {/* Product stickers on/near door */}
      <ProductSticker position={[-0.8,2.7,0.2]} emoji="🟫" color="#c8a060"/>
      <ProductSticker position={[-0.2,3.1,0.2]} emoji="🚿" color="#7ec8e3"/>
      <ProductSticker position={[0.45,2.7,0.2]} emoji="🚽" color="#a0c4a0"/>
      <ProductSticker position={[0.9,3.1,0.2]} emoji="🚰" color="#c0a0d4"/>
      <ProductSticker position={[-0.7,2.0,0.2]} emoji="🪴" color="#88b878"/>
      <ProductSticker position={[0.1,1.85,0.2]} emoji="🏠" color="#f5c77e"/>
      <ProductSticker position={[0.8,2.0,0.2]} emoji="✨" color="#eab308"/>

      {/* SALE banner */}
      <SaleBanner position={[2.8,4.8,0.1]}/>

      {/* Store hours sign */}
      <group position={[-2.8,4.8,0.1]}>
        <mesh><planeGeometry args={[2.0,0.52]}/><meshBasicMaterial color={isDark?'#2a1a0a':'#4a3728'}/></mesh>
        <Text position={[0,0,0.04]} fontSize={0.18} color="#F5E6C8" anchorX="center" anchorY="middle" maxWidth={1.8} textAlign="center">
          {'MON–SAT 10AM–7PM'}
        </Text>
      </group>

      {/* Tree (left) */}
      <SketchTree position={[-7.5,-0.3,1.0]}/>

      {/* Potted plant right */}
      <PottedPlant position={[2.8,-0.55,0.9]}/>

      {/* Cat */}
      <Cat position={[-2.2,-0.55,0.9]}/>

      {/* Floor tile strip (decorative) */}
      {[-3,-1,1,3].map((x,i) => (
        <mesh key={i} position={[x,-0.86,0.4]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[1.8,1.8]}/>
          <meshBasicMaterial color={['#c8b49a','#a87d5a','#e8dcc8','#b89c7c'][i]}/>
        </mesh>
      ))}
    </group>
  )
}
