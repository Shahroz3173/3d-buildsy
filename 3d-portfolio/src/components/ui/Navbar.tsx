import { useTranslation } from 'react-i18next'
import { useStore } from '../../store/useStore'
import { ShoppingCart, Moon, Sun, Menu, X, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme, view, setView, activeSection, setActiveSection, cartCount, setCartOpen } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {activeSection ? (
            <button className="icon-btn" onClick={() => setActiveSection(null)} title={t('common.back')}>
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="navbar-brand">BUILD<span>sy</span></div>
          )}
        </div>

        <div className="navbar-links">
          {!activeSection && (
            <button className={`nav-link ${view === 'classic' ? 'active' : ''}`} onClick={() => setView(view === '3d' ? 'classic' : '3d')}>
              {view === '3d' ? t('nav.skip3d') : t('nav.back3d')}
            </button>
          )}
        </div>

        <div className="navbar-actions">
          <button className="nav-link" onClick={toggleLang}>
            {t('nav.lang')}
          </button>
          <button className="icon-btn" onClick={toggleTheme} title={theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="icon-btn" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            {cartCount() > 0 && <span className="badge">{cartCount()}</span>}
          </button>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {!activeSection && (
          <button className="nav-link" onClick={() => { setView(view === '3d' ? 'classic' : '3d'); setMobileOpen(false) }}>
            {view === '3d' ? t('nav.skip3d') : t('nav.back3d')}
          </button>
        )}
      </div>
    </>
  )
}
