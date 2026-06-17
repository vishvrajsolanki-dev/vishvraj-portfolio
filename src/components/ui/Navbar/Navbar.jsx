import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const links = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Building', href: '#currently-building' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <a href="/" className={styles.logo}>
                <span className={styles.logoVS}>VS</span>
                <span className={styles.logoDot}>.dev</span>
            </a>

            {/* Desktop links */}
            <ul className={styles.links}>
                {links.map((l) => (
                    <li key={l.href}>
                        <a href={l.href} className={styles.link}>{l.label}</a>
                    </li>
                ))}
            </ul>

            <a href="#contact" className={styles.cta}>Let's Talk</a>

            {/* Mobile hamburger */}
            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
                <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
                <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className={styles.mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a href="#contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
                        Let's Talk
                    </a>
                </div>
            )}
        </nav>
    );
}