import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

/* ─── Cargo Point Cloud Generation ────────────────────────────── */
function generateCargoCloud() {
  const points = []
  function sampleBox(cx, cy, cz, w, h, d, density) {
    for (let i = 0; i < density; i++) {
      const face = Math.floor(Math.random() * 6)
      let x, y, z
      if (face === 0) { x = cx + (Math.random()-0.5)*w; y = cy - h/2; z = cz + (Math.random()-0.5)*d }
      else if (face === 1) { x = cx + (Math.random()-0.5)*w; y = cy + h/2; z = cz + (Math.random()-0.5)*d }
      else if (face === 2) { x = cx - w/2; y = cy + (Math.random()-0.5)*h; z = cz + (Math.random()-0.5)*d }
      else if (face === 3) { x = cx + w/2; y = cy + (Math.random()-0.5)*h; z = cz + (Math.random()-0.5)*d }
      else if (face === 4) { x = cx + (Math.random()-0.5)*w; y = cy + (Math.random()-0.5)*h; z = cz - d/2 }
      else { x = cx + (Math.random()-0.5)*w; y = cy + (Math.random()-0.5)*h; z = cz + d/2 }
      points.push({ x, y, z })
    }
  }
  // Pallet base (wide, low)
  sampleBox(0, -0.9, 0, 2.2, 0.15, 1.4, 120)
  // 3 boxes on pallet
  sampleBox(-0.55, -0.4, 0.1, 0.9, 0.9, 0.6, 100)
  sampleBox(0.55, -0.4, 0.1, 0.9, 0.9, 0.6, 100)
  sampleBox(0, -0.4, -0.3, 0.9, 0.9, 0.6, 100)
  // 2 boxes on top
  sampleBox(-0.3, 0.25, 0, 0.8, 0.7, 0.6, 80)
  sampleBox(0.45, 0.25, 0, 0.8, 0.7, 0.6, 80)
  // 1 box on very top
  sampleBox(0, 0.85, 0, 0.7, 0.55, 0.5, 60)
  return points
}

function getHeightColor(y) {
  if (y < -0.7) return 'rgba(100, 20, 160, 0.9)'
  if (y < -0.2) return 'rgba(150, 50, 200, 0.9)'
  if (y < 0.3)  return 'rgba(180, 100, 230, 0.9)'
  if (y < 0.7)  return 'rgba(210, 150, 255, 0.9)'
  return 'rgba(240, 200, 255, 0.95)'
}

function projectPoint(x, y, z, rotY, W, H) {
  const cosR = Math.cos(rotY), sinR = Math.sin(rotY)
  const rx = x * cosR - z * sinR
  const rz = x * sinR + z * cosR
  const fov = 3
  const scale = fov / (fov + rz + 2)
  const px = W/2 + rx * W * 0.28 * scale
  const py = H/2 - y * H * 0.38 * scale
  return { px, py, scale }
}

