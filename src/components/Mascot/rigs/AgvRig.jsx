import { forwardRef, useMemo, useImperativeHandle, useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * Procedural AGV (Autonomous Guided Vehicle) rig.
 * Relative proportions from reference sheet: L820 × W520 × H320 (~2.56 : 1.63 : 1).
 * Built only from BoxGeometry / CylinderGeometry — no GLB.
 *
 * Named child groups (for TransformTimeline):
 *   body, mast, wheelFL, wheelFR, wheelRL, wheelRR
 */

const BODY = '#2a2438'
const PANEL = '#c8ccd4'
const METAL = '#3a3348'
const GLOW = '#6EE7E0'

function useMats() {
  return useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: BODY,
        roughness: 0.72,
        metalness: 0.35,
        transparent: true,
        opacity: 1,
      }),
      panel: new THREE.MeshStandardMaterial({
        color: PANEL,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 1,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: METAL,
        roughness: 0.45,
        metalness: 0.65,
        transparent: true,
        opacity: 1,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: GLOW,
        emissive: GLOW,
        emissiveIntensity: 1.4,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      }),
      wheel: new THREE.MeshStandardMaterial({
        color: '#1a141f',
        roughness: 0.85,
        metalness: 0.25,
        transparent: true,
        opacity: 1,
      }),
      hub: new THREE.MeshStandardMaterial({
        color: '#5a4a38',
        roughness: 0.45,
        metalness: 0.7,
        transparent: true,
        opacity: 1,
      }),
    }),
    [],
  )
}

const AgvRig = forwardRef(function AgvRig({ visible = true, opacity = 1 }, ref) {
  const root = useRef(null)
  const body = useRef(null)
  const mast = useRef(null)
  const wheelFL = useRef(null)
  const wheelFR = useRef(null)
  const wheelRL = useRef(null)
  const wheelRR = useRef(null)
  const mats = useMats()

  useImperativeHandle(ref, () => ({
    root: root.current,
    body: body.current,
    mast: mast.current,
    wheels: {
      FL: wheelFL.current,
      FR: wheelFR.current,
      RL: wheelRL.current,
      RR: wheelRR.current,
    },
    materials: mats,
    setOpacity(v) {
      Object.values(mats).forEach((m) => {
        m.opacity = v
        m.transparent = v < 1
        m.needsUpdate = true
      })
    },
    dispose() {
      Object.values(mats).forEach((m) => m.dispose())
      root.current?.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
      })
    },
  }))

  useEffect(() => {
    if (opacity === undefined || opacity === null) return
    Object.values(mats).forEach((m) => {
      m.opacity = opacity
      m.transparent = opacity < 1
    })
  }, [opacity, mats])

  // Scene units: length 2.05, width 1.3, height 0.8 (≈ L820/W520/H320)
  const L = 2.05
  const W = 1.3
  const H = 0.8
  const wheelR = 0.28
  const wheelW = 0.18
  const axX = L * 0.32
  const axZ = W * 0.42

  return (
    <group ref={root} visible={visible} name="agvRig" position={[0, wheelR, 0]}>
      {/* Chassis slab */}
      <group ref={body} name="agvBody">
        <mesh castShadow receiveShadow material={mats.body}>
          <boxGeometry args={[L, H * 0.55, W * 0.85]} />
        </mesh>
        {/* Light armor top deck */}
        <mesh position={[0, H * 0.32, 0]} material={mats.panel}>
          <boxGeometry args={[L * 0.92, H * 0.12, W * 0.72]} />
        </mesh>
        {/* Side skirts */}
        <mesh position={[0, -0.05, W * 0.4]} material={mats.panel}>
          <boxGeometry args={[L * 0.7, H * 0.22, 0.06]} />
        </mesh>
        <mesh position={[0, -0.05, -W * 0.4]} material={mats.panel}>
          <boxGeometry args={[L * 0.7, H * 0.22, 0.06]} />
        </mesh>
        {/* Front bumper / faceplate */}
        <mesh position={[L * 0.48, 0, 0]} material={mats.metal}>
          <boxGeometry args={[0.12, H * 0.4, W * 0.7]} />
        </mesh>
        {/* Eye bars */}
        <mesh position={[L * 0.545, 0.08, 0.18]} material={mats.glow}>
          <boxGeometry args={[0.04, 0.06, 0.28]} />
        </mesh>
        <mesh position={[L * 0.545, 0.08, -0.18]} material={mats.glow}>
          <boxGeometry args={[0.04, 0.06, 0.28]} />
        </mesh>
        {/* Side brand plate */}
        <mesh position={[0, 0.05, W * 0.44]} material={mats.metal}>
          <boxGeometry args={[L * 0.35, 0.1, 0.04]} />
        </mesh>
        {/* Glow strip along top */}
        <mesh position={[0, H * 0.4, 0]} material={mats.glow}>
          <boxGeometry args={[L * 0.5, 0.04, 0.08]} />
        </mesh>
      </group>

      {/* RFID / nav mast — folded flat on deck */}
      <group ref={mast} name="agvMast" position={[-0.15, H * 0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh material={mats.metal}>
          <cylinderGeometry args={[0.05, 0.05, 0.55, 8]} />
        </mesh>
        <mesh position={[0, 0.3, 0]} material={mats.glow}>
          <boxGeometry args={[0.14, 0.08, 0.14]} />
        </mesh>
      </group>

      {/* Four mecanum-style wheels */}
      <group ref={wheelFL} name="wheelFL" position={[axX, 0, axZ]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={mats.wheel}>
          <cylinderGeometry args={[wheelR, wheelR, wheelW, 16]} />
        </mesh>
        <mesh material={mats.hub}>
          <cylinderGeometry args={[wheelR * 0.35, wheelR * 0.35, wheelW * 1.15, 8]} />
        </mesh>
      </group>
      <group ref={wheelFR} name="wheelFR" position={[axX, 0, -axZ]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={mats.wheel}>
          <cylinderGeometry args={[wheelR, wheelR, wheelW, 16]} />
        </mesh>
        <mesh material={mats.hub}>
          <cylinderGeometry args={[wheelR * 0.35, wheelR * 0.35, wheelW * 1.15, 8]} />
        </mesh>
      </group>
      <group ref={wheelRL} name="wheelRL" position={[-axX, 0, axZ]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={mats.wheel}>
          <cylinderGeometry args={[wheelR, wheelR, wheelW, 16]} />
        </mesh>
        <mesh material={mats.hub}>
          <cylinderGeometry args={[wheelR * 0.35, wheelR * 0.35, wheelW * 1.15, 8]} />
        </mesh>
      </group>
      <group ref={wheelRR} name="wheelRR" position={[-axX, 0, -axZ]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={mats.wheel}>
          <cylinderGeometry args={[wheelR, wheelR, wheelW, 16]} />
        </mesh>
        <mesh material={mats.hub}>
          <cylinderGeometry args={[wheelR * 0.35, wheelR * 0.35, wheelW * 1.15, 8]} />
        </mesh>
      </group>
    </group>
  )
})

export default AgvRig
