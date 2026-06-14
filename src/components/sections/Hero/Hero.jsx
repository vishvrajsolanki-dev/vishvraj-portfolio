import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Wireframe } from '@react-three/drei'
import * as THREE from 'three'
import styles from './Hero.module.css'

// Abstract geometry fallback — replaces TrackBot GLB until model is ready
function AbstractHero() {
    const sphereRef = useRef()
    const innerRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        sphereRef.current.rotation.x = t * 0.08
        sphereRef.current.rotation.y = t * 0.12
        innerRef.current.rotation.x = -t * 0.05
        innerRef.current.rotation.y = -t * 0.09
    })

    return (
        <>
            {/* Ambient + directional light */}
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ffffff" />

            {/* Outer wireframe sphere */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[2.2, 32, 32]} />
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.08}
                />
            </mesh>

            {/* Mid wireframe sphere */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[1.6, 24, 24]} />
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.12}
                />
            </mesh>

            {/* Solid inner sphere — subtle glow core */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.06}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Orbital ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[2.8, 0.004, 2, 120]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
            </mesh>
        </>
    )
}

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            {/* R3F Canvas */}
            <div className={styles.canvas}>
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <AbstractHero />
                </Canvas>
            </div>

            {/* Text content */}
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

            {/* Scroll hint */}
            <div className={styles.scrollHint}>
                <span>Scroll</span>
                <div className={styles.scrollLine} />
            </div>
        </section>
    )
}