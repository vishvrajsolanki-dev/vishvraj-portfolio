import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Achievements.module.css'

gsap.registerPlugin(ScrollTrigger)

const AUTO_MS = 5200
const CASE_SLOTS = 4

const achievements = [
  {
    id: 'ssip-gujarat',
    year: '2026',
    dateLabel: '2026',
    type: 'Institutional Recognition',
    title: 'SSIP — Gujarat Government',
    org: 'State Innovation & Startup Policy Cell',
    issuer: 'Education Department, Government of Gujarat',
    detail:
      'TrackBot AGV selected for state-level recognition under the Student Startup & Innovation Policy.',
    impact: 'Grant funding under review · institutional validation for hardware research.',
    tags: ['ESP32', 'Embedded Systems', 'Robotics', 'IoT', 'SSIP Grant'],
    logo: '/logos/ssip.png',
    artifact: 'plaque',
  },
  {
    id: 'cvm-hackathon',
    year: '2026',
    dateLabel: 'Mar 2026',
    type: 'Hackathon',
    title: 'CVM Hackathon Finalist',
    org: 'CVM University · ADIT',
    issuer: 'CVM University Hackathon',
    detail: 'Finalist with TrackBot AGV — RFID-guided autonomous ground vehicle.',
    impact: 'Hardware demo under live judging · path control and telemetry on display.',
    tags: ['ESP32', 'PID Control', 'C++', 'Hardware', 'Autonomous Systems'],
    logo: '/logos/cvm.png',
    artifact: 'medal',
  },
  {
    id: 'spec-innovation',
    year: '2024',
    dateLabel: '2024',
    type: 'School · National Techfest',
    title: 'SPEC Innovation Award',
    org: 'AIKYAM 1.0 — Sardar Patel College of Engineering',
    issuer: 'Sardar Patel Education Campus',
    detail: 'Innovation award at a national-level techfest, competed during school.',
    impact: 'Early signal for product thinking and prototype storytelling.',
    tags: ['Innovation', 'AIKYAM', 'National Techfest'],
    logo: '/logos/spec.png',
    artifact: 'crest',
  },
  {
    id: 'chatkaro-model',
    year: '2024',
    dateLabel: '2024',
    type: 'School · Competition',
    title: '2nd Place — Model Presentation',
    org: 'Chatkaro 2024 · Charotar Education Society',
    issuer: 'Charotar Education Society',
    detail: 'Secured 2nd place in model presentation during school competition.',
    impact: 'Stage presence and technical narrative under timed evaluation.',
    tags: ['Model Presentation', 'Charotar', 'Competition'],
    logo: '/logos/cems.png',
    artifact: 'ribbon',
  },
]

function padAchievementsForStress(base) {
  if (typeof window === 'undefined') return base
  const params = new URLSearchParams(window.location.search)
  const stress = Number(params.get('stress') || 0)
  if (!Number.isFinite(stress) || stress <= base.length) return base

  const extras = []
  for (let i = base.length; i < stress; i += 1) {
    const seed = base[i % base.length]
    extras.push({
      ...seed,
      id: `stress-${i + 1}`,
      title: `${seed.title} · Ext ${i + 1}`,
      dateLabel: String(2020 + (i % 7)),
      year: String(2020 + (i % 7)),
    })
  }
  return [...base, ...extras]
}

function windowAround(list, activeIndex, size) {
  if (list.length <= size) return list.map((item, i) => ({ item, absoluteIndex: i }))
  const half = Math.floor(size / 2)
  const start = (activeIndex - half + list.length) % list.length
  return Array.from({ length: size }, (_, offset) => {
    const absoluteIndex = (start + offset) % list.length
    return { item: list[absoluteIndex], absoluteIndex }
  })
}

