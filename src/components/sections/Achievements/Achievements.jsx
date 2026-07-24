import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Achievements.module.css'

gsap.registerPlugin(ScrollTrigger)

/** Spotlight dwell per card — middle of the 6–8s range (override with ?dwell=ms). */
const DEFAULT_AUTO_MS = 7000
const PREVIEW_COUNT = 9

function resolveDwellMs() {
  if (typeof window === 'undefined') return DEFAULT_AUTO_MS
  const raw = Number(new URLSearchParams(window.location.search).get('dwell') || 0)
  if (!Number.isFinite(raw) || raw < 500) return DEFAULT_AUTO_MS
  return Math.min(8000, Math.max(500, raw))
}

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

const previewExtras = [
  {
    id: 'preview-startup-india',
    year: '2025',
    dateLabel: '2025',
    type: 'National Recognition',
    title: 'Startup India Recognition',
    org: 'Department for Promotion of Industry & Internal Trade',
    issuer: 'Government of India',
    detail: 'Preview entry — national startup recognition for early-stage hardware innovation.',
    impact: 'Placeholder for future catalog growth beyond eight entries.',
    tags: ['Startup', 'Policy', 'Preview'],
    logo: '/logos/ssip.png',
    artifact: 'plaque',
  },
  {
    id: 'preview-msme',
    year: '2025',
    dateLabel: '2025',
    type: 'Registration',
    title: 'MSME Registration',
    org: 'Ministry of Micro, Small & Medium Enterprises',
    issuer: 'Government of India',
    detail: 'Preview entry — enterprise registration milestone for Scale-ready projects.',
    impact: 'Demonstrates how the static case holds nine+ recognitions.',
    tags: ['MSME', 'Compliance', 'Preview'],
    logo: '/logos/cvm.png',
    artifact: 'crest',
  },
  {
    id: 'preview-iso',
    year: '2024',
    dateLabel: '2024',
    type: 'Quality',
    title: 'ISO 9001:2015 Pathway',
    org: 'Quality Systems Preview',
    issuer: 'Standards Body · Preview',
    detail: 'Preview entry — quality-system pathway used to stress-test the spotlight loop.',
    impact: 'Confirms continuous cycling across a full second row of exhibits.',
    tags: ['ISO', 'Process', 'Preview'],
    logo: '/logos/spec.png',
    artifact: 'medal',
  },
  {
    id: 'preview-gujarat-startup',
    year: '2026',
    dateLabel: '2026',
    type: 'State Recognition',
    title: 'Gujarat Startup Recognition',
    org: 'Startup Gujarat · Preview',
    issuer: 'Government of Gujarat',
    detail: 'Preview entry — state startup recognition to fill the 8+ showcase grid.',
    impact: 'Keeps index + case + dossier in sync while cards stay locked in place.',
    tags: ['Startup Gujarat', 'Preview', 'Policy'],
    logo: '/logos/cems.png',
    artifact: 'ribbon',
  },
  {
    id: 'preview-open-source',
    year: '2023',
    dateLabel: '2023',
    type: 'Community',
    title: 'Open Source Contributor Mark',
    org: 'Community Preview',
    issuer: 'Open Source Collective · Preview',
    detail: 'Preview entry — ninth catalog slot so the spotlight can complete a full loop.',
    impact: 'Validates wrap-around from last card back to first without reshuffling.',
    tags: ['OSS', 'Community', 'Preview'],
    logo: '/logos/adit.png',
    artifact: 'plaque',
  },
]

function resolveCatalog(base) {
  if (typeof window === 'undefined') return base
  const params = new URLSearchParams(window.location.search)
  const preview = params.get('preview')
  const stress = Number(params.get('stress') || 0)

  if (preview === '8plus' || preview === 'achievements') {
    return [...base, ...previewExtras].slice(0, Math.max(PREVIEW_COUNT, base.length + previewExtras.length))
  }

  if (Number.isFinite(stress) && stress > base.length) {
    const extras = []
    for (let i = base.length; i < stress; i += 1) {
      const seed = previewExtras[i % previewExtras.length] ?? base[i % base.length]
      extras.push({
        ...seed,
        id: `stress-${i + 1}`,
        title: `${seed.title.replace(' · Preview', '')} · Ext ${i + 1}`,
      })
    }
    return [...base, ...extras]
  }

  return base
}

