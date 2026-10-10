import { useTranslation } from 'react-i18next'
import { useStore } from '../../store/useStore'
import { X, Trash2 } from 'lucide-react'

export default function Cart() {
  const { t } = useTranslation()
  const { cartOpen, setCartOpen, cart, removeFromCart } = useStore()

  if (!cartOpen) return null

  return (
    <>
      <div className="cart-overlay open" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer open">
        <div className="cart-header">
          <h2>{t('cart.title')}</h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', marginTop: '2rem' }}>
              {t('cart.empty')}
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-swatch" style={{ background: item.product.color }} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-meta">{item.product.size} · {item.product.finish}</div>
                  <div className="cart-item-price">
                    Qty: {item.qty} {item.product.price ? `· ${item.product.price}` : `· ${t('tiles.contactPrice')}`}
                  </div>
                </div>
                <button className="icon-btn" onClick={() => removeFromCart(item.product.id)} title={t('cart.remove')} style={{ border: 'none', color: 'var(--accent)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>{t('cart.total')}</span>
              <span>{t('tiles.contactPrice')}</span>
            </div>
            <div className="payment-grid">
              <div className="payment-option selected">
                {t('cart.payAtStore')}
              </div>
              <div className="payment-option">
                {t('cart.payOnline')}
              </div>
            </div>
            <p className="razorpay-note">{t('cart.paymentNote')}</p>
            <button className="btn btn-primary btn-block">
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
