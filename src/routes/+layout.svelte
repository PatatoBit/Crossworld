<script lang="ts">
  import "../app.css";
  import { progress } from "$lib/progress.svelte";

  let { children } = $props();

  /** Consecutive presses must land within this window to count as "in a row". */
  const CHORD_WINDOW_MS = 1000;
  let escStamps: number[] = [];
  let tickStamps: number[] = [];

  function onKeydown(e: KeyboardEvent) {
    if (e.repeat) return;
    const now = Date.now();

    // Esc × 3 — unlock all levels for this session (dev cheat).
    if (e.key === "Escape" && !progress.devMode) {
      escStamps = escStamps.filter((t) => now - t < CHORD_WINDOW_MS);
      escStamps.push(now);
      if (escStamps.length >= 3) {
        escStamps = [];
        progress.enableDevMode();
      }
      return;
    }

    // ` × 2 — wipe saved progress + tutorial memory.
    if (e.key === "`") {
      e.preventDefault();
      tickStamps = tickStamps.filter((t) => now - t < CHORD_WINDOW_MS);
      tickStamps.push(now);
      if (tickStamps.length >= 2) {
        tickStamps = [];
        progress.reset();
      }
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

{@render children()}