function shelfColumns(count) {
  if (count <= 4) return count || 1
  if (count <= 8) return 4
  return Math.min(5, count)
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
  const shelfRef = useRef(null)
  const reducedMotion = useRef(false)
  const pauseUntil = useRef(0)
  const activeIndexRef = useRef(0)

  const catalog = useMemo(() => resolveCatalog(achievements), [])
  const autoMs = useMemo(() => resolveDwellMs(), [])
  const isPreview = catalog.length > achievements.length
  const cols = shelfColumns(catalog.length)

  const [activeId, setActiveId] = useState(catalog[0]?.id ?? '')
  const activeIndex = Math.max(0, catalog.findIndex((item) => item.id === activeId))
  const active = catalog[activeIndex] ?? catalog[0]
  activeIndexRef.current = activeIndex

  const selectAchievement = useCallback((id, { pause = true } = {}) => {
    setActiveId(id)
    if (pause) pauseUntil.current = Date.now() + autoMs * 1.25
  }, [autoMs])

  const advanceSpotlight = useCallback(() => {
    if (!catalog.length) return
    if (Date.now() < pauseUntil.current) return
    const next = catalog[(activeIndexRef.current + 1) % catalog.length]
    if (next) setActiveId(next.id)
  }, [catalog])

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion.current || catalog.length <= 1) return undefined
    const id = setInterval(advanceSpotlight, autoMs)
    return () => clearInterval(id)
  }, [advanceSpotlight, catalog.length, autoMs])

  useEffect(() => {
    // Keep the active index row visible inside the list only —
    // never use scrollIntoView (it scrolls the whole page back to this section).
    const list = indexListRef.current
    if (!list) return
    const row = list.querySelector(`[data-id="${activeId}"]`)
    if (!row) return

    const listRect = list.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const pad = 8

    if (rowRect.top < listRect.top + pad) {
      list.scrollTop -= listRect.top + pad - rowRect.top
    } else if (rowRect.bottom > listRect.bottom - pad) {
      list.scrollTop += rowRect.bottom - (listRect.bottom - pad)
    }
  }, [activeId])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const onKey = (event) => {
      if (!catalog.length) return
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return

      const inSection = section.contains(document.activeElement) || section.matches(':hover')
      if (!inSection) return

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        const next = catalog[(activeIndex + 1) % catalog.length]
        if (next) selectAchievement(next.id)
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const prev = catalog[(activeIndex - 1 + catalog.length) % catalog.length]
        if (prev) selectAchievement(prev.id)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [catalog, activeIndex, selectAchievement])

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
      className={`${styles.section} ${isPreview ? styles.sectionPreview : ''}`}
      id="achievements"
      ref={sectionRef}
      aria-labelledby="achievements-heading"
      data-catalog-count={catalog.length}
      data-spotlight-ms={autoMs}
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
          {isPreview && (
            <p className={styles.previewBanner} role="status">
              Preview · {catalog.length} entries · static case · spotlight loop {autoMs / 1000}s
            </p>
          )}
        </header>

        <div className={styles.stage} tabIndex={0}>
          <aside className={styles.indexPane} aria-label="Collection index">
            <p className={styles.indexKicker}>Collection Index</p>
            <div className={styles.indexShell}>
              <ul
                className={styles.indexList}
                ref={indexListRef}
                role="listbox"
                tabIndex={0}
                aria-label="Achievements"
              >
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
              <div className={styles.indexFooter}>
                <p className={styles.indexFootNote}>
                  {catalog.length > 6 ? 'and many more…' : 'Archive of milestones'}
                </p>
                <p className={styles.indexCount}>{catalog.length} cataloged</p>
              </div>
            </div>
          </aside>

          <div className={styles.showcase}>
            <div className={styles.caseHead}>
              <p className={styles.caseKicker}>On display</p>
              <p className={styles.caseHint}>
                Spotlight · {autoMs / 1000}s loop · cards stay fixed
              </p>
            </div>

            <div className={`${styles.case} ${catalog.length > 4 ? styles.caseDense : ''}`}>
              <div className={styles.caseRail} aria-hidden="true" />

              <div
                className={styles.shelf}
                ref={shelfRef}
                style={{ '--shelf-cols': cols }}
                role="list"
                data-static-order={catalog.map((item) => item.id).join(',')}
                aria-live="polite"
              >
                {catalog.map((item, index) => {
                  const selected = item.id === activeId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="listitem"
                      data-id={item.id}
                      data-order={index}
                      className={`${styles.exhibit} ${selected ? styles.exhibitActive : ''}`}
                      onClick={() => selectAchievement(item.id)}
                      aria-label={`${item.title}, ${item.dateLabel}`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`${styles.spotlight} ${selected ? styles.spotlightActive : ''}`}
                        aria-hidden="true"
                      />
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
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className={styles.caseGlass} aria-hidden="true" />
              <div className={styles.caseFloor} aria-hidden="true" />
            </div>

            {active && (
              <article className={styles.dossier}>
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
