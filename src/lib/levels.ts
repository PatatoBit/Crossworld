import type { Puzzle } from "./crossword/types";
import { samplePuzzle } from "./crossword/sample";
import {
  africaPuzzle,
  antarcticaPuzzle,
  asiaPuzzle,
  europePuzzle,
  northAmericaPuzzle,
  oceaniaPuzzle,
  southAmericaPuzzle,
} from "./crossword/continents";

/**
 * The campaign levels in play order: tutorial (`demo`) first, then the 7
 * continents in ascending difficulty (North America → Antarctica). Players
 * must clear each level before the next unlocks (see `progress.isUnlocked`).
 * Each continent puzzle is themed on that region's sustainability crisis.
 *
 * `/play/[id]` looks the level up here by `id`.
 */
export interface Level {
  id: string;
  /** Continent / region name shown in the selection screen. */
  name: string;
  /** One-line flavour for the card. */
  blurb: string;
  /** The puzzle to load. */
  puzzle: Puzzle;
}

export const levels: Level[] = [
  {
    id: "demo",
    name: "สอนการเล่น",
    blurb: "เรียนรู้วิธีเล่น Crossword สามมิติ",
    puzzle: samplePuzzle,
  },
  {
    id: "north-america",
    name: "North America",
    blurb: "Clean energy and emissions",
    puzzle: northAmericaPuzzle,
  },
  {
    id: "south-america",
    name: "South America",
    blurb: "Rainforest and biodiversity",
    puzzle: southAmericaPuzzle,
  },
  {
    id: "europe",
    name: "Europe",
    blurb: "Circular economy and recycling",
    puzzle: europePuzzle,
  },
  {
    id: "africa",
    name: "Africa",
    blurb: "Water, drought, and resilience",
    puzzle: africaPuzzle,
  },
  {
    id: "asia",
    name: "Asia",
    blurb: "Megacities and clean air",
    puzzle: asiaPuzzle,
  },
  {
    id: "oceania",
    name: "Oceania",
    blurb: "Coral reefs and rising seas",
    puzzle: oceaniaPuzzle,
  },
  {
    id: "antarctica",
    name: "Antarctica",
    blurb: "Ice, climate, and the carbon clock",
    puzzle: antarcticaPuzzle,
  },
];

export function findLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
