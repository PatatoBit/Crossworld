/**
 * 3D scene colors. Three.js/Threlte can't read CSS custom properties, so the
 * eco palette used inside the WebGL canvas lives here as plain constants,
 * mirroring the `--*` tokens in `app.css`.
 */
export const sceneColors = {
  cell: {
    /** Unsolved cells — muted stone so green is reserved for correct words. */
    default: { color: "#7a8578", emissive: "#3d4a40", edge: "#c5cec0" },
    /** Selected/hovered line while the word is still unsolved. */
    highlighted: { color: "#9aa696", emissive: "#5c6f62", edge: "#e4ebe4" },
    /** Active cursor cell — brighter yellow than incorrect. */
    active: { color: "#f6c915", emissive: "#eab308", edge: "#fff3bf" },
    /** Fully correct word — the eco green tint. */
    completed: { color: "#2e7d4f", emissive: "#14532d", edge: "#7fd3a0" },
    /** Selected/hovered line when that word is fully correct. */
    highlightedComplete: { color: "#22c55e", emissive: "#16a34a", edge: "#e6f9b5" },
    /** Fully filled but wrong — amber so it reads as a warning. */
    incorrect: { color: "#eab308", emissive: "#ca8a04", edge: "#fde68a" },
    /** Selected/hovered line when that word is filled incorrectly. */
    highlightedIncorrect: { color: "#f59e0b", emissive: "#d97706", edge: "#fef08a" },
    /** Intersection cells during the switch-word tutorial step. */
    intersection: { color: "#3b82f6", emissive: "#1d4ed8", edge: "#bfdbfe" },
  },
  letter: "#f4f2e6",
  number: "#b8c4b4",
  rayLine: "#f6c915",
  rayHit: "#f43f5e",
  globe: {
    /** Apple Maps–style flat map palette. */
    ocean: "#15334f",
    land: "#3d8f82",
    landHover: "#7eb8ae",
    landActive: "#ffffff",
    connector: "rgba(110, 196, 184, 0.35)",
    connectorActive: "rgba(110, 196, 184, 0.85)",
    label: "#e8e4d9",
  },
} as const;
