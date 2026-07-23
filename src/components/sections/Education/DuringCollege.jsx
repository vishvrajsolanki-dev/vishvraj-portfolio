import { useCallback, useEffect, useState } from 'react'
import BeltCarousel from '../../shared/BeltCarousel/BeltCarousel'
import { duringCollege } from '../../../data/education'
import styles from './DuringCollege.module.css'

const AUTOPLAY_MS = 6000

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

/** Full-card photo placeholder — full-bleed panel, not a tiny icon badge. */
function PhotoCardPlaceholder() {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      {/* Soft landscape silhouette so the card reads as a photo panel */}
      <svg className={styles.photoSilhouette} viewBox="0 0 260 140" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="260" height="140" fill="url(#sky)" />
        <path
          d="M0 98 L42 72 L78 88 L120 58 L168 82 L210 64 L260 90 L260 140 L0 140 Z"
          fill="rgba(255,255,255,0.06)"
        />
        <circle cx="198" cy="42" r="16" fill="rgba(255,255,255,0.05)" />
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

function PhotoCard({ item, isActive }) {
  const hasPhoto = Boolean(item.photoSrc)

  return (
    <div className={`${styles.photoCard} ${isActive ? styles.photoCardActive : ''}`}>
      {hasPhoto ? (
        <img
          src={item.photoSrc}
          alt={item.title}
          className={styles.photoBg}
        />
      ) : (
        <PhotoCardPlaceholder />
      )}
      <div className={styles.photoScrim} aria-hidden="true" />
      <div className={styles.photoOverlay}>
        <span className={styles.cardDate}>{item.date}</span>
        <span className={styles.cardTitle}>{item.title}</span>
        {isActive && item.description && (
          <span className={styles.cardDesc}>{item.description}</span>
        )}
      </div>
    </div>
  )
}

function DocumentCard({ item, isActive, onOpenDocument }) {
  const hasDoc = Boolean(item.documentSrc)

  return (
    <div
      className={`${styles.docCard} ${isActive ? styles.docCardActive : ''}`}
    >
      <div className={styles.docTop}>
        <img
          src={item.logoSrc}
          alt={item.org || item.title}
          className={styles.logoBadge}
        />
        {hasDoc && (
          <span
            className={styles.docThumb}
            role="button"
            tabIndex={0}
            aria-label={`${item.title} certificate`}
            onClick={(e) => {
              e.stopPropagation()
              onOpenDocument(item)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                onOpenDocument(item)
              }
            }}
          >
            <img
              src={item.documentSrc}
              alt={`${item.title} certificate`}
              className={styles.docThumbImg}
            />
          </span>
        )}
      </div>
      <div className={styles.docBody}>
        <span className={styles.cardDate}>{item.date}</span>
        <span className={styles.cardTitle}>{item.title}</span>
        {item.org && <span className={styles.cardOrg}>{item.org}</span>}
        {isActive && item.description && (
          <span className={styles.cardDesc}>{item.description}</span>
        )}
      </div>
    </div>
  )
}

export default function DuringCollege() {
  const [lightbox, setLightbox] = useState(null)

  const openDocument = useCallback((item) => {
    if (!item.documentSrc) return
    setLightbox({
      src: item.documentSrc,
      alt: `${item.title} certificate`,
    })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

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
      <p className={styles.colLabel}>During College</p>
      <BeltCarousel
        items={duringCollege}
        autoAdvanceMs={AUTOPLAY_MS}
        loop
        initialActiveId={duringCollege[0].id}
        ariaLabel="During college experiences"
        className={styles.belt}
        getCardClassName={(item, isActive) =>
          `${styles.beltCard} ${
            item.mediaType === 'photo' ? styles.beltCardPhoto : styles.beltCardDoc
          } ${isActive ? styles.beltCardActive : ''}`
        }
        getCardStyle={(item, isActive) => {
          if (item.mediaType === 'photo') {
            return {
              background: '#110e1a',
              borderColor: isActive
                ? 'rgba(255,255,255,0.22)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: isActive
                ? '0 8px 22px rgba(0,0,0,0.35)'
                : 'none',
              padding: 0,
            }
          }
          return {
            background: isActive ? '#1c1626' : '#171320',
            borderColor: isActive
              ? 'rgba(255,255,255,0.18)'
              : 'rgba(255,255,255,0.08)',
            boxShadow: isActive
              ? '0 8px 22px rgba(0,0,0,0.35)'
              : 'none',
            padding: 0,
          }
        }}
        renderCard={(item, isActive) =>
          item.mediaType === 'photo' ? (
            <PhotoCard item={item} isActive={isActive} />
          ) : (
            <DocumentCard
              item={item}
              isActive={isActive}
              onOpenDocument={openDocument}
            />
          )
        }
      />
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
