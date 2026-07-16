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

  function landColor(name: string): string {
    return sceneColors.globe.continents[name] ?? sceneColors.globe.landFallback;
  }
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.35, 2.85]} fov={42}>
  <OrbitControls
    enableDamping
    dampingFactor={0.08}
    autoRotate
    autoRotateSpeed={0.35}
    enablePan={false}
    minDistance={1.7}
    maxDistance={5}
    minPolarAngle={0.35}
    maxPolarAngle={Math.PI - 0.35}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.85} />
<T.DirectionalLight position={[4, 3, 5]} intensity={1.35} />
<T.DirectionalLight position={[-3, -1, -4]} intensity={0.35} />

<!-- Soft atmosphere shell -->
<T.Mesh>
  <T.SphereGeometry args={[RADIUS * 1.035, 48, 48]} />
  <T.MeshBasicMaterial
    color={sceneColors.globe.atmosphere}
    transparent
    opacity={0.12}
    depthWrite={false}
  />
</T.Mesh>

<!-- Ocean — kept a bit under land so subdivided faces never sink through -->
<T.Mesh>
  <T.SphereGeometry args={[RADIUS * 0.985, 64, 64]} />
  <T.MeshStandardMaterial
    color={sceneColors.globe.ocean}
    roughness={0.55}
    metalness={0.05}
  />
</T.Mesh>

{#each continents as continent (continent.name)}
  <T.Mesh geometry={continent.geometry}>
    <T.MeshStandardMaterial
      color={landColor(continent.name)}
      roughness={0.7}
      metalness={0.05}
    />
  </T.Mesh>
{/each}
