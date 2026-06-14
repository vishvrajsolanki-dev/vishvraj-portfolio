import styles from './About.module.css'

const stats = [
    { number: '3+', label: 'ML Internships Completed' },
    { number: '5', label: 'Production Apps Deployed' },
    { number: '14', label: 'Days to build Lexis solo' },
    { number: '99%', label: 'CNN accuracy on MNIST' },
]

export default function About() {
    return (
        <section className={styles.about} id="about">
            <div className={styles.inner}>

                <div className={styles.left}>
                    <span className={styles.sectionLabel}>01 — About</span>
                    <h2 className={styles.heading}>
                        Engineer.<br />Builder.<br />Researcher.
                    </h2>
                    <p className={styles.body}>
                        I'm a <strong>second-year B.Tech student</strong> in AI & Data Science
                        at ADIT, Gujarat — building production-grade ML systems and
                        autonomous hardware that solves real problems.
                    </p>
                    <p className={styles.body}>
                        From <strong>NLP pipelines and RAG systems</strong> to
                        <strong> ESP32-powered AGVs</strong>, I work across the full stack
                        of intelligent systems — model to metal.
                    </p>
                    <p className={styles.body}>
                        Currently seeking <strong>AI/ML/Data Science internships</strong> where
                        I can ship things that matter.
                    </p>
                </div>

                <div className={styles.right}>
                    {stats.map((stat) => (
                        <div className={styles.statCard} key={stat.label}>
                            <span className={styles.statNumber}>{stat.number}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>

            </div>
            <div className={styles.divider} />
        </section>
    )
}