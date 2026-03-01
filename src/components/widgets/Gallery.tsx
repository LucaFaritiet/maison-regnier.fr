import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface GalleryProps {
  images?: string[];
  columns?: number;
  gap?: number;
  title?: string;
  subtitle?: string;
  overlay?: number;
  showLightbox?: boolean;
}

export default function Gallery({
  images = ["/data/img/IMG_2520.jpg", "/data/img/IMG_3923.jpg", "/data/img/IMG_4271.jpg"],
  columns = 3,
  gap = 16,
  title,
  subtitle,
  overlay = 0,
  showLightbox = true,
}: GalleryProps) {
  const { isMobile, isTablet } = useMediaQuery();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Adapter le nombre de colonnes selon l'appareil
  const responsiveColumns = isMobile ? 1 : isTablet ? Math.min(2, columns) : columns;
  const responsiveGap = isMobile ? 12 : gap;

  const openLightbox = (img: string, index: number) => {
    if (showLightbox) {
      setLightboxImage(img);
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(nextIndex);
    setLightboxImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(prevIndex);
    setLightboxImage(images[prevIndex]);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Header avec overlay si title/subtitle */}
        {(title || subtitle) && (
          <div style={{
            position: "relative",
            padding: isMobile ? "2rem 1rem" : "3rem 2rem",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))",
            color: "white",
            textAlign: "center",
          }}>
            {title && (
              <h2 style={{ 
                fontSize: isMobile ? "1.75rem" : "2.25rem", 
                fontWeight: "800", 
                marginBottom: subtitle ? "0.5rem" : "0" 
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ 
                fontSize: isMobile ? "0.95rem" : "1.125rem", 
                opacity: 0.95,
                margin: 0,
              }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grille d'images */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
            gap: `${responsiveGap}px`,
            padding: isMobile ? "0.5rem" : "1rem",
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(img, idx)}
              style={{
                position: "relative",
                paddingBottom: "75%",
                overflow: "hidden",
                borderRadius: "0.75rem",
                background: "#e2e8f0",
                cursor: showLightbox ? "pointer" : "default",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (showLightbox) e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                if (showLightbox) e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {overlay > 0 && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `rgba(0,0,0,${overlay / 100})`,
                  zIndex: 1,
                }} />
              )}
              <img
                src={img}
                alt={`Gallery ${idx + 1}`}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image";
                }}
              />
              {showLightbox && (
                <div style={{
                  position: "absolute",
                  bottom: "0.5rem",
                  right: "0.5rem",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  zIndex: 2,
                  pointerEvents: "none",
                }}>
                  🔍 Agrandir
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "2rem",
          }}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "2rem",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            ✕
          </button>

          {/* Navigation précédent */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: "absolute",
                left: "1rem",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                fontSize: "2rem",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={lightboxImage}
            alt="Lightbox"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
          />

          {/* Navigation suivant */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: "absolute",
                right: "1rem",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                fontSize: "2rem",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ›
            </button>
          )}

          {/* Compteur */}
          <div style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}>
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
