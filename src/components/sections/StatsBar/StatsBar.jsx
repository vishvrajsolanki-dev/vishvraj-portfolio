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

const MAX_PRESS = 9
const PRESS_THRESHOLD = 3

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
  const pinRef = useRef(null)
  const countTweens = useRef([])
  const pinTweens = useRef([])
  const hasAutoPlayed = useRef(false)
  const spinningRef = useRef(false)
  const dragRef = useRef({
    active: false,
    startY: 0,
    depth: 0,
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

  const setPinDepth = (px) => {
    const pin = pinRef.current
    if (!pin) return
    gsap.set(pin, { y: px })
  }

  const springHome = () => {
    const pin = pinRef.current
    if (!pin) return
    const tween = gsap.to(pin, {
      y: 0,
      duration: 0.28,
      ease: 'power3.out',
    })
    pinTweens.current.push(tween)
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

  const triggerPress = useCallback((fromDepth = 0) => {
    if (spinningRef.current) return

    const pin = pinRef.current

    // Count-up starts immediately — pin motion is parallel feedback
    runCountUp()

    pinTweens.current.forEach((t) => t?.kill?.())
    pinTweens.current = []

    const tl = gsap.timeline()
    if (fromDepth < MAX_PRESS - 1) {
      tl.to(pin, {
        y: MAX_PRESS,
        duration: 0.1,
        ease: 'power2.in',
      })
    }
    tl.to(pin, {
      y: 0,
      duration: 0.32,
      ease: 'power3.out',
    })
    pinTweens.current.push(tl)
  }, [runCountUp])

  const onPointerDown = (e) => {
    if (spinningRef.current) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = {
      active: true,
      startY: e.clientY,
      depth: 0,
      moved: false,
      pointerId: e.pointerId,
    }
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d.active || spinningRef.current) return
    const dy = e.clientY - d.startY
    if (Math.abs(dy) > 2) d.moved = true
    const depth = Math.max(0, Math.min(MAX_PRESS, dy * 0.45))
    d.depth = depth
    setPinDepth(depth)
  }

  const finishGesture = useCallback(() => {
    const d = dragRef.current
    if (!d.active) return
    d.active = false

    if (spinningRef.current) {
      springHome()
      return
    }

    // Tap or press past threshold → replay
    if (!d.moved || d.depth >= PRESS_THRESHOLD) {
      triggerPress(d.depth)
    } else {
      springHome()
    }
  }, [triggerPress])

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

    gsap.set(pinRef.current, { y: 0 })

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
      pinTweens.current.forEach((t) => t?.kill?.())
      pinTweens.current = []
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

        <button
          type="button"
          className={`${styles.pin} ${spinning ? styles.pinBusy : ''}`}
          tabIndex={spinning ? -1 : 0}
          aria-label={spinning ? 'Counting in progress' : 'Press reset pin to replay count-up'}
          aria-disabled={spinning}
          disabled={spinning}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              triggerPress(0)
            }
          }}
        >
          <span className={styles.pinPlate} aria-hidden="true">
            <span className={styles.pinCollar}>
              <span className={styles.pinWell}>
                <span className={styles.pinPlunger} ref={pinRef}>
                  <span className={styles.pinFace} />
                </span>
              </span>
            </span>
          </span>
          <span className={styles.pinCaption} aria-hidden="true">RST</span>
        </button>
      </div>
    </section>
  )
}
