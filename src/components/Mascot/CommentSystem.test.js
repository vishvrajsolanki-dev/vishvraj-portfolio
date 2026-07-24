/**
 * CommentSystem rate-limit checks — run with:
 *   node src/components/Mascot/CommentSystem.test.js
 */
import { createCommentSystem, COMMENT_COOLDOWN_MS } from './CommentSystem.js'

let passed = 0
let failed = 0
function assert(c, m) {
  if (c) passed++
  else {
    failed++
    console.error('FAIL:', m)
  }
}

const sys = createCommentSystem({ cooldownMs: 1000 })
const t0 = 1_000_000
const a = sys.pokeLine(t0)
assert(typeof a === 'string' && a.length > 0, 'poke returns line')
assert(sys.pokeLine(t0 + 100) === null, 'rate-limited within cooldown')
assert(typeof sys.pokeLine(t0 + 1001) === 'string', 'allowed after cooldown')

sys.reset()
const g1 = sys.sectionGreeting('projects', t0)
assert(typeof g1 === 'string', 'section greeting')
assert(sys.sectionGreeting('projects', t0 + 100) === null, 'same section gated')
assert(sys.idleLine(t0 + 50) === null, 'idle also rate-limited after greeting')

assert(COMMENT_COOLDOWN_MS >= 5000, 'default cooldown is substantial')

console.log(`CommentSystem: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
