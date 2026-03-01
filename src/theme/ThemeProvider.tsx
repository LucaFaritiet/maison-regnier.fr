import { useEffect } from "react";
import { useSiteStore } from "../store/useSiteStore";

// Convertir hex en RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// Appliquer l'opacité à une couleur hex
function applyOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSiteStore((s) => s.theme);

  useEffect(() => {
    const r = document.documentElement;
    
    r.style.setProperty("--color-primary", applyOpacity(theme.primary, theme.primaryOpacity || 100));
    r.style.setProperty("--color-bg", applyOpacity(theme.background, theme.backgroundOpacity || 100));
    r.style.setProperty("--color-text", applyOpacity(theme.text, theme.textOpacity || 100));
  }, [theme]);

  return <div style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>{children}</div>;
}