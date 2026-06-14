import styles from './Experience.module.css'

const experiences = [
    {
        period: 'Jun 2025',
        type: 'Internship',
        company: 'CodSoft',
        role: 'Machine Learning Intern',
        tags: ['Python', 'Scikit-learn', 'Streamlit', 'NLP', 'TF-IDF'],
    },
    {
        period: 'Jul 2025',
        type: 'Internship',
        company: 'CodeAlpha',
        role: 'Machine Learning Intern',
        tags: ['Python', 'ML', 'Streamlit', 'imbalanced-learn', 'Scikit-learn'],
    },
    {
        period: '2025',
        type: 'AI Upskilling Program',
        company: 'My Job Grow × IIT Hyderabad',
        role: 'AI Upskilling Participant',
        tags: ['AI', 'Machine Learning', 'Deep Learning', 'Industry Projects'],
    },
    {
        period: '2024',
        type: 'Institutional Recognition',
        company: 'SSIP — Gujarat Government',
        role: 'Funded Project — TrackBot AGV',
        tags: ['ESP32', 'Embedded Systems', 'Robotics', 'IoT', 'SSIP Grant'],
    },
    {
        period: 'Mar 2026',
        type: 'Hackathon',
        company: 'CVM Hackathon',
        role: 'Winner — TrackBot AGV Project',
        tags: ['ESP32', 'PID Control', 'C++', 'Hardware', 'Autonomous Systems'],
    },
]

export default function Experience() {
    return (
        <section className={styles.experience} id="experience">
            <div className={styles.inner}>

                <div className={styles.header}>
                    <span className={styles.sectionLabel}>02 — Experience</span>
                    <h2 className={styles.heading}>Where I've<br />worked & won.</h2>
                </div>

                <div className={styles.timeline}>
                    {experiences.map((exp) => (
                        <div className={styles.item} key={exp.company + exp.role}>
                            <div className={styles.meta}>
                                <span className={styles.period}>{exp.period}</span>
                                <span className={styles.type}>{exp.type}</span>
                            </div>
                            <div className={styles.content}>
                                <span className={styles.company}>{exp.company}</span>
                                <span className={styles.role}>{exp.role}</span>
                                <div className={styles.tags}>
                                    {exp.tags.map((tag) => (
                                        <span className={styles.tag} key={tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.divider} />
            </div>
        </section>
    )
}