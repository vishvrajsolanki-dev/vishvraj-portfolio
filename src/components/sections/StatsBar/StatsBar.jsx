import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './StatsBar.module.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { countTo: 1, value: 1, suffix: '', label: 'AI & Data Science\nInternship' },
  { countTo: 5, suffix: '', label: 'Production Apps\nDeployed' },
  { countTo: 2, value: 2, suffix: '', label: 'ML\nInternships' },
  { countTo: 99, suffix: '%', label: 'CNN accuracy\non MNIST' },
  { countTo: 1, value: 1, suffix: '', label: 'Recognised by\nSSIP' },
]

export default function StatsBar() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const valueEls = section.querySelectorAll(`.${styles.value}`)

    // Strip slides up
    gsap.fromTo(
      section.querySelector(`.${styles.strip}`),
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 90%', once: true },
      }
    )

    // Count-up per .value element
    valueEls.forEach((el, i) => {
      const stat = stats[i]
      const obj = { val: 0 }

      gsap.to(obj, {
        val: stat.countTo,
        duration: 1.6,
        ease: 'power2.out',
        delay: i * 0.08,
        onUpdate() {
          el.textContent = Math.round(obj.val) + stat.suffix
        },
        scrollTrigger: { trigger: section, start: 'top 90%', once: true },
      })
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.strip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>0{s.suffix}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}