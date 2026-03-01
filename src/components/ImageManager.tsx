import { useState, useRef } from "react";
import { useSiteStore } from "../store/useSiteStore";
import { availableImages } from "../utils/images";

export default function ImageManager() {
  const uploadedImages = useSiteStore((s) => s.uploadedImages);
  const hiddenImageUrls = useSiteStore((s) => s.hiddenImageUrls);
  const addUploadedImage = useSiteStore((s) => s.addUploadedImage);
  const removeUploadedImage = useSiteStore((s) => s.removeUploadedImage);
  const hideImageUrl = useSiteStore((s) => s.hideImageUrl);
  const restoreImageUrl = useSiteStore((s) => s.restoreImageUrl);
  
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Vérifier que c'est bien une image
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} n'est pas une image valide.`);
        return;
      }

      // Convertir en base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        addUploadedImage({
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: base64,
          uploadedAt: Date.now(),
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const visibleBaseImages = availableImages.filter((url) => !hiddenImageUrls.includes(url));

  const allImages = [
    ...visibleBaseImages.map((url) => ({ id: url, name: url.split("/").pop() || url, url, uploadedAt: 0 })),
    ...(uploadedImages || []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Upload Section */}
      <div style={{ 
        padding: "1.5rem", 
        background: "#f8fafc", 
        borderRadius: "0.75rem",
        border: "2px dashed #cbd5e1"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
          📤 Importer des images
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
          Formats acceptés : JPG, PNG, GIF, WebP
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
        >
          Choisir des images
        </button>
      </div>

      {/* Gallery Section */}
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
          🖼️ Images disponibles ({allImages.length})
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
          Cliquez sur une image pour copier son URL
        </p>
        
        {allImages.length === 0 ? (
          <div style={{ 
            padding: "2rem", 
            textAlign: "center", 
            color: "#94a3b8",
            background: "#f8fafc",
            borderRadius: "0.5rem"
          }}>
            Aucune image disponible
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.75rem",
          }}>
            {allImages.map((img) => (
              <div
                key={img.id}
                style={{
                  position: "relative",
                  paddingBottom: "100%",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border: copiedUrl === img.url ? "3px solid #10b981" : "2px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "border 0.2s, transform 0.2s",
                }}
                onClick={() => copyToClipboard(img.url)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                title={`Cliquer pour copier\n${img.name}`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                
                {/* Copié badge */}
                {copiedUrl === img.url && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#10b981",
                    color: "white",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}>
                    ✓ Copié !
                  </div>
                )}

                {/* Delete button pour images utilisables */}
                {
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Supprimer ${img.name} ?`)) {
                        if (img.uploadedAt > 0) {
                          removeUploadedImage(img.id);
                        } else {
                          hideImageUrl(img.url);
                        }
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: "0.25rem",
                      right: "0.25rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    title="Supprimer cette image"
                  >
                    ×
                  </button>
                }

                {/* Nom de l'image */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  padding: "1.5rem 0.5rem 0.25rem",
                  fontSize: "0.625rem",
                  color: "white",
                  fontWeight: "500",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info panel */}
      {uploadedImages.length > 0 && (
        <div style={{
          padding: "1rem",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          color: "#1e40af",
        }}>
          💡 <strong>Astuce :</strong> Les images uploadées sont stockées dans votre navigateur (localStorage) et ne seront pas perdues. Pour les utiliser, cliquez dessus pour copier l'URL, puis collez-la dans les propriétés d'un widget.
        </div>
      )}

      {hiddenImageUrls.length > 0 && (
        <div style={{
          padding: "1rem",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          color: "#9a3412",
        }}>
          <div style={{ marginBottom: "0.5rem", fontWeight: "700" }}>Images retirées ({hiddenImageUrls.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {hiddenImageUrls.map((url) => (
              <button
                key={url}
                onClick={() => restoreImageUrl(url)}
                style={{
                  border: "1px solid #fdba74",
                  background: "white",
                  color: "#9a3412",
                  borderRadius: "999px",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                title="Réactiver cette image"
              >
                ↺ {url.split("/").pop()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
