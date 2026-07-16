<script lang="ts">
  import { T } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import {
    loadContinents,
    type ContinentFeature,
  } from "$lib/globe/buildContinents";
  import { sceneColors } from "$lib/theme";

  const RADIUS = 1;
  const GEO_URL = `${base}/arcgis-world-continents.simplified.geojson`;

  let continents = $state<ContinentFeature[]>([]);

  onMount(() => {
    let cancelled = false;
    let loaded: ContinentFeature[] = [];

    loadContinents(GEO_URL, RADIUS)
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
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.35, 2.85]} fov={42}>
  <OrbitControls
    enableDamping
    dampingFactor={0.08}
    enablePan={false}
    minDistance={1.7}
    maxDistance={5}
    minPolarAngle={0.35}
    maxPolarAngle={Math.PI - 0.35}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.95} />
<T.DirectionalLight position={[4, 3, 5]} intensity={1.1} />
<T.DirectionalLight position={[-3, -1, -4]} intensity={0.25} />

<!-- Ocean — kept under land so subdivided faces never sink through -->
<T.Mesh>
  <T.SphereGeometry args={[RADIUS * 0.985, 64, 64]} />
  <T.MeshStandardMaterial
    color={sceneColors.globe.ocean}
    roughness={0.85}
    metalness={0}
  />
</T.Mesh>

{#each continents as continent (continent.name)}
  <T.Mesh geometry={continent.geometry}>
    <T.MeshStandardMaterial
      color={sceneColors.globe.land}
      roughness={0.9}
      metalness={0}
    />
  </T.Mesh>
{/each}
