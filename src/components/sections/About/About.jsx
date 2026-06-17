import styles from './About.module.css'

const facts = [
    { num: '3+', label: 'ML Internships' },
    { num: '5', label: 'Production Apps' },
    { num: '0.9771', label: 'Best AUC Score' },
    { num: '2029', label: 'Graduation' },
]

export default function About() {
    return (
        <section className={styles.about} id="about">
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