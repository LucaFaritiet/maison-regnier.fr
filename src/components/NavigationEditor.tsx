import { useState } from "react";
import { useSiteStore } from "../store/useSiteStore";

export default function NavigationEditor() {
  const navLinks = useSiteStore((s) => s.navLinks);
  const addNavLink = useSiteStore((s) => s.addNavLink);
  const updateNavLink = useSiteStore((s) => s.updateNavLink);
  const removeNavLink = useSiteStore((s) => s.removeNavLink);
  const reorderNavLinks = useSiteStore((s) => s.reorderNavLinks);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sortedLinks = [...navLinks].sort((a, b) => a.order - b.order);

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
      reorderNavLinks(draggedIndex, dropIndex);
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{
        padding: "1.5rem",
        background: "#f8fafc",
        borderRadius: "0.75rem",
        border: "2px dashed #cbd5e1"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
          🧭 Navigation du site
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
          Gérez les liens de navigation affichés dans l'en-tête du site public. Glissez-déposez pour réorganiser.
        </p>
        <button
          onClick={addNavLink}
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
          + Ajouter un lien
        </button>
      </div>

      {/* Liste des liens */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sortedLinks.length === 0 ? (
          <div style={{
            padding: "2rem",
            textAlign: "center",
            color: "#94a3b8",
            background: "#f8fafc",
            borderRadius: "0.5rem"
          }}>
            Aucun lien de navigation
          </div>
        ) : (
          sortedLinks.map((link, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  padding: "1rem",
                  background: "white",
                  border: isDragOver ? "2px dashed #22c55e" : "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  opacity: isDragging ? 0.5 : 1,
                  cursor: "grab",
                  transition: "all 0.2s",
                }}
              >
                {/* Badge ordre + glisser */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}>
                  <span style={{
                    background: "#e0e7ff",
                    color: "#3730a3",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}>
                    #{link.order}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le lien "${link.label}" ?`)) {
                        removeNavLink(link.id);
                      }
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                    title="Supprimer ce lien"
                  >
                    ×
                  </button>
                </div>

                {/* Label */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.25rem",
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    color: "#475569",
                  }}>
                    Texte du lien
                  </label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateNavLink(link.id, { label: e.target.value })}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      padding: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                    placeholder="Ex: Accueil"
                  />
                </div>

                {/* Ancre */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.25rem",
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    color: "#475569",
                  }}>
                    Ancre de destination (ID de section)
                  </label>
                  <input
                    type="text"
                    value={link.anchor}
                    onChange={(e) => updateNavLink(link.id, { anchor: e.target.value })}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      padding: "0.5rem",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                    }}
                    placeholder="Ex: produits"
                  />
                  <p style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.25rem",
                    marginBottom: 0,
                  }}>
                    💡 Astuce : Ajoutez une prop <code style={{ background: "#f1f5f9", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>anchor</code> à vos widgets avec cette valeur
                  </p>
                </div>

                {/* Visible */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#334155",
                    cursor: "pointer",
                  }}>
                    <input
                      type="checkbox"
                      checked={link.visible}
                      onChange={(e) => updateNavLink(link.id, { visible: e.target.checked })}
                    />
                    Afficher ce lien
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info panel */}
      <div style={{
        padding: "1rem",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "0.5rem",
        fontSize: "0.75rem",
        color: "#1e40af",
      }}>
        <div style={{ fontWeight: "700", marginBottom: "0.5rem" }}>📐 Comment utiliser les ancres ?</div>
        <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
          <li>Créez un lien de navigation avec une ancre (ex: "produits")</li>
          <li>Éditez le widget de destination (Section, Gallery, etc.)</li>
          <li>Dans l'éditor, vous pourrez bientôt assigner l'ancre au widget</li>
          <li>Le clic sur le lien scrollera automatiquement vers ce widget</li>
        </ol>
      </div>
    </div>
  );
}
