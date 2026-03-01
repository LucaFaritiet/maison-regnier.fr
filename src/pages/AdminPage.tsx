import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSiteStore } from "../store/useSiteStore";
import Canvas from "../components/widgets/Canvas";
import EditorPanel from "../components/EditorPanel";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useState } from "react";

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const selectedId = useSiteStore((s) => s.selectedId);
  const { isMobile, isTablet } = useMediaQuery();
  const [showPanel, setShowPanel] = useState(!isMobile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Admin Header - Responsive */}
      <header style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? "0.75rem" : "0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}>⚙️</div>
          <div>
            <div style={{ fontWeight: "800", fontSize: isMobile ? "1rem" : "1.25rem" }}>
              Mode Administration
            </div>
            <div style={{ fontSize: isMobile ? "0.75rem" : "0.875rem", opacity: 0.9 }}>
              Maison Regnier - Éditeur No-Code
            </div>
          </div>
        </div>
        <div style={{ 
          display: "flex", 
          gap: isMobile ? "0.5rem" : "1rem", 
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {isMobile && (
            <button
              onClick={() => setShowPanel(!showPanel)}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "0.5rem",
                color: "white",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {showPanel ? "🔽 Masquer" : "🔧 Éditer"}
            </button>
          )}
          <a 
            href="/" 
            target="_blank"
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "0.5rem",
              textDecoration: "none",
              color: "white",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            👁️ {isMobile ? "Public" : "Aperçu public"}
          </a>
          <button
            onClick={() => setShowPasswordModal(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "0.5rem",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            title="Modifier le mot de passe"
          >
            🔐 {isMobile ? "Mot de passe" : "Sécurité"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "0.5rem",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            🚪 {isMobile ? "Sortir" : "Déconnexion"}
          </button>
        </div>
      </header>

      {/* Editor Layout - Responsive */}
      <div style={{ 
        flex: 1, 
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 320px" : "1fr 380px",
        overflow: "hidden",
      }}>
        <main 
          onClick={() => useSiteStore.getState().select(null)}
          style={{ 
            overflow: "auto", 
            background: "#f1f5f9",
            position: "relative",
            order: isMobile ? 2 : undefined,
          }}
        >
          {!selectedId && !isMobile && (
            <div style={{
              position: "absolute",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              💡 Cliquez sur un bloc pour l'éditer
            </div>
          )}
          <Canvas />
        </main>
        
        {/* EditorPanel - Responsive avec toggle mobile */}
        {showPanel && (
          <aside style={{ 
            borderLeft: isMobile ? "none" : "1px solid #e5e7eb",
            borderTop: isMobile ? "2px solid #e5e7eb" : "none",
            background: "white",
            overflow: "auto",
            maxHeight: isMobile ? "50vh" : undefined,
            order: isMobile ? 1 : undefined,
          }}>
            <EditorPanel />
          </aside>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}
