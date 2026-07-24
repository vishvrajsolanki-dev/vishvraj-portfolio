import { useCallback, useEffect, useMemo, useState } from 'react'
import BeltCarousel from '../../shared/BeltCarousel/BeltCarousel'
import { duringCollege } from '../../../data/education'
import styles from './DuringCollege.module.css'

const AUTOPLAY_MS = 6000 // 5–8s window — continuous loop onto each card

/** Portrait cinema-rail — full-width stretch, continuous L→R loop */
const CINEMA_LAYOUT = {
  inactiveW: 200,
  activeW: 280,
  focalScale: 1.28,
  slotPad: 48,
  gap: 24,
  cardHeight: 320,
  lift: 18,
  zoneHeight: 440,
  align: 'stretch',
  edgeInset: 32,
}

function DocumentLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        className={styles.lightboxClose}
        aria-label="Close document preview"
        onClick={onClose}
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className={styles.lightboxImg}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function PhotoCardPlaceholder() {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      <svg className={styles.photoSilhouette} viewBox="0 0 240 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cineSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="240" height="300" fill="url(#cineSky)" />
        <path
          d="M0 210 L48 150 L90 185 L130 120 L175 170 L240 140 L240 300 L0 300 Z"
          fill="rgba(255,255,255,0.05)"
        />
        <circle cx="175" cy="78" r="22" fill="rgba(255,255,255,0.04)" />
      </svg>
      <div className={styles.placeholderBadge}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5.5-5.5L9 17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

/** Shared cinema text stack: large year → title → description */
function CinemaOverlay({ item, isActive }) {
  return (
    <div className={styles.cinemaOverlay}>
      <span className={styles.cinemaYear}>{item.year || item.date}</span>
      <span className={styles.cinemaTitle}>{item.title}</span>
      {isActive && item.description && (
        <span className={styles.cinemaDesc}>{item.description}</span>
      )}
    </div>
  )
}

function PhotoCard({ item, isActive, showProgress, cycleKey }) {
  return (
    <div className={`${styles.cinemaCard} ${isActive ? styles.cinemaCardActive : ''}`}>
      {item.photoSrc ? (
        <img src={item.photoSrc} alt={item.title} className={styles.photoBg} />
      ) : (
        <PhotoCardPlaceholder />
      )}
      <div className={styles.cinemaScrim} aria-hidden="true" />
      <CinemaOverlay item={item} isActive={isActive} />
      {isActive && showProgress && (
        <span
          key={cycleKey}
          className={styles.progressSliver}
          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

function DocumentCard({ item, isActive, showProgress, cycleKey }) {
  const hasDoc = Boolean(item.documentSrc)

  return (
    <div className={`${styles.cinemaCard} ${styles.docSurface} ${isActive ? styles.cinemaCardActive : ''}`}>
      {item.logoSrc && (
        <img
          src={item.logoSrc}
          alt=""
          className={styles.logoWatermark}
          aria-hidden="true"
        />
      )}
      <div className={styles.docTop}>
        <img
          src={item.logoSrc}
          alt={item.org || item.title}
          className={styles.logoBadge}
        />
        {hasDoc && (
          <span className={styles.docThumb} aria-hidden="true">
            <img
              src={item.documentSrc}
              alt=""
              className={styles.docThumbImg}
            />
          </span>
        )}
      </div>
      <div className={styles.cinemaScrim} aria-hidden="true" />
      <CinemaOverlay item={item} isActive={isActive} />
      {isActive && showProgress && (
        <span
          key={cycleKey}
          className={styles.progressSliver}
          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default function DuringCollege() {
  const [lightbox, setLightbox] = useState(null)
  const [activeId, setActiveId] = useState(duringCollege[0]?.id)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setIsCoarsePointer(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const activeItem = useMemo(
    () => duringCollege.find((item) => item.id === activeId) || duringCollege[0],
    [activeId]
  )

  const openDocument = useCallback((item) => {
    if (!item?.documentSrc) return
    setLightbox({
      src: item.documentSrc,
      alt: `${item.title} certificate`,
    })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const timelineLabels = useMemo(
    () =>
      duringCollege.map((item) => ({
        id: item.id,
        label: ({
          'ssip-grant': 'SSIP',
          'codealpha-internship': 'Alpha',
          'codsoft-internship': 'CodSoft',
          'myjobgrow-internship': 'IITH',
          'cvm-hackathon': 'CVM',
        })[item.id] || item.year,
      })),
    []
  )

  if (!duringCollege?.length) {
    return (
      <div className={styles.wrap}>
        <p className={styles.colLabel}>During College</p>
        <p className={styles.emptyHint}>No entries yet.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.railHeader}>
        <p className={styles.colEyebrow}>Timeline</p>
        <h3 className={styles.colTitle}>During College</h3>
      </div>

      <BeltCarousel
        items={duringCollege}
        autoAdvanceMs={AUTOPLAY_MS}
        loop
        initialActiveId={duringCollege[0].id}
        onActiveChange={setActiveId}
        ariaLabel="During college experiences"
        className={styles.belt}
        showRail={false}
        showProgress
        pauseOnHover={false}
        layout={CINEMA_LAYOUT}
        getCardClassName={(item, isActive) =>
          `${styles.beltCard} ${
            item.mediaType === 'photo' ? styles.beltCardPhoto : styles.beltCardDoc
          } ${isActive ? styles.beltCardActive : ''}`
        }
        getCardStyle={() => ({
          background: 'transparent',
          borderColor: 'transparent',
          boxShadow: 'none',
          padding: 0,
          borderRadius: 22,
        })}
        renderCard={(item, isActive, { showProgress, cycleKey }) =>
          item.mediaType === 'photo' ? (
            <PhotoCard
              item={item}
              isActive={isActive}
              showProgress={showProgress}
              cycleKey={cycleKey}
            />
          ) : (
            <DocumentCard
              item={item}
              isActive={isActive}
              showProgress={showProgress}
              cycleKey={cycleKey}
            />
          )
        }
      />

      {/* Timeline axis under the rail */}
      <div className={styles.timeline} aria-hidden="true">
        <span className={styles.timelineLine} />
        <div className={styles.timelineMarks}>
          {timelineLabels.map((t) => (
            <span
              key={t.id}
              className={`${styles.timelineMark} ${
                t.id === activeId ? styles.timelineMarkActive : ''
              }`}
            >
              <span className={styles.timelineTick} />
              <span className={styles.timelineYear}>{t.label}</span>
            </span>
          ))}
        </div>
        <span
          className={styles.timelineDot}
          style={{
            left: `${
              (timelineLabels.findIndex((t) => t.id === activeId) /
                Math.max(timelineLabels.length - 1, 1)) *
              100
            }%`,
          }}
        />
      </div>

      <div className={styles.railActions}>
        <p className={styles.dragHint}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M8 12h8M7 9l-3 3 3 3M17 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isCoarsePointer ? 'Swipe to explore' : 'Click a card to explore'}
        </p>
        {activeItem?.documentSrc && (
          <button
            type="button"
            className={styles.docOpenBtn}
            onClick={() => openDocument(activeItem)}
          >
            View certificate
          </button>
        )}
      </div>

      {lightbox && (
        <DocumentLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={closeLightbox}
        />
      )}
    </div>
  )
}
