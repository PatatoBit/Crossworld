<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { progress } from "$lib/progress.svelte";

  let confirmOpen = $state(false);
  let resetFlash = $state(false);

  function openConfirm() {
    confirmOpen = true;
  }

  function closeConfirm() {
    confirmOpen = false;
  }

  function confirmReset() {
    progress.reset();
    confirmOpen = false;
    resetFlash = true;
    window.setTimeout(() => {
      resetFlash = false;
    }, 2500);
  }

  function onOverlayKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") closeConfirm();
  }
</script>

<main class="about">
  <button class="back" onclick={() => goto(`${base}/`)}>← เมนู</button>

  <div class="content">
    <header class="hero">
      <p class="eyebrow">เกี่ยวกับ / ตั้งค่า</p>
      <h1>Cross<span class="accent">World</span></h1>
      <p class="lede">
        เกมปริศนาอักษรไขว้ 3 มิติเพื่อการเรียนรู้และปลูกจิตสำนึกด้านความยั่งยืน
      </p>
    </header>

    <section class="card" aria-labelledby="about-heading">
      <h2 id="about-heading">เกี่ยวกับโครงการ</h2>
      <p>
        CrossWorld เป็นโปรแกรมเกมเพื่อส่งเสริมทักษะการเรียนรู้ (รหัสโครงการ
        28P22C00781)
        ที่ผสมผสานการฝึกคำศัพท์ภาษาอังกฤษเข้ากับความรู้ด้านสิ่งแวดล้อม
        และการพัฒนาอย่างยั่งยืน (UN SDGs)
      </p>
      <p>
        ผู้เล่นรับบทผู้พิทักษ์กาลเวลา เดินทางย้อนไปยังทวีปต่าง ๆ
        เพื่อไขปริศนาอักษรไขว้ 3
        มิติที่เกี่ยวข้องกับวิกฤตสิ่งแวดล้อมในแต่ละพื้นที่
        พร้อมฝึกการคิดเชิงพื้นที่ การแก้ปัญหา และจิตสำนึกรักษ์โลก
      </p>
      <dl class="meta">
        <div>
          <dt>ประเภท</dt>
          <dd>โปรแกรมเพื่อการเรียนรู้</dd>
        </div>
        <div>
          <dt>รหัสโครงการ</dt>
          <dd>28P22C00781</dd>
        </div>
        <div>
          <dt>ความคืบหน้า</dt>
          <dd>{progress.completedCount} / {progress.totalCount} ด่าน</dd>
        </div>
      </dl>
    </section>

    <section class="card settings" aria-labelledby="settings-heading">
      <h2 id="settings-heading">ตั้งค่า</h2>
      <p>
        ล้างความจำความจำของด่านทั้งหมดที่บันทึกไว้ในเครื่องนี้
        (ด่านที่ผ่านแล้วจะถูกล็อกกลับตามลำดับเดิม)
      </p>
      {#if resetFlash}
        <p class="flash" role="status">ล้างความจำด่านเรียบร้อยแล้ว</p>
      {/if}
      <button
        class="danger"
        onclick={openConfirm}
        disabled={progress.completedCount === 0}
      >
        รีเซ็ตความจำด่าน
      </button>
    </section>
  </div>
</main>

{#if confirmOpen}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="reset-title"
    tabindex="-1"
    onclick={(e) => {
      if (e.currentTarget === e.target) closeConfirm();
    }}
    onkeydown={onOverlayKeydown}
  >
    <div class="dialog">
      <h2 id="reset-title">รีเซ็ตความจำด่าน?</h2>
      <p>
        การกระทำนี้จะลบประวัติด่านที่ผ่านแล้วทั้งหมด และไม่สามารถย้อนกลับได้
      </p>
      <div class="actions">
        <button class="secondary" onclick={closeConfirm}>ยกเลิก</button>
        <button class="danger solid" onclick={confirmReset}>ยืนยันรีเซ็ต</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .about {
    position: relative;
    min-height: 100vh;
    padding: 2rem 1.5rem 3rem;
    color: var(--ink);
    background: radial-gradient(
        circle at 15% 10%,
        rgba(34, 197, 94, 0.14),
        transparent 42%
      ),
      radial-gradient(
        circle at 90% 85%,
        rgba(246, 201, 21, 0.12),
        transparent 40%
      ),
      var(--cream);
  }
  .back {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 2;
    padding: 0.55rem 1.05rem;
    font: 600 0.85rem var(--font-sans);
    color: var(--forest);
    background: rgba(255, 255, 255, 0.55);
    border: 1.5px solid rgba(13, 42, 26, 0.18);
    border-radius: var(--radius-pill);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }
  .back:hover {
    background: rgba(255, 255, 255, 0.85);
    border-color: var(--forest);
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 40rem;
    margin: 0 auto;
    padding-top: 3rem;
  }
  .hero {
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    margin: 0 0 0.75rem;
    padding: 0.35rem 0.9rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
  }
  h1 {
    margin: 0;
    font-size: clamp(2.5rem, 8vw, 3.75rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--forest);
  }
  h1 .accent {
    color: var(--green);
  }
  .lede {
    margin: 0.85rem auto 0;
    max-width: 28rem;
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.55;
  }
  .card {
    padding: 1.5rem 1.4rem;
    background: rgba(255, 255, 255, 0.55);
    border: 1.5px solid rgba(13, 42, 26, 0.1);
    border-radius: var(--radius-card);
  }
  .card h2 {
    margin: 0 0 0.75rem;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--forest);
  }
  .card p {
    margin: 0 0 0.85rem;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.55;
  }
  .card p:last-of-type {
    margin-bottom: 0;
  }
  .meta {
    display: grid;
    gap: 0.75rem;
    margin: 1.15rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid rgba(13, 42, 26, 0.1);
  }
  .meta div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.35rem 1rem;
  }
  .meta dt {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted-soft);
  }
  .meta dd {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--forest);
  }
  .settings p {
    margin-bottom: 1rem;
  }
  .flash {
    margin: 0 0 0.85rem !important;
    padding: 0.55rem 0.85rem;
    font-size: 0.85rem !important;
    font-weight: 600;
    color: var(--green-strong) !important;
    background: var(--green-soft);
    border-radius: 10px;
  }
  .danger {
    padding: 0.7rem 1.35rem;
    font: 700 0.9rem var(--font-sans);
    color: #9f1239;
    background: #fff1f2;
    border: 1.5px solid #fda4af;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s,
      opacity 0.15s;
  }
  .danger:hover:not(:disabled) {
    background: #ffe4e6;
    border-color: #fb7185;
  }
  .danger:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .danger.solid {
    color: #fff;
    background: #e11d48;
    border-color: #e11d48;
  }
  .danger.solid:hover:not(:disabled) {
    background: #be123c;
    border-color: #be123c;
  }
  .overlay {
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
  .dialog {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 24rem;
    width: 100%;
    padding: 1.75rem 1.5rem;
    text-align: center;
    color: var(--ink);
    background: var(--cream);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-lift);
  }
  .dialog h2 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--forest);
  }
  .dialog p {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem;
  }
  .secondary {
    padding: 0.7rem 1.35rem;
    font: 700 0.9rem var(--font-sans);
    color: var(--forest);
    background: transparent;
    border: 2px solid var(--forest);
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .secondary:hover {
    color: var(--cream);
    background: var(--forest);
  }
</style>
