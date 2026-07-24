import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Certifications.module.css'

gsap.registerPlugin(ScrollTrigger)

const AUTO_MS = 5000

/** Fixed constellation board — grows rings, not height, as issuers are added. */
const CONSTELLATION = {
  width: 248,
  height: 360,
  cx: 40,
  cy: 180,
  startDeg: -78,
  endDeg: 78,
  outerR: 124,
  innerR: 78,
  dualAt: 7,
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
      d="M26.8 8.5 6.2 55.5h9.1l4.1-9.5h17.2l4.1 9.5h9.2L29.4 8.5h-2.6zm1.2 13.4 6.4 15.2H21.6l6.4-15.2zM48.2 8.5 56.8 55.5h-9.1L39.1 8.5h9.1z"
    />
  </svg>
)

const GoogleCloudLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#EA4335" d="M12.05 4.2c-2.55 0-4.78 1.55-5.75 3.78l2.55 1.48c.55-1.32 1.85-2.25 3.35-2.25 1.42 0 2.65.82 3.25 2.02l2.62-1.52C16.92 5.58 14.68 4.2 12.05 4.2z" />
    <path fill="#4285F4" d="M19.55 11.35h-7.2v2.7h4.15c-.42 1.35-1.62 2.3-3.1 2.55l2.35 1.82c2.15-1.12 3.6-3.35 3.6-5.82 0-.45-.08-.88-.2-1.25z" />
    <path fill="#34A853" d="M12.2 19.1c2.35 0 4.35-.78 5.8-2.1l-2.35-1.82c-.9.6-2.05.95-3.15.95-2.42 0-4.48-1.55-5.22-3.7L4.7 14.2c1.42 2.85 4.25 4.9 7.5 4.9z" />
    <path fill="#FBBC05" d="M7.05 12.9c-.2-.55-.3-1.15-.3-1.75s.1-1.2.3-1.75L4.45 7.1C3.9 8.25 3.6 9.55 3.6 11.15c0 1.55.3 2.9.9 4.15l2.55-2.4z" />
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
    washOpacity: 0.13,
    logoAlt: 'Anthropic',
    mark: 'AI',
  },
  {
    id: 'gcloud',
    name: 'Google Cloud',
    fullName: 'Google Cloud',
    logoKind: 'gcloud',
    washOpacity: 0.14,
    logoAlt: 'Google Cloud',
    mark: 'GC',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    fullName: 'Microsoft',
    logoKind: 'microsoft',
    washOpacity: 0.09,
    logoAlt: 'Microsoft',
    mark: 'MS',
  },
  {
    id: 'iith',
    name: 'IIT Hyderabad',
    fullName: 'IIT Hyderabad × My Job Grow',
    logoKind: 'iith',
    washOpacity: 0.12,
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
  if (issuer.logoKind === 'anthropic') return <AnthropicLogo className={className} />
  if (issuer.logoKind === 'gcloud') return <GoogleCloudLogo className={className} />
  if (issuer.logoKind === 'microsoft') {
    return (
      <span className={className}>
        <MicrosoftLogo size={size} />
      </span>
    )
  }
  if (issuer.logoKind === 'iith') return <IithLogo className={className} />
  return <span className={className}>{issuer.mark}</span>
}

function CardLogoWash({ issuer }) {
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
  if (issuer.logoKind === 'microsoft') {
    return (
      <span className={styles.cardLogoWashSvg}>
        <MicrosoftLogo size={280} />
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
  return <span className={styles.cardLogoWashMark}>{issuer.mark}</span>
}

/** Evenly place `count` points along a right-opening arc. */
function placeOnArc(count, radius, { cx, cy, startDeg, endDeg }) {
  if (count <= 0) return []
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const deg = startDeg + (endDeg - startDeg) * t
    const rad = (deg * Math.PI) / 180
    return {
      x: cx + Math.cos(rad) * radius,
      y: cy + Math.sin(rad) * radius,
      deg,
    }
  })
}

/**
 * Fixed-board constellation layout.
 * ≤6 issuers → single outer arc
 * 7+ issuers → outer + inner rings (board size stays constant — no vertical congestion)
 */
export function layoutConstellation(count, board = CONSTELLATION) {
  const { width, height, cx, cy, startDeg, endDeg, outerR, innerR, dualAt } = board
  const dual = count >= dualAt
  const outerCount = dual ? Math.ceil(count * 0.58) : count
  const innerCount = dual ? count - outerCount : 0

  const outer = placeOnArc(outerCount, outerR, { cx, cy, startDeg, endDeg }).map((p) => ({
    ...p,
    ring: 'outer',
  }))
  const inner = placeOnArc(innerCount, innerR, { cx, cy, startDeg, endDeg }).map((p) => ({
    ...p,
    ring: 'inner',
  }))

  // Interleave visually: outer first (top→bottom), then inner — assign in order of items
  const slots = [...outer, ...inner]
  const nodeR = Math.max(5.5, 8.5 - Math.max(0, count - 5) * 0.35)

  return {
    width,
    height,
    cx,
    cy,
    outerR,
    innerR,
    dual,
    nodeR,
    compact: count >= dualAt,
    slots,
    arcPath: describeArc(cx, cy, outerR, startDeg, endDeg),
    innerArcPath: dual ? describeArc(cx, cy, innerR, startDeg, endDeg) : null,
  }
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

function IssuerConstellation({ items, activeId, onSelect }) {
  const layout = useMemo(() => layoutConstellation(items.length), [items.length])

  return (
    <div
      className={`${styles.constellation} ${layout.compact ? styles.constellationCompact : ''}`}
      style={{ width: layout.width, height: layout.height }}
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
        {/* soft hub */}
        <circle className={styles.constellationHub} cx={layout.cx} cy={layout.cy} r="3.5" />
      </svg>

      <ul className={styles.constellationList}>
        {items.map((item, index) => {
          const slot = layout.slots[index]
          if (!slot) return null
          const isActive = activeId === item.id
          const shortName = layout.compact && item.name.includes(' ')
            ? item.name.split(' ')[0]
            : item.name

          return (
            <li
              key={item.id}
              className={styles.constellationItem}
              style={{
                left: slot.x,
                top: slot.y,
                '--node-r': `${layout.nodeR}px`,
              }}
            >
              <button
                type="button"
                className={`${styles.constellationBtn} ${isActive ? styles.constellationBtnActive : ''}`}
                aria-pressed={isActive}
                aria-label={`${item.name}, ${item.meta}`}
                title={`${item.name} · ${item.meta}`}
                onClick={() => onSelect(item.id)}
              >
                <span className={styles.constellationDot} aria-hidden="true" />
                <span className={styles.constellationText}>
                  <span className={styles.constellationName}>{shortName}</span>
                  {!layout.compact && (
                    <span className={styles.constellationMeta}>{item.meta}</span>
                  )}
                </span>
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

  const navItems = useMemo(
    () => [
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
    ],
    []
  )

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
