import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Products.css'

/* ─── Icons ───────────────────────────────────────────────────── */
function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="camProd" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7"/><stop offset="1" stopColor="#7722AA"/>
        </linearGradient>
      </defs>
      <rect x="2" y="7" width="24" height="17" rx="3" stroke="url(#camProd)" strokeWidth="1.8"/>
      <circle cx="14" cy="15.5" r="4.5" stroke="url(#camProd)" strokeWidth="1.8"/>
      <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h7A1.5 1.5 0 0119 5.5V7" stroke="url(#camProd)" strokeWidth="1.8"/>
      <circle cx="21" cy="11" r="1.5" fill="url(#camProd)"/>
    </svg>
  )
}

function LidarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lidarProd" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7"/><stop offset="1" stopColor="#7722AA"/>
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="3" fill="url(#lidarProd)"/>
      <circle cx="14" cy="14" r="7" stroke="url(#lidarProd)" strokeWidth="1.8"/>
      <circle cx="14" cy="14" r="11.5" stroke="url(#lidarProd)" strokeWidth="1.4" strokeDasharray="3 2"/>
      <line x1="14" y1="2.5" x2="14" y2="5" stroke="url(#lidarProd)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="23" x2="14" y2="25.5" stroke="url(#lidarProd)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2.5" y1="14" x2="5" y2="14" stroke="url(#lidarProd)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="23" y1="14" x2="25.5" y2="14" stroke="url(#lidarProd)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FusionIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fusionProd" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7"/><stop offset="1" stopColor="#7722AA"/>
        </linearGradient>
      </defs>
      <path d="M14 3L25 9v10L14 25 3 19V9L14 3z" stroke="url(#fusionProd)" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 3v22M3 9l11 6.5 11-6.5" stroke="url(#fusionProd)" strokeWidth="1.4" strokeLinejoin="round" opacity="0.45"/>
      <circle cx="14" cy="14" r="3" fill="url(#fusionProd)" opacity="0.7"/>
    </svg>
  )
}

/* ─── Product Data ─────────────────────────────────────────────── */
const PRODUCT_FAMILIES = [
  {
    id: 'vision',
    familyName: '慧眼™ 纯视觉系列',
    familyTag: 'Pure Vision 3D',
    icon: <CameraIcon />,
    familyDesc: '基于纯视觉的低成本三维重建与测量解决方案，无需激光雷达，通过多相机立体视觉与深度学习实现高精度三维测量，是中小型产线的理想选择。',
    scenarios: ['工厂流水线产品检测', '机柜台架小型测量', '包裹体积计算', '货架商品盘点'],
    tiers: [
      {
        level: 'S',
        name: '慧眼 V1 轻量版',
        subtitle: '小型产线 · 机柜台架',
        desc: '专为小型工厂与实验室设计，机柜一体化集成，即插即用。适用于零部件尺寸检测、小批量产品质检等场景。',
        specs: ['测量精度 ±3.5cm', '视野范围 300×300mm', '处理帧率 20fps', '单目相机'],
        badge: '入门首选',
      },
      {
        level: 'M',
        name: '慧眼 V2 标准版',
        subtitle: '中型产线 · 流水线集成',
        desc: '面向中型制造产线，支持多相机阵列与传送带同步触发，实现流水线在线检测。适用于汽车零部件、电子元器件等高节拍场景。',
        specs: ['测量精度 ±2.5cm', '视野范围 600×400mm', '处理帧率 30fps', '2-4相机阵列'],
        badge: '主力机型',
      },
      {
        level: 'L',
        name: '慧眼 V3 专业版',
        subtitle: '大型场景 · 龙门架部署',
        desc: '基于龙门架的大型视觉测量系统，覆盖大型工件与货物的全方位三维测量，配备多达8路相机，支持货物自动入库管理。',
        specs: ['测量精度 ±5.0cm', '视野范围 2000×3500mm', '处理帧率 30fps', '4-8相机龙门阵列'],
        badge: '大型场景',
      },
    ],
  },
  {
    id: 'lidar',
    familyName: '苍穹™ 激光雷达系列',
    familyTag: 'LiDAR 3D Scanning',
    icon: <LidarIcon />,
    familyDesc: '激光雷达驱动的高精度三维空间扫描与测量系统，适用于室内外大型空间，在砂石装车计量、港口货物测量、大型仓储盘点等场景中表现卓越。',
    scenarios: ['砂石骨料装车计量', '港口集装箱测量', '矿山开采体积计算', '大型仓储盘点'],
    tiers: [
      {
        level: 'S',
        name: '苍穹 L1 标准版',
        subtitle: '室内场景 · 单雷达方案',
        desc: '单激光雷达配置，适用于室内仓储与中小型货场，快速完成空间三维建图与货物体积测量，部署简便。',
        specs: ['扫描精度 ±5cm', '扫描范围 40m半径', '点云密度 64线', '扫描频率 10Hz'],
        badge: '快速部署',
      },
      {
        level: 'M',
        name: '苍穹 L2 专业版',
        subtitle: '室外货场 · 多雷达融合',
        desc: '多激光雷达空间融合方案，覆盖大型室外货场与港口作业区，支持动态目标追踪与实时体积计算。',
        specs: ['扫描精度 ±5cm', '扫描范围 100m半径', '多激光雷达三维重建', '多雷达时间同步'],
        badge: '货场首选',
      },
      {
        level: 'L',
        name: '苍穹 L3 旗舰版',
        subtitle: '全天候 · 高精度时间同步',
        desc: '面向极端工况的旗舰级解决方案，支持全天候作业，配备高精度IMU与GNSS融合，实现亚厘米级精度的大范围三维重建与精密计量。',
        specs: ['扫描精度 ±3cm', '扫描范围 200m半径', '点云密度 256线', 'IMU+GNSS时间同步'],
        badge: '精工旗舰',
      },
    ],
  },
  {
    id: 'fusion',
    familyName: '玄穹™ 多模态融合系列',
    familyTag: 'Multi-modal Fusion',
    icon: <FusionIcon />,
    familyDesc: '多相机与激光雷达深度融合的旗舰级解决方案，配备精确时间同步、自动标定与云端管理平台，是机场货运、大型工厂、港口物流的终极三维感知方案。',
    scenarios: ['机场货物三维测量入库', '大型港口自动化作业', '高速公路超限检测', '重工业质量追溯'],
    tiers: [
      {
        level: 'S',
        name: '玄穹 F1 融合标准版',
        subtitle: '相机+激光雷达 · 轻量融合',
        desc: '2路高分辨率相机与单激光雷达融合，兼顾纹理信息与几何精度，适合中型工厂的产品外观与尺寸协同检测。',
        specs: ['融合精度 ±3cm', '数据延迟 <50ms', '2相机+1激光雷达', '自动标定模块'],
        badge: '融合入门',
      },
      {
        level: 'M',
        name: '玄穹 F2 融合专业版',
        subtitle: '多相机+多激光雷达+IMU',
        desc: '6路相机与2-4台激光雷达协同工作，配备高精度IMU进行运动补偿，支持动态场景下的高速精密测量。',
        specs: ['融合精度 ±3.0cm', '数据延迟 <20ms', '6相机+2-4激光雷达+IMU', '硬件时间同步'],
        badge: '专业主力',
      },
      {
        level: 'L',
        name: '玄穹 F3 融合旗舰版',
        subtitle: '龙门架全套 · 云端管理',
        desc: '完整的龙门架多模态感知系统，集成8-16路相机、6台激光雷达、IMU与高精度GNSS，配备云端数据管理平台，支持三维重建、着色、测量、入库全流程自动化。',
        specs: ['融合精度 ±3cm', '实时处理 4K@30fps', '6-9相机+4-8激光雷达+IMU+GNSS', '云端管理平台'],
        badge: '终极方案',
      },
    ],
  },
]

