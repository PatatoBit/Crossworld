import type { Puzzle } from "./types";

/**
 * A tiny hand-authored puzzle that intersects across all three axes,
 * themed on sustainability (matching the project's content framework).
 *
 *   SOLAR runs along X from (0,0,0).
 *   ECO   runs along Y and crosses SOLAR's "O" at (1,0,0).
 *   LEAF  runs along Z and crosses SOLAR's "L" at (2,0,0).
 *   AIR   runs along Z and crosses SOLAR's "A" at (3,0,0).
 *
 * buildPuzzle() validates that the shared letters actually agree.
 */
export const samplePuzzle: Puzzle = {
  id: "demo-na",
  title: "Crossworld: พลังงานสะอาด (สาธิต)",
  words: [
    { id: "solar", answer: "SOLAR", start: [0, 0, 0], axis: "x", clue: "พลังงานสะอาดจากดวงอาทิตย์" },
    { id: "eco", answer: "ECO", start: [1, -2, 0], axis: "y", clue: "คำนำหน้าแปลว่าสิ่งแวดล้อม หรือบ้าน" },
    { id: "leaf", answer: "LEAF", start: [2, 0, 0], axis: "z", clue: "ส่วนสีเขียวของพืชที่ดูดซับ CO₂" },
    { id: "air", answer: "AIR", start: [3, 0, 0], axis: "z", clue: "สิ่งที่เราปนเปื้อนด้วยการปล่อยคาร์บอน" },
  ],
};
