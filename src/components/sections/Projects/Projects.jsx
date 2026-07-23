import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../../../data/projects'
import styles from './Projects.module.css'

const defaultProject =
  projects.find((p) => p.featured) || projects[0]

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState(defaultProject.id)
  const [fading, setFading] = useState(false)
  const navigate = useNavigate()
  const fadeTimer = useRef(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
    }
  }, [])

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || defaultProject
  const activeIndex = projects.findIndex((p) => p.id === activeProject.id)

  const selectProject = (id) => {
    if (id === activeProjectId) return

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
  }

  return (
    <section className={styles.section} id="projects">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>03 — Projects</span>
          <h2 className={styles.heading}>Selected Work</h2>
        </div>

        {/* Zone A — Active project showcase */}
        <div
          className={`${styles.zoneA} ${fading ? styles.zoneAFading : ''}`}
        >
          <div className={styles.detailPanel}>
            <span className={styles.projectIndex}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.projectTitle}>{activeProject.title}</h3>
            <p className={styles.projectSubtitle}>{activeProject.subtitle}</p>
            <div className={styles.tagList}>
              {activeProject.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            {activeProject.metric && (
              <p className={styles.metric}>{activeProject.metric}</p>
            )}
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
        <div className={styles.zoneB} role="listbox" aria-label="Select project">
          {projects.map((project, i) => {
            const isActive = project.id === activeProjectId
            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`${styles.filmCard} ${isActive ? styles.filmCardActive : ''}`}
                onClick={() => selectProject(project.id)}
              >
                <span
                  className={`${styles.statusDot} ${isActive ? styles.statusDotActive : ''}`}
                  aria-hidden="true"
                />
                <span className={styles.filmIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.filmName}>{project.title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
