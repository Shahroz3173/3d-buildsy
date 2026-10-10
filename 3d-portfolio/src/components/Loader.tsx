import { useProgress } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const { progress, active, total } = useProgress()
  const [complete, setComplete] = useState(false)
  const { t } = useTranslation()

  const topTearRef = useRef<HTMLDivElement>(null)
  const botTearRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If progress is 100, or there are no items to load (total === 0 and !active), finish loading
    const isFinished = progress === 100 || (!active && total === 0)
    
    // Safety fallback: auto-complete after 2 seconds no matter what
    const fallbackTimer = setTimeout(() => {
      if (!complete) finishLoader()
    }, 2000)

    if (isFinished && !complete) {
      finishLoader()
    }

    return () => clearTimeout(fallbackTimer)
  }, [progress, active, total, complete])

  const finishLoader = () => {
    if (complete) return
    setComplete(true)
    const tl = gsap.timeline({
      onComplete: () => {
        if (wrapRef.current) wrapRef.current.style.display = 'none'
        onComplete()
      }
    })
    tl.to([topTearRef.current, botTearRef.current], {
      height: 0,
      duration: 0.85,
      ease: 'power3.inOut',
      delay: 0.2
    })
    tl.to(wrapRef.current, {
      opacity: 0,
      duration: 0.3
    }, "-=0.2")
  }

  return (
    <div className="loader-wrap" ref={wrapRef}>
      <div className="loader-tear loader-tear-top" ref={topTearRef}></div>
      <div className="loader-tear loader-tear-bottom" ref={botTearRef}></div>
      
      <div style={{ position: 'relative', zIndex: 205, textAlign: 'center' }}>
        <h1 className="loader-brand">BUILD<span>sy</span></h1>
        <p className="loader-sub">{t('hero.headline')}</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div className="loader-bar-track">
            <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <p style={{ marginTop: '0.8rem', fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'var(--ink)' }}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}
