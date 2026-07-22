<script lang="ts">
  import "../app.css";
  import { progress } from "$lib/progress.svelte";

  let { children } = $props();

  /** Consecutive Esc presses must land within this window to count as "in a row". */
  const ESC_WINDOW_MS = 1000;
  let escStamps: number[] = [];

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== "Escape" || e.repeat || progress.devMode) return;
    const now = Date.now();
    escStamps = escStamps.filter((t) => now - t < ESC_WINDOW_MS);
    escStamps.push(now);
    if (escStamps.length >= 3) {
      escStamps = [];
      progress.enableDevMode();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

{@render children()}
