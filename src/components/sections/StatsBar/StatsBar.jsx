import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './StatsBar.module.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { countTo: 1, suffix: '', label: 'AI & Data Science\nInternship', focus: false },
  { countTo: 5, suffix: '', label: 'Production Apps\nDeployed', focus: false },
  { countTo: 2, suffix: '', label: 'ML\nInternships', focus: true },
  { countTo: 99, suffix: '%', label: 'CNN accuracy\non MNIST', focus: false },
  { countTo: 1, suffix: '', label: 'Recognised by\nSSIP', focus: false },
]

export default function StatsBar() {
  const sectionRef = useRef(null)
  const stripRef = useRef(null)
  const leverArmRef = useRef(null)
  const tweenRefs = useRef([])
  const hasAutoPlayed = useRef(false)
  const [spinning, setSpinning] = useState(false)

  const killTweens = () => {
    tweenRefs.current.forEach((t) => t?.kill?.())
    tweenRefs.current = []
  }

  const runCountUp = useCallback((fromZero = true) => {
    const section = sectionRef.current
    if (!section) return

    killTweens()
    setSpinning(true)

    const valueEls = section.querySelectorAll(`.${styles.value}`)
    let remaining = valueEls.length

    valueEls.forEach((el, i) => {
      const stat = stats[i]
      if (fromZero) el.textContent = `0${stat.suffix}`

      const obj = { val: fromZero ? 0 : Number.parseInt(el.textContent, 10) || 0 }

      const tween = gsap.to(obj, {
        val: stat.countTo,
        duration: 1.7,
        ease: 'power2.out',
        delay: i * 0.1,
        onUpdate() {
          el.textContent = `${Math.round(obj.val)}${stat.suffix}`
        },
        onComplete() {
          el.textContent = `${stat.countTo}${stat.suffix}`
          remaining -= 1
          if (remaining <= 0) setSpinning(false)
        },
      })
      tweenRefs.current.push(tween)
    })
  }, [])

  const pullLever = useCallback(() => {
    if (spinning) return
    const arm = leverArmRef.current
    if (!arm) return

    setSpinning(true)

    const tl = gsap.timeline({
      onComplete: () => {
        runCountUp(true)
      },
    })

    tl.to(arm, {
      rotate: 48,
      duration: 0.28,
      ease: 'power3.in',
      transformOrigin: '50% 12%',
    })
      .to(arm, {
        rotate: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.55)',
        transformOrigin: '50% 12%',
      })

    // Reset digits immediately on pull
    const section = sectionRef.current
    section?.querySelectorAll(`.${styles.value}`).forEach((el, i) => {
      el.textContent = `0${stats[i].suffix}`
    })

    tweenRefs.current.push(tl)
  }, [spinning, runCountUp])

  useGSAP(() => {
    const section = sectionRef.current
    const strip = stripRef.current
    if (!section || !strip) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      section.querySelectorAll(`.${styles.value}`).forEach((el, i) => {
        el.textContent = `${stats[i].countTo}${stats[i].suffix}`
      })
      gsap.set(strip, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      strip,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            if (hasAutoPlayed.current) return
            hasAutoPlayed.current = true
            runCountUp(true)
          },
        },
      },
    )

    return () => killTweens()
  }, { scope: sectionRef, dependencies: [runCountUp] })

  return (
    <section
      className={styles.section}
      ref={sectionRef}
      id="impact"
      aria-label="Impact metrics"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span>01 — Impact</span>
          <span className={styles.eyebrowLine} aria-hidden="true" />
        </p>
        <button
          type="button"
          className={styles.leverBtn}
          onClick={pullLever}
          disabled={spinning}
          aria-label={spinning ? 'Counting in progress' : 'Pull lever to replay count-up'}
          title="Pull to replay"
        >
          <span className={styles.leverHint}>{spinning ? 'Spinning' : 'Replay'}</span>
          <span className={styles.leverBody} aria-hidden="true">
            <span className={styles.leverBase} />
            <span className={styles.leverArm} ref={leverArmRef}>
              <span className={styles.leverKnob} />
            </span>
          </span>
        </button>
      </div>

      <div className={styles.strip} ref={stripRef}>
        {stats.map((s) => (
          <div
            key={s.label}
            className={`${styles.stat} ${s.focus ? styles.statFocus : ''}`}
          >
            <span className={styles.value}>0{s.suffix}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
