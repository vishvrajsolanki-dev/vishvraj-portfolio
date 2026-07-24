import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CurrentlyBuilding.module.css'

gsap.registerPlugin(ScrollTrigger)

const builds = [
  {
    id: 'arc',
    num: '01',
    title: 'ARC Engine',
    fullName: 'ARC — Adaptive Risk & Clarity Engine',
    status: 'In Design',
    statusTone: 'design',
    spec: 'Monte Carlo · RAG · Fintech risk OS',
    rev: 'REV A',
    desc: 'Monte Carlo + ML + RAG platform for Indian retail investors — risk profiling, portfolio simulation, plain-language intelligence.',
    stack: ['Monte Carlo', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
    sketch: 'arc',
  },
  {
    id: 'letterlens',
    num: '02',
    title: 'LetterLens v2',
    fullName: 'LetterLens v2',
    status: 'In Progress',
    statusTone: 'progress',
    spec: 'EMNIST 47-class CNN · live canvas',
    rev: 'REV B',
    desc: 'Upgrade from MNIST to EMNIST Balanced — 47-class handwritten character recognition with improved CNN and live drawing canvas.',
    stack: ['CNN', 'EMNIST', 'TensorFlow', 'Streamlit'],
    sketch: 'letterlens',
  },
  {
    id: 'trackbot',
    num: '03',
    title: 'TrackBot AGV v2',
    fullName: 'TrackBot AGV v2',
    status: 'Active',
    statusTone: 'active',
    spec: 'ESP32-S3 · A* · RFID · mecanum',
    rev: 'REV C',
    desc: 'ESP32-S3 upgrade with mecanum drive, A* pathfinding, RFID navigation, and multi-sensor fusion. SSIP funding push in progress.',
    stack: ['ESP32-S3', 'C++', 'A*', 'RFID', 'FreeRTOS'],
    sketch: 'trackbot',
  },
  {
    id: 'plotsense',
    num: '04',
    title: 'PlotSense Next',
    fullName: 'PlotSense — Genre Intelligence',
    status: 'Queued',
    statusTone: 'queued',
    spec: 'NLP · 27-class plot classifier',
    rev: 'REV A',
    desc: 'Next-pass genre classifier on IMDB plot summaries — richer embeddings, tighter evaluation, and a cleaner inference UI.',
    stack: ['TF-IDF', 'NLP', 'Streamlit'],
    sketch: 'plotsense',
  },
]

function Pin() {
  return (
    <span className={styles.pin} aria-hidden="true">
      <span className={styles.pinHead} />
      <span className={styles.pinNeedle} />
    </span>
  )
}

function Crosshair() {
  return (
    <svg className={styles.crosshair} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function SketchArc() {
  return (
    <svg className={styles.sketch} viewBox="0 0 320 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="24" y="28" width="272" height="144" />
        <path d="M24 56h272M88 28v144" />
        <path d="M110 150 L140 110 L170 128 L200 78 L230 96 L260 64" strokeWidth="1.4" />
        <circle cx="140" cy="110" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="200" cy="78" r="2.5" fill="currentColor" stroke="none" />
        <path d="M48 170h40M48 166v8M88 166v8" />
        <text x="52" y="184" className={styles.sketchDim}>RISK σ</text>
        <text x="210" y="48" className={styles.sketchDim}>MONTE CARLO</text>
        <path d="M250 70c18 8 28 22 28 40" strokeDasharray="3 3" />
      </g>
    </svg>
  )
}

function SketchLetterLens() {
  return (
    <svg className={styles.sketch} viewBox="0 0 320 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="36" y="32" width="120" height="120" />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={44 + c * 22}
              y={40 + r * 22}
              width="18"
              height="18"
              fill={(r + c) % 3 === 0 ? 'currentColor' : 'none'}
              opacity={(r + c) % 3 === 0 ? 0.35 : 1}
            />
          ))
        )}
        <rect x="180" y="40" width="100" height="100" />
        <path d="M200 120c8-28 20-48 40-60" strokeWidth="1.4" />
        <path d="M210 70h40M230 55v40" />
        <text x="188" y="158" className={styles.sketchDim}>47 CLASS</text>
        <text x="44" y="172" className={styles.sketchDim}>EMNIST GRID · 28×28</text>
        <path d="M36 156h120" strokeDasharray="2 3" />
      </g>
    </svg>
  )
}

