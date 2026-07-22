const STORAGE_KEY = "crossworld-tutorial";

export type NavTutorialStep =
  | "intro"
  | "rotate"
  | "zoom"
  | "select"
  | "type"
  | "intersect"
  | "done";

interface TutorialPrefs {
  /** Navigation walkthrough finished (or skipped) on Level 0. */
  navComplete: boolean;
}

function load(): TutorialPrefs {
  if (typeof localStorage === "undefined") return { navComplete: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { navComplete: false };
    const parsed = JSON.parse(raw) as Partial<TutorialPrefs>;
    return { navComplete: Boolean(parsed.navComplete) };
  } catch {
    return { navComplete: false };
  }
}

function save(prefs: TutorialPrefs): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Quota / private mode — stay in-memory for this session.
  }
}

/**
 * Level-0 navigation coach. Persists completion so returning players skip it;
 * cleared when campaign progress is reset.
 */
class NavTutorial {
  navComplete = $state(load().navComplete);
  /** Active step while the overlay is open; null when dismissed. */
  step = $state<NavTutorialStep | null>(null);

  /** Open the walkthrough from the intro card (demo level only). */
  start(): void {
    if (this.navComplete) return;
    this.step = "intro";
  }

  /** Hide the overlay without marking complete (e.g. leave the demo level). */
  close(): void {
    this.step = null;
  }

  /** Advance after the player performs the taught gesture (or taps เริ่ม/เสร็จ). */
  advance(): void {
    const order: NavTutorialStep[] = [
      "intro",
      "rotate",
      "zoom",
      "select",
      "type",
      "intersect",
      "done",
    ];
    if (this.step === null) return;
    const i = order.indexOf(this.step);
    if (i < 0 || i >= order.length - 1) {
      this.finish();
      return;
    }
    this.step = order[i + 1];
  }

  finish(): void {
    this.step = null;
    this.navComplete = true;
    save({ navComplete: true });
  }

  skip(): void {
    this.finish();
  }

  /** Called from progress.reset so the coach can reappear. */
  reset(): void {
    this.navComplete = false;
    this.step = null;
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Private mode — in-memory wipe above is enough.
    }
  }
}

export const navTutorial = new NavTutorial();
