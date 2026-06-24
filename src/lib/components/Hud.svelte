<script lang="ts">
  import type { CrosswordGame } from "$lib/crossword/game.svelte";

  let { game }: { game: CrosswordGame } = $props();

  const axisLabel = { x: "Across (X)", y: "Up (Y)", z: "Depth (Z)" } as const;
</script>

<div class="hud">
  <h1>{game.built.puzzle.title}</h1>

  {#if game.hoveredWord}
    <div class="hint">
      <span class="meta">
        {axisLabel[game.hoveredWord.axis]} · {game.hoveredWord.answer.length} letters
      </span>
      <p>{game.hoveredWord.clue}</p>
    </div>
  {:else}
    <p class="dim">Hover a line to read its clue · click a cell to select, then type. Drag to rotate · scroll to zoom.</p>
  {/if}

  <button class="toggle" onclick={() => game.toggleAnswers()}>
    {game.showAnswers ? "Hide answers" : "Show answers"}
  </button>
</div>

<style>
  .hud {
    position: absolute;
    top: 1rem;
    left: 1rem;
    max-width: 22rem;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    background: rgba(15, 23, 42, 0.72);
    backdrop-filter: blur(8px);
    color: #e2e8f0;
    font-family: system-ui, sans-serif;
    pointer-events: none;
  }
  h1 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #34d399;
  }
  .meta {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
  }
  .hint p {
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .dim {
    margin: 0;
    font-size: 0.85rem;
    color: #94a3b8;
  }
  .toggle {
    margin-top: 0.85rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    background: rgba(51, 65, 85, 0.6);
    color: #e2e8f0;
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    pointer-events: auto;
  }
  .toggle:hover {
    background: rgba(71, 85, 105, 0.8);
    border-color: #475569;
  }
</style>
