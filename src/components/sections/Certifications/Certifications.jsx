import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Certifications.module.css'

gsap.registerPlugin(ScrollTrigger)

const AUTO_MS = 5000

/** Fixed constellation board — concentric arcs stay stretched; never overlap. */
const CONSTELLATION = {
  width: 360,
  height: 480,
  cx: 52,
  cy: 240,
  startDeg: -84,
  endDeg: 84,
  // Fully stretched parallels — ~110px clear channel between rings (ref design)
  outerR: 180,
  innerR: 70,
  dualAt: 7,
  labelPadOuter: 20,
  labelPadInner: 18,
}

const MicrosoftLogo = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={size} height={size} aria-hidden="true">
    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
    <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
    <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
    <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
  </svg>
)

const AnthropicLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M25.2 7.2 4.5 56.8h10.2l4.55-10.6h17.9l4.55 10.6H51.9L31.2 7.2h-6zm1.55 14.9 7.05 16.5H19.7l7.05-16.5zM46.6 7.2 55.5 56.8H45.2L36.3 7.2h10.3z"
    />
  </svg>
)

const GoogleCloudLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M12.14 2.5C8.52 2.5 5.4 4.66 4.03 7.75l2.88 1.67c.86-2.05 2.9-3.5 5.23-3.5 2.22 0 4.14 1.27 5.07 3.12l2.96-1.72C18.68 4.4 15.62 2.5 12.14 2.5z" />
    <path fill="#34A853" d="M21.34 12.08h-9.2v3.04h5.3c-.54 1.52-2.07 2.6-3.96 2.88l2.65 2.05c2.72-1.42 4.56-4.25 4.56-7.37 0-.55-.1-1.08-.28-1.6h.93z" />
    <path fill="#FBBC04" d="M7.35 13.22c-.22-.62-.34-1.29-.34-1.98s.12-1.36.34-1.98L4.1 7.25C3.4 8.6 3 10.15 3 11.88c0 1.68.38 3.27 1.05 4.66l3.3-3.32z" />
    <path fill="#EA4335" d="M12.14 21.26c3.22 0 5.92-1.06 7.89-2.87l-2.65-2.05c-1.17.78-2.66 1.24-4.28 1.24-3.25 0-6.01-2.1-7.02-4.98L2.9 15.28c1.7 3.58 5.33 5.98 9.24 5.98z" />
  </svg>
)

const IithLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55" />
    <text
      x="32"
      y="37"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="var(--font-display), system-ui, sans-serif"
      fontSize="16"
      fontWeight="700"
      letterSpacing="0.06em"
    >
      IIT
    </text>
  </svg>
)

const issuers = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    fullName: 'Anthropic Academy',
    logoKind: 'anthropic',
    logoUrl: '/logos/anthropic.png',
    washUrl: '/logos/anthropic-wash.svg',
    invertLogo: true,
    washOpacity: 0.12,
    logoAlt: 'Anthropic',
    mark: 'AI',
  },
  {
    id: 'gcloud',
    name: 'Google Cloud',
    fullName: 'Google Cloud',
    logoKind: 'gcloud',
    logoUrl: '/logos/gcloud.png',
    washUrl: '/logos/gcloud-wash.svg',
    invertLogo: false,
    washOpacity: 0.13,
    logoAlt: 'Google Cloud',
    mark: 'GC',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    fullName: 'Microsoft',
    logoKind: 'microsoft',
    washOpacity: 0.085,
    logoAlt: 'Microsoft',
    mark: 'MS',
  },
  {
    id: 'iith',
    name: 'IIT Hyderabad',
    fullName: 'IIT Hyderabad × My Job Grow',
    logoKind: 'iith',
    washOpacity: 0.11,
    logoAlt: 'IIT Hyderabad',
    mark: 'IIT',
  },
]

