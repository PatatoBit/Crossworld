<script lang="ts">
  import { Canvas } from "@threlte/core";
  import MenuGlobe from "../MenuGlobe.svelte";
</script>

<main class="poster" aria-label="Globe background for poster screenshot">
  <Canvas>
    <MenuGlobe spin={false} />
  </Canvas>
</main>

<style>
  .poster {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #15334f;
  }
  .poster :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
</style>
