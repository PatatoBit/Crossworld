<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import Hud from "$lib/components/Hud.svelte";
  import { CrosswordGame } from "$lib/crossword/game.svelte";
  import { samplePuzzle } from "$lib/crossword/sample";

  // Built once; the scene renders it, the HUD reflects hover state.
  const game = new CrosswordGame(samplePuzzle);
</script>

<div class="layout">
  <div class="canvas-wrap">
    <Canvas>
      <Scene {game} />
    </Canvas>
  </div>
  <aside class="sidebar">
    <Hud {game} />
  </aside>
</div>

<style>
  :global(body) {
    margin: 0;
  }
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
</style>