const certifications = [
  {
    id: 'claude-101',
    issuerId: 'anthropic',
    title: 'Claude 101',
    subtitle: 'Introduction to Claude',
    date: 'Jun 2026',
    href: 'https://verify.skilljar.com/c/6szg665kh7a6',
    description:
      'Foundations of working with Claude — prompting patterns, safety boundaries, and building reliable assistant workflows.',
  },
  {
    id: 'claude-code-101',
    issuerId: 'anthropic',
    title: 'Claude Code 101',
    subtitle: 'Agentic coding with Claude',
    date: 'Jun 2026',
    href: 'https://verify.skilljar.com/c/vpp4pc9vvj8x',
    description:
      'Hands-on Claude Code workflows — repo navigation, tool use, and shipping features with an AI coding agent.',
  },
  {
    id: 'mcp-intro',
    issuerId: 'anthropic',
    title: 'Introduction to Model Context Protocol',
    subtitle: 'MCP fundamentals',
    date: 'Jun 2026',
    href: 'https://verify.skilljar.com/c/5khygb3xbu3j',
    description:
      'Core MCP concepts — servers, tools, resources, and how model context plugs into real product surfaces.',
  },
  {
    id: 'mcp-advanced',
    issuerId: 'anthropic',
    title: 'Model Context Protocol: Advanced Topics',
    subtitle: 'Advanced MCP patterns',
    date: 'Jun 2026',
    href: 'https://verify.skilljar.com/c/q99jeipycn3f',
    description:
      'Deeper MCP architecture — advanced tool design, context strategies, and production-ready protocol patterns.',
  },
  {
    id: 'gcloud-llm',
    issuerId: 'gcloud',
    title: 'Introduction to Large Language Models',
    subtitle: 'LLM foundations on Google Cloud',
    date: 'Jun 2026',
    href: 'https://simpli-web.app.link/e/fyTnSuhRV3b',
    description:
      'Core LLM concepts on Google Cloud — model families, prompting, and practical paths from prototype to deploy.',
  },
  {
    id: 'ms-da-101',
    issuerId: 'microsoft',
    title: 'Data Analyst 101',
    subtitle: 'Microsoft data analysis fundamentals',
    date: 'Jun 2026',
    href: 'https://simpli-web.app.link/e/05ryeInRV3b',
    description:
      'Foundational data analysis practice — cleaning, exploring, and communicating insights with analyst workflows.',
  },
  {
    id: 'iith-ai',
    issuerId: 'iith',
    title: 'AI Upskilling & Internship Completion',
    subtitle: 'IIT Hyderabad × My Job Grow',
    date: 'Apr 2026',
    href: 'https://drive.google.com/file/d/1TOmQwsgZIQgY43x3p8x_hA3RaTk6fgdr/view?usp=sharing',
    description:
      'Completed AI upskilling and internship requirements spanning applied ML, generative AI, and project delivery.',
  },
]

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12.5l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IssuerLogo({ issuer, className, size = 22 }) {
  // Prefer crisp source assets for badge marks
  if (issuer.logoKind === 'microsoft') {
    return (
      <span className={className}>
        <MicrosoftLogo size={size} />
      </span>
    )
  }
  if (issuer.logoKind === 'iith') return <IithLogo className={className} />
  if (issuer.logoKind === 'anthropic') return <AnthropicLogo className={className} />
  if (issuer.logoKind === 'gcloud') return <GoogleCloudLogo className={className} />
  if (issuer.logoUrl) {
    return (
      <img
        src={issuer.logoUrl}
        alt={issuer.logoAlt}
        className={className}
        style={issuer.invertLogo ? { filter: 'invert(1)' } : undefined}
      />
    )
  }
  return <span className={className}>{issuer.mark}</span>
}

function CardLogoWash({ issuer }) {
  // Vector washes only — never upscale tiny PNGs
  if (issuer.washUrl) {
    return (
      <img
        src={issuer.washUrl}
        alt=""
        className={styles.cardLogoWashImg}
        decoding="async"
      />
    )
  }
  if (issuer.logoKind === 'microsoft') {
    return (
      <span className={styles.cardLogoWashSvg}>
        <MicrosoftLogo size={320} />
      </span>
    )
  }
  if (issuer.logoKind === 'iith') {
    return (
      <span className={`${styles.cardLogoWashSvg} ${styles.cardLogoWashMono}`}>
        <IithLogo />
      </span>
    )
  }
  if (issuer.logoKind === 'anthropic') {
    return (
      <span className={`${styles.cardLogoWashSvg} ${styles.cardLogoWashMono}`}>
        <AnthropicLogo />
      </span>
    )
  }
  if (issuer.logoKind === 'gcloud') {
    return (
      <span className={styles.cardLogoWashSvg}>
        <GoogleCloudLogo />
      </span>
    )
  }
  return <span className={styles.cardLogoWashMark}>{issuer.mark}</span>
}

