import { useRef, useMemo, useImperativeHandle, forwardRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Lightweight transform VFX: THREE.Points burst + single emissive flash plane.
 * No particle engine dependency. Single pulse only (no strobing / <3Hz).
 * Halve particle count below 480px; shake is owned by TransformTimeline.
 */
const GLOW = '#6EE7E0'

const VfxBurst = forwardRef(function VfxBurst({ particleCount: countProp }, ref) {
  const pointsRef = useRef(null)
  const flashRef = useRef(null)
  const active = useRef(false)
  const life = useRef(0)

  const isNarrow =
    typeof window !== 'undefined' && window.innerWidth < 480
  const count = countProp ?? (isNarrow ? 24 : 48)

  const { positions, velocities, geometry, material, flashMat } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 1.2
      positions[i * 3 + 2] = 0
      velocities[i * 3] = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: GLOW,
      size: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const flashMat = new THREE.MeshBasicMaterial({
      color: GLOW,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    return { positions, velocities, geometry, material, flashMat }
  }, [count])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      flashMat.dispose()
    }
  }, [geometry, material, flashMat])

  useImperativeHandle(ref, () => ({
    trigger() {
      active.current = true
      life.current = 0
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.3
        positions[i * 3 + 1] = 1.0 + Math.random() * 0.6
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
        const speed = 1.2 + Math.random() * 2.2
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI * 0.6
        velocities[i * 3] = Math.cos(theta) * Math.sin(phi) * speed
        velocities[i * 3 + 1] = Math.cos(phi) * speed * 0.8 + 0.5
        velocities[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * speed
      }
      geometry.attributes.position.needsUpdate = true
      material.opacity = 1
      // Single emissive flash pulse (~180ms) — not a white-out, not strobing
      gsap.killTweensOf(flashMat)
      flashMat.opacity = 0
      gsap
        .timeline()
        .to(flashMat, { opacity: 0.55, duration: 0.08, ease: 'power2.out' })
        .to(flashMat, { opacity: 0, duration: 0.18, ease: 'power2.in' })
    },
    dispose() {
      gsap.killTweensOf(flashMat)
      geometry.dispose()
      material.dispose()
      flashMat.dispose()
    },
  }))

  useFrame((_, dt) => {
    if (!active.current) return
    life.current += dt
    const t = Math.min(1, life.current / 0.7)
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * dt
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt
      velocities[i * 3 + 1] -= 2.5 * dt
    }
    geometry.attributes.position.needsUpdate = true
    material.opacity = 1 - t
    if (t >= 1) {
      active.current = false
      material.opacity = 0
    }
  })

  return (
    <group name="vfxBurst">
      <points ref={pointsRef} geometry={geometry} material={material} />
      <mesh ref={flashRef} position={[0, 1.2, 0]} renderOrder={10}>
        <planeGeometry args={[3.2, 3.2]} />
        <primitive object={flashMat} attach="material" />
      </mesh>
    </group>
  )
})

export default VfxBurst
