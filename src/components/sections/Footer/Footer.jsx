import styles from './Footer.module.css';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/vishvrajsolanki-dev' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vishvrajsinh-solanki-1396ab37a/' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.logo}>VS.dev</span>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles.socials}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={styles.socialLink}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copy}>© 2026 Vishvrajsinh Solanki. All rights reserved.</span>
        <span className={styles.built}>Built with React + R3F</span>
      </div>
    </footer>
  );
}
