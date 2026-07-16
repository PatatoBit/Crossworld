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
  globe: {
    ocean: "#1a4d5c",
    atmosphere: "#7eb8c9",
    /** Fill colors keyed by ArcGIS `CONTINENT` names. */
    continents: {
      Africa: "#3d9b5f",
      Asia: "#2e7d4f",
      Australia: "#4ade80",
      Oceania: "#86efac",
      "South America": "#22c55e",
      Antarctica: "#d4e8dc",
      Europe: "#16a34a",
      "North America": "#15803d",
    } as Record<string, string>,
    landFallback: "#2e7d4f",
  },
} as const;
