// Configuration EmailJS - EXEMPLE
// Pour utiliser ce service:
// 1. Copiez ce fichier en emailConfig.local.ts
// 2. Créez un compte sur https://www.emailjs.com/
// 3. Créez un service email (Gmail, Outlook, etc.)
// 4. Créez un template d'email avec les variables: {{reset_code}}, {{to_email}}
// 5. Remplacez les valeurs dans emailConfig.local.ts par vos propres clés

export const EMAILJS_CONFIG = {
  SERVICE_ID: "your_service_id", // Remplacer par votre Service ID
  TEMPLATE_ID: "your_template_id", // Remplacer par votre Template ID
  PUBLIC_KEY: "your_public_key", // Remplacer par votre Public Key
};

// Email de l'administrateur (pour recevoir les codes de réinitialisation)
export const ADMIN_EMAIL = "admin@example.com";