function SketchTrackBot() {
  return (
    <svg className={styles.sketch} viewBox="0 0 320 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="70" y="58" width="180" height="90" rx="8" />
        <rect x="95" y="78" width="70" height="50" />
        <circle cx="100" cy="160" r="14" />
        <circle cx="220" cy="160" r="14" />
        <circle cx="100" cy="160" r="4" fill="currentColor" stroke="none" />
        <circle cx="220" cy="160" r="4" fill="currentColor" stroke="none" />
        <path d="M70 100H48M272 100h-22" />
        <path d="M160 58V36M160 148v20" />
        <path d="M48 96v8M272 96v8M156 36h8M156 168h8" />
        <text x="118" y="30" className={styles.sketchDim}>180 mm</text>
        <text x="18" y="104" className={styles.sketchDim}>W</text>
        <text x="128" y="108" className={styles.sketchDim}>AGV DECK</text>
        <path d="M250 70l18-12M250 78l22 0" strokeDasharray="3 2" />
        <text x="236" y="54" className={styles.sketchDim}>RFID</text>
      </g>
    </svg>
  )
}

function SketchPlotSense() {
  return (
    <svg className={styles.sketch} viewBox="0 0 320 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="40" y="36" width="240" height="120" />
        <path d="M60 140 V70 M90 140 V88 M120 140 V60 M150 140 V96 M180 140 V74 M210 140 V52 M240 140 V84" strokeWidth="2" />
        <path d="M40 140h240" />
        <text x="52" y="176" className={styles.sketchDim}>GENRE VECTOR · 27 CLASS</text>
        <text x="200" y="56" className={styles.sketchDim}>TF-IDF</text>
        <circle cx="210" cy="52" r="10" strokeDasharray="2 2" />
      </g>
    </svg>
  )
}

