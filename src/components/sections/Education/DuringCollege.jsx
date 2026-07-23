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

function PhotoCard({ item, isActive }) {
  return (
    <div className={`${styles.photoCard} ${isActive ? styles.photoCardActive : ''}`}>
      {item.photoSrc ? (
        <img
          src={item.photoSrc}
          alt={item.title}
          className={styles.photoBg}
        />
      ) : (
        <div className={styles.photoFallback} aria-hidden="true" />
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
          <button
            type="button"
            className={styles.docThumb}
            aria-label={`${item.title} certificate`}
            onClick={(e) => {
              e.stopPropagation()
              onOpenDocument(item)
            }}
          >
            <img
              src={item.documentSrc}
              alt={`${item.title} certificate`}
              className={styles.docThumbImg}
            />
          </button>
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

  return (
    <div className={styles.wrap}>
      <p className={styles.colLabel}>During College</p>
      <BeltCarousel
        items={duringCollege}
        autoAdvanceMs={AUTOPLAY_MS}
        loop
        initialActiveId={duringCollege[0]?.id}
        ariaLabel="During college experiences"
        className={styles.belt}
        getCardClassName={(item, isActive) =>
          `${styles.beltCard} ${
            item.mediaType === 'photo' ? styles.beltCardPhoto : styles.beltCardDoc
          } ${isActive ? styles.beltCardActive : ''}`
        }
        getCardStyle={(item, isActive) => {
          if (item.mediaType === 'document') {
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
          }
          return {
            background: '#110e1a',
            borderColor: isActive
              ? 'rgba(255,255,255,0.2)'
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
