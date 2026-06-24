import type { Axis, Cell, Puzzle } from "./types";

const AXIS_VEC: Record<Axis, [number, number, number]> = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
};

export function cellKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

export interface BuiltPuzzle {
  puzzle: Puzzle;
  /** Every distinct cell, keyed by "x,y,z". */
  cells: Map<string, Cell>;
  /** wordId -> ordered list of cell keys (start → end). */
  wordCells: Map<string, string[]>;
}

/**
 * Expand the authored word list into a concrete cell grid.
 *
 * This is the heart of the storage model: cells are *computed*, never
 * authored. Where two words cross, the same cell is shared — and if their
 * letters disagree we throw, so a malformed puzzle fails loudly at load
 * time instead of rendering garbage.
 */
export function buildPuzzle(puzzle: Puzzle): BuiltPuzzle {
  const cells = new Map<string, Cell>();
  const wordCells = new Map<string, string[]>();

  for (const word of puzzle.words) {
    const [dx, dy, dz] = AXIS_VEC[word.axis];
    const [sx, sy, sz] = word.start;
    const letters = word.answer.toUpperCase();
    const keys: string[] = [];

    for (let i = 0; i < letters.length; i++) {
      const x = sx + dx * i;
      const y = sy + dy * i;
      const z = sz + dz * i;
      const key = cellKey(x, y, z);
      const letter = letters[i];

      const existing = cells.get(key);
      if (existing) {
        if (existing.solution !== letter) {
          throw new Error(
            `Crossword conflict at (${key}): word "${word.id}" wants "${letter}" ` +
              `but another word already placed "${existing.solution}".`,
          );
        }
        existing.wordIds.push(word.id);
      } else {
        cells.set(key, {
          key,
          position: [x, y, z],
          solution: letter,
          wordIds: [word.id],
        });
      }
      keys.push(key);
    }

    wordCells.set(word.id, keys);
  }

  return { puzzle, cells, wordCells };
}

/** Geometric center of the grid, so the scene can be re-centered on origin. */
export function puzzleCenter(cells: Iterable<Cell>): [number, number, number] {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const c of cells) {
    const [x, y, z] = c.position;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
}
