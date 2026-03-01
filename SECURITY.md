# Améliorations de Sécurité - Maison Regnier

## ✅ Implémentations Réalisées

### 1. Rate Limiting (Protection contre la force brute)

**Fichier**: `src/utils/rateLimiter.ts`

**Fonctionnalités**:
- Limite de **5 tentatives** par fenêtre de **15 minutes**
- Blocage de **30 minutes** après dépassement
- Deux limiteurs distincts :
  - `loginRateLimiter` : pour les connexions
  - `resetCodeRateLimiter` : pour les codes de réinitialisation et leur envoi

**Protection contre**:
- ✅ Attaques par force brute sur le mot de passe admin
- ✅ Tentatives répétées de codes de réinitialisation
- ✅ Spam d'emails de réinitialisation

**Exemple d'utilisation**:
```typescript
const rateLimitCheck = loginRateLimiter.canAttempt("login_attempts");
if (!rateLimitCheck.allowed) {
  // Bloqué - afficher le temps restant
  return { error: `Réessayez dans ${rateLimitCheck.remainingTime}s` };
}
```

### 2. Validation des Entrées

**Fichier**: `src/utils/validation.ts`

**Validations implémentées**:

#### Mots de passe
- ✅ Longueur minimale : 8 caractères
- ✅ Longueur maximale : 128 caractères
- ✅ Complexité requise : 3 types parmi (majuscules, minuscules, chiffres, caractères spéciaux)
- ✅ Prévention des mots de passe identiques lors du changement

#### Codes de réinitialisation
- ✅ Format requis : exactement 6 chiffres
- ✅ Validation avant tentative de vérification

#### Emails
- ✅ Validation RFC 5322 simplifiée
- ✅ Limite de longueur (254 caractères)

#### Images
- ✅ Validation du type MIME (JPG, PNG, GIF, WebP uniquement)
- ✅ Limite de taille configurable (défaut: 5MB)

#### Textes
- ✅ Validation de longueur personnalisable
- ✅ Sanitization basique contre XSS

### 3. Intégration dans les Composants

**Modifications apportées**:

#### AuthContext.tsx
- ✅ Nouvelle interface avec messages d'erreur détaillés
- ✅ Rate limiting sur login et réinitialisation
- ✅ Validation de tous les mots de passe
- ✅ Compteur de tentatives restantes
- ✅ Messages utilisateur plus informatifs

#### LoginPage.tsx
- ✅ Affichage des messages d'erreur détaillés
- ✅ Information sur le nombre de tentatives restantes
- ✅ Indication du temps de blocage

#### PasswordResetModal.tsx
- ✅ Rate limiting sur l'envoi de codes
- ✅ Validation du code (6 chiffres)
- ✅ Validation du nouveau mot de passe
- ✅ Protection contre le spam d'emails

#### ChangePasswordModal.tsx
- ✅ Validation des mots de passe
- ✅ Vérification que le nouveau mot de passe est différent
- ✅ Messages d'erreur explicites

## 📊 Tests Recommandés

### Test 1 : Rate Limiting de Connexion
1. Essayez de vous connecter 5 fois avec un mauvais mot de passe
2. À la 5ème tentative, vous devriez être bloqué
3. Le message devrait indiquer le temps d'attente
4. Attendez 30 minutes ou nettoyez le localStorage pour débloquer

### Test 2 : Validation de Mot de Passe
1. Essayez un mot de passe trop court (< 8 caractères)
2. Essayez un mot de passe sans complexité (ex: "12345678")
3. Essayez un mot de passe valide (ex: "MonPass123!@")

### Test 3 : Code de Réinitialisation
1. Demandez un code de réinitialisation
2. Essayez d'entrer un code invalide 5 fois
3. Vous devriez être bloqué
4. Testez l'expiration du code (15 minutes)

## 🔒 Sécurité Actuelle

### Points Forts
- ✅ Rate limiting efficace
- ✅ Validation stricte des entrées
- ✅ Messages d'erreur informatifs sans divulguer trop d'informations
- ✅ Secrets externalisés (gitignored)

### Limitations Connues (Architecture Client-Side)
- ⚠️ Authentification côté client seulement (localStorage)
- ⚠️ Pas de véritable session serveur
- ⚠️ Le rate limiting peut être contourné en nettoyant localStorage
- ⚠️ Clés API EmailJS exposées dans le bundle JS
- ⚠️ Pas de protection CSRF

## 🎯 Prochaines Étapes Recommandées

### Court terme (à faire maintenant)
1. ✅ **FAIT** : Rate limiting
2. ✅ **FAIT** : Validation des entrées
3. 🔄 **À tester** : Tests utilisateur complets

### Moyen terme (dans les prochaines semaines)
1. Ajouter des headers de sécurité dans Caddyfile :
   ```caddyfile
   header {
     X-Frame-Options "SAMEORIGIN"
     X-Content-Type-Options "nosniff"
     X-XSS-Protection "1; mode=block"
     Referrer-Policy "strict-origin-when-cross-origin"
     Permissions-Policy "geolocation=(), microphone=(), camera=()"
   }
   ```

2. Implémenter un système de logs côté client
3. Ajouter une limite de taille pour localStorage
4. Chiffrement AES des données sensibles en localStorage

### Long terme (migration backend)
1. Créer une API backend (Node.js/Python/Go)
2. Migrer l'authentification vers JWT/sessions serveur
3. Déplacer l'envoi d'emails côté serveur
4. Base de données pour les contenus et configurations
5. Protection CSRF avec tokens
6. Rate limiting côté serveur (plus robuste)

## 📝 Notes de Développement

### Nettoyage du Rate Limiter
Le rate limiter se nettoie automatiquement toutes les heures :
```typescript
setInterval(() => {
  loginRateLimiter.cleanup();
  resetCodeRateLimiter.cleanup();
}, 60 * 60 * 1000);
```

### Déblocage Manuel (pour le développement)
Si vous êtes bloqué pendant les tests, ouvrez la console :
```javascript
localStorage.clear();
location.reload();
```

### Configuration du Rate Limiter
Pour modifier les limites, éditez `src/utils/rateLimiter.ts` :
```typescript
private readonly MAX_ATTEMPTS = 5;        // Nombre de tentatives
private readonly WINDOW_MS = 15 * 60 * 1000;  // Fenêtre temporelle
private readonly LOCKOUT_MS = 30 * 60 * 1000; // Durée du blocage
```

## 🐛 Résolution de Problèmes

### "Trop de tentatives" alors que je n'ai rien fait
- Nettoyez le localStorage : `localStorage.clear()`
- Ou attendez 30 minutes

### Les messages d'erreur ne s'affichent pas
- Vérifiez la console navigateur pour les erreurs
- Assurez-vous que tous les imports sont corrects

### Le code de réinitialisation n'arrive pas
- Vérifiez votre configuration EmailJS dans `src/config/emailConfig.local.ts`
- Vérifiez les quotas EmailJS (limite gratuite : 200 emails/mois)

---

**Date de mise à jour** : 1er mars 2026  
**Version** : 1.0.0
