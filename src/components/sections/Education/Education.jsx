import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Education.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Swap to a real campus photo path when available, e.g. '/photos/adit-campus.jpg'.
 * When set, the placeholder badge is not rendered at all (one-line removal).
 */
const CAMPUS_PHOTO_SRC = null

const collegeCards = [
  {
    year: '2026',
    title: 'SSIP Grant — Under Review',
    org: 'State Innovation & Startup Policy Cell',
    detail: 'TrackBot AGV selected for state-level recognition. Funding evaluation in progress.',
    logo: '/logos/ssip.png',
  },
  {
    year: 'June 2026',
    title: 'ML Internship — CodeAlpha',
    org: 'CodeAlpha · Remote',
    detail: 'Built LetterLens, a CNN digit classifier on MNIST (99.52% accuracy), and a Random Forest heart disease risk predictor (AUC 0.96).',
    logo: '/logos/codealpha.png',
  },
  {
    year: 'May 2026',
    title: 'ML Internship — CodSoft',
    org: 'CodSoft · Remote',
    detail: 'Shipped 3 deployed ML apps — PlotSense movie genre classifier, an XGBoost fraud detector (ROC-AUC 0.98), and a bank churn predictor.',
    logo: '/logos/codsoft.png',
  },
  {
    year: 'Feb – Apr 2026',
    title: 'AI & DS Internship — My Job Grow × IIT Hyderabad',
    org: 'My Job Grow · in association with IIT Hyderabad',
    detail: 'Completed a 2-month hybrid AI fundamentals program — Python, prompt engineering, and generative AI — recognized as a model intern for fast grasp of concepts and consistent quality across assignments.',
    logo: '/logos/iith.png',
  },
  {
    year: '2026',
    title: 'CVM Hackathon Finalist',
    org: 'CVM University · held at ADIT',
    detail: 'Represented TrackBot AGV at the university-level hackathon. Reached finals.',
    logo: '/logos/adit.png',
  },
]

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
      section.querySelectorAll(`.${styles.card}`),
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' },
      '-=0.3'
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
          <h2 className={styles.eduDegree}>B.Tech — AI & Data Science</h2>
          <p className={styles.eduSchool}>
            A D Patel Institute of Technology · CVM University · Anand, Gujarat
          </p>
          <p className={styles.eduDates}>2025 — 2029</p>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.colLabel}>During College</p>
      <div className={styles.cardTrack}>
        {collegeCards.map((c, i) => (
          <div key={c.title} className={styles.card}>
            <div className={styles.cardHeader}>
              {c.logo && <img src={c.logo} alt="" className={styles.cardLogo} />}
              <div className={styles.cardHeaderText}>
                <span className={styles.cardYear}>{c.year}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
              </div>
            </div>
            <p className={styles.cardOrg}>{c.org}</p>
            <p className={styles.cardDetail}>{c.detail}</p>
            <span className={styles.cardIndex}>0{i + 1}</span>
          </div>
        ))}
      </div>
      <p className={styles.dragHint}>drag to explore →</p>
    </section>
  )
}
