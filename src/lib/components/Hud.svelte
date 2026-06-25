<script lang="ts">
  import type { CrosswordGame } from "$lib/crossword/game.svelte";

  let { game }: { game: CrosswordGame } = $props();

  const axisLabel = { x: "Across (X)", y: "Up (Y)", z: "Depth (Z)" } as const;
</script>

<div class="hud">
  <h1>{game.built.puzzle.title}</h1>
  <hr class="divider" />

  {#if game.hoveredWord}
    <div class="hint">
      <span class="meta">
        {axisLabel[game.hoveredWord.axis]} · {game.hoveredWord.answer.length} letters
      </span>
      <p>{game.hoveredWord.clue}</p>
    </div>
  {:else}
    <p class="dim">Hover a word to read its clue.<br />Click a cell to select, then type.<br />Drag to rotate · scroll to zoom.</p>
  {/if}

  <button class="toggle" onclick={() => game.toggleAnswers()}>
    {game.showAnswers ? "Hide answers" : "Show answers"}
  </button>
</div>

<style>
  .hud {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem 1.25rem;
    color: #e2e8f0;
    font-family: system-ui, sans-serif;
    height: 100%;
    box-sizing: border-box;
  }
  h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.02em;
  }
  .divider {
    border: none;
    border-top: 1px solid rgba(51, 65, 85, 0.6);
    margin: 0;
  }
  .meta {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin-bottom: 0.4rem;
    display: block;
  }
  .hint p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .dim {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.5;
  }
  .toggle {
    align-self: flex-start;
    padding: 0.45rem 0.9rem;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    background: rgba(51, 65, 85, 0.5);
    color: #e2e8f0;
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
  }
  .toggle:hover {
    background: rgba(71, 85, 105, 0.8);
    border-color: #475569;
  }
</style>
