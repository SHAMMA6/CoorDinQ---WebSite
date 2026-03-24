import { useEffect, useRef, useState } from 'react'

export default function AutoScrollCards({
  children,
  direction = 'left',
  speed = 0.5,
  className = '',
}) {
  const scrollRef = useRef(null)
  const animationRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [userInteracting, setUserInteracting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const animate = () => {
      if (!isDragging.current && !userInteracting) {
        const maxScroll = container.scrollWidth - container.clientWidth
        if (direction === 'left') {
          container.scrollLeft += speed
          if (container.scrollLeft >= maxScroll) container.scrollLeft = 0
        } else {
          container.scrollLeft -= speed
          if (container.scrollLeft <= 0) container.scrollLeft = maxScroll
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [direction, speed, userInteracting])

  const resumeAfterDelay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setUserInteracting(false), 3000)
  }

  const handlePointerDown = (e) => {
    isDragging.current = true
    setUserInteracting(true)
    startX.current = e.clientX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.clientX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handlePointerUp = () => {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
    resumeAfterDelay()
  }

  const handleTouchStart = () => {
    setUserInteracting(true)
  }

  const handleTouchEnd = () => {
    resumeAfterDelay()
  }

  return (
    <div
      ref={scrollRef}
      className={`flex gap-4 overflow-x-auto scrollbar-hide cursor-grab ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}
