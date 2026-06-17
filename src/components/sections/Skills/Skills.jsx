import { useRef, useEffect } from 'react';
import styles from './Skills.module.css';

const services = [
    {
        num: '01',
        title: 'ML Engineering',
        skills: ['Scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'SHAP', 'Keras', 'Random Forest', 'SVM', 'SMOTE'],
    },
    {
        num: '02',
        title: 'NLP & LLM Integration',
        skills: ['LangChain', 'Groq LLMs', 'RAG Pipelines', 'Llama 3.1', 'NLTK', 'TF-IDF', 'ChromaDB', 'Transformers', 'Prompt Engineering'],
    },
    {
        num: '03',
        title: 'AI App Development',
        skills: ['Streamlit', 'FastAPI', 'Flask', 'Hugging Face', 'SpaCy', 'joblib', 'imbalanced-learn', 'Render', 'Streamlit Cloud'],
    },
    {
        num: '04',
        title: 'Data Analysis & Viz',
        skills: ['Pandas', 'NumPy', 'Plotly', 'Seaborn', 'Matplotlib', 'Power BI', 'SQLite', 'SQL', 'Google Cloud'],
    },
    {
        num: '05',
        title: 'Embedded & IoT',
        skills: ['Arduino', 'FreeRTOS', 'ROS2', 'ESP32', 'MicroPython', 'C++', 'Vector Embeddings', 'MCP Protocol'],
    },
    {
        num: '06',
        title: 'Creative Frontend & 3D',
        skills: ['React', 'Three.js', 'GSAP', 'R3F', 'CSS Modules', 'Vite', 'Docker', 'Git', 'GitHub'],
    },
];

const marqueeRows = [
    ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'XGBoost', 'Keras', 'SHAP', 'SVM', 'Random Forest', 'SMOTE'],
    ['LangChain', 'Groq LLMs', 'RAG Pipelines', 'Llama 3.1', 'NLTK', 'TF-IDF', 'ChromaDB', 'Transformers', 'SpaCy', 'Prompt Engineering'],
    ['Streamlit', 'FastAPI', 'Flask', 'Pandas', 'NumPy', 'Plotly', 'Seaborn', 'Matplotlib', 'Power BI', 'SQLite'],
    ['Arduino', 'FreeRTOS', 'ROS2', 'ESP32', 'C++', 'React', 'Three.js', 'GSAP', 'R3F', 'Docker', 'Git', 'GitHub'],
];

function TiltCard({ children }) {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -8;
            const rotateY = ((x - cx) / cx) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            card.style.boxShadow = `0 0 24px rgba(255,255,255,0.06), 0 0 1px rgba(255,255,255,0.15)`;
        };

        const handleLeave = () => {
            card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            card.style.boxShadow = `none`;
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        return () => {
            card.removeEventListener('mousemove', handleMove);
            card.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    return (
        <div ref={cardRef} className={styles.card}>
            {children}
        </div>
    );
}

export default function Skills() {
    const iframeRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const iframe = iframeRef.current;
        if (!section || !iframe) return;

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            // Send pointer position to Spline via postMessage
            iframe.contentWindow?.postMessage(
                { type: 'mousemove', x: e.clientX, y: e.clientY },
                '*'
            );
        };

        section.addEventListener('mousemove', handleMouseMove);
        return () => section.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className={styles.section} ref={sectionRef}>
            <span className={styles.sectionLabel}>04 — Services & Skills</span>
            <h2 className={styles.heading}>What I Build</h2>

            <div className={styles.servicesLayout}>

                <div className={styles.figureCenter}>
                    <div className={styles.splineWrapper}>
                        <iframe
                            ref={iframeRef}
                            src="https://my.spline.design/genkubgreetingrobot-XAb0RzB8mNapbMFImFTEOVrd/"
                            frameBorder="0"
                            title="robot"
                            style={{ border: 'none', background: 'transparent' }}
                            allow="autoplay"
                        />
                        <div className={styles.splineWatermarkKill} />
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.cardsCol} ${styles.cardsColLeft}`}>
                        {services.slice(0, 3).map((s) => (
                            <TiltCard key={s.num}>
                                <span className={styles.cardNum}>{s.num}</span>
                                <p className={styles.cardTitle}>{s.title}</p>
                                <div className={styles.skillTags}>
                                    {s.skills.map((sk) => (
                                        <span key={sk} className={styles.tag}>{sk}</span>
                                    ))}
                                </div>
                            </TiltCard>
                        ))}
                    </div>

                    <div className={`${styles.cardsCol} ${styles.cardsColRight}`}>
                        {services.slice(3).map((s) => (
                            <TiltCard key={s.num}>
                                <span className={styles.cardNum}>{s.num}</span>
                                <p className={styles.cardTitle}>{s.title}</p>
                                <div className={styles.skillTags}>
                                    {s.skills.map((sk) => (
                                        <span key={sk} className={styles.tag}>{sk}</span>
                                    ))}
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>

            </div>

            <div className={styles.marqueeWrap}>
                {marqueeRows.map((row, i) => (
                    <div key={i} className={styles.marqueeRow}>
                        <div className={`${styles.marqueeInner} ${i % 2 !== 0 ? styles.reverse : ''}`}>
                            {[...row, ...row].map((item, j) => (
                                <span key={j} className={styles.marqueeItem}>{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}