import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface GradientPickerProps {
  value: string; // Format: "linear-gradient(angle, color1, color2)" ou "#hexcolor"
  onChange: (value: string) => void;
  label?: string;
}

export default function GradientPicker({ value, onChange, label }: GradientPickerProps) {
  const [useGradient, setUseGradient] = useState(value.startsWith("linear-gradient"));
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#667eea");
  const [color2, setColor2] = useState("#764ba2");
  const [solidColor, setSolidColor] = useState(value.startsWith("#") ? value : "#ffffff");

  // Parser le gradient existant
  useState(() => {
    if (value.startsWith("linear-gradient")) {
      const match = value.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/);
      if (match) {
        setAngle(parseInt(match[1]));
        setColor1(match[2].trim());
        setColor2(match[3].trim());
      }
    }
  });

  const applyGradient = () => {
    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    onChange(gradient);
  };

  const applySolid = () => {
    onChange(solidColor);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {label && <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }}>{label}</label>}
      
      {/* Toggle Solid/Gradient */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => {
            setUseGradient(false);
            applySolid();
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            background: !useGradient ? "#3b82f6" : "#e2e8f0",
            color: !useGradient ? "white" : "#334155",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Couleur unie
        </button>
        <button
          type="button"
          onClick={() => {
            setUseGradient(true);
            applyGradient();
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            background: useGradient ? "#3b82f6" : "#e2e8f0",
            color: useGradient ? "white" : "#334155",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Dégradé
        </button>
      </div>

      {!useGradient ? (
        // Couleur unie
        <div>
          <HexColorPicker 
            color={solidColor} 
            onChange={(c) => {
              setSolidColor(c);
              onChange(c);
            }} 
            style={{ width: "100%" }} 
          />
          <input 
            value={solidColor} 
            onChange={(e) => {
              setSolidColor(e.target.value);
              onChange(e.target.value);
            }}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "0.5rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }} 
          />
        </div>
      ) : (
        // Dégradé
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
              Angle: {angle}°
            </label>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={angle}
              onChange={(e) => {
                const newAngle = parseInt(e.target.value);
                setAngle(newAngle);
                onChange(`linear-gradient(${newAngle}deg, ${color1}, ${color2})`);
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
              Couleur 1
            </label>
            <HexColorPicker 
              color={color1} 
              onChange={(c) => {
                setColor1(c);
                onChange(`linear-gradient(${angle}deg, ${c}, ${color2})`);
              }} 
              style={{ width: "100%", height: "120px" }} 
            />
            <input 
              value={color1} 
              onChange={(e) => {
                setColor1(e.target.value);
                onChange(`linear-gradient(${angle}deg, ${e.target.value}, ${color2})`);
              }}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.5rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }} 
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
              Couleur 2
            </label>
            <HexColorPicker 
              color={color2} 
              onChange={(c) => {
                setColor2(c);
                onChange(`linear-gradient(${angle}deg, ${color1}, ${c})`);
              }} 
              style={{ width: "100%", height: "120px" }} 
            />
            <input 
              value={color2} 
              onChange={(e) => {
                setColor2(e.target.value);
                onChange(`linear-gradient(${angle}deg, ${color1}, ${e.target.value})`);
              }}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.5rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }} 
            />
          </div>

          {/* Prévisualisation */}
          <div style={{
            width: "100%",
            height: "60px",
            borderRadius: "0.5rem",
            background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
            border: "2px solid #e2e8f0",
          }} />
        </div>
      )}
    </div>
  );
}
