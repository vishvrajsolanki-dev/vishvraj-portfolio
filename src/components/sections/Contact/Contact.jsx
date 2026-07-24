import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'vishvrajsolanki0207@gmail.com'
const RESUME_URL = 'https://drive.google.com/file/d/1vH0gETTidsGGQk5npUYWETKgLSawnOBz/view?usp=sharing'

/** Swap `href: null` → real URL when ready */
const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vishvrajsinh-solanki-1396ab37a/', accent: 'amber' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/vishvrajsolanki-dev' },
  { id: 'x', label: 'X', href: null },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/vishvrajsinh_solanki' },
  { id: 'indeed', label: 'Indeed', href: null },
  { id: 'kaggle', label: 'Kaggle', href: null },
  { id: 'leetcode', label: 'LeetCode', href: null },
]

const CHIP_TILTS = [-5.5, 4.2, -3.8, 5.5, -4.6, 3.4, -5.0]

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

function RobotArmIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 40h32" strokeLinecap="round" />
      <rect x="20" y="6" width="8" height="12" rx="1" />
      <path d="M24 18v10M24 28l12 5M36 33v7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="33" r="2.8" />
      <path d="M24 24H14l-5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SocialMark({ id }) {
  switch (id) {
    case 'linkedin':
      return <span className={styles.markIn}>in</span>
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'indeed':
      return <span className={styles.markLetter}>Id</span>
    case 'kaggle':
      return <span className={styles.markLetter}>Kg</span>
    case 'leetcode':
      return <span className={styles.markLetter}>LC</span>
    default:
      return null
  }
}

function DeskArt() {
  return (
    <svg className={styles.deskArt} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="90" cy="200" r="36" />
        <circle cx="90" cy="200" r="16" strokeDasharray="3 4" />
        <text x="55" y="268" className={styles.artLabel}>DETAIL A</text>

        <rect x="980" y="140" width="140" height="80" />
        <path d="M995 165h110M995 185h80M995 205h95" />
        <text x="980" y="248" className={styles.artLabel}>ISO · 2.50</text>

        <path d="M1050 560h90v70h-90z" strokeDasharray="4 4" />
        <text x="1050" y="660" className={styles.artLabel}>REF 01</text>
      </g>
    </svg>
  )
}

function SocialChip({ item, tilt }) {
  const className = [
    styles.chip,
    item.accent === 'amber' ? styles.chipAmber : '',
    !item.href ? styles.chipPlaceholder : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = { '--tilt': `${tilt}deg` }

  const inner = (
    <>
      <span className={styles.chipMark}>
        <SocialMark id={item.id} />
      </span>
      <span className={styles.chipLabel}>{item.label}</span>
      {!item.href && <span className={styles.chipSoon}>soon</span>}
    </>
  )

  if (!item.href) {
    return (
      <span
        className={className}
        style={style}
        aria-label={`${item.label} — link coming soon`}
        title="Link coming soon"
      >
        {inner}
      </span>
    )
  }

  return (
    <a
      className={className}
      style={style}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
    >
      {inner}
    </a>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const board = section.querySelector(`.${styles.board}`)
    const chips = gsap.utils.toArray(section.querySelectorAll(`.${styles.chip}`))
    const props = gsap.utils.toArray(section.querySelectorAll(`.${styles.prop}`))

    const enter = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        once: true,
      },
    })

    enter
      .from(section.querySelector(`.${styles.topBar}`), {
        opacity: 0,
        y: 10,
        duration: 0.35,
        ease: 'power2.out',
      })
      .from(board, {
        y: 26,
        opacity: 0.35,
        duration: 0.85,
        ease: 'power3.out',
      }, '-=0.1')
      .from(chips, {
        opacity: 0,
        x: 14,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.45')
      .from(props, {
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power1.out',
      }, '-=0.3')

    gsap.to(board, {
      y: '+=6',
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.1,
    })

    chips.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1
      gsap.to(el, {
        y: `+=${dir * (4 + (i % 3))}`,
        duration: 10,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.15 + i * 0.15,
      })
    })
  }, { scope: sectionRef })

  return (
    <section
      className={styles.section}
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.grid} />
        <DeskArt />
        <div className={styles.glow} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.topBar}>
        <h2 className={styles.eyebrow} id="contact-heading">
          <span>11 — Contact</span>
          <span className={styles.eyebrowLine} aria-hidden="true" />
        </h2>
        <p className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Available globally
        </p>
      </div>

      <div className={styles.desk}>
        <div className={`${styles.prop} ${styles.propRuler}`} aria-hidden="true">
          <div className={styles.ruler}>
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} />
            ))}
            <em>INOX</em>
          </div>
        </div>
        <div className={`${styles.prop} ${styles.propJig}`} aria-hidden="true">
          <div className={styles.jig} />
        </div>

        {/* One centered composition — plate + spine locked together */}
        <div className={styles.board}>
          <div className={styles.boardCore}>
            <div className={styles.cluster}>
              <article className={styles.plate} aria-label="Contact card">
                <span className={`${styles.screw} ${styles.screwTL}`} aria-hidden="true" />
                <span className={`${styles.screw} ${styles.screwTR}`} aria-hidden="true" />
                <span className={`${styles.screw} ${styles.screwBL}`} aria-hidden="true" />
                <span className={`${styles.screw} ${styles.screwBR}`} aria-hidden="true" />

                <div className={styles.plateBody}>
                  <div className={styles.plateTop}>
                    <div>
                      <h2 className={styles.plateName}>Vishvrajsinh Solanki</h2>
                      <p className={styles.plateRole}>ML &amp; Robotics Engineer</p>
                    </div>
                    <div className={styles.monoBadge} aria-hidden="true">VS</div>
                  </div>

                  <div className={styles.plateDivider} aria-hidden="true" />

                  <div className={styles.plateMeta}>
                    <a className={styles.metaLink} href={`mailto:${EMAIL}`}>
                      <MailIcon />
                      <span>{EMAIL}</span>
                    </a>
                    <p className={styles.metaItem}>
                      <PinIcon />
                      <span>Gujarat, India · Available globally</span>
                    </p>
                  </div>
                </div>

                <div className={styles.fins} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </article>

              <a
                className={styles.sdCard}
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume PDF"
              >
                <span className={styles.sdAntenna} aria-hidden="true" />
                <div className={styles.sdBody}>
                  <div className={styles.sdHeader}>RESUME</div>
                  <div className={styles.sdFace}>
                    <RobotArmIcon />
                  </div>
                  <div className={styles.sdFooter}>
                    <span>PDF</span>
                  </div>
                </div>
              </a>
            </div>

            <div className={styles.bridge} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <nav className={styles.spine} aria-label="Social profiles">
              <p className={styles.spineLabel}>Profiles</p>
              <div className={styles.spineGrid}>
                {SOCIALS.map((item, i) => (
                  <SocialChip key={item.id} item={item} tilt={CHIP_TILTS[i] ?? 0} />
                ))}
              </div>
            </nav>
          </div>

          <p className={styles.hint}>
            Open to internships, research collaborations, and hard problems.
          </p>
        </div>
      </div>
    </section>
  )
}
