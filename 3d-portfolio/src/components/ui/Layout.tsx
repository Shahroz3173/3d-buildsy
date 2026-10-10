import Navbar from './Navbar'
import Cart from './Cart'
import { useStore } from '../../store/useStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { activeSection } = useStore()
  
  return (
    <>
      <Navbar />
      <Cart />
      
      {/* If an active section is open in 3D mode, show it as an overlay */}
      {activeSection && (
        <div className="ui-layer" style={{ background: 'var(--bg)', overflowY: 'auto' }}>
          <div style={{ paddingTop: '70px', minHeight: '100vh', pointerEvents: 'auto' }}>
            {children}
          </div>
        </div>
      )}

      {/* For classic view, children are rendered normally outside this wrapper */}
    </>
  )
}
