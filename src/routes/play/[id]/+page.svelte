<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Scene from "./Scene.svelte";
  import Hud from "$lib/components/Hud.svelte";
  import { CrosswordGame } from "$lib/crossword/game.svelte";
  import { findLevel } from "$lib/levels";

  // Resolve the level from the route param and build its game. Rebuilds when
  // navigating between levels (the id is reactive via $derived).
  const level = $derived(findLevel($page.params.id ?? ""));
  const game = $derived(level?.puzzle ? new CrosswordGame(level.puzzle) : null);

  let startTime = $state(0);
  let elapsedMs = $state<number | null>(null);

  $effect(() => {
    if (game) {
      startTime = Date.now();
      elapsedMs = null;
    }
  });

  $effect(() => {
    if (game?.isComplete && elapsedMs === null) {
      elapsedMs = Date.now() - startTime;
    }
  });

  function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return `${sec} วินาที`;
    return `${min} นาที ${sec.toString().padStart(2, "0")} วินาที`;
  }
</script>

{#if game}
  <div class="layout">
    <div class="canvas-wrap">
      <Canvas>
        <Scene {game} levelId={level?.id ?? null} />
      </Canvas>
      <button class="back" onclick={() => goto(`${base}/levels`)}
        >← เลือกด่าน</button
      >
    </div>
    <aside class="sidebar">
      <Hud {game} />
    </aside>

    {#if game.isComplete && elapsedMs !== null}
      <div
        class="complete-overlay"
        role="dialog"
        aria-labelledby="complete-title"
      >
        <div class="complete-card">
          <span class="eyebrow">ผ่านด่านแล้ว</span>
          <h2 id="complete-title">
            ผ่านด่าน {level?.name ?? "ปริศนา"} ได้แล้ว
          </h2>
          <p class="time">
            ใช้เวลา <strong>{formatTime(elapsedMs)}</strong>
          </p>
          <div class="actions">
            <button class="primary" onclick={() => goto(`${base}/levels`)}>
              กลับไปเลือกด่าน
            </button>
            <button
              class="secondary"
              onclick={() => goto(`${base}/play/${level?.id}`)}
            >
              เล่นอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="missing">
    <h1>{level ? `ทวีป${level.name}กำลังอยู่ในการพัฒนา` : "ไม่พบด่าน"}</h1>
    <p>
      {level
        ? "ปริศนาของทวีปนี้ยังไม่ได้สร้าง"
        : "ไม่พบด่านที่ตรงกับที่อยู่นี้"}
    </p>
    <button onclick={() => goto(`${base}/levels`)}>← กลับไปเลือกด่าน</button>
  </div>
{/if}

<style>
  .layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background: var(--cream);
  }
  .canvas-wrap {
    flex: 3;
    position: relative;
    height: 100%;
    background: radial-gradient(
      circle at 40% 28%,
      #1a3d5c,
      #0b1628 72%
    );
  }
  .sidebar {
    flex: 1;
    min-width: 300px;
    height: 100%;
    overflow-y: auto;
    border-left: 1px solid rgba(13, 42, 26, 0.08);
    background: var(--cream);
  }

  @media (max-width: 768px) {
    .layout {
      flex-direction: column;
    }
    .canvas-wrap {
      flex: 1 1 auto;
      min-height: 0;
      height: auto;
    }
    .sidebar {
      flex: 0 0 auto;
      min-width: 0;
      width: 100%;
      height: auto;
      max-height: 42vh;
      border-left: none;
      border-top: 1px solid rgba(13, 42, 26, 0.08);
    }
  }
  .back {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 2;
    padding: 0.55rem 1.05rem;
    font: 600 0.85rem var(--font-sans);
    color: #e8e4d9;
    background: rgba(12, 20, 36, 0.55);
    border: 1.5px solid rgba(232, 228, 217, 0.35);
    border-radius: var(--radius-pill);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .back:hover {
    background: rgba(232, 228, 217, 0.12);
    border-color: #e8e4d9;
  }
  .complete-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(13, 42, 26, 0.55);
    backdrop-filter: blur(4px);
  }
  .complete-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    max-width: 26rem;
    width: 100%;
    padding: 2.5rem 2rem;
    text-align: center;
    color: var(--ink);
    background: var(--cream);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-lift);
  }
  .eyebrow {
    padding: 0.3rem 0.85rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
  }
  .complete-card h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--forest);
  }
  .time {
    margin: 0.25rem 0 0.75rem;
    font-size: 1.05rem;
    color: var(--muted);
  }
  .time strong {
    color: var(--green-strong);
    font-weight: 800;
    font-size: 1.35rem;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
  }
  .primary,
  .secondary {
    padding: 0.75rem 1.5rem;
    font: 700 0.9rem var(--font-sans);
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      transform 0.15s,
      background 0.15s,
      color 0.15s;
  }
  .primary {
    color: #fff;
    background: var(--green);
    border: none;
    box-shadow: var(--shadow-soft);
  }
  .primary:hover {
    transform: translateY(-1px);
    background: var(--green-strong);
  }
  .secondary {
    color: var(--forest);
    background: transparent;
    border: 2px solid var(--forest);
  }
  .secondary:hover {
    color: var(--cream);
    background: var(--forest);
  }
  .missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100vw;
    height: 100vh;
    color: var(--ink);
    text-align: center;
    background: radial-gradient(
        circle at 50% 30%,
        rgba(34, 197, 94, 0.12),
        transparent 45%
      ),
      var(--cream);
  }
  .missing h1 {
    color: var(--forest);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .missing p {
    color: var(--muted);
    margin: 0;
  }
  .missing button {
    margin-top: 0.5rem;
    padding: 0.7rem 1.5rem;
    font: 700 0.9rem var(--font-sans);
    color: #fff;
    background: var(--green);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition: background 0.15s;
  }
  .missing button:hover {
    background: var(--green-strong);
  }
</style>
