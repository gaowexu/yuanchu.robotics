import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Cases.css'

/* ─── Case visual wrapper ───────────────────────────────────────── */
function CaseVisual({ product, accentColor, imageUrl }) {
  return (
    <div className="case__visual" aria-hidden="true">
      <img src={imageUrl} alt="" className="case__img" />
      <div className="case__visual-overlay" />
      <div
        className="case__visual-product"
        style={{ color: accentColor, borderColor: `${accentColor}60`, background: 'rgba(6,8,18,0.75)' }}
      >
        {product}
      </div>
      <div className="case__scan-line" />
    </div>
  )
}

/* ─── Case data ─────────────────────────────────────────────────── */
const CASES = [
  {
    id: 1,
    imageUrl: '/imgs/aviation_logistics.png',
    client: '某国际枢纽机场',
    industry: '航空货运',
    industryTag: 'Aviation Logistics',
    product: '玄穹 F3 融合旗舰版',
    challenge: '机场每日处理货物超10万件，传统人工清点效率低、误差率高，急需实现7×24小时无人值守的货物三维测量与自动入库。',
    solution: '部署龙门架式玄穹 F3 系统，实现货物三维尺寸、重量估算、条码识别一体化，数据实时上传云端管理平台，与仓储WMS系统无缝对接。',
    results: [
      { value: '85%',   label: '效率提升' },
      { value: '99.6%', label: '识别准确率' },
      { value: '7×24h', label: '无人值守' },
    ],
    testimonial: '原初智能的系统将我们的货物清点效率提升了85%，实现了真正意义上的全自动无人值守运行，年节省运营成本超800万元。',
    author: '某机场物流运营部负责人',
    accentColor: '#9933CC',
  },
  {
    id: 2,
    imageUrl: '/imgs/bulk_material.webp',
    client: '华东某大型骨料集团',
    industry: '建材物流',
    industryTag: 'Bulk Material',
    product: '苍穹 L3 旗舰版',
    challenge: '砂石骨料装车计量长期依赖地磅，存在排队等待、计量误差等问题，亟需一套快速、精准的动态三维计量方案。',
    solution: '部署苍穹 L3 激光雷达三维扫描系统，在装车过程中实时扫描料堆三维形貌，动态计算装载量，与磅单系统联动，实现秒级出单。',
    results: [
      { value: '±0.3%', label: '计量精度' },
      { value: '90%',   label: '通行效率提升' },
      { value: '300万', label: '年节省人力成本' },
    ],
    testimonial: '苍穹系统让我们彻底告别了排队过磅的困境，计量精度更高，出单更快，客户满意度大幅提升。',
    author: '某骨料集团信息化总监',
    accentColor: '#7722AA',
  },
  {
    id: 3,
    imageUrl: '/imgs/EV_manufacturing.webp',
    client: '华南某新能源电池制造商',
    industry: '新能源制造',
    industryTag: 'EV Manufacturing',
    product: '慧眼 V3 专业版',
    challenge: '电池极片在生产过程中需要对涂层均匀性、尺寸偏差、表面缺陷进行100%全检，传统人工抽检漏检率高，无法满足良品率要求。',
    solution: '在产线关键工位部署慧眼 V3 多相机阵列系统，结合深度学习缺陷检测模型，实现对极片表面的毫秒级全自动检测，检测结果自动反馈至产线控制系统。',
    results: [
      { value: '99.8%',  label: '缺陷检出率' },
      { value: '<0.01%', label: '漏检率' },
      { value: '500万+', label: '年节省质检成本' },
    ],
    testimonial: '引入原初智能的视觉检测系统后，我们的产品良品率提升到行业顶尖水平，质检成本大幅下降，为公司创造了显著的经济价值。',
    author: '某电池制造商质量总监',
    accentColor: '#9933CC',
  },
  {
    id: 4,
    imageUrl: '/imgs/express_logistics.webp',
    client: '某全国领先快递物流企业',
    industry: '快递物流',
    industryTag: 'Express Logistics',
    product: '慧眼 V2 标准版',
    challenge: '快递包裹体积计费需要快速准确测量每件包裹的三维尺寸，传统测量方式速度慢、误差大，影响计费准确性与操作效率。',
    solution: '在分拣中心传送带上集成慧眼 V2 动态扫描系统，包裹通过时自动完成三维测量、条码识别与计费计算，全流程100ms内完成。',
    results: [
      { value: '50万+',   label: '日处理量' },
      { value: '<0.5cm³', label: '测量误差' },
      { value: '100%',    label: '自动化计费' },
    ],
    testimonial: '系统稳定运行超过18个月，日均处理量超过50万件，完全满足我们高并发、高精度的业务需求。',
    author: '某快递企业技术研发负责人',
    accentColor: '#BB66EE',
  },
]

/* ─── Main component ────────────────────────────────────────────── */
export default function Cases() {
  const [activeCase, setActiveCase] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  const current = CASES[activeCase]

  return (
    <section id="cases" className="cases section" ref={ref}>
      <div className="cases__bg" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="cases__header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">成功案例</p>
          <h2 className="section-title">客户信任的<span className="gradient-text">选择</span></h2>
          <p className="section-subtitle">跨行业的真实落地案例，印证了原初智能三维视觉方案的颠覆性价值。</p>
        </motion.div>

        <motion.div
          className="cases__tabs"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {CASES.map((c, i) => (
            <button
              key={c.id}
              className={`cases__tab${activeCase === i ? ' cases__tab--active' : ''}`}
              onClick={() => setActiveCase(i)}
            >
              <span className="cases__tab-industry">{c.industry}</span>
              <span className="cases__tab-tag">{c.industryTag}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="cases__card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cases__left">
              <div className="cases__client-header">
                <div>
                  <h3 className="cases__client-name">{current.client}</h3>
                  <span className="cases__industry-badge">{current.industry} · {current.industryTag}</span>
                </div>
              </div>
              <div className="cases__section-block">
                <p className="cases__block-label">挑战</p>
                <p className="cases__block-text">{current.challenge}</p>
              </div>
              <div className="cases__section-block">
                <p className="cases__block-label">解决方案</p>
                <p className="cases__block-text">{current.solution}</p>
              </div>
              <div className="cases__results">
                {current.results.map((r, i) => (
                  <div key={i} className="cases__result">
                    <span className="cases__result-value gradient-text">{r.value}</span>
                    <span className="cases__result-label">{r.label}</span>
                  </div>
                ))}
              </div>
              <blockquote className="cases__quote">
                <span className="cases__quote-mark">"</span>
                <p className="cases__quote-text">{current.testimonial}</p>
                <footer className="cases__quote-author">— {current.author}</footer>
              </blockquote>
            </div>
            <div className="cases__right">
              <CaseVisual
                product={current.product}
                accentColor={current.accentColor}
                imageUrl={current.imageUrl}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="cases__dots">
          {CASES.map((_, i) => (
            <button
              key={i}
              className={`cases__dot${activeCase === i ? ' cases__dot--active' : ''}`}
              onClick={() => setActiveCase(i)}
              aria-label={`切换到案例 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
