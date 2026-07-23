import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../../data/education'
import DuringCollege from './DuringCollege'
import styles from './Education.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Swap to a real campus photo path when available, e.g. '/photos/adit-campus.jpg'.
 * When set (or education.campusPhotoSrc is set), the placeholder badge is not
 * rendered at all — one-line removal.
 */
const CAMPUS_PHOTO_SRC = education.campusPhotoSrc

function CampusPhotoPlaceholder() {
  return (
    <div className={styles.photoPlaceholder}>
      <div className={styles.placeholderBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5.5-5.5L9 17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className={styles.placeholderLabel}>
        <span>Campus photo</span>
        <span>Placeholder</span>
      </p>
    </div>
  )
}

export default function Education() {
  const sectionRef = useRef(null)

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
      section.querySelector(`.${styles.eduCard}`),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
      '-=0.2'
    )

    tl.fromTo(
      section.querySelector(`.${styles.divider}`),
      { opacity: 0, scaleX: 0.6 },
      { opacity: 1, scaleX: 1, duration: 0.45, ease: 'power2.out' },
      '-=0.35'
    )
  }, { scope: sectionRef })

  return (
    <section className={styles.section} id="education" ref={sectionRef}>
      <span className={styles.sectionLabel}>06 — Education</span>

      {/* Education photo panel */}
      <div className={styles.eduCard}>
        {CAMPUS_PHOTO_SRC ? (
          <img
            src={CAMPUS_PHOTO_SRC}
            alt="A D Patel Institute of Technology campus"
            className={styles.eduPhoto}
          />
        ) : (
          <CampusPhotoPlaceholder />
        )}
        <div className={styles.eduScrim} aria-hidden="true" />
        <div className={styles.eduOverlay}>
          <h2 className={styles.eduDegree}>{education.degree}</h2>
          <p className={styles.eduSchool}>{education.institution}</p>
          <p className={styles.eduDates}>{education.dates}</p>
        </div>
      </div>

      <div className={styles.divider} />

      <DuringCollege />
    </section>
  )
}
