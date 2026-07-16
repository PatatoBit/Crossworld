<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
</script>

<main class="menu">
  <span class="eyebrow">ปริศนาที่เติบโตเพื่อโลกที่ดีขึ้น</span>

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
  </nav>
</main>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.75rem;
    width: 100vw;
    height: 100vh;
    padding: 2rem;
    text-align: center;
    background: radial-gradient(
        circle at 15% 15%,
        rgba(34, 197, 94, 0.14),
        transparent 45%
      ),
      radial-gradient(
        circle at 85% 80%,
        rgba(246, 201, 21, 0.14),
        transparent 45%
      ),
      var(--cream);
    color: var(--ink);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
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
    color: var(--forest);
  }
  h1 .accent {
    color: var(--green);
  }
  .tagline {
    margin: 1rem auto 0;
    max-width: 32rem;
    color: var(--muted);
    font-size: clamp(1rem, 2.2vw, 1.15rem);
    line-height: 1.55;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .pill {
    padding: 0.5rem 1.15rem;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    border: 2px solid transparent;
  }
  .pill.yellow {
    background: var(--yellow);
    color: var(--forest);
  }
  .pill.green {
    background: var(--green);
    color: #fff;
  }
  .pill.forest {
    background: var(--forest);
    color: var(--green);
  }
  .pill.outline {
    border-color: var(--forest);
    color: var(--forest);
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
      transform 0.15s,
      box-shadow 0.15s,
      background 0.15s;
  }
  .play:hover {
    transform: translateY(-2px);
    background: var(--green-strong);
    box-shadow: var(--shadow-lift);
  }
  .play:active {
    transform: translateY(0);
  }
  .arrow {
    font-size: 0.95em;
  }
</style>
