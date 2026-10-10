import { useTranslation } from 'react-i18next'
import { TILES, TILE_CATEGORIES } from '../data/content'
import { useStore } from '../store/useStore'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

export default function TilesSection() {
  const { t } = useTranslation()
  const { addToCart, setCartOpen } = useStore()
  const [filter, setFilter] = useState('all')

  const filteredTiles = filter === 'all' ? TILES : TILES.filter(t => t.category === filter)

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('tiles.title')}</h2>
      <p className="section-desc">{t('tiles.desc')}</p>

      <div className="filter-row">
        <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>{t('tiles.filter')}:</span>
        <button 
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('tiles.allCategories')}
        </button>
        {TILE_CATEGORIES.map(c => (
          <button 
            key={c.id}
            className={`filter-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredTiles.map(tile => (
          <div key={tile.id} className="product-card">
            <div className="product-swatch" style={{ background: tile.color }}>
              {!tile.image && <span style={{ opacity: 0.1, color: 'var(--ink)' }}>{tile.size}</span>}
            </div>
            <div className="product-info">
              <div className="product-name">{tile.name}</div>
              <div className="product-meta">{tile.finish} · {tile.size}</div>
              <div className="product-price">{tile.price || t('tiles.contactPrice')}</div>
              <div className="product-actions">
                <button 
                  className="btn btn-outline btn-sm btn-block"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(tile)
                    setCartOpen(true)
                  }}
                >
                  <ShoppingCart size={16} /> {t('tiles.addToCart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
