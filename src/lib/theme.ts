/**
 * 3D scene colors. Three.js/Threlte can't read CSS custom properties, so the
 * eco palette used inside the WebGL canvas lives here as plain constants,
 * mirroring the `--*` tokens in `app.css`.
 */
export const sceneColors = {
  cell: {
    default: { color: "#2e7d4f", emissive: "#14532d", edge: "#7fd3a0" },
    highlighted: { color: "#22c55e", emissive: "#16a34a", edge: "#e6f9b5" },
    /** Active cursor cell — brighter yellow than incorrect. */
    active: { color: "#f6c915", emissive: "#eab308", edge: "#fff3bf" },
    completed: { color: "#4ade80", emissive: "#22c55e", edge: "#bbf7d0" },
    /** Fully filled but wrong — amber so it reads as a warning. */
    incorrect: { color: "#eab308", emissive: "#ca8a04", edge: "#fde68a" },
    /** Selected/hovered line when that word is filled incorrectly. */
    highlightedIncorrect: { color: "#f59e0b", emissive: "#d97706", edge: "#fef08a" },
  },
  letter: "#f4f2e6",
  number: "#a3d9b1",
  rayLine: "#f6c915",
  rayHit: "#f43f5e",
  globe: {
    /** Apple Maps–style flat map palette. */
    ocean: "#15334f",
    land: "#3d8f82",
    landHover: "#52a899",
    landActive: "#6ec4b8",
    connector: "rgba(110, 196, 184, 0.35)",
    connectorActive: "rgba(110, 196, 184, 0.85)",
    label: "#e8e4d9",
  },
} as const;
