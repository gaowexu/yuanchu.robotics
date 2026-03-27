import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Cases.css'

/* ─── Pre-computed deterministic pile points (no per-frame random) */
const PILE_PTS = (() => {
  const pts = []
  for (let row = 0; row < 11; row++) {
    const frac = row / 10
    const w = 0.12 + frac * 0.76
    const n = Math.round(4 + frac * 24)
    for (let d = 0; d < n; d++) {
      const t = n === 1 ? 0.5 : d / (n - 1)
      pts.push({ x: 0.5 - w / 2 + t * w, y: 0.08 + frac * 0.62, op: 0.35 + frac * 0.55 })
    }
  }
  return pts
})()

/* ─── Case canvas illustrations ────────────────────────────────── */

function drawAirport(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H)
  const cx = W * 0.5, cy = H * 0.46
  const R = Math.min(W, H) * 0.36

  // Radar rings
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath()
    ctx.arc(cx, cy, R * i / 4, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(171,71,188,${0.10 + i * 0.04})`
    ctx.lineWidth = 0.8
    ctx.stroke()
  }
  // Cross hairs
  for (const a of [0, Math.PI / 2]) {
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
    ctx.lineTo(cx - Math.cos(a) * R, cy - Math.sin(a) * R)
    ctx.strokeStyle = 'rgba(171,71,188,0.14)'
    ctx.lineWidth = 0.7
    ctx.stroke()
  }

  // Sweep
  const ang = (t * 0.0007) % (Math.PI * 2)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(ang)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, R, -0.55, 0.55)
  ctx.closePath()
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
  sg.addColorStop(0, 'rgba(171,71,188,0.28)')
  sg.addColorStop(1, 'rgba(171,71,188,0.01)')
  ctx.fillStyle = sg
  ctx.fill()
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0)
  ctx.strokeStyle = 'rgba(206,147,216,0.85)'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.restore()

  // Cargo containers (isometric boxes)
  const boxes = [
    { x: cx - 88, y: cy - 32, w: 72, h: 40 },
    { x: cx + 10,  y: cy - 22, w: 72, h: 40 },
    { x: cx + 90,  y: cy - 10, w: 62, h: 36 },
    { x: cx - 70,  y: cy + 32, w: 80, h: 40 },
    { x: cx + 30,  y: cy + 40, w: 68, h: 36 },
  ]
  boxes.forEach(b => {
    // Front face
    ctx.beginPath(); ctx.rect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h)
    ctx.fillStyle = 'rgba(62,16,112,0.45)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.58)'; ctx.lineWidth = 1; ctx.stroke()
    // Top face
    const dx = 13, dy = -10
    ctx.beginPath()
    ctx.moveTo(b.x - b.w / 2, b.y - b.h / 2)
    ctx.lineTo(b.x - b.w / 2 + dx, b.y - b.h / 2 + dy)
    ctx.lineTo(b.x + b.w / 2 + dx, b.y - b.h / 2 + dy)
    ctx.lineTo(b.x + b.w / 2, b.y - b.h / 2)
    ctx.closePath()
    ctx.fillStyle = 'rgba(98,26,160,0.40)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.40)'; ctx.stroke()
  })

  // Blips (detected targets)
  const blips = [{ x: cx - 90, y: cy - 50 }, { x: cx + 100, y: cy + 55 }, { x: cx - 30, y: cy + 75 }]
  blips.forEach(b => {
    ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(206,147,216,0.90)'; ctx.fill()
    ctx.beginPath(); ctx.arc(b.x, b.y, 7, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(206,147,216,0.30)'; ctx.lineWidth = 1; ctx.stroke()
  })

  // Airplane outline (top-down)
  ctx.save(); ctx.translate(cx, cy - R * 0.72)
  ctx.beginPath()
  ctx.ellipse(0, 0, 42, 8, 0, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(171,71,188,0.45)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-6, 4); ctx.lineTo(-52, 22); ctx.lineTo(-44, 4)
  ctx.moveTo(6, 4); ctx.lineTo(52, 22); ctx.lineTo(44, 4)
  ctx.strokeStyle = 'rgba(171,71,188,0.32)'; ctx.stroke()
  ctx.restore()

  // Readout
  ctx.font = '9px "Courier New",monospace'
  ctx.fillStyle = 'rgba(206,147,216,0.78)'
  ctx.textAlign = 'right'
  ctx.fillText('OBJECTS: 5', W - 14, H - 36)
  ctx.fillText('SCAN: ACTIVE', W - 14, H - 22)
  ctx.fillText('RANGE: 200m', W - 14, H - 8)
}

function drawAggregate(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H)
  const tx = W * 0.44, ty = H * 0.64

  // Truck body (cargo bed)
  ctx.beginPath(); ctx.rect(tx - 115, ty - 58, 188, 58)
  ctx.fillStyle = 'rgba(30,8,60,0.60)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.52)'; ctx.lineWidth = 1.5; ctx.stroke()

  // Cab
  ctx.beginPath(); ctx.rect(tx + 72, ty - 72, 68, 72)
  ctx.fillStyle = 'rgba(30,8,60,0.55)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.45)'; ctx.lineWidth = 1.2; ctx.stroke()
  // Windshield
  ctx.beginPath(); ctx.rect(tx + 78, ty - 65, 46, 28)
  ctx.fillStyle = 'rgba(62,16,112,0.40)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.30)'; ctx.lineWidth = 0.8; ctx.stroke()

  // Wheels
  ;[tx - 85, tx + 18, tx + 100].forEach(wx => {
    ctx.beginPath(); ctx.arc(wx, ty + 14, 18, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(12,3,25,0.85)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.42)'; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.beginPath(); ctx.arc(wx, ty + 14, 8, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(171,71,188,0.28)'; ctx.lineWidth = 1; ctx.stroke()
  })

  // Aggregate pile (pre-computed points mapped to truck bed)
  const bedX = tx - 112, bedW = 182, bedTop = ty - 58
  PILE_PTS.forEach(p => {
    const px = bedX + p.x * bedW
    const py = bedTop + p.y * (bedW * 0.52) - bedW * 0.04
    if (py < ty - 1 && py > 20) {
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(206,147,216,${p.op})`; ctx.fill()
    }
  })

  // LiDAR scanner beam sweeping across pile
  const scanProgress = (t * 0.00038) % 1
  const scanX = bedX + scanProgress * (bedW + 10) - 5
  if (scanX > 0 && scanX < W) {
    const sg = ctx.createLinearGradient(scanX, 16, scanX, ty - 4)
    sg.addColorStop(0, 'rgba(171,71,188,0.85)')
    sg.addColorStop(0.5, 'rgba(171,71,188,0.40)')
    sg.addColorStop(1, 'rgba(171,71,188,0.05)')
    ctx.beginPath(); ctx.moveTo(scanX, 16); ctx.lineTo(scanX, ty - 4)
    ctx.strokeStyle = sg; ctx.lineWidth = 1.5; ctx.stroke()
    // Emitter dot
    ctx.beginPath(); ctx.arc(scanX, 16, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(206,147,216,0.95)'; ctx.fill()
  }

  // LiDAR scanner rail at top
  ctx.beginPath(); ctx.rect(bedX - 4, 8, bedW + 8, 8)
  ctx.fillStyle = 'rgba(62,16,112,0.70)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.50)'; ctx.lineWidth = 1; ctx.stroke()

  ctx.font = '9px "Courier New",monospace'
  ctx.fillStyle = 'rgba(206,147,216,0.80)'
  ctx.textAlign = 'right'
  const vol = (28.4 + Math.sin(t * 0.001) * 0.2).toFixed(1)
  ctx.fillText(`VOL: ${vol} m³`, W - 14, H - 36)
  ctx.fillText('PRECISION: ±0.3%', W - 14, H - 22)
  ctx.fillText('REAL-TIME OUTPUT', W - 14, H - 8)
}

