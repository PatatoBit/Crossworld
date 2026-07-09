<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Scene from "./Scene.svelte";
  import Hud from "$lib/components/Hud.svelte";
  import { CrosswordGame } from "$lib/crossword/game.svelte";
  import { findLevel } from "$lib/levels";

  // Resolve the level from the route param and build its game. Rebuilds when
  // navigating between levels (the id is reactive via $derived).
  const level = $derived(findLevel($page.params.id ?? ""));
  const game = $derived(level?.puzzle ? new CrosswordGame(level.puzzle) : null);
</script>

{#if game}
  <div class="layout">
    <div class="canvas-wrap">
      <Canvas>
        <Scene {game} />
      </Canvas>
      <button class="back" onclick={() => goto(`${base}/levels`)}>← Levels</button>
    </div>
    <aside class="sidebar">
      <Hud {game} />
    </aside>
  </div>
{:else}
  <div class="missing">
    <h1>{level ? `${level.name} — coming soon` : "Level not found"}</h1>
    <p>{level ? "This continent's puzzle hasn't been authored yet." : "No level matches that address."}</p>
    <button onclick={() => goto(`${base}/levels`)}>← Back to levels</button>
  </div>
{/if}

<style>
  .layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 37% 50%, #0f172a, #020617);
  }
  .canvas-wrap {
    flex: 3;
    position: relative;
    height: 100%;
  }
  .sidebar {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    border-left: 1px solid rgba(51, 65, 85, 0.5);
    background: rgba(2, 6, 23, 0.85);
  }
  .back {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.9rem;
    font: 600 0.85rem var(--font-sans);
    color: #cbd5e1;
    background: rgba(2, 6, 23, 0.6);
    border: 1px solid rgba(71, 85, 105, 0.6);
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.15s, color 0.15s;
  }
  .back:hover {
    background: rgba(15, 23, 42, 0.9);
    color: #f8fafc;
  }
  .missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100vw;
    height: 100vh;
    color: #e2e8f0;
    text-align: center;
    background: radial-gradient(circle at 50% 40%, #0f172a, #020617);
  }
  .missing button {
    padding: 0.6rem 1.2rem;
    font: 600 0.9rem var(--font-sans);
    color: #0f172a;
    background: #34d399;
    border: none;
    border-radius: 999px;
    cursor: pointer;
  }
</style>
