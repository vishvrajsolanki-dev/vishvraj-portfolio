import { useRef, useState, useCallback, useEffect } from 'react'
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

/** Degrees from upright (0) toward pulled-down */
const MAX_PULL = 95
const PULL_THRESHOLD = 32

export default function StatsBar() {
  const sectionRef = useRef(null)
  const rackRef = useRef(null)
  const shaftRef = useRef(null)
  const tweenRefs = useRef([])
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

  const killTweens = () => {
    tweenRefs.current.forEach((t) => t?.kill?.())
    tweenRefs.current = []
  }

  const armVars = { transformOrigin: '50% 100%' }

  const setArmAngle = (deg) => {
    const shaft = shaftRef.current
    if (!shaft) return
    gsap.set(shaft, { rotate: deg, ...armVars })
  }

  const springHome = (onDone) => {
    const shaft = shaftRef.current
    if (!shaft) {
      onDone?.()
      return
    }
    const tween = gsap.to(shaft, {
      rotate: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
      ...armVars,
      onComplete: () => onDone?.(),
    })
    tweenRefs.current.push(tween)
  }

  const runCountUp = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    killTweens()
    setBusy(true)

    const valueEls = section.querySelectorAll(`.${styles.value}`)
    let remaining = valueEls.length

    valueEls.forEach((el, i) => {
      const stat = stats[i]
      el.textContent = `0${stat.suffix}`
      const obj = { val: 0 }

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
          if (remaining <= 0) setBusy(false)
        },
      })
      tweenRefs.current.push(tween)
    })
  }, [])

  const triggerPull = useCallback((fromAngle = 0) => {
    if (spinningRef.current) return
    setBusy(true)

    const section = sectionRef.current
    section?.querySelectorAll(`.${styles.value}`).forEach((el, i) => {
      el.textContent = `0${stats[i].suffix}`
    })

    const shaft = shaftRef.current
    const tl = gsap.timeline({
      onComplete: () => runCountUp(),
    })

    if (fromAngle < MAX_PULL - 6) {
      tl.to(shaft, {
        rotate: MAX_PULL,
        duration: 0.24,
        ease: 'power3.in',
        ...armVars,
      })
    }
    tl.to(shaft, {
      rotate: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.5)',
      ...armVars,
    })

    tweenRefs.current.push(tl)
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
    // Drag down → positive angle (handle tips forward/down)
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
            runCountUp()
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
      </div>

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
