import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

/* ─── Slideshow ────────────────────────────────────────────────── */
const HERO_IMAGES = [
  '/imgs/main_img_0.avif',
  '/imgs/main_img_1.avif',
  '/imgs/main_img_2.jpg',
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % HERO_IMAGES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero__slideshow">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          className={`hero__slide${i === current ? ' hero__slide--active' : ''}`}
          alt=""
          aria-hidden="true"
        />
      ))}
      <div className="hero__slide-dots">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`hero__slide-dot${i === current ? ' hero__slide-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`切换到第 ${i + 1} 张图`}
          />
        ))}
      </div>
    </div>
  )
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

        {/* Right: image slideshow */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <HeroSlideshow />
          <div className="hero__visual-overlay" />
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
