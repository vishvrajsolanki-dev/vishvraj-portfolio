import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const links = [
    { label: 'About', href: 'about' },
    { label: 'Experience', href: 'experience' },
    { label: 'Projects', href: 'projects' },
    { label: 'Skills', href: 'skills' },
    { label: 'Education', href: 'education' },
    { label: 'Certifications', href: 'certifications' },
    { label: 'Achievements', href: 'achievements' },
    { label: 'Building', href: 'currently-building' },
];

function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

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
                        <button
                            className={styles.link}
                            onClick={() => scrollTo(l.href)}
                        >
                            {l.label}
                        </button>
                    </li>
                ))}
            </ul>

            <button className={styles.cta} onClick={() => scrollTo('contact')}>
                Let's Talk
            </button>

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
                        <button
                            key={l.href}
                            className={styles.mobileLink}
                            onClick={() => { scrollTo(l.href); setMenuOpen(false); }}
                        >
                            {l.label}
                        </button>
                    ))}
                    <button
                        className={styles.mobileCta}
                        onClick={() => { scrollTo('contact'); setMenuOpen(false); }}
                    >
                        Let's Talk
                    </button>
                </div>
            )}
        </nav>
    );
}