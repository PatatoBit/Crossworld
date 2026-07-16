<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import {
    OrbitControls,
    Text,
    Billboard,
    interactivity,
  } from "@threlte/extras";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import {
    loadContinents,
    type ContinentFeature,
  } from "$lib/globe/buildContinents";
  import {
    LEVEL_ANCHORS,
    isContinentHighlighted,
    levelIdForContinent,
    type ScreenAnchor,
  } from "$lib/globe/levelContinents";
  import { latLonToVector3 } from "$lib/globe/latLon";
  import { levels } from "$lib/levels";
  import { googleSansFontUrl } from "$lib/fonts";
  import { sceneColors } from "$lib/theme";
  // @ts-ignore – three r184 ships no .d.ts; runtime import works fine
  import * as THREE from "three";

  let {
    activeId = null,
    hoveredId = null,
    onHover = (_id: string | null) => {},
    onSelect = (_id: string) => {},
    onAnchorUpdate = (_anchors: Record<string, ScreenAnchor>) => {},
  }: {
    activeId?: string | null;
    hoveredId?: string | null;
    onHover?: (id: string | null) => void;
    onSelect?: (id: string) => void;
    onAnchorUpdate?: (anchors: Record<string, ScreenAnchor>) => void;
  } = $props();

  interactivity();

  const RADIUS = 1;
  const GEO_URL = `${base}/arcgis-world-continents.simplified.geojson`;
  const LABEL_RADIUS = RADIUS * 1.12;

  let continents = $state<ContinentFeature[]>([]);
  const { camera, size } = useThrelte();
  const scratch = new THREE.Vector3();

  const labeledLevels = $derived(
    levels.filter(
      (l) =>
        l.id in LEVEL_ANCHORS &&
        (l.id === activeId || l.id === hoveredId),
    ),
  );

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

  useTask(() => {
    if (!camera.current) return;
    const anchors: Record<string, ScreenAnchor> = {};
    const w = size.current.width;
    const h = size.current.height;
    if (w === 0 || h === 0) return;

    for (const [levelId, { lat, lon }] of Object.entries(LEVEL_ANCHORS)) {
      scratch.copy(latLonToVector3(lat, lon, LABEL_RADIUS));
      scratch.project(camera.current);
      const visible =
        scratch.z > -1 &&
        scratch.z < 1 &&
        scratch.x >= -1.1 &&
        scratch.x <= 1.1 &&
        scratch.y >= -1.1 &&
        scratch.y <= 1.1;
      anchors[levelId] = {
        x: (scratch.x * 0.5 + 0.5) * w,
        y: (-scratch.y * 0.5 + 0.5) * h,
        visible,
      };
    }

    onAnchorUpdate(anchors);
  });

  function landColor(continentName: string): string {
    if (isContinentHighlighted(continentName, activeId, hoveredId)) {
      return activeId && levelIdForContinent(continentName) === activeId
        ? sceneColors.globe.landActive
        : sceneColors.globe.landHover;
    }
    return sceneColors.globe.land;
  }

  function handleContinentPointer(levelId: string | undefined) {
    if (!levelId) return;
    onHover(levelId);
  }
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.3, 3.55]} fov={42}>
  <OrbitControls
    enableDamping
    dampingFactor={0.08}
    enablePan={false}
    minDistance={2.2}
    maxDistance={6}
    minPolarAngle={0.35}
    maxPolarAngle={Math.PI - 0.35}
  />
</T.PerspectiveCamera>

<T.Mesh>
  <T.SphereGeometry args={[RADIUS * 0.985, 64, 64]} />
  <T.MeshBasicMaterial color={sceneColors.globe.ocean} />
</T.Mesh>

{#each continents as continent (continent.name)}
  {@const levelId = levelIdForContinent(continent.name)}
  <T.Mesh
    geometry={continent.geometry}
    onpointerenter={() => handleContinentPointer(levelId)}
    onpointerleave={() => onHover(null)}
    onclick={() => levelId && onSelect(levelId)}
  >
    <T.MeshBasicMaterial color={landColor(continent.name)} />
  </T.Mesh>
{/each}

{#each labeledLevels as level (level.id)}
  {@const anchor = LEVEL_ANCHORS[level.id]}
  {@const pos = latLonToVector3(anchor.lat, anchor.lon, LABEL_RADIUS)}
  <T.Group position={[pos.x, pos.y, pos.z]}>
    <Billboard>
      <Text
        text={level.name}
        font={googleSansFontUrl}
        fontSize={0.07}
        color={sceneColors.globe.label}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor={sceneColors.globe.ocean}
        depthTest={false}
        depthWrite={false}
        renderOrder={10}
      />
    </Billboard>
  </T.Group>
{/each}
