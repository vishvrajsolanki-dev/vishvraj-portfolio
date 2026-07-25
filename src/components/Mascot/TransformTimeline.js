import gsap from 'gsap'

/**
 * Pure GSAP timeline builder for AGV ↔ Bot transform.
 * Not tied to React lifecycle — Mascot.jsx owns create/kill.
 *
 * Phases (forward, ~2.5s):
 *   0–35%  wheels fold
 *  35–70%  chassis lifts + VFX burst peak (opacity cross-fade)
 *  70–100% head deploys / settle into idle
 *
 * prefers-reduced-motion → single ~400ms opacity cross-fade (real branch, not speed×).
 */

const DURATION = 2.5

/**
 * @param {object} opts
 * @param {{ setOpacity?: Function, root?: THREE.Object3D, wheels?: object, body?: THREE.Object3D, mast?: THREE.Object3D }} opts.agv
 * @param {{ setOpacity?: Function, root?: THREE.Object3D, torso?: THREE.Object3D, head?: THREE.Object3D, armL?: THREE.Object3D, armR?: THREE.Object3D, legL?: THREE.Object3D, legR?: THREE.Object3D }} opts.bot
 * @param {'forward'|'reverse'} opts.direction
 * @param {boolean} [opts.reducedMotion]
 * @param {() => void} [opts.onVfxPeak]
 * @param {() => void} [opts.onComplete]
 * @param {THREE.Object3D} [opts.shakeTarget] — mascot group for camera shake (±2–3px)
 * @param {boolean} [opts.enableShake]
 */
