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
    background: var(--cream);
  }
  .canvas-wrap {
    flex: 3;
    position: relative;
    height: 100%;
    background:
      radial-gradient(circle at 40% 35%, var(--forest-soft), var(--forest) 70%);
  }
  .sidebar {
    flex: 1;
    min-width: 300px;
    height: 100%;
    overflow-y: auto;
    border-left: 1px solid rgba(13, 42, 26, 0.08);
    background: var(--cream);
  }
  .back {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    padding: 0.55rem 1.1rem;
    font: 700 0.85rem var(--font-sans);
    color: var(--forest);
    background: var(--cream);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition: transform 0.15s, background 0.15s, color 0.15s;
  }
  .back:hover {
    transform: translateY(-1px);
    background: var(--green);
    color: #fff;
  }
  .missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100vw;
    height: 100vh;
    color: var(--ink);
    text-align: center;
    background:
      radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.12), transparent 45%),
      var(--cream);
  }
  .missing h1 {
    color: var(--forest);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .missing p {
    color: var(--muted);
    margin: 0;
  }
  .missing button {
    margin-top: 0.5rem;
    padding: 0.7rem 1.5rem;
    font: 700 0.9rem var(--font-sans);
    color: #fff;
    background: var(--green);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition: background 0.15s;
  }
  .missing button:hover {
    background: var(--green-strong);
  }
</style>
