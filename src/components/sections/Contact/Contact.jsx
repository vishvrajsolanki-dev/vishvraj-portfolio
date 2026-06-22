import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const contacts = [
  {
    label: 'EMAIL',
    value: 'vishvrajsolanki0207@gmail.com',
    href: 'mailto:vishvrajsolanki0207@gmail.com',
  },
  {
    label: 'LINKEDIN',
    value: 'vishvrajsinh-solanki',
    href: 'https://linkedin.com/in/vishvrajsinh-solanki',
  },
  {
    label: 'GITHUB',
    value: 'vishvrajsolanki-dev',
    href: 'https://github.com/vishvrajsolanki-dev',
  },
]

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/vishvrajsolanki-dev',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/vishvrajsinh-solanki',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:vishvrajsolanki0207@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/vishvrajsinh_solanki',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.741 0 8.741 0 7.053.072 2.695.272.273 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

// TODO: Replace with real Google Drive resume link
const RESUME_URL = '[RESUME_LINK_PLACEHOLDER]'

export default function Contact() {
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
      section.querySelector(`.${styles.heading}`),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.2'
    )

    tl.fromTo(
      section.querySelector(`.${styles.sub}`),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )

    tl.fromTo(
      section.querySelector(`.${styles.socialRow}`),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )

    // Contact rows stagger
    tl.fromTo(
      section.querySelectorAll(`.${styles.contactRow}`),
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    )
  }, { scope: sectionRef })

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>
      <span className={styles.sectionLabel}>11 — Contact</span>

      <div className={styles.inner}>
        {/* Left: heading */}
        <div className={styles.left}>
          <h2 className={styles.heading}>
            <span className={styles.headingLine}>Let's Build</span>
            <span className={styles.headingOutline}>Something.</span>
          </h2>
          <p className={styles.sub}>
            Open to internships, research collaborations,<br />
            and interesting problems worth solving.
          </p>

          {/* Social icon row */}
          <div className={styles.socialRow}>
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={styles.socialIcon}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right: contact links */}
        <div className={styles.right}>
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactRow}
            >
              <span className={styles.contactLabel}>{c.label}</span>
              <span className={styles.contactValue}>{c.value}</span>
              <span className={styles.arrow}>↗</span>
            </a>
          ))}

          {/* Resume download — replace RESUME_URL when ready */}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            <span className={styles.contactLabel}>RESUME</span>
            <span className={styles.contactValue}>Download CV</span>
            <span className={styles.arrow}>↓</span>
          </a>
        </div>
      </div>

      <p className={styles.footer}>Based in Gujarat, India — Available globally</p>
    </section>
  )
}
