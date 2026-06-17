import styles from './StatsBar.module.css';

const stats = [
  { value: '3+', label: 'ML Internships\nCompleted' },
  { value: '5', label: 'Production Apps\nDeployed' },
  { value: '14', label: 'Days to build\nLexis solo' },
  { value: '99%', label: 'CNN accuracy\non MNIST' },
  { value: '2', label: 'Hardware\nAwards' },
];

export default function StatsBar() {
  return (
    <section className={styles.section}>
      <div className={styles.strip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}