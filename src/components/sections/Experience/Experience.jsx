import styles from './Experience.module.css'

const experiences = [
    {
        id: '04',
        role: 'SSIP Funded Project — TrackBot AGV',
        company: 'SSIP Cell · Gujarat Government',
        logo: '/logos/ssip.png',
        badge: 'Institutionally Funded',
        period: '2024 — Present',
        location: 'ADIT, Gujarat',
        bullets: [
            'Deployed an RFID-guided AGV at CVM Hackathon 2026 (ESP32, PWM motor control, IR line-following, HTTP telemetry); recognized by the SSIP Cell for institutional-funded redevelopment.',
            'Scaling to dual-core ESP32-S3 with mecanum drive, A* pathfinding, multi-sensor fusion (encoder odometry + RFID + MPU6050 IMU), and WebSocket dashboard with sub-50ms latency.',
            'Layered an AI/ML/DS stack on the robot — logged per-run sensor telemetry (Python + SQLite); trained a KNN floor-surface classifier on IR logs replacing hardcoded thresholds; implemented path deviation analysis comparing planned A* routes vs actual encoder paths to auto-adjust grid weights.',
        ],
        tags: ['ESP32', 'C++', 'Python', 'SQLite', 'KNN', 'A* Pathfinding', 'RFID', 'IMU', 'WebSocket'],
        links: [],
    },
    {
        id: '03',
        role: 'AI & Data Science Intern',
        company: 'IIT Hyderabad',
        companySecondary: 'via My Job Grow',
        logo: '/logos/iith.png',
        badge: 'Letter of Recommendation Awarded',
        period: 'Feb 2026 — Apr 2026',
        location: 'India (Remote)',
        bullets: [
            'Engineered end-to-end AI pipelines across real-world capstone projects — supervised learning, clustering, and cloud-based model development to extract actionable business insights.',
            'Developed and deployed scalable ML, deep learning, and reinforcement learning models on Google Cloud Platform, spanning data ingestion, preprocessing, training, evaluation, and production deployment.',
            'Awarded Letter of Recommendation for outstanding AI competence — recognized for mastery of AI fundamentals, prompt engineering, and generative AI.',
        ],
        tags: ['Python', 'Pandas', 'scikit-learn', 'Google Cloud AI', 'Generative AI', 'Prompt Engineering', 'Deep Learning'],
        links: [],
    },
    {
        id: '02',
        role: 'Machine Learning Intern',
        company: 'CodSoft',
        logo: '/logos/codsoft.png',
        badge: 'ISO 9001:2015 · MSME Registered',
        period: 'May 2026',
        location: 'Remote',
        bullets: [
            'Built PlotSense — NLP genre classifier on 54,214 IMDB plot summaries across 27 classes; TF-IDF (50k features, bigrams, sublinear_tf) + Logistic Regression (C=5, lbfgs) achieving 60.25% accuracy; bigrams capture multi-word genre signals like "serial killer" and "love story" that unigrams miss.',
            'Engineered Credit Card Fraud Detection on 1.29M transactions (0.58% fraud rate) — addressed class imbalance with SMOTE, expanding training set to 2.57M samples; XGBoost hit ROC-AUC 0.9771 and 88% fraud recall on 555K test rows; trained in 17.4 seconds with n_jobs=-1.',
            'Built Bank Customer Churn Prediction on 10K customer profiles — GradientBoostingClassifier (200 estimators, lr=0.05, depth=4) with artifact-consistent preprocessing; ROC-AUC 0.87 · Accuracy 86.45%; surfaced Age, Balance, and NumOfProducts as top churn drivers.',
            'All 3 projects follow a 4-script modular architecture (preprocess → train → evaluate → serve) with Streamlit UIs, joblib serialization, and GitHub version control — deployed as a monorepo on Streamlit Cloud.',
        ],
        tags: ['Python', 'XGBoost', 'GradientBoosting', 'TF-IDF', 'SMOTE', 'NLTK', 'scikit-learn', 'Streamlit', 'pandas', 'NumPy', 'imbalanced-learn'],
        links: [
            { label: 'PlotSense Live', url: 'https://codsoft-hgjtjwr3a4okoiqyowd8ut.streamlit.app/' },
            { label: 'GitHub Repo', url: 'https://github.com/vishvrajsolanki-dev/CODSOFT' },
        ],
    },
    {
        id: '01',
        role: 'Machine Learning Intern',
        company: 'CodeAlpha',
        logo: '/logos/codealpha.png',
        badge: 'MSME Registered',
        period: 'Jun 2026',
        location: 'Remote',
        bullets: [
            'Built LetterLens — handwritten character recognition on EMNIST Balanced (47 classes, 112K samples); CNN with BatchNorm + Dropout achieving 99% accuracy on MNIST; live drawing canvas on Streamlit for real-time inference.',
            'Built Heart Disease Predictor on UCI Cleveland dataset — 4-model comparative pipeline (LR, Decision Tree, Random Forest, XGBoost) with cold-start auto-build; best model (Random Forest) hit ROC-AUC 0.9637 · Accuracy 86.9% · F1 0.8852 on held-out test set.',
            'Built Credit Scoring Model on German Credit Dataset (1,000 applicants, 48 one-hot features) — 4-model pipeline with SHAP, clean human-readable dropdowns, and a `fmt_feature()` formatter converting raw encoded column names to professional labels; Random Forest won (AUC 0.758).',
            'Engineered SHAP explainability end-to-end on deployed Streamlit apps — KernelExplainer with format-safe extraction handling SHAP 0.52.0\'s changed return format; live per-prediction feature importance charts.',
            'Deployed all apps on Streamlit Cloud with cold-start pipelines — zero committed model binaries, self-building on any fresh deploy using subprocess orchestration of preprocess → train → evaluate.',
        ],
        tags: ['Python', 'Streamlit', 'scikit-learn', 'XGBoost', 'SHAP', 'Random Forest', 'pandas', 'joblib', 'Streamlit Cloud'],
        links: [
            { label: 'LetterLens App', url: '#' },
            { label: 'Heart Disease App', url: 'https://codealphaheartdiseaseprediction-ypddp926uffnkst6sagsnr.streamlit.app/' },
            { label: 'Credit Scoring App', url: 'https://codealphacreditscoringmodel-vbbirvx3mupqfimvpsnk4x.streamlit.app/' },
        ],
    },
]

