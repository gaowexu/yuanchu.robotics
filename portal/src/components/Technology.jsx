import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Technology.css'

/* ─── Icons ───────────────────────────────────────────────────── */
function VisionIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <ellipse cx="13" cy="13" rx="10" ry="6.5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="13" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="13" cy="13" r="1" fill="currentColor"/>
    </svg>
  )
}

function RobotIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M9 10V8a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
      <path d="M11 18.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6" y1="15" x2="3" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="20" y1="15" x2="23" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13" y1="5" x2="13" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function PointCloudIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="9" r="1" fill="currentColor" opacity="0.8"/>
      <circle cx="18" cy="9" r="1" fill="currentColor" opacity="0.8"/>
      <circle cx="6" cy="14" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="14" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="9" cy="18" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="17" cy="18" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="13" cy="7" r="1" fill="currentColor" opacity="0.5"/>
      <circle cx="13" cy="20" r="1" fill="currentColor" opacity="0.5"/>
      <path d="M8 9L13 7L18 9L20 14L17 18L13 20L9 18L6 14L8 9Z" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinejoin="round"/>
    </svg>
  )
}

function EdgeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="10" y="10" width="6" height="6" rx="1" fill="currentColor" opacity="0.35"/>
      <path d="M10 7V4M13 7V4M16 7V4M10 22v-3M13 22v-3M16 22v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M7 10H4M7 13H4M7 16H4M22 10h-3M22 13h-3M22 16h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function AutoIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="13" cy="13" r="1.5" fill="currentColor"/>
      <path d="M13 4v4M13 18v4M4 13h4M18 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M7 7l3 3M16 16l3 3M7 19l3-3M16 10l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M7 17a5 5 0 01-.5-9.9 6 6 0 0111.5 1A4 4 0 0119 17H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M10 21v-4M13 21v-6M16 21v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function DataIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="4" y="18" width="4" height="5" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="11" y="13" width="4" height="10" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="18" y="8" width="4" height="15" rx="1" fill="currentColor" opacity="0.7"/>
      <path d="M6 18L13 13L20 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  )
}

function PointCloudProcessIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="1.8" fill="currentColor"/>
      <circle cx="7" cy="8" r="1.2" fill="currentColor" opacity="0.85"/>
      <circle cx="19" cy="8" r="1.2" fill="currentColor" opacity="0.85"/>
      <circle cx="5" cy="15" r="1" fill="currentColor" opacity="0.65"/>
      <circle cx="21" cy="15" r="1" fill="currentColor" opacity="0.65"/>
      <circle cx="9" cy="20" r="1.2" fill="currentColor" opacity="0.75"/>
      <circle cx="17" cy="20" r="1.2" fill="currentColor" opacity="0.75"/>
      <circle cx="13" cy="5" r="1" fill="currentColor" opacity="0.55"/>
      <circle cx="10" cy="11" r="0.9" fill="currentColor" opacity="0.7"/>
      <circle cx="16" cy="11" r="0.9" fill="currentColor" opacity="0.7"/>
      <circle cx="13" cy="17" r="0.9" fill="currentColor" opacity="0.6"/>
      <path d="M7 8L13 5L19 8L21 15L17 20L13 22L9 20L5 15L7 8Z" stroke="currentColor" strokeWidth="0.8" opacity="0.25" strokeLinejoin="round"/>
      <path d="M10 11L13 13L16 11" stroke="currentColor" strokeWidth="1" opacity="0.45" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function HPCIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="0.8" fill="currentColor" opacity="0.4"/>
      {/* Parallel lines top/bottom */}
      <line x1="9" y1="4" x2="9" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13" y1="3" x2="13" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="17" y1="4" x2="17" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="9" y1="19" x2="9" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13" y1="19" x2="13" y2="23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="17" y1="19" x2="17" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Parallel lines left/right */}
      <line x1="4" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="3" y1="13" x2="7" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="4" y1="17" x2="7" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="13" x2="23" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

const TECH_CARDS = [
  {
    Icon: VisionIcon,
    title: '计算机视觉',
    desc: '基于深度卷积网络的高精度图像理解与分析，涵盖目标检测、实例分割、缺陷识别，精度达工业标准。',
  },
  {
    Icon: RobotIcon,
    title: '机器人ROS系统',
    desc: '深度集成ROS2机器人操作系统，实现传感器融合、运动规划与自主导航的完整机器人控制链路。',
  },
  {
    Icon: PointCloudIcon,
    title: '点云视觉三维重建',
    desc: '融合多视角立体视觉与激光点云处理，实时生成高密度三维重建模型，支持亚毫米级形貌测量。',
  },
  {
    Icon: EdgeIcon,
    title: '边缘计算优化',
    desc: '专为边缘GPU/NPU优化的AI推理引擎，实现低延迟、高吞吐的现场实时推理，满足工业实时性要求。',
  },
  {
    Icon: AutoIcon,
    title: '自动化控制系统',
    desc: '工业PLC与视觉系统深度集成，实现从感知、决策到执行的全自动闭环控制，支持OPC-UA等工业协议。',
  },
  {
    Icon: CloudIcon,
    title: '云计算服务平台',
    desc: '弹性云端管理平台，支持多站点数据汇聚、模型在线更新、报表自动生成与远程运维监控。',
  },
  {
    Icon: DataIcon,
    title: '数据分析与可视化',
    desc: '大数据驱动的质量趋势分析、产线效能洞察与预测性维护，将测量数据转化为可执行的生产决策。',
  },
  {
    Icon: PointCloudProcessIcon,
    title: '三维点云处理',
    desc: '基于Open3D与PCL的高性能点云处理管线，支持点云配准、滤波、分割与特征提取，实现大规模三维数据的实时处理与分析。',
  },
  {
    Icon: HPCIcon,
    title: '高性能计算',
    desc: '面向三维重建与AI推理的高性能计算优化，充分利用CUDA并行计算与多核CPU加速，实现超大规模点云数据的实时处理能力。',
  },
]

const TECH_STACK = [
  'PyTorch', 'ROS2', 'CUDA', 'OpenCV', 'TensorRT',
  'Open3D', 'PCL', 'Docker', 'C++', 'Python',
  'AI Agent', 'Claude Code',
]

export default function Technology() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section id="technology" className="technology section" ref={ref}>
      <div className="technology__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="technology__header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">技术实力</p>
          <h2 className="section-title">9项<span className="gradient-text">核心技术</span></h2>
          <p className="section-subtitle">
            多年深耕AI与三维视觉领域，积累深厚技术壁垒，构建从感知到决策的完整技术链条。
          </p>
        </motion.div>

        {/* Tech cards grid */}
        <div className="technology__grid">
          {TECH_CARDS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="tech__card"
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="tech__icon-wrap">
                <Icon />
              </div>
              <h3 className="tech__title">{title}</h3>
              <p className="tech__desc">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          className="technology__stack"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="technology__stack-label">技术栈</p>
          <div className="technology__pills">
            {TECH_STACK.map((tech, i) => (
              <span key={i} className="technology__pill">{tech}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
