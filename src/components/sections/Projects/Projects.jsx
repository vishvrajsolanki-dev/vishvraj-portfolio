import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../../data/projects';
import styles from './Projects.module.css';
import * as THREE from 'three';
import WebGLErrorBoundary from '../../ui/WebGLErrorBoundary';

gsap.registerPlugin(ScrollTrigger)

const sharedColor = { current: new THREE.Color('#ffffff') };

function ProjectMesh() {
    const matRef = useRef();

    useFrame(() => {
        if (!matRef.current) return;
        matRef.current.color.lerp(sharedColor.current, 0.04);
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1.2} />
            <mesh>
                <torusKnotGeometry args={[0.8, 0.25, 80, 12]} />
                <meshStandardMaterial
                    ref={matRef}
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.6}
                />
            </mesh>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </>
    );
}

export default function Projects() {
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const activeProject = projects[activeIndex];
    const sectionRef = useRef(null);

    // Track whether device is touch-only
    const isTouchDevice = useRef(
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches
    );

    useEffect(() => {
        sharedColor.current = new THREE.Color(activeProject.canvasColor || '#ffffff');
    }, [activeProject]);

    useGSAP(() => {
        const section = sectionRef.current
        if (!section) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true,
            },
        })

        tl.fromTo(
            section.querySelector(`.${styles.header}`),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        )

        tl.fromTo(
            section.querySelectorAll(`.${styles.projectRow}`),
            { opacity: 0, x: -24 },
            { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
            '-=0.2'
        )

        tl.fromTo(
            section.querySelector(`.${styles.canvasPanel}`),
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' },
            0.2
        )
    }, { scope: sectionRef })

    // On touch: first tap activates, second tap navigates
    const handleRowClick = (globalIndex, projectId) => {
        if (isTouchDevice.current) {
            if (activeIndex === globalIndex) {
                navigate('/projects/' + projectId);
            } else {
                setActiveIndex(globalIndex);
            }
        } else {
            navigate('/projects/' + projectId);
        }
    };

    return (
        <section className={styles.section} id="projects" ref={sectionRef}>
            <div className={styles.inner}>

                <div className={styles.header}>
                    <span className={styles.sectionLabel}>03 — Projects</span>
                    <h2 className={styles.heading}>Selected Work</h2>
                </div>

                <div className={styles.splitLayout}>

                    <div className={styles.projectList}>
                        {featured.map((project) => {
                            const globalIndex = projects.indexOf(project);
                            return (
                                <div
                                    key={project.id}
                                    className={`${styles.projectRow} ${styles.featuredRow} ${globalIndex === activeIndex ? styles.active : ''}`}
                                    onMouseEnter={() => !isTouchDevice.current && setActiveIndex(globalIndex)}
                                    onClick={() => handleRowClick(globalIndex, project.id)}
                                >
                                    <div className={styles.rowTop}>
                                        <span className={styles.projectIndex}>
                                            {String(globalIndex + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className={styles.projectTitle}>{project.title}</h3>
                                        <span className={styles.featuredBadge}>Featured</span>
                                        <span className={styles.projectArrow}>↗</span>
                                    </div>
                                    <p className={styles.projectSubtitle}>{project.subtitle}</p>
                                    <div className={styles.tagList}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    {globalIndex === activeIndex && (
                                        <div className={styles.metric}>{project.metric}</div>
                                    )}
                                </div>
                            );
                        })}

                        {others.length > 0 && (
                            <div className={styles.othersDivider}>
                                <span>More Projects</span>
                            </div>
                        )}

                        {others.map((project) => {
                            const globalIndex = projects.indexOf(project);
                            return (
                                <div
                                    key={project.id}
                                    className={`${styles.projectRow} ${styles.compactRow} ${globalIndex === activeIndex ? styles.active : ''}`}
                                    onMouseEnter={() => !isTouchDevice.current && setActiveIndex(globalIndex)}
                                    onClick={() => handleRowClick(globalIndex, project.id)}
                                >
                                    <div className={styles.rowTop}>
                                        <span className={styles.projectIndex}>
                                            {String(globalIndex + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className={styles.projectTitleSmall}>{project.title}</h3>
                                        <span className={styles.projectArrow}>↗</span>
                                    </div>
                                    <div className={styles.tagList}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.canvasPanel}>
                        <div className={styles.canvasWrap}>
                            <WebGLErrorBoundary>
                                <Canvas
                                    frameloop="always"
                                    camera={{ position: [0, 0, 3], fov: 60 }}
                                    dpr={1}
                                    gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                                >
                                    <ProjectMesh />
                                </Canvas>
                            </WebGLErrorBoundary>
                        </div>
                        <div className={styles.previewInfo}>
                            <h4 className={styles.previewTitle}>{activeProject.title}</h4>
                            <p className={styles.previewDesc}>{activeProject.description}</p>
                            <div className={styles.previewLinks}>
                                <button
                                    className={styles.exploreBtn}
                                    onClick={() => navigate('/projects/' + activeProject.id)}
                                >
                                    Explore Project →
                                </button>
                                {activeProject.github && (
                                    <a href={activeProject.github} target="_blank" rel="noreferrer" className={styles.slideLink}>
                                        GitHub ↗
                                    </a>
                                )}
                                {activeProject.live && (
                                    <a href={activeProject.live} target="_blank" rel="noreferrer" className={styles.slideLink}>
                                        Live Demo ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
