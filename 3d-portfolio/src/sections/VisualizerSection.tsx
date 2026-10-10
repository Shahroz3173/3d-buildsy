import { useTranslation } from 'react-i18next'
import { ROOM_TYPES, TILES } from '../data/content'
import { useState } from 'react'
import { Check } from 'lucide-react'

export default function VisualizerSection() {
  const { t } = useTranslation()
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0].id)
  const [selectedTile, setSelectedTile] = useState(TILES[0].id)

  const activeTile = TILES.find(t => t.id === selectedTile)

  return (
    <div className="section-wrap">
      <h2 className="section-title">{t('visualizer.title')}</h2>
      <p className="section-desc">{t('visualizer.desc')}</p>

      <div className="visualizer-wrap">
        {/* Controls Panel */}
        <div className="visualizer-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontFamily: 'var(--font-hand)' }}>
              {t('visualizer.selectRoom')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ROOM_TYPES.map(r => (
                <button
                  key={r.id}
                  className={`filter-chip ${selectedRoom === r.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoom(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontFamily: 'var(--font-hand)' }}>
              {t('visualizer.selectTile')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {TILES.slice(0, 9).map(tile => (
                <button
                  key={tile.id}
                  onClick={() => setSelectedTile(tile.id)}
                  style={{
                    height: '60px',
                    borderRadius: '6px',
                    border: selectedTile === tile.id ? '3px solid var(--accent)' : '2px solid var(--border)',
                    background: tile.color,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  title={tile.name}
                >
                  {selectedTile === tile.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check color="#fff" size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Preview Panel */}
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontFamily: 'var(--font-hand)' }}>{t('visualizer.preview')}</div>
          <div className="visualizer-preview" style={{ position: 'relative', overflow: 'hidden' }}>
            
            {/* Background color representing the 'room' for now */}
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-card)', zIndex: 0 }} />
            
            {/* Floor tile pattern simulation */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, left: 0, right: 0, height: '45%',
              background: activeTile?.color || '#ccc',
              borderTop: '2px solid var(--border)',
              zIndex: 1,
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'bottom'
            }} />

            <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '8px', color: '#1a1a16' }}>
              <span className="todo-badge">Integration Required</span>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>VisionRoom AI Visualizer API</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Selected: {activeTile?.name} in {ROOM_TYPES.find(r=>r.id===selectedRoom)?.label}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
