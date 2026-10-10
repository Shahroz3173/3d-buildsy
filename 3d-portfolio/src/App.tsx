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
          {t('hero.explorerSub')}<br />
          <span>Wheel / W-S: move · A-D: strafe · drag: look · R-F: height</span>
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
              <section className="home-hero">
                <div className="home-hero-copy">
                  <div className="home-hero-eyebrow"><span /> BUILDsy · DEHRADUN</div>
                  <h1>Make room<br />for <em>better living.</em></h1>
                  <p className="home-hero-intro">{t('hero.headline')} — {t('hero.subheadline')}</p>
                  <div className="home-hero-actions">
                    <button className="btn btn-primary" onClick={() => useStore.getState().setActiveSection('tiles')}>{t('hero.cta1')}</button>
                    <button className="btn btn-outline" onClick={() => useStore.getState().setActiveSection('visualizer')}>{t('hero.cta2')}</button>
                  </div>
                  <div className="home-hero-meta">
                    <span>Thoughtful tiles</span><i />
                    <span>Bathroom essentials</span><i />
                    <span>Local guidance</span>
                  </div>
                </div>

                <div className="home-hero-art" aria-label="A warm modern tile showroom illustration">
                  <div className="home-hero-art-label">A considered start to every space</div>
                  <div className="hero-building-card">
                    <div className="hero-building-sign">BUILDsy<small>Tiles & Sanitaryware</small></div>
                    <div className="hero-building-facade">
                      <div className="hero-facade-pillar pillar-left" />
                      <div className="hero-facade-pillar pillar-right" />
                      <div className="hero-glass-door"><span /><span /></div>
                      <div className="hero-facade-planter planter-left"><b /><b /><b /></div>
                      <div className="hero-facade-planter planter-right"><b /><b /><b /></div>
                    </div>
                    <div className="hero-building-step" />
                  </div>
                  <div className="hero-swatch-card"><span /><span /><span /><small>STONE · FORM · FINISH</small></div>
                  <div className="hero-location-card"><b>01</b><span>Visit our<br />Dehradun showroom</span></div>
                </div>
              </section>

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
