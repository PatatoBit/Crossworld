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
  import EarthMesh from "$lib/globe/EarthMesh.svelte";
  import { LEVEL_ANCHORS } from "$lib/globe/levelContinents";
  import { continentOrientation } from "$lib/globe/latLon";
  import { googleSansFontUrl } from "$lib/fonts";
  import { sceneColors } from "$lib/theme";
  import { navTutorial } from "$lib/tutorial.svelte";
  // @ts-ignore – three r184 ships no .d.ts; runtime import works fine
  import * as THREE from "three";

  let {
    game,
    levelId = null,
  }: {
    game: CrosswordGame;
    levelId?: string | null;
  } = $props();

  /** Lift the puzzle so the Earth can occupy the lower third of the frame. */
  const PUZZLE_LIFT = 2.35;
  /** Camera-local Earth: arc along the bottom, ~20% of viewport height. */
  const EARTH_DIST = 10;
  const EARTH_FOV_DEG = 50;
  const EARTH_VIEW_FRAC = 0.2;
  const EARTH_HALF_H =
    EARTH_DIST * Math.tan(((EARTH_FOV_DEG / 2) * Math.PI) / 180);
  const EARTH_SCALE = EARTH_VIEW_FRAC * 2 * EARTH_HALF_H;
  const EARTH_CAM_POS: [number, number, number] = [
    0,
    -EARTH_HALF_H,
    -EARTH_DIST,
  ];

  /**
   * Place the level continent on the visible top arc (tilted slightly away
   * from the camera) while keeping geographic north screen-up so the landmass
   * reads upright.
   */
  function earthOrientation(id: string | null): [number, number, number] {
    const anchor = id ? LEVEL_ANCHORS[id] : undefined;
    if (!anchor) return [0, 0, 0];
    const to = new THREE.Vector3(0, 0.9, 0.44);
    const quat = continentOrientation(anchor.lat, anchor.lon, to);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return [euler.x, euler.y, euler.z];
  }

  const earthRot = $derived(earthOrientation(levelId));

  interactivity();
  // Access Threlte's own internal raycaster so the debug line shows the
  // EXACT ray used for hit detection, not a separately computed one.
  const { raycaster: _rc } = useInteractivity();
  // Edges creates THREE.LineSegments as children of each Mesh. The default
  // line hit threshold is 1 world unit — larger than the gap between cubes —
  // so lines were being "hit" before the ray reached the box geometry.
  _rc.params.Line = { threshold: 0 };
  _rc.params.Points = { threshold: 0 };

  const { camera } = useThrelte();

  // TrackballControls instance, shared with the orientation gizmo.
  // (Type comes from TrackballControls' bindable `ref`, avoiding the
  //  un-typed `three/examples/jsm` subpath import.)
  let controls = $state<ComponentProps<typeof TrackballControls>["ref"]>();

  const cells = [...game.built.cells.values()];
  // Re-center so the controls pivot around the middle of the puzzle.
  const [cx, cy, cz] = puzzleCenter(cells);

  // Map from first-cell key → crossword number, for in-scene labels.
  const cellNumbers = new Map<string, number>();
  for (const word of game.built.puzzle.words) {
    const firstKey = game.built.wordCells.get(word.id)?.[0];
    if (firstKey !== undefined && !cellNumbers.has(firstKey)) {
      const num = game.built.wordNumbers.get(word.id);
      if (num !== undefined) cellNumbers.set(firstKey, num);
    }
  }

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

  /** 0–1 envelope for the intersection-hint pulse (sine of elapsed time). */
  let intersectPulse = $state(0);
  let _intersectPulseT = 0;
  const INTERSECT_PULSE_HZ = 0.7; // ~1.4s per breath

  // Bounce direction: camera.up projected onto the plane perpendicular to the
  // word axis, so letters always appear to jump "up" relative to their reading
  // direction regardless of which 3-D axis the word runs along.
  let bopDir = $state<[number, number, number]>([0, 1, 0]);

  // Compute target camera position + up so the given word axis reads left-to-right.
  // Derived from: right = cross(forward, up) = wordDir.
  // Orbit around the raised puzzle center (not world origin).
  // Pitch is 45° from vertical (looking down) so the row stays readable.
  function wordCameraTarget(axis: Axis, dist: number): [THREE.Vector3, THREE.Vector3] {
    const h = dist * Math.SQRT1_2; // elevation (sin 45°)
    const d = dist * Math.SQRT1_2; // horizontal (cos 45°)
    const y = PUZZLE_LIFT;
    if (axis === 'x') return [new THREE.Vector3(0, y + h, d),  new THREE.Vector3(0, 1, 0)];
    if (axis === 'z') return [new THREE.Vector3(-d, y + h, 0), new THREE.Vector3(0, 1, 0)];
                      return [new THREE.Vector3(d, y, h),  new THREE.Vector3(0, 0, 1)];
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
  const _pivot = new THREE.Vector3(0, PUZZLE_LIFT, 0);

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

    if (navTutorial.step === "intersect") {
      _intersectPulseT += delta;
      // Smooth in–out breath: 0 at trough, 1 at peak.
      intersectPulse =
        0.5 + 0.5 * Math.sin(_intersectPulseT * Math.PI * 2 * INTERSECT_PULSE_HZ);
    } else if (_intersectPulseT !== 0) {
      _intersectPulseT = 0;
      intersectPulse = 0;
    }

    // ── Camera orientation ────────────────────────────────────────────────────
    // On select, fly to the angle that makes the word read left-to-right.
    // On deselect, leave the camera where it is — only cell visuals reset.
    const selId = game.selectedWordId ?? '';
    if (selId !== _prevSelectedId) {
      _prevSelectedId = selId;
      if (selId) {
        const word = game.built.puzzle.words.find((w) => w.id === selId);
        if (word) {
          const cam = camera.current;
          // Distance from the raised puzzle pivot, not world origin.
          const dist = Math.max(cam.position.distanceTo(_pivot), 8);
          const [tp, tu] = wordCameraTarget(word.axis, dist);
          _camPosTgt = tp;
          _camUpTgt  = tu;
          _camPosStart.copy(cam.position);
          _camUpStart.copy(cam.up);
          _camAnimT = 0;
        }
      } else {
        // Cancel any in-flight camera tween; do not return to the level overview.
        _camPosTgt = null;
        _camUpTgt = null;
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

  // Keep trackball orbit centered on the raised puzzle.
  $effect(() => {
    if (!controls) return;
    controls.target.set(0, PUZZLE_LIFT, 0);
    controls.update();
  });

  /** Cube opacity for non-highlighted cells nearest / furthest from the lit word. */
  const DIM_NEAR = 0.48;
  const DIM_FAR = 0.14;

  /** Min Euclidean distance from a cell to any cell in the highlighted word. */
  function distToHighlight(
    pos: [number, number, number],
    litPositions: [number, number, number][],
  ): number {
    let min = Infinity;
    for (const [hx, hy, hz] of litPositions) {
      const dx = pos[0] - hx;
      const dy = pos[1] - hy;
      const dz = pos[2] - hz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < min) min = d;
    }
    return min;
  }

  /** Positions of the currently highlighted word's cells (empty when idle). */
  const litPositions = $derived.by((): [number, number, number][] => {
    const id = game.selectedWordId ?? game.hoveredWordId;
    if (!id) return [];
    const keys = game.built.wordCells.get(id) ?? [];
    return keys.map((key) => {
      const c = game.built.cells.get(key)!;
      return c.position;
    });
  });

  /** Cells on the focused word or any word that intersects it. */
  const connectedCells = $derived.by((): Set<string> => {
    const id = game.selectedWordId ?? game.hoveredWordId;
    if (!id) return new Set();
    const wordIds = new Set<string>();
    for (const key of game.built.wordCells.get(id) ?? []) {
      const cell = game.built.cells.get(key);
      if (!cell) continue;
      for (const wid of cell.wordIds) wordIds.add(wid);
    }
    const keys = new Set<string>();
    for (const wid of wordIds) {
      for (const key of game.built.wordCells.get(wid) ?? []) keys.add(key);
    }
    return keys;
  });

  /** Furthest non-highlighted cell distance — used to normalize the fade. */
  const fadeMaxDist = $derived.by(() => {
    if (litPositions.length === 0) return 0;
    let max = 0;
    for (const cell of cells) {
      if (game.highlightedCells.has(cell.key)) continue;
      const d = distToHighlight(cell.position, litPositions);
      if (d > max) max = d;
    }
    return max;
  });

  function dimOpacity(pos: [number, number, number]): number {
    if (fadeMaxDist <= 0) return DIM_NEAR;
    const t = distToHighlight(pos, litPositions) / fadeMaxDist;
    return DIM_NEAR + (DIM_FAR - DIM_NEAR) * t;
  }
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

<T.PerspectiveCamera makeDefault position={[7, 6 + PUZZLE_LIFT, 9]} fov={50}>
  <!-- TrackballControls orbits freely with no up-vector, so the camera
       never locks at the poles the way OrbitControls does. -->
  <TrackballControls bind:ref={controls} />

  <!-- Camera-locked Earth: stays at the bottom of the view while orbiting;
       continent faces the player and does not spin. -->
  <T.Group
    position={EARTH_CAM_POS}
    scale={[EARTH_SCALE, EARTH_SCALE, EARTH_SCALE]}
    rotation={earthRot}
  >
    <EarthMesh activeId={levelId} radius={1} backdrop />
  </T.Group>
</T.PerspectiveCamera>

<!-- Blender-style orientation gizmo (corner). Click a face/axis to snap. -->
{#if controls}
  <Gizmo {controls} placement="top-right" size={96} />
{/if}

<T.AmbientLight intensity={1.1} />
<T.DirectionalLight position={[8, 12, 6]} intensity={1.4} />
<T.DirectionalLight position={[-6, -4, -8]} intensity={0.5} />

<!--
  Back-face miss target: sits around the puzzle so a click that hits no cell
  still registers here. Same action as Escape. Threlte's own click thresholds
  ignore orbit-drags. When a cell is nearer along the ray, intersections[0]
  is that cell and we no-op.
-->
<T.Mesh
  position={[0, PUZZLE_LIFT, 0]}
  onclick={(e: IntersectionEvent<MouseEvent>) => {
    if (e.intersections[0]?.eventObject !== e.eventObject) return;
    game.clearSelection();
  }}
>
  <T.SphereGeometry args={[48, 16, 16]} />
  <T.MeshBasicMaterial
    side={THREE.BackSide}
    transparent
    opacity={0}
    depthWrite={false}
  />
</T.Mesh>

<T.Group position={[-cx, -cy + PUZZLE_LIFT, -cz]}>
  {@const focusing = litPositions.length > 0}
  {#each cells as cell (cell.key)}
    {@const lit = game.highlightedCells.has(cell.key)}
    {@const done = game.completedCells.has(cell.key)}
    {@const wrong = game.incorrectCells.has(cell.key)}
    {@const litWrong = lit && game.highlightedWordIncorrect}
    {@const litDone = lit && game.highlightedWordComplete}
    {@const active = cell.key === game.selectedCellKey}
    {@const isIntersectHint =
      navTutorial.step === "intersect" && cell.wordIds.length > 1}
    {@const order = game.highlightedOrder.get(cell.key)}
    {@const bopT = waveElapsed !== null && order !== undefined ? Math.max(0, Math.min((waveElapsed - (order - 1) * BOP_STAGGER) / BOP_DURATION, 1)) : 0}
    {@const bop = lit && order !== undefined ? Math.sin(bopT * Math.PI) * BOP_HEIGHT : 0}
    {@const showOutline = !focusing || lit || active || isIntersectHint}
    {@const cubeOpacity = focusing && !lit && !active && !isIntersectHint
      ? dimOpacity(cell.position)
      : active
        ? 0.85
        : isIntersectHint
          ? 0.55 + 0.3 * intersectPulse
          : lit
            ? 0.72
            : done || wrong
              ? 0.62
              : 0.5}
    {@const letterOpacity = !focusing || lit || active || isIntersectHint
      ? 1
      : connectedCells.has(cell.key)
        ? 0.28
        : 0}
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
        {@const tone = active
          ? sceneColors.cell.active
          : isIntersectHint
            ? sceneColors.cell.intersection
            : litWrong
              ? sceneColors.cell.highlightedIncorrect
              : litDone
                ? sceneColors.cell.highlightedComplete
                : lit
                  ? sceneColors.cell.highlighted
                  : done
                    ? sceneColors.cell.completed
                    : wrong
                      ? sceneColors.cell.incorrect
                      : sceneColors.cell.default}
        <T.BoxGeometry args={[0.9, 0.9, 0.9]} />
        <T.MeshStandardMaterial
          color={tone.color}
          emissive={tone.emissive}
          emissiveIntensity={active
            ? 0.6
            : isIntersectHint
              ? 0.35 + 0.55 * intersectPulse
              : lit
                ? 0.5
                : done || wrong
                  ? 0.42
                  : 0.35}
          transparent
          opacity={cubeOpacity}
          roughness={0.45}
          depthWrite={false}
        />
        {#if showOutline}
          <Edges color={tone.edge} />
        {/if}
      </T.Mesh>

      <!-- Billboard keeps the letter facing the camera → it always stays
           upright/vertical no matter how you orbit the puzzle.
           Unconnected rows hide letters entirely while focusing. -->
      {#if letterOpacity > 0}
        <Billboard>
          <Text
            text={game.displayLetter(cell.key)}
            font={googleSansFontUrl}
            fontSize={0.5}
            color={sceneColors.letter}
            fillOpacity={letterOpacity}
            anchorX="center"
            anchorY="middle"
            renderOrder={1}
          />
        </Billboard>

        <!-- Word-number label at the top-left of the starting cell. -->
        {@const cellNum = cellNumbers.get(cell.key)}
        {#if cellNum !== undefined}
          <T.Group position={[-0.27, 0.27, 0]}>
            <Billboard>
              <Text
                text={String(cellNum)}
                font={googleSansFontUrl}
                fontSize={0.18}
                color={sceneColors.number}
                fillOpacity={letterOpacity}
                anchorX="center"
                anchorY="middle"
                renderOrder={1}
              />
            </Billboard>
          </T.Group>
        {/if}
      {/if}
    </T.Group>
  {/each}
</T.Group>

{#if showRayDebug}
  <!-- Yellow ray line: camera → cursor, 30 units deep. -->
  <T.Line frustumCulled={false}>
    <T.BufferGeometry bind:ref={lineGeo} />
    <T.LineBasicMaterial color={sceneColors.rayLine} />
  </T.Line>

  <!-- Red sphere at the exact surface point where the ray hit a cube face. -->
  {#if hitPos}
    <T.Mesh position={hitPos}>
      <T.SphereGeometry args={[0.08, 8, 8]} />
      <T.MeshBasicMaterial color={sceneColors.rayHit} depthTest={false} />
    </T.Mesh>
  {/if}
{/if}
