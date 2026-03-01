import { useSiteStore } from "../store/useSiteStore";
import { widgetRegistry } from "../components/widgets/registry";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function PublicPage() {
  // ✅ Selectors séparés pour éviter la recréation d'objet
  const widgets = useSiteStore((s) => s.widgets);
  const theme = useSiteStore((s) => s.theme);
  const navLinks = useSiteStore((s) => s.navLinks);
  const { isMobile } = useMediaQuery();

  const visibleNavLinks = navLinks
    .filter((link) => link.visible)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.getElementById(anchor);
    if (element) {
      const headerOffset = 80; // Hauteur du header sticky
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.background, color: theme.text }}>
      {/* Header - Responsive */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        padding: isMobile ? "0.75rem 1rem" : "1rem 2rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? "0.75rem" : "0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <div style={{ 
          fontWeight: "800", 
          fontSize: isMobile ? "1.25rem" : "1.5rem",
          background: `linear-gradient(135deg, ${theme.primary} 0%, #764ba2 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          🦪 Maison Regnier
        </div>
        <nav style={{ 
          display: "flex", 
          gap: isMobile ? "1rem" : "2rem", 
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          fontSize: isMobile ? "0.875rem" : "1rem",
        }}>
          {visibleNavLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.anchor}`}
              onClick={(e) => handleNavClick(e, link.anchor)}
              style={{ color: "inherit", textDecoration: "none", fontWeight: "500" }}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="/login" 
            style={{ 
              padding: isMobile ? "0.4rem 0.8rem" : "0.5rem 1rem", 
              background: theme.primary, 
              color: "white", 
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
          >
            Admin
          </a>
        </nav>
      </header>

      {/* Widgets */}
      <main>
        {widgets.map((w: any) => {
          const Cmp = widgetRegistry[w.type as keyof typeof widgetRegistry] as any;
          if (!Cmp) return null;
          return (
            <div key={w.id} id={w.props.anchor || undefined}>
              <Cmp {...w.props} />
            </div>
          );
        })}
      </main>

      {/* Footer - Responsive */}
      <footer style={{
        padding: isMobile ? "1.5rem 1rem" : "2rem",
        background: "#0f172a",
        color: "white",
        textAlign: "center",
      }}>
        <div style={{ 
          marginBottom: "1rem", 
          fontSize: isMobile ? "1rem" : "1.125rem", 
          fontWeight: "600" 
        }}>
          Maison Regnier - Ostréiculteur
        </div>
        <div style={{ opacity: 0.7, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
          © {new Date().getFullYear()} - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
