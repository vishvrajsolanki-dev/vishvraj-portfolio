import styles from './Education.module.css';

const collegeCards = [
  {
    year: '2026',
    title: 'SSIP Grant — Under Review',
    org: 'State Innovation & Startup Policy Cell',
    detail: 'TrackBot AGV selected for state-level recognition. Funding evaluation in progress.',
    logo: '/logos/ssip.png',
  },
  {
    year: 'June 2026',
    title: 'ML Internship — CodeAlpha',
    org: 'CodeAlpha · Remote',
    detail: 'Built LetterLens, a CNN digit classifier on MNIST (99.52% accuracy), and a Random Forest heart disease risk predictor (AUC 0.96).',
    logo: '/logos/codealpha.png',
  },
  {
    year: 'May 2026',
    title: 'ML Internship — CodSoft',
    org: 'CodSoft · Remote',
    detail: 'Shipped 3 deployed ML apps — PlotSense movie genre classifier, an XGBoost fraud detector (ROC-AUC 0.98), and a bank churn predictor.',
    logo: '/logos/codsoft.png',
  },
  {
    year: 'Feb – Apr 2026',
    title: 'AI & DS Internship — My Job Grow × IIT Hyderabad',
    org: 'My Job Grow · in association with IIT Hyderabad',
    detail: 'Completed a 2-month hybrid AI fundamentals program — Python, prompt engineering, and generative AI — recognized as a model intern for fast grasp of concepts and consistent quality across assignments.',
    logo: '/logos/iith.png',
  },
  {
    year: '2026',
    title: 'CVM Hackathon Finalist',
    org: 'CVM University · held at ADIT',
    detail: 'Represented TrackBot AGV at the university-level hackathon. Reached finals.',
    logo: '/logos/adit.png',
  },
  {
    year: '2025',
    title: 'B.Tech AI & Data Science Began',
    org: 'A D Patel Institute of Technology, CVM University',
    detail: 'Started undergraduate degree in AI & Data Science. Expected graduation 2029.',
    logo: '/logos/adit.png',
  },
];

export default function Education() {
  return (
    <section className={styles.section} id="education">
      <span className={styles.sectionLabel}>06 — Education</span>

      <div className={styles.topRow}>
        <div className={styles.institution}>
          <div className={styles.logoBox}>
            <img src="/logos/adit.png" alt="ADIT logo" className={styles.logoImg} />
          </div>
          <div className={styles.degreeInfo}>
            <h2 className={styles.degree}>B.Tech — AI & Data Science</h2>
            <p className={styles.school}>A D Patel Institute of Technology</p>
            <p className={styles.uni}>CVM University · Anand, Gujarat</p>
            <p className={styles.duration}>2025 — 2029</p>
          </div>
        </div>

        <div className={styles.lottieBox}>
          <svg viewBox="0 0 480 160" className={styles.neuralSvg} aria-hidden="true">
            <circle className={styles.node} cx="60" cy="55" r="5" style={{ animationDelay: '0s' }} />
            <circle className={styles.node} cx="60" cy="105" r="5" style={{ animationDelay: '0.4s' }} />
            <circle className={styles.node} cx="180" cy="35" r="5" style={{ animationDelay: '0.2s' }} />
            <circle className={styles.node} cx="180" cy="80" r="5" style={{ animationDelay: '0.6s' }} />
            <circle className={styles.node} cx="180" cy="125" r="5" style={{ animationDelay: '1.0s' }} />
            <circle className={styles.node} cx="300" cy="35" r="5" style={{ animationDelay: '0.4s' }} />
            <circle className={styles.node} cx="300" cy="80" r="5" style={{ animationDelay: '0.8s' }} />
            <circle className={styles.node} cx="300" cy="125" r="5" style={{ animationDelay: '1.2s' }} />
            <circle className={styles.node} cx="420" cy="55" r="5" style={{ animationDelay: '0.6s' }} />
            <circle className={styles.node} cx="420" cy="105" r="5" style={{ animationDelay: '1.0s' }} />
            <line className={styles.edge} x1="65" y1="55" x2="175" y2="35" />
            <line className={styles.edge} x1="65" y1="55" x2="175" y2="80" />
            <line className={styles.edge} x1="65" y1="105" x2="175" y2="80" />
            <line className={styles.edge} x1="65" y1="105" x2="175" y2="125" />
            <line className={styles.edge} x1="185" y1="35" x2="295" y2="35" />
            <line className={styles.edge} x1="185" y1="35" x2="295" y2="80" />
            <line className={styles.edge} x1="185" y1="80" x2="295" y2="35" />
            <line className={styles.edge} x1="185" y1="80" x2="295" y2="80" />
            <line className={styles.edge} x1="185" y1="80" x2="295" y2="125" />
            <line className={styles.edge} x1="185" y1="125" x2="295" y2="80" />
            <line className={styles.edge} x1="185" y1="125" x2="295" y2="125" />
            <line className={styles.edge} x1="305" y1="35" x2="415" y2="55" />
            <line className={styles.edge} x1="305" y1="80" x2="415" y2="55" />
            <line className={styles.edge} x1="305" y1="80" x2="415" y2="105" />
            <line className={styles.edge} x1="305" y1="125" x2="415" y2="105" />
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0s" path="M65,55 L175,35" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.6s" path="M65,105 L175,125" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.3s" path="M185,35 L295,80" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s" path="M185,80 L295,35" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1.4s" path="M185,125 L295,80" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.5s" path="M305,35 L415,55" /></circle>
            <circle className={styles.pulse} r="3"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1.1s" path="M305,125 L415,105" /></circle>
          </svg>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.colLabel}>During College</p>
      <div className={styles.cardTrack}>
        {collegeCards.map((c, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              {c.logo && <img src={c.logo} alt="" className={styles.cardLogo} />}
              <div className={styles.cardHeaderText}>
                <span className={styles.cardYear}>{c.year}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
              </div>
            </div>
            <p className={styles.cardOrg}>{c.org}</p>
            <p className={styles.cardDetail}>{c.detail}</p>
            <span className={styles.cardIndex}>0{i + 1}</span>
          </div>
        ))}
      </div>
      <p className={styles.dragHint}>drag to explore →</p>
    </section>
  );
}
