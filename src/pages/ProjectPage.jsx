import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import styles from './ProjectPage.module.css'

function ArchDiagram({ layers, accentColor }) {
  const count = layers.length
  const NODE_W = 118
  const NODE_H = 52
  const ARROW_W = 28
  const PADDING_X = 16
  const PADDING_Y = 18
  const totalW = PADDING_X * 2 + count * NODE_W + (count - 1) * ARROW_W
  const totalH = NODE_H + PADDING_Y * 2

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      height={totalH}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.archSvg}
      aria-label="Architecture pipeline diagram"
    >
      {layers.map((_, i) => {
        if (i === count - 1) return null
        const x1 = PADDING_X + i * (NODE_W + ARROW_W) + NODE_W
        const x2 = x1 + ARROW_W
        const cy = PADDING_Y + NODE_H / 2
        return (
          <g key={`arrow-${i}`}>
            <line
              x1={x1}
              y1={cy}
              x2={x2 - 6}
              y2={cy}
              stroke={`${accentColor}55`}
              strokeWidth="1.5"
            />
            <polygon
              points={`${x2 - 6},${cy - 4} ${x2},${cy} ${x2 - 6},${cy + 4}`}
              fill={`${accentColor}88`}
            />
          </g>
        )
      })}

      {layers.map((a, i) => {
        const x = PADDING_X + i * (NODE_W + ARROW_W)
        const y = PADDING_Y
        const isEdge = i === 0 || i === count - 1
        return (
          <g key={`node-${i}`}>
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx="3"
              fill={isEdge ? `${accentColor}18` : 'rgba(255,255,255,0.04)'}
              stroke={isEdge ? `${accentColor}55` : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
            />
            <text
              x={x + NODE_W / 2}
              y={y + 16}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="8"
              letterSpacing="0.08em"
              fill={isEdge ? accentColor : 'rgba(255,255,255,0.5)'}
            >
              {a.layer.toUpperCase()}
            </text>
            <text
              x={x + NODE_W / 2}
              y={y + 31}
              textAnchor="middle"
              fontFamily="'Inter', sans-serif"
              fontSize="8.5"
              fill="rgba(255,255,255,0.38)"
            >
              {summarize(a.detail, 20)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function summarize(str, maxLen) {
  if (str.length <= maxLen) return str
  const words = str.split(' ')
  let out = ''
  for (const w of words) {
    if (`${out} ${w}`.trim().length > maxLen) break
    out = `${out} ${w}`.trim()
  }
  return `${out}…`
}

function OutcomeIcon({ index, color }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    'aria-hidden': true,
  }
  if (index === 0) {
    return (
      <svg {...common}>
        <path d="M4 19V5M4 19h16" strokeLinecap="round" />
        <path d="M8 15v-4M12 15V8M16 15v-7" strokeLinecap="round" />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="10" height="14" rx="1.5" />
        <rect x="10" y="8" width="10" height="14" rx="1.5" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
    </svg>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id)

  useEffect(() => {
    if (!project) {
      document.title = 'Project not found · VS.dev'
      return undefined
    }
    document.title = `${project.title} · Vishvrajsinh Solanki`
    return () => {
      document.title = 'Vishvrajsinh Solanki · ML & Robotics'
    }
  }, [project])

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p>Project not found.</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>← Back</button>
      </div>
    )
  }

  const d = project.details
  const accent = project.canvasColor
  const tx = d.transformation
  const statusLive =
    d.status.toLowerCase().includes('live') || d.status.toLowerCase().includes('funded')
  const hasLive = project.live && project.live !== '#'

  return (
    <div className={styles.page} style={{ '--accent': accent }}>
      <nav className={styles.nav}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className={styles.navLinks}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={styles.navLink}>GitHub ↗</a>
          )}
          {hasLive && (
            <a href={project.live} target="_blank" rel="noreferrer" className={styles.navLink}>Live Demo ↗</a>
          )}
        </div>
      </nav>

      {/* Split masthead — title left, metrics right */}
      <header className={styles.masthead}>
        <div className={styles.mastLeft}>
          <p className={styles.caseEyebrow}>
            <span>Case Study</span>
            <span className={styles.caseRule} aria-hidden="true" />
            <span>{d.category}</span>
          </p>
          <h1 className={styles.caseTitle}>{project.title}</h1>
          <p className={styles.caseSub}>{project.subtitle}</p>
          <p className={styles.caseBrief}>{d.brief}</p>
        </div>
        <aside className={styles.mastMetrics} aria-label="Key metrics">
          {d.metrics.slice(0, 4).map((m) => (
            <div key={m.label} className={styles.mastMetric}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </aside>
      </header>

      {/* LOCKED — Before / After visuals + outcomes */}
      {tx && (
        <section className={styles.transform} aria-label="Before and after">
          <div className={styles.transformGrid}>
            <article className={styles.panel}>
              <div className={styles.panelVisual}>
                <img src={tx.before.visual} alt={tx.before.title} loading="eager" />
                <span className={styles.panelBadge}>{tx.before.label}</span>
              </div>
              <div className={styles.panelCopy}>
                <h2 className={styles.panelTitle}>{tx.before.title}</h2>
                <p className={styles.panelSub}>{tx.before.subtitle}</p>
              </div>
            </article>

            <div className={styles.transformDivider} aria-hidden="true">
              <span className={styles.dividerLine} />
              <span className={styles.dividerMark}>{project.title.charAt(0)}</span>
              <span className={styles.dividerLine} />
            </div>

            <article className={styles.panel}>
              <div className={styles.panelVisual}>
                <img src={tx.after.visual} alt={tx.after.title} loading="eager" />
                <span className={`${styles.panelBadge} ${styles.panelBadgeAfter}`}>{tx.after.label}</span>
              </div>
              <div className={styles.panelCopy}>
                <h2 className={styles.panelTitle}>{tx.after.title}</h2>
                <p className={styles.panelSub}>{tx.after.subtitle}</p>
              </div>
            </article>
          </div>

          <div className={styles.outcomes}>
            <div className={styles.outcomeOverview}>
              <OutcomeIcon index={0} color={accent} />
              <div>
                <p className={styles.outcomeLabel}>Overview</p>
                <p className={styles.outcomeDetail}>{tx.overview}</p>
              </div>
            </div>
            {tx.outcomes.map((o, i) => (
              <div key={o.label} className={styles.outcome}>
                <OutcomeIcon index={(i + 1) % 3} color={accent} />
                <div>
                  <p className={styles.outcomeLabel}>{o.label}</p>
                  <p className={styles.outcomeDetail}>{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dossier plates */}
      <div className={styles.dossier}>
        {/* Specs row */}
        <section className={styles.plate} aria-labelledby="specs-label">
          <div className={styles.plateHead}>
            <span className={styles.plateIndex}>01</span>
            <h2 id="specs-label" className={styles.plateLabel}>Specs</h2>
          </div>
          <div className={styles.specsBody}>
            <p className={styles.overviewText}>{project.description}</p>
            <p className={styles.techQuote}>{d.headline}</p>
            <div className={styles.specsMeta}>
              <div className={styles.specChip}>
                <span className={styles.specKey}>Duration</span>
                <span className={styles.specVal}>{d.duration}</span>
              </div>
              <div className={styles.specChip}>
                <span className={styles.specKey}>Status</span>
                <span
                  className={styles.specVal}
                  style={{ color: statusLive ? '#4ade80' : undefined }}
                >
                  {d.status}
                </span>
              </div>
              {project.metric && (
                <div className={styles.specChip}>
                  <span className={styles.specKey}>Signal</span>
                  <span className={styles.specVal}>{project.metric}</span>
                </div>
              )}
            </div>
            <div className={styles.tagRow}>
              {project.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
            {d.liveNote && <p className={styles.liveNote}>⚠ {d.liveNote}</p>}
          </div>
        </section>

        {/* Pipeline row */}
        {d.architecture.length > 0 && (
          <section className={styles.plate} aria-labelledby="pipeline-label">
            <div className={styles.plateHead}>
              <span className={styles.plateIndex}>02</span>
              <h2 id="pipeline-label" className={styles.plateLabel}>Pipeline</h2>
            </div>
            <div className={styles.pipelineBody}>
              <div className={styles.archDiagramWrap}>
                <ArchDiagram layers={d.architecture} accentColor={accent} />
              </div>
              <div className={styles.archGrid}>
                {d.architecture.map((a) => (
                  <div key={a.layer} className={styles.archRow}>
                    <span className={styles.archLayer}>{a.layer}</span>
                    <span className={styles.archDetail}>{a.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Field notes row */}
        {d.challenges.length > 0 && (
          <section className={styles.plate} aria-labelledby="notes-label">
            <div className={styles.plateHead}>
              <span className={styles.plateIndex}>03</span>
              <h2 id="notes-label" className={styles.plateLabel}>Field Notes</h2>
            </div>
            <div className={styles.notesGrid}>
              {d.challenges.map((c, i) => (
                <article key={c.problem} className={styles.noteCard}>
                  <span className={styles.noteStamp}>Note {String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.noteProblem}>{c.problem}</h3>
                  <p className={styles.noteSolution}>{c.solution}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Highlights list */}
        {d.highlights.length > 0 && (
          <section className={styles.plate} aria-labelledby="highlights-label">
            <div className={styles.plateHead}>
              <span className={styles.plateIndex}>04</span>
              <h2 id="highlights-label" className={styles.plateLabel}>Highlights</h2>
            </div>
            <ul className={styles.highlights}>
              {d.highlights.map((h) => (
                <li key={h} className={styles.highlight}>{h}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sticky dock */}
      <div className={styles.dock} role="navigation" aria-label="Project actions">
        <button type="button" className={styles.dockBack} onClick={() => navigate('/')}>
          ← Work
        </button>
        <div className={styles.dockActions}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={styles.dockGhost}>
              GitHub ↗
            </a>
          )}
          {hasLive && (
            <a href={project.live} target="_blank" rel="noreferrer" className={styles.dockPrimary}>
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
