/**
 * Hardcoded commentary line pools + rate-limit logic (v2 idle mascot).
 * Bubbles are produced only in BOT state — callers must gate on state.
 */

export const COMMENT_COOLDOWN_MS = 12_000
export const SECTION_GREETING_COOLDOWN_MS = 45_000

const IDLE_LINES = [
  'Systems nominal. Ready when you are.',
  'Scanning portfolio… looks solid.',
  'Need a tour? Click me or keep scrolling.',
  'TrackBot online. AGV mode on standby.',
  'Verified proof beats claims — always.',
]

const POKE_LINES = [
  'Hey — sensors online.',
  'That tickles the IMU.',
  'Acknowledged. How can I help?',
  'Poke registered. Commentary unlocked.',
]

const SECTION_GREETINGS = {
  hero: ['Welcome aboard.', 'Start at the top — good call.'],
  about: ['This is the human behind the bots.', 'Context first. Always.'],
  experience: ['Shipped work, not just slides.', 'Timeline locked. Scroll for detail.'],
  projects: [
    'Projects ahead — verified builds.',
    'This is what he shipped — proof over pitch.',
  ],
  skills: ['Toolbelt inventory complete.', 'Stack mapped. Ask me anything.'],
  education: ['Credentials stacking up.', 'School → systems. Linear enough.'],
  certifications: [
    'This is what he achieved — verified proof.',
    'Certs worth verifying. I double-checked.',
  ],
  achievements: ['Wins logged. Ego optional.', 'Milestones, not marketing fluff.'],
  contact: ['Ready to connect.', 'Drop a line — I route messages.'],
}

const NUDGE_LINES = [
  'Projects are down that way →',
  'Certifications still unread… just saying.',
  'Stuck? Try the Projects belt.',
]

export function createCommentSystem({
  cooldownMs = COMMENT_COOLDOWN_MS,
  sectionCooldownMs = SECTION_GREETING_COOLDOWN_MS,
} = {}) {
  let lastCommentAt = 0
  let lastSectionAt = 0
  let lastSectionId = null
  let lastLine = ''

  function pick(pool) {
    if (!pool?.length) return null
    let line = pool[Math.floor(Math.random() * pool.length)]
    // Avoid immediate repeat
    if (pool.length > 1 && line === lastLine) {
      line = pool[(pool.indexOf(line) + 1) % pool.length]
    }
    lastLine = line
    return line
  }

  function rateLimited(now = Date.now()) {
    return now - lastCommentAt < cooldownMs
  }

  return {
    canComment(now = Date.now()) {
      return !rateLimited(now)
    },

    idleLine(now = Date.now()) {
      if (rateLimited(now)) return null
      const line = pick(IDLE_LINES)
      if (line) lastCommentAt = now
      return line
    },

    pokeLine(now = Date.now()) {
      if (rateLimited(now)) return null
      const line = pick(POKE_LINES)
      if (line) lastCommentAt = now
      return line
    },

    sectionGreeting(sectionId, now = Date.now()) {
      if (!sectionId) return null
      if (sectionId === lastSectionId && now - lastSectionAt < sectionCooldownMs) return null
      if (rateLimited(now)) return null
      const pool = SECTION_GREETINGS[sectionId]
      const line = pick(pool || IDLE_LINES)
      if (line) {
        lastCommentAt = now
        lastSectionAt = now
        lastSectionId = sectionId
      }
      return line
    },

    nudgeLine(now = Date.now()) {
      if (rateLimited(now)) return null
      const line = pick(NUDGE_LINES)
      if (line) lastCommentAt = now
      return line
    },

    /** Force-clear cooldown (tests / debug). */
    reset() {
      lastCommentAt = 0
      lastSectionAt = 0
      lastSectionId = null
      lastLine = ''
    },
  }
}
