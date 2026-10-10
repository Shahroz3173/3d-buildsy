import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'

import './i18n'
import { useStore } from './store/useStore'
import CanvasScene from './components/3d/CanvasScene'
import Loader from './components/Loader'
import Layout from './components/ui/Layout'
import SEO from './components/ui/SEO'

// Sections
import TilesSection from './sections/TilesSection'
import SanitarySection from './sections/SanitarySection'
import VisualizerSection from './sections/VisualizerSection'
import CollectionsSection from './sections/CollectionsSection'
import VisitSection from './sections/VisitSection'
import AboutSection from './sections/AboutSection'
import ContactSection from './sections/ContactSection'

function App() {
  const { t } = useTranslation()
  const { view, activeSection } = useStore()
  const [loaded, setLoaded] = useState(false)

  // Pre-load theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', useStore.getState().theme)
  }, [])

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tiles': return <TilesSection />
      case 'sanitaryware': return <SanitarySection />
      case 'visualizer': return <VisualizerSection />
      case 'collections': return <CollectionsSection />
      case 'visit': return <VisitSection />
      case 'about': return <AboutSection />
      case 'contact': return <ContactSection />
      default: return null
    }
  }

  return (
    <HelmetProvider>
      <SEO />
      
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* The 3D view is always present unless fully unmounted to save memory. 
          We hide it via CSS when 'view' is 'classic' */}
      <CanvasScene loaded={loaded} />

      {/* Explorer overlay text - hidden when a section is open or in classic view */}
      {loaded && view === '3d' && !activeSection && (
        <div className="explorer-banner">
          <strong>{t('hero.explorer')}</strong>
          {t('hero.explorerSub')} &nbsp;·&nbsp; Scroll inside
        </div>
      )}

      {/* Main UI Layout (Navbar, Cart, Overlays) */}
      {loaded && (
        <Layout>
          {view === '3d' ? (
            // In 3D mode, Layout provides an overlay wrapper around the active section
            renderActiveSection()
          ) : (
            // In classic mode, we stack all sections linearly
            <div className="classic-view">
              
              {/* Classic Hero */}
              <div className="classic-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>BUILD<span style={{ color: 'var(--accent)' }}>sy</span></h1>
                  <p style={{ fontSize: '1.2rem', color: 'var(--ink-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-hand)' }}>{t('hero.headline')} — {t('hero.subheadline')}</p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => useStore.getState().setActiveSection('tiles')}>{t('hero.cta1')}</button>
                    <button className="btn btn-outline" onClick={() => useStore.getState().setActiveSection('visualizer')}>{t('hero.cta2')}</button>
                  </div>
                </div>
              </div>

              {/* Stack sections */}
              <div className="classic-section"><TilesSection /></div>
              <div className="classic-section"><SanitarySection /></div>
              <div className="classic-section"><VisualizerSection /></div>
              <div className="classic-section"><CollectionsSection /></div>
              <div className="classic-section"><VisitSection /></div>
              <div className="classic-section"><AboutSection /></div>
              <div className="classic-section"><ContactSection /></div>
              
            </div>
          )}
        </Layout>
      )}
    </HelmetProvider>
  )
}

export default App
