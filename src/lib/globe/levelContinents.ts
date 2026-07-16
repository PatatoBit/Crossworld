/** ArcGIS `CONTINENT` names that belong to each playable region level. */
export const LEVEL_CONTINENTS: Record<string, string[]> = {
  "north-america": ["North America"],
  "south-america": ["South America"],
  europe: ["Europe"],
  africa: ["Africa"],
  asia: ["Asia"],
  oceania: ["Oceania", "Australia"],
  antarctica: ["Antarctica"],
};

/** Label / connector anchor on the globe for each level (demo has none). */
export const LEVEL_ANCHORS: Record<string, { lat: number; lon: number }> = {
  "north-america": { lat: 45, lon: -100 },
  "south-america": { lat: -15, lon: -60 },
  europe: { lat: 54, lon: 15 },
  africa: { lat: 5, lon: 20 },
  asia: { lat: 34, lon: 100 },
  oceania: { lat: -25, lon: 135 },
  antarctica: { lat: -78, lon: 0 },
};

const continentToLevel = new Map<string, string>();
for (const [levelId, names] of Object.entries(LEVEL_CONTINENTS)) {
  for (const name of names) continentToLevel.set(name, levelId);
}

export function levelIdForContinent(name: string): string | undefined {
  return continentToLevel.get(name);
}

export function isContinentHighlighted(
  continentName: string,
  activeId: string | null,
  hoveredId: string | null,
): boolean {
  const levelId = levelIdForContinent(continentName);
  if (!levelId) return false;
  return levelId === activeId || levelId === hoveredId;
}

export type ScreenAnchor = {
  x: number;
  y: number;
  visible: boolean;
};
