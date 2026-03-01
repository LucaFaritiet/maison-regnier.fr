import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { validatePassword } from "../utils/validation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuth();
  const { isMobile } = useMediaQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.valid) {
      setError(newPasswordValidation.error || "Nouveau mot de passe invalide");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(oldPassword, newPassword);
      if (result.success) {
        setSuccess("Mot de passe changé avec succès!");
        setTimeout(() => {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setError("");
          setSuccess("");
          onClose();
        }, 1500);
      } else {
        setError(result.error || "Erreur lors du changement de mot de passe");
      }
    } catch (err) {
      setError("Erreur lors du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "1rem" : "0",
    }}>
      <div style={{
        background: "white",
        borderRadius: "1rem",
        padding: isMobile ? "1.5rem" : "2.5rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "700" }}>
          🔐 Modifier le mot de passe
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Ancien mot de passe
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                boxSizing: "border-box",
                outline: "none",
              }}
              placeholder="Entrez l'ancien mot de passe"
              disabled={isLoading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                boxSizing: "border-box",
                outline: "none",
              }}
              placeholder="Entrez le nouveau mot de passe"
              disabled={isLoading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                boxSizing: "border-box",
                outline: "none",
              }}
              placeholder="Confirmez le nouveau mot de passe"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div style={{
              padding: "0.75rem",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: "0.75rem",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}>
              ✅ {success}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
