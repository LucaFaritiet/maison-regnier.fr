import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useSiteStore } from "../store/useSiteStore";
import ImagePicker from "./ImagePicker";
import { availableImages } from "../utils/images";
import GradientPicker from "./GradientPicker";
import ImageManager from "./ImageManager";
import NavigationEditor from "./NavigationEditor";
import AnchorField from "./AnchorField";

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<"edition" | "images" | "navigation">("edition");
  
  // ✅ Selectors séparés pour éviter la recréation d'objet
  const theme = useSiteStore((s) => s.theme);
  const setTheme = useSiteStore((s) => s.setTheme);
  const widgets = useSiteStore((s) => s.widgets);
  const selectedId = useSiteStore((s) => s.selectedId);
  const addWidget = useSiteStore((s) => s.addWidget);
  const removeWidget = useSiteStore((s) => s.removeWidget);
  const duplicateWidget = useSiteStore((s) => s.duplicateWidget);
  const updateWidgetProps = useSiteStore((s) => s.updateWidgetProps);
  const hiddenImageUrls = useSiteStore((s) => s.hiddenImageUrls);
  const uploadedImages = useSiteStore((s) => s.uploadedImages);

  const usableImages = [
    ...availableImages.filter((img) => !hiddenImageUrls.includes(img)),
    ...uploadedImages.map((img) => img.url),
  ];

  const selected = widgets.find((w: any) => w.id === selectedId);

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "0.75rem",
    background: isActive ? "#3b82f6" : "#e2e8f0",
    color: isActive ? "white" : "#475569",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <aside style={{ 
      padding: "1.5rem", 
      display: "flex", 
      flexDirection: "column", 
      gap: "1.5rem",
      height: "100%",
      overflowY: "auto",
    }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: "800" }}>
          🎨 Éditeur
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
          Personnalisez votre site sans coder
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          style={tabButtonStyle(activeTab === "edition")}
          onClick={() => setActiveTab("edition")}
        >
          ✏️ Édition
        </button>
        <button
          style={tabButtonStyle(activeTab === "navigation")}
          onClick={() => setActiveTab("navigation")}
        >
          🧭 Navigation
        </button>
        <button
          style={tabButtonStyle(activeTab === "images")}
          onClick={() => setActiveTab("images")}
        >
          🖼️ Images
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "images" && <ImageManager />}
      {activeTab === "navigation" && <NavigationEditor />}
      
      {activeTab === "edition" && (
        <>
      {/* Thème */}
      <section style={section()}>
        <h3 style={sectionTitle()}>Couleurs du site</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <GradientPicker 
              label="Couleur principale"
              value={theme.primary} 
              onChange={(c) => setTheme({ primary: c })} 
            />
            <div style={{ marginTop: "0.5rem" }}>
              <label style={label()}>Transparence (%)</label>
              <input 
                type="range"
                min="0"
                max="100"
                style={{ width: "100%" }}
                value={theme.primaryOpacity || 100} 
                onChange={(e) => setTheme({ primaryOpacity: Number(e.target.value) })} 
              />
              <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                {theme.primaryOpacity || 100}%
              </div>
            </div>
          </div>
          <div>
            <GradientPicker 
              label="Fond"
              value={theme.background} 
              onChange={(c) => setTheme({ background: c })} 
            />
            <div style={{ marginTop: "0.5rem" }}>
              <label style={label()}>Transparence (%)</label>
              <input 
                type="range"
                min="0"
                max="100"
                style={{ width: "100%" }}
                value={theme.backgroundOpacity || 100} 
                onChange={(e) => setTheme({ backgroundOpacity: Number(e.target.value) })} 
              />
              <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                {theme.backgroundOpacity || 100}%
              </div>
            </div>
          </div>
          <div>
            <GradientPicker 
              label="Couleur du texte"
              value={theme.text} 
              onChange={(c) => setTheme({ text: c })} 
            />
            <div style={{ marginTop: "0.5rem" }}>
              <label style={label()}>Transparence (%)</label>
              <input 
                type="range"
                min="0"
                max="100"
                style={{ width: "100%" }}
                value={theme.textOpacity || 100} 
                onChange={(e) => setTheme({ textOpacity: Number(e.target.value) })} 
              />
              <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                {theme.textOpacity || 100}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ajouter un bloc */}
      <section style={section()}>
        <h3 style={sectionTitle()}>Ajouter un bloc</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
          <button style={addBtn()} onClick={() => addWidget("section")}>📄 Section</button>
          <button style={addBtn()} onClick={() => addWidget("gallery")}>🖼️ Galerie</button>
          <button style={addBtn()} onClick={() => addWidget("text")}>📝 Texte</button>
          <button style={addBtn()} onClick={() => addWidget("contact")}>📞 Contact</button>
          <button style={addBtn()} onClick={() => addWidget("hero")}>🎯 Hero</button>
          <button style={addBtn()} onClick={() => addWidget("card")}>🃏 Card</button>
        </div>
      </section>

      {/* Bloc sélectionné */}
      <section style={section()}>
        <h3 style={sectionTitle()}>
          {selected ? `✏️ ${selected.type.toUpperCase()}` : "Aucun bloc sélectionné"}
        </h3>
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* HERO */}
            {selected.type === "hero" && (
              <>
                <div>
                  <label style={label()}>Titre</label>
                  <input 
                    style={input()} 
                    value={selected.props.title || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { title: e.target.value })} 
                    placeholder="Titre principal…" 
                  />
                </div>
                <div>
                  <label style={label()}>Sous-titre</label>
                  <input 
                    style={input()} 
                    value={selected.props.subtitle || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { subtitle: e.target.value })} 
                    placeholder="Sous-titre…" 
                  />
                </div>
                <div>
                  <label style={label()}>Alignement</label>
                  <select 
                    style={input()} 
                    value={selected.props.align || "left"} 
                    onChange={(e) => updateWidgetProps(selected.id, { align: e.target.value })}
                  >
                    <option value="left">Gauche</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </div>
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* TEXT */}
            {/* TEXT */}
            {selected.type === "text" && (
              <>
                <div>
                  <label style={label()}>Contenu (Markdown supporté)</label>
                  <textarea 
                    style={{...input(), height: "150px", fontFamily: "monospace", fontSize: "0.875rem"}} 
                    value={selected.props.content || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { content: e.target.value })} 
                    placeholder="# Titre\n\nVotre contenu en markdown..." 
                  />
                </div>
                <div>
                  <GradientPicker 
                    label="Couleur de fond"
                    value={selected.props.backgroundColor || "#ffffff"} 
                    onChange={(c) => updateWidgetProps(selected.id, { backgroundColor: c })} 
                  />
                  <button
                    style={{...addBtn(), marginTop: "0.5rem"}}
                    onClick={() => updateWidgetProps(selected.id, { backgroundColor: "transparent" })}
                  >
                    🚫 Transparent
                  </button>
                </div>
                <div>
                  <label style={label()}>Transparence fond (%)</label>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    style={{ width: "100%" }}
                    value={selected.props.backgroundOpacity || 100} 
                    onChange={(e) => updateWidgetProps(selected.id, { backgroundOpacity: Number(e.target.value) })} 
                  />
                  <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {selected.props.backgroundOpacity || 100}%
                  </div>
                </div>
                <div>
                  <label style={label()}>Couleur du texte</label>
                  <HexColorPicker 
                    color={selected.props.textColor || "#0f172a"} 
                    onChange={(c) => updateWidgetProps(selected.id, { textColor: c })} 
                    style={{ width: "100%" }} 
                  />
                  <input 
                    value={selected.props.textColor || "#0f172a"} 
                    onChange={(e) => updateWidgetProps(selected.id, { textColor: e.target.value })}
                    style={{...input(), marginTop: "0.5rem"}} 
                  />
                </div>
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* CARD */}
            {selected.type === "card" && (
              <>
                <div>
                  <label style={label()}>Titre</label>
                  <input 
                    style={input()} 
                    value={selected.props.title || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { title: e.target.value })} 
                    placeholder="Titre de la carte…" 
                  />
                </div>
                <div>
                  <label style={label()}>Contenu</label>
                  <textarea 
                    style={{...input(), height: "100px"}} 
                    value={selected.props.body || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { body: e.target.value })} 
                    placeholder="Description…" 
                  />
                </div>
                <ImagePicker 
                  value={selected.props.image || ""} 
                  onChange={(url) => updateWidgetProps(selected.id, { image: url })}
                  label="Image de la carte"
                />
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* SECTION */}
            {selected.type === "section" && (
              <>
                <div>
                  <label style={label()}>Titre</label>
                  <input 
                    style={input()} 
                    value={selected.props.title || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { title: e.target.value })} 
                    placeholder="Titre de la section…" 
                  />
                </div>
                <div>
                  <label style={label()}>Contenu</label>
                  <textarea 
                    style={{...input(), height: "100px"}} 
                    value={selected.props.content || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { content: e.target.value })} 
                    placeholder="Texte de la section…" 
                  />
                </div>
                <ImagePicker 
                  value={selected.props.backgroundImage || ""} 
                  onChange={(url) => updateWidgetProps(selected.id, { backgroundImage: url })}
                  label="Image de fond"
                />
                <div>
                  <label style={label()}>Opacité overlay (0-100)</label>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    style={{ width: "100%" }}
                    value={selected.props.overlay || 40} 
                    onChange={(e) => updateWidgetProps(selected.id, { overlay: Number(e.target.value) })} 
                  />
                  <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {selected.props.overlay || 40}%
                  </div>
                </div>
                <div>
                  <GradientPicker 
                    label="Couleur de fond"
                    value={selected.props.backgroundColor || "#f1f5f9"} 
                    onChange={(c) => updateWidgetProps(selected.id, { backgroundColor: c })} 
                  />
                </div>
                <div>
                  <label style={label()}>Transparence fond (%)</label>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    style={{ width: "100%" }}
                    value={selected.props.backgroundOpacity || 100} 
                    onChange={(e) => updateWidgetProps(selected.id, { backgroundOpacity: Number(e.target.value) })} 
                  />
                  <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {selected.props.backgroundOpacity || 100}%
                  </div>
                </div>
                <div>
                  <label style={label()}>Couleur du texte</label>
                  <input 
                    type="color"
                    style={{ width: "100%", height: "40px", cursor: "pointer" }}
                    value={selected.props.textColor || "#0f172a"} 
                    onChange={(e) => updateWidgetProps(selected.id, { textColor: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={label()}>Alignement</label>
                  <select 
                    style={input()} 
                    value={selected.props.align || "center"} 
                    onChange={(e) => updateWidgetProps(selected.id, { align: e.target.value })}
                  >
                    <option value="left">Gauche</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </div>
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* GALLERY */}
            {selected.type === "gallery" && (
              <>
                <div>
                  <label style={label()}>Images</label>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(3, 1fr)", 
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}>
                    {(selected.props.images || []).map((img: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #e5e7eb",
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`${idx}`} 
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          onClick={() => {
                            const newImages = [...selected.props.images];
                            newImages.splice(idx, 1);
                            updateWidgetProps(selected.id, { images: newImages });
                          }}
                          style={{
                            position: "absolute",
                            top: "0.25rem",
                            right: "0.25rem",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    style={input()}
                    onChange={(e) => {
                      if (e.target.value) {
                        const newImages = [...(selected.props.images || []), e.target.value];
                        updateWidgetProps(selected.id, { images: newImages });
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">+ Ajouter une image</option>
                    {usableImages.map((img) => (
                      <option key={img} value={img}>{img.split('/').pop()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label()}>Colonnes</label>
                  <input 
                    type="number"
                    min="1"
                    max="6"
                    style={input()} 
                    value={selected.props.columns || 3} 
                    onChange={(e) => updateWidgetProps(selected.id, { columns: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label style={label()}>Espace entre images (px)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="48" 
                    style={input()} 
                    value={selected.props.gap || 16} 
                    onChange={(e) => updateWidgetProps(selected.id, { gap: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155", display: "block", marginBottom: "0.5rem" }}>
                    <input 
                      type="checkbox"
                      checked={selected.props.showLightbox !== false}
                      onChange={(e) => updateWidgetProps(selected.id, { showLightbox: e.target.checked })}
                      style={{ marginRight: "0.5rem" }}
                    />
                    Activer le zoom d'images
                  </label>
                </div>
                <div>
                  <label style={label()}>Overlay sombre sur images</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    style={{ width: "100%" }} 
                    value={selected.props.overlay || 0} 
                    onChange={(e) => updateWidgetProps(selected.id, { overlay: parseInt(e.target.value) })} 
                  />
                  <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {selected.props.overlay || 0}%
                  </div>
                </div>
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* CONTACT */}
            {selected.type === "contact" && (
              <>
                <div>
                  <label style={label()}>Titre</label>
                  <input 
                    style={input()} 
                    value={selected.props.title || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { title: e.target.value })} 
                    placeholder="Nous contacter…" 
                  />
                </div>
                <div>
                  <label style={label()}>Téléphone</label>
                  <input 
                    style={input()} 
                    value={selected.props.phone || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { phone: e.target.value })} 
                    placeholder="+33 X XX XX XX XX" 
                  />
                </div>
                <div>
                  <label style={label()}>Email</label>
                  <input 
                    type="email"
                    style={input()} 
                    value={selected.props.email || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { email: e.target.value })} 
                    placeholder="contact@example.fr" 
                  />
                </div>
                <div>
                  <label style={label()}>Adresse</label>
                  <input 
                    style={input()} 
                    value={selected.props.address || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { address: e.target.value })} 
                    placeholder="Adresse complète…" 
                  />
                </div>
                <div>
                  <label style={label()}>Horaires</label>
                  <input 
                    style={input()} 
                    value={selected.props.hours || ""} 
                    onChange={(e) => updateWidgetProps(selected.id, { hours: e.target.value })} 
                    placeholder="Lun-Sam: 9h-18h" 
                  />
                </div>
                <div>
                  <GradientPicker 
                    label="Couleur de fond"
                    value={selected.props.backgroundColor || "#f8fafc"} 
                    onChange={(c) => updateWidgetProps(selected.id, { backgroundColor: c })} 
                  />
                  <button
                    style={{...addBtn(), marginTop: "0.5rem"}}
                    onClick={() => updateWidgetProps(selected.id, { backgroundColor: "transparent" })}
                  >
                    🚫 Transparent
                  </button>
                </div>
                <div>
                  <label style={label()}>Transparence (%)</label>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    style={{ width: "100%" }}
                    value={selected.props.backgroundOpacity || 100} 
                    onChange={(e) => updateWidgetProps(selected.id, { backgroundOpacity: Number(e.target.value) })} 
                  />
                  <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {selected.props.backgroundOpacity || 100}%
                  </div>
                </div>
                <AnchorField
                  value={selected.props.anchor || ""}
                  onChange={(value) => updateWidgetProps(selected.id, { anchor: value })}
                />
              </>
            )}

            {/* Actions */}
            <div style={{ 
              display: "flex", 
              gap: "0.5rem", 
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #e5e7eb",
            }}>
              <button 
                style={dangerBtn()} 
                onClick={() => {
                  if (confirm("Supprimer ce bloc ?")) {
                    removeWidget(selected.id);
                  }
                }}
              >
                🗑️ Supprimer
              </button>
              <button 
                style={primaryBtn()} 
                onClick={() => duplicateWidget(selected.id)}
              >
                📋 Dupliquer
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", fontStyle: "italic" }}>
            Cliquez sur un bloc dans la zone de contenu pour l'éditer.
          </p>
        )}
      </section>
        </>
      )}
    </aside>
  );
}

function section(): React.CSSProperties {
  return { 
    background: "#f8fafc", 
    padding: "1.25rem", 
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
  };
}

function sectionTitle(): React.CSSProperties {
  return { 
    marginTop: 0, 
    marginBottom: "1rem", 
    fontSize: "1rem", 
    fontWeight: "700",
    color: "#0f172a",
  };
}

function label(): React.CSSProperties {
  return { 
    display: "block", 
    marginBottom: "0.5rem", 
    fontWeight: "600", 
    fontSize: "0.875rem",
    color: "#475569",
  };
}

function input(): React.CSSProperties {
  return { 
    width: "100%", 
    border: "2px solid #e2e8f0", 
    borderRadius: "0.5rem", 
    padding: "0.625rem", 
    background: "white",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  };
}

function addBtn(): React.CSSProperties {
  return { 
    background: "#3b82f6", 
    color: "white", 
    border: "none", 
    borderRadius: "0.5rem", 
    padding: "0.625rem", 
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "background 0.2s",
  };
}

function primaryBtn(): React.CSSProperties {
  return { 
    flex: 1,
    background: "#3b82f6", 
    color: "white", 
    border: "none", 
    borderRadius: "0.5rem", 
    padding: "0.625rem", 
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
  };
}

function dangerBtn(): React.CSSProperties {
  return { 
    flex: 1,
    background: "#ef4444", 
    color: "white", 
    border: "none", 
    borderRadius: "0.5rem", 
    padding: "0.625rem", 
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
  };
}
``