import { useState } from "react";
import { availableImages } from "../utils/images";
import { useSiteStore } from "../store/useSiteStore";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hiddenImageUrls = useSiteStore((s) => s.hiddenImageUrls);
  const uploadedImages = useSiteStore((s) => s.uploadedImages);

  const usableImages = [
    ...availableImages.filter((img) => !hiddenImageUrls.includes(img)),
    ...uploadedImages.map((img) => img.url),
  ];

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
        {label}
      </label>
      
      {value && (
        <div style={{
          marginBottom: "0.5rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
          border: "2px solid #e5e7eb",
        }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ width: "100%", height: "120px", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image";
            }}
          />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "0.625rem",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {value ? "Changer l'image" : "Sélectionner une image"}
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
        onClick={() => setIsOpen(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>
                Choisir une image
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "1rem",
            }}>
              {usableImages.map((img) => (
                <div
                  key={img}
                  onClick={() => {
                    onChange(img);
                    setIsOpen(false);
                  }}
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: value === img ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={img}
                    alt={img}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
