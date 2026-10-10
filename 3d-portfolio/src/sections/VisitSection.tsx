import { useTranslation } from 'react-i18next'
import { SITE } from '../data/content'
import { MapPin, Clock, Phone, MessageCircle, Calendar } from 'lucide-react'

export default function VisitSection() {
  const { t } = useTranslation()

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('visit.title')}</h2>
      
      <div className="contact-row" style={{ marginBottom: '2rem' }}>
        <div className="contact-card">
          <MapPin size={24} color="var(--accent)" />
          <h4 style={{ margin: '0.25rem 0' }}>{t('visit.address')}</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>{SITE.address.replace('TODO: ', '')}</p>
          <a href="#" className="btn btn-outline btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>{t('visit.directions')}</a>
        </div>
        
        <div className="contact-card">
          <Clock size={24} color="var(--accent)" />
          <h4 style={{ margin: '0.25rem 0' }}>{t('visit.hours')}</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', whiteSpace: 'pre-line' }}>{SITE.openingHours.replace('  |  ', '\n')}</p>
        </div>

        <div className="contact-card">
          <Calendar size={24} color="var(--accent)" />
          <h4 style={{ margin: '0.25rem 0' }}>{t('visit.book')}</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>Get expert advice on choosing the perfect tiles for your space.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`tel:${SITE.phone}`} className="btn btn-outline btn-sm">
              <Phone size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="map-wrap">
        <iframe 
          title="Google Maps"
          src={SITE.mapEmbedUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
