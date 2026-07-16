<script lang="ts">
  import { T } from "@threlte/core";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import {
    loadContinents,
    type ContinentFeature,
  } from "$lib/globe/buildContinents";
  import {
    isContinentHighlighted,
    levelIdForContinent,
  } from "$lib/globe/levelContinents";
  import { sceneColors } from "$lib/theme";

  let {
    activeId = null,
    hoveredId = null,
    interactive = false,
    /** Draw behind the puzzle (camera-locked play globe). */
    backdrop = false,
    onHover = (_id: string | null) => {},
    onSelect = (_id: string) => {},
    radius = 1,
  }: {
    activeId?: string | null;
    hoveredId?: string | null;
    /** When false, meshes ignore raycasts so they don't block the puzzle. */
    interactive?: boolean;
    backdrop?: boolean;
    onHover?: (id: string | null) => void;
    onSelect?: (id: string) => void;
    radius?: number;
  } = $props();

  const GEO_URL = `${base}/arcgis-world-continents.simplified.geojson`;
  // Ocean under land; land slightly in front via renderOrder + polygonOffset.
  const oceanOrder = $derived(backdrop ? -2 : 0);
  const landOrder = $derived(backdrop ? -1 : 1);

  let continents = $state<ContinentFeature[]>([]);

  onMount(() => {
    let cancelled = false;
    let loaded: ContinentFeature[] = [];

    loadContinents(GEO_URL, radius)
      .then((features) => {
        if (cancelled) {
          for (const f of features) f.geometry.dispose();
          return;
        }
        loaded = features;
        continents = features;
      })
      .catch((err: unknown) => {
        console.error("Failed to load globe continents", err);
      });

    return () => {
      cancelled = true;
      for (const c of loaded) c.geometry.dispose();
    };
  });

  function landColor(continentName: string): string {
    if (isContinentHighlighted(continentName, activeId, hoveredId)) {
      return activeId && levelIdForContinent(continentName) === activeId
        ? sceneColors.globe.landActive
        : sceneColors.globe.landHover;
    }
    return sceneColors.globe.land;
  }

  function noopRaycast() {}
</script>

{#if interactive}
  <T.Mesh renderOrder={oceanOrder}>
    <T.SphereGeometry args={[radius * 0.97, 96, 96]} />
    <T.MeshBasicMaterial color={sceneColors.globe.ocean} />
  </T.Mesh>

  {#each continents as continent (continent.name)}
    {@const levelId = levelIdForContinent(continent.name)}
    <T.Mesh
      geometry={continent.geometry}
      renderOrder={landOrder}
      onpointerenter={() => levelId && onHover(levelId)}
      onpointerleave={() => onHover(null)}
      onclick={() => levelId && onSelect(levelId)}
    >
      <T.MeshBasicMaterial
        color={landColor(continent.name)}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </T.Mesh>
  {/each}
{:else}
  <!--
    Backdrop earth sits near the camera; disable depth so leftover puzzle depth
    and ocean/land distance-sort don't etch chords through the continents.
    Stable paint order: ocean first, then land on top.
  -->
  <T.Mesh raycast={noopRaycast} renderOrder={oceanOrder}>
    <T.SphereGeometry args={[radius * 0.97, 96, 96]} />
    <T.MeshBasicMaterial
      color={sceneColors.globe.ocean}
      depthTest={false}
      depthWrite={false}
    />
  </T.Mesh>

  {#each continents as continent (continent.name)}
    <T.Mesh
      geometry={continent.geometry}
      raycast={noopRaycast}
      renderOrder={landOrder}
    >
      <T.MeshBasicMaterial
        color={landColor(continent.name)}
        depthTest={false}
        depthWrite={false}
      />
    </T.Mesh>
  {/each}
{/if}