/** Evenly place `count` points along a right-opening arc. */
function placeOnArc(count, radius, { cx, cy, startDeg, endDeg }, angleOffsetDeg = 0) {
  if (count <= 0) return []
  const span = endDeg - startDeg
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const deg = startDeg + span * t + angleOffsetDeg
    const rad = (deg * Math.PI) / 180
    return {
      x: cx + Math.cos(rad) * radius,
      y: cy + Math.sin(rad) * radius,
      deg,
      rad,
    }
  })
}

/**
 * Fixed-board constellation layout.
 * ≤6 issuers → single outer arc
 * 7+ issuers → outer + inner rings with a large radial gap + angular stagger
 * so nodes/labels never sit on top of each other.
 */
export function layoutConstellation(count, board = CONSTELLATION) {
  const {
    width,
    height,
    cx,
    cy,
    startDeg,
    endDeg,
    outerR,
    innerR,
    dualAt,
    labelPadOuter,
    labelPadInner,
  } = board
  const dual = count >= dualAt
  const outerCount = dual ? Math.ceil(count * 0.55) : count
  const innerCount = dual ? count - outerCount : 0

  // Half-step offset so inner nodes nest between outer nodes (not on the same ray)
  const outerStep = outerCount > 1 ? (endDeg - startDeg) / (outerCount - 1) : 0
  const innerOffset = dual && innerCount > 0 ? outerStep * 0.45 : 0

  const outer = placeOnArc(outerCount, outerR, { cx, cy, startDeg, endDeg }).map((p) => ({
    ...p,
    ring: 'outer',
    // Labels sit outside the arc (further from hub) — never into the gap
    labelX: p.x + Math.cos(p.rad) * labelPadOuter + 12,
    labelY: p.y + Math.sin(p.rad) * (Math.abs(p.deg) > 55 ? 4 : 0),
    labelSide: 'out',
  }))

  const inner = placeOnArc(
    innerCount,
    innerR,
    { cx, cy, startDeg: startDeg + 8, endDeg: endDeg - 8 },
    innerOffset
  ).map((p) => ({
    ...p,
    ring: 'inner',
    // Labels sit inward toward the hub — clears the outer ring entirely
    labelX: p.x - Math.cos(p.rad) * labelPadInner - 10,
    labelY: p.y,
    labelSide: 'in',
  }))

  const slots = resolveLabelCollisions([...outer, ...inner], dual, height)
  const nodeR = dual ? 6 : 7.5
  const ringGap = outerR - innerR

  return {
    width,
    height,
    cx,
    cy,
    outerR,
    innerR,
    ringGap,
    dual,
    nodeR,
    compact: dual,
    slots,
    arcPath: describeArc(cx, cy, outerR, startDeg, endDeg),
    innerArcPath: dual ? describeArc(cx, cy, innerR, startDeg + 6, endDeg - 6) : null,
  }
}

/** Nudge label Y positions so text boxes never overlap. */
function resolveLabelCollisions(slots, dual, boardHeight = CONSTELLATION.height) {
  const approxH = dual ? 18 : 30
  const minGap = approxH + 10

  const boxes = slots.map((s) => ({ ...s }))

  // Same-side labels along an arc almost always share vertical space —
  // always enforce a minimum Y gap between consecutive items.
  for (const side of ['out', 'in']) {
    const group = boxes.filter((b) => b.labelSide === side).sort((a, b) => a.labelY - b.labelY)
    for (let i = 1; i < group.length; i += 1) {
      const prev = group[i - 1]
      const cur = group[i]
      const needed = prev.labelY + minGap
      if (cur.labelY < needed) cur.labelY = needed
    }
    // If the stack ran past the board, shift the whole group up
    if (group.length) {
      const overflow = group[group.length - 1].labelY + approxH / 2 - (boardHeight - 8)
      if (overflow > 0) {
        for (const g of group) g.labelY -= overflow
      }
      // And re-pack from top if top went negative
      const under = 8 + approxH / 2 - group[0].labelY
      if (under > 0) {
        for (const g of group) g.labelY += under
      }
      // Final pass: keep gaps after clamping
      for (let i = 1; i < group.length; i += 1) {
        const needed = group[i - 1].labelY + minGap
        if (group[i].labelY < needed) group[i].labelY = needed
      }
    }
  }

  return boxes
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const toXY = (deg) => {
    const rad = (deg * Math.PI) / 180
    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r]
  }
  const [x1, y1] = toXY(startDeg)
  const [x2, y2] = toXY(endDeg)
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}


