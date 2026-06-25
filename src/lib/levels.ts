import type { Puzzle } from "./crossword/types";
import { samplePuzzle } from "./crossword/sample";

/**
 * The campaign levels: a standalone demo followed by the 7 continents. The demo
 * ships with the hand-authored puzzle; the continents are placeholders until
 * their puzzles (eventually AI-generated, per the project spec) are authored.
 *
 * A level with `puzzle === null` is "coming soon" — selectable in the UI but
 * not yet playable. `/play/[id]` looks the level up here by `id`.
 */
export interface Level {
  id: string;
  /** Continent / region name shown in the selection screen. */
  name: string;
  /** One-line flavour for the card. */
  blurb: string;
  /** The puzzle to load, or null while unauthored. */
  puzzle: Puzzle | null;
}

export const levels: Level[] = [
  { id: "demo", name: "Demo", blurb: "A taste of Crossworld — clean energy.", puzzle: samplePuzzle },
  { id: "north-america", name: "North America", blurb: "Clean energy & emissions.", puzzle: null },
  { id: "south-america", name: "South America", blurb: "Rainforests & biodiversity.", puzzle: null },
  { id: "europe", name: "Europe", blurb: "Circular economy & recycling.", puzzle: null },
  { id: "africa", name: "Africa", blurb: "Water, drought & resilience.", puzzle: null },
  { id: "asia", name: "Asia", blurb: "Megacities & clean air.", puzzle: null },
  { id: "oceania", name: "Oceania", blurb: "Coral reefs & rising seas.", puzzle: null },
  { id: "antarctica", name: "Antarctica", blurb: "Ice, climate & the carbon clock.", puzzle: null },
];

export function findLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
