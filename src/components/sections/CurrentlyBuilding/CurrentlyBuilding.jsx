import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CurrentlyBuilding.module.css'

gsap.registerPlugin(ScrollTrigger)

const building = [
  {
    title: 'ARC — Adaptive Risk & Clarity Engine',
    desc: 'Monte Carlo + ML + RAG fintech platform for Indian retail investors. Real-time risk profiling, portfolio simulation, and plain-language financial intelligence.',
    stack: ['Monte Carlo', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
    status: 'In Design',
    color: '#7B61FF',
  },
  {
    title: 'LetterLens v2',
    desc: 'Upgrading from MNIST to EMNIST Balanced — 47-class handwritten character recognition with improved CNN architecture and live drawing canvas.',
    stack: ['CNN', 'EMNIST', 'TensorFlow', 'Streamlit'],
    status: 'In Progress',
    color: '#FFB800',
  },
  {
    title: 'TrackBot AGV v2',
    desc: 'Upgrading from ESP32 to ESP32-S3 with mecanum drive, A* pathfinding, RFID navigation, and multi-sensor fusion. SSIP funding push in progress.',
    stack: ['ESP32-S3', 'C++', 'A* Pathfinding', 'RFID', 'FreeRTOS'],
    status: 'Active Build',
    color: '#FF6B35',
  },
]

export default function CurrentlyBuilding() {
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
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    )

    tl.fromTo(
      section.querySelectorAll(`.${styles.card}`),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
      '-=0.2'
    )
  }, { scope: sectionRef })

  return (
    <section className={styles.section} id="currently-building" ref={sectionRef}>
      <span className={styles.sectionLabel}>09 — Currently Building</span>
      <h2 className={styles.heading}>What's Next</h2>
      <div className={styles.grid}>
        {building.map((b) => (
          <div key={b.title} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.pulse} style={{ background: b.color }} />
              <span className={styles.status}>{b.status}</span>
            </div>
            <h3 className={styles.title}>{b.title}</h3>
            <p className={styles.desc}>{b.desc}</p>
            <div className={styles.stack}>
              {b.stack.map((s) => (
                <span key={s} className={styles.tag}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
