<script lang="ts">
  import { onMount } from "svelte";
  import { LEVEL_ANCHORS, type ScreenAnchor } from "$lib/globe/levelContinents";
  import { sceneColors } from "$lib/theme";

  let {
    container,
    panelEl,
    itemRefs,
    globeAnchors,
    activeId = null,
    hoveredId = null,
  }: {
    container: HTMLElement | undefined;
    panelEl: HTMLElement | undefined;
    itemRefs: Record<string, HTMLElement | undefined>;
    globeAnchors: Record<string, ScreenAnchor>;
    activeId?: string | null;
    hoveredId?: string | null;
  } = $props();

  let panelAnchors = $state<Record<string, ScreenAnchor>>({});

  function updatePanelAnchors() {
    if (!container || !panelEl) return;
    const box = container.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    // Bottom-docked panel: anchors sit on the panel's top edge under each row.
    const isBelow = panelRect.top - box.top > box.height * 0.4;
    const next: Record<string, ScreenAnchor> = {};

    for (const levelId of Object.keys(LEVEL_ANCHORS)) {
      const el = itemRefs[levelId];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      next[levelId] = isBelow
        ? {
            x: rect.left - box.left + rect.width / 2,
            y: panelRect.top - box.top,
            visible: true,
          }
        : {
            x: panelRect.left - box.left,
            y: rect.top - box.top + rect.height / 2,
            visible: true,
          };
    }

    panelAnchors = next;
  }

  onMount(() => {
    let frame = 0;
    const tick = () => {
      updatePanelAnchors();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const ro = new ResizeObserver(updatePanelAnchors);
    if (container) ro.observe(container);
    if (panelEl) ro.observe(panelEl);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  });

  function connectorPath(panel: ScreenAnchor, globe: ScreenAnchor): string {
    if (panel.y > globe.y) {
      const midY = (panel.y + globe.y) * 0.5;
      return `M ${panel.x} ${panel.y} Q ${panel.x} ${midY} ${globe.x} ${globe.y}`;
    }
    const midX = (panel.x + globe.x) * 0.5;
    return `M ${panel.x} ${panel.y} Q ${midX} ${panel.y} ${globe.x} ${globe.y}`;
  }

  function isEmphasized(levelId: string): boolean {
    return levelId === activeId || levelId === hoveredId;
  }
</script>

<svg class="connectors" aria-hidden="true">
  {#each Object.keys(LEVEL_ANCHORS) as levelId (levelId)}
    {@const panel = panelAnchors[levelId]}
    {@const globe = globeAnchors[levelId]}
    {#if panel?.visible && globe?.visible}
      <path
        d={connectorPath(panel, globe)}
        class:emphasized={isEmphasized(levelId)}
        fill="none"
        stroke={isEmphasized(levelId)
          ? sceneColors.globe.connectorActive
          : sceneColors.globe.connector}
        stroke-width={isEmphasized(levelId) ? 1.75 : 1}
        stroke-dasharray={isEmphasized(levelId) ? "none" : "4 5"}
      />
      <circle
        cx={globe.x}
        cy={globe.y}
        r={isEmphasized(levelId) ? 4.5 : 3}
        fill={isEmphasized(levelId)
          ? sceneColors.globe.landActive
          : sceneColors.globe.land}
        stroke={sceneColors.globe.label}
        stroke-width="1"
        opacity={isEmphasized(levelId) ? 1 : 0.75}
      />
    {/if}
  {/each}
</svg>

<style>
  .connectors {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  path {
    transition:
      stroke 0.15s ease,
      stroke-width 0.15s ease;
  }
  path.emphasized {
    filter: drop-shadow(0 0 6px rgba(110, 196, 184, 0.45));
  }
</style>