export default function Experience() {
    return (
        <section className={styles.experience} id="experience">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.label}>02 — Experience</span>
                    <h2 className={styles.title}>Where I've Built</h2>
                </div>

                <div className={styles.timeline}>
                    {experiences.map((exp) => (
                        <div key={exp.id} className={styles.entry}>

                            {/* Left column — meta */}
                            <div className={styles.meta}>
                                <span className={styles.number}>{exp.id}</span>
                                <div className={styles.metaContent}>
                                    <span className={styles.period}>{exp.period}</span>
                                    <span className={styles.location}>{exp.location}</span>
                                </div>
                            </div>

                            {/* Right column — content */}
                            <div className={styles.content}>
                                <div className={styles.titleRow}>
                                    {exp.logo && (
                                        <img
                                            src={exp.logo}
                                            alt={exp.company}
                                            className={styles.logo}
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                    )}
                                    <h3 className={styles.role}>{exp.role}</h3>
                                    <div className={styles.companyGroup}>
                                        <span className={styles.company}>{exp.company}</span>
                                        {exp.companySecondary && (
                                            <span className={styles.companySecondary}>{exp.companySecondary}</span>
                                        )}
                                    </div>
                                    {exp.badge && <span className={styles.badge}>{exp.badge}</span>}
                                </div>

                                <ul className={styles.bullets}>
                                    {exp.bullets.map((bullet, i) => (
                                        <li key={i} className={styles.bullet}>{bullet}</li>
                                    ))}
                                </ul>

                                <div className={styles.footer}>
                                    <div className={styles.tags}>
                                        {exp.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>

                                    {exp.links.length > 0 && (
                                        <div className={styles.links}>
                                            {exp.links.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.link}
                                                >
                                                    <span>{link.label}</span>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}