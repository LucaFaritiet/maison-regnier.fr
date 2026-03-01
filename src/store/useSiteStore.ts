import { create } from "zustand";
import type { Widget, Theme, WidgetType, NavLink } from "../types/schema";

export type UploadedImage = {
  id: string;
  name: string;
  url: string; // base64 data URL
  uploadedAt: number;
};

type State = {
  admin: boolean;
  widgets: Widget[];
  theme: Theme;
  selectedId?: string | null;
  uploadedImages: UploadedImage[];
  hiddenImageUrls: string[];
  navLinks: NavLink[];
};

type Actions = {
  toggleAdmin: () => void;
  setTheme: (patch: Partial<Theme>) => void;
  addWidget: (type: WidgetType) => void;
  updateWidgetProps: (id: string, patch: Record<string, any>) => void;
  updateLayouts: (layouts: { [id: string]: Widget["layout"] }) => void;
  removeWidget: (id: string) => void;
  duplicateWidget: (id: string) => void;
  select: (id?: string | null) => void;
  loadFromJSON: (json: string) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  addUploadedImage: (image: UploadedImage) => void;
  removeUploadedImage: (id: string) => void;
  hideImageUrl: (url: string) => void;
  restoreImageUrl: (url: string) => void;
  addNavLink: () => void;
  updateNavLink: (id: string, patch: Partial<NavLink>) => void;
  removeNavLink: (id: string) => void;
  reorderNavLinks: (startIndex: number, endIndex: number) => void;
};

const STORAGE_KEY = "site_no_code_v1";

// Helper pour générer des IDs uniques de façon sécurisée
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback pour les environnements sans crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// IMPORTANT : Créer l'état initial UNE SEULE FOIS pour éviter les boucles infinies
const INITIAL_WIDGETS = [
  {
    id: "widget-1",
    type: "section" as WidgetType,
    props: { 
      title: "Maison Regnier", 
      content: "Ostréiculteur passionné depuis 3 générations. Découvrez nos huîtres d'exception cultivées avec soin dans nos parcs.",
      backgroundImage: "/data/img/IMG_4273.jpg",
      textColor: "#ffffff",
      overlay: 50,
      align: "center",
      minHeight: "500px"
    },
    layout: { i: "widget-1", x: 0, y: 0, w: 12, h: 5 },
  },
  {
    id: "widget-2",
    type: "text" as WidgetType,
    props: { content: "## Notre Savoir-Faire\n\nDepuis trois générations, la famille Regnier perpétue la tradition ostréicole avec passion et expertise. Nos huîtres sont élevées dans les meilleurs parcs de la région, bénéficiant d'un environnement exceptionnel qui leur confère une qualité gustative unique." },
    layout: { i: "widget-2", x: 0, y: 5, w: 12, h: 3 },
  },
  {
    id: "widget-3",
    type: "gallery" as WidgetType,
    props: { 
      images: [
        "/data/img/IMG_2520.jpg",
        "/data/img/IMG_3923.jpg",
        "/data/img/IMG_4271.jpg",
        "/data/img/IMG_4272.jpg",
        "/data/img/IMG_6282.jpg",
        "/data/img/IMG_9811.jpg"
      ],
      columns: 3,
      gap: 16
    },
    layout: { i: "widget-3", x: 0, y: 8, w: 12, h: 4 },
  },
  {
    id: "widget-4",
    type: "section" as WidgetType,
    props: { 
      title: "Nos Produits", 
      content: "Des huîtres fraîches, calibrées et triées avec soin. Nos produits sont disponibles à la vente directe sur l'exploitation ou sur commande.",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      align: "center",
      minHeight: "250px"
    },
    layout: { i: "widget-4", x: 0, y: 12, w: 12, h: 3 },
  },
  {
    id: "widget-5",
    type: "contact" as WidgetType,
    props: { 
      title: "Nous Contacter",
      phone: "+33 2 XX XX XX XX",
      email: "contact@maison-regnier.fr",
      address: "Port ostréicole - Zone conchylicole",
      hours: "Mar-Sam: 9h-12h30 / 14h-18h",
      backgroundColor: "#f8fafc"
    },
    layout: { i: "widget-5", x: 0, y: 15, w: 12, h: 4 },
  },
];

const INITIAL_NAV_LINKS: NavLink[] = [
  { id: "nav-1", label: "Accueil", anchor: "accueil", visible: true, order: 1 },
  { id: "nav-2", label: "Produits", anchor: "produits", visible: true, order: 2 },
  { id: "nav-3", label: "Contact", anchor: "contact", visible: true, order: 3 },
];

const INITIAL_STATE: State = {
  admin: false,
  widgets: INITIAL_WIDGETS,
  theme: { primary: "#0ea5e9", background: "#ffffff", text: "#0f172a" },
  selectedId: undefined,
  uploadedImages: [],
  hiddenImageUrls: [],
  navLinks: INITIAL_NAV_LINKS,
};

// Charger localStorage
function load(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Assurer la compatibilité avec les anciennes données
    return {
      ...data,
      uploadedImages: data.uploadedImages || [],
      hiddenImageUrls: data.hiddenImageUrls || [],
      navLinks: data.navLinks || INITIAL_NAV_LINKS,
    };
  } catch {
    return null;
  }
}

