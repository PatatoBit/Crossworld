<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
</script>

<main class="menu">
  <div class="title">
    <h1>Crossworld</h1>
    <p class="tagline">A rotatable 3D crossword across seven continents.</p>
  </div>

  <nav class="actions">
    <button class="play" onclick={() => goto(`${base}/levels`)}>Play</button>
  </nav>
</main>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 50% 35%, #0f172a, #020617);
    color: #e2e8f0;
  }
  .title {
    text-align: center;
  }
  h1 {
    margin: 0;
    font-size: clamp(3rem, 9vw, 6rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(120deg, #34d399, #38bdf8, #a78bfa);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .tagline {
    margin: 0.75rem 0 0;
    color: #94a3b8;
    font-size: 1.05rem;
  }
  .play {
    padding: 0.95rem 3.5rem;
    font: 700 1.15rem var(--font-sans);
    color: #022c22;
    background: linear-gradient(120deg, #34d399, #10b981);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 10px 30px -8px rgba(16, 185, 129, 0.6);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .play:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px -8px rgba(16, 185, 129, 0.7);
  }
  .play:active {
    transform: translateY(0);
  }
</style>
