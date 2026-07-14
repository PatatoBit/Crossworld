<script lang="ts">
  import type { CrosswordGame } from "$lib/crossword/game.svelte";
  import type { Axis } from "$lib/crossword/types";

  let { game }: { game: CrosswordGame } = $props();

  const sections: { axis: Axis; label: string }[] = [
    { axis: "x", label: "Across (X)" },
    { axis: "y", label: "Up (Y)" },
    { axis: "z", label: "Depth (Z)" },
  ];

  function wordsForAxis(axis: Axis) {
    return game.built.puzzle.words
      .filter((w) => w.axis === axis)
      .sort(
        (a, b) =>
          (game.built.wordNumbers.get(a.id) ?? 0) -
          (game.built.wordNumbers.get(b.id) ?? 0),
      );
  }

  function isActive(wordId: string): boolean {
    return wordId === (game.selectedWordId ?? game.hoveredWordId);
  }
</script>

<div class="hud">
  <h1>{game.built.puzzle.title}</h1>
  <hr class="divider" />

  {#each sections as { axis, label }}
    {@const words = wordsForAxis(axis)}
    {#if words.length > 0}
      <section>
        <h2>{label}</h2>
        <ul>
          {#each words as word (word.id)}
            {@const num = game.built.wordNumbers.get(word.id) ?? ""}
            <li>
              <button
                class:active={isActive(word.id)}
                onclick={() => game.selectWord(word.id)}
              >
                <span class="num">{num}</span>
                <span class="clue">{word.clue}</span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/each}

  <div class="footer">
    <button class="toggle" onclick={() => game.toggleAnswers()}>
      {game.showAnswers ? "Hide answers" : "Show answers"}
    </button>
  </div>
</div>

<style>
  .hud {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.75rem 1.5rem;
    color: var(--ink);
    height: 100%;
    box-sizing: border-box;
  }
  h1 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--forest);
    flex-shrink: 0;
  }
  .divider {
    border: none;
    border-top: 1px solid rgba(13, 42, 26, 0.1);
    margin: 0;
    flex-shrink: 0;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  h2 {
    margin: 0;
    align-self: flex-start;
    padding: 0.25rem 0.7rem;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  li {
    list-style: none;
    padding: 0;
  }
  li button {
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
    padding: 0.45rem 0.65rem;
    border-radius: 0.75rem;
    cursor: pointer;
    border: 1px solid transparent;
    background: transparent;
    width: 100%;
    text-align: left;
    color: inherit;
    font: inherit;
    transition: background 0.1s, border-color 0.1s;
  }
  li button:hover {
    background: rgba(13, 42, 26, 0.05);
  }
  li button.active {
    background: var(--green-soft);
    border-color: rgba(22, 163, 74, 0.35);
  }
  .num {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--muted);
    min-width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--radius-pill);
    background: var(--cream-soft);
  }
  li button.active .num {
    color: #fff;
    background: var(--green);
  }
  .clue {
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--muted);
  }
  li button.active .clue {
    color: var(--forest);
    font-weight: 500;
  }
  .footer {
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(13, 42, 26, 0.1);
    flex-shrink: 0;
  }
  .toggle {
    padding: 0.6rem 1.25rem;
    border: 2px solid var(--forest);
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--forest);
    font: inherit;
    font-weight: 700;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .toggle:hover {
    background: var(--forest);
    color: var(--cream);
  }
</style>
