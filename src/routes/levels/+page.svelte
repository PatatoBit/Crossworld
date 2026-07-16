<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import GlobeScene from "./GlobeScene.svelte";
  import LevelPanel from "./LevelPanel.svelte";
  import LevelConnectors from "./LevelConnectors.svelte";
  import { findLevel } from "$lib/levels";
  import type { ScreenAnchor } from "$lib/globe/levelContinents";

  let activeId = $state<string | null>(null);
  let hoveredId = $state<string | null>(null);
  let globeAnchors = $state<Record<string, ScreenAnchor>>({});
  let itemRefs = $state<Record<string, HTMLElement | undefined>>({});
  let panelEl = $state<HTMLElement | undefined>();
  let canvasWrapEl = $state<HTMLElement | undefined>();
  let sceneRoot = $state<HTMLElement | undefined>();

  function updateGlobeAnchors(anchors: Record<string, ScreenAnchor>) {
    if (!sceneRoot || !canvasWrapEl) {
      globeAnchors = anchors;
      return;
    }
    const rootBox = sceneRoot.getBoundingClientRect();
    const canvasBox = canvasWrapEl.getBoundingClientRect();
    const dx = canvasBox.left - rootBox.left;
    const dy = canvasBox.top - rootBox.top;
    globeAnchors = Object.fromEntries(
      Object.entries(anchors).map(([id, anchor]) => [
        id,
        { ...anchor, x: anchor.x + dx, y: anchor.y + dy },
      ]),
    );
  }

  function handleSelect(id: string) {
    activeId = id;
  }

  function handleHover(id: string | null) {
    hoveredId = id;
  }

  function handleGlobeSelect(id: string) {
    activeId = id;
    const level = findLevel(id);
    if (level?.puzzle) goto(`${base}/play/${id}`);
  }
</script>

<main class="select" bind:this={sceneRoot}>
  <div class="canvas-wrap" bind:this={canvasWrapEl}>
    <Canvas>
      <GlobeScene
        {activeId}
        hoveredId={hoveredId}
        onHover={handleHover}
        onSelect={handleGlobeSelect}
        onAnchorUpdate={updateGlobeAnchors}
      />
    </Canvas>

    <button class="back" onclick={() => goto(`${base}/`)}>← เมนู</button>
  </div>

  <LevelConnectors
    container={sceneRoot}
    {panelEl}
    {itemRefs}
    {globeAnchors}
    activeId={activeId}
    hoveredId={hoveredId}
  />

  <LevelPanel
    {activeId}
    hoveredId={hoveredId}
    onHover={handleHover}
    onSelect={handleSelect}
    bind:itemRefs
    bind:panelEl
  />
</main>

<style>
  .select {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #15334f;
    /* panel width + horizontal margins */
    --panel-slot: calc(min(340px, calc(100vw - 2.5rem)) + 2.5rem);
    --panel-slot-bottom: 0px;
  }
  .canvas-wrap {
    position: absolute;
    inset: 0;
    right: var(--panel-slot);
    bottom: var(--panel-slot-bottom);
  }
  .canvas-wrap :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  .back {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 2;
    padding: 0.55rem 1.05rem;
    font: 600 0.85rem var(--font-sans);
    color: #e8e4d9;
    background: rgba(12, 20, 36, 0.55);
    border: 1.5px solid rgba(232, 228, 217, 0.35);
    border-radius: var(--radius-pill);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .back:hover {
    background: rgba(232, 228, 217, 0.12);
    border-color: #e8e4d9;
  }

  @media (max-width: 768px) {
    .select {
      --panel-slot: 0px;
      /* panel height + vertical margins (matches LevelPanel mobile) */
      --panel-slot-bottom: calc(min(42vh, 280px) + 2.5rem);
    }
  }
</style>
