import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import bcrypt from "bcryptjs";
import { encodePasswordData, decodePasswordData } from "../utils/passwordUtils";
import { DEFAULT_PASSWORD, ADMIN_CONTACT_EMAIL } from "./authConfig.local";
import { loginRateLimiter, resetCodeRateLimiter } from "../utils/rateLimiter";
import { validatePassword, validateResetCode } from "../utils/validation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string; remainingTime?: number }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithCode: (code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: () => void;
  getLoginAttemptsRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "regnier_auth";
const PASSWORD_HASH_KEY = "regnier_password_hash";

// Initialiser le hash au démarrage
async function initializePasswordHash() {
  const existingHash = localStorage.getItem(PASSWORD_HASH_KEY);
  if (!existingHash) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, salt);
    localStorage.setItem(PASSWORD_HASH_KEY, encodePasswordData(hash));
  }
}

// Initialiser au chargement du module
initializePasswordHash().catch(console.error);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = async (password: string): Promise<{ success: boolean; error?: string; remainingTime?: number }> => {
    const RATE_LIMIT_KEY = "login_attempts";
    
    // Vérifier le rate limiting
    const rateLimitCheck = loginRateLimiter.canAttempt(RATE_LIMIT_KEY);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: `Trop de tentatives. Réessayez dans ${Math.ceil(rateLimitCheck.remainingTime! / 60)} minutes`,
        remainingTime: rateLimitCheck.remainingTime
      };
    }

    // Valider le mot de passe
    const validation = validatePassword(password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const encodedHash = localStorage.getItem(PASSWORD_HASH_KEY);
      if (!encodedHash) {
        loginRateLimiter.recordAttempt(RATE_LIMIT_KEY);
        return { success: false, error: "Mot de passe incorrect" };
      }
      
      const hash = decodePasswordData(encodedHash);
      const isValid = await bcrypt.compare(password, hash);
      
      if (isValid) {
        loginRateLimiter.reset(RATE_LIMIT_KEY);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      loginRateLimiter.recordAttempt(RATE_LIMIT_KEY);
      const remaining = loginRateLimiter.getRemainingAttempts(RATE_LIMIT_KEY);
      return { 
        success: false, 
        error: `Mot de passe incorrect (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})`
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  const getLoginAttemptsRemaining = (): number => {
    return loginRateLimiter.getRemainingAttempts("login_attempts");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    // Valider les mots de passe
    const oldValidation = validatePassword(oldPassword);
    if (!oldValidation.valid) {
      return { success: false, error: "Ancien mot de passe invalide" };
    }

    const newValidation = validatePassword(newPassword);
    if (!newValidation.valid) {
      return { success: false, error: newValidation.error };
    }

    if (oldPassword === newPassword) {
      return { success: false, error: "Le nouveau mot de passe doit être différent de l'ancien" };
    }

    try {
      // Vérifier l'ancien mot de passe
      const encodedHash = localStorage.getItem(PASSWORD_HASH_KEY);
      if (!encodedHash) {
        return { success: false, error: "Erreur d'authentification" };
      }
      
      const currentHash = decodePasswordData(encodedHash);
      const isValid = await bcrypt.compare(oldPassword, currentHash);
      
      if (!isValid) {
        return { success: false, error: "Ancien mot de passe incorrect" };
      }
      
      // Créer un nouveau hash
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      localStorage.setItem(PASSWORD_HASH_KEY, encodePasswordData(newHash));
      
      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, error: "Erreur lors du changement de mot de passe" };
    }
  };

  const resetPasswordWithCode = async (code: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const RATE_LIMIT_KEY = "reset_code_attempts";

    // Vérifier le rate limiting
    const rateLimitCheck = resetCodeRateLimiter.canAttempt(RATE_LIMIT_KEY);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: `Trop de tentatives. Réessayez dans ${Math.ceil(rateLimitCheck.remainingTime! / 60)} minutes`
      };
    }

    // Valider le code
    const codeValidation = validateResetCode(code);
    if (!codeValidation.valid) {
      return { success: false, error: codeValidation.error };
    }

    // Valider le nouveau mot de passe
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    try {
      // Vérifier que le code est valide
      const storedCode = localStorage.getItem("reset_code");
      const expiration = localStorage.getItem("reset_code_expiration");

      if (!storedCode || !expiration) {
        resetCodeRateLimiter.recordAttempt(RATE_LIMIT_KEY);
        return { success: false, error: "Aucun code de réinitialisation actif" };
      }

      if (Date.now() > parseInt(expiration)) {
        localStorage.removeItem("reset_code");
        localStorage.removeItem("reset_code_expiration");
        return { success: false, error: "Le code a expiré" };
      }

      if (code !== storedCode) {
        resetCodeRateLimiter.recordAttempt(RATE_LIMIT_KEY);
        const remaining = resetCodeRateLimiter.getRemainingAttempts(RATE_LIMIT_KEY);
        return { 
          success: false, 
          error: `Code incorrect (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})`
        };
      }

      // Créer un nouveau hash
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      localStorage.setItem(PASSWORD_HASH_KEY, encodePasswordData(newHash));

      // Nettoyer le code
      localStorage.removeItem("reset_code");
      localStorage.removeItem("reset_code_expiration");
      resetCodeRateLimiter.reset(RATE_LIMIT_KEY);

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: "Erreur lors de la réinitialisation" };
    }
  };

  const requestPasswordReset = () => {
    const mailtoSubject = encodeURIComponent("Demande de réinitialisation de mot de passe - maison-regnier.fr");
    const mailtoBody = encodeURIComponent(
      "Bonjour,\n\n" +
      "Je demande une réinitialisation du mot de passe administrateur pour le site maison-regnier.fr\n\n" +
      "Merci de procéder à la réinitialisation.\n\n" +
      "Cordialement"
    );
    
    window.location.href = `mailto:${ADMIN_CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, resetPasswordWithCode, requestPasswordReset, getLoginAttemptsRemaining }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
