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
  title: "Crossworld — Clean Energy (demo)",
  words: [
    { id: "solar", answer: "SOLAR", start: [0, 0, 0], axis: "x", clue: "Clean power harvested from the sun." },
    { id: "eco", answer: "ECO", start: [1, -2, 0], axis: "y", clue: "Prefix meaning 'environment' or 'home'." },
    { id: "leaf", answer: "LEAF", start: [2, 0, 0], axis: "z", clue: "Green plant part that captures CO₂." },
    { id: "air", answer: "AIR", start: [3, 0, 0], axis: "z", clue: "We pollute it with carbon emissions." },
  ],
};