export const useSiteStore = create<State & Actions>((set) => ({
  ...(load() ?? INITIAL_STATE),

  toggleAdmin: () => set((s) => ({ admin: !s.admin })),

  setTheme: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),

  addWidget: (type) =>
    set((s) => {
      const id = generateId();
      const baseProps: Record<string, any> = {
        hero: { title: "Nouveau Hero", subtitle: "Sous-titre", align: "left" },
        text: { content: "Nouveau texte." },
        image: { src: "", alt: "Image" },
        card: { title: "Titre", body: "Contenu", image: "" },
        section: { 
          title: "Nouvelle Section", 
          content: "Contenu de la section", 
          backgroundColor: "#f1f5f9",
          textColor: "#0f172a",
          align: "center",
          minHeight: "300px"
        },
        gallery: { 
          images: ["/data/img/IMG_2520.jpg", "/data/img/IMG_3923.jpg", "/data/img/IMG_4271.jpg"],
          columns: 3,
          gap: 16
        },
        contact: { 
          title: "Contact",
          phone: "+33 X XX XX XX XX",
          email: "contact@example.fr",
          address: "Adresse",
          hours: "Lun-Sam: 9h-18h",
          backgroundColor: "#f8fafc"
        },
      }[type];

      const w: Widget = {
        id,
        type,
        props: baseProps,
        layout: { i: id, x: 0, y: Infinity, w: 4, h: 2 }, // y: Infinity -> pousse vers le bas
      };
      return { widgets: [...s.widgets, w], selectedId: id };
    }),

  updateWidgetProps: (id, patch) =>
    set((s) => ({
      widgets: s.widgets.map((w) =>
        w.id === id ? { ...w, props: { ...w.props, ...patch } } : w
      ),
    })),

  updateLayouts: (layouts) =>
    set((s) => ({
      widgets: s.widgets.map((w) =>
        layouts[w.id] ? { ...w, layout: layouts[w.id] } : w
      ),
    })),

  removeWidget: (id) =>
    set((s) => ({
      widgets: s.widgets.filter((w) => w.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  duplicateWidget: (id) =>
    set((s) => {
      const src = s.widgets.find((w) => w.id === id);
      if (!src) return {};
      const newId = generateId();
      const clone: Widget = {
        ...src,
        id: newId,
        layout: { ...src.layout, i: newId, y: src.layout.y + 1 },
      };
      return { widgets: [...s.widgets, clone], selectedId: newId };
    }),

  select: (id) => set({ selectedId: id }),

  reorderWidgets: (startIndex, endIndex) =>
    set((s) => {
      const result = Array.from(s.widgets);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { widgets: result };
    }),

  addUploadedImage: (image) =>
    set((s) => ({
      uploadedImages: [...s.uploadedImages, image],
    })),

  removeUploadedImage: (id) =>
    set((s) => ({
      uploadedImages: s.uploadedImages.filter((img) => img.id !== id),
    })),

  hideImageUrl: (url) =>
    set((s) => ({
      hiddenImageUrls: s.hiddenImageUrls.includes(url)
        ? s.hiddenImageUrls
        : [...s.hiddenImageUrls, url],
    })),

  restoreImageUrl: (url) =>
    set((s) => ({
      hiddenImageUrls: s.hiddenImageUrls.filter((item) => item !== url),
    })),

  addNavLink: () =>
    set((s) => {
      const maxOrder = s.navLinks.reduce((max, link) => Math.max(max, link.order), 0);
      const newLink: NavLink = {
        id: generateId(),
        label: "Nouveau lien",
        anchor: "section",
        visible: true,
        order: maxOrder + 1,
      };
      return { navLinks: [...s.navLinks, newLink] };
    }),

  updateNavLink: (id, patch) =>
    set((s) => ({
      navLinks: s.navLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link
      ),
    })),

  removeNavLink: (id) =>
    set((s) => ({
      navLinks: s.navLinks.filter((link) => link.id !== id),
    })),

  reorderNavLinks: (startIndex, endIndex) =>
    set((s) => {
      const result = Array.from(s.navLinks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Réassigner les ordres après réorganisation
      return {
        navLinks: result.map((link, i) => ({ ...link, order: i + 1 })),
      };
    }),
  
  loadFromJSON: (json) => {
    try {
      const data = JSON.parse(json) as State;
      set(data);
    } catch {
      // ignore erreurs
    }
  },
}));

// Persistance automatique - DÉSACTIVÉE pour éviter les boucles infinies
// À la place, on sauvegarde manuellement dans les actions si nécessaire
let saveTimeout: number | null = null;
useSiteStore.subscribe((state) => {
  // Debounce pour éviter trop d'écritures
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        admin: state.admin,
        widgets: state.widgets,
        theme: state.theme,
        selectedId: state.selectedId,
        uploadedImages: state.uploadedImages,
        hiddenImageUrls: state.hiddenImageUrls,
        navLinks: state.navLinks,
      }));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, 500); // Attendre 500ms après le dernier changement
});
``