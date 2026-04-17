import { useEffect, useRef } from 'react'

export default function CursorEffect() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let dotX  = 0, dotY  = 0
    let frameId

    const onMove = (e) => {
      dotX = e.clientX
      dotY = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    // Dot snaps instantly; ring follows with smooth lerp
    const animate = () => {
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }

      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      {/* Small sharp dot — snaps to cursor */}
      <div
        ref={dotRef}
        style={{
          position:        'fixed',
          top:             -4,
          left:            -4,
          width:           8,
          height:          8,
          borderRadius:    '50%',
          background:      'var(--accent)',
          boxShadow:       '0 0 8px var(--accent)',
          pointerEvents:   'none',
          zIndex:          10000,
          willChange:      'transform',
        }}
      />

      {/* Larger ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position:        'fixed',
          top:             -16,
          left:            -16,
          width:           32,
          height:          32,
          borderRadius:    '50%',
          border:          '1.5px solid var(--accent)',
          opacity:         0.5,
          pointerEvents:   'none',
          zIndex:          9999,
          willChange:      'transform',
        }}
      />
    </>
  )
}
