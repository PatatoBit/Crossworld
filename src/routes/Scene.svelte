<script lang="ts">
  import { T } from "@threlte/core";
  import { TrackballControls, Gizmo, Text, Billboard, Edges, interactivity } from "@threlte/extras";
  import type { ComponentProps } from "svelte";
  import { puzzleCenter } from "$lib/crossword/puzzle";
  import type { CrosswordGame } from "$lib/crossword/game.svelte";

  let { game }: { game: CrosswordGame } = $props();

  interactivity();

  // TrackballControls instance, shared with the orientation gizmo.
  // (Type comes from TrackballControls' bindable `ref`, avoiding the
  //  un-typed `three/examples/jsm` subpath import.)
  let controls = $state<ComponentProps<typeof TrackballControls>["ref"]>();

  const cells = [...game.built.cells.values()];
  // Re-center so the controls pivot around the middle of the puzzle.
  const [cx, cy, cz] = puzzleCenter(cells);
</script>

<T.PerspectiveCamera makeDefault position={[7, 6, 9]} fov={50}>
  <!-- TrackballControls orbits freely with no up-vector, so the camera
       never locks at the poles the way OrbitControls does. -->
  <TrackballControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- Blender-style orientation gizmo (corner). Click a face/axis to snap. -->
{#if controls}
  <Gizmo {controls} placement="top-right" size={96} />
{/if}

<T.AmbientLight intensity={1.1} />
<T.DirectionalLight position={[8, 12, 6]} intensity={1.4} />
<T.DirectionalLight position={[-6, -4, -8]} intensity={0.5} />

<T.Group position={[-cx, -cy, -cz]}>
  {#each cells as cell (cell.key)}
    {@const lit = game.highlightedCells.has(cell.key)}
    <T.Group position={cell.position}>
      <T.Mesh
        onpointerenter={() => game.hoverCell(cell.key)}
        onpointerleave={() => game.hoverCell(null)}
      >
        <T.BoxGeometry args={[0.9, 0.9, 0.9]} />
        <T.MeshStandardMaterial
          color={lit ? "#34d399" : "#64748b"}
          emissive={lit ? "#10b981" : "#334155"}
          emissiveIntensity={lit ? 0.5 : 0.35}
          transparent
          opacity={lit ? 0.7 : 0.5}
          roughness={0.45}
          depthWrite={false}
        />
        <Edges color={lit ? "#a7f3d0" : "#94a3b8"} />
      </T.Mesh>

      <!-- Billboard keeps the letter facing the camera → it always stays
           upright/vertical no matter how you orbit the puzzle. -->
      <Billboard>
        <Text
          text={game.displayLetter(cell.key)}
          fontSize={0.5}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          renderOrder={1}
        />
      </Billboard>
    </T.Group>
  {/each}
</T.Group>
