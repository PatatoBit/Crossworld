<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { levels } from "$lib/levels";
</script>

<main class="select">
  <header>
    <button class="back" onclick={() => goto(`${base}/`)}>← Menu</button>
    <h1>Choose a continent</h1>
  </header>

  <ul class="grid">
    {#each levels as level, i (level.id)}
      {@const locked = level.puzzle === null}
      <li>
        <button
          class="card"
          class:locked
          onclick={() => goto(`${base}/play/${level.id}`)}
        >
          <span class="index">{i + 1}</span>
          <span class="name">{level.name}</span>
          <span class="blurb">{level.blurb}</span>
          <span class="status">{locked ? "Coming soon" : "Play ▸"}</span>
        </button>
      </li>
    {/each}
  </ul>
</main>

<style>
  :global(body) {
    margin: 0;
  }
  .select {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 2.5rem clamp(1.5rem, 6vw, 5rem);
    background: radial-gradient(circle at 50% 0%, #0f172a, #020617);
    color: #e2e8f0;
    font-family: system-ui, sans-serif;
  }
  header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }
  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .back {
    padding: 0.5rem 0.9rem;
    font: 600 0.85rem system-ui, sans-serif;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(71, 85, 105, 0.6);
    border-radius: 8px;
    cursor: pointer;
  }
  .back:hover {
    color: #f8fafc;
    background: rgba(30, 41, 59, 0.9);
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.1rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    width: 100%;
    padding: 1.25rem;
    text-align: left;
    color: inherit;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(51, 65, 85, 0.7);
    border-radius: 14px;
    cursor: pointer;
    transition: transform 0.15s, border-color 0.15s, background 0.15s;
  }
  .card:hover {
    transform: translateY(-3px);
    border-color: #34d399;
    background: rgba(15, 23, 42, 0.95);
  }
  .card.locked {
    opacity: 0.6;
  }
  .card.locked:hover {
    border-color: rgba(71, 85, 105, 0.7);
    transform: none;
  }
  .index {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
  }
  .name {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .blurb {
    font-size: 0.85rem;
    color: #94a3b8;
  }
  .status {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #34d399;
  }
  .card.locked .status {
    color: #64748b;
  }
</style>
