import { useTranslation } from 'react-i18next'
import { SANITARY_PRODUCTS, SANITARY_CATEGORIES } from '../data/content'
import { useStore } from '../store/useStore'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

export default function SanitarySection() {
  const { t } = useTranslation()
  const { addToCart, setCartOpen } = useStore()
  const [filter, setFilter] = useState('all')

  const filteredProducts = filter === 'all' ? SANITARY_PRODUCTS : SANITARY_PRODUCTS.filter(p => p.category === filter)

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('sanitaryware.title')}</h2>
      <p className="section-desc">{t('sanitaryware.desc')}</p>

      <div className="filter-row">
        <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>{t('tiles.filter')}:</span>
        <button 
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('tiles.allCategories')}
        </button>
        {SANITARY_CATEGORIES.map(c => (
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
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-swatch" style={{ background: product.color }}>
              {!product.image && <span style={{ opacity: 0.1, color: 'var(--ink)' }}>{product.category}</span>}
            </div>
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-meta">{product.finish} · {product.size}</div>
              <div className="product-price">{product.price || t('tiles.contactPrice')}</div>
              <div className="product-actions">
                <button 
                  className="btn btn-outline btn-sm btn-block"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
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
