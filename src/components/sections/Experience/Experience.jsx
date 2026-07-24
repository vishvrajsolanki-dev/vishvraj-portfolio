import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Experience.module.css'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: 'ssip-trackbot',
    role: 'SSIP Funded Project — TrackBot AGV',
    company: 'SSIP Cell · Gujarat Government',
    logo: '/logos/ssip.png',
    badge: 'Institutionally Funded',
    lorAvailable: false,
    period: '2024 — Present',
    location: 'ADIT, Gujarat',
    employmentType: 'Funded Project',
    about:
      'Building and scaling an RFID-guided autonomous ground vehicle — from hackathon deployment to a dual-core ESP32-S3 platform with pathfinding, multi-sensor fusion, and a live telemetry dashboard.',
    bullets: [
      'Deployed an RFID-guided AGV at CVM Hackathon 2026 (ESP32, PWM motor control, IR line-following, HTTP telemetry); recognized by the SSIP Cell for institutional-funded redevelopment.',
      'Scaling to dual-core ESP32-S3 with mecanum drive, A* pathfinding, multi-sensor fusion (encoder odometry + RFID + MPU6050 IMU), and WebSocket dashboard with sub-50ms latency.',
      'Layered an AI/ML/DS stack on the robot — logged per-run sensor telemetry (Python + SQLite); trained a KNN floor-surface classifier on IR logs; path deviation analysis on planned A* vs encoder paths.',
    ],
    tags: ['ESP32', 'C++', 'Python', 'SQLite', 'KNN', 'A* Pathfinding', 'RFID', 'IMU', 'WebSocket'],
    links: [],
  },
  {
    id: 'iith-intern',
    role: 'AI & Data Science Intern',
    company: 'IIT Hyderabad',
    companySecondary: 'via My Job Grow',
    logo: '/logos/iith.png',
    badge: 'Letter of Recommendation Awarded',
    lorAvailable: true,
    period: 'Feb 2026 — Apr 2026',
    location: 'India (Remote)',
    employmentType: 'Internship',
    about:
      'End-to-end AI pipelines across real-world capstones — supervised learning, clustering, and cloud-based model development on Google Cloud Platform.',
    bullets: [
      'Engineered end-to-end AI pipelines across real-world capstone projects — supervised learning, clustering, and cloud-based model development to extract actionable business insights.',
      'Developed and deployed scalable ML, deep learning, and reinforcement learning models on GCP spanning ingestion, preprocessing, training, evaluation, and production deployment.',
      'Awarded Letter of Recommendation for outstanding AI competence — mastery of AI fundamentals, prompt engineering, and generative AI.',
    ],
    tags: ['Python', 'Pandas', 'scikit-learn', 'Google Cloud AI', 'Generative AI', 'Prompt Engineering', 'Deep Learning'],
    links: [],
  },
  {
    id: 'codsoft-intern',
    role: 'Machine Learning Intern',
    company: 'CodSoft',
    logo: '/logos/codsoft.png',
    badge: 'ISO 9001:2015 · MSME Registered',
    lorAvailable: false,
    period: 'May 2026',
    location: 'Remote',
    employmentType: 'Internship',
    about:
      'Shipped three deployed ML apps in a modular monorepo — NLP genre classification, fraud detection, and bank churn prediction — each with Streamlit UIs on Streamlit Cloud.',
    bullets: [
      'Built PlotSense — NLP genre classifier on 54,214 IMDB plot summaries across 27 classes; TF-IDF + Logistic Regression achieving 60.25% accuracy.',
      'Engineered Credit Card Fraud Detection on 1.29M transactions — SMOTE + XGBoost hit ROC-AUC 0.9771 and 88% fraud recall on 555K test rows.',
      'Built Bank Customer Churn Prediction on 10K profiles — GradientBoostingClassifier with ROC-AUC 0.87 · Accuracy 86.45%; surfaced Age, Balance, and NumOfProducts as top drivers.',
      'All 3 projects follow a 4-script modular architecture (preprocess → train → evaluate → serve) deployed as a monorepo on Streamlit Cloud.',
    ],
    tags: ['Python', 'XGBoost', 'GradientBoosting', 'TF-IDF', 'SMOTE', 'NLTK', 'scikit-learn', 'Streamlit'],
    links: [
      { label: 'GitHub Repo', url: 'https://github.com/vishvrajsolanki-dev/CODSOFT' },
    ],
  },
  {
    id: 'codealpha-intern',
    role: 'Machine Learning Intern',
    company: 'CodeAlpha',
    logo: '/logos/codealpha.png',
    badge: 'MSME Registered',
    lorAvailable: false,
    period: 'Jun 2026',
    location: 'Remote',
    employmentType: 'Internship',
    about:
      'Built and deployed ML apps with explainability — handwritten character recognition, heart disease prediction, and credit scoring — all cold-start pipelines on Streamlit Cloud.',
    bullets: [
      'Built LetterLens — handwritten character recognition on EMNIST Balanced (47 classes); CNN with BatchNorm + Dropout achieving 99% accuracy on MNIST; interactive drawing-canvas prototype for real-time inference.',
      'Built Heart Disease Predictor — 4-model comparative pipeline; Random Forest hit ROC-AUC 0.9637 · Accuracy 86.9% · F1 0.8852.',
      'Built Credit Scoring Model on German Credit Dataset with SHAP explainability and human-readable feature labels; Random Forest won (AUC 0.758).',
      'Deployed all apps on Streamlit Cloud with cold-start pipelines — zero committed model binaries, self-building on fresh deploy.',
    ],
    tags: ['Python', 'Streamlit', 'scikit-learn', 'XGBoost', 'SHAP', 'Random Forest', 'pandas', 'joblib'],
    links: [
      { label: 'LetterLens Repo', url: 'https://github.com/vishvrajsolanki-dev/CodeAlpha_HandwrittenCharacterRecognition' },
      { label: 'Heart Disease Repo', url: 'https://github.com/vishvrajsolanki-dev/CodeAlpha_HeartDiseasePrediction' },
      { label: 'Credit Scoring Repo', url: 'https://github.com/vishvrajsolanki-dev/CodeAlpha_CreditScoringModel' },
    ],
  },
]

