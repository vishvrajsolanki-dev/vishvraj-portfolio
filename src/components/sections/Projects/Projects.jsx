import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../../../data/projects'
import styles from './Projects.module.css'

const AUTOPLAY_MS = 6000
const FOCAL = 2 // center slot — active card always lives here
const INACTIVE_W = 190
const ACTIVE_W = 260
const GAP = 14
const BELT_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'
const BELT_MS = 1300

const defaultProject =
  projects.find((p) => p.featured) || projects[0]

const WORDMARKS = {
  lexis: {
    word: 'LEXIS',
    tagline: 'Your study companion',
    motif: 'cards',
  },
  rupeeiq: {
    word: 'RUPEEIQ',
    tagline: 'Know your money',
    motif: 'chart',
  },
  plotsense: {
    word: 'PLOTSENSE',
    tagline: 'Genre, guessed right',
    motif: 'film',
  },
  letterlens: {
    word: 'LETTERLENS',
    tagline: 'Handwriting, understood',
    motif: 'grid',
  },
}

function hasLiveUrl(live) {
  return Boolean(live) && live !== '#'
}

/** Compact SVG marks for belt icon badges / watermarks */
function ProjectIcon({ type, className }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  }
  if (type === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15l3-4 3 2 5-7" />
      </svg>
    )
  }
  if (type === 'robot') {
    return (
      <svg {...common}>
        <rect x="6" y="8" width="12" height="10" rx="2" />
        <circle cx="10" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" />
        <path d="M12 4v4M9 18v2M15 18v2" />
      </svg>
    )
  }
  if (type === 'film') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" />
      </svg>
    )
  }
  if (type === 'pen') {
    return (
      <svg {...common}>
        <path d="M12 19l7-7 2 2-7 7H9v-2z" />
        <path d="M16 7l2 2M14.5 5.5l2-2a1.5 1.5 0 012 2l-2 2" />
      </svg>
    )
  }
  // book (Lexis default)
  return (
    <svg {...common}>
      <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" />
      <path d="M6 3v16" />
    </svg>
  )
}


/** Arrange projects so `activeId` sits at FOCAL (center). */
function orderCenteredOn(activeId) {
  const ids = projects.map((p) => p.id)
  const idx = Math.max(0, ids.indexOf(activeId))
  const ordered = []
  for (let i = 0; i < ids.length; i++) {
    ordered.push(projects[(idx - FOCAL + i + ids.length) % ids.length])
  }
  return ordered
}

/** Rotate array left by n steps (first → end). */
function rotateLeft(arr, n = 1) {
  const len = arr.length
  const k = ((n % len) + len) % len
  if (k === 0) return arr
  return [...arr.slice(k), ...arr.slice(0, k)]
}

/** Slot x-position for index i, with FOCAL using ACTIVE_W. */
function slotX(index) {
  let x = 0
  for (let i = 0; i < index; i++) {
    x += (i === FOCAL ? ACTIVE_W : INACTIVE_W) + GAP
  }
  return x
}

const TOTAL_RAIL_W =
  ACTIVE_W + (projects.length - 1) * INACTIVE_W + (projects.length - 1) * GAP

