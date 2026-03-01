// Configuration EmailJS
// Pour utiliser ce service, vous devez:
// 1. Créer un compte sur https://www.emailjs.com/
// 2. Créer un service email (Gmail, Outlook, etc.)
// 3. Créer un template d'email avec les variables: {{reset_code}}, {{to_email}}
// 4. Remplacer les valeurs ci-dessous par vos propres clés

export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_2ya7d2l", // Remplacer par votre Service ID
  TEMPLATE_ID: "template_imiev5t", // Remplacer par votre Template ID
  PUBLIC_KEY: "5aMU9_z21HEolU8i3", // Remplacer par votre Public Key
};

// Email de l'administrateur (pour recevoir les codes de réinitialisation)
export const ADMIN_EMAIL = "leopaul.regnier17@gmail.com";
