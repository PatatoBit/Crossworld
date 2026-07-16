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
    name: "บทสอน",
    blurb: "เริ่มที่นี่ — เรียนรู้การเล่นกับธีมพลังงานสะอาด",
    puzzle: samplePuzzle,
  },
  {
    id: "north-america",
    name: "อเมริกาเหนือ",
    blurb: "พลังงานสะอาดและการปล่อยมลพิษ",
    puzzle: northAmericaPuzzle,
  },
  {
    id: "south-america",
    name: "อเมริกาใต้",
    blurb: "ป่าฝนและความหลากหลายทางชีวภาพ",
    puzzle: southAmericaPuzzle,
  },
  {
    id: "europe",
    name: "ยุโรป",
    blurb: "เศรษฐกิจหมุนเวียนและการรีไซเคิล",
    puzzle: europePuzzle,
  },
  {
    id: "africa",
    name: "แอฟริกา",
    blurb: "น้ำ ภัยแล้ง และความยืดหยุ่น",
    puzzle: africaPuzzle,
  },
  {
    id: "asia",
    name: "เอเชีย",
    blurb: "เมืองใหญ่และอากาศบริสุทธิ์",
    puzzle: asiaPuzzle,
  },
  {
    id: "oceania",
    name: "โอเชียเนีย",
    blurb: "แนวปะการังและระดับน้ำทะเลที่สูงขึ้น",
    puzzle: oceaniaPuzzle,
  },
  {
    id: "antarctica",
    name: "แอนตาร์กติกา",
    blurb: "น้ำแข็ง ภูมิอากาศ และนาฬิกาคาร์บอน",
    puzzle: antarcticaPuzzle,
  },
];

export function findLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
