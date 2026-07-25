import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Skills.module.css'

const services = [
  {
    id: 'ml',
    num: '01',
    short: 'ML',
    title: 'AI & Machine Learning',
    description:
      'Supervised and classical ML through deep learning — feature engineering, imbalance handling, and explainability from model to production evaluation.',
    skills: [
      'Scikit-learn',
      'XGBoost',
      'Random Forest',
      'SVM',
      'Logistic Regression',
      'Neural Networks',
      'K-Means Clustering',
      'SMOTE',
      'imbalanced-learn',
      'SHAP',
      'joblib',
      'PyTorch',
      'TensorFlow',
      'Keras',
    ],
    icon: 'brain',
  },
  {
    id: 'nlp',
    num: '02',
    short: 'NLP',
    title: 'NLP & LLM Engineering',
    description:
      'Retrieval-augmented generation, grounded LLM integration, and prompt engineering — from vector embeddings to production RAG systems.',
    skills: [
      'NLP',
      'spaCy',
      'NLTK',
      'TF-IDF',
      'RAG Pipelines',
      'LLM Integration',
      'Groq LLMs',
      'ChromaDB',
      'Prompt Engineering',
      'MCP (Model Context Protocol)',
      'Vector Embeddings',
      'Transformers',
    ],
    icon: 'docs',
  },
  {
    id: 'data',
    num: '03',
    short: 'Data',
    title: 'Data Science & Analysis',
    description:
      'Data ingestion, cleaning, and analysis — the foundation layer underneath every ML and product build.',
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'SQLite'],
    icon: 'chart',
  },
  {
    id: 'apps',
    num: '04',
    short: 'Apps',
    title: 'Full-Stack & Backend Development',
    description:
      'Building and shipping the application layer — APIs, interactive dashboards, and deployed products, not just notebooks.',
    skills: ['FastAPI', 'Streamlit', 'Streamlit Cloud', 'C++'],
    icon: 'layers',
  },
  {
    id: 'viz',
    num: '05',
    short: 'Viz',
    title: 'Visualization & BI',
    description:
      'Turning model output and raw data into readable, decision-ready visuals — from exploratory charts to dashboard-grade BI.',
    skills: ['Plotly', 'Matplotlib', 'Seaborn', 'Power BI'],
    icon: 'spark',
  },
  {
    id: 'cloud',
    num: '06',
    short: 'Ops',
    title: 'Cloud, DevOps & Embedded Systems',
    description:
      'Deployment, version control, and infrastructure — plus embedded firmware on microcontroller-class hardware from the TrackBot AGV build.',
    skills: ['Docker', 'Render', 'Google Cloud', 'Git', 'GitHub', 'ESP32-S3 (embedded C++/firmware)'],
    icon: 'chip',
  },
]

const AUTO_MS = 5000
const RESUME_IDLE_MS = 3000

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
  const resumeTimer = useRef(null)
  const reducedMotion = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const active = services[activeIndex]

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.current) setAutoplay(false)
  }, [])

  const noteInterference = useCallback(() => {
    if (reducedMotion.current) return
    setAutoplay(false)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      setAutoplay(true)
    }, RESUME_IDLE_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!autoplay || reducedMotion.current) return undefined
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % services.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [autoplay])

  const selectDomain = (index) => {
    setActiveIndex(index)
    noteInterference()
  }

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
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.sectionLabel}>04 — Services & Skills</span>
          <h2 className={styles.heading}>What I Build</h2>
        </div>

        <div className={styles.signalLayout}>
          {/* Content inward-left; signal map on the right */}
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

            <div className={styles.mobileNav} role="tablist" aria-label="Skill categories">
              {services.map((svc, i) => (
                <button
                  key={svc.id}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  className={`${styles.mobileTab} ${i === activeIndex ? styles.mobileTabActive : ''}`}
                  onClick={() => selectDomain(i)}
                >
                  {svc.short}
                </button>
              ))}
            </div>
          </aside>

          <div className={styles.mapPane} ref={mapRef}>
            <div className={styles.mapStage} aria-label="Skills signal map">
              <svg className={styles.mapSvg} viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="18" className={styles.ringDotted} />
                <circle cx="50" cy="50" r="28" className={styles.ringDotted} />
                <circle cx="50" cy="50" r="38" className={styles.ringSolid} />
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

              <div className={styles.hub}>
                <div className={styles.hubRing} aria-hidden="true" />
                <div className={styles.splineWrapper} onTouchMove={handleTouchMove}>
                  <div className={styles.splineStage}>
                    <iframe
                      ref={iframeRef}
                      src="https://my.spline.design/genkubgreetingrobot-XAb0RzB8mNapbMFImFTEOVrd/"
                      title="Interactive greeting robot"
                      className={styles.hubRobot}
                      allow="autoplay"
                    />
                  </div>
                </div>
                {/* Outside wrapper stacking — covers in-iframe Spline badge */}
                <div className={styles.splineWatermarkKill} aria-hidden="true" />
              </div>

              {services.map((svc, i) => {
                const angle = NODE_ANGLES[i]
                const rad = (angle * Math.PI) / 180
                const r = 38
                const x = 50 + Math.cos(rad) * r
                const y = 50 + Math.sin(rad) * r
                const isActive = i === activeIndex

                return (
                  <button
                    key={svc.id}
                    type="button"
                    className={`${styles.node} ${isActive ? styles.nodeActive : ''}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    aria-pressed={isActive}
                    aria-label={svc.title}
                    onClick={() => selectDomain(i)}
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
        </div>
      </div>
    </section>
  )
}
