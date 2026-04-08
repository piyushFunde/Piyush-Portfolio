import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setPct(Math.min(100, pct))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '2px',
      width: `${pct}%`,
      background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
      boxShadow: '0 0 10px var(--accent-glow)',
      zIndex: 10001,
      transition: 'width 0.08s linear',
      pointerEvents: 'none',
    }} />
  )
}
