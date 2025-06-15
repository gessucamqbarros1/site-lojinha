
import React from "react";

interface TextStyleControlsProps {
  value: {
    font: string;
    color: string;
    size: string;
  };
  onChange: (val: { font: string; color: string; size: string }) => void;
  label?: string;
}

const FONT_OPTIONS = [
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Serif (Padrão)", value: "serif" },
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Monospace", value: "monospace" }
];

const SIZE_OPTIONS = [
  { label: "Pequeno", value: "1rem" },
  { label: "Normal", value: "1.2rem" },
  { label: "Médio", value: "2rem" },
  { label: "Grande", value: "2.5rem" },
  { label: "Extra Grande", value: "3rem" },
];

const TextStyleControls: React.FC<TextStyleControlsProps> = ({ value, onChange, label }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-xs font-medium text-vintage-dark/70">{label}</label>}
    <div className="flex flex-wrap gap-2 items-center">
      <select
        className="border rounded p-1 text-xs"
        value={value.font}
        onChange={(e) => onChange({ ...value, font: e.target.value })}
      >
        {FONT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="color"
        value={value.color}
        onChange={e => onChange({ ...value, color: e.target.value })}
        className="w-8 h-8 border p-0"
        title="Escolher cor do texto"
      />
      <select
        className="border rounded p-1 text-xs"
        value={value.size}
        onChange={(e) => onChange({ ...value, size: e.target.value })}
      >
        {SIZE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default TextStyleControls;
