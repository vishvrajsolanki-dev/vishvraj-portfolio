import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const facts = [
    { num: '3+', label: 'ML Internships' },
    { num: '5', label: 'Production Apps' },
    { num: '0.9771', label: 'Best AUC Score' },
    { num: '2029', label: 'Graduation' },
]

export default function About() {
    const sectionRef = useRef(null)

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

        // Label
        tl.fromTo(
            section.querySelector(`.${styles.label}`),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        )

        // Heading
        tl.fromTo(
            section.querySelector(`.${styles.heading}`),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            '-=0.2'
        )

        // Bio paragraphs stagger
        tl.fromTo(
            section.querySelectorAll(`.${styles.bio} p`),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
            '-=0.3'
        )

        // Stat numbers stagger
        tl.fromTo(
            section.querySelectorAll(`.${styles.stat}`),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
            '-=0.2'
        )

        // Skill clusters stagger
        tl.fromTo(
            section.querySelectorAll(`.${styles.cluster}`),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
            '-=0.2'
        )

        // Photo
        tl.fromTo(
            section.querySelector(`.${styles.photoWrap}`),
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
            0.1
        )
    }, { scope: sectionRef })

    return (
        <section className={styles.about} id="about" ref={sectionRef}>
            <div className={styles.container}>

                {/* Section label */}
                <span className={styles.label}>01 — About</span>

                {/* Main grid: text left, photo right */}
                <div className={styles.grid}>

                    {/* LEFT — text content */}
                    <div className={styles.left}>
                        <h2 className={styles.heading}>
                            Building systems<br />
                            <em className={styles.headingItalic}>that think.</em>
                        </h2>

                        <div className={styles.bio}>
                            <p>
                                I'm Vishvrajsinh — an AI & Data Science undergraduate at ADIT,
                                Gujarat, with an obsession for shipping things that actually work.
                                Not notebooks. Not demos. Deployed, live, production-grade systems.
                            </p>
                            <p>
                                My stack runs from PyTorch and XGBoost down to ESP32 firmware —
                                I've built RAG pipelines, fraud detection engines on 1.29M rows,
                                and an RFID-guided robot that earned institutional funding.
                                The through-line is the same: data in, intelligent behaviour out.
                            </p>
                            <p>
                                Currently in my second year, targeting IIT MTech via GATE DA
                                and a senior ML role in fintech by 2033.
                            </p>
                        </div>

                        {/* Stat row */}
                        <div className={styles.stats}>
                            {facts.map((f) => (
                                <div key={f.num} className={styles.stat}>
                                    <span className={styles.statNum}>{f.num}</span>
                                    <span className={styles.statLabel}>{f.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Skill clusters */}
                        <div className={styles.clusters}>
                            <div className={styles.cluster}>
                                <span className={styles.clusterLabel}>ML / AI</span>
                                <div className={styles.tags}>
                                    {['XGBoost', 'PyTorch', 'SHAP', 'RAG', 'LLMs', 'Scikit-learn'].map(t => (
                                        <span key={t} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.cluster}>
                                <span className={styles.clusterLabel}>Infra & Deploy</span>
                                <div className={styles.tags}>
                                    {['Streamlit', 'Docker', 'Render', 'ChromaDB', 'SQLite', 'GCP'].map(t => (
                                        <span key={t} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.cluster}>
                                <span className={styles.clusterLabel}>Hardware</span>
                                <div className={styles.tags}>
                                    {['ESP32', 'C++', 'RFID', 'IMU', 'FreeRTOS', 'A*'].map(t => (
                                        <span key={t} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — photo, edge-bled into background */}
                    <div className={styles.right}>
                        <div className={styles.photoWrap}>
                            <img
                                src="/vishvraj_photo.PNG"
                                alt="Vishvrajsinh Solanki"
                                className={styles.photo}
                            />
                            {/* Gradient blends photo edges into page background */}
                            <div className={styles.fadeTop} />
                            <div className={styles.fadeBottom} />
                            <div className={styles.fadeRight} />
                            <div className={styles.fadeLeft} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
