import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../../../data/projects'
import styles from './Projects.module.css'

const AUTOPLAY_MS = 6000
const DRIFT_LOOP_S = 36 // ambient full-loop duration (~30–40s)
const INACTIVE_W = 160

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
  // grid / pixel-scan
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

function ProjectFrame({ project }) {
  const wordmark = WORDMARKS[project.id]

  if (project.id === 'trackbot-agv' && project.screenshotUrl) {
    return (
      <img
        src={project.screenshotUrl}
        alt={`${project.title} concept render`}
        className={styles.frameImage}
      />
    )
  }

  if (!wordmark) {
    return (
      <div className={styles.wordmarkFrame}>
        <span className={styles.wordmarkWord}>{project.title}</span>
      </div>
    )
  }

  return (
    <div className={styles.wordmarkFrame}>
      <div className={styles.motifWrap} style={{ color: project.canvasColor }}>
        <Motif type={wordmark.motif} color={project.canvasColor} />
      </div>
      <div className={styles.wordmarkContent}>
        <span className={styles.wordmarkWord}>{wordmark.word}</span>
        <span className={styles.wordmarkTagline}>{wordmark.tagline}</span>
      </div>
    </div>
  )
}

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState(defaultProject.id)
  const [fading, setFading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(() =>
    typeof window === 'undefined' ||
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  )

  const navigate = useNavigate()
  const fadeTimer = useRef(null)
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const activeIdRef = useRef(activeProjectId)
  const beltRef = useRef(null)
  const cardRefs = useRef({})
  const driftTweens = useRef({})
  const activateTween = useRef(null)
  const prevActiveRef = useRef(null)
  const beltInitRef = useRef(false)

  activeIdRef.current = activeProjectId

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileMq = window.matchMedia('(max-width: 768px)')

    const applyMotion = () => {
      reduceMotion.current = motionMq.matches
      setAutoplayEnabled(!motionMq.matches)
    }
    const applyMobile = () => setIsMobile(mobileMq.matches)

    applyMotion()
    applyMobile()
    motionMq.addEventListener('change', applyMotion)
    mobileMq.addEventListener('change', applyMobile)

    return () => {
      motionMq.removeEventListener('change', applyMotion)
      mobileMq.removeEventListener('change', applyMobile)
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
    }
  }, [])

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || defaultProject
  const activeIndex = projects.findIndex((p) => p.id === activeProject.id)
  const miniStats = (activeProject.details?.metrics || []).slice(0, 3)

  const useBelt =
    !isMobile && autoplayEnabled && !reduceMotion.current

  const applyProjectChange = useCallback((id) => {
    if (id === activeIdRef.current) return

    if (reduceMotion.current) {
      setActiveProjectId(id)
      return
    }

    setFading(true)
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    fadeTimer.current = setTimeout(() => {
      setActiveProjectId(id)
      setFading(false)
    }, 160)
  }, [])

  const selectProject = useCallback((id) => {
    applyProjectChange(id)
    setCycleKey((k) => k + 1)
  }, [applyProjectChange])

  // Auto-advance every 6s (timing logic from enhancements — unchanged)
  useEffect(() => {
    if (!autoplayEnabled || isPaused) return undefined
    const timer = setTimeout(() => {
      const idx = projects.findIndex((p) => p.id === activeIdRef.current)
      const next = projects[(idx + 1) % projects.length]
      applyProjectChange(next.id)
      setCycleKey((k) => k + 1)
    }, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [autoplayEnabled, isPaused, cycleKey, applyProjectChange])

  const pauseAutoplay = () => setIsPaused(true)
  const resumeAutoplay = () => {
    setIsPaused(false)
    setCycleKey((k) => k + 1)
  }

  const showProgress = autoplayEnabled && !isPaused

  /* ── Belt: ambient drift + activation (desktop/tablet only) ── */
  const killDrift = (id) => {
    if (driftTweens.current[id]) {
      driftTweens.current[id].kill()
      delete driftTweens.current[id]
    }
  }

  const startDrift = useCallback((id, fromX, trackW) => {
    const el = cardRefs.current[id]
    if (!el || !trackW) return
    killDrift(id)

    const wrap = trackW + INACTIVE_W
    let x = fromX
    while (x > trackW) x -= wrap
    while (x < -INACTIVE_W) x += wrap

    gsap.set(el, {
      x,
      y: 0,
      scale: 1,
      opacity: 0.6,
      zIndex: 1,
    })

    driftTweens.current[id] = gsap.to(el, {
      x: `+=${wrap}`,
      duration: DRIFT_LOOP_S,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((val) => {
          const n = parseFloat(val)
          const range = trackW + INACTIVE_W
          return ((n + INACTIVE_W) % range + range) % range - INACTIVE_W
        }),
      },
    })
  }, [])

  const activateCard = useCallback((id, trackW, instant = false) => {
    const el = cardRefs.current[id]
    if (!el || !trackW) return
    killDrift(id)
    if (activateTween.current) activateTween.current.kill()

    // Position so card center sits at track center (scale grows from center)
    const centerX = trackW / 2 - INACTIVE_W / 2
    const props = {
      x: centerX,
      y: -16,
      scale: 1.3,
      opacity: 1,
      zIndex: 10,
      duration: instant ? 0 : 0.55,
      ease: 'power3.out',
    }
    if (instant) {
      gsap.set(el, props)
    } else {
      activateTween.current = gsap.to(el, props)
    }
  }, [])

  useLayoutEffect(() => {
    if (!useBelt) {
      Object.keys(driftTweens.current).forEach(killDrift)
      if (activateTween.current) activateTween.current.kill()
      projects.forEach((p) => {
        const el = cardRefs.current[p.id]
        if (el) gsap.set(el, { clearProps: 'transform,opacity,zIndex' })
      })
      beltInitRef.current = false
      prevActiveRef.current = null
      return undefined
    }

    const belt = beltRef.current
    if (!belt) return undefined

    const trackW = belt.offsetWidth
    if (trackW < 100) return undefined

    const activeId = activeProjectId
    const prevId = prevActiveRef.current

    if (!beltInitRef.current) {
      // Initial layout: Lexis centered, others distributed on the rail
      const inactive = projects.filter((p) => p.id !== activeId)
      inactive.forEach((p, i) => {
        const slot = (i + 0.5) / inactive.length
        const fromX = slot * trackW - INACTIVE_W / 2
        startDrift(p.id, fromX, trackW)
      })
      activateCard(activeId, trackW, true)
      beltInitRef.current = true
      prevActiveRef.current = activeId
    } else if (prevId && prevId !== activeId) {
      // Swap: previous rejoins drift; new activates to center
      const prevX = gsap.getProperty(cardRefs.current[prevId], 'x')
      const rejoinX =
        typeof prevX === 'number' ? prevX : -INACTIVE_W + 20
      startDrift(prevId, rejoinX, trackW)
      activateCard(activeId, trackW, false)
      prevActiveRef.current = activeId
    }

    const onResize = () => {
      const w = belt.offsetWidth
      if (w < 100) return
      const inactive = projects.filter((p) => p.id !== activeIdRef.current)
      inactive.forEach((p, i) => {
        const slot = (i + 0.5) / inactive.length
        startDrift(p.id, slot * w - INACTIVE_W / 2, w)
      })
      activateCard(activeIdRef.current, w, true)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [useBelt, activeProjectId, startDrift, activateCard])

  // Kill all belt tweens on unmount
  useEffect(() => {
    return () => {
      Object.keys(driftTweens.current).forEach(killDrift)
      if (activateTween.current) activateTween.current.kill()
    }
  }, [])

  return (
    <section className={styles.section} id="projects">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>03 — Projects</span>
          <h2 className={styles.heading}>Selected Work</h2>
        </div>

        {/* Zone A — left panel locked from enhancements; frame reworked */}
        <div
          className={`${styles.zoneA} ${fading ? styles.zoneAFading : ''}`}
        >
          <div className={styles.detailPanel}>
            <span className={styles.projectIndex}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.projectTitle}>{activeProject.title}</h3>
            <p className={styles.projectSubtitle}>{activeProject.subtitle}</p>
            {activeProject.description && (
              <p className={styles.description}>{activeProject.description}</p>
            )}
            <div className={styles.tagList}>
              {activeProject.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            {miniStats.length > 0 && (
              <div className={styles.statRow}>
                {miniStats.map((m) => (
                  <div key={`${m.value}-${m.label}`} className={styles.miniStat}>
                    <span className={styles.miniStatValue}>{m.value}</span>
                    <span className={styles.miniStatLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.caseStudyBtn}
                onClick={() => navigate(`/projects/${activeProject.id}`)}
              >
                View case study
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
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
            <div className={styles.frame}>
              <ProjectFrame project={activeProject} />
            </div>
            <div className={styles.floorReflection} aria-hidden="true" />
          </div>
        </div>

        {/* Zone B — belt (desktop) / scroll-snap (mobile) */}
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
              {projects.map((_, i) => (
                <span
                  key={i}
                  className={styles.railTick}
                  style={{ left: `${((i + 0.5) / projects.length) * 100}%` }}
                />
              ))}
              <span className={styles.railDot} />
            </div>
          )}

          <div
            className={useBelt ? styles.beltTrack : styles.staticTrack}
            ref={beltRef}
          >
            {projects.map((project, i) => {
              const isActive = project.id === activeProjectId
              return (
                <button
                  key={project.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  ref={(el) => {
                    if (el) cardRefs.current[project.id] = el
                  }}
                  className={`${styles.filmCard} ${isActive ? styles.filmCardActive : styles.filmCardInactive}`}
                  onClick={() => selectProject(project.id)}
                >
                  <span
                    className={styles.accentBar}
                    style={{
                      background: project.canvasColor,
                      opacity: isActive ? 1 : 0.25,
                    }}
                    aria-hidden="true"
                  />
                  <span className={styles.filmIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.filmName}>{project.title}</span>
                  {project.tags[0] && (
                    <span className={styles.filmTag}>{project.tags[0]}</span>
                  )}
                  {isActive && showProgress && (
                    <span
                      key={cycleKey}
                      className={styles.progressSliver}
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
