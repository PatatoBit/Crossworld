<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import {
    OrbitControls,
    Text,
    Billboard,
    interactivity,
  } from "@threlte/extras";
  import type { ComponentProps } from "svelte";
  import EarthMesh from "$lib/globe/EarthMesh.svelte";
  import {
    LEVEL_ANCHORS,
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
  const LABEL_RADIUS = RADIUS * 1.12;
  /** Match <OrbitControls> polar limits so focus converges under clamp. */
  const MIN_POLAR = 0.35;
  const MAX_POLAR = Math.PI - 0.35;
  /** Exponential approach rate (higher = snappier turn toward continent). */
  const FOCUS_SPEED = 5;

  const { camera, size } = useThrelte();
  const scratch = new THREE.Vector3();
  const focusDir = new THREE.Vector3();
  const fromDir = new THREE.Vector3();
  const focusSpherical = new THREE.Spherical();
  const identityQuat = new THREE.Quaternion();
  const fullRot = new THREE.Quaternion();
  const rotStep = new THREE.Quaternion();

  let controls = $state<ComponentProps<typeof OrbitControls>["ref"]>();
  /** When set, orbit the camera so this continent faces forward. */
  let focusId = $state<string | null>(null);

  const labeledLevels = $derived(
    levels.filter(
      (l) =>
        l.id in LEVEL_ANCHORS &&
        (l.id === activeId || l.id === hoveredId),
    ),
  );

  // Latch focus on hover — never clear it when the pointer leaves. Auto-turn
  // moves the continent out from under the cursor, which would otherwise fire
  // pointerleave → clear hover → abort the turn (jittery start/stop loop).
  $effect(() => {
    const id = hoveredId;
    if (id && id in LEVEL_ANCHORS) focusId = id;
  });

  // User drag wins — don't fight OrbitControls mid-gesture.
  $effect(() => {
    const c = controls;
    if (!c) return;
    const onStart = () => {
      focusId = null;
    };
    c.addEventListener("start", onStart);
    return () => c.removeEventListener("start", onStart);
  });

  /** Keep hover highlight while auto-turning; ignore leave events caused by the spin. */
  function handleGlobeHover(id: string | null) {
    if (id === null && focusId) return;
    onHover(id);
  }

  useTask((delta) => {
    if (!camera.current) return;
    const w = size.current.width;
    const h = size.current.height;
    if (w === 0 || h === 0) return;

    if (focusId && controls) {
      const anchor = LEVEL_ANCHORS[focusId];
      if (anchor) {
        scratch.copy(latLonToVector3(anchor.lat, anchor.lon, 1));
        focusSpherical.setFromVector3(scratch);
        focusSpherical.phi = THREE.MathUtils.clamp(
          focusSpherical.phi,
          MIN_POLAR,
          MAX_POLAR,
        );
        focusDir.setFromSpherical(focusSpherical).normalize();

        fromDir
          .subVectors(camera.current.position, controls.target)
          .normalize();
        const angle = fromDir.angleTo(focusDir);
        if (angle < 0.012) {
          focusId = null;
        } else {
          fullRot.setFromUnitVectors(fromDir, focusDir);
          rotStep.slerpQuaternions(
            identityQuat,
            fullRot,
            1 - Math.exp(-FOCUS_SPEED * delta),
          );
          camera.current.position
            .sub(controls.target)
            .applyQuaternion(rotStep)
            .add(controls.target);
          controls.update();
        }
      }
    }

    const anchors: Record<string, ScreenAnchor> = {};
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
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.3, 3.55]} fov={42}>
  <OrbitControls
    bind:ref={controls}
    enableDamping
    dampingFactor={0.08}
    enablePan={false}
    minDistance={2.2}
    maxDistance={6}
    minPolarAngle={MIN_POLAR}
    maxPolarAngle={MAX_POLAR}
  />
</T.PerspectiveCamera>

<EarthMesh
  {activeId}
  {hoveredId}
  interactive
  onHover={handleGlobeHover}
  {onSelect}
  radius={RADIUS}
/>

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