function Chevron({ open }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8 14s4.5-3.6 4.5-7A4.5 4.5 0 008 2.5 4.5 4.5 0 003.5 7c0 3.4 4.5 7 4.5 7z" />
      <circle cx="8" cy="7" r="1.4" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="5" width="12" height="9" rx="1.5" />
      <path d="M6 5V3.5A1.5 1.5 0 017.5 2h1A1.5 1.5 0 0110 3.5V5M2 8.5h12" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Sparkline() {
  return (
    <svg className={styles.sparkline} viewBox="0 0 120 36" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="expSpark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
        </linearGradient>
      </defs>
      <path
        d="M2 28 C18 26, 22 20, 34 18 S52 22, 62 14 S82 8, 94 12 S110 6, 118 4"
        stroke="url(#expSpark)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="118" cy="4" r="2.5" fill="rgba(255,255,255,0.85)" />
    </svg>
  )
}

function ExperiencePanel({ exp, open, onToggle }) {
  const panelId = `exp-panel-${exp.id}`
  const headerId = `exp-header-${exp.id}`

  return (
    <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
      <button
        type="button"
        id={headerId}
        className={styles.panelHeader}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <div className={styles.headerLeft}>
          {exp.logo && (
            <img
              src={exp.logo}
              alt=""
              className={styles.logo}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <div className={styles.headerText}>
            <div className={styles.nameRow}>
              <span className={styles.company}>{exp.company}</span>
              {exp.companySecondary && (
                <span className={styles.companySecondary}>{exp.companySecondary}</span>
              )}
            </div>
            <span className={styles.role}>{exp.role}</span>
            <span className={styles.metaLine}>
              <span className={styles.metaItem}>
                <CalendarIcon />
                {exp.period}
              </span>
              <span className={styles.metaPipe} aria-hidden="true">
                ·
              </span>
              <span className={styles.metaItem}>
                <PinIcon />
                {exp.location}
              </span>
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          {open && exp.lorAvailable && (
            <span className={styles.lorBadge}>
              <CheckIcon />
              LoR Available
            </span>
          )}
          {!open && exp.badge && (
            <span className={styles.collapsedBadge}>{exp.badge}</span>
          )}
          <Chevron open={open} />
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={`${styles.panelBody} ${open ? styles.panelBodyOpen : ''}`}
        hidden={!open}
      >
        <div className={styles.bodyGrid}>
          {/* Col 1 — About the Role */}
          <div className={styles.col}>
            <h4 className={styles.colLabel}>About the Role</h4>
            <p className={styles.about}>{exp.about}</p>
            <div className={styles.tags}>
              {exp.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Key Achievements */}
          <div className={styles.col}>
            <h4 className={styles.colLabel}>Key Achievements</h4>
            <ul className={styles.bullets}>
              {exp.bullets.map((bullet) => (
                <li key={bullet.slice(0, 48)} className={styles.bullet}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Metadata */}
          <div className={`${styles.col} ${styles.metaCol}`}>
            <h4 className={styles.colLabel}>Details</h4>
            <ul className={styles.detailList}>
              <li className={styles.detailItem}>
                <BriefcaseIcon />
                <div>
                  <span className={styles.detailKey}>Employment</span>
                  <span className={styles.detailVal}>{exp.employmentType}</span>
                </div>
              </li>
              <li className={styles.detailItem}>
                <CalendarIcon />
                <div>
                  <span className={styles.detailKey}>Period</span>
                  <span className={styles.detailVal}>{exp.period}</span>
                </div>
              </li>
              <li className={styles.detailItem}>
                <PinIcon />
                <div>
                  <span className={styles.detailKey}>Location</span>
                  <span className={styles.detailVal}>{exp.location}</span>
                </div>
              </li>
              {exp.lorAvailable && (
                <li className={styles.detailItem}>
                  <CheckIcon />
                  <div>
                    <span className={styles.detailKey}>Recommendation</span>
                    <span className={styles.detailVal}>Letter of Recommendation</span>
                  </div>
                </li>
              )}
            </ul>

            {exp.links.length > 0 && (
              <div className={styles.links}>
                {exp.links.map((link) =>
                  link.url.includes('PLACEHOLDER') ? null : (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {link.label}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="M2 8L8 2M8 2H3M8 2V7"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const sectionRef = useRef(null)
  const [openId, setOpenId] = useState(experiences[0]?.id ?? null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      section.querySelector(`.${styles.header}`),
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      }
    )

    gsap.fromTo(
      section.querySelectorAll(`.${styles.panel}`),
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: section.querySelector(`.${styles.stack}`), start: 'top 85%', once: true },
      }
    )
  }, { scope: sectionRef })

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className={styles.experience} id="experience" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.label}>02 — Experience</span>
            <h2 className={styles.title}>Where I&apos;ve Built</h2>
            <p className={styles.subtitle}>
              Roles, internships, and funded work — expand a panel for the full story.
            </p>
          </div>

          <aside className={styles.summaryCard} aria-label="Experience summary">
            <div className={styles.summaryText}>
              <span className={styles.summaryValue}>{experiences.length}</span>
              <span className={styles.summaryLabel}>Roles & engagements</span>
            </div>
            <Sparkline />
          </aside>
        </div>

        <div className={styles.stack}>
          {experiences.map((exp) => (
            <ExperiencePanel
              key={exp.id}
              exp={exp}
              open={openId === exp.id}
              onToggle={() => toggle(exp.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
