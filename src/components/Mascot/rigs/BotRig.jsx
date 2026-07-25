import { forwardRef, useMemo, useImperativeHandle, useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * Procedural Bot (humanoid) TrackBot rig.
 * Relative proportions from reference sheet: L520 × W480 × H985 (~1.06 : 1 : 2.05).
 * Primitive budget mirrors AgvRig for believable transform part correspondence.
 *
 * Named groups: torso, head, armL, armR, legL, legR, antenna
 */

const ARMOR = '#e8eaef'
const CHASSIS = '#1a1520'
const JOINT = '#121018'
const GLOW = '#6EE7E0'

function useMats() {
  return useMemo(
    () => ({
      armor: new THREE.MeshStandardMaterial({
        color: ARMOR,
        roughness: 0.55,
        metalness: 0.25,
        transparent: true,
        opacity: 1,
      }),
      chassis: new THREE.MeshStandardMaterial({
        color: CHASSIS,
        roughness: 0.7,
        metalness: 0.4,
        transparent: true,
        opacity: 1,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: JOINT,
        roughness: 0.5,
        metalness: 0.6,
        transparent: true,
        opacity: 1,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: GLOW,
        emissive: GLOW,
        emissiveIntensity: 1.6,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      }),
    }),
    [],
  )
}

function Limb({ mats, upper = [0.22, 0.45, 0.22], lower = [0.18, 0.4, 0.18], hand = true }) {
  return (
    <group>
      <mesh position={[0, -upper[1] / 2, 0]} material={mats.armor}>
        <boxGeometry args={upper} />
      </mesh>
      <mesh position={[0, -upper[1], 0]} material={mats.joint}>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
      <mesh position={[0, -upper[1] - lower[1] / 2, 0]} material={mats.armor}>
        <boxGeometry args={lower} />
      </mesh>
      {hand && (
        <mesh position={[0, -upper[1] - lower[1] - 0.08, 0]} material={mats.joint}>
          <boxGeometry args={[0.16, 0.14, 0.12]} />
        </mesh>
      )}
    </group>
  )
}

const BotRig = forwardRef(function BotRig({ visible = true, opacity = 1, pose = 'idle' }, ref) {
  const root = useRef(null)
  const torso = useRef(null)
  const head = useRef(null)
  const armL = useRef(null)
  const armR = useRef(null)
  const legL = useRef(null)
  const legR = useRef(null)
  const antenna = useRef(null)
  const mats = useMats()

  useImperativeHandle(ref, () => ({
    root: root.current,
    torso: torso.current,
    head: head.current,
    armL: armL.current,
    armR: armR.current,
    legL: legL.current,
    legR: legR.current,
    antenna: antenna.current,
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

  // Total height ≈ 2.46 (H985 relative to AGV H320 @ 0.8 → 0.8 * 985/320 ≈ 2.46)
  const sleep = pose === 'sleep'

  return (
    <group
      ref={root}
      visible={visible}
      name="botRig"
      position={[0, sleep ? 0.15 : 0, 0]}
      rotation={[sleep ? 0.15 : 0, 0, 0]}
      scale={sleep ? 0.96 : 1}
    >
      {/* Legs */}
      <group ref={legL} name="legL" position={[0.28, 1.05, 0]}>
        <Limb
          mats={mats}
          upper={[0.28, 0.5, 0.3]}
          lower={[0.24, 0.48, 0.28]}
          hand={false}
        />
        {/* Foot with integrated wheel hint */}
        <mesh position={[0, -1.05, 0.05]} material={mats.armor}>
          <boxGeometry args={[0.32, 0.14, 0.42]} />
        </mesh>
        <mesh position={[0, -1.0, -0.12]} rotation={[0, 0, Math.PI / 2]} material={mats.joint}>
          <cylinderGeometry args={[0.12, 0.12, 0.14, 10]} />
        </mesh>
      </group>
      <group ref={legR} name="legR" position={[-0.28, 1.05, 0]}>
        <Limb
          mats={mats}
          upper={[0.28, 0.5, 0.3]}
          lower={[0.24, 0.48, 0.28]}
          hand={false}
        />
        <mesh position={[0, -1.05, 0.05]} material={mats.armor}>
          <boxGeometry args={[0.32, 0.14, 0.42]} />
        </mesh>
        <mesh position={[0, -1.0, -0.12]} rotation={[0, 0, Math.PI / 2]} material={mats.joint}>
          <cylinderGeometry args={[0.12, 0.12, 0.14, 10]} />
        </mesh>
      </group>

      {/* Torso — AGV chassis correspondence */}
      <group ref={torso} name="botTorso" position={[0, 1.55, 0]}>
        <mesh material={mats.armor}>
          <boxGeometry args={[0.85, 0.7, 0.55]} />
        </mesh>
        <mesh position={[0, -0.05, 0.28]} material={mats.chassis}>
          <boxGeometry args={[0.55, 0.2, 0.04]} />
        </mesh>
        {/* Chest glow line */}
        <mesh position={[0, 0.15, 0.29]} material={mats.glow}>
          <boxGeometry args={[0.45, 0.04, 0.03]} />
        </mesh>
        {/* Waist plate AGV-T1 */}
        <mesh position={[0, -0.42, 0.05]} material={mats.chassis}>
          <boxGeometry args={[0.7, 0.18, 0.4]} />
        </mesh>
        {/* Shoulder pads */}
        <mesh position={[0.5, 0.28, 0]} material={mats.armor}>
          <boxGeometry args={[0.22, 0.16, 0.35]} />
        </mesh>
        <mesh position={[-0.5, 0.28, 0]} material={mats.armor}>
          <boxGeometry args={[0.22, 0.16, 0.35]} />
        </mesh>
      </group>

      {/* Head */}
      <group ref={head} name="botHead" position={[0, 2.1, 0]}>
        <mesh material={mats.armor}>
          <boxGeometry args={[0.48, 0.38, 0.4]} />
        </mesh>
        <mesh position={[0, 0, 0.18]} material={mats.chassis}>
          <boxGeometry args={[0.42, 0.28, 0.08]} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.1, 0.02, 0.23]} rotation={[Math.PI / 2, 0, 0]} material={mats.glow}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
        </mesh>
        <mesh position={[-0.1, 0.02, 0.23]} rotation={[Math.PI / 2, 0, 0]} material={mats.glow}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
        </mesh>
        {/* Antennae */}
        <group ref={antenna} name="antenna">
          <mesh position={[0.16, 0.28, 0]} material={mats.joint}>
            <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
          </mesh>
          <mesh position={[-0.16, 0.28, 0]} material={mats.joint}>
            <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
          </mesh>
        </group>
      </group>

      {/* Arms */}
      <group
        ref={armL}
        name="armL"
        position={[0.62, 1.75, 0]}
        rotation={[sleep ? 0.4 : 0.15, 0, sleep ? 0.3 : 0.2]}
      >
        <Limb mats={mats} />
      </group>
      <group
        ref={armR}
        name="armR"
        position={[-0.62, 1.75, 0]}
        rotation={[sleep ? 0.4 : 0.15, 0, sleep ? -0.3 : -0.2]}
      >
        <Limb mats={mats} />
      </group>
    </group>
  )
})

export default BotRig
