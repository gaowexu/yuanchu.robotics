import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_LINKS = [
  { label: '首页',    href: '#hero' },
  { label: '关于我们', href: '#about' },
  { label: '核心产品', href: '#products' },
  { label: '核心技术', href: '#technology' },
  { label: '成功案例', href: '#cases' },
  { label: '联系我们', href: '#contact' },
]

function SignalLogo() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sigGrad" x1="0" y1="0" x2="38" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9C27B0"/>
          <stop offset="100%" stopColor="#5E1098"/>
        </linearGradient>
      </defs>
      {/* Baseline */}
      <line x1="0" y1="17" x2="38" y2="17" stroke="rgba(123,31,162,0.2)" strokeWidth="1"/>
      {/* Signal waveform: flat → spike → flat → smooth hump */}
      <path
        d="M2 17 L8 17 L12 3 L16 17 L20 17 Q24 8 28 17 L36 17"
        stroke="url(#sigGrad)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot at peak */}
      <circle cx="12" cy="3" r="2" fill="#9C27B0"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <a
          href="#hero"
          className="navbar__logo"
          onClick={(e) => handleNavClick(e, '#hero')}
          aria-label="原初智能 首页"
        >
          <SignalLogo />
          <div className="navbar__brand">
            <span className="navbar__brand-cn">原初智能</span>
            <span className="navbar__brand-en">YUANCHU ROBOTICS</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="navbar__nav" aria-label="主导航">
          <ul className="navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="navbar__link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="navbar__cta btn btn-primary"
          onClick={(e) => handleNavClick(e, '#contact')}
        >
          立即咨询
        </a>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__mobile-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="navbar__mobile-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="btn btn-primary navbar__mobile-cta"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              立即咨询
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
