import { buildPuzzle, type BuiltPuzzle } from "./puzzle";
import type { Puzzle, WordSpec } from "./types";

/**
 * Reactive game state for one puzzle. Uses Svelte 5 runes, so it must live
 * in a `.svelte.ts` module. The scene reads `highlightedCells`; the HUD reads
 * `hoveredWord`. Both update automatically when `hoverCell` fires.
 */
export class CrosswordGame {
  readonly built: BuiltPuzzle;

  /** cellKey -> letter the player has typed. (Unused in this MVP, ready for input.) */
  entries = $state(new Map<string, string>());

  /** The word whose line is currently highlighted, or null. */
  hoveredWordId = $state<string | null>(null);

  /** When true, every cell shows its solution letter (debug / reveal). */
  showAnswers = $state(true);

  toggleAnswers(): void {
    this.showAnswers = !this.showAnswers;
  }

  /** The letter to render in a cell: the player's entry, or the solution if
   *  answers are revealed, otherwise blank. */
  displayLetter(key: string): string {
    return this.entries.get(key) ?? (this.showAnswers ? this.built.cells.get(key)?.solution ?? "" : "");
  }

  constructor(puzzle: Puzzle) {
    this.built = buildPuzzle(puzzle);
  }

  get hoveredWord(): WordSpec | null {
    if (!this.hoveredWordId) return null;
    return this.built.puzzle.words.find((w) => w.id === this.hoveredWordId) ?? null;
  }

  /** Cell keys belonging to the hovered word (for highlighting the whole line). */
  get highlightedCells(): Set<string> {
    if (!this.hoveredWordId) return new Set();
    return new Set(this.built.wordCells.get(this.hoveredWordId) ?? []);
  }

  /** Called from a cell's pointer events. A cell may sit on several words; we
   *  pick the first. (Later: cycle on repeated hover, or pick by camera angle.) */
  hoverCell(key: string | null): void {
    if (key === null) {
      this.hoveredWordId = null;
      return;
    }
    const cell = this.built.cells.get(key);
    this.hoveredWordId = cell ? cell.wordIds[0] : null;
  }
}
