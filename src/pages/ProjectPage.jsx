import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import styles from './ProjectPage.module.css';

/* ── Horizontal Flow SVG Architecture Diagram ── */
function ArchDiagram({ layers, accentColor }) {
  const count = layers.length;
  const NODE_W = 120;
  const NODE_H = 52;
  const ARROW_W = 32;
  const PADDING_X = 24;
  const PADDING_Y = 24;
  const totalW = PADDING_X * 2 + count * NODE_W + (count - 1) * ARROW_W;
  const totalH = NODE_H + PADDING_Y * 2;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      height={totalH}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.archSvg}
      aria-label="Architecture pipeline diagram"
    >
      {/* connector lines */}
      {layers.map((_, i) => {
        if (i === count - 1) return null;
        const x1 = PADDING_X + i * (NODE_W + ARROW_W) + NODE_W;
        const x2 = x1 + ARROW_W;
        const cy = PADDING_Y + NODE_H / 2;
        return (
          <g key={`arrow-${i}`}>
            <line
              x1={x1} y1={cy} x2={x2 - 6} y2={cy}
              stroke={`${accentColor}55`}
              strokeWidth="1.5"
            />
            <polygon
              points={`${x2 - 6},${cy - 4} ${x2},${cy} ${x2 - 6},${cy + 4}`}
              fill={`${accentColor}88`}
            />
          </g>
        );
      })}

      {/* nodes */}
      {layers.map((a, i) => {
        const x = PADDING_X + i * (NODE_W + ARROW_W);
        const y = PADDING_Y;
        const isFirst = i === 0;
        const isLast = i === count - 1;
        return (
          <g key={`node-${i}`}>
            <rect
              x={x} y={y}
              width={NODE_W} height={NODE_H}
              rx="3"
              fill={isFirst || isLast ? `${accentColor}18` : 'rgba(255,255,255,0.04)'}
              stroke={isFirst || isLast ? `${accentColor}55` : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
            />
            {/* layer label */}
            <text
              x={x + NODE_W / 2}
              y={y + 16}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="8"
              letterSpacing="0.08em"
              fill={isFirst || isLast ? accentColor : 'rgba(255,255,255,0.5)'}
              textTransform="uppercase"
            >
              {a.layer.toUpperCase()}
            </text>
            {/* detail — word-wrap via tspan, max 2 lines */}
            {wrapText(a.layer, NODE_W - 12).slice(0, 1).map((line, li) => (
              <text
                key={li}
                x={x + NODE_W / 2}
                y={y + 31 + li * 11}
                textAnchor="middle"
                fontFamily="'Inter', sans-serif"
                fontSize="8.5"
                fill="rgba(255,255,255,0.38)"
              >
                {summarize(a.detail, 22)}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function summarize(str, maxLen) {
  if (str.length <= maxLen) return str;
  const words = str.split(' ');
  let out = '';
  for (const w of words) {
    if ((out + ' ' + w).trim().length > maxLen) break;
    out = (out + ' ' + w).trim();
  }
  return out + '…';
}

function wrapText(str, _maxPx) {
  return [str]; // single-pass; we only need the structure
}

/* ── Component ── */
export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p>Project not found.</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>← Back</button>
      </div>
    );
  }

  const d = project.details;
  const accent = project.canvasColor;

  return (
    <div className={styles.page}>

      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

      {/* ── Hero — Option C: Magazine Split ── */}
      <header className={styles.hero}>
        {/* left column */}
        <div className={styles.heroLeft}>
          <div className={styles.heroMeta}>
            <span className={styles.heroCat}>{d.category}</span>
            <span className={styles.heroDot}>·</span>
            <span className={styles.heroCat}>{d.duration}</span>
            <span className={styles.heroDot}>·</span>
            <span
              className={styles.heroStatus}
              style={{ color: d.status.toLowerCase().includes('live') || d.status.toLowerCase().includes('funded') ? '#4ade80' : 'rgba(255,255,255,0.4)' }}
            >
              {d.status}
            </span>
          </div>

          <h1 className={styles.heroTitle} style={{ '--accent': accent }}>
            {project.title}
          </h1>
          <p className={styles.heroSub}>{project.subtitle}</p>

          {/* Brief — plain English, primary read */}
          <p className={styles.heroBrief}>{d.brief}</p>

          {/* Headline — tech pull-quote, dimmer */}
          <p className={styles.heroHeadline}>{d.headline}</p>
        </div>

        {/* right column — metrics stacked */}
        <div className={styles.heroRight}>
          {d.metrics.map((m, i) => (
            <div key={i} className={styles.metricCard}>
              <span className={styles.metricValue} style={{ color: accent }}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Divider ── */}
      <div className={styles.heroDivider} style={{ '--accent': accent }} />

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Overview</h2>
          <p className={styles.overviewText}>{project.description}</p>
          <div className={styles.tagRow}>
            {project.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
          {d.liveNote && (
            <p className={styles.liveNote}>⚠ {d.liveNote}</p>
          )}
        </section>

        {/* Key Highlights */}
        {d.highlights.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Key Highlights</h2>
            <ul className={styles.highlights}>
              {d.highlights.map((h, i) => (
                <li key={i} className={styles.highlight} style={{ '--accent': accent }}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Architecture — horizontal SVG pipeline + detail table */}
        {d.architecture.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Architecture</h2>

            {/* Horizontal flow diagram */}
            <div className={styles.archDiagramWrap}>
              <ArchDiagram layers={d.architecture} accentColor={accent} />
            </div>

            {/* Detail table below */}
            <div className={styles.archGrid}>
              {d.architecture.map((a, i) => (
                <div key={i} className={styles.archRow}>
                  <span className={styles.archLayer} style={{ color: accent }}>{a.layer}</span>
                  <span className={styles.archDetail}>{a.detail}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Challenges */}
        {d.challenges.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Challenges & Solutions</h2>
            <div className={styles.challenges}>
              {d.challenges.map((c, i) => (
                <div key={i} className={styles.challenge}>
                  <div className={styles.challengeProblem}>
                    <span className={styles.challengeIcon} style={{ color: accent }}>⟶</span>
                    <span>{c.problem}</span>
                  </div>
                  <p className={styles.challengeSolution}>{c.solution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Links */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Links</h2>
          <div className={styles.linkRow}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                GitHub ↗
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a href={project.live} target="_blank" rel="noreferrer" className={styles.linkBtnPrimary} style={{ background: accent }}>
                Live Demo ↗
              </a>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}