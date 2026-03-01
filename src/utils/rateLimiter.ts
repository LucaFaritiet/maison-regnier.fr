/**
 * Rate Limiter pour protéger contre les attaques par force brute
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes de blocage

  /**
   * Vérifie si une action est autorisée pour une clé donnée
   */
  canAttempt(key: string): { allowed: boolean; remainingTime?: number } {
    const entry = this.storage.get(key);
    const now = Date.now();

    // Pas d'entrée = première tentative
    if (!entry) {
      return { allowed: true };
    }

    // Vérifie si compte bloqué
    if (entry.lockedUntil && now < entry.lockedUntil) {
      const remainingTime = Math.ceil((entry.lockedUntil - now) / 1000);
      return { allowed: false, remainingTime };
    }

    // Réinitialise si la fenêtre temporelle est expirée
    if (now - entry.firstAttempt > this.WINDOW_MS) {
      this.storage.delete(key);
      return { allowed: true };
    }

    // Vérifie le nombre de tentatives
    if (entry.attempts >= this.MAX_ATTEMPTS) {
      // Bloque le compte
      entry.lockedUntil = now + this.LOCKOUT_MS;
      this.storage.set(key, entry);
      return { allowed: false, remainingTime: Math.ceil(this.LOCKOUT_MS / 1000) };
    }

    return { allowed: true };
  }

  /**
   * Enregistre une tentative échouée
   */
  recordAttempt(key: string): void {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now - entry.firstAttempt > this.WINDOW_MS) {
      // Nouvelle fenêtre
      this.storage.set(key, {
        attempts: 1,
        firstAttempt: now,
      });
    } else {
      // Incrémente dans la fenêtre existante
      entry.attempts++;
      this.storage.set(key, entry);
    }
  }

  /**
   * Réinitialise les tentatives après un succès
   */
  reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Nettoie les entrées expirées (à appeler périodiquement)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now - entry.firstAttempt > this.WINDOW_MS + this.LOCKOUT_MS) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Obtient le nombre de tentatives restantes
   */
  getRemainingAttempts(key: string): number {
    const entry = this.storage.get(key);
    if (!entry) return this.MAX_ATTEMPTS;
    return Math.max(0, this.MAX_ATTEMPTS - entry.attempts);
  }
}

// Instance singleton
export const loginRateLimiter = new RateLimiter();
export const resetCodeRateLimiter = new RateLimiter();

// Nettoyage périodique (toutes les heures)
setInterval(() => {
  loginRateLimiter.cleanup();
  resetCodeRateLimiter.cleanup();
}, 60 * 60 * 1000);