/* ─── Point Cloud Canvas ───────────────────────────────────────── */
function PointCloudCanvas() {
  const canvasRef = useRef(null)
  const coordsRef = useRef({ x: 14.23, y: 2.81, z: 3.45 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let scanProgress = 0
    let lastTime = 0
    const SCAN_DURATION = 3000

    const cargoPoints = generateCargoCloud()

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const draw = (time) => {
      const dt = time - lastTime
      lastTime = time

      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const rotY = time * 0.00025

      // Draw subtle floor grid at y = -1.1
      const gridLines = 8
      for (let gi = -gridLines/2; gi <= gridLines/2; gi++) {
        const spacing = 0.35
        // X lines along Z
        const p1 = projectPoint(gi * spacing, -1.08, -gridLines/2 * spacing, rotY, W, H)
        const p2 = projectPoint(gi * spacing, -1.08, gridLines/2 * spacing, rotY, W, H)
        ctx.beginPath()
        ctx.moveTo(p1.px, p1.py)
        ctx.lineTo(p2.px, p2.py)
        ctx.strokeStyle = 'rgba(150, 50, 200, 0.15)'
        ctx.lineWidth = 0.8
        ctx.stroke()
        // Z lines along X
        const p3 = projectPoint(-gridLines/2 * spacing, -1.08, gi * spacing, rotY, W, H)
        const p4 = projectPoint(gridLines/2 * spacing, -1.08, gi * spacing, rotY, W, H)
        ctx.beginPath()
        ctx.moveTo(p3.px, p3.py)
        ctx.lineTo(p4.px, p4.py)
        ctx.strokeStyle = 'rgba(150, 50, 200, 0.15)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Scan progress
      scanProgress += dt / SCAN_DURATION
      if (scanProgress > 1) {
        scanProgress = 0
        coordsRef.current = {
          x: (Math.random() * 20 + 5).toFixed(2),
          y: (Math.random() * 5 + 1).toFixed(2),
          z: (Math.random() * 6 + 1).toFixed(2),
        }
      }

      const scanYWorld = -1.1 + scanProgress * 2.2 // from -1.1 to 1.1
      const scanPixel = H/2 - scanYWorld * H * 0.38

      // Draw points sorted by rz for painter's algorithm approximation
      const projected = cargoPoints.map(p => {
        const proj = projectPoint(p.x, p.y, p.z, rotY, W, H)
        return { ...proj, y: p.y }
      })

      for (const pp of projected) {
        // Fade in based on scan progress
        const pointScanY = H/2 - pp.y * H * 0.38
        const revealed = scanPixel > pointScanY ? 1.0 : 0.12
        const brightness = 0.7 + Math.random() * 0.3

        ctx.beginPath()
        ctx.arc(pp.px, pp.py, 1.5 * pp.scale + 0.5, 0, Math.PI * 2)
        const color = getHeightColor(pp.y)
        // Apply reveal opacity
        ctx.fillStyle = color.replace('0.85', String((0.85 * revealed * brightness).toFixed(2)))
        ctx.fill()
      }

      // Draw scan line
      const gradLine = ctx.createLinearGradient(0, scanPixel - 3, 0, scanPixel + 3)
      gradLine.addColorStop(0, 'rgba(180, 80, 255, 0)')
      gradLine.addColorStop(0.5, 'rgba(180, 80, 255, 0.9)')
      gradLine.addColorStop(1, 'rgba(180, 80, 255, 0)')
      ctx.fillStyle = gradLine
      ctx.fillRect(0, scanPixel - 3, W, 6)

      // Glow line
      ctx.beginPath()
      ctx.moveTo(0, scanPixel)
      ctx.lineTo(W, scanPixel)
      ctx.strokeStyle = 'rgba(180, 80, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}

/* ─── Animation variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: delay ?? 0, ease: [0.22, 1, 0.36, 1] },
  }),
}

const STATS = [
  { value: '3大',    label: '产品系列' },
  { value: '10+',   label: '行业场景' },
  { value: '99.5%+', label: '检测精度' },
]

export default function Hero() {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      {/* Background dot grid */}
      <div className="hero__dotgrid" aria-hidden="true" />
      {/* Top-left glow */}
      <div className="hero__glow" aria-hidden="true" />

      <div className="container hero__inner">
        {/* Left content */}
        <div className="hero__content">
          {/* Badge */}
          <motion.div
            className="hero__badge badge"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="hero__badge-dot" />
            AI Agentic 时代
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero__headline"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
          >
            <span>以智能重塑</span>
            <br />
            <span className="gradient-text">工业感知边界</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero__subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
          >
            YuanChu Robotics — 聚焦三维视觉感知与工业AI，构建从感知到决策的完整智能体系
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero__actions"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
          >
            <button
              className="btn btn-primary"
              onClick={() => scrollTo('#products')}
            >
              探索产品
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => scrollTo('#contact')}
            >
              联系我们
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="hero__stats"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.44}
          >
            {STATS.map((s, i) => (
              <div key={i} className="hero__stat">
                <span className="hero__stat-value gradient-text">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: point cloud visualization */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <PointCloudCanvas />
          {/* LIDAR SCAN ACTIVE badge */}
          <div className="hero__lidar-badge">
            <span className="hero__lidar-dot" />
            LIDAR SCAN ACTIVE
          </div>
          {/* Coordinates overlay */}
          <div className="hero__coords" aria-live="polite">
            <span>X: 14.23m</span>
            <span>Y: 2.81m</span>
            <span>Z: 3.45m</span>
          </div>
          <div className="hero__visual-label">3D Point Cloud</div>
          <div className="hero__visual-corner hero__visual-corner--tl" />
          <div className="hero__visual-corner hero__visual-corner--tr" />
          <div className="hero__visual-corner hero__visual-corner--bl" />
          <div className="hero__visual-corner hero__visual-corner--br" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}
