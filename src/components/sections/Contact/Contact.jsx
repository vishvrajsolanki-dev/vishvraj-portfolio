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
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

function RobotArmIcon() {
  return (
    <svg viewBox="0 0 48 48" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M10 38h28" strokeLinecap="round" />
      <rect x="20" y="8" width="8" height="10" rx="1" />
      <path d="M24 18v8M24 26l10 4M34 30v6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="30" r="2.5" />
      <path d="M24 22h-8l-4 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true,
      },
    })

    tl.from(section.querySelector(`.${styles.kicker}`), {
      opacity: 0,
      y: 14,
      duration: 0.45,
      ease: 'power2.out',
    })

    tl.from(section.querySelector(`.${styles.desk}`), {
      opacity: 0.35,
      y: 28,
      duration: 0.75,
      ease: 'power3.out',
    }, '-=0.15')

    tl.from(section.querySelector(`.${styles.plate}`), {
      y: 18,
      rotate: -1.2,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.45')

    tl.from([
      section.querySelector(`.${styles.sdCard}`),
      section.querySelector(`.${styles.tape}`),
      section.querySelector(`.${styles.chip}`),
    ], {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.35')
  }, { scope: sectionRef })

  return (
    <section
      className={styles.section}
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.kicker}>11 — Contact</span>
          <h2 id="contact-heading" className={styles.heading}>
            <span className={styles.headingLine}>Let's Build</span>
            <span className={styles.headingOutline}>Something.</span>
          </h2>
          <p className={styles.sub}>
            Open to internships, research collaborations, and interesting problems worth solving.
          </p>
        </header>

        <div className={styles.desk} aria-label="Engineering contact desk">
          <div className={styles.blueprint} aria-hidden="true" />
          <div className={styles.ruler} aria-hidden="true" />
          <div className={styles.pen} aria-hidden="true" />

          <article className={styles.plate}>
            <span className={`${styles.screw} ${styles.screwTL}`} aria-hidden="true" />
            <span className={`${styles.screw} ${styles.screwTR}`} aria-hidden="true" />
            <span className={`${styles.screw} ${styles.screwBL}`} aria-hidden="true" />
            <span className={`${styles.screw} ${styles.screwBR}`} aria-hidden="true" />

            <div className={styles.plateTop}>
              <div>
                <p className={styles.plateName}>Vishvrajsinh Solanki</p>
                <p className={styles.plateRole}>ML &amp; Robotics Engineer</p>
              </div>
              <div className={styles.plateMark} aria-hidden="true">
                <span>VS</span>
              </div>
            </div>

            <div className={styles.plateBody}>
              <a className={styles.plateLink} href={`mailto:${EMAIL}`}>
                <MailIcon />
                <span>{EMAIL}</span>
              </a>
              <p className={styles.plateMeta}>
                <PinIcon />
                <span>Gujarat, India · Available globally</span>
              </p>
            </div>

            <div className={styles.plateEtch} aria-hidden="true">
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
            aria-label="Download resume PDF"
          >
            <span className={styles.sdBanner}>Resume</span>
            <span className={styles.sdIcon}>
              <RobotArmIcon />
            </span>
            <span className={styles.sdMeta}>
              <strong>PDF</strong>
              <em>128MB</em>
            </span>
          </a>

          <a
            className={styles.tape}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <LinkedInMark />
            <span>linkedin.com/in/vishvrajsinh-solanki</span>
          </a>

          <a
            className={styles.chip}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GitHubMark />
            <span>github.com/vishvrajsolanki-dev</span>
          </a>

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
