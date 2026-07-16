import { buildPuzzle, type BuiltPuzzle } from "./puzzle";
import type { Puzzle, WordSpec } from "./types";

/**
 * Reactive game state for one puzzle. Uses Svelte 5 runes, so it must live
 * in a `.svelte.ts` module. The scene reads `highlightedCells`; the HUD reads
 * `hoveredWord`. Both update automatically when `hoverCell` fires.
 */
export class CrosswordGame {
  readonly built: BuiltPuzzle;

  /** cellKey -> letter the player has typed. */
  entries = $state(new Map<string, string>());

  /** The word the cursor is hovering, or null. Drives the transient highlight. */
  hoveredWordId = $state<string | null>(null);

  /** The word the player has clicked into — the persistent selection. */
  selectedWordId = $state<string | null>(null);

  /** The active cell within the selected word: where typed letters land. */
  selectedCellKey = $state<string | null>(null);

  /** When true, every cell shows its solution letter (debug / reveal). */
  showAnswers = $state(false);

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

  /** The clue to show: the selected word's if one is selected, else the hovered word's. */
  get hoveredWord(): WordSpec | null {
    const id = this.selectedWordId ?? this.hoveredWordId;
    if (!id) return null;
    return this.built.puzzle.words.find((w) => w.id === id) ?? null;
  }

  /** True when every cell in the word has a player entry (correct or not). */
  isWordFilled(wordId: string): boolean {
    const keys = this.built.wordCells.get(wordId) ?? [];
    return keys.length > 0 && keys.every((key) => this.entries.has(key));
  }

  /** True when every cell in the word is filled with the correct letter. */
  isWordComplete(wordId: string): boolean {
    const keys = this.built.wordCells.get(wordId) ?? [];
    return keys.every((key) => {
      const entry = this.entries.get(key);
      return entry !== undefined && entry === this.built.cells.get(key)?.solution;
    });
  }

  /** True when the word is fully filled but at least one letter is wrong. */
  isWordIncorrect(wordId: string): boolean {
    return this.isWordFilled(wordId) && !this.isWordComplete(wordId);
  }

  /** Word ids whose answers are fully and correctly filled. */
  get completedWordIds(): Set<string> {
    return new Set(
      this.built.puzzle.words.filter((w) => this.isWordComplete(w.id)).map((w) => w.id),
    );
  }

  /** Word ids that are fully filled but incorrect. */
  get incorrectWordIds(): Set<string> {
    return new Set(
      this.built.puzzle.words.filter((w) => this.isWordIncorrect(w.id)).map((w) => w.id),
    );
  }

  /** Cell keys that belong to at least one completed word. */
  get completedCells(): Set<string> {
    const cells = new Set<string>();
    for (const wordId of this.completedWordIds) {
      for (const key of this.built.wordCells.get(wordId) ?? []) cells.add(key);
    }
    return cells;
  }

  /** Cell keys that belong to at least one fully-filled-but-incorrect word
   *  and no completed word (completed green wins at intersections). */
  get incorrectCells(): Set<string> {
    const done = this.completedCells;
    const cells = new Set<string>();
    for (const wordId of this.incorrectWordIds) {
      for (const key of this.built.wordCells.get(wordId) ?? []) {
        if (!done.has(key)) cells.add(key);
      }
    }
    return cells;
  }

  /** Whether the currently highlighted word is filled but incorrect. */
  get highlightedWordIncorrect(): boolean {
    const id = this.selectedWordId ?? this.hoveredWordId;
    return id !== null && this.isWordIncorrect(id);
  }

  /** Whether the currently highlighted word is fully and correctly filled. */
  get highlightedWordComplete(): boolean {
    const id = this.selectedWordId ?? this.hoveredWordId;
    return id !== null && this.isWordComplete(id);
  }

  /** True when every word in the puzzle is correctly filled. */
  get isComplete(): boolean {
    return this.built.puzzle.words.every((w) => this.isWordComplete(w.id));
  }

  /** Cell keys to highlight as a line: the selected word's, else the hovered word's. */
  get highlightedCells(): Set<string> {
    const id = this.selectedWordId ?? this.hoveredWordId;
    if (!id) return new Set();
    return new Set(this.built.wordCells.get(id) ?? []);
  }

  /** cellKey -> 1-based position in the highlighted word, so the scene can label
   *  each letter's order (1, 2, 3…) and you can see where the word starts. */
  get highlightedOrder(): Map<string, number> {
    const order = new Map<string, number>();
    const id = this.selectedWordId ?? this.hoveredWordId;
    if (!id) return order;
    (this.built.wordCells.get(id) ?? []).forEach((key, i) => order.set(key, i + 1));
    return order;
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

  /** Click a cell: select it and its first word. Clicking the same active cell
   *  again cycles to the next word through it (X→Y→Z) for intersections. */
  selectCell(key: string): void {
    const cell = this.built.cells.get(key);
    if (!cell) return;
    if (key === this.selectedCellKey && cell.wordIds.length > 1) {
      const i = cell.wordIds.indexOf(this.selectedWordId ?? cell.wordIds[0]);
      this.selectedWordId = cell.wordIds[(i + 1) % cell.wordIds.length];
    } else {
      this.selectedCellKey = key;
      this.selectedWordId = cell.wordIds[0];
    }
  }

  /** Select a word directly (e.g. from the clue list), placing the cursor at its first cell. */
  selectWord(wordId: string): void {
    const keys = this.built.wordCells.get(wordId);
    if (!keys || keys.length === 0) return;
    this.selectedWordId = wordId;
    this.selectedCellKey = keys[0];
  }

  clearSelection(): void {
    this.selectedWordId = null;
    this.selectedCellKey = null;
  }

  /** Ordered cell keys of the selected word, and the active cell's index in it. */
  private activeLine(): { keys: string[]; index: number } | null {
    if (!this.selectedWordId || !this.selectedCellKey) return null;
    const keys = this.built.wordCells.get(this.selectedWordId);
    if (!keys) return null;
    return { keys, index: keys.indexOf(this.selectedCellKey) };
  }

  /** Type a letter into the active cell, then advance the cursor along the word. */
  typeLetter(ch: string): void {
    const line = this.activeLine();
    if (!line || !this.selectedCellKey) return;
    this.entries = new Map(this.entries).set(this.selectedCellKey, ch.toUpperCase());
    const next = Math.min(line.index + 1, line.keys.length - 1);
    this.selectedCellKey = line.keys[next];
  }

  /** Clear the active cell, or — if already empty — step back and clear that one. */
  backspace(): void {
    const line = this.activeLine();
    if (!line || !this.selectedCellKey) return;
    const next = new Map(this.entries);
    if (next.has(this.selectedCellKey)) {
      next.delete(this.selectedCellKey);
    } else {
      const prev = Math.max(line.index - 1, 0);
      this.selectedCellKey = line.keys[prev];
      next.delete(this.selectedCellKey);
    }
    this.entries = next;
  }

  /** Move the active cell along the selected word (arrow keys). */
  moveActive(delta: -1 | 1): void {
    const line = this.activeLine();
    if (!line) return;
    const i = Math.min(Math.max(line.index + delta, 0), line.keys.length - 1);
    this.selectedCellKey = line.keys[i];
  }
}
