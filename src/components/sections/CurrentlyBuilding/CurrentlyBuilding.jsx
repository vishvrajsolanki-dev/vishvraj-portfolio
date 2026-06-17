import styles from './CurrentlyBuilding.module.css';

const building = [
  {
    title: 'ARC — Adaptive Risk & Clarity Engine',
    desc: 'Monte Carlo + ML + RAG fintech platform for Indian retail investors. Real-time risk profiling, portfolio simulation, and plain-language financial intelligence.',
    stack: ['Monte Carlo', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
    status: 'In Design',
    color: '#7B61FF',
  },
  {
    title: 'LetterLens v2',
    desc: 'Upgrading from MNIST to EMNIST Balanced — 47-class handwritten character recognition with improved CNN architecture and live drawing canvas.',
    stack: ['CNN', 'EMNIST', 'TensorFlow', 'Streamlit'],
    status: 'In Progress',
    color: '#FFB800',
  },
  {
    title: 'TrackBot AGV v2',
    desc: 'Upgrading from ESP32 to ESP32-S3 with mecanum drive, A* pathfinding, RFID navigation, and multi-sensor fusion. SSIP funding push in progress.',
    stack: ['ESP32-S3', 'C++', 'A* Pathfinding', 'RFID', 'FreeRTOS'],
    status: 'Active Build',
    color: '#FF6B35',
  },
];

export default function CurrentlyBuilding() {
  return (
    <section className={styles.section}>
      <span className={styles.sectionLabel}>09 — Currently Building</span>
      <h2 className={styles.heading}>What's Next</h2>
      <div className={styles.grid}>
        {building.map((b) => (
          <div key={b.title} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.pulse} style={{ background: b.color }} />
              <span className={styles.status}>{b.status}</span>
            </div>
            <h3 className={styles.title}>{b.title}</h3>
            <p className={styles.desc}>{b.desc}</p>
            <div className={styles.stack}>
              {b.stack.map((s) => (
                <span key={s} className={styles.tag}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