function displayIssuerName(name, dual) {
  if (!dual) return name
  // Keep distinct short names; only trim very long multi-word brands
  if (name.length <= 14) return name
  const parts = name.split(' ')
  return parts[0]
}

function IssuerConstellation({ items, activeId, onSelect }) {
  const layout = useMemo(() => layoutConstellation(items.length), [items.length])

  return (
    <div
      className={`${styles.constellation} ${layout.dual ? styles.constellationDual : ''}`}
      style={{ width: layout.width, height: layout.height }}
      data-ring-gap={layout.ringGap}
    >
      <svg
        className={styles.constellationSvg}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width={layout.width}
        height={layout.height}
        aria-hidden="true"
      >
        <path className={styles.constellationGlow} d={layout.arcPath} fill="none" />
        <path className={styles.constellationStroke} d={layout.arcPath} fill="none" />
        {layout.innerArcPath && (
          <>
            <path className={styles.constellationGlowInner} d={layout.innerArcPath} fill="none" />
            <path className={styles.constellationStrokeInner} d={layout.innerArcPath} fill="none" />
          </>
        )}
        <circle className={styles.constellationHub} cx={layout.cx} cy={layout.cy} r="2.5" />
      </svg>

      <ul className={styles.constellationList}>
        {items.map((item, index) => {
          const slot = layout.slots[index]
          if (!slot) return null
          const isActive = activeId === item.id
          const shortName = displayIssuerName(item.name, layout.dual)

          return (
            <li
              key={item.id}
              className={`${styles.constellationItem} ${
                slot.ring === 'inner' ? styles.constellationItemInner : styles.constellationItemOuter
              }`}
            >
              <button
                type="button"
                className={`${styles.constellationNode} ${isActive ? styles.constellationNodeActive : ''}`}
                style={{
                  left: slot.x,
                  top: slot.y,
                  width: layout.nodeR * 2,
                  height: layout.nodeR * 2,
                }}
                aria-pressed={isActive}
                aria-label={`${item.name}, ${item.meta}`}
                title={`${item.name} · ${item.meta}`}
                onClick={() => onSelect(item.id)}
              />

              <button
                type="button"
                className={`${styles.constellationLabel} ${
                  slot.labelSide === 'in' ? styles.constellationLabelIn : styles.constellationLabelOut
                } ${isActive ? styles.constellationLabelActive : ''}`}
                style={{ left: slot.labelX, top: slot.labelY }}
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onSelect(item.id)}
              >
                <span className={styles.constellationName}>{shortName}</span>
                {!layout.dual && (
                  <span className={styles.constellationMeta}>{item.meta}</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Certifications() {
  const sectionRef = useRef(null)
  const reducedMotion = useRef(false)
  const [activeIssuerId, setActiveIssuerId] = useState('anthropic')
  const [activeCertId, setActiveCertId] = useState(certifications[0].id)

  const issuerIndex = useMemo(
    () => Object.fromEntries(issuers.map((issuer) => [issuer.id, issuer])),
    []
  )

  const navItems = useMemo(() => {
    const base = [
      ...issuers.map((issuer) => ({
        id: issuer.id,
        name: issuer.name,
        meta: (() => {
          const count = certifications.filter((cert) => cert.issuerId === issuer.id).length
          return `${count} cert${count === 1 ? '' : 's'}`
        })(),
      })),
      {
        id: 'all',
        name: 'View All',
        meta: `${certifications.length} total`,
      },
    ]

    // Optional stress preview: /#certifications?stress=12 pads fake issuers
    // to prove the fixed constellation board does not grow congested.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const stress = Number(params.get('stress') || 0)
      if (stress > base.length) {
        const extras = Array.from({ length: stress - base.length }, (_, i) => ({
          id: `future-${i + 1}`,
          name: `Issuer ${base.length + i}`,
          meta: '1 cert',
        }))
        return [...base, ...extras]
      }
    }
    return base
  }, [])

  const filteredCerts = useMemo(() => {
    if (activeIssuerId === 'all') {
      return issuers
        .map((issuer) => certifications.find((cert) => cert.issuerId === issuer.id))
        .filter(Boolean)
    }
    return certifications.filter((cert) => cert.issuerId === activeIssuerId)
  }, [activeIssuerId])

  const activeIndex = Math.max(
    0,
    filteredCerts.findIndex((cert) => cert.id === activeCertId)
  )

  const stackCerts = useMemo(() => {
    if (filteredCerts.length === 0) return []
    const ordered = [
      filteredCerts[activeIndex],
      ...filteredCerts.slice(activeIndex + 1),
      ...filteredCerts.slice(0, activeIndex),
    ]
    return ordered.slice(0, Math.min(3, ordered.length))
  }, [filteredCerts, activeIndex])

  const selectIssuer = useCallback((issuerId) => {
    setActiveIssuerId(issuerId)
    if (issuerId === 'all') {
      setActiveCertId(certifications[0].id)
      return
    }
    const first = certifications.find((cert) => cert.issuerId === issuerId)
    if (first) setActiveCertId(first.id)
  }, [])

  const selectCert = useCallback((certId) => {
    setActiveCertId(certId)
    const cert = certifications.find((item) => item.id === certId)
    if (cert) setActiveIssuerId(cert.issuerId)
  }, [])

  const advanceCert = useCallback(() => {
    const idx = certifications.findIndex((cert) => cert.id === activeCertId)
    const next = certifications[(idx + 1) % certifications.length]
    if (!next) return
    setActiveCertId(next.id)
    setActiveIssuerId(next.issuerId)
  }, [activeCertId])

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedMotion.current || certifications.length <= 1) return undefined
    const id = setInterval(advanceCert, AUTO_MS)
    return () => clearInterval(id)
  }, [advanceCert])

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const label = section.querySelector(`.${styles.sectionLabel}`)
    const stage = section.querySelector(`.${styles.stage}`)
    if (!label || !stage) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.from(label, {
      opacity: 0,
      y: 16,
      duration: 0.45,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    })

    gsap.from(stage, {
      y: 24,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.section} id="certifications" ref={sectionRef} aria-labelledby="certs-heading">
      <div className={styles.proof} aria-hidden="true">
        PROOF
      </div>

      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.sectionLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            Certifications
          </span>
          <h2 id="certs-heading" className={styles.heading}>
            Credentials
          </h2>
        </header>

        <div className={styles.stage}>
          <nav className={styles.issuerNav} aria-label="Issuers">
            <p className={styles.issuerKicker}>Issuer</p>
            <IssuerConstellation
              items={navItems}
              activeId={activeIssuerId}
              onSelect={selectIssuer}
            />
          </nav>

          <div className={styles.stackScene} aria-live="polite">
            <div className={styles.stackFloor} aria-hidden="true" />
            <div className={styles.stack}>
              {stackCerts.map((cert, index) => {
                const issuer = issuerIndex[cert.issuerId]
                const isFront = index === 0

                return (
                  <article
                    key={cert.id}
                    className={`${styles.card} ${isFront ? styles.cardFront : styles.cardBack}`}
                    style={{ '--stack-i': index }}
                    aria-hidden={!isFront}
                  >
                    {isFront ? (
                      <button
                        type="button"
                        className={styles.cardHit}
                        aria-label="Show next credential"
                        onClick={advanceCert}
                      />
                    ) : (
                      <button
                        type="button"
                        className={styles.cardHit}
                        aria-label={`Show ${cert.title}`}
                        onClick={() => selectCert(cert.id)}
                      />
                    )}

                    <div
                      className={styles.cardLogoWash}
                      style={{ opacity: issuer.washOpacity ?? 0.14 }}
                      aria-hidden="true"
                    >
                      <CardLogoWash issuer={issuer} />
                    </div>

                    <div className={styles.cardTop}>
                      <div className={styles.cardMark} aria-hidden="true">
                        <IssuerLogo issuer={issuer} className={styles.cardLogo} />
                      </div>
                      <span className={styles.cardIssuer}>{issuer.name}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{cert.title}</h3>
                      <p className={styles.cardSubtitle}>{cert.subtitle}</p>

                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>
                          <CalendarIcon />
                          {cert.date}
                        </span>
                        <span className={styles.verified}>
                          <CheckIcon />
                          Verified
                        </span>
                      </div>

                      <p className={styles.cardDesc}>{cert.description}</p>
                    </div>

                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckIcon />
                      Verify Credential
                    </a>
                  </article>
                )
              })}
            </div>

            {filteredCerts.length > 1 && (
              <div className={styles.stackNav} role="tablist" aria-label="Credentials in stack">
                {filteredCerts.map((cert, index) => (
                  <button
                    key={cert.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    className={`${styles.stackDot} ${index === activeIndex ? styles.stackDotActive : ''}`}
                    onClick={() => selectCert(cert.id)}
                    aria-label={cert.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