function drawBattery(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H)

  const cols = 6, rows = 4
  const cellW = Math.min(58, (W - 60) / cols - 10)
  const cellH = cellW * 1.35
  const gx = (cellW + 10), gy = (cellH + 12)
  const gridW = cols * gx - 10, gridH = rows * gy - 12
  const sx = (W - gridW) / 2, sy = (H - gridH) / 2 + 6

  // Defective cells (deterministic)
  const defects = new Set(['1-1', '3-2', '4-0', '0-3'])

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = sx + c * gx, y = sy + r * gy
      const bad = defects.has(`${c}-${r}`)

      // Cell body
      ctx.beginPath(); ctx.rect(x, y, cellW, cellH)
      ctx.fillStyle = bad ? 'rgba(120,18,50,0.55)' : 'rgba(55,14,100,0.55)'
      ctx.fill()
      ctx.strokeStyle = bad ? 'rgba(220,60,90,0.70)' : 'rgba(171,71,188,0.52)'
      ctx.lineWidth = 1; ctx.stroke()

      // Terminal tab
      ctx.beginPath(); ctx.rect(x + cellW * 0.28, y - 7, cellW * 0.44, 7)
      ctx.fillStyle = bad ? 'rgba(220,60,90,0.45)' : 'rgba(98,26,160,0.55)'
      ctx.fill(); ctx.stroke()

      if (!bad) {
        // Charge indicator bar
        const fill = cellH * 0.60
        ctx.beginPath(); ctx.rect(x + 7, y + cellH - fill - 5, cellW - 14, fill)
        ctx.fillStyle = 'rgba(171,71,188,0.22)'; ctx.fill()
        // Horizontal lines inside
        for (let li = 0; li < 3; li++) {
          const ly = y + cellH - 14 - li * 14
          ctx.beginPath(); ctx.moveTo(x + 7, ly); ctx.lineTo(x + cellW - 7, ly)
          ctx.strokeStyle = 'rgba(171,71,188,0.18)'; ctx.lineWidth = 0.8; ctx.stroke()
        }
      } else {
        // X mark
        ctx.beginPath()
        ctx.moveTo(x + 10, y + 12); ctx.lineTo(x + cellW - 10, y + cellH - 12)
        ctx.moveTo(x + cellW - 10, y + 12); ctx.lineTo(x + 10, y + cellH - 12)
        ctx.strokeStyle = 'rgba(220,60,90,0.85)'; ctx.lineWidth = 1.5; ctx.stroke()
      }
    }
  }

  // Scan beam
  const scanY = sy + ((t * 0.00042) % 1.12) * (gridH + cellH) - cellH * 0.06
  const sg = ctx.createLinearGradient(sx - 8, scanY, sx + gridW + 8, scanY)
  sg.addColorStop(0, 'rgba(171,71,188,0)')
  sg.addColorStop(0.15, 'rgba(171,71,188,0.55)')
  sg.addColorStop(0.85, 'rgba(171,71,188,0.55)')
  sg.addColorStop(1, 'rgba(171,71,188,0)')
  ctx.fillStyle = sg; ctx.fillRect(sx - 8, scanY - 2, gridW + 16, 4)
  ctx.beginPath(); ctx.moveTo(sx - 8, scanY); ctx.lineTo(sx + gridW + 8, scanY)
  ctx.strokeStyle = 'rgba(206,147,216,0.78)'; ctx.lineWidth = 1; ctx.stroke()

  // Camera viewport lines at top
  ctx.beginPath()
  ctx.moveTo(sx - 20, 14); ctx.lineTo(sx, sy - 8)
  ctx.moveTo(sx + gridW + 20, 14); ctx.lineTo(sx + gridW, sy - 8)
  ctx.strokeStyle = 'rgba(171,71,188,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4])
  ctx.stroke(); ctx.setLineDash([])

  ctx.font = '9px "Courier New",monospace'
  ctx.fillStyle = 'rgba(206,147,216,0.80)'
  ctx.textAlign = 'right'
  ctx.fillText('INSPECT: 100%', W - 14, H - 36)
  ctx.fillText('DEFECTS: 4/24', W - 14, H - 22)
  ctx.fillText('DEFECT RATE: 16.7%', W - 14, H - 8)
}

