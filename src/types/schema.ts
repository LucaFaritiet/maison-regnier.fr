export type WidgetType = "hero" | "text" | "image" | "card" | "section" | "gallery" | "contact";

export interface Widget {
  id: string;
  type: WidgetType;
  props: Record<string, any>;
  // Layout utilisé par react-grid-layout
  layout: { i: string; x: number; y: number; w: number; h: number; };
}

export interface Theme {
  primary: string;           // bouton, accents
  primaryOpacity?: number;   // opacité du primaire (0-100)
  background: string;        // fond
  backgroundOpacity?: number; // opacité du fond (0-100)
  text: string;              // texte global
  textOpacity?: number;      // opacité du texte (0-100)
}

export interface ImageAsset {
  path: string;
  name: string;
}

export interface NavLink {
  id: string;
  label: string;        // Texte affiché (ex: "Accueil")
  anchor: string;       // ID de destination (ex: "accueil")
  visible: boolean;     // Afficher ce lien ?
  order: number;        // Ordre d'affichage
}