export function buildTransformTimeline(opts) {
  const {
    agv,
    bot,
    direction = 'forward',
    reducedMotion = false,
    onVfxPeak,
    onComplete,
    shakeTarget,
    enableShake = true,
  } = opts

  const forward = direction === 'forward'
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      if (typeof onComplete === 'function') onComplete()
    },
  })

  if (!agv?.root || !bot?.root) {
    // Degenerate: instant swap
    tl.call(() => {
      agv?.setOpacity?.(forward ? 0 : 1)
      bot?.setOpacity?.(forward ? 1 : 0)
      if (agv?.root) agv.root.visible = !forward
      if (bot?.root) bot.root.visible = forward
    })
    return tl
  }

  // ── Reduced motion: plain cross-fade only ──────────────────────────
  if (reducedMotion) {
    const fromAgv = { v: forward ? 1 : 0 }
    const fromBot = { v: forward ? 0 : 1 }
    if (forward) {
      bot.root.visible = true
      bot.setOpacity?.(0)
    } else {
      agv.root.visible = true
      agv.setOpacity?.(0)
    }
    tl.to(
      fromAgv,
      {
        v: forward ? 0 : 1,
        duration: 0.4,
        ease: 'power1.inOut',
        onUpdate: () => agv.setOpacity?.(fromAgv.v),
      },
      0,
    )
    tl.to(
      fromBot,
      {
        v: forward ? 1 : 0,
        duration: 0.4,
        ease: 'power1.inOut',
        onUpdate: () => bot.setOpacity?.(fromBot.v),
      },
      0,
    )
    tl.call(() => {
      if (forward) {
        agv.root.visible = false
        agv.setOpacity?.(0)
        bot.root.visible = true
        bot.setOpacity?.(1)
      } else {
        bot.root.visible = false
        bot.setOpacity?.(0)
        agv.root.visible = true
        agv.setOpacity?.(1)
      }
    })
    return tl
  }

  // ── Full theatrical transform ──────────────────────────────────────
  const phase1 = DURATION * 0.35
  const phase2 = DURATION * 0.35
  const phase3 = DURATION * 0.3

  const wheels = agv.wheels || {}
  const wheelList = [wheels.FL, wheels.FR, wheels.RL, wheels.RR].filter(Boolean)

  if (forward) {
    // Ensure bot is ready but invisible for cross-fade
    bot.root.visible = true
    bot.setOpacity?.(0)
    agv.root.visible = true
    agv.setOpacity?.(1)

    // Reset bot parts to "compressed" start pose
    if (bot.head) gsap.set(bot.head.scale, { x: 0.2, y: 0.2, z: 0.2 })
    if (bot.head) gsap.set(bot.head.position, { y: 1.7 })
    if (bot.armL) gsap.set(bot.armL.scale, { x: 0.1, y: 0.1, z: 0.1 })
    if (bot.armR) gsap.set(bot.armR.scale, { x: 0.1, y: 0.1, z: 0.1 })
    if (bot.legL) gsap.set(bot.legL.scale, { y: 0.3 })
    if (bot.legR) gsap.set(bot.legR.scale, { y: 0.3 })
    if (bot.torso) gsap.set(bot.torso.position, { y: 0.9 })
    if (bot.root) gsap.set(bot.root.position, { y: -0.4 })

    // Phase 1 — wheels fold inward
    wheelList.forEach((w, i) => {
      const inwardZ = i % 2 === 0 ? -0.35 : 0.35
      tl.to(
        w.rotation,
        { z: Math.PI / 2 + (i < 2 ? 0.6 : -0.6), duration: phase1, ease: 'power2.in' },
        0,
      )
      tl.to(
        w.position,
        { z: w.position.z + inwardZ * 0.5, y: w.position.y + 0.15, duration: phase1 },
        0,
      )
    })
    if (agv.mast) {
      tl.to(agv.mast.rotation, { z: 0, duration: phase1 * 0.8 }, 0.1)
      tl.to(agv.mast.position, { y: '+=0.25', duration: phase1 }, 0)
    }

    // Phase 2 — chassis lifts + VFX peak + opacity swap
    if (agv.body) {
      tl.to(agv.body.position, { y: '+=0.55', duration: phase2, ease: 'power2.out' }, phase1)
      tl.to(agv.body.scale, { y: 1.15, x: 0.85, z: 0.9, duration: phase2 }, phase1)
    }
    if (bot.root) {
      tl.to(bot.root.position, { y: 0, duration: phase2, ease: 'power2.out' }, phase1)
    }
    if (bot.torso) {
      tl.to(bot.torso.position, { y: 1.55, duration: phase2 }, phase1)
    }
    if (bot.legL) tl.to(bot.legL.scale, { y: 1, duration: phase2 }, phase1)
    if (bot.legR) tl.to(bot.legR.scale, { y: 1, duration: phase2 }, phase1)

    const fadeAgv = { v: 1 }
    const fadeBot = { v: 0 }
    const fadeStart = phase1 + phase2 * 0.25
    const fadeDur = phase2 * 0.5

    tl.call(() => {
      if (typeof onVfxPeak === 'function') onVfxPeak()
    }, null, fadeStart)

    tl.to(
      fadeAgv,
      {
        v: 0,
        duration: fadeDur,
        ease: 'power1.in',
        onUpdate: () => agv.setOpacity?.(fadeAgv.v),
      },
      fadeStart,
    )
    tl.to(
      fadeBot,
      {
        v: 1,
        duration: fadeDur,
        ease: 'power1.out',
        onUpdate: () => bot.setOpacity?.(fadeBot.v),
      },
      fadeStart,
    )

    if (enableShake && shakeTarget) {
      const shake = { x: 0, y: 0 }
      tl.to(
        shake,
        {
          duration: 0.2,
          x: 0.03,
          y: 0.025,
          yoyo: true,
          repeat: 3,
          ease: 'power1.inOut',
          onUpdate: () => {
            shakeTarget.position.x = (Math.random() - 0.5) * 0.06
            shakeTarget.position.y = (Math.random() - 0.5) * 0.05
          },
          onComplete: () => {
            shakeTarget.position.x = 0
            shakeTarget.position.y = 0
          },
        },
        fadeStart,
      )
    }

    // Phase 3 — head deploys, arms settle
    const p3 = phase1 + phase2
    if (bot.head) {
      tl.to(bot.head.scale, { x: 1, y: 1, z: 1, duration: phase3, ease: 'back.out(1.4)' }, p3)
      tl.to(bot.head.position, { y: 2.1, duration: phase3, ease: 'power2.out' }, p3)
    }
    if (bot.armL) {
      tl.to(bot.armL.scale, { x: 1, y: 1, z: 1, duration: phase3 * 0.8 }, p3 + 0.05)
      tl.to(bot.armL.rotation, { z: 0.2, x: 0.15, duration: phase3 }, p3)
    }
    if (bot.armR) {
      tl.to(bot.armR.scale, { x: 1, y: 1, z: 1, duration: phase3 * 0.8 }, p3 + 0.05)
      tl.to(bot.armR.rotation, { z: -0.2, x: 0.15, duration: phase3 }, p3)
    }

    tl.call(() => {
      agv.root.visible = false
      agv.setOpacity?.(0)
      bot.root.visible = true
      bot.setOpacity?.(1)
    })
  } else {
    // ── Reverse: Bot → AGV ───────────────────────────────────────────
    agv.root.visible = true
    agv.setOpacity?.(0)
    bot.root.visible = true
    bot.setOpacity?.(1)

    // Reset AGV parts to "lifted" state so they settle down
    if (agv.body) gsap.set(agv.body.position, { y: 0.55 })
    if (agv.body) gsap.set(agv.body.scale, { y: 1.15, x: 0.85, z: 0.9 })
    wheelList.forEach((w, i) => {
      gsap.set(w.rotation, { z: Math.PI / 2 + (i < 2 ? 0.6 : -0.6) })
    })
    if (agv.mast) gsap.set(agv.mast.rotation, { z: 0 })

    // Phase 1 (rev) — head retracts, arms tuck
    if (bot.head) {
      tl.to(bot.head.scale, { x: 0.2, y: 0.2, z: 0.2, duration: phase1 }, 0)
      tl.to(bot.head.position, { y: 1.7, duration: phase1 }, 0)
    }
    if (bot.armL) tl.to(bot.armL.scale, { x: 0.1, y: 0.1, z: 0.1, duration: phase1 }, 0)
    if (bot.armR) tl.to(bot.armR.scale, { x: 0.1, y: 0.1, z: 0.1, duration: phase1 }, 0)

    // Phase 2 — legs compress, opacity swap, VFX
    if (bot.legL) tl.to(bot.legL.scale, { y: 0.3, duration: phase2 }, phase1)
    if (bot.legR) tl.to(bot.legR.scale, { y: 0.3, duration: phase2 }, phase1)
    if (bot.torso) tl.to(bot.torso.position, { y: 0.9, duration: phase2 }, phase1)
    if (bot.root) tl.to(bot.root.position, { y: -0.4, duration: phase2 }, phase1)
    if (agv.body) {
      tl.to(agv.body.position, { y: 0, duration: phase2 }, phase1)
      tl.to(agv.body.scale, { x: 1, y: 1, z: 1, duration: phase2 }, phase1)
    }

    const fadeBot = { v: 1 }
    const fadeAgv = { v: 0 }
    const fadeStart = phase1 + phase2 * 0.25
    const fadeDur = phase2 * 0.5

    tl.call(() => {
      if (typeof onVfxPeak === 'function') onVfxPeak()
    }, null, fadeStart)

    tl.to(
      fadeBot,
      {
        v: 0,
        duration: fadeDur,
        onUpdate: () => bot.setOpacity?.(fadeBot.v),
      },
      fadeStart,
    )
    tl.to(
      fadeAgv,
      {
        v: 1,
        duration: fadeDur,
        onUpdate: () => agv.setOpacity?.(fadeAgv.v),
      },
      fadeStart,
    )

    if (enableShake && shakeTarget) {
      tl.to(
        {},
        {
          duration: 0.2,
          onUpdate: () => {
            shakeTarget.position.x = (Math.random() - 0.5) * 0.06
            shakeTarget.position.y = (Math.random() - 0.5) * 0.05
          },
          onComplete: () => {
            shakeTarget.position.x = 0
            shakeTarget.position.y = 0
          },
        },
        fadeStart,
      )
    }

    // Phase 3 — wheels unfold, mast folds flat
    const p3 = phase1 + phase2
    wheelList.forEach((w) => {
      tl.to(w.rotation, { z: Math.PI / 2, duration: phase3 }, p3)
      tl.to(w.position, { y: 0, duration: phase3 }, p3)
    })
    if (agv.mast) {
      tl.to(agv.mast.rotation, { z: -Math.PI / 2, duration: phase3 }, p3)
      tl.to(agv.mast.position, { y: 0.32, duration: phase3 }, p3)
    }

    tl.call(() => {
      bot.root.visible = false
      bot.setOpacity?.(0)
      agv.root.visible = true
      agv.setOpacity?.(1)
      // Reset bot scales for next forward transform
      if (bot.head) gsap.set(bot.head.scale, { x: 1, y: 1, z: 1 })
      if (bot.head) gsap.set(bot.head.position, { y: 2.1 })
      if (bot.armL) gsap.set(bot.armL.scale, { x: 1, y: 1, z: 1 })
      if (bot.armR) gsap.set(bot.armR.scale, { x: 1, y: 1, z: 1 })
      if (bot.legL) gsap.set(bot.legL.scale, { y: 1 })
      if (bot.legR) gsap.set(bot.legR.scale, { y: 1 })
      if (bot.torso) gsap.set(bot.torso.position, { y: 1.55 })
      if (bot.root) gsap.set(bot.root.position, { y: 0 })
    })
  }

  return tl
}

export const TRANSFORM_DURATION = DURATION
