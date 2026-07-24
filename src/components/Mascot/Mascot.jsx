import { useRef, useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import WebGLErrorBoundary from '../ui/WebGLErrorBoundary'
import AgvRig from './rigs/AgvRig'
import BotRig from './rigs/BotRig'
import VfxBurst from './VfxBurst'
import { buildTransformTimeline } from './TransformTimeline'
import { createCommentSystem } from './CommentSystem'
import {
  MascotState,
  MascotEvent,
  createMascotMachine,
  isTransforming,
  DEFAULT_STATE,
} from './mascotStateMachine'
import { readMascotFlags, detectLowCapability } from './mascotFlags'
import styles from './Mascot.module.css'

const IDLE_SLEEP_MS = 3 * 60 * 1000
const SESSION_SCROLL_KEY = 'trackbot_scroll_transform_done'
const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'certifications',
  'achievements',
  'contact',
]

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
}

function isMobileNarrow() {
  return typeof window !== 'undefined' && window.innerWidth < 480
}

/**
 * Inner R3F scene — ambient wander (AGV), idle sway (BOT), wheel spin.
 */
function MascotScene({
  state,
  agvRef,
  botRef,
  vfxRef,
  shakeGroupRef,
  transformEnabled,
  lowCapability,
}) {
  const wander = useRef({ t: 0, pauseUntil: 0, dir: 1, x: 0 })
  const sway = useRef(0)

  useFrame((clockState, dt) => {
    const t = clockState.clock.elapsedTime
    sway.current = t

    // AGV wander — low GPU, position tween + wheel rotation
    if (state === MascotState.AGV && agvRef.current?.root) {
      const now = performance.now()
      if (now > wander.current.pauseUntil) {
        wander.current.t += dt
        wander.current.x += wander.current.dir * dt * 0.35
        if (Math.abs(wander.current.x) > 0.9) {
          wander.current.dir *= -1
          wander.current.pauseUntil = now + 800 + Math.random() * 1200
        }
        agvRef.current.root.position.x = wander.current.x
        agvRef.current.root.position.z = Math.sin(wander.current.t * 0.7) * 0.15
      }
      const wheels = agvRef.current.wheels
      if (wheels) {
        const spin = dt * 4 * wander.current.dir
        ;['FL', 'FR', 'RL', 'RR'].forEach((k) => {
          if (wheels[k]) wheels[k].rotation.x += spin
        })
      }
    }

    // Bot idle sway — head/arms
    if (
      (state === MascotState.BOT || state === MascotState.SLEEP) &&
      botRef.current &&
      !lowCapability
    ) {
      const head = botRef.current.head
      const armL = botRef.current.armL
      const armR = botRef.current.armR
      const amp = state === MascotState.SLEEP ? 0.02 : 0.06
      if (head) {
        head.rotation.y = Math.sin(t * 0.7) * amp
        head.rotation.z = Math.sin(t * 0.45) * amp * 0.5
      }
      if (state === MascotState.BOT) {
        if (armL) armL.rotation.x = 0.15 + Math.sin(t * 0.9) * 0.08
        if (armR) armR.rotation.x = 0.15 + Math.sin(t * 0.9 + 1.2) * 0.08
      }
    }
  })

  // Both rigs persist once transform is offered (opacity toggled — no remount churn).
  const keepBothRigs = transformEnabled && !lowCapability
  const botPose = state === MascotState.SLEEP ? 'sleep' : 'idle'

  const agvVisible =
    keepBothRigs &&
    (state === MascotState.AGV || isTransforming(state))
  const botVisible =
    state === MascotState.BOT ||
    state === MascotState.SLEEP ||
    isTransforming(state) ||
    !keepBothRigs

  // Idle opacities only — during TRANSFORM the GSAP timeline owns material opacity.
  // Forcing 0 here on TRANSFORM_* was blanking both rigs before the timeline started.
  const transforming = isTransforming(state)
  const agvOpacity = transforming ? undefined : state === MascotState.AGV ? 1 : 0
  const botOpacity = transforming
    ? undefined
    : state === MascotState.BOT || state === MascotState.SLEEP || !keepBothRigs
      ? 1
      : 0

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#a8fff8" />
      <pointLight position={[-2, 2.5, 2]} intensity={0.55} color="#6EE7E0" />

      <group ref={shakeGroupRef} position={[0, -0.55, 0]} scale={0.72}>
        {keepBothRigs && (
          <AgvRig
            ref={agvRef}
            visible={agvVisible || transforming}
            opacity={agvOpacity}
          />
        )}
        <BotRig
          ref={botRef}
          visible={botVisible || transforming}
          opacity={botOpacity}
          pose={botPose}
        />
        {keepBothRigs && <VfxBurst ref={vfxRef} />}
      </group>
    </>
  )
}

