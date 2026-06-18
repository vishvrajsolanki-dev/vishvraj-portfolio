import styles from './Certifications.module.css';

const issuers = [
  {
    name: 'Anthropic Academy',
    logoUrl: '/logos/anthropic.png',
    logoAlt: 'Anthropic',
    certs: [
      { title: 'Claude 101', date: 'Jun 2026', href: 'https://verify.skilljar.com/c/6szg665kh7a6' },
      { title: 'Claude Code 101', date: 'Jun 2026', href: 'https://verify.skilljar.com/c/vpp4pc9vvj8x' },
      { title: 'Introduction to Model Context Protocol', date: 'Jun 2026', href: 'https://verify.skilljar.com/c/5khygb3xbu3j' },
      { title: 'Model Context Protocol: Advanced Topics', date: 'Jun 2026', href: 'https://verify.skilljar.com/c/q99jeipycn3f' },
    ],
  },
  {
    name: 'Google Cloud',
    logoUrl: '/logos/gcloud.png',
    logoAlt: 'Google Cloud',
    certs: [
      { title: 'Introduction to Large Language Models', date: 'Jun 2026', href: 'https://simpli-web.app.link/e/fyTnSuhRV3b' },
    ],
  },
  {
    name: 'Microsoft',
    logoUrl: null,
    logoSvg: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
        <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
      </svg>
    ),
    logoAlt: 'Microsoft',
    certs: [
      { title: 'Data Analyst 101', date: 'Jun 2026', href: 'https://simpli-web.app.link/e/05ryeInRV3b' },
    ],
  },
  {
    name: 'IIT Hyderabad × My Job Grow',
    logoUrl: '/logos/iith.png',
    logoAlt: 'IIT Hyderabad',
    certs: [
      { title: 'AI Upskilling & Internship Completion', date: 'Apr 2026', href: 'https://drive.google.com/file/d/1TOmQwsgZIQgY43x3p8x_hA3RaTk6fgdr/view?usp=sharing' },
    ],
  },
];

export default function Certifications() {
  return (
    <section className={styles.section} id="certifications">
      <span className={styles.sectionLabel}>08 — Certifications</span>
      <div className={styles.grid}>
        {issuers.map((issuer, i) => (
          <div key={i} className={styles.issuerCard}>
            <div className={styles.issuerHeader}>
              <div className={styles.logoWrap}>
                {issuer.logoSvg ? (
                  issuer.logoSvg
                ) : issuer.logoInitials ? (
                  <span className={styles.logoInitials}>{issuer.logoInitials}</span>
                ) : (
                  <img src={issuer.logoUrl} alt={issuer.logoAlt} className={styles.logoImg} />
                )}
              </div>
              <span className={styles.issuerName}>{issuer.name}</span>
              <span className={styles.certCount}>{issuer.certs.length} cert{issuer.certs.length > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.certList}>
              {issuer.certs.map((cert, j) => (
                <div key={j} className={styles.certRow}>
                  <div className={styles.certInfo}>
                    <span className={styles.certTitle}>{cert.title}</span>
                    <span className={styles.certDate}>{cert.date}</span>
                  </div>
                  <a href={cert.href} target="_blank" rel="noopener noreferrer" className={styles.verifyBtn}>
                    Verify ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}