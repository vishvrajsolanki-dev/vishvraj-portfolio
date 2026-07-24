import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import WebGLErrorBoundary from '../../ui/WebGLErrorBoundary'
import styles from './Hero.module.css'

function supportsWebGL() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) return false

    // Broken/sandboxed contexts often advertise 0xffff vendor/device and
    // then throw inside THREE.WebGLRenderer — treat them as unsupported.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (dbg) {
      const vendor = String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '')
      const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')
      if (/0xffff/i.test(vendor) || /0xffff/i.test(renderer)) return false
    }

    const buf = gl.createBuffer()
    if (!buf) return false
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0]), gl.STATIC_DRAW)
    const err = gl.getError()
    gl.deleteBuffer(buf)
    if (err !== gl.NO_ERROR) return false

    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

function AbstractHero({ animate }) {
  const groupRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.08
      groupRef.current.rotation.y = t * 0.12
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.05
      innerRef.current.rotation.y = -t * 0.09
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ffffff" />

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2.2, 24, 24]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
        </mesh>

        <mesh ref={innerRef}>
          <sphereGeometry args={[1.6, 18, 18]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.06}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.8, 0.004, 2, 80]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>
    </>
  )
}

/** Static wireframe substitute when WebGL is unavailable. */
function HeroFallback() {
  return (
    <div className={styles.canvasFallback} aria-hidden="true">
      <svg className={styles.fallbackOrb} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="72" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="52" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <ellipse
          cx="100"
          cy="100"
          rx="88"
          ry="28"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="0.5"
          transform="rotate(35 100 100)"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="88"
          ry="28"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
          transform="rotate(-40 100 100)"
        />
      </svg>
      <span className={styles.fallbackScrim} />
    </div>
  )
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  const [webglOk] = useState(() =>
    typeof window !== 'undefined' ? supportsWebGL() : true
  )
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotion = () => setReduceMotion(motionMq.matches)

    window.addEventListener('resize', handleResize)
    motionMq.addEventListener('change', applyMotion)
    return () => {
      window.removeEventListener('resize', handleResize)
      motionMq.removeEventListener('change', applyMotion)
    }
  }, [])

  const canvas = webglOk ? (
    <WebGLErrorBoundary fallback={<HeroFallback />}>
      <Canvas
        frameloop={reduceMotion ? 'never' : 'always'}
        camera={{ position: [0, 0, isMobile ? 8 : 6], fov: isMobile ? 55 : 45 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <AbstractHero animate={!reduceMotion} />
      </Canvas>
    </WebGLErrorBoundary>
  ) : (
    <HeroFallback />
  )

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.canvas}>
        {canvas}
        <span className={styles.canvasA11y}>Decorative 3D preview</span>
      </div>

      <div className={styles.content}>
        <p className={styles.tagline}>AI · Data Science · Embedded Systems</p>
        <h1 className={styles.name}>
          <span>Vishvrajsinh</span>
          <span>Solanki</span>
        </h1>
        <p className={styles.descriptor}>
          Building intelligent systems — from ML pipelines to autonomous hardware.
        </p>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
