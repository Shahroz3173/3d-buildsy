import { useTranslation } from 'react-i18next'
import { FAQS } from '../data/content'
import { useState } from 'react'

export default function AboutSection() {
  const { t } = useTranslation()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="section-wrap" style={{ maxWidth: '800px' }}>
      <h2 className="section-title">{t('about.title')}</h2>
      <p className="section-desc">{t('about.desc')}</p>

      <div style={{ padding: '2rem', background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '12px', marginBottom: '3rem' }}>
        <h3 style={{ fontFamily: 'var(--font-marker)', marginBottom: '1rem' }}>Our Promise</h3>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem' }}>
          BUILDsy is Dehradun's premier destination for high-quality tiles and sanitaryware. We believe in <strong>honest pricing without hidden markups</strong>. Whether you are building from scratch or renovating a single bathroom, our team provides expert guidance to help you choose the right materials.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {['100% Genuine Brands', 'Transparent Pricing', 'Fast Local Delivery', 'Expert Consultation'].map(feature => (
            <span key={feature} style={{ padding: '0.4rem 0.8rem', background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: '999px', fontFamily: 'var(--font-hand)', fontSize: '0.9rem', fontWeight: 700 }}>
              ✓ {feature}
            </span>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t('about.faqTitle')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FAQS.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <button 
              className="faq-q"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              {faq.q}
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{openFaq === idx ? '−' : '+'}</span>
            </button>
            <div className={`faq-a ${openFaq === idx ? 'open' : ''}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
