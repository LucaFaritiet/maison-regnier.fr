/**
 * Utilitaires de validation des entrées utilisateur
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valide un mot de passe
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim().length === 0) {
    return { valid: false, error: "Le mot de passe est requis" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  if (password.length > 128) {
    return { valid: false, error: "Le mot de passe est trop long (max 128 caractères)" };
  }

  // Vérifie la complexité minimale
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(password);

  const complexityCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (complexityCount < 3) {
    return {
      valid: false,
      error: "Le mot de passe doit contenir au moins 3 types de caractères parmi : majuscules, minuscules, chiffres, caractères spéciaux"
    };
  }

  return { valid: true };
}

/**
 * Valide un email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "L'email est requis" };
  }

  // Regex RFC 5322 simplifiée
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Format d'email invalide" };
  }

  if (email.length > 254) {
    return { valid: false, error: "Email trop long" };
  }

  return { valid: true };
}

/**
 * Valide un code de réinitialisation (6 chiffres)
 */
export function validateResetCode(code: string): ValidationResult {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Le code est requis" };
  }

  if (!/^\d{6}$/.test(code)) {
    return { valid: false, error: "Le code doit contenir exactement 6 chiffres" };
  }

  return { valid: true };
}

/**
 * Valide une URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { valid: true }; // URL optionnelle
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: "URL invalide" };
  }
}

/**
 * Valide la taille d'une image (en bytes)
 */
export function validateImageSize(sizeInBytes: number, maxSizeMB: number = 5): ValidationResult {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (sizeInBytes > maxBytes) {
    return { valid: false, error: `L'image est trop volumineuse (max ${maxSizeMB}MB)` };
  }

  return { valid: true };
}

/**
 * Valide le type MIME d'une image
 */
export function validateImageType(mimeType: string): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(mimeType.toLowerCase())) {
    return { valid: false, error: "Format d'image non autorisé (JPG, PNG, GIF, WebP uniquement)" };
  }

  return { valid: true };
}

/**
 * Sanitize une chaîne pour éviter les injections XSS basiques
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Valide la longueur d'un texte
 */
export function validateTextLength(text: string, minLength: number = 0, maxLength: number = 10000): ValidationResult {
  if (text.length < minLength) {
    return { valid: false, error: `Le texte doit contenir au moins ${minLength} caractères` };
  }

  if (text.length > maxLength) {
    return { valid: false, error: `Le texte est trop long (max ${maxLength} caractères)` };
  }

  return { valid: true };
}
