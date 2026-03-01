import { useMediaQuery } from "../../hooks/useMediaQuery";

interface ContactProps {
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
}

export default function Contact({
  title = "Nous contacter",
  phone = "+33 X XX XX XX XX",
  email = "contact@maison-regnier.fr",
  address = "Adresse de l'exploitation",
  hours = "Lun-Sam: 9h-18h",
  backgroundColor = "#f8fafc",
  backgroundOpacity = 100,
}: ContactProps) {
  const { isMobile } = useMediaQuery();

  return (
    <div style={{ 
      padding: isMobile ? "1.5rem 1rem" : "2rem", 
      backgroundColor, 
      opacity: backgroundOpacity / 100,
      borderRadius: "0.75rem" 
    }}>
      <h3 style={{ 
        fontSize: isMobile ? "1.5rem" : "1.875rem", 
        fontWeight: "700", 
        marginBottom: "1.5rem", 
        textAlign: "center" 
      }}>
        {title}
      </h3>
      <div style={{ 
        display: "grid", 
        gap: isMobile ? "1rem" : "1.25rem", 
        maxWidth: "500px", 
        margin: "0 auto" 
      }}>
        {phone && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-primary, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.25rem",
            }}>
              📞
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Téléphone
              </div>
              <a href={`tel:${phone}`} style={{ color: "inherit", textDecoration: "none", fontWeight: "500" }}>
                {phone}
              </a>
            </div>
          </div>
        )}
        {email && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-primary, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.25rem",
            }}>
              ✉️
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Email
              </div>
              <a href={`mailto:${email}`} style={{ color: "inherit", textDecoration: "none", fontWeight: "500" }}>
                {email}
              </a>
            </div>
          </div>
        )}
        {address && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-primary, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.25rem",
            }}>
              📍
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Adresse
              </div>
              <div style={{ fontWeight: "500" }}>{address}</div>
            </div>
          </div>
        )}
        {hours && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-primary, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.25rem",
            }}>
              ⏰
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Horaires
              </div>
              <div style={{ fontWeight: "500" }}>{hours}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
