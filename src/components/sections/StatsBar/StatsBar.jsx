import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './StatsBar.module.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { countTo: 3, suffix: '', label: 'Internships', focus: false },
  { countTo: 9, suffix: '', label: 'Certifications\nEarned', focus: false },
  { countTo: 6, suffix: '', label: 'ML Systems\nShipped', focus: true },
  { countTo: 99, suffix: '%', label: 'CNN accuracy\non MNIST', focus: false },
  { countTo: 1, suffix: '', label: 'Recognised by\nSSIP', focus: false },
]

const MAX_PULL = 95
const PULL_THRESHOLD = 32
const armVars = { transformOrigin: '50% 100%' }

/** Low targets linger; high targets scramble through faster. */
const durationFor = (n) => {
  if (n <= 1) return 1.95
  if (n <= 2) return 1.75
  if (n <= 5) return 1.35
  if (n < 50) return 1.05
  return 0.78
}

export default function StatsBar() {
  const sectionRef = useRef(null)
  const rackRef = useRef(null)
  const shaftRef = useRef(null)
  const countTweens = useRef([])
  const leverTweens = useRef([])
  const hasAutoPlayed = useRef(false)
  const spinningRef = useRef(false)
  const dragRef = useRef({
    active: false,
    startY: 0,
    angle: 0,
    moved: false,
    pointerId: null,
  })
  const [spinning, setSpinning] = useState(false)

  const setBusy = (busy) => {
    spinningRef.current = busy
    setSpinning(busy)
  }

  const killCountTweens = () => {
    countTweens.current.forEach((t) => t?.kill?.())
    countTweens.current = []
  }

  const setArmAngle = (deg) => {
    const shaft = shaftRef.current
    if (!shaft) return
    gsap.set(shaft, { rotate: deg, ...armVars })
  }

  const springHome = () => {
    const shaft = shaftRef.current
    if (!shaft) return
    const tween = gsap.to(shaft, {
      rotate: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.5)',
      ...armVars,
    })
    leverTweens.current.push(tween)
  }

  const runCountUp = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    killCountTweens()
    setBusy(true)

    const valueEls = section.querySelectorAll(`.${styles.value}`)
    let remaining = valueEls.length

    valueEls.forEach((el, i) => {
      const stat = stats[i]
      const obj = { val: 0 }
      el.textContent = `0${stat.suffix}`

      const duration = durationFor(stat.countTo)
      // Small ints ease through slowly; big ints race with a soft landing
      const ease = stat.countTo <= 5 ? 'power1.inOut' : 'power2.out'

      const tween = gsap.to(obj, {
        val: stat.countTo,
        duration,
        ease,
        delay: i * 0.03,
        onUpdate() {
          const n = Math.min(stat.countTo, Math.round(obj.val))
          el.textContent = `${n}${stat.suffix}`
        },
        onComplete() {
          el.textContent = `${stat.countTo}${stat.suffix}`
          remaining -= 1
          if (remaining <= 0) setBusy(false)
        },
      })
      countTweens.current.push(tween)
    })
  }, [])

  const triggerPull = useCallback((fromAngle = 0) => {
    if (spinningRef.current) return

    const shaft = shaftRef.current

    // Count-up starts immediately — lever motion runs in parallel
    runCountUp()

    leverTweens.current.forEach((t) => t?.kill?.())
    leverTweens.current = []

    const tl = gsap.timeline()
    if (fromAngle < MAX_PULL - 6) {
      tl.to(shaft, {
        rotate: MAX_PULL,
        duration: 0.18,
        ease: 'power3.in',
        ...armVars,
      })
    }
    tl.to(shaft, {
      rotate: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.5)',
      ...armVars,
    })
    leverTweens.current.push(tl)
  }, [runCountUp])

  const onPointerDown = (e) => {
    if (spinningRef.current) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = {
      active: true,
      startY: e.clientY,
      angle: 0,
      moved: false,
      pointerId: e.pointerId,
    }
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d.active || spinningRef.current) return
    const dy = e.clientY - d.startY
    if (Math.abs(dy) > 3) d.moved = true
    const angle = Math.max(0, Math.min(MAX_PULL, dy * 0.65))
    d.angle = angle
    setArmAngle(angle)
  }

  const finishGesture = useCallback(() => {
    const d = dragRef.current
    if (!d.active) return
    d.active = false

    if (spinningRef.current) {
      springHome()
      return
    }

    if (!d.moved || d.angle >= PULL_THRESHOLD) {
      triggerPull(d.angle)
    } else {
      springHome()
    }
  }, [triggerPull])

  const onPointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture?.(dragRef.current.pointerId)
    } catch {
      /* ignore */
    }
    finishGesture()
  }

  useEffect(() => {
    const onWinUp = () => finishGesture()
    window.addEventListener('pointerup', onWinUp)
    window.addEventListener('pointercancel', onWinUp)
    return () => {
      window.removeEventListener('pointerup', onWinUp)
      window.removeEventListener('pointercancel', onWinUp)
    }
  }, [finishGesture])

  useGSAP(() => {
    const section = sectionRef.current
    const rack = rackRef.current
    if (!section || !rack) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      section.querySelectorAll(`.${styles.value}`).forEach((el, i) => {
        el.textContent = `${stats[i].countTo}${stats[i].suffix}`
      })
      gsap.set(rack, { opacity: 1, y: 0 })
      return
    }

    gsap.set(shaftRef.current, { rotate: 0, ...armVars })

    gsap.fromTo(
      rack,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            if (hasAutoPlayed.current) return
            hasAutoPlayed.current = true
            runCountUp()
          },
        },
      },
    )

    return () => {
      killCountTweens()
      leverTweens.current.forEach((t) => t?.kill?.())
      leverTweens.current = []
    }
  }, { scope: sectionRef, dependencies: [runCountUp] })

  return (
    <section
      className={styles.section}
      ref={sectionRef}
      aria-label="Impact metrics"
    >
      <div className={styles.rack} ref={rackRef}>
        <div className={styles.strip}>
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

        <div
          className={`${styles.handle} ${spinning ? styles.handleBusy : ''}`}
          role="button"
          tabIndex={spinning ? -1 : 0}
          aria-label={spinning ? 'Counting in progress' : 'Pull handle down to replay count-up'}
          aria-disabled={spinning}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              triggerPull(0)
            }
          }}
        >
          <span className={styles.handleMount} aria-hidden="true" />
          <span className={styles.handleShaft} ref={shaftRef} aria-hidden="true">
            <span className={styles.handleRod} />
            <span className={styles.handleKnob} />
          </span>
        </div>
      </div>
    </section>
  )
}
