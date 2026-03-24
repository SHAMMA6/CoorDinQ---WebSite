import { useCallback, useEffect, useRef } from 'react'

export default function ClickSpark({
  sparkColor = '#5CD4C6',
  sparkSize = 8,
  sparkRadius = 12,
  sparkCount = 6,
  duration = 320,
  easing = 'ease-out',
  extraScale = 1,
  disabled = false,
  className = '',
  children,
}) {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing],
  )

  useEffect(() => {
    if (disabled) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const parent = canvas.parentElement
    if (!parent) return undefined

    let resizeTimeout

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(parent)
    resizeCanvas()

    return () => {
      ro.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    let animationId

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = easeFunc(progress)
        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [disabled, duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize])

  const handleClick = (e) => {
    if (disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = performance.now()

    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }))

    sparksRef.current.push(...newSparks)
  }

  return (
    <div className={`relative ${className}`.trim()} onClick={handleClick}>
      {!disabled && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-[9999] block h-full w-full select-none"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}
