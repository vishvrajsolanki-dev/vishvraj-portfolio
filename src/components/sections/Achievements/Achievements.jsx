import styles from './Achievements.module.css';

const achievements = [
  {
    year: '2026',
    type: 'Institutional Recognition',
    title: 'SSIP — Gujarat Government',
    org: 'State Innovation & Startup Policy Cell',
    detail: 'TrackBot AGV selected for state-level recognition. Grant funding under review.',
    tags: ['ESP32', 'Embedded Systems', 'Robotics', 'IoT', 'SSIP Grant'],
    logo: '/logos/ssip.png',
  },
  {
    year: 'Mar 2026',
    type: 'Hackathon',
    title: 'CVM Hackathon Finalist',
    org: 'CVM University · ADIT',
    detail: 'Finalist — TrackBot AGV Project',
    tags: ['ESP32', 'PID Control', 'C++', 'Hardware', 'Autonomous Systems'],
    logo: '/logos/cvm.png',
  },
  {
    year: '2024',
    type: 'School · National Techfest',
    title: 'SPEC Innovation Award',
    org: 'AIKYAM 1.0 — Sardar Patel College of Engineering',
    detail: 'Innovation award at national-level techfest. Competed during school.',
    tags: ['Innovation', 'AIKYAM', 'National Techfest'],
    logo: '/logos/spec.png',
  },
  {
    year: '2024',
    type: 'School · Competition',
    title: '2nd Place — Model Presentation',
    org: 'Chatkaro 2024 · Charotar Education Society',
    detail: 'Secured 2nd place in model presentation. Competed during school.',
    tags: ['Model Presentation', 'Charotar', 'Competition'],
    logo: '/logos/cems.png',
  },
];

export default function Achievements() {
  return (
    <section className={styles.section} id="achievements">
      <span className={styles.sectionLabel}>09 — Achievements</span>
      <div className={styles.grid}>
        {achievements.map((a, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.logoWrap}>
                <img src={a.logo} alt={a.org} className={styles.logoImg} />
              </div>
              <div className={styles.meta}>
                <span className={styles.year}>{a.year}</span>
                <span className={styles.typeBadge}>{a.type}</span>
              </div>
            </div>
            <div className={styles.body}>
              <h3 className={styles.title}>{a.title}</h3>
              <p className={styles.org}>{a.org}</p>
              <p className={styles.detail}>{a.detail}</p>
            </div>
            <div className={styles.tags}>
              {a.tags.map((t, j) => (
                <span key={j} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
