// The three crossword directions. A word runs along exactly one axis.
export type Axis = "x" | "y" | "z";

/**
 * The *authored* unit of a puzzle. This is what you (or the AI generator)
 * write by hand / store in a file. Everything else is derived from these.
 */
export interface WordSpec {
  id: string;
  /** Uppercase, no spaces, e.g. "SOLAR". */
  answer: string;
  /** Grid coordinate of the FIRST letter. */
  start: [number, number, number];
  /** Direction the remaining letters extend toward. */
  axis: Axis;
  /** The clue shown on hover. */
  clue: string;
}

/**
 * A *derived* grid cell. Built by intersecting all the words. A cell may
 * belong to several words at once — that is a crossword intersection.
 */
export interface Cell {
  /** "x,y,z" — stable map key. */
  key: string;
  position: [number, number, number];
  /** The correct letter for this cell. */
  solution: string;
  /** IDs of every word that passes through this cell. */
  wordIds: string[];
}

/** What you load / save / hand to the AI generator. */
export interface Puzzle {
  id: string;
  title: string;
  words: WordSpec[];
}