function StatusHud({ state, transformEnabled, lowCapability }) {
  let label = 'BOT / IDLE'
  if (state === MascotState.SLEEP) {
    label = 'BOT / SLEEP'
  } else if (!lowCapability && transformEnabled) {
    if (state === MascotState.AGV) label = 'AGV / MOVING'
    else if (state === MascotState.TRANSFORM_FWD) label = 'TRANSFORM ▶ BOT'
    else if (state === MascotState.TRANSFORM_REV) label = 'TRANSFORM ▶ AGV'
  }
  return (
    <div className={styles.hud} aria-hidden="true">
      <span className={styles.hudDot} />
      <span>STATE · {label}</span>
    </div>
  )
}

export default function Mascot() {
  const flags = useMemo(() => readMascotFlags(), [])
  const lowCapability = useMemo(() => detectLowCapability(), [])
  const transformEnabled = flags.transformEnabled && !lowCapability

  const machine = useMemo(
    () =>
      createMascotMachine(transformEnabled ? DEFAULT_STATE : MascotState.BOT, {
        transformEnabled,
      }),
    // Intentionally once per mount — flags are session-stable from URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const machineRef = useRef(machine)

  const [state, setState] = useState(DEFAULT_STATE)
  const [comment, setComment] = useState(null)
  const greetOnceRef = useRef(false)

  const agvRef = useRef(null)
  const botRef = useRef(null)
  const vfxRef = useRef(null)
  const shakeGroupRef = useRef(null)
  const timelineRef = useRef(null)
  const commentsRef = useRef(createCommentSystem())
  const idleTimerRef = useRef(null)
  const commentTimerRef = useRef(null)
  const observersRef = useRef([])
  const pendingScrollRef = useRef(false)

  // Sync machine option if flags change (stable for session)
  useEffect(() => {
    machineRef.current.setTransformEnabled(transformEnabled)
  }, [transformEnabled])

  const clearCommentSoon = useCallback((ms = 4200) => {
    if (commentTimerRef.current) clearTimeout(commentTimerRef.current)
    commentTimerRef.current = setTimeout(() => setComment(null), ms)
  }, [])

  const showComment = useCallback(
    (line) => {
      if (!line) return
      setComment(line)
      clearCommentSoon()
    },
    [clearCommentSoon],
  )

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      const next = machineRef.current.dispatch(MascotEvent.IDLE_TIMEOUT)
      setState(next)
      setComment(null)
    }, IDLE_SLEEP_MS)
  }, [])

  const runTransform = useCallback(
    (direction) => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }

      // Wait a frame so refs from newly-visible rigs are populated
      requestAnimationFrame(() => {
        const reduced = prefersReducedMotion()
        const enableShake = !isMobileNarrow() && !reduced

        const tl = buildTransformTimeline({
          agv: agvRef.current || {},
          bot: botRef.current || {},
          direction,
          reducedMotion: reduced,
          enableShake,
          shakeTarget: shakeGroupRef.current,
          onVfxPeak: () => {
            if (!reduced) vfxRef.current?.trigger?.()
          },
          onComplete: () => {
            timelineRef.current = null
            const next = machineRef.current.dispatch(MascotEvent.TRANSFORM_COMPLETE)
            setState(next)
            resetIdleTimer()
            if (next === MascotState.BOT) {
              const line = commentsRef.current.pokeLine()
              // Prefer a transform-complete greeting
              showComment(line || 'Systems online. Bot mode ready.')
            }
          },
        })
        timelineRef.current = tl
      })
    },
    [resetIdleTimer, showComment],
  )

  const dispatch = useCallback(
    (event) => {
      const prev = machineRef.current.getState()
      if (isTransforming(prev)) return // hard ignore — not queued

      const next = machineRef.current.dispatch(event)
      if (next === prev) {
        // e.g. click in BOT with transform disabled → comment poke
        if (
          event === MascotEvent.CLICK &&
          prev === MascotState.BOT &&
          !transformEnabled
        ) {
          showComment(commentsRef.current.pokeLine())
          resetIdleTimer()
        }
        return
      }

      setState(next)
      setComment(null)

      if (next === MascotState.TRANSFORM_FWD) {
        runTransform('forward')
      } else if (next === MascotState.TRANSFORM_REV) {
        runTransform('reverse')
      } else if (next === MascotState.BOT && prev === MascotState.SLEEP) {
        showComment(commentsRef.current.pokeLine() || 'Back online.')
        resetIdleTimer()
      } else {
        resetIdleTimer()
      }
    },
    [runTransform, resetIdleTimer, showComment, transformEnabled],
  )

  const handleClick = useCallback(
    (e) => {
      e?.stopPropagation?.()
      const current = machineRef.current.getState()
      if (isTransforming(current)) return

      if (current === MascotState.SLEEP) {
        dispatch(MascotEvent.CLICK)
        return
      }

      if (!transformEnabled) {
        // Bot-only: poke comment, never transform
        if (current === MascotState.BOT) {
          showComment(commentsRef.current.pokeLine())
          resetIdleTimer()
        }
        return
      }

      dispatch(MascotEvent.CLICK)
    },
    [dispatch, transformEnabled, showComment, resetIdleTimer],
  )

  const tryScrollMilestone = useCallback(() => {
    if (!transformEnabled) return
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem(SESSION_SCROLL_KEY) === '1') return
    }
    if (document.visibilityState !== 'visible') {
      pendingScrollRef.current = true
      return
    }
    const current = machineRef.current.getState()
    if (current !== MascotState.AGV) return
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_SCROLL_KEY, '1')
    }
    dispatch(MascotEvent.SCROLL_MILESTONE)
  }, [dispatch, transformEnabled])

  // Mount listeners: scroll milestone, section greetings, visibility, idle
  useEffect(() => {
    if (!flags.enabled) return undefined
    resetIdleTimer()

    // Initial greeting (once)
    let greetTimer = null
    if (!greetOnceRef.current) {
      greetOnceRef.current = true
      greetTimer = setTimeout(() => {
        if (machineRef.current.getState() === MascotState.BOT) {
          showComment(commentsRef.current.sectionGreeting('hero') || 'TrackBot online.')
        }
      }, 900)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && pendingScrollRef.current) {
        pendingScrollRef.current = false
        tryScrollMilestone()
      }
      if (document.visibilityState === 'visible') {
        const s = machineRef.current.getState()
        if (s === MascotState.SLEEP) dispatch(MascotEvent.INPUT)
        else resetIdleTimer()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onPointer = () => {
      const s = machineRef.current.getState()
      if (s === MascotState.SLEEP) dispatch(MascotEvent.INPUT)
      else if (!isTransforming(s)) resetIdleTimer()
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onPointer)

    const localObservers = []

    // Projects section → scroll-milestone auto-transform (once / session)
    const projectsEl = document.getElementById('projects')
    if (projectsEl && typeof IntersectionObserver !== 'undefined') {
      const projectsObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
              tryScrollMilestone()
            }
          }
        },
        { threshold: [0.25, 0.5] },
      )
      projectsObserver.observe(projectsEl)
      localObservers.push(projectsObserver)
    }

    // Section-entry greetings (Bot mode only)
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el || typeof IntersectionObserver === 'undefined') return
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const s = machineRef.current.getState()
            if (s !== MascotState.BOT) return
            const line = commentsRef.current.sectionGreeting(id)
            if (line) showComment(line)
          }
        },
        { threshold: 0.4 },
      )
      obs.observe(el)
      localObservers.push(obs)
    })
    observersRef.current = localObservers

    // Occasional idle commentary in BOT
    const idleCommentInterval = setInterval(() => {
      const s = machineRef.current.getState()
      if (s !== MascotState.BOT) return
      const line = commentsRef.current.idleLine()
      if (line) showComment(line)
    }, 28000)

    const agv = agvRef
    const bot = botRef
    const vfx = vfxRef

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onPointer)
      clearInterval(idleCommentInterval)
      if (greetTimer) clearTimeout(greetTimer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (commentTimerRef.current) clearTimeout(commentTimerRef.current)
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
      localObservers.forEach((o) => o.disconnect())
      observersRef.current = []
      agv.current?.dispose?.()
      bot.current?.dispose?.()
      vfx.current?.dispose?.()
    }
  }, [
    flags.enabled,
    resetIdleTimer,
    tryScrollMilestone,
    dispatch,
    showComment,
  ])

  if (!flags.enabled) return null

  const bubbleAllowed =
    (state === MascotState.BOT || state === MascotState.SLEEP) && Boolean(comment)
  // Never show comment bubble in AGV or during transform
  const showBubble =
    bubbleAllowed && state !== MascotState.AGV && !isTransforming(state)

  return (
    <div className={styles.root} data-mascot-state={state}>
      <StatusHud
        state={state}
        transformEnabled={transformEnabled}
        lowCapability={lowCapability}
      />

      {showBubble && (
        <div className={styles.bubble} role="status">
          {comment}
        </div>
      )}

      <button
        type="button"
        className={styles.hitArea}
        aria-label="TrackBot mascot"
        onClick={handleClick}
      />

      <div className={styles.canvasWrap}>
        <WebGLErrorBoundary>
          <Canvas
            frameloop="always"
            dpr={1}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [2.4, 1.35, 3.2], fov: 38, near: 0.1, far: 40 }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <Suspense fallback={null}>
              <MascotScene
                state={state}
                agvRef={agvRef}
                botRef={botRef}
                vfxRef={vfxRef}
                shakeGroupRef={shakeGroupRef}
                transformEnabled={transformEnabled}
                lowCapability={lowCapability}
              />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </div>

      {state === MascotState.AGV && (
        <div className={styles.enRoute} aria-hidden="true">
          En route…
        </div>
      )}
    </div>
  )
}
