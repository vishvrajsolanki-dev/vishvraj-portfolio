import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../../data/education'
import DuringCollege from './DuringCollege'
import styles from './Education.module.css'

gsap.registerPlugin(ScrollTrigger)

/** One-line swap: set education.campusPhotoSrc — placeholder removed entirely when set. */
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
        <span>Campus visual</span>
        <span>Placeholder</span>
      </p>
    </div>
  )
}

function GradCapIcon() {
  return (
    <svg className={styles.headerIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5L2 9z" strokeLinejoin="round" />
      <path d="M6 11.5v4.5c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" />
      <path d="M22 9v6" strokeLinecap="round" />
    </svg>
  )
}

export default function Education() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    })

    tl.fromTo(
      section.querySelector(`.${styles.sectionHeader}`),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )

    tl.fromTo(
      section.querySelector(`.${styles.eduCard}`),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
      '-=0.2'
    )
  }, { scope: sectionRef })

  return (
    <section className={styles.section} id="education" ref={sectionRef}>
      {/* Reference-style header: icon + label + line + end dot */}
      <div className={styles.sectionHeader}>
        <GradCapIcon />
        <span className={styles.sectionTitle}>Education</span>
        <span className={styles.headerRule} aria-hidden="true" />
        <span className={styles.headerDot} aria-hidden="true" />
      </div>

      {/* Card: photo plane on top + solid info bar below */}
      <article className={styles.eduCard}>
        <div className={styles.visualPlane}>
          {CAMPUS_PHOTO_SRC ? (
            <img
              src={CAMPUS_PHOTO_SRC}
              alt="A D Patel Institute of Technology campus"
              className={styles.eduPhoto}
            />
          ) : (
            <CampusPhotoPlaceholder />
          )}
          {/* Scrim only blends photo into the info bar — top stays clear */}
          <div className={styles.eduScrim} aria-hidden="true" />
        </div>

        <div className={styles.infoBar}>
          <div className={styles.crestCol}>
            <img
              src={education.crestSrc}
              alt=""
              className={styles.crest}
            />
            <span className={styles.crestDivider} aria-hidden="true" />
          </div>

          <div className={styles.infoMain}>
            <h2 className={styles.eduDegree}>{education.degree}</h2>
            <p className={styles.eduUniversity}>{education.university}</p>
            <p className={styles.eduMeta}>
              <span className={styles.metaItem}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
                  <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" strokeLinecap="round" />
                </svg>
                {education.dates}
              </span>
              <span className={styles.metaPipe} aria-hidden="true">|</span>
              <span className={styles.metaItem}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M8 14s4.5-3.6 4.5-7A4.5 4.5 0 008 2.5 4.5 4.5 0 003.5 7c0 3.4 4.5 7 4.5 7z" />
                  <circle cx="8" cy="7" r="1.4" />
                </svg>
                {education.location}
              </span>
            </p>
            <p className={styles.eduSchool}>{education.school}</p>
          </div>
        </div>
      </article>

      <DuringCollege />
    </section>
  )
}
