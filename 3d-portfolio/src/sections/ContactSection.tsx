import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SITE } from '../data/content'
import { MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated form submission
    setStatus('success')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('contact.title')}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', marginTop: '2rem' }} className="contact-row">
        
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '2px solid var(--border)' }}>
          {status === 'success' && <div className="form-success" style={{ marginBottom: '1.5rem' }}>{t('contact.success')}</div>}

          <div className="form-group">
            <label className="form-label">{t('contact.name')} *</label>
            <input type="text" required className="form-input" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{t('contact.phone')} *</label>
              <input type="tel" required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('contact.city')}</label>
              <input type="text" className="form-input" defaultValue={SITE.city} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('contact.requirement')}</label>
            <select className="form-select">
              <option>Building a new home</option>
              <option>Renovating a bathroom</option>
              <option>Commercial project</option>
              <option>Just looking for tiles</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
            {t('contact.submit')}
          </button>
        </form>

        {/* Quick Contact & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-hand)', marginBottom: '0.5rem' }}>Instant Reply</h3>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem' }}>Skip the form and message our sales team directly on WhatsApp with your requirements.</p>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-accent btn-block">
              <MessageCircle size={20} /> {t('contact.whatsapp')}
            </a>
          </div>

          <div style={{ padding: '1.5rem', border: '2px dashed var(--border)', borderRadius: '12px', background: 'var(--bg)' }}>
            <h4 style={{ fontFamily: 'var(--font-marker)', marginBottom: '0.5rem' }}>Direct Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }}>
              <p>📞 {SITE.phone.replace('TODO: ', '')}</p>
              <p>✉️ {SITE.email.replace('TODO: ', '')}</p>
              <p>📍 {SITE.address.replace('TODO: ', '')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
