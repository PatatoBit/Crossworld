<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import GlobeScene from "./GlobeScene.svelte";
</script>

<main class="select">
  <div class="canvas-wrap">
    <Canvas>
      <GlobeScene />
    </Canvas>
  </div>

  <header>
    <button class="back" onclick={() => goto(`${base}/`)}>← เมนู</button>
    <h1>เลือกทวีป</h1>
  </header>
</main>

<style>
  .select {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: radial-gradient(
        circle at 70% 20%,
        rgba(126, 184, 201, 0.25),
        transparent 45%
      ),
      radial-gradient(
        circle at 15% 85%,
        rgba(34, 197, 94, 0.18),
        transparent 50%
      ),
      #0c2a28;
    color: var(--cream);
  }
  .canvas-wrap {
    position: absolute;
    inset: 0;
  }
  .canvas-wrap :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.75rem clamp(1.25rem, 4vw, 2.5rem);
    pointer-events: none;
  }
  header > * {
    pointer-events: auto;
  }
  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 3.5vw, 2.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--cream);
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
  }
  .back {
    flex-shrink: 0;
    padding: 0.55rem 1.05rem;
    font: 600 0.85rem var(--font-sans);
    color: var(--cream);
    background: rgba(12, 42, 40, 0.45);
    border: 1.5px solid rgba(244, 242, 230, 0.45);
    border-radius: var(--radius-pill);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .back:hover {
    background: rgba(244, 242, 230, 0.15);
    border-color: var(--cream);
  }
</style>
