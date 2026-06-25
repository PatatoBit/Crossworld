<script lang="ts">
  import { T, useThrelte, useTask } from "@threlte/core";
  import {
    TrackballControls,
    Gizmo,
    Text,
    Billboard,
    Edges,
    interactivity,
    useInteractivity,
  } from "@threlte/extras";
  import type { IntersectionEvent } from "@threlte/extras";
  import type { ComponentProps } from "svelte";
  import { puzzleCenter } from "$lib/crossword/puzzle";
  import type { CrosswordGame } from "$lib/crossword/game.svelte";
  // @ts-ignore – three r184 ships no .d.ts; runtime import works fine
  import * as THREE from "three";

  let { game }: { game: CrosswordGame } = $props();

  interactivity();
  // Access Threlte's own internal raycaster and pointer NDC so the debug line
  // shows the EXACT ray used for hit detection, not a separately computed one.
  const { raycaster: _rc, pointer: _pointer } = useInteractivity();
  // Edges creates THREE.LineSegments as children of each Mesh. The default
  // line hit threshold is 1 world unit — larger than the gap between cubes —
  // so lines were being "hit" before the ray reached the box geometry.
  _rc.params.Line = { threshold: 0 };
  _rc.params.Points = { threshold: 0 };

  // TrackballControls instance, shared with the orientation gizmo.
  // (Type comes from TrackballControls' bindable `ref`, avoiding the
  //  un-typed `three/examples/jsm` subpath import.)
  let controls = $state<ComponentProps<typeof TrackballControls>["ref"]>();

  const cells = [...game.built.cells.values()];
  // Re-center so the controls pivot around the middle of the puzzle.
  const [cx, cy, cz] = puzzleCenter(cells);

  // ── Ray debug ────────────────────────────────────────────────────────────
  let showRayDebug = $state(false);
  let lineGeo = $state<THREE.BufferGeometry | undefined>();
  let hitPos = $state<[number, number, number] | null>(null);

  // Reuse a single Vector3 for the far end of the ray each frame.
  const _end = new THREE.Vector3();

  // Every frame: update the line geometry from Threlte's own raycaster.
  // useTask (not $effect) keeps the ray correct while orbiting without moving
  // the mouse, because the raycaster re-projects from the current camera.
  useTask(() => {
    if (!showRayDebug || !lineGeo) return;
    const o = _rc.ray.origin;
    const d = _rc.ray.direction;
    _end.copy(o).addScaledVector(d, 30);
    (lineGeo as any).setFromPoints([o, _end]);
  });
</script>

<svelte:window
  onkeydown={(e) => {
    // When a cell is selected, the keyboard drives letter entry / navigation.
    if (game.selectedCellKey) {
      if (e.key === "Escape") {
        game.clearSelection();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        game.backspace();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        game.moveActive(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        game.moveActive(-1);
      } else if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        game.typeLetter(e.key);
      }
      return;
    }
    // No selection: "d" toggles the ray debug overlay.
    if (e.key.toLowerCase() === "d" && !e.repeat) showRayDebug = !showRayDebug;
  }}
/>

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
    {@const active = cell.key === game.selectedCellKey}
    {@const order = game.highlightedOrder.get(cell.key)}
    {@const totalLen = game.highlightedCells.size}
    {@const t = order !== undefined && totalLen > 1 ? (order - 1) / (totalLen - 1) : 0}
    <T.Group position={cell.position}>
      <T.Mesh
        onclick={() => game.selectCell(cell.key)}
        onpointerenter={(e: IntersectionEvent<PointerEvent>) => {
          game.hoverCell(cell.key);
          // .point is inherited from THREE.Intersection but lost in the type chain
          // because three r184 ships no .d.ts; it exists at runtime.
          const pt = (e as any).point as { x: number; y: number; z: number };
          hitPos = [pt.x, pt.y, pt.z];
        }}
        onpointerleave={() => {
          game.hoverCell(null);
          hitPos = null;
        }}
      >
        <T.BoxGeometry args={[0.9, 0.9, 0.9]} />
        <T.MeshStandardMaterial
          color={active ? "#fbbf24" : lit ? "#34d399" : "#64748b"}
          emissive={active ? "#f59e0b" : lit ? "#10b981" : "#334155"}
          emissiveIntensity={active ? 0.6 : lit ? 0.7 - t * 0.5 : 0.35}
          transparent
          opacity={active ? 0.8 : lit ? 0.85 - t * 0.5 : 0.5}
          roughness={0.45}
          depthWrite={false}
        />
        <Edges color={active ? "#fde68a" : lit ? "#a7f3d0" : "#94a3b8"} />
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

{#if showRayDebug}
  <!-- Yellow ray line: camera → cursor, 30 units deep. -->
  <T.Line frustumCulled={false}>
    <T.BufferGeometry bind:ref={lineGeo} />
    <T.LineBasicMaterial color="#fbbf24" />
  </T.Line>

  <!-- Red sphere at the exact surface point where the ray hit a cube face. -->
  {#if hitPos}
    <T.Mesh position={hitPos}>
      <T.SphereGeometry args={[0.08, 8, 8]} />
      <T.MeshBasicMaterial color="#f43f5e" depthTest={false} />
    </T.Mesh>
  {/if}
{/if}
