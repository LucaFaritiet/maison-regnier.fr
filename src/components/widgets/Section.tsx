import { useMediaQuery } from "../../hooks/useMediaQuery";

interface SectionProps {
  title?: string;
  content?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  overlay?: number; // 0-100
  align?: "left" | "center" | "right";
  minHeight?: string;
}

export default function Section({
  title = "Section",
  content = "Contenu de la section",
  backgroundImage = "",
  backgroundColor = "#f1f5f9",
  backgroundOpacity = 100,
  textColor = "#0f172a",
  overlay = 40,
  align = "center",
  minHeight = "300px",
}: SectionProps) {
  const { isMobile, isTablet } = useMediaQuery();

  return (
    <div
      style={{
        position: "relative",
        minHeight: isMobile ? "250px" : minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        padding: isMobile ? "2rem 1rem" : isTablet ? "2.5rem 1.5rem" : "3rem 2rem",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: backgroundImage ? "transparent" : backgroundColor,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: textColor,
        opacity: backgroundOpacity / 100,
        overflow: "hidden",
      }}
    >
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0,0,0,${overlay / 100})`,
            zIndex: 1,
          }}
        />
      )}
      <div style={{ 
        position: "relative", 
        zIndex: 2, 
        maxWidth: isMobile ? "100%" : "800px", 
        textAlign: align,
        padding: isMobile ? "0 0.5rem" : "0",
      }}>
        {title && (
          <h2 style={{ 
            fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem", 
            fontWeight: "800", 
            marginBottom: "1rem", 
            lineHeight: 1.2 
          }}>
            {title}
          </h2>
        )}
        {content && (
          <p style={{ 
            fontSize: isMobile ? "0.95rem" : isTablet ? "1rem" : "1.125rem", 
            lineHeight: 1.8, 
            opacity: 0.95 
          }}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
}
