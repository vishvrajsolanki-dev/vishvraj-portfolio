/**
 * Isolation tests for mascotStateMachine — run with:
 *   node src/components/Mascot/mascotStateMachine.test.js
 */
import {
  MascotState,
  MascotEvent,
  transition,
  canAcceptClick,
  isTransforming,
  createMascotMachine,
  DEFAULT_STATE,
} from './mascotStateMachine.js'

let passed = 0
let failed = 0

function assert(cond, msg) {
  if (cond) {
    passed += 1
  } else {
    failed += 1
    console.error('FAIL:', msg)
  }
}

function eq(actual, expected, msg) {
  assert(actual === expected, `${msg} (got ${actual}, expected ${expected})`)
}

// Default
eq(DEFAULT_STATE, MascotState.BOT, 'default is BOT for greeting')

// AGV → TRANSFORM_FWD on click / scroll
eq(transition(MascotState.AGV, MascotEvent.CLICK), MascotState.TRANSFORM_FWD, 'AGV click')
eq(
  transition(MascotState.AGV, MascotEvent.SCROLL_MILESTONE),
  MascotState.TRANSFORM_FWD,
  'AGV scroll milestone',
)
eq(transition(MascotState.AGV, MascotEvent.IDLE_TIMEOUT), MascotState.AGV, 'AGV idle no-op')

// TRANSFORM ignores clicks
eq(
  transition(MascotState.TRANSFORM_FWD, MascotEvent.CLICK),
  MascotState.TRANSFORM_FWD,
  'TRANSFORM_FWD ignores click',
)
eq(
  transition(MascotState.TRANSFORM_REV, MascotEvent.CLICK),
  MascotState.TRANSFORM_REV,
  'TRANSFORM_REV ignores click',
)
eq(
  transition(MascotState.TRANSFORM_FWD, MascotEvent.TRANSFORM_COMPLETE),
  MascotState.BOT,
  'fwd complete → BOT',
)
eq(
  transition(MascotState.TRANSFORM_REV, MascotEvent.TRANSFORM_COMPLETE),
  MascotState.AGV,
  'rev complete → AGV',
)

// BOT click → reverse; idle → sleep
eq(transition(MascotState.BOT, MascotEvent.CLICK), MascotState.TRANSFORM_REV, 'BOT click reverse')
eq(transition(MascotState.BOT, MascotEvent.IDLE_TIMEOUT), MascotState.SLEEP, 'BOT idle → SLEEP')

// SLEEP wakes instantly to BOT
eq(transition(MascotState.SLEEP, MascotEvent.INPUT), MascotState.BOT, 'SLEEP input wake')
eq(transition(MascotState.SLEEP, MascotEvent.CLICK), MascotState.BOT, 'SLEEP click wake')

// Transform disabled
eq(
  transition(MascotState.BOT, MascotEvent.CLICK, { transformEnabled: false }),
  MascotState.BOT,
  'no transform when disabled',
)
eq(
  transition(MascotState.SLEEP, MascotEvent.CLICK, { transformEnabled: false }),
  MascotState.BOT,
  'sleep still wakes when transform disabled',
)

assert(isTransforming(MascotState.TRANSFORM_FWD), 'isTransforming fwd')
assert(isTransforming(MascotState.TRANSFORM_REV), 'isTransforming rev')
assert(!isTransforming(MascotState.BOT), 'not transforming in BOT')

assert(!canAcceptClick(MascotState.TRANSFORM_FWD), 'no click during transform')
assert(canAcceptClick(MascotState.AGV), 'click ok in AGV')
assert(!canAcceptClick(MascotState.BOT, { transformEnabled: false }), 'bot click no-op when no transform')
assert(canAcceptClick(MascotState.SLEEP, { transformEnabled: false }), 'sleep click wakes when no transform')

const machine = createMascotMachine()
eq(machine.getState(), MascotState.BOT, 'machine starts BOT')
machine.dispatch(MascotEvent.CLICK)
eq(machine.getState(), MascotState.TRANSFORM_REV, 'machine click → TRANSFORM_REV')
machine.dispatch(MascotEvent.CLICK)
eq(machine.getState(), MascotState.TRANSFORM_REV, 'machine ignores click mid-transform')
machine.dispatch(MascotEvent.TRANSFORM_COMPLETE)
eq(machine.getState(), MascotState.AGV, 'machine complete → AGV')

console.log(`mascotStateMachine: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
