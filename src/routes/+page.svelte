<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import Hud from "$lib/components/Hud.svelte";
  import { CrosswordGame } from "$lib/crossword/game.svelte";
  import { samplePuzzle } from "$lib/crossword/sample";

  // Built once; the scene renders it, the HUD reflects hover state.
  const game = new CrosswordGame(samplePuzzle);
</script>

<div class="stage">
  <Canvas>
    <Scene {game} />
  </Canvas>
  <Hud {game} />
</div>

<style>
  :global(body) {
    margin: 0;
  }
  .stage {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 50% 30%, #0f172a, #020617);
  }
</style>
