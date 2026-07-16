<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import type { Group } from "three";
  import EarthMesh from "$lib/globe/EarthMesh.svelte";

  /** Earth axial tilt ≈ 23.5°. */
  const TILT = 0.41;
  /** Slow continuous spin (rad/s) — about one turn per ~50s. */
  const SPIN = 0.125;

  let group = $state<Group | undefined>();
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useTask((delta) => {
    if (!group || reduceMotion) return;
    group.rotation.y += SPIN * delta;
  });
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.15, 3.2]} fov={42} />

<!-- Slightly large + offset so the globe fills the frame behind the UI. -->
<T.Group
  bind:ref={group}
  position={[0.35, -0.15, 0]}
  scale={1.35}
  rotation={[TILT, 0.6, 0]}
>
  <EarthMesh radius={1} />
</T.Group>
