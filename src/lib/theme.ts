/**
 * 3D scene colors. Three.js/Threlte can't read CSS custom properties, so the
 * eco palette used inside the WebGL canvas lives here as plain constants,
 * mirroring the `--*` tokens in `app.css`.
 */
export const sceneColors = {
  cell: {
    default: { color: "#2e7d4f", emissive: "#14532d", edge: "#7fd3a0" },
    highlighted: { color: "#22c55e", emissive: "#16a34a", edge: "#e6f9b5" },
    active: { color: "#f6c915", emissive: "#eab308", edge: "#fff3bf" },
    completed: { color: "#4ade80", emissive: "#22c55e", edge: "#bbf7d0" },
  },
  letter: "#f4f2e6",
  number: "#a3d9b1",
  rayLine: "#f6c915",
  rayHit: "#f43f5e",
} as const;
