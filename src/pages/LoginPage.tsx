import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import PasswordResetModal from "../components/PasswordResetModal";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const { login, resetPasswordWithCode } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(password);
      if (success) {
        navigate("/admin");
      } else {
        setError("Mot de passe incorrect");
        setPassword("");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: isMobile ? "1rem" : "2rem",
    }}>
      <div style={{
        background: "white",
        padding: isMobile ? "2rem 1.5rem" : "3rem",
        borderRadius: "1rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "400px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img 
            src="/data/img/huitre.png" 
            alt="Logo" 
            style={{ 
              width: isMobile ? "60px" : "80px", 
              height: isMobile ? "60px" : "80px", 
              margin: "0 auto 1rem" 
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h1 style={{ 
            fontSize: isMobile ? "1.5rem" : "1.875rem", 
            fontWeight: "800", 
            marginBottom: "0.5rem" 
          }}>
            Maison Regnier
          </h1>
          <p style={{ color: "#64748b", fontSize: isMobile ? "0.875rem" : "1rem" }}>
            Administration
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Entrez le mot de passe"
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              padding: "0.75rem",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: isLoading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            style={{
              width: "100%",
              marginTop: "0.75rem",
              padding: "0.75rem",
              background: "transparent",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#667eea";
              (e.currentTarget as HTMLButtonElement).style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#667eea";
            }}
          >
            🔑 Mot de passe oublié ?
          </button>
        </form>

        <PasswordResetModal 
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onResetSuccess={resetPasswordWithCode}
        />

      </div>
    </div>
  );
}