function Sketch({ kind }) {
  if (kind === 'arc') return <SketchArc />
  if (kind === 'letterlens') return <SketchLetterLens />
  if (kind === 'trackbot') return <SketchTrackBot />
  return <SketchPlotSense />
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SPOTLIGHT_MS = 12000
const TRAVEL_MS = 6500
const GAP_PX = 26.4 // 1.65rem

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function BuildCard({ build, ghost = false, setId, active = false, onCardClick }) {
  return (
    <article
      className={`${styles.card} ${active ? styles.cardActive : ''}`}
      aria-hidden={ghost || undefined}
      data-build-id={build.id}
      data-set={setId}
      aria-current={active && !ghost ? 'true' : undefined}
      onClick={onCardClick}
    >
      <Pin />

      <div className={styles.cardSheet}>
        <div className={styles.cardHead}>
          <span className={styles.cardNum}>{build.num}</span>
          <h3 className={styles.cardTitle}>{build.title}</h3>
        </div>

        <div className={styles.sketchWell}>
          <Sketch kind={build.sketch} />
        </div>

        <div className={styles.specTable}>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Project</span>
            <span className={styles.specValue}>{build.fullName}</span>
            <span className={styles.specMeta}>
              <Crosshair />
            </span>
          </div>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Status</span>
            <span className={styles.specValue}>
              <span className={`${styles.stamp} ${styles[`stamp_${build.statusTone}`]}`}>
                {build.status}
              </span>
            </span>
            <span className={styles.specMeta} />
          </div>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Spec</span>
            <span className={styles.specValue}>{build.spec}</span>
            <span className={styles.specMeta}>{build.rev}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CurrentlyBuilding() {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const setWidthRef = useRef(0)
  const positionsRef = useRef([])
  const indexRef = useRef(0)
  const phaseRef = useRef('dwell') // dwell | travel
  const phaseStartRef = useRef(0)
  const travelFromRef = useRef(0)
  const travelToRef = useRef(0)
  const reducedRef = useRef(false)
  const drag = useRef({ active: false, startX: 0, startOffset: 0, moved: false })
  const rafRef = useRef(0)
  const [activeId, setActiveId] = useState(builds[0].id)

  const applyOffset = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const loop = setWidthRef.current
    let x = offsetRef.current
    if (loop > 0) {
      x = ((x % loop) + loop) % loop
      offsetRef.current = x
    }
    track.style.transform = `translate3d(${-x}px, 0, 0)`
  }, [])

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cards = [...track.querySelectorAll(`.${styles.card}[data-set="a"]`)]
    if (!cards.length) return

    const positions = []
    let cursor = 0
    cards.forEach((card, index) => {
      positions.push(cursor)
      cursor += card.getBoundingClientRect().width
      if (index < cards.length - 1) cursor += GAP_PX
    })
    cursor += GAP_PX // trailing gap before duplicate set
    positionsRef.current = positions
    setWidthRef.current = cursor

    const i = indexRef.current % builds.length
    offsetRef.current = positions[i] ?? 0
    applyOffset()
  }, [applyOffset])

  const beginDwell = useCallback((now = performance.now()) => {
    phaseRef.current = 'dwell'
    phaseStartRef.current = now
    const i = ((indexRef.current % builds.length) + builds.length) % builds.length
    indexRef.current = i
    const pos = positionsRef.current[i] ?? 0
    offsetRef.current = pos
    applyOffset()
    setActiveId(builds[i].id)
  }, [applyOffset])

  const beginTravel = useCallback((now = performance.now()) => {
    const n = builds.length
    const fromIndex = ((indexRef.current % n) + n) % n
    const nextIndex = (fromIndex + 1) % n
    const positions = positionsRef.current
    const loop = setWidthRef.current
    if (!positions.length || loop <= 0) return

    travelFromRef.current = offsetRef.current
    // When wrapping, travel into the duplicate set (offset = loop == first card of set B)
    travelToRef.current = fromIndex === n - 1 ? loop : (positions[(fromIndex + 1) % n] ?? loop)
    phaseRef.current = 'travel'
    phaseStartRef.current = now
    indexRef.current = nextIndex
    setActiveId(builds[nextIndex].id)
  }, [])

  const goToIndex = useCallback((target, { animate = false } = {}) => {
    const n = builds.length
    const i = ((target % n) + n) % n
    const positions = positionsRef.current
    if (!positions.length) return

    if (animate) {
      travelFromRef.current = offsetRef.current
      // Choose nearest direction on the loop
      let to = positions[i]
      const loop = setWidthRef.current
      const cur = offsetRef.current
      const forward = (to - cur + loop) % loop
      const backward = (cur - to + loop) % loop
      if (backward < forward) {
        to = cur - backward
      } else {
        to = cur + forward
      }
      travelToRef.current = to
      phaseRef.current = 'travel'
      phaseStartRef.current = performance.now()
      indexRef.current = i
      setActiveId(builds[i].id)
      return
    }

    indexRef.current = i
    beginDwell()
  }, [beginDwell])

  const nudge = useCallback((dir) => {
    goToIndex(indexRef.current + dir, { animate: true })
  }, [goToIndex])

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    measure()
    beginDwell()

    const onResize = () => {
      measure()
      beginDwell()
    }
    window.addEventListener('resize', onResize)

    const tick = (now) => {
      if (reducedRef.current || drag.current.active) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (phaseRef.current === 'dwell') {
        if (now - phaseStartRef.current >= SPOTLIGHT_MS) {
          beginTravel(now)
        }
      } else if (phaseRef.current === 'travel') {
        const t = Math.min(1, (now - phaseStartRef.current) / TRAVEL_MS)
        const e = easeInOutCubic(t)
        const from = travelFromRef.current
        const to = travelToRef.current
        offsetRef.current = from + (to - from) * e
        applyOffset()

        if (t >= 1) {
          // Normalize onto primary set after wrap travel
          const loop = setWidthRef.current
          if (loop > 0) {
            offsetRef.current = ((offsetRef.current % loop) + loop) % loop
          }
          beginDwell(now)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [applyOffset, beginDwell, beginTravel, measure])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const onPointerDown = (event) => {
      if (event.button !== 0) return
      drag.current = {
        active: true,
        startX: event.clientX,
        startOffset: offsetRef.current,
        moved: false,
      }
      viewport.classList.add(styles.railDragging)
      viewport.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event) => {
      if (!drag.current.active) return
      const dx = event.clientX - drag.current.startX
      if (Math.abs(dx) > 4) drag.current.moved = true
      offsetRef.current = drag.current.startOffset - dx
      applyOffset()
    }

    const endDrag = (event) => {
      if (!drag.current.active) return
      drag.current.active = false
      viewport.classList.remove(styles.railDragging)
      try {
        viewport.releasePointerCapture?.(event.pointerId)
      } catch {
        /* ignore */
      }

      // Snap to nearest card and restart spotlight dwell
      const positions = positionsRef.current
      const loop = setWidthRef.current
      if (!positions.length || loop <= 0) return
      let x = ((offsetRef.current % loop) + loop) % loop
      let best = 0
      let bestDist = Infinity
      positions.forEach((pos, i) => {
        const d = Math.min(Math.abs(pos - x), Math.abs(pos + loop - x), Math.abs(pos - loop - x))
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      indexRef.current = best
      beginDwell()
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
    }
  }, [applyOffset, beginDwell])

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const header = section.querySelector(`.${styles.header}`)
    const strip = section.querySelector(`.${styles.strip}`)

    gsap.from(header, {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    })

    gsap.from(strip, {
      opacity: 0.4,
      y: 24,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })
  }, { scope: sectionRef })

  const onCardClick = (event) => {
    if (drag.current.moved) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <section
      className={styles.section}
      id="currently-building"
      ref={sectionRef}
      aria-labelledby="whats-next-heading"
      data-spotlight-ms={SPOTLIGHT_MS}
      data-travel-ms={TRAVEL_MS}
    >
      <div className={styles.gridBg} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.kicker}>Currently Building</span>
            <h2 id="whats-next-heading" className={styles.heading}>
              What's Next
            </h2>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.subhead}>A look ahead at in-progress builds.</p>
          </div>

          <div className={styles.headerNav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => nudge(-1)}
              aria-label="Previous builds"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => nudge(1)}
              aria-label="Next builds"
            >
              <ArrowRight />
            </button>
            <span className={styles.navHint}>
              Spotlight {SPOTLIGHT_MS / 1000}s · drift {TRAVEL_MS / 1000}s
            </span>
          </div>
        </header>
      </div>

      <div className={styles.strip}>
        <div className={styles.stripBand} aria-hidden="true" />
        <div
          className={styles.rail}
          ref={viewportRef}
          tabIndex={0}
          role="region"
          aria-label="In-progress builds, spotlight loop"
        >
          <div className={styles.track} ref={trackRef}>
            {builds.map((build) => (
              <BuildCard
                key={`a-${build.id}`}
                build={build}
                setId="a"
                active={build.id === activeId}
                onCardClick={onCardClick}
              />
            ))}
            {builds.map((build) => (
              <BuildCard
                key={`b-${build.id}`}
                build={build}
                setId="b"
                ghost
                active={build.id === activeId}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
