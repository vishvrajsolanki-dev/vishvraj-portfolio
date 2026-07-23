import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import styles from './BeltCarousel.module.css'

const FOCAL = 2
const INACTIVE_W = 190
const ACTIVE_W = 260
const FOCAL_SCALE = 1.3
/** Rail space for scaled active card + breathing room so neighbors never sit under it. */
const ACTIVE_SLOT_W = Math.round(ACTIVE_W * FOCAL_SCALE) + 48 // 338 + 48 = 386
const GAP = 20
const BELT_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'
const BELT_MS = 1300
const DEFAULT_AUTO_MS = 6000

/** Arrange items so `activeId` sits at FOCAL (center). */
function orderCenteredOn(items, activeId, getId) {
  const ids = items.map(getId)
  const idx = Math.max(0, ids.indexOf(activeId))
  const ordered = []
  for (let i = 0; i < ids.length; i++) {
    ordered.push(items[(idx - FOCAL + i + ids.length) % ids.length])
  }
  return ordered
}

/** Rotate array left by n steps (first → end). Continuous loop. */
function rotateLeft(arr, n = 1) {
  const len = arr.length
  const k = ((n % len) + len) % len
  if (k === 0) return arr
  return [...arr.slice(k), ...arr.slice(0, k)]
}

/** Layout width for slot i — FOCAL reserves room for scale(FOCAL_SCALE). */
function slotWidth(index) {
  return index === FOCAL ? ACTIVE_SLOT_W : INACTIVE_W
}

/** Slot x-position for index i; neighbors clear of the scaled active card. */
function slotX(index) {
  let x = 0
  for (let i = 0; i < index; i++) {
    x += slotWidth(i) + GAP
  }
  return x
}

function totalRailWidth(count) {
  if (count <= 0) return 0
  let w = 0
  for (let i = 0; i < count; i++) {
    w += slotWidth(i) + (i < count - 1 ? GAP : 0)
  }
  return w
}

/**
 * Shared continuous-loop belt carousel (Projects / During College).
 */
