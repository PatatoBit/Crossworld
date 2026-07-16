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
  {
    id: "demo",
    name: "ตัวอย่าง",
    blurb: "ลองเล่น CrossWorld เรื่องพลังงานสะอาด",
    puzzle: samplePuzzle,
  },
  {
    id: "north-america",
    name: "อเมริกาเหนือ",
    blurb: "พลังงานสะอาดและการปล่อยมลพิษ",
    puzzle: null,
  },
  {
    id: "south-america",
    name: "อเมริกาใต้",
    blurb: "ป่าฝนและความหลากหลายทางชีวภาพ",
    puzzle: null,
  },
  {
    id: "europe",
    name: "ยุโรป",
    blurb: "เศรษฐกิจหมุนเวียนและการรีไซเคิล",
    puzzle: null,
  },
  {
    id: "africa",
    name: "แอฟริกา",
    blurb: "น้ำ ภัยแล้ง และความยืดหยุ่น",
    puzzle: null,
  },
  {
    id: "asia",
    name: "เอเชีย",
    blurb: "เมืองใหญ่และอากาศบริสุทธิ์",
    puzzle: null,
  },
  {
    id: "oceania",
    name: "โอเชียเนีย",
    blurb: "แนวปะการังและระดับน้ำทะเลที่สูงขึ้น",
    puzzle: null,
  },
  {
    id: "antarctica",
    name: "แอนตาร์กติกา",
    blurb: "น้ำแข็ง ภูมิอากาศ และนาฬิกาคาร์บอน",
    puzzle: null,
  },
];

export function findLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
