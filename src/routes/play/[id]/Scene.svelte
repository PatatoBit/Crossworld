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
  import type { Axis } from "$lib/crossword/types";
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

  const BOP_DURATION = 0.22;  // seconds each letter spends in the air
  const BOP_STAGGER  = 0.09;  // seconds between each letter starting
  const BOP_HEIGHT   = 0.3;   // world units
  const WAVE_DURATION = 2.0;  // generous ceiling; all cells finish well before this

  // Seconds since the current word's wave started; null when idle.
  let waveElapsed = $state<number | null>(null);
  let _prevHighlightId = '';

  // Bounce direction: camera.up projected onto the plane perpendicular to the
  // word axis, so letters always appear to jump "up" relative to their reading
  // direction regardless of which 3-D axis the word runs along.
  const { camera } = useThrelte();
  let bopDir = $state<[number, number, number]>([0, 1, 0]);

  // Compute target camera position + up so the given word axis reads left-to-right.
  // Derived from: right = cross(forward, up) = wordDir.
  // All targets sit at the same distance from the origin as the current camera.
  function wordCameraTarget(axis: Axis, dist: number): [THREE.Vector3, THREE.Vector3] {
    const h = dist * 0.5;    // elevation component (sin 30°)
    const d = dist * 0.866;  // horizontal component (cos 30°)
    if (axis === 'x') return [new THREE.Vector3(0, h, d),  new THREE.Vector3(0, 1, 0)];
    if (axis === 'z') return [new THREE.Vector3(-d, h, 0), new THREE.Vector3(0, 1, 0)];
                      return [new THREE.Vector3(d, 0, h),  new THREE.Vector3(0, 0, 1)];
  }

  // Camera fly-to animation state (plain vars — drive THREE directly, not Svelte DOM).
  let _camPosTgt: THREE.Vector3 | null = null;
  let _camUpTgt:  THREE.Vector3 | null = null;
  let _camPosStart = new THREE.Vector3();
  let _camUpStart  = new THREE.Vector3();
  let _camAnimT = 0;
  const CAM_ANIM_DUR = 0.55;
  let _prevSelectedId = '';

  const _fwd = new THREE.Vector3();
  // Reuse a single Vector3 for the far end of the ray each frame.
  const _end = new THREE.Vector3();

  useTask((delta) => {
    // Restart bop and recompute bounce direction whenever the highlighted word changes.
    const id = game.selectedWordId ?? game.hoveredWordId ?? '';
    if (id !== _prevHighlightId) {
      _prevHighlightId = id;
      waveElapsed = id ? 0 : null;
      if (id) {
        const word = game.built.puzzle.words.find((w) => w.id === id);
        if (word) {
          const cam = camera.current;
          const ax = word.axis === 'x' ? 1 : 0;
          const ay = word.axis === 'y' ? 1 : 0;
          const az = word.axis === 'z' ? 1 : 0;
          // Project camera.up perpendicular to the word axis.
          const dot = cam.up.x * ax + cam.up.y * ay + cam.up.z * az;
          let bx = cam.up.x - dot * ax;
          let by = cam.up.y - dot * ay;
          let bz = cam.up.z - dot * az;
          let len = Math.sqrt(bx * bx + by * by + bz * bz);
          if (len < 0.01) {
            // Word axis is parallel to camera.up (e.g. a vertical Y-axis word
            // with the camera in its default upright position). Fall back to
            // the camera's right direction projected perpendicular to the axis.
            cam.getWorldDirection(_fwd);
            bx = _fwd.y * az - _fwd.z * ay;
            by = _fwd.z * ax - _fwd.x * az;
            bz = _fwd.x * ay - _fwd.y * ax;
            len = Math.sqrt(bx * bx + by * by + bz * bz);
          }
          if (len > 0.01) bopDir = [bx / len, by / len, bz / len];
        }
      }
    }
    if (waveElapsed !== null) {
      waveElapsed += delta;
      if (waveElapsed >= WAVE_DURATION) waveElapsed = null;
    }

    // ── Camera orientation ────────────────────────────────────────────────────
    // Trigger only on selection changes (not hover) so the camera flies to the
    // angle that makes the selected word read left-to-right on screen.
    const selId = game.selectedWordId ?? '';
    if (selId !== _prevSelectedId) {
      _prevSelectedId = selId;
      if (selId) {
        const word = game.built.puzzle.words.find((w) => w.id === selId);
        if (word) {
          const cam = camera.current;
          const dist = Math.max(cam.position.length(), 8);
          const [tp, tu] = wordCameraTarget(word.axis, dist);
          _camPosTgt = tp;
          _camUpTgt  = tu;
          _camPosStart.copy(cam.position);
          _camUpStart.copy(cam.up);
          _camAnimT = 0;
        }
      } else {
        _camPosTgt = null;
        _camUpTgt  = null;
      }
    }
    if (_camPosTgt && _camUpTgt) {
      _camAnimT += delta;
      const t    = Math.min(_camAnimT / CAM_ANIM_DUR, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      camera.current.position.lerpVectors(_camPosStart, _camPosTgt, ease);
      camera.current.up.lerpVectors(_camUpStart, _camUpTgt, ease).normalize();
      if (controls) (controls as any).update();
      if (t >= 1) { _camPosTgt = null; _camUpTgt = null; }
    }

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
    {@const bopT = waveElapsed !== null && order !== undefined ? Math.max(0, Math.min((waveElapsed - (order - 1) * BOP_STAGGER) / BOP_DURATION, 1)) : 0}
    {@const bop = lit && order !== undefined ? Math.sin(bopT * Math.PI) * BOP_HEIGHT : 0}
    <T.Group position={[cell.position[0] + bop * bopDir[0], cell.position[1] + bop * bopDir[1], cell.position[2] + bop * bopDir[2]]}>
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
          emissiveIntensity={active ? 0.6 : lit ? 0.5 : 0.35}
          transparent
          opacity={active ? 0.8 : lit ? 0.7 : 0.5}
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
