/**
 * Flag + capability helper checks — run with:
 *   node src/components/Mascot/flags.test.js
 */
import { readMascotFlags, detectLowCapability } from './mascotFlags.js'

let passed = 0
let failed = 0
function assert(c, m) {
  if (c) passed++
  else {
    failed++
    console.error('FAIL:', m)
  }
}

assert(readMascotFlags('').enabled === false, 'mascot off by default')
assert(readMascotFlags('?mascot=1').enabled === true, 'mascot=1 enables')
assert(readMascotFlags('?mascot=1').transformEnabled === true, 'transform on by default')
assert(
  readMascotFlags('?mascot=1&mascot_transform=0').transformEnabled === false,
  'mascot_transform=0 disables transform only',
)
assert(readMascotFlags('?mascot=0').enabled === false, 'mascot=0 still off')

assert(
  detectLowCapability({
    matchMedia: () => ({ matches: true }),
    hardwareConcurrency: 8,
  }) === true,
  'reduced-motion → low capability',
)
assert(
  detectLowCapability({
    matchMedia: () => ({ matches: false }),
    hardwareConcurrency: 2,
  }) === true,
  '≤2 cores → low capability',
)
assert(
  detectLowCapability({
    matchMedia: () => ({ matches: false }),
    hardwareConcurrency: 8,
  }) === false,
  'normal device not low capability',
)

console.log(`flags: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