function ArtifactGlyph({ kind }) {
  if (kind === 'medal') {
    return (
      <svg viewBox="0 0 48 48" className={styles.glyph} aria-hidden="true">
        <circle cx="24" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="6" fill="currentColor" opacity="0.35" />
        <path d="M16 30l-4 14 12-6 12 6-4-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  }
  if (kind === 'ribbon') {
    return (
      <svg viewBox="0 0 48 48" className={styles.glyph} aria-hidden="true">
        <path d="M8 18h32v8H8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 26l4 14 8-5 8 5 4-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="22" r="4" fill="currentColor" opacity="0.4" />
      </svg>
    )
  }
  if (kind === 'crest') {
    return (
      <svg viewBox="0 0 48 48" className={styles.glyph} aria-hidden="true">
        <path d="M24 6l14 6v10c0 10-6 16-14 20-8-4-14-10-14-20V12l14-6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M24 14v18M18 22h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" className={styles.glyph} aria-hidden="true">
      <rect x="10" y="8" width="28" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 18h16M16 24h12M16 30h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Achievements() {
  const sectionRef = useRef(null)
  const indexListRef = useRef(null)
  const reducedMotion = useRef(false)
  const pauseUntil = useRef(0)

  const catalog = useMemo(() => padAchievementsForStress(achievements), [])
  const [activeId, setActiveId] = useState(catalog[0]?.id ?? '')

  const activeIndex = Math.max(
    0,
    catalog.findIndex((item) => item.id === activeId)
  )
  const active = catalog[activeIndex] ?? catalog[0]

  const displaySlots = useMemo(
    () => windowAround(catalog, activeIndex, CASE_SLOTS),
    [catalog, activeIndex]
  )

  const selectAchievement = useCallback((id) => {
    setActiveId(id)
    pauseUntil.current = Date.now() + AUTO_MS * 1.4
  }, [])

  const advance = useCallback(() => {
    if (!catalog.length) return
    if (Date.now() < pauseUntil.current) return
    const next = catalog[(activeIndex + 1) % catalog.length]
    if (next) setActiveId(next.id)
  }, [catalog, activeIndex])

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion.current || catalog.length <= 1) return undefined
    const id = setInterval(advance, AUTO_MS)
    return () => clearInterval(id)
  }, [advance, catalog.length])

  useEffect(() => {
    const list = indexListRef.current
    if (!list) return
    const row = list.querySelector(`[data-id="${activeId}"]`)
    if (!row) return
    row.scrollIntoView({ block: 'nearest', behavior: reducedMotion.current ? 'auto' : 'smooth' })
  }, [activeId])

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const label = section.querySelector(`.${styles.sectionLabel}`)
    const stage = section.querySelector(`.${styles.stage}`)
    if (!label || !stage) return

    gsap.from(label, {
      opacity: 0,
      y: 16,
      duration: 0.45,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    })

    gsap.from(stage, {
      y: 28,
      opacity: 0.35,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })
  }, { scope: sectionRef })

  return (
    <section
      className={styles.section}
      id="achievements"
      ref={sectionRef}
      aria-labelledby="achievements-heading"
    >
      <div className={styles.proof} aria-hidden="true">
        MARKS
      </div>

      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.sectionLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            09 — Achievements
          </span>
          <h2 id="achievements-heading" className={styles.heading}>
            Distinctive Achievements
          </h2>
          <p className={styles.subhead}>
            Each recognition. Cataloged. Preserved.
          </p>
        </header>

        <div className={styles.stage}>
          <aside className={styles.indexPane} aria-label="Collection index">
            <p className={styles.indexKicker}>Collection Index</p>
            <div className={styles.indexShell}>
              <ul className={styles.indexList} ref={indexListRef} role="listbox" aria-label="Achievements">
                {catalog.map((item, index) => {
                  const selected = item.id === activeId
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        data-id={item.id}
                        className={`${styles.indexRow} ${selected ? styles.indexRowActive : ''}`}
                        onClick={() => selectAchievement(item.id)}
                      >
                        <span className={styles.indexNum}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.indexBody}>
                          <span className={styles.indexTitle}>{item.title}</span>
                          <span className={styles.indexMeta}>
                            {item.dateLabel} · {item.type}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              {catalog.length > 6 && (
                <p className={styles.indexMore} aria-hidden="true">
                  and many more…
                </p>
              )}
            </div>
          </aside>

          <div className={styles.showcase} aria-live="polite">
            <div className={styles.case}>
              <div className={styles.caseCeiling} aria-hidden="true">
                {displaySlots.map(({ item }) => (
                  <span
                    key={`spot-${item.id}`}
                    className={`${styles.spotlight} ${item.id === activeId ? styles.spotlightActive : ''}`}
                  />
                ))}
              </div>

              <div className={styles.shelf} role="list">
                {displaySlots.map(({ item, absoluteIndex }) => {
                  const selected = item.id === activeId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="listitem"
                      className={`${styles.exhibit} ${selected ? styles.exhibitActive : ''}`}
                      onClick={() => selectAchievement(item.id)}
                      aria-label={`${item.title}, ${item.dateLabel}`}
                      aria-pressed={selected}
                    >
                      <div className={styles.artifact}>
                        <div className={styles.artifactGlow} aria-hidden="true" />
                        <img src={item.logo} alt="" className={styles.artifactLogo} />
                        <div className={styles.artifactGlyphWrap} aria-hidden="true">
                          <ArtifactGlyph kind={item.artifact} />
                        </div>
                      </div>
                      <div className={styles.pedestal} aria-hidden="true">
                        <span className={styles.pedestalTop} />
                        <span className={styles.pedestalStem} />
                        <span className={styles.pedestalBase} />
                      </div>
                      <span className={styles.exhibitIndex}>
                        {String(absoluteIndex + 1).padStart(2, '0')}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className={styles.caseGlass} aria-hidden="true" />
            </div>

            {active && (
              <article className={styles.dossier} key={active.id}>
                <div className={styles.dossierTop}>
                  <div className={styles.dossierMark}>
                    <img src={active.logo} alt="" className={styles.dossierLogo} />
                  </div>
                  <div className={styles.dossierMeta}>
                    <span className={styles.dossierYear}>{active.dateLabel}</span>
                    <span className={styles.dossierType}>{active.type}</span>
                  </div>
                </div>

                <h3 className={styles.dossierTitle}>{active.title}</h3>
                <p className={styles.dossierOrg}>{active.org}</p>
                <p className={styles.dossierIssuer}>{active.issuer}</p>

                <div className={styles.dossierGrid}>
                  <div>
                    <p className={styles.dossierLabel}>Recognition</p>
                    <p className={styles.dossierText}>{active.detail}</p>
                  </div>
                  <div>
                    <p className={styles.dossierLabel}>Impact</p>
                    <p className={styles.dossierText}>{active.impact}</p>
                  </div>
                </div>

                <div className={styles.tags}>
                  {active.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
