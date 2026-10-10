import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, ScrollControls } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import Facade from './Facade'
import Corridor from './Corridor'
import { useStore } from '../../store/useStore'

export default function CanvasScene({ loaded }: { loaded: boolean }) {
  const [stage, setStage] = useState<'facade' | 'corridor'>('facade')
  const { theme, view, setActiveSection } = useStore()
  const isDark = theme === 'dark'

  // If view changes to classic, we hide the canvas in CSS, but it stays mounted.
  // We don't want to unmount it entirely to preserve WebGL context.

  return (
    <div className={`canvas-wrap ${view === 'classic' ? 'hidden-canvas' : ''}`} style={{ display: view === 'classic' ? 'none' : 'block' }}>
      <Canvas dpr={[1, 1.5]}> {/* Cap DPR for better mobile performance */}
        <color attach="background" args={[isDark ? '#1a1a16' : '#F0EDE4']} />
        <fog attach="fog" args={[isDark ? '#1a1a16' : '#F0EDE4', 20, 60]} />
        
        <ambientLight intensity={isDark ? 0.3 : 0.8} color={isDark ? '#fff' : '#fff5e0'} />
        <directionalLight position={[5, 8, 5]} intensity={isDark ? 0.2 : 0.5} color={isDark ? '#a8a49a' : '#fff8e7'} />

        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.8, 8]} fov={60} />

          {loaded && stage === 'facade' && (
            <Facade onEnter={() => setStage('corridor')} isDark={isDark} />
          )}

          {loaded && stage === 'corridor' && (
            <ScrollControls pages={8} damping={0.2} distance={1.0}>
              <Corridor onSectionOpen={setActiveSection} isDark={isDark} />
            </ScrollControls>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
