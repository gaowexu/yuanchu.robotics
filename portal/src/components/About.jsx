import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './About.css'

const VALUES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="var(--accent-primary)" strokeWidth="1.5"/>
        <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: '前沿研究',
    desc: '持续跟踪 CVPR、ICCV、ICRA 等顶会成果，将学术突破快速转化为工程实力。',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="2.5" stroke="var(--accent-primary)" strokeWidth="1.5"/>
        <path d="M7 10h6M10 7v6" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: '工业级可靠',
    desc: '每套系统经过严苛的工业现场验证，确保在恶劣环境下的稳定性与精度。',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 2v16M3 6l7 4 7-4" stroke="var(--accent-primary)" strokeWidth="1.2" strokeLinejoin="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Agentic 驱动',
    desc: '以 AI Agent 为核心架构，赋予系统自主感知、决策与执行的完整能力链。',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 14l4-4 3 3 5-6" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="4" cy="14" r="1.5" fill="var(--accent-primary)"/>
        <circle cx="8" cy="10" r="1.5" fill="var(--accent-primary)"/>
        <circle cx="11" cy="13" r="1.5" fill="var(--accent-primary)"/>
        <circle cx="16" cy="7" r="1.5" fill="var(--accent-primary)"/>
      </svg>
    ),
    title: '定制化服务',
    desc: '深入理解客户业务场景，提供从方案设计、系统集成到持续运维的全周期定制服务。',
  },
]

const HIGHLIGHTS = [
  {
    title: '创立于 AI Agentic 元年',
    desc: '诞生于新一代智能化浪潮，以 Agentic AI 重塑工业感知范式',
  },
  {
    title: '清华·复旦 技术基因',
    desc: '创始团队来自清华大学与复旦大学，深耕计算机视觉与机器人学多年',
  },
  {
    title: '专注工业三维视觉感知',
    desc: '聚焦航空货运、工业制造、物流仓储等行业的三维感知与智能决策',
  },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="about__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="about__header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">关于我们</p>
          <h2 className="section-title">关于<span className="gradient-text">原初智能</span></h2>
        </motion.div>

        {/* Top grid: text + highlights */}
        <div className="about__top-grid">
          <motion.div
            className="about__text-col"
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="about__para">
              原初智能科技（YuanChu Robotics）是一家专注于工业三维视觉感知与 AI Agentic 技术的新型高科技企业，创始团队来自清华大学与复旦大学，深耕计算机视觉、机器人学与人工智能领域多年。
            </p>
            <p className="about__para">
              我们以"让机器拥有立体感知智慧"为使命，致力于赋予工业系统真正意义上的三维感知能力，推动从感知到决策的全链路智能化升级。
            </p>
            <p className="about__para">
              依托自研的三维重建与 AI 推理技术，原初智能为航空货运、工业制造、物流仓储、基础设施等行业提供具有颠覆性价值的智能解决方案，构建从边缘感知到云端管理的完整技术闭环。
            </p>
          </motion.div>

          <motion.div
            className="about__highlights-col"
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__highlights-card">
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} className="about__highlight-item">
                  <h3 className="about__highlight-title">{h.title}</h3>
                  <p className="about__highlight-desc">{h.desc}</p>
                  {i < HIGHLIGHTS.length - 1 && <div className="about__highlight-divider" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom: 4 value cards full width */}
        <div className="about__values-grid">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              className="about__value-card"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.32 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="about__value-icon">{v.icon}</div>
              <h3 className="about__value-title">{v.title}</h3>
              <p className="about__value-desc">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
