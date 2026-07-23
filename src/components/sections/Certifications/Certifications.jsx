import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Certifications.module.css'

gsap.registerPlugin(ScrollTrigger)

const MicrosoftLogo = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" aria-hidden="true">
    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
    <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
    <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
    <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
  </svg>
)

const issuers = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    fullName: 'Anthropic Academy',
    logoUrl: '/logos/anthropic.png',
    logoAlt: 'Anthropic',
    invertLogo: true,
    mark: 'AI',
  },
  {
    id: 'gcloud',
    name: 'Google Cloud',
    fullName: 'Google Cloud',
    logoUrl: '/logos/gcloud.png',
    logoAlt: 'Google Cloud',
    invertLogo: false,
    mark: 'GC',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    fullName: 'Microsoft',
    logoUrl: null,
    logoSvg: <MicrosoftLogo />,
    logoAlt: 'Microsoft',
    invertLogo: false,
    mark: 'MS',
  },
  {
    id: 'iith',
    name: 'IIT Hyderabad',
    fullName: 'IIT Hyderabad × My Job Grow',
    logoUrl: '/logos/iith.png',
    logoAlt: 'IIT Hyderabad',
    invertLogo: false,
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

function IssuerLogo({ issuer, className }) {
  if (issuer.logoSvg) return <span className={className}>{issuer.logoSvg}</span>
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

export default function Certifications() {
  const sectionRef = useRef(null)
  const [activeIssuerId, setActiveIssuerId] = useState('anthropic')
  const [activeCertId, setActiveCertId] = useState(certifications[0].id)

  const issuerIndex = useMemo(
    () => Object.fromEntries(issuers.map((issuer) => [issuer.id, issuer])),
    []
  )

  const filteredCerts = useMemo(() => {
    if (activeIssuerId === 'all') {
      // One representative cert per issuer for the View All stack
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

  const selectIssuer = (issuerId) => {
    setActiveIssuerId(issuerId)
    if (issuerId === 'all') {
      setActiveCertId(certifications[0].id)
      return
    }
    const first = certifications.find((cert) => cert.issuerId === issuerId)
    if (first) setActiveCertId(first.id)
  }

  const selectCert = (certId) => {
    setActiveCertId(certId)
    const cert = certifications.find((item) => item.id === certId)
    if (cert && activeIssuerId !== 'all' && activeIssuerId !== cert.issuerId) {
      setActiveIssuerId(cert.issuerId)
    }
  }

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    })

    tl.fromTo(
      section.querySelector(`.${styles.sectionLabel}`),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )

    tl.fromTo(
      section.querySelector(`.${styles.stage}`),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.2'
    )
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
            <ul className={styles.issuerList}>
              {issuers.map((issuer) => {
                const isActive = activeIssuerId === issuer.id
                const count = certifications.filter((cert) => cert.issuerId === issuer.id).length
                return (
                  <li key={issuer.id}>
                    <button
                      type="button"
                      className={`${styles.issuerBtn} ${isActive ? styles.issuerBtnActive : ''}`}
                      aria-pressed={isActive}
                      onClick={() => selectIssuer(issuer.id)}
                    >
                      <span className={styles.issuerDot} aria-hidden="true" />
                      <span className={styles.issuerText}>
                        <span className={styles.issuerName}>{issuer.name}</span>
                        <span className={styles.issuerMeta}>{count} cert{count === 1 ? '' : 's'}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  type="button"
                  className={`${styles.issuerBtn} ${activeIssuerId === 'all' ? styles.issuerBtnActive : ''}`}
                  aria-pressed={activeIssuerId === 'all'}
                  onClick={() => selectIssuer('all')}
                >
                  <span className={styles.issuerDot} aria-hidden="true" />
                  <span className={styles.issuerText}>
                    <span className={styles.issuerName}>View All</span>
                    <span className={styles.issuerMeta}>{certifications.length} total</span>
                  </span>
                </button>
              </li>
            </ul>
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
                        aria-label={`Show next credential`}
                        onClick={() => {
                          const next = filteredCerts[(activeIndex + 1) % filteredCerts.length]
                          if (next) selectCert(next.id)
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className={styles.cardHit}
                        aria-label={`Show ${cert.title}`}
                        onClick={() => selectCert(cert.id)}
                      />
                    )}

                    <div className={styles.cardTop}>
                      <div className={styles.cardMark}>
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