export default function BeltCarousel({
  items,
  renderCard,
  autoAdvanceMs = DEFAULT_AUTO_MS,
  loop = true,
  getId = (item) => item.id,
  initialActiveId,
  onActiveChange,
  ariaLabel = 'Select item',
  className = '',
  getCardClassName,
  getCardStyle,
  showRail = true,
  showProgress = true,
}) {
  const defaultId = initialActiveId || (items[0] ? getId(items[0]) : null)

  const [beltOrder, setBeltOrder] = useState(() =>
    items.length ? orderCenteredOn(items, defaultId, getId) : []
  )
  const [activeId, setActiveId] = useState(defaultId)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [scaleReady, setScaleReady] = useState(true)
  const [skipTransitionId, setSkipTransitionId] = useState(null)
  const [autoplayEnabled, setAutoplayEnabled] = useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
  )
  const [trackWidth, setTrackWidth] = useState(0)

  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const activeIdRef = useRef(activeId)
  const beltRef = useRef(null)
  const scaleTimer = useRef(null)
  const beltOrderRef = useRef(beltOrder)

  activeIdRef.current = activeId
  beltOrderRef.current = beltOrder

  const useBelt = !isMobile && !reduceMotion.current
  const railW = totalRailWidth(items.length)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileMq = window.matchMedia('(max-width: 768px)')

    const applyMotion = () => {
      reduceMotion.current = motionMq.matches
      setAutoplayEnabled(!motionMq.matches)
      if (motionMq.matches) setScaleReady(true)
    }
    const applyMobile = () => setIsMobile(mobileMq.matches)

    applyMotion()
    applyMobile()
    motionMq.addEventListener('change', applyMotion)
    mobileMq.addEventListener('change', applyMobile)
    return () => {
      motionMq.removeEventListener('change', applyMotion)
      mobileMq.removeEventListener('change', applyMobile)
      if (scaleTimer.current) clearTimeout(scaleTimer.current)
    }
  }, [])

  useEffect(() => {
    const el = beltRef.current
    if (!el) return undefined
    const measure = () => setTrackWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [useBelt, isMobile])

  const railOffset = useMemo(() => {
    if (!trackWidth || !railW) return 0
    return Math.max(0, (trackWidth - railW) / 2)
  }, [trackWidth, railW])

  const notifyActive = useCallback(
    (id) => {
      setActiveId(id)
      onActiveChange?.(id)
    },
    [onActiveChange]
  )

  const scheduleScale = useCallback(() => {
    if (!reduceMotion.current && !isMobile) {
      setScaleReady(false)
      if (scaleTimer.current) clearTimeout(scaleTimer.current)
      scaleTimer.current = setTimeout(() => setScaleReady(true), 400)
    } else {
      setScaleReady(true)
    }
  }, [isMobile])

  const advanceBelt = useCallback(() => {
    if (!loop && beltOrderRef.current.length === 0) return

    const prev = beltOrderRef.current
    const wrappingId = getId(prev[0])
    const next = rotateLeft(prev, 1)
    const nextActive = getId(next[FOCAL])

    setSkipTransitionId(wrappingId)
    setBeltOrder(next)
    notifyActive(nextActive)
    setCycleKey((k) => k + 1)
    scheduleScale()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSkipTransitionId(null))
    })
  }, [loop, getId, notifyActive, scheduleScale])

  const selectItem = useCallback(
    (id) => {
      if (id === activeIdRef.current) {
        setCycleKey((k) => k + 1)
        return
      }

      const prev = beltOrderRef.current
      let steps = 0
      let next = prev
      while (getId(next[FOCAL]) !== id && steps < next.length) {
        next = rotateLeft(next, 1)
        steps++
      }

      if (steps > 1) {
        setSkipTransitionId('__all__')
      } else if (steps === 1) {
        setSkipTransitionId(getId(prev[0]))
      }

      setBeltOrder(next)
      notifyActive(id)
      setCycleKey((k) => k + 1)
      scheduleScale()

      if (steps >= 1) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setSkipTransitionId(null))
        })
      }
    },
    [getId, notifyActive, scheduleScale]
  )

  useEffect(() => {
    if (!autoplayEnabled || isPaused || !useBelt) return undefined
    const timer = setTimeout(() => {
      advanceBelt()
    }, autoAdvanceMs)
    return () => clearTimeout(timer)
  }, [autoplayEnabled, isPaused, cycleKey, advanceBelt, autoAdvanceMs, useBelt])

  const pauseAutoplay = () => setIsPaused(true)
  const resumeAutoplay = () => {
    setIsPaused(false)
    setCycleKey((k) => k + 1)
  }

  const progressVisible = showProgress && autoplayEnabled && !isPaused && useBelt
  const displayList = useBelt ? beltOrder : items

  const onCardKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectItem(id)
    }
  }

  return (
    <div
      className={`${styles.zone} ${useBelt ? styles.zoneBelt : styles.zoneStatic} ${className}`}
      role="listbox"
      aria-label={ariaLabel}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocusCapture={pauseAutoplay}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          resumeAutoplay()
        }
      }}
    >
      {useBelt && showRail && (
        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railLine} />
          {displayList.map((_, i) => (
            <span
              key={i}
              className={styles.railTick}
              style={{
                left:
                  railOffset +
                  slotX(i) +
                  slotWidth(i) / 2,
              }}
            />
          ))}
          <span
            className={styles.railDot}
            style={{
              left: railOffset + slotX(FOCAL) + slotWidth(FOCAL) / 2,
            }}
          />
        </div>
      )}

      <div
        className={useBelt ? styles.beltTrack : styles.staticTrack}
        ref={beltRef}
      >
        {displayList.map((item, i) => {
          const id = getId(item)
          const isActive = useBelt ? i === FOCAL : id === activeId
          const layoutW = useBelt ? slotWidth(i) : undefined
          const cardW = useBelt
            ? i === FOCAL
              ? ACTIVE_W
              : INACTIVE_W
            : undefined
          // Center the unscaled card in its reserved slot; scale expands into the pad.
          const x = useBelt
            ? railOffset + slotX(i) + (layoutW - cardW) / 2
            : undefined

          const transform = useBelt
            ? `translateY(${i === FOCAL && scaleReady ? -16 : 0}px) scale(${
                i === FOCAL && scaleReady ? FOCAL_SCALE : 1
              })`
            : undefined

          const skipMotion =
            skipTransitionId === '__all__' ||
            skipTransitionId === id ||
            reduceMotion.current

          const motionStyle = useBelt
            ? {
                left: x,
                width: cardW,
                transform,
                zIndex: isActive ? 10 : 1,
                transition: skipMotion
                  ? 'none'
                  : `left ${BELT_MS}ms ${BELT_EASE}, transform ${BELT_MS}ms ${BELT_EASE}, width 500ms ${BELT_EASE}, box-shadow ${BELT_MS}ms ${BELT_EASE}, border-color ${BELT_MS}ms ${BELT_EASE}`,
              }
            : undefined

          const extraStyle = getCardStyle?.(item, isActive) || {}
          const extraClass = getCardClassName?.(item, isActive) || ''

          return (
            <button
              key={id}
              type="button"
              role="option"
              aria-selected={isActive}
              aria-current={isActive ? 'true' : undefined}
              className={`${styles.cardSlot} ${isActive ? styles.cardSlotActive : styles.cardSlotInactive} ${extraClass}`}
              onClick={() => selectItem(id)}
              onKeyDown={(e) => onCardKeyDown(e, id)}
              style={{
                ...motionStyle,
                ...extraStyle,
              }}
            >
              {renderCard(item, isActive, {
                cycleKey,
                showProgress: progressVisible && isActive,
                autoAdvanceMs,
                useBelt,
              })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export {
  FOCAL,
  INACTIVE_W,
  ACTIVE_W,
  ACTIVE_SLOT_W,
  FOCAL_SCALE,
  GAP,
  BELT_MS,
  BELT_EASE,
}