function drawParcel(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H)

  const beltY = H * 0.52, beltH = H * 0.16

  // Belt surface
  ctx.beginPath(); ctx.rect(0, beltY, W, beltH)
  ctx.fillStyle = 'rgba(30,8,60,0.62)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.32)'; ctx.lineWidth = 1; ctx.stroke()

  // Belt lane dividers (static)
  ctx.beginPath(); ctx.moveTo(0, beltY + beltH * 0.5); ctx.lineTo(W, beltY + beltH * 0.5)
  ctx.strokeStyle = 'rgba(171,71,188,0.16)'; ctx.lineWidth = 0.8; ctx.stroke()

  // Moving belt stripes
  const stripeSpacing = 36
  const offset = (t * 0.052) % stripeSpacing
  for (let x = offset - stripeSpacing; x < W + stripeSpacing; x += stripeSpacing) {
    ctx.beginPath(); ctx.moveTo(x, beltY); ctx.lineTo(x, beltY + beltH)
    ctx.strokeStyle = 'rgba(171,71,188,0.10)'; ctx.lineWidth = 1; ctx.stroke()
  }

  // Belt rollers at ends
  for (const rx of [12, W - 12]) {
    ctx.beginPath(); ctx.ellipse(rx, beltY + beltH / 2, 10, beltH / 2, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(62,16,112,0.70)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.45)'; ctx.lineWidth = 1; ctx.stroke()
  }

  // Packages (3 visible, animating)
  const speed = t * 0.038
  const pkgs = [
    { base: 80,  w: 76, h: 60, label: '42×38×55cm', hasBracket: false, hasBarcode: true },
    { base: 280, w: 58, h: 48, label: '30×28×40cm', hasBracket: true,  hasBarcode: false },
    { base: 460, w: 84, h: 66, label: '55×45×60cm', hasBracket: false, hasBarcode: false },
    { base: 660, w: 54, h: 44, label: '28×22×35cm', hasBracket: false, hasBarcode: true },
    { base: 840, w: 70, h: 56, label: '38×35×50cm', hasBracket: false, hasBarcode: false },
  ]

  pkgs.forEach(pkg => {
    const rawX = ((pkg.base - speed * 28) % (W + 200)) - 100
    if (rawX < -120 || rawX > W + 20) return
    const x = rawX, y = beltY - pkg.h

    // Front face
    ctx.beginPath(); ctx.rect(x, y, pkg.w, pkg.h)
    ctx.fillStyle = 'rgba(55,14,100,0.68)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.62)'; ctx.lineWidth = 1.2; ctx.stroke()

    // Top face (iso)
    const iso = 12
    ctx.beginPath()
    ctx.moveTo(x, y); ctx.lineTo(x + iso, y - iso * 0.7)
    ctx.lineTo(x + pkg.w + iso, y - iso * 0.7); ctx.lineTo(x + pkg.w, y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(98,26,160,0.48)'; ctx.fill()
    ctx.strokeStyle = 'rgba(171,71,188,0.45)'; ctx.lineWidth = 1; ctx.stroke()

    // Tape stripe
    ctx.beginPath(); ctx.rect(x, y + pkg.h * 0.44, pkg.w, 5)
    ctx.fillStyle = 'rgba(171,71,188,0.22)'; ctx.fill()

    // Measurement brackets
    if (pkg.hasBracket) {
      ctx.strokeStyle = 'rgba(206,147,216,0.90)'; ctx.lineWidth = 1
      // Width
      const by = y + pkg.h + 11
      ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + pkg.w, by); ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, by - 4); ctx.lineTo(x, by + 4)
      ctx.moveTo(x + pkg.w, by - 4); ctx.lineTo(x + pkg.w, by + 4)
      ctx.stroke()
      // Height
      const bx2 = x + pkg.w + 10
      ctx.beginPath(); ctx.moveTo(bx2, y); ctx.lineTo(bx2, y + pkg.h); ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(bx2 - 4, y); ctx.lineTo(bx2 + 4, y)
      ctx.moveTo(bx2 - 4, y + pkg.h); ctx.lineTo(bx2 + 4, y + pkg.h)
      ctx.stroke()
      // Label
      ctx.font = '9px "Courier New",monospace'
      ctx.fillStyle = 'rgba(206,147,216,0.95)'
      ctx.textAlign = 'center'
      ctx.fillText(pkg.label, x + pkg.w / 2, by + 16)
      ctx.textAlign = 'left'
    }

    // Barcode
    if (pkg.hasBarcode) {
      const bx = x + 8, by = y + pkg.h * 0.25
      for (let b = 0; b < 14; b++) {
        const bw = (b % 3 === 0) ? 2.5 : 1.2
        ctx.beginPath(); ctx.rect(bx + b * 4, by, bw, pkg.h * 0.45)
        ctx.fillStyle = 'rgba(206,147,216,0.48)'; ctx.fill()
      }
    }
  })

  // Overhead scanner
  const scanCX = W * 0.42
  ctx.beginPath()
  ctx.moveTo(scanCX, 14); ctx.lineTo(scanCX - 28, beltY); ctx.lineTo(scanCX + 28, beltY)
  ctx.closePath()
  const tg = ctx.createLinearGradient(scanCX, 14, scanCX, beltY)
  tg.addColorStop(0, 'rgba(171,71,188,0.42)')
  tg.addColorStop(1, 'rgba(171,71,188,0.04)')
  ctx.fillStyle = tg; ctx.fill()
  ctx.beginPath(); ctx.rect(scanCX - 20, 6, 40, 12)
  ctx.fillStyle = 'rgba(62,16,112,0.82)'; ctx.fill()
  ctx.strokeStyle = 'rgba(171,71,188,0.60)'; ctx.lineWidth = 1; ctx.stroke()

  ctx.font = '9px "Courier New",monospace'
  ctx.fillStyle = 'rgba(206,147,216,0.80)'
  ctx.textAlign = 'right'
  ctx.fillText('THROUGHPUT: 500K/day', W - 14, H - 36)
  ctx.fillText('ERROR: <0.5cm³', W - 14, H - 22)
  ctx.fillText('BILLING: AUTO 100%', W - 14, H - 8)
}

const DRAW_FN = { airport: drawAirport, aggregate: drawAggregate, battery: drawBattery, parcel: drawParcel }

function CaseCanvas({ drawType }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const fn = DRAW_FN[drawType]
    const loop = (t) => {
      fn(ctx, canvas.offsetWidth, canvas.offsetHeight, t)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [drawType])

  return <canvas ref={canvasRef} className="case__canvas" aria-hidden="true" />
}

/* ─── Case visual wrapper ───────────────────────────────────────── */
function CaseVisual({ product, accentColor, drawType }) {
  return (
    <div className="case__visual" aria-hidden="true">
      <CaseCanvas drawType={drawType} />
      <div className="case__visual-overlay" />
      <div className="case__visual-product" style={{ color: accentColor, borderColor: `${accentColor}60`, background: 'rgba(6,8,18,0.75)' }}>
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
    drawType: 'airport',
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
    drawType: 'aggregate',
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
    drawType: 'battery',
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
    drawType: 'parcel',
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
              <CaseVisual product={current.product} accentColor={current.accentColor} drawType={current.drawType} />
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
