import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import bcrypt from "bcryptjs";
import { encodePasswordData, decodePasswordData } from "../utils/passwordUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  resetPasswordWithCode: (code: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "regnier_auth";
const PASSWORD_HASH_KEY = "regnier_password_hash";

const DEFAULT_PASSWORD = "regnier2024";

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

  const login = async (password: string): Promise<boolean> => {
    try {
      const encodedHash = localStorage.getItem(PASSWORD_HASH_KEY);
      if (!encodedHash) {
        return false;
      }
      
      const hash = decodePasswordData(encodedHash);
      const isValid = await bcrypt.compare(password, hash);
      
      if (isValid) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Vérifier l'ancien mot de passe
      const encodedHash = localStorage.getItem(PASSWORD_HASH_KEY);
      if (!encodedHash) {
        return false;
      }
      
      const currentHash = decodePasswordData(encodedHash);
      const isValid = await bcrypt.compare(oldPassword, currentHash);
      
      if (!isValid) {
        return false;
      }
      
      // Créer un nouveau hash
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      localStorage.setItem(PASSWORD_HASH_KEY, encodePasswordData(newHash));
      
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      return false;
    }
  };

  const resetPasswordWithCode = async (code: string, newPassword: string): Promise<boolean> => {
    try {
      // Vérifier que le code est valide
      const storedCode = localStorage.getItem("reset_code");
      const expiration = localStorage.getItem("reset_code_expiration");

      if (!storedCode || !expiration) {
        return false;
      }

      if (Date.now() > parseInt(expiration)) {
        localStorage.removeItem("reset_code");
        localStorage.removeItem("reset_code_expiration");
        return false;
      }

      if (code !== storedCode) {
        return false;
      }

      // Créer un nouveau hash
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      localStorage.setItem(PASSWORD_HASH_KEY, encodePasswordData(newHash));

      // Nettoyer le code
      localStorage.removeItem("reset_code");
      localStorage.removeItem("reset_code_expiration");

      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      return false;
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
    
    window.location.href = `mailto:luca.faritiet@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, resetPasswordWithCode, requestPasswordReset }}>
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
