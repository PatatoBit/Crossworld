import { levels } from "./levels";
import { navTutorial } from "./tutorial.svelte";

const STORAGE_KEY = "crossworld-progress";

export interface LevelProgress {
  completedAt: number;
  bestMs: number;
}

type ProgressMap = Record<string, LevelProgress>;

function load(): ProgressMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function save(data: ProgressMap): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota / private mode — progress stays in-memory for this session.
  }
}

/**
 * Campaign progress across levels. Persisted in localStorage so completed
 * levels stay marked on the selector after reload.
 */
class CampaignProgress {
  /** levelId → completion record */
  records = $state<ProgressMap>(load());

  isComplete(levelId: string): boolean {
    return levelId in this.records;
  }

  /**
   * A level is playable only after every preceding campaign level is cleared.
   * The first level (tutorial / demo) is always unlocked.
   */
  isUnlocked(levelId: string): boolean {
    const idx = levels.findIndex((l) => l.id === levelId);
    if (idx < 0) return false;
    for (let i = 0; i < idx; i++) {
      if (!this.isComplete(levels[i].id)) return false;
    }
    return true;
  }

  get completedCount(): number {
    return Object.keys(this.records).length;
  }

  get totalCount(): number {
    return levels.length;
  }

  get fraction(): number {
    if (this.totalCount === 0) return 0;
    return this.completedCount / this.totalCount;
  }

  /**
   * Record a level clear. Keeps the earliest `completedAt` and the best
   * (lowest) clear time across replays.
   */
  markComplete(levelId: string, elapsedMs: number): void {
    const existing = this.records[levelId];
    const next: LevelProgress = {
      completedAt: existing?.completedAt ?? Date.now(),
      bestMs: existing ? Math.min(existing.bestMs, elapsedMs) : elapsedMs,
    };
    this.records = { ...this.records, [levelId]: next };
    save(this.records);
  }

  /** Wipe all saved level clears (localStorage + in-memory). */
  reset(): void {
    this.records = {};
    navTutorial.reset();
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Private mode — in-memory wipe above is enough for this session.
    }
  }
}

export const progress = new CampaignProgress();
