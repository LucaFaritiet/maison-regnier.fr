interface AnchorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AnchorField({ value, onChange }: AnchorFieldProps) {
  const label = (): React.CSSProperties => ({
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#475569",
  });

  const input = (): React.CSSProperties => ({
    width: "100%",
    border: "2px solid #e2e8f0",
    borderRadius: "0.5rem",
    padding: "0.625rem",
    background: "white",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "monospace",
    boxSizing: "border-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  return (
    <div style={{
      padding: "0.75rem",
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      borderRadius: "0.5rem",
      boxSizing: "border-box",
      minWidth: 0,
    }}>
      <label style={label()}>
        🔗 Ancre de navigation (optionnel)
      </label>
      <input
        type="text"
        style={input()}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: accueil, produits..."
        title="Ex: accueil, produits, contact"
      />
      <p style={{
        fontSize: "0.75rem",
        color: "#0369a1",
        marginTop: "0.5rem",
        marginBottom: 0,
        wordBreak: "break-word",
      }}>
        💡 Utilisez cette valeur dans l'onglet Navigation pour créer un lien vers ce bloc
      </p>
    </div>
  );
}
