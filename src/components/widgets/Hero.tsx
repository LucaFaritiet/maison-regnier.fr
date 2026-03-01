import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function Hero({ title, subtitle, align = "left" }: { title: string; subtitle?: string; align?: "left"|"center"|"right" }) {
  const { isMobile } = useMediaQuery();
  
  const style: React.CSSProperties = { 
    textAlign: align as any, 
    padding: isMobile ? "1.5rem 1rem" : "2rem" 
  };
  
  return (
    <section style={style}>
      <h1 style={{ 
        fontSize: isMobile ? "1.75rem" : "2rem", 
        marginBottom: ".5rem", 
        color: "var(--color-primary)" 
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ 
          opacity: .8, 
          fontSize: isMobile ? "0.9rem" : "1rem" 
        }}>
          {subtitle}
        </p>
      )}
    </section>
  );
}