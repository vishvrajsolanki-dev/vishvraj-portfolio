/**
 * Education / During College entries.
 * mediaType: "document" | "photo"
 */
export const education = {
  degree: 'B.Tech — AI & Data Science',
  school: 'A D Patel Institute of Technology',
  university: 'CVM UNIVERSITY',
  location: 'Anand, Gujarat',
  dates: '2025 — 2029',
  crestSrc: '/logos/adit.png',
  /**
   * One-line swap when campus photo lands.
   * null keeps the translucent placeholder badge.
   */
  campusPhotoSrc: '/photos/adit-campus.jpg',
}

export const duringCollege = [
  {
    id: 'ssip-grant',
    mediaType: 'document',
    logoSrc: '/logos/ssip.png',
    documentSrc: null,
    date: '2026',
    year: '2026',
    title: 'SSIP Grant — Under Review',
    org: 'State Innovation & Startup Policy Cell',
    description:
      'TrackBot AGV selected for state-level recognition. Funding evaluation in progress.',
  },
  {
    id: 'codealpha-internship',
    mediaType: 'document',
    logoSrc: '/logos/codealpha.png',
    documentSrc: null,
    date: 'June 2026',
    year: '2026',
    title: 'ML Internship — CodeAlpha',
    org: 'CodeAlpha · Remote',
    description: 'Built LetterLens, a CNN digit classifier on MNIST.',
  },
  {
    id: 'codsoft-internship',
    mediaType: 'document',
    logoSrc: '/logos/codsoft.png',
    documentSrc: null,
    date: 'May 2026',
    year: '2026',
    title: 'ML Internship — CodSoft',
    org: 'CodSoft · Remote',
    description:
      'Shipped 3 deployed ML apps — PlotSense, a fraud detector, a bank churn predictor.',
  },
  {
    id: 'myjobgrow-internship',
    mediaType: 'document',
    logoSrc: '/logos/iith.png',
    documentSrc: null,
    date: 'Feb – Apr 2026',
    year: '2026',
    title: 'AI & DS Internship — My Job Grow × IIT Hyderabad',
    org: 'My Job Grow · in association with IIT Hyderabad',
    description: 'Completed a 2-month hybrid AI fundamentals program.',
  },
  {
    id: 'cvm-hackathon',
    mediaType: 'photo',
    photoSrc: null,
    date: '2026',
    year: '2026',
    title: 'CVM Hackathon',
    description: 'Represented TrackBot at a university-level hackathon.',
  },
]
