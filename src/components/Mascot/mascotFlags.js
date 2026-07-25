/** Feature flags from URL. ?mascot=1 required; ?mascot_transform=0 disables transform only. */
export function readMascotFlags(search = typeof window !== 'undefined' ? window.location.search : '') {
  const params = new URLSearchParams(search)
  const enabled = params.get('mascot') === '1'
  const transformParam = params.get('mascot_transform')
  const transformEnabled = transformParam !== '0'
  return { enabled, transformEnabled }
}

/** Low-end / reduced-motion gate — static Bot, no AGV/transform. */
export function detectLowCapability({
  matchMedia = typeof window !== 'undefined' ? window.matchMedia?.bind(window) : undefined,
  hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined,
} = {}) {
  const reduced = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  const cores = hardwareConcurrency
  const lowCores = typeof cores === 'number' && cores > 0 && cores <= 2
  return reduced || lowCores
}
