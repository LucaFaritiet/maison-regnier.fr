import { useSiteStore } from "../../store/useSiteStore";
import { widgetRegistry } from "./registry";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useState } from "react";

export default function Canvas() {
  // ✅ Selectors séparés pour éviter la recréation d'objet
  const widgets = useSiteStore((s) => s.widgets);
  const select = useSiteStore((s) => s.select);
  const selectedId = useSiteStore((s) => s.selectedId);
  const removeWidget = useSiteStore((s) => s.removeWidget);
  const reorderWidgets = useSiteStore((s) => s.reorderWidgets);
  const { isMobile } = useMediaQuery();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null) {
      reorderWidgets(draggedIndex, dropIndex);
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div style={{ 
      padding: isMobile ? "0.5rem" : "1rem", 
      minHeight: "80vh", 
      maxWidth: isMobile ? "100%" : "1400px", 
      margin: "0 auto",
      width: "100%",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1rem" : "1.5rem" }}>
        {widgets.map((w: any, index: number) => {
          const Cmp = widgetRegistry[w.type as keyof typeof widgetRegistry] as any;
          if (!Cmp) return null;
          
          const isSelected = selectedId === w.id;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={w.id}
              draggable={!isMobile}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={(e) => { e.stopPropagation(); select(w.id); }}
              style={{
                border: isSelected ? "3px solid #3b82f6" : isDragOver ? "3px dashed #22c55e" : "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                background: "white",
                boxShadow: isSelected ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
                cursor: isMobile ? "pointer" : (isDragging ? "grabbing" : "grab"),
                transition: "all 0.2s ease",
                opacity: isDragging ? 0.5 : 1,
                transform: isDragOver ? "scale(1.02)" : "scale(1)",
                position: "relative",
              }}
            >
              {!isMobile && (
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  zIndex: 10,
                  pointerEvents: "none",
                }}>
                  ⬍ Glisser
                </div>
              )}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Supprimer ce bloc ?")) {
                        removeWidget(w.id);
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      zIndex: 10,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
                    title="Supprimer ce bloc"
                  >
                    ×
                  </button>
                )}
              <Cmp {...w.props} />
            </div>
          );
        })}
      </div>
      {widgets.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
          <p style={{ fontSize: "1.125rem", fontWeight: "600" }}>Aucun bloc pour le moment</p>
          <p style={{ fontSize: "0.875rem" }}>Ajoutez votre premier bloc depuis le panneau de droite</p>
        </div>
      )}
    </div>
  );
}