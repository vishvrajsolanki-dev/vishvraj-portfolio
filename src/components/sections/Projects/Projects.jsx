import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../../../data/projects'
import styles from './Projects.module.css'

const AUTOPLAY_MS = 6000

const defaultProject =
  projects.find((p) => p.featured) || projects[0]

function hasLiveUrl(live) {
  return Boolean(live) && live !== '#'
}

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState(defaultProject.id)
  const [fading, setFading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const navigate = useNavigate()
  const fadeTimer = useRef(null)
  const reduceMotion = useRef(false)
  const activeIdRef = useRef(activeProjectId)

  activeIdRef.current = activeProjectId

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      reduceMotion.current = mq.matches
      setAutoplayEnabled(!mq.matches)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
    }
  }, [])

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || defaultProject
  const activeIndex = projects.findIndex((p) => p.id === activeProject.id)
  const miniStats = (activeProject.details?.metrics || []).slice(0, 3)

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
    // Manual click always resets the 6s cycle from zero
    setCycleKey((k) => k + 1)
  }, [applyProjectChange])

  // Auto-advance every 6s when enabled and not paused.
  // Depends on cycleKey only (not activeProjectId) so fade completion
  // does not restart the countdown mid-cycle.
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
    // Resume from zero — bump cycleKey so progress + timer restart
    setCycleKey((k) => k + 1)
  }

  const showProgress = autoplayEnabled && !isPaused

  return (
    <section className={styles.section} id="projects">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>03 — Projects</span>
          <h2 className={styles.heading}>Selected Work</h2>
        </div>

        {/* Zone A — not aria-live (would announce every 6s autoplay tick) */}
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
              {activeProject.screenshotUrl ? (
                <img
                  src={activeProject.screenshotUrl}
                  alt={`${activeProject.title} concept mockup`}
                  className={styles.frameImage}
                />
              ) : (
                <div
                  className={styles.frameFallback}
                  style={{
                    background: `radial-gradient(ellipse at 40% 30%, ${activeProject.canvasColor}33 0%, transparent 60%), var(--color-surface)`,
                  }}
                >
                  <span className={styles.frameFallbackTitle}>
                    {activeProject.title}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.floorReflection} aria-hidden="true" />
          </div>
        </div>

        {/* Zone B — Filmstrip selector */}
        <div
          className={styles.zoneB}
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
          {projects.map((project, i) => {
            const isActive = project.id === activeProjectId
            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-current={isActive ? 'true' : undefined}
                className={`${styles.filmCard} ${isActive ? styles.filmCardActive : ''}`}
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
                <span
                  className={`${styles.statusDot} ${isActive ? styles.statusDotActive : ''}`}
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
    </section>
  )
}