/* ── Background motifs (SVG, CSS-animated) ── */
function Motif({ type, color }) {
  if (type === 'cards') {
    return (
      <svg className={`${styles.motif} ${styles.motifCards}`} viewBox="0 0 400 280" aria-hidden="true">
        <rect x="40" y="50" width="90" height="120" rx="6" fill="none" stroke={color} strokeWidth="1.5" />
        <rect x="150" y="80" width="90" height="120" rx="6" fill="none" stroke={color} strokeWidth="1.5" />
        <rect x="260" y="40" width="90" height="120" rx="6" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="55" y1="80" x2="115" y2="80" stroke={color} strokeWidth="1" />
        <line x1="55" y1="100" x2="105" y2="100" stroke={color} strokeWidth="1" />
        <line x1="165" y1="110" x2="225" y2="110" stroke={color} strokeWidth="1" />
        <line x1="275" y1="70" x2="335" y2="70" stroke={color} strokeWidth="1" />
      </svg>
    )
  }
  if (type === 'chart') {
    return (
      <svg className={`${styles.motif} ${styles.motifChart}`} viewBox="0 0 400 280" aria-hidden="true">
        <polyline
          points="20,200 70,160 120,180 170,100 220,130 270,70 320,90 380,40"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="20,220 80,200 140,210 200,150 260,170 340,110 380,120"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    )
  }
  if (type === 'film') {
    return (
      <svg className={`${styles.motif} ${styles.motifFilm}`} viewBox="0 0 400 280" aria-hidden="true">
        <rect x="30" y="90" width="340" height="100" rx="4" fill="none" stroke={color} strokeWidth="1.5" />
        {[50, 90, 130, 170, 210, 250, 290, 330].map((x) => (
          <g key={x}>
            <rect x={x} y="98" width="10" height="10" fill={color} opacity="0.6" />
            <rect x={x} y="172" width="10" height="10" fill={color} opacity="0.6" />
          </g>
        ))}
        <circle cx="80" cy="140" r="28" fill="none" stroke={color} strokeWidth="1.2" />
        <circle cx="80" cy="140" r="10" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="320" cy="140" r="28" fill="none" stroke={color} strokeWidth="1.2" />
        <circle cx="320" cy="140" r="10" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    )
  }
  return (
    <svg className={`${styles.motif} ${styles.motifGrid}`} viewBox="0 0 400 280" aria-hidden="true">
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={20 + col * 30}
            y={30 + row * 28}
            width="18"
            height="18"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
          />
        ))
      )}
      <line x1="20" y1="140" x2="380" y2="140" stroke={color} strokeWidth="1.5" className={styles.scanLine} />
    </svg>
  )
}

function DotGrid() {
  return (
    <svg className={styles.dotGrid} aria-hidden="true">
      <defs>
        <pattern id="projDotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.18)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#projDotGrid)" />
    </svg>
  )
}

