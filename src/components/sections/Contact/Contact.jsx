import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'vishvrajsolanki0207@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/vishvrajsinh-solanki-1396ab37a/'
const GITHUB_URL = 'https://github.com/vishvrajsolanki-dev'
const INSTAGRAM_URL = 'https://instagram.com/vishvrajsinh_solanki'
const RESUME_URL = 'https://drive.google.com/file/d/1vH0gETTidsGGQk5npUYWETKgLSawnOBz/view?usp=sharing'

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

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function BlueprintArt() {
  return (
    <svg className={styles.blueprintSvg} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="#3a6a9a" strokeOpacity="0.45" strokeWidth="1.1">
        <circle cx="180" cy="150" r="58" />
        <circle cx="180" cy="150" r="30" strokeDasharray="4 5" />
        <path d="M180 78v22M180 200v22M108 150h22M230 150h22" />
        <line x1="120" y1="230" x2="240" y2="230" />
        <text x="132" y="252" fill="#3a6a9a" fillOpacity="0.5" stroke="none" fontSize="13" fontFamily="monospace">DETAIL A · Ø54</text>

        <rect x="820" y="70" width="260" height="150" />
        <path d="M845 105h210M845 140h160M845 175h190" />
        <circle cx="980" cy="145" r="22" />
        <text x="845" y="248" fill="#3a6a9a" fillOpacity="0.5" stroke="none" fontSize="13" fontFamily="monospace">ISO VIEW · 2.50</text>

        <path d="M90 480h280v170H90z" />
        <path d="M125 520h210M125 565h170M125 610h195" strokeDasharray="3 4" />
        <text x="90" y="680" fill="#3a6a9a" fillOpacity="0.5" stroke="none" fontSize="13" fontFamily="monospace">24.00</text>

        <path d="M640 460l200-48 68 135-200 48z" />
        <circle cx="780" cy="520" r="20" />
        <path d="M760 520h40M780 500v40" />
        <text x="640" y="620" fill="#3a6a9a" fillOpacity="0.5" stroke="none" fontSize="13" fontFamily="monospace">FRONT · 650</text>

        <path d="M480 100v80M460 140h40" strokeDasharray="2 3" />
        <text x="500" y="120" fill="#3a6a9a" fillOpacity="0.4" stroke="none" fontSize="12" fontFamily="monospace">REF 01</text>
      </g>
    </svg>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const floats = gsap.utils.toArray(section.querySelectorAll(`.${styles.float}`))
    const plateFloat = section.querySelector(`.${styles.floatPlate}`)
    const tapeFloat = section.querySelector(`.${styles.floatTape}`)

    // GSAP owns wrapper transforms so drift doesn't fight CSS translate
    gsap.set(plateFloat, { xPercent: -52, yPercent: -52 })
    gsap.set(tapeFloat, { xPercent: -18 })

    if (!reduced) {
      const enter = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          once: true,
        },
      })

      enter
        .from(section.querySelector(`.${styles.eyebrow}`), {
          opacity: 0,
          y: 8,
          duration: 0.35,
          ease: 'power2.out',
        })
        .from(section.querySelector(`.${styles.floatPlate}`), {
          y: 36,
          opacity: 0.35,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=0.1')
        .from(
          [
            section.querySelector(`.${styles.floatSd}`),
            section.querySelector(`.${styles.floatTape}`),
            section.querySelector(`.${styles.floatGh}`),
            section.querySelector(`.${styles.floatIg}`),
          ],
          {
            opacity: 0,
            y: 22,
            stagger: 0.09,
            duration: 0.55,
            ease: 'power2.out',
          },
          '-=0.45',
        )
        .from(
          [
            section.querySelector(`.${styles.floatRuler}`),
            section.querySelector(`.${styles.floatJig}`),
            section.querySelector(`.${styles.floatPen}`),
          ],
          {
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power1.out',
          },
          '-=0.5',
        )
    }

    if (reduced) return

    // Continuous 10s desk drift (delayed so enter animation can settle)
    floats.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1
      gsap.to(el, {
        x: `+=${dir * (8 + (i % 4) * 3)}`,
        y: `+=${-dir * (6 + (i % 3) * 2)}`,
        duration: 10,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2 + i * 0.35,
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
      <div className={styles.blueprint} aria-hidden="true">
        <div className={styles.grid} />
        <BlueprintArt />
      </div>

      <p className={styles.eyebrow} id="contact-heading">
        <span>11 — Contact</span>
        <span className={styles.eyebrowLine} aria-hidden="true" />
      </p>

      <div className={styles.desk}>
        <div className={`${styles.float} ${styles.floatRuler}`} aria-hidden="true">
          <div className={styles.ruler}>
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} />
            ))}
            <span className={styles.rulerLabel}>INOX</span>
          </div>
        </div>
        <div className={`${styles.float} ${styles.floatJig}`} aria-hidden="true">
          <div className={styles.jig} />
        </div>
        <div className={`${styles.float} ${styles.floatPen}`} aria-hidden="true">
          <div className={styles.pen} />
        </div>

        <div className={`${styles.float} ${styles.floatPlate}`}>
          <article className={styles.plate} aria-label="Contact card">
            <span className={styles.plateNotchBL} aria-hidden="true" />
            <span className={styles.plateNotchBR} aria-hidden="true" />
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
        </div>

        <div className={`${styles.float} ${styles.floatSd}`}>
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
                <span>128MB</span>
              </div>
            </div>
          </a>
        </div>

        <div className={`${styles.float} ${styles.floatTape}`}>
          <a
            className={styles.tape}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <span className={styles.tapeIcon}>in</span>
            <span>linkedin.com/in/vishvrajsinh-solanki</span>
          </a>
        </div>

        <div className={`${styles.float} ${styles.floatGh}`}>
          <a
            className={styles.ghChip}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GitHubMark />
            <span>github.com/vishvrajsolanki-dev</span>
          </a>
        </div>

        <div className={`${styles.float} ${styles.floatIg}`}>
          <a
            className={styles.igTag}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profile"
          >
            @vishvrajsinh_solanki
          </a>
        </div>
      </div>
    </section>
  )
}
