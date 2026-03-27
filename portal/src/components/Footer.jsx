import './Footer.css'

const FOOTER_LINKS = [
  {
    heading: '核心产品',
    links: [
      { label: '慧眼™ 纯视觉系列',     href: '#products' },
      { label: '苍穹™ 激光雷达系列',   href: '#products' },
      { label: '玄穹™ 多模态融合系列', href: '#products' },
    ],
  },
  {
    heading: '核心技术',
    links: [
      { label: '点云三维重建', href: '#technology' },
      { label: '机器人ROS系统', href: '#technology' },
      { label: '边缘计算优化', href: '#technology' },
      { label: '云计算平台',   href: '#technology' },
    ],
  },
  {
    heading: '公司',
    links: [
      { label: '关于原初智能', href: '#about' },
      { label: '成功案例',     href: '#cases' },
      { label: '联系我们',     href: '#contact' },
    ],
  },
]

function SignalLogo() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="footerSigGrad" x1="0" y1="0" x2="38" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CE93D8"/>
          <stop offset="100%" stopColor="#9C27B0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="17" x2="38" y2="17" stroke="rgba(156,39,176,0.3)" strokeWidth="1"/>
      <path
        d="M2 17 L8 17 L12 3 L16 17 L20 17 Q24 8 28 17 L36 17"
        stroke="url(#footerSigGrad)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="3" r="2" fill="#CE93D8"/>
    </svg>
  )
}

function scrollTo(e, href) {
  if (href.startsWith('#')) {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top accent line */}
      <div className="footer__topline" aria-hidden="true" />

      <div className="container">
        {/* Main grid */}
        <div className="footer__grid">
          {/* Brand column */}
          <div className="footer__brand">
            <a
              href="#hero"
              className="footer__logo"
              onClick={(e) => scrollTo(e, '#hero')}
              aria-label="原初智能 首页"
            >
              <SignalLogo />
              <div className="footer__logo-text">
                <span className="footer__logo-cn">原初智能</span>
                <span className="footer__logo-sep"> | </span>
                <span className="footer__logo-en">YuanChu Robotics</span>
              </div>
            </a>
            <p className="footer__tagline">
              聚焦工业三维视觉感知与具身智能，<br />
              构建从感知到决策的完整智能体系。
            </p>
            <a
              href="mailto:yuanchu.robotics@gmail.com"
              className="footer__email"
            >
              yuanchu.robotics@gmail.com
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="footer__col">
              <h3 className="footer__col-heading">{col.heading}</h3>
              <ul className="footer__col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer__link"
                      onClick={link.href.startsWith('#') ? (e) => scrollTo(e, link.href) : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 泰州市原初智能科技有限公司. 保留所有权利.
          </p>
          <a
            href="mailto:yuanchu.robotics@gmail.com"
            className="footer__bottom-email"
          >
            yuanchu.robotics@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
