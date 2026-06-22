import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import WebGLErrorBoundary from "../../ui/WebGLErrorBoundary";
import styles from './Hero.module.css'

function AbstractHero() {
    const groupRef = useRef()
    const innerRef = useRef()

    useFrame((state) => {
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
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.06} roughness={0.1} metalness={0.9} />
                </mesh>

                <mesh rotation={[Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[2.8, 0.004, 2, 80]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
                </mesh>
            </group>
        </>
    )
}

export default function Hero() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <section className={styles.hero} id="hero">
            <div className={styles.canvas}>
                <WebGLErrorBoundary>
                    <Canvas
                        frameloop="always"
                        camera={{ position: [0, 0, isMobile ? 8 : 6], fov: isMobile ? 55 : 45 }}
                        dpr={1}
                        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <AbstractHero />
                    </Canvas>
                </WebGLErrorBoundary>
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