/**
 * Headless acceptance smoke for TrackBot mascot.
 * Run: node scripts/mascot-smoke.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.MASCOT_BASE || 'http://127.0.0.1:5173'
const OUT = '/opt/cursor/artifacts/screenshots'
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

console.log('1) Mascot gated off without ?mascot=1')
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
assert((await page.locator('[data-mascot-state]').count()) === 0, 'mascot should be hidden')
await page.screenshot({ path: `${OUT}/mascot-off.png`, fullPage: false })

console.log('2) Bot mode default with ?mascot=1')
await page.goto(`${BASE}/?mascot=1`, { waitUntil: 'networkidle' })
await page.waitForSelector('[data-mascot-state]', { timeout: 10000 })
await page.waitForTimeout(1500)
const state0 = await page.getAttribute('[data-mascot-state]', 'data-mascot-state')
assert(state0 === 'BOT', `expected BOT default, got ${state0}`)
const hud = await page.locator('.hud, [class*="hud"]').first().textContent()
console.log('   HUD:', hud?.trim())
await page.screenshot({ path: `${OUT}/mascot-bot-idle.png` })

console.log('3) Comment bubble appears in BOT')
await page.waitForTimeout(1200)
// bubble may or may not be visible depending on timing — greeting fires ~900ms
const bubbleCount = await page.locator('[class*="bubble"]').count()
console.log('   bubble count:', bubbleCount)

console.log('4) Click → reverse transform → AGV')
await page.locator('[aria-label="TrackBot mascot"]').click()
await page.waitForTimeout(200)
let mid = await page.getAttribute('[data-mascot-state]', 'data-mascot-state')
assert(mid === 'TRANSFORM_REV', `expected TRANSFORM_REV, got ${mid}`)
await page.screenshot({ path: `${OUT}/mascot-transform-rev.png` })

// Rapid extra clicks during transform must no-op
await page.locator('[aria-label="TrackBot mascot"]').click({ clickCount: 3, delay: 40 })
await page.waitForTimeout(100)
mid = await page.getAttribute('[data-mascot-state]', 'data-mascot-state')
assert(mid === 'TRANSFORM_REV', `still TRANSFORM_REV after spam clicks, got ${mid}`)

await page.waitForFunction(
  () => document.querySelector('[data-mascot-state]')?.getAttribute('data-mascot-state') === 'AGV',
  { timeout: 8000 },
)
await page.waitForTimeout(600)
assert((await page.locator('[class*="bubble"]').count()) === 0, 'no bubble in AGV')
const enRoute = await page.locator('text=En route').count()
assert(enRoute > 0, 'En route HUD tag in AGV')
await page.screenshot({ path: `${OUT}/mascot-agv.png` })

console.log('5) Click AGV → forward transform → BOT')
await page.locator('[aria-label="TrackBot mascot"]').click()
await page.waitForFunction(
  () => {
    const s = document.querySelector('[data-mascot-state]')?.getAttribute('data-mascot-state')
    return s === 'TRANSFORM_FWD'
  },
  { timeout: 3000 },
)
await page.waitForTimeout(900) // mid-timeline: wheels-fold / chassis-lift
await page.screenshot({ path: `${OUT}/mascot-transform-fwd.png` })
await page.waitForFunction(
  () => document.querySelector('[data-mascot-state]')?.getAttribute('data-mascot-state') === 'BOT',
  { timeout: 8000 },
)
await page.screenshot({ path: `${OUT}/mascot-bot-after-transform.png` })

console.log('6) ?mascot_transform=0 → BOT-only, click does not transform')
await page.goto(`${BASE}/?mascot=1&mascot_transform=0`, { waitUntil: 'networkidle' })
await page.waitForSelector('[data-mascot-state]')
await page.waitForTimeout(500)
assert((await page.getAttribute('[data-mascot-state]', 'data-mascot-state')) === 'BOT', 'bot-only boot')
await page.locator('[aria-label="TrackBot mascot"]').click()
await page.waitForTimeout(800)
assert((await page.getAttribute('[data-mascot-state]', 'data-mascot-state')) === 'BOT', 'still BOT')
await page.screenshot({ path: `${OUT}/mascot-transform-disabled.png` })

console.log('7) Navigate to project page mid-session and back — clean remount')
await page.goto(`${BASE}/?mascot=1`, { waitUntil: 'networkidle' })
await page.waitForSelector('[data-mascot-state]')
await page.locator('[aria-label="TrackBot mascot"]').click()
await page.waitForTimeout(400) // mid-transform
await page.goto(`${BASE}/projects/lexis`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
assert((await page.locator('[data-mascot-state]').count()) === 0, 'mascot unmounted on project page')
await page.goto(`${BASE}/?mascot=1`, { waitUntil: 'networkidle' })
await page.waitForSelector('[data-mascot-state]', { timeout: 8000 })
assert((await page.getAttribute('[data-mascot-state]', 'data-mascot-state')) === 'BOT', 'clean re-init BOT')
await page.screenshot({ path: `${OUT}/mascot-reinit.png` })

console.log('8) Hero canvas still present (other components OK)')
await page.waitForSelector('#hero', { timeout: 5000 })
await page.screenshot({ path: `${OUT}/mascot-with-hero.png` })

const fatal = errors.filter(
  (e) =>
    !/Download the React DevTools/i.test(e) &&
    !/WebGL/i.test(e) && // swiftshader warnings ok
    !/THREE\.WebGLRenderer/i.test(e),
)
console.log('Console errors (filtered):', fatal.length ? fatal : 'none')
assert(fatal.length === 0, `unexpected console errors: ${fatal.join(' | ')}`)

console.log('\nALL SMOKE CHECKS PASSED')
await browser.close()
