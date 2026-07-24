import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import styles from './ProjectPage.module.css'

function ArchDiagram({ layers, accentColor }) {
  const count = layers.length
  const NODE_W = 120
  const NODE_H = 52
  const ARROW_W = 32
  const PADDING_X = 24
  const PADDING_Y = 24
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
              {summarize(a.detail, 22)}
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
          {project.live && project.live !== '#' && (
            <a href={project.live} target="_blank" rel="noreferrer" className={styles.navLink}>Live Demo ↗</a>
          )}
        </div>
      </nav>

      {/* Case study masthead */}
      <header className={styles.masthead}>
        <p className={styles.caseEyebrow}>
          <span>Case Study</span>
          <span className={styles.caseRule} aria-hidden="true" />
          <span>{d.category}</span>
        </p>
        <h1 className={styles.caseTitle}>{project.title}</h1>
        <p className={styles.caseSub}>{project.subtitle}</p>
        <div className={styles.caseMeta}>
          <span>{d.duration}</span>
          <span className={styles.metaDot}>·</span>
          <span
            className={styles.caseStatus}
            style={{
              color:
                d.status.toLowerCase().includes('live') || d.status.toLowerCase().includes('funded')
                  ? '#4ade80'
                  : 'rgba(255,255,255,0.45)',
            }}
          >
            {d.status}
          </span>
        </div>
        <p className={styles.caseBrief}>{d.brief}</p>
      </header>

      {/* Before / After — Option H structure */}
      {tx && (
        <section className={styles.transform} aria-label="Before and after">
          <div className={styles.transformGrid}>
            <article className={styles.panel}>
              <div className={styles.panelVisual}>
                <img src={tx.before.visual} alt="" loading="eager" />
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
                <img src={tx.after.visual} alt="" loading="eager" />
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

      {/* Metric strip */}
      <section className={styles.metricStrip} aria-label="Key metrics">
        {d.metrics.map((m) => (
          <div key={m.label} className={styles.metricItem}>
            <span className={styles.metricValue}>{m.value}</span>
            <span className={styles.metricLabel}>{m.label}</span>
          </div>
        ))}
      </section>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Overview</h2>
          <p className={styles.overviewText}>{project.description}</p>
          <p className={styles.techQuote}>{d.headline}</p>
          <div className={styles.tagRow}>
            {project.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
          {d.liveNote && <p className={styles.liveNote}>⚠ {d.liveNote}</p>}
        </section>

        {d.highlights.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Key Highlights</h2>
            <ul className={styles.highlights}>
              {d.highlights.map((h) => (
                <li key={h} className={styles.highlight}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {d.architecture.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Architecture</h2>
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
          </section>
        )}

        {d.challenges.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Challenges & Solutions</h2>
            <div className={styles.challenges}>
              {d.challenges.map((c) => (
                <div key={c.problem} className={styles.challenge}>
                  <div className={styles.challengeProblem}>
                    <span className={styles.challengeIcon}>⟶</span>
                    <span>{c.problem}</span>
                  </div>
                  <p className={styles.challengeSolution}>{c.solution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Links</h2>
          <div className={styles.linkRow}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                GitHub ↗
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className={styles.linkBtnPrimary}
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
