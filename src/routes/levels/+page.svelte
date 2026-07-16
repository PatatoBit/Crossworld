<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { levels } from "$lib/levels";
</script>

<main class="select">
  <header>
    <button class="back" onclick={() => goto(`${base}/`)}>← เมนู</button>
    <div class="heading">
      <h1>เลือกทวีป</h1>
    </div>
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
          <span class="index">{String(i + 1).padStart(2, "0")}</span>
          <span class="name">{level.name}</span>
          <span class="blurb">{level.blurb}</span>
          <span class="status">{locked ? "อยู่ในการพัฒนา" : "เล่น ▸"}</span>
        </button>
      </li>
    {/each}
  </ul>
</main>

<style>
  .select {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 3rem clamp(1.5rem, 6vw, 5rem);
    background: radial-gradient(
        circle at 90% 0%,
        rgba(246, 201, 21, 0.12),
        transparent 40%
      ),
      radial-gradient(
        circle at 0% 100%,
        rgba(34, 197, 94, 0.12),
        transparent 45%
      ),
      var(--cream);
    color: var(--ink);
  }
  header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .heading {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .eyebrow {
    align-self: flex-start;
    padding: 0.3rem 0.85rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
  }
  h1 {
    margin: 0;
    font-size: clamp(1.75rem, 4vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--forest);
  }
  .back {
    flex-shrink: 0;
    padding: 0.6rem 1.1rem;
    font: 600 0.85rem var(--font-sans);
    color: var(--forest);
    background: transparent;
    border: 2px solid var(--forest);
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .back:hover {
    color: var(--cream);
    background: var(--forest);
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    padding: 1.5rem;
    text-align: left;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid rgba(13, 42, 26, 0.08);
    border-radius: var(--radius-card);
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      border-color 0.15s;
  }
  .card:hover {
    transform: translateY(-4px);
    border-color: var(--green);
    box-shadow: var(--shadow-lift);
  }
  .card.locked {
    background: transparent;
    box-shadow: none;
    border-style: dashed;
    opacity: 0.7;
  }
  .card.locked:hover {
    border-color: rgba(13, 42, 26, 0.2);
    transform: none;
    box-shadow: none;
  }
  .index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    padding: 0.2rem 0.55rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--forest);
    background: var(--yellow);
    border-radius: var(--radius-pill);
  }
  .card.locked .index {
    color: var(--muted);
    background: var(--cream-soft);
  }
  .name {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--forest);
  }
  .blurb {
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--muted);
  }
  .status {
    margin-top: 0.6rem;
    padding: 0.35rem 0.9rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
    background: var(--green);
    border-radius: var(--radius-pill);
  }
  .card.locked .status {
    color: var(--muted);
    background: var(--cream-soft);
  }
</style>
