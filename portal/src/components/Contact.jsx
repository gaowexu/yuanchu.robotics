import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Contact.css'

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 8l9 5.5 9-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M15.5 13.5l-2 2a12.6 12.6 0 01-7-7l2-2-2.5-4L3 4C3 13.4 8.6 19 18 19l1.5-3-4-2.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="contact" className="contact section" ref={ref}>
      <div className="contact__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="contact__header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">联系我们</p>
          <h2 className="section-title">开启<span className="gradient-text">合作</span>之旅</h2>
          <p className="section-subtitle">
            无论您是寻求技术合作、产品咨询还是了解更多信息，我们的团队随时准备为您解答。
          </p>
        </motion.div>

        {/* Centered info cards */}
        <motion.div
          className="contact__cards"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact__company-name">
            泰州市原初智能科技有限公司
          </div>
          <p className="contact__company-desc">
            专注工业三维视觉感知与具身智能的高科技企业，致力于为工业制造、物流仓储、基础设施等行业提供颠覆性 AI 解决方案。
          </p>

          <div className="contact__contact-items">
            {/* Email */}
            <motion.div
              className="contact__item glass"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="contact__item-icon">
                <MailIcon />
              </div>
              <div>
                <div className="contact__item-label">联系邮箱</div>
                <a href="mailto:yuanchu.robotics@gmail.com" className="contact__item-value">
                  yuanchu.robotics@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="contact__item glass"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="contact__item-icon">
                <PhoneIcon />
              </div>
              <div>
                <div className="contact__item-label">联系电话</div>
                <a href="tel:+8615800836035" className="contact__item-value">
                  +86-158 0083 6035
                </a>
              </div>
            </motion.div>
          </div>

          {/* Decorative element */}
          <div className="contact__decor" aria-hidden="true">
            <div className="contact__decor-ring contact__decor-ring--1" />
            <div className="contact__decor-ring contact__decor-ring--2" />
            <div className="contact__decor-core" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