function ProjectFrame({ project }) {
  const wordmark = WORDMARKS[project.id]
  const glow = project.accentColor?.glow || project.canvasColor

  if (project.id === 'trackbot-agv' && project.screenshotUrl) {
    return (
      <>
        <div
          className={styles.frameGlow}
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 30% 20%, ${glow}33 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 80% 80%, ${glow}22 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />
        <img
          src={project.screenshotUrl}
          alt={`${project.title} concept render`}
          className={styles.frameImage}
        />
      </>
    )
  }

  return (
    <div className={styles.wordmarkFrame}>
      <div
        className={styles.frameGlow}
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 30% 20%, ${glow}40 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 80% 80%, ${glow}28 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />
      <DotGrid />
      <div className={styles.motifWrap} style={{ color: project.canvasColor }}>
        {wordmark && <Motif type={wordmark.motif} color={project.canvasColor} />}
      </div>
      <div className={styles.wordmarkContent}>
        <span className={styles.wordmarkWord}>
          {wordmark?.word || project.title}
        </span>
        {wordmark && (
          <span className={styles.wordmarkTagline}>{wordmark.tagline}</span>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const [beltOrder, setBeltOrder] = useState(() =>
    orderCenteredOn(defaultProject.id)
  )
  const [activeProjectId, setActiveProjectId] = useState(defaultProject.id)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [scaleReady, setScaleReady] = useState(true)
  const [skipTransitionId, setSkipTransitionId] = useState(null)
  const [autoplayEnabled, setAutoplayEnabled] = useState(() =>
    typeof window === 'undefined' ||
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  )
  const [trackWidth, setTrackWidth] = useState(0)

  const navigate = useNavigate()
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const activeIdRef = useRef(activeProjectId)
  const beltRef = useRef(null)
  const detailRef = useRef(null)
  const scaleTimer = useRef(null)
  const revealTween = useRef(null)

  activeIdRef.current = activeProjectId

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || defaultProject
  const miniStats = (activeProject.details?.metrics || []).slice(0, 3)
  const accent = activeProject.accentColor || {
    base: '#FFFFFF',
    glow: activeProject.canvasColor,
  }

  const useBelt = !isMobile && !reduceMotion.current

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileMq = window.matchMedia('(max-width: 768px)')

    const applyMotion = () => {
      reduceMotion.current = motionMq.matches
      setAutoplayEnabled(!motionMq.matches)
      if (motionMq.matches) setScaleReady(true)
    }
    const applyMobile = () => setIsMobile(mobileMq.matches)

    applyMotion()
    applyMobile()
    motionMq.addEventListener('change', applyMotion)
    mobileMq.addEventListener('change', applyMobile)
    return () => {
      motionMq.removeEventListener('change', applyMotion)
      mobileMq.removeEventListener('change', applyMobile)
      if (scaleTimer.current) clearTimeout(scaleTimer.current)
      if (revealTween.current) revealTween.current.kill()
    }
  }, [])

  // Measure belt track for centering the rail
  useEffect(() => {
    const el = beltRef.current
    if (!el) return undefined
    const measure = () => setTrackWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [useBelt, isMobile])

  const railOffset = useMemo(() => {
    if (!trackWidth) return 0
    return Math.max(0, (trackWidth - TOTAL_RAIL_W) / 2)
  }, [trackWidth])

  /* ── Staggered Zone A reveal (clip-path) ── */
  const runReveal = useCallback((instant = false) => {
    const root = detailRef.current
    if (!root) return
    const parts = root.querySelectorAll('[data-reveal]')
    if (!parts.length) return

    if (revealTween.current) revealTween.current.kill()

    if (instant || reduceMotion.current) {
      gsap.set(parts, { clearProps: 'clipPath,y,opacity' })
      return
    }

    gsap.set(parts, {
      clipPath: 'inset(100% 0 0 0)',
      y: 18,
      opacity: 1,
    })
    revealTween.current = gsap.to(parts, {
      clipPath: 'inset(0% 0 0 0)',
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, [])

  useEffect(() => {
    runReveal(false)
  }, [activeProjectId, runReveal])

  const beltOrderRef = useRef(beltOrder)
  beltOrderRef.current = beltOrder

  /** Advance: rotate array left; every slot re-derived from new order + index. */
  const advanceBelt = useCallback(() => {
    const prev = beltOrderRef.current
    const wrappingId = prev[0].id
    const next = rotateLeft(prev, 1)
    const nextActive = next[FOCAL].id

    // Batch before paint: skip wrap transition + new order + active id together
    setSkipTransitionId(wrappingId)
    setBeltOrder(next)
    setActiveProjectId(nextActive)
    setCycleKey((k) => k + 1)

    if (!reduceMotion.current && !isMobile) {
      setScaleReady(false)
      if (scaleTimer.current) clearTimeout(scaleTimer.current)
      scaleTimer.current = setTimeout(() => setScaleReady(true), 400)
    } else {
      setScaleReady(true)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSkipTransitionId(null))
    })
  }, [isMobile])

  const selectProject = useCallback((id) => {
    if (id === activeIdRef.current) {
      setCycleKey((k) => k + 1)
      return
    }

    const prev = beltOrderRef.current
    let steps = 0
    let next = prev
    while (next[FOCAL].id !== id && steps < next.length) {
      next = rotateLeft(next, 1)
      steps++
    }

    // Single-step: teleport the wrapping (old leftmost → new rightmost) card.
    // Multi-step: skip all transitions (instant rearrange).
    if (steps > 1) {
      setSkipTransitionId('__all__')
    } else if (steps === 1) {
      setSkipTransitionId(prev[0].id)
    }

    setBeltOrder(next)
    setActiveProjectId(id)
    setCycleKey((k) => k + 1)

    if (!reduceMotion.current && !isMobile) {
      setScaleReady(false)
      if (scaleTimer.current) clearTimeout(scaleTimer.current)
      scaleTimer.current = setTimeout(() => setScaleReady(true), 400)
    } else {
      setScaleReady(true)
    }

    if (steps >= 1) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSkipTransitionId(null))
      })
    }
  }, [isMobile])

  // Auto-advance every 6s
  useEffect(() => {
    if (!autoplayEnabled || isPaused) return undefined
    const timer = setTimeout(() => {
      advanceBelt()
    }, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [autoplayEnabled, isPaused, cycleKey, advanceBelt])

  const pauseAutoplay = () => setIsPaused(true)
  const resumeAutoplay = () => {
    setIsPaused(false)
    setCycleKey((k) => k + 1)
  }

  const showProgress = autoplayEnabled && !isPaused

  // Mobile / reduced-motion: flat list in projects.js order
  const displayList = useBelt ? beltOrder : projects

  return (
    <section className={styles.section} id="projects">
      {/* Ambient fill — desktop-wide breathing room beyond content max */}
      <span className={styles.ambientWatermark} aria-hidden="true">
        PROJECTS
      </span>
      <div
        className={`${styles.ambientBlob} ${styles.ambientBlobTR}`}
        style={{ background: `radial-gradient(circle, ${accent.glow}1A 0%, transparent 70%)` }}
        aria-hidden="true"
      />
      <div
        className={`${styles.ambientBlob} ${styles.ambientBlobBL}`}
        style={{ background: `radial-gradient(circle, ${accent.glow}14 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>03 — Projects</span>
          <h2 className={styles.heading}>Selected Work</h2>
        </div>

        {/* Zone A */}
        <div className={styles.zoneA}>
          <div className={styles.detailPanel} ref={detailRef}>
            <span className={styles.projectIndex} data-reveal>
              {String(
                projects.findIndex((p) => p.id === activeProject.id) + 1
              ).padStart(2, '0')}
            </span>
            <h3 className={styles.projectTitle} data-reveal>
              {activeProject.title}
            </h3>
            <p className={styles.projectSubtitle} data-reveal>
              {activeProject.subtitle}
            </p>
            {activeProject.description && (
              <p className={styles.description} data-reveal>
                {activeProject.description}
              </p>
            )}
            <div className={styles.tagList} data-reveal>
              {activeProject.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            {miniStats.length > 0 && (
              <div className={styles.statRow} data-reveal>
                {miniStats.map((m) => (
                  <div key={`${m.value}-${m.label}`} className={styles.miniStat}>
                    <span className={styles.miniStatValue}>{m.value}</span>
                    <span className={styles.miniStatLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.actionRow} data-reveal>
              <button
                type="button"
                className={styles.caseStudyBtn}
                onClick={() => navigate(`/projects/${activeProject.id}`)}
              >
                View case study
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className={styles.iconBtnRow}>
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconBtn}
                    aria-label="View GitHub repository"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                )}
                {hasLiveUrl(activeProject.live) && (
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconBtn}
                    aria-label="View live demo"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className={styles.visualColumn}>
            <div
              className={styles.frame}
              style={{ '--accent-glow': accent.glow, '--accent-base': accent.base }}
            >
              <ProjectFrame project={activeProject} />
            </div>
            <div className={styles.floorReflection} aria-hidden="true" />
          </div>
        </div>

        {/* Zone B — belt / scroll-snap */}
        <div
          className={`${styles.zoneB} ${useBelt ? styles.zoneBBelt : styles.zoneBStatic}`}
          role="listbox"
          aria-label="Select project"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocusCapture={pauseAutoplay}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              resumeAutoplay()
            }
          }}
        >
          {useBelt && (
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railLine} />
              {displayList.map((_, i) => (
                <span
                  key={i}
                  className={styles.railTick}
                  style={{
                    left: railOffset + slotX(i) + (i === FOCAL ? ACTIVE_W : INACTIVE_W) / 2,
                  }}
                />
              ))}
              <span
                className={styles.railDot}
                style={{
                  left: railOffset + slotX(FOCAL) + ACTIVE_W / 2,
                }}
              />
            </div>
          )}

          <div
            className={useBelt ? styles.beltTrack : styles.staticTrack}
            ref={beltRef}
          >
            {displayList.map((project, i) => {
              // Belt: active = FOCAL slot index (array order is source of truth).
              // Never special-case first/last — every slot uses the same formula.
              const isActive = useBelt
                ? i === FOCAL
                : project.id === activeProjectId
              const cardAccent = project.accentColor || {
                base: '#FFFFFF',
                glow: project.canvasColor,
              }

              const x = useBelt ? railOffset + slotX(i) : undefined
              const width = useBelt
                ? i === FOCAL
                  ? ACTIVE_W
                  : INACTIVE_W
                : undefined

              // left from slot index; transform only lifts/scales the FOCAL card
              const transform = useBelt
                ? `translateY(${i === FOCAL && scaleReady ? -16 : 0}px) scale(${i === FOCAL && scaleReady ? 1.3 : 1})`
                : undefined

              const skipMotion =
                skipTransitionId === '__all__' ||
                skipTransitionId === project.id ||
                reduceMotion.current

              return (
                <button
                  key={project.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  className={`${styles.filmCard} ${isActive ? styles.filmCardActive : styles.filmCardInactive}`}
                  onClick={() => selectProject(project.id)}
                  style={{
                    ...(useBelt
                      ? {
                          left: x,
                          width,
                          transform,
                          zIndex: isActive ? 10 : 1,
                          transition: skipMotion
                            ? 'none'
                            : `left ${BELT_MS}ms ${BELT_EASE}, transform ${BELT_MS}ms ${BELT_EASE}, width 500ms ${BELT_EASE}, box-shadow ${BELT_MS}ms ${BELT_EASE}, border-color ${BELT_MS}ms ${BELT_EASE}`,
                          ...(isActive
                            ? {
                                borderColor: cardAccent.base,
                                boxShadow: `0 8px 22px ${cardAccent.glow}40`,
                              }
                            : {
                                borderColor: 'rgba(255,255,255,0.08)',
                                boxShadow: 'none',
                              }),
                        }
                      : isActive
                        ? {
                            borderColor: cardAccent.base,
                            boxShadow: `0 8px 22px ${cardAccent.glow}40`,
                          }
                        : {
                            borderColor: 'rgba(255,255,255,0.08)',
                          }),
                    '--card-accent': cardAccent.base,
                  }}
                >
                  {/* Oversized icon watermark */}
                  <span
                    className={styles.iconWatermark}
                    style={{ color: cardAccent.base }}
                    aria-hidden="true"
                  >
                    <ProjectIcon type={project.icon} />
                  </span>

                  {project.recommended && (
                    <span
                      className={styles.recommendedBadge}
                      style={{ background: cardAccent.base }}
                    >
                      Recommended
                    </span>
                  )}

                  <span className={styles.iconBadge} aria-hidden="true">
                    <ProjectIcon type={project.icon} />
                  </span>

                  <span className={styles.filmBody}>
                    <span className={styles.filmName}>{project.title}</span>
                    {project.tags[0] && (
                      <span className={styles.filmTag}>{project.tags[0]}</span>
                    )}
                  </span>

                  <span className={styles.ghostNumber} aria-hidden="true">
                    {String(
                      projects.findIndex((p) => p.id === project.id) + 1
                    ).padStart(2, '0')}
                  </span>

                  {isActive && showProgress && (
                    <span
                      key={cycleKey}
                      className={styles.progressSliver}
                      style={{ background: cardAccent.base }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
