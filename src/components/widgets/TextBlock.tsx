import { useMediaQuery } from "../../hooks/useMediaQuery";

interface TextBlockProps {
  content?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundOpacity?: number;
  padding?: string;
}

export default function TextBlock({ 
  content = "", 
  backgroundColor = "transparent",
  textColor = "#0f172a",
  backgroundOpacity = 100,
  padding,
}: TextBlockProps) {
  const { isMobile, isTablet } = useMediaQuery();

  // Simple markdown parser pour les titres et paragraphes
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line, idx) => {
      if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} style={{ 
          fontSize: isMobile ? "1.25rem" : "1.5rem", 
          fontWeight: "700", 
          marginTop: isMobile ? "1rem" : "1.5rem", 
          marginBottom: "0.75rem" 
        }}>{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} style={{ 
          fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "1.875rem", 
          fontWeight: "800", 
          marginTop: isMobile ? "1.5rem" : "2rem", 
          marginBottom: "1rem" 
        }}>{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} style={{ 
          fontSize: isMobile ? "1.75rem" : isTablet ? "2rem" : "2.25rem", 
          fontWeight: "900", 
          marginTop: isMobile ? "1.5rem" : "2rem", 
          marginBottom: "1rem" 
        }}>{line.slice(2)}</h1>);
      } else if (line.trim() === '') {
        elements.push(<br key={idx} />);
      } else {
        elements.push(<p key={idx} style={{ 
          marginBottom: "0.75rem", 
          lineHeight: "1.75", 
          fontSize: isMobile ? "0.95rem" : "1.0625rem" 
        }}>{line}</p>);
      }
    });
    
    return elements;
  };

  return (
    <div style={{ 
      padding: padding || (isMobile ? "1.5rem 1rem" : isTablet ? "1.75rem 1.5rem" : "2rem"),
      maxWidth: "900px", 
      margin: "0 auto",
      background: backgroundColor,
      opacity: backgroundOpacity / 100,
      color: textColor,
      borderRadius: backgroundColor !== "transparent" ? "0.75rem" : "0",
    }}>
      {parseMarkdown(content)}
    </div>
  );
}