const TIER_COLORS = { S: 'tier-s', M: 'tier-m', L: 'tier-l' }

function TierCard({ tier, level }) {
  return (
    <div className={`products__tier-card products__tier-card--${TIER_COLORS[tier.level]}`}>
      <div className="products__tier-header">
        <span className={`products__tier-level products__tier-level--${TIER_COLORS[tier.level]}`}>
          {tier.level}
        </span>
        <div className="products__tier-names">
          <span className="products__tier-name">{tier.name}</span>
          <span className="products__tier-subtitle">{tier.subtitle}</span>
        </div>
        <span className="products__tier-badge">{tier.badge}</span>
      </div>
      <p className="products__tier-desc">{tier.desc}</p>
      <ul className="products__tier-specs">
        {tier.specs.map((spec, i) => (
          <li key={i} className="products__tier-spec">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
              <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {spec}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Products() {
  const [activeTab, setActiveTab] = useState('vision')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  const activeFamily = PRODUCT_FAMILIES.find((f) => f.id === activeTab)

  return (
    <section id="products" className="products section" ref={ref}>
      <div className="products__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="products__header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">核心产品</p>
          <h2 className="section-title">三大产品<span className="gradient-text">系列</span></h2>
          <p className="section-subtitle">
            覆盖纯视觉、激光雷达与多模态融合三大技术路线，满足从轻量入门到旗舰级工业部署的全场景需求。
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          className="products__tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {PRODUCT_FAMILIES.map((family) => (
            <button
              key={family.id}
              className={`products__tab${activeTab === family.id ? ' products__tab--active' : ''}`}
              onClick={() => setActiveTab(family.id)}
            >
              <span className="products__tab-icon">{family.icon}</span>
              <span className="products__tab-label">
                <span className="products__tab-cn">{family.familyName.split(' ')[0]}</span>
                <span className="products__tab-en">{family.familyTag}</span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Active family content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="products__body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left: family info */}
            <div className="products__family-info">
              <div className="products__family-header">
                <div className="products__family-icon">{activeFamily.icon}</div>
                <div>
                  <h3 className="products__family-name">{activeFamily.familyName}</h3>
                  <span className="products__family-tag">{activeFamily.familyTag}</span>
                </div>
              </div>
              <p className="products__family-desc">{activeFamily.familyDesc}</p>

              <div className="products__scenarios">
                <p className="products__scenarios-label">适用场景</p>
                <div className="products__scenario-tags">
                  {activeFamily.scenarios.map((s, i) => (
                    <span key={i} className="products__scenario-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: tier cards */}
            <div className="products__tiers">
              {activeFamily.tiers.map((tier, i) => (
                <TierCard key={i} tier={tier} level={tier.level} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
