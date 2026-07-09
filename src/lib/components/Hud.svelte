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
    gap: 1.25rem;
    padding: 1.5rem 1.25rem;
    color: #e2e8f0;
    height: 100%;
    box-sizing: border-box;
  }
  h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }
  .divider {
    border: none;
    border-top: 1px solid rgba(51, 65, 85, 0.6);
    margin: 0;
    flex-shrink: 0;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  h2 {
    margin: 0;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  li {
    list-style: none;
    padding: 0;
  }
  li button {
    display: flex;
    align-items: baseline;
    gap: 0.45rem;
    padding: 0.3rem 0.5rem;
    border-radius: 0.4rem;
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
    background: rgba(51, 65, 85, 0.4);
  }
  li button.active {
    background: rgba(52, 211, 153, 0.1);
    border-color: rgba(52, 211, 153, 0.35);
  }
  .num {
    flex-shrink: 0;
    font-size: 0.7rem;
    font-weight: 700;
    color: #94a3b8;
    min-width: 1.4rem;
    text-align: right;
  }
  li button.active .num {
    color: #34d399;
  }
  .clue {
    font-size: 0.82rem;
    line-height: 1.45;
    color: #cbd5e1;
  }
  li button.active .clue {
    color: #f1f5f9;
  }
  .footer {
    margin-top: auto;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(51, 65, 85, 0.4);
    flex-shrink: 0;
  }
  .toggle {
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
