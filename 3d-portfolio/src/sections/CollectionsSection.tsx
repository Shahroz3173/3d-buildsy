import { useTranslation } from 'react-i18next'
import { BRANDS } from '../data/content'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function CollectionsSection() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const filtered = search.trim() === '' 
    ? BRANDS 
    : BRANDS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('collections.title')}</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <div className="search-bar">
          <Search size={18} color="var(--ink-muted)" />
          <input 
            type="text" 
            placeholder={t('collections.search')} 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)', textAlign: 'center', margin: '4rem 0' }}>{t('collections.noResults')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(brand => (
            <div key={brand.id} style={{ padding: '2rem', background: 'var(--bg-card)', border: '2px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="todo-badge">Logo</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem' }}>{brand.name.replace('TODO ', '')}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>{brand.description}</p>
              </div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>View Products</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
