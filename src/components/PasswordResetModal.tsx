import { useState, useEffect } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, ADMIN_EMAIL } from "../config/emailConfig";
import { validatePassword, validateResetCode } from "../utils/validation";
import { resetCodeRateLimiter } from "../utils/rateLimiter";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSuccess: (code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export default function PasswordResetModal({ isOpen, onClose, onResetSuccess }: PasswordResetModalProps) {
  const [step, setStep] = useState<"code" | "password">("code");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codesSent, setCodesSent] = useState(false);
  const { isMobile } = useMediaQuery();

  const generateResetCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Envoyer le code automatiquement quand la modal ouvre
  useEffect(() => {
    if (isOpen && !codesSent) {
      sendCodeAutomatically();
    }
  }, [isOpen]);

  const sendCodeAutomatically = async () => {
    const RATE_LIMIT_KEY = "send_reset_code";
    
    // Vérifier le rate limiting
    const rateLimitCheck = resetCodeRateLimiter.canAttempt(RATE_LIMIT_KEY);
    if (!rateLimitCheck.allowed) {
      setError(`Trop de demandes. Réessayez dans ${Math.ceil(rateLimitCheck.remainingTime! / 60)} minutes`);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Générer le code
      const resetCode = generateResetCode();

      // Stocker le code avec expiration (15 minutes)
      const expirationTime = Date.now() + 15 * 60 * 1000;
      localStorage.setItem("reset_code", resetCode);
      localStorage.setItem("reset_code_expiration", expirationTime.toString());

      // Envoyer l'email via EmailJS
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email: ADMIN_EMAIL,
            email: ADMIN_EMAIL,
            reset_code: resetCode,
            site_name: "Maison Regnier",
            expiration_time: "15 minutes",
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        );

        resetCodeRateLimiter.recordAttempt(RATE_LIMIT_KEY);
        setSuccess(`Code envoyé à ${ADMIN_EMAIL}. Vérifiez votre boîte mail.`);
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
        setError("Erreur lors de l'envoi du code. Vérifiez votre configuration EmailJS.");
      }
    } catch (err) {
      setError("Erreur lors de la génération du code");
    } finally {
      setIsLoading(false);
      setCodesSent(true);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation du code
    const codeValidation = validateResetCode(code);
    if (!codeValidation.valid) {
      setError(codeValidation.error || "Code invalide");
      return;
    }

    const storedCode = localStorage.getItem("reset_code");
    const expiration = localStorage.getItem("reset_code_expiration");

    if (!storedCode || !expiration) {
      setError("Aucun code de réinitialisation actif");
      return;
    }

    if (Date.now() > parseInt(expiration)) {
      setError("Le code a expiré. Demandez un nouveau code.");
      localStorage.removeItem("reset_code");
      localStorage.removeItem("reset_code_expiration");
      return;
    }

    if (code !== storedCode) {
      setError("Code incorrect");
      return;
    }

    setSuccess("Code vérifié ✓");
    setTimeout(() => {
      setStep("password");
      setSuccess("");
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation du nouveau mot de passe
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || "Mot de passe invalide");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const storedCode = localStorage.getItem("reset_code");
      if (!storedCode || code !== storedCode) {
        setError("Session de réinitialisation invalide");
        return;
      }

      const result = await onResetSuccess(storedCode, newPassword);

      if (result.success) {
        // Nettoyer le code de réinitialisation
        localStorage.removeItem("reset_code");
        localStorage.removeItem("reset_code_expiration");

        setSuccess("Mot de passe réinitialisé avec succès!");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.error || "Erreur lors de la réinitialisation");
      }
    } catch (err) {
      setError("Erreur lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("code");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setCodesSent(false);
    onClose();
  };

  const handleRequestNewCode = async () => {
    setCodesSent(false);
    setCode("");
    setError("");
    setSuccess("");
    await sendCodeAutomatically();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: isMobile ? "1rem" : "0",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: isMobile ? "1.5rem" : "2.5rem",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "700" }}>
          🔑 Réinitialisation du mot de passe
        </h2>

        {step === "code" && (
          <form onSubmit={handleVerifyCode} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#ecfdf5", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
              <p style={{ margin: 0, color: "#166534", fontSize: "0.875rem" }}>
                ✅ Code de réinitialisation envoyé
              </p>
              <p style={{ margin: "0.5rem 0 0 0", color: "#065f46", fontSize: "0.875rem", fontWeight: "600" }}>
                {ADMIN_EMAIL}
              </p>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
                Code (6 chiffres)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  letterSpacing: "0.5rem",
                  boxSizing: "border-box",
                  outline: "none",
                  fontWeight: "700",
                }}
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem", marginBottom: 0 }}>
                Valide 15 minutes - Consultez votre dossier spam si nécessaire
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ❌ {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ✅ {success}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#f1f5f9",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRequestNewCode}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#f1f5f9",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Renvoyer
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Continuer
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                required
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
                placeholder="Confirmez le mot de passe"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ❌ {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ✅ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                marginTop: "1rem",
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
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
