<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import MenuGlobe from "./MenuGlobe.svelte";
</script>

<main class="menu">
  <div class="globe" aria-hidden="true">
    <Canvas>
      <MenuGlobe />
    </Canvas>
  </div>

  <div class="content">
    <div class="title">
      <h1>Cross<span class="accent">World</span></h1>
      <p class="tagline">
        เกมปริศนาอักษรไขว้ 3 มิติเพื่อการเรียนรู้และปลุกจิตสำนึกด้านความยั่งยืน
        ประเภท โปรแกรมเพื่อการเรียนรู้
      </p>
    </div>

    <nav class="actions">
      <button class="play" onclick={() => goto(`${base}/levels`)}>
        เริ่มเล่น
        <span class="arrow">▸</span>
      </button>
      <button class="secondary" onclick={() => goto(`${base}/about`)}>
        เกี่ยวกับ / ตั้งค่า
      </button>
    </nav>
  </div>
</main>

<style>
  .menu {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #15334f;
    color: #e8e4d9;
  }
  .globe {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .globe :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    padding: 2rem;
    text-align: center;
    /* Soft vignette so title stays readable over spinning landmasses. */
    background: radial-gradient(
      ellipse 55% 50% at 50% 45%,
      rgba(12, 28, 44, 0.55) 0%,
      rgba(12, 28, 44, 0.2) 55%,
      transparent 75%
    );
  }
  .title {
    max-width: 40rem;
  }
  h1 {
    margin: 0;
    font-size: clamp(3.5rem, 12vw, 8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.95;
    color: #f4f2e6;
    text-shadow: 0 2px 24px rgba(12, 28, 44, 0.45);
  }
  h1 .accent {
    color: #6ec4b8;
  }
  .tagline {
    margin: 1rem auto 0;
    max-width: 32rem;
    color: rgba(232, 228, 217, 0.78);
    font-size: clamp(1rem, 2.2vw, 1.15rem);
    line-height: 1.55;
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .play {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
    padding: 1rem 2.75rem;
    font: 700 1.15rem var(--font-sans);
    color: #fff;
    background: var(--green);
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    box-shadow: var(--shadow-soft);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  }
  .play:hover {
    transform: translateY(-2px);
    background: var(--green-strong);
    box-shadow: var(--shadow-lift);
  }
  .play:active {
    transform: translateY(0);
  }
  .secondary {
    padding: 0.7rem 1.5rem;
    font: 600 0.95rem var(--font-sans);
    color: #e8e4d9;
    background: rgba(12, 20, 36, 0.45);
    border: 2px solid rgba(232, 228, 217, 0.35);
    border-radius: var(--radius-pill);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .secondary:hover {
    color: #15334f;
    background: #e8e4d9;
    border-color: #e8e4d9;
  }
  .arrow {
    font-size: 0.95em;
  }

  @media (prefers-reduced-motion: reduce) {
    .play,
    .secondary {
      transition: none;
    }
  }
</style>
