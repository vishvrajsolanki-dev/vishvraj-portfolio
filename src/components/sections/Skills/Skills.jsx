import { useEffect, useRef, useState } from 'react'
import styles from './Skills.module.css'

const services = [
  {
    id: 'ml',
    num: '01',
    short: 'ML',
    title: 'ML Engineering',
    description:
      'Supervised learning, classical ML, and deep learning pipelines — from feature engineering and imbalance handling to explainability and production evaluation.',
    skills: ['Scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'SHAP', 'Keras', 'Random Forest', 'SVM', 'SMOTE'],
    icon: 'brain',
  },
  {
    id: 'nlp',
    num: '02',
    short: 'NLP',
    title: 'NLP & LLM Integration',
    description:
      'Retrieval-augmented generation, prompt systems, and classical NLP — wiring models into products that understand and generate language reliably.',
    skills: ['LangChain', 'Groq LLMs', 'RAG Pipelines', 'Llama 3.1', 'NLTK', 'TF-IDF', 'ChromaDB', 'Transformers', 'Prompt Engineering'],
    icon: 'docs',
  },
  {
    id: 'apps',
    num: '03',
    short: 'Apps',
    title: 'AI App Development',
    description:
      'Shipped AI surfaces — APIs, Streamlit apps, and cloud deploys — with cold-start pipelines and human-usable interfaces.',
    skills: ['Streamlit', 'FastAPI', 'Flask', 'Hugging Face', 'SpaCy', 'joblib', 'imbalanced-learn', 'Render', 'Streamlit Cloud'],
    icon: 'layers',
  },
  {
    id: 'data',
    num: '04',
    short: 'Data',
    title: 'Data Analysis & Viz',
    description:
      'Turning raw tables into decisions — cleaning, analysis, SQL, and visual storytelling across notebooks and dashboards.',
    skills: ['Pandas', 'NumPy', 'Plotly', 'Seaborn', 'Matplotlib', 'Power BI', 'SQLite', 'SQL', 'Google Cloud'],
    icon: 'chart',
  },
  {
    id: 'iot',
    num: '05',
    short: 'IoT',
    title: 'Embedded & IoT',
    description:
      'On-device intelligence — ESP32, sensors, and real-time control loops bridging firmware with higher-level AI systems.',
    skills: ['Arduino', 'FreeRTOS', 'ROS2', 'ESP32', 'MicroPython', 'C++', 'Vector Embeddings', 'MCP Protocol'],
    icon: 'chip',
  },
  {
    id: 'front',
    num: '06',
    short: 'UI',
    title: 'Creative Frontend & 3D',
    description:
      'Interactive product surfaces — React, motion, and 3D — built to feel alive without sacrificing performance.',
    skills: ['React', 'Three.js', 'GSAP', 'R3F', 'CSS Modules', 'Vite', 'Docker', 'Git', 'GitHub'],
    icon: 'spark',
  },
]

/** Evenly space 6 nodes on the outer ring (start at top, clockwise). */
const NODE_ANGLES = services.map((_, i) => -90 + i * 60)

function NodeIcon({ type }) {
  const common = {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (type === 'brain') {
    return (
      <svg {...common}>
        <path d="M9.5 4.5a3 3 0 00-3 3v.5A3 3 0 004 11v2a3 3 0 003 3h.5" />
        <path d="M14.5 4.5a3 3 0 013 3v.5A3 3 0 0120 11v2a3 3 0 01-3 3h-.5" />
        <path d="M9 8.5h6M9 12h6M9 15.5h6" />
      </svg>
    )
  }
  if (type === 'docs') {
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z" />
        <path d="M14 3.5V8h4M9 12h6M9 15h6M9 18h4" />
      </svg>
    )
  }
  if (type === 'layers') {
    return (
      <svg {...common}>
        <path d="M12 3l8 4.5-8 4.5L4 7.5 12 3z" />
        <path d="M4 12l8 4.5L20 12M4 16.5L12 21l8-4.5" />
      </svg>
    )
  }
  if (type === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15l3-4 3 2 5-7" />
      </svg>
    )
  }
  if (type === 'chip') {
    return (
      <svg {...common}>
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" />
      <path d="M18 14l.7 2.1L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.9L18 14z" />
    </svg>
  )
}

export default function Skills() {
  const iframeRef = useRef(null)
  const sectionRef = useRef(null)
  const mapRef = useRef(null)
  const [activeId, setActiveId] = useState(services[0].id)

  const active = services.find((s) => s.id === activeId) || services[0]

  useEffect(() => {
    const section = sectionRef.current
    const iframe = iframeRef.current
    if (!section || !iframe) return undefined

    const handleMouseMove = (e) => {
      iframe.contentWindow?.postMessage(
        { type: 'mousemove', x: e.clientX, y: e.clientY },
        '*'
      )
    }

    section.addEventListener('mousemove', handleMouseMove)
    return () => section.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const iframe = iframeRef.current
    if (!iframe || !touch) return
    const rect = iframe.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    iframe.contentWindow?.postMessage(
      { type: 'mousemove', x: touch.clientX, y: touch.clientY },
      '*'
    )
    iframe.contentWindow?.postMessage(
      JSON.stringify({ type: 'mousemove', x, y }),
      '*'
    )
  }

  return (
    <section className={styles.section} ref={sectionRef} id="skills">
      <span className={styles.sectionLabel}>04 — Services & Skills</span>
      <h2 className={styles.heading}>What I Build</h2>

      <div className={styles.signalLayout}>
        {/* ── Signal map ── */}
        <div className={styles.mapPane} ref={mapRef}>
          <div className={styles.mapStage} aria-label="Skills signal map">
            {/* Concentric guides */}
            <svg className={styles.mapSvg} viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="18" className={styles.ringDotted} />
              <circle cx="50" cy="50" r="28" className={styles.ringDotted} />
              <circle cx="50" cy="50" r="38" className={styles.ringSolid} />
              {/* tick marks on outer ring */}
              {Array.from({ length: 24 }, (_, i) => {
                const a = ((i / 24) * 360 - 90) * (Math.PI / 180)
                const r1 = 37.2
                const r2 = 38.8
                return (
                  <line
                    key={i}
                    x1={50 + Math.cos(a) * r1}
                    y1={50 + Math.sin(a) * r1}
                    x2={50 + Math.cos(a) * r2}
                    y2={50 + Math.sin(a) * r2}
                    className={styles.ringTick}
                  />
                )
              })}
            </svg>

            {/* Center hub — interactive Spline robot */}
            <div className={styles.hub}>
              <div className={styles.hubRing} aria-hidden="true" />
              <div className={styles.splineWrapper} onTouchMove={handleTouchMove}>
                <iframe
                  ref={iframeRef}
                  src="https://my.spline.design/genkubgreetingrobot-XAb0RzB8mNapbMFImFTEOVrd/"
                  title="Interactive greeting robot"
                  style={{ border: 'none', background: 'transparent' }}
                  allow="autoplay"
                />
                {/* Cover Spline watermark corner */}
                <div className={styles.splineWatermarkKill} aria-hidden="true" />
              </div>
            </div>

            {/* Orbit nodes */}
            {services.map((svc, i) => {
              const angle = NODE_ANGLES[i]
              const rad = (angle * Math.PI) / 180
              // Position on ~38% radius ring in percentage of stage
              const r = 38
              const x = 50 + Math.cos(rad) * r
              const y = 50 + Math.sin(rad) * r
              const isActive = svc.id === activeId

              return (
                <button
                  key={svc.id}
                  type="button"
                  className={`${styles.node} ${isActive ? styles.nodeActive : ''}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-pressed={isActive}
                  aria-label={svc.title}
                  onClick={() => setActiveId(svc.id)}
                >
                  <span className={styles.nodeIcon}>
                    <NodeIcon type={svc.icon} />
                  </span>
                  <span className={styles.nodeLabel}>{svc.short}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <aside className={styles.detailPane} aria-live="polite">
          <div className={styles.detailHeader}>
            <span className={styles.detailNum}>{active.num}</span>
            <h3 className={styles.detailTitle}>{active.title}</h3>
          </div>
          <div className={styles.detailRule} aria-hidden="true" />
          <p className={styles.detailDesc}>{active.description}</p>
          <p className={styles.toolsLabel}>Tools</p>
          <div className={styles.skillTags}>
            {active.skills.map((sk) => (
              <span key={sk} className={styles.tag}>
                {sk}
              </span>
            ))}
          </div>

          {/* Mobile / a11y list of all categories */}
          <div className={styles.mobileNav} role="tablist" aria-label="Skill categories">
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                role="tab"
                aria-selected={svc.id === activeId}
                className={`${styles.mobileTab} ${svc.id === activeId ? styles.mobileTabActive : ''}`}
                onClick={() => setActiveId(svc.id)}
              >
                {svc.short}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
