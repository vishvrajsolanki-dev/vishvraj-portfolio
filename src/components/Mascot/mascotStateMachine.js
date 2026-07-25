/**
 * TrackBot mascot state machine — pure reducer, no React / Three.js.
 *
 * States: AGV | TRANSFORM_FWD | BOT | TRANSFORM_REV | SLEEP
 * Default on first load: BOT (greeting-capable; AGV is the explicit
 * reverse-transform / low-power wander mode, not the page-load default).
 */

export const MascotState = Object.freeze({
  AGV: 'AGV',
  TRANSFORM_FWD: 'TRANSFORM_FWD',
  BOT: 'BOT',
  TRANSFORM_REV: 'TRANSFORM_REV',
  SLEEP: 'SLEEP',
})

export const MascotEvent = Object.freeze({
  CLICK: 'CLICK',
  SCROLL_MILESTONE: 'SCROLL_MILESTONE',
  TRANSFORM_COMPLETE: 'TRANSFORM_COMPLETE',
  IDLE_TIMEOUT: 'IDLE_TIMEOUT',
  INPUT: 'INPUT',
})

/** Allowed transitions. Missing entries = no-op (state unchanged). */
export const ALLOWED_TRANSITIONS = Object.freeze({
  [MascotState.AGV]: Object.freeze({
    [MascotEvent.CLICK]: MascotState.TRANSFORM_FWD,
    [MascotEvent.SCROLL_MILESTONE]: MascotState.TRANSFORM_FWD,
    [MascotEvent.IDLE_TIMEOUT]: MascotState.AGV,
  }),
  [MascotState.TRANSFORM_FWD]: Object.freeze({
    [MascotEvent.TRANSFORM_COMPLETE]: MascotState.BOT,
  }),
  [MascotState.BOT]: Object.freeze({
    [MascotEvent.CLICK]: MascotState.TRANSFORM_REV,
    [MascotEvent.IDLE_TIMEOUT]: MascotState.SLEEP,
  }),
  [MascotState.TRANSFORM_REV]: Object.freeze({
    [MascotEvent.TRANSFORM_COMPLETE]: MascotState.AGV,
  }),
  [MascotState.SLEEP]: Object.freeze({
    [MascotEvent.INPUT]: MascotState.BOT,
    [MascotEvent.CLICK]: MascotState.BOT,
  }),
})

export const DEFAULT_STATE = MascotState.BOT

export function isTransforming(state) {
  return state === MascotState.TRANSFORM_FWD || state === MascotState.TRANSFORM_REV
}

export function canAcceptClick(state, { transformEnabled = true } = {}) {
  if (isTransforming(state)) return false
  if (!transformEnabled) {
    // Bot-only / low-end: click may wake sleep or trigger comments, never transform
    return state === MascotState.SLEEP
  }
  return (
    state === MascotState.AGV ||
    state === MascotState.BOT ||
    state === MascotState.SLEEP
  )
}

/**
 * Pure reducer. Returns next state. Unknown events / disallowed transitions
 * leave state unchanged (input during TRANSFORM is ignored, not queued).
 */
export function transition(state, event, options = {}) {
  const { transformEnabled = true } = options

  if (!transformEnabled) {
    if (state === MascotState.SLEEP && (event === MascotEvent.INPUT || event === MascotEvent.CLICK)) {
      return MascotState.BOT
    }
    if (state === MascotState.BOT && event === MascotEvent.IDLE_TIMEOUT) {
      return MascotState.SLEEP
    }
    // No AGV / transform paths when transform is disabled
    return state
  }

  const table = ALLOWED_TRANSITIONS[state]
  if (!table) return state
  const next = table[event]
  return next === undefined ? state : next
}

export function createMascotMachine(initialState = DEFAULT_STATE, options = {}) {
  let state = initialState
  const opts = { transformEnabled: true, ...options }

  return {
    getState() {
      return state
    },
    dispatch(event) {
      const next = transition(state, event, opts)
      state = next
      return state
    },
    setTransformEnabled(enabled) {
      opts.transformEnabled = Boolean(enabled)
    },
    isTransformEnabled() {
      return opts.transformEnabled
    },
  }
}
