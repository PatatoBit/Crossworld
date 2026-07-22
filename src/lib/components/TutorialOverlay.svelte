<script lang="ts">
  import { navTutorial, type NavTutorialStep } from "$lib/tutorial.svelte";
  import MouseHint from "./MouseHint.svelte";

  const STEPS = ["rotate", "zoom", "select", "type", "intersect"] as const;

  const copy: Record<
    Exclude<NavTutorialStep, null>,
    {
      eyebrow: string;
      title: string;
      body: string;
      hint?: "rotate" | "zoom" | "click" | "type" | "dblclick";
      cta?: string;
    }
  > = {
    intro: {
      eyebrow: "แนะนำการเล่น",
      title: "เรียนรู้วิธีการเล่น CrossWorld",
      body: "การหมุน ซูม พิมพ์ และเปลี่ยนแถว",
      cta: "เริ่มเรียน",
    },
    rotate: {
      eyebrow: "1/5",
      title: "ลากเมาส์เพื่อหมุน",
      body: "กดแล้วลากเมาส์ เพื่อหมุนกล้องรอบเกม",
      hint: "rotate",
    },
    zoom: {
      eyebrow: "2/5",
      title: "ซูมเข้า–ออก",
      body: "เลื่อนล้อเมาส์ เพื่อซูมเข้าหรือออก",
      hint: "zoom",
    },
    select: {
      eyebrow: "3/5",
      title: "คลิกช่องเพื่อเลือก",
      body: "คลิ๊กบนช่องใดช่องหนึ่ง เพื่อเลือกแถวที่จะพิมพ์",
      hint: "click",
    },
    type: {
      eyebrow: "4/5",
      title: "พิมพ์ตัวอักษร",
      body: "พิมพ์บนแป้นคีย์บอร์ดเพื่อใส่คำตอบ",
      hint: "type",
    },
    intersect: {
      eyebrow: "5/5",
      title: "คลิกสองรอบ บนช่องที่อยู่บนสองแถว",
      body: "เพื่อสลับไปยังแถวที่ตัดผ่านช่องนั้น",
      hint: "dblclick",
    },
    done: {
      eyebrow: "พร้อมแล้ว",
      title: "จบการสอน",
      body: "เริ่มไขปริศนากันได้เลย",
      cta: "เริ่มเล่น",
    },
  };

  const step = $derived(navTutorial.step);
  const content = $derived(step ? copy[step] : null);

  const progressIndex = $derived.by(() => {
    if (!step || step === "intro" || step === "done") return -1;
    return (STEPS as readonly string[]).indexOf(step);
  });

  function onCta() {
    if (step === "intro") navTutorial.advance();
    else if (step === "done") navTutorial.finish();
  }
</script>

{#if content && step}
  <div class="overlay" role="dialog" aria-labelledby="tutorial-title">
    {#key step}
      <div class="card" class:celebrate={step === "done"}>
        {#if content.hint}
          <MouseHint kind={content.hint} />
        {/if}

        <p class="eyebrow">{content.eyebrow}</p>
        <h2 id="tutorial-title">{content.title}</h2>
        <p class="body">{content.body}</p>

        {#if progressIndex >= 0}
          <div class="dots" aria-hidden="true">
            {#each STEPS as _, i}
              <span
                class="dot"
                class:on={i <= progressIndex}
                class:now={i === progressIndex}
              ></span>
            {/each}
          </div>
        {/if}

        <div class="actions">
          {#if content.cta}
            <button class="primary" onclick={onCta}>{content.cta}</button>
          {/if}
          {#if step !== "done"}
            <button class="skip" onclick={() => navTutorial.skip()}>ข้าม</button
            >
          {/if}
        </div>
      </div>
    {/key}
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    inset: 0;
    z-index: 8;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1.25rem 1.25rem 1.75rem;
    pointer-events: none;
    background: linear-gradient(
      to top,
      rgba(8, 18, 32, 0.72) 0%,
      rgba(8, 18, 32, 0.2) 42%,
      transparent 70%
    );
    animation: fade-in 280ms cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  .card {
    pointer-events: auto;
    width: min(26rem, 100%);
    padding: 1.35rem 1.4rem 1.2rem;
    border-radius: 1.15rem;
    background: rgba(12, 28, 44, 0.88);
    color: #e8e4d9;
    border: 1px solid rgba(232, 228, 217, 0.14);
    backdrop-filter: blur(12px);
    box-shadow: 0 16px 40px rgba(4, 12, 24, 0.45);
    text-align: center;
    animation: rise-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  .card.celebrate {
    border-color: rgba(110, 196, 184, 0.45);
  }

  .eyebrow {
    margin: 0.35rem 0 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6ec4b8;
  }

  h2 {
    margin: 0.35rem 0 0;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #f4f2e6;
  }

  .body {
    margin: 0.55rem 0 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: rgba(232, 228, 217, 0.82);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1rem;
  }

  .dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: rgba(232, 228, 217, 0.25);
    transition:
      background 200ms ease,
      transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .dot.on {
    background: rgba(110, 196, 184, 0.55);
  }

  .dot.now {
    background: #6ec4b8;
    transform: scale(1.35);
  }

  .wait {
    margin: 0.65rem 0 0;
    font-size: 0.8rem;
    color: rgba(232, 228, 217, 0.55);
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    margin-top: 1rem;
  }

  .primary {
    padding: 0.7rem 1.6rem;
    font: 700 0.95rem var(--font-sans);
    color: #0c1c2c;
    background: #6ec4b8;
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition:
      transform 150ms ease,
      background 150ms ease;
  }

  .primary:hover {
    transform: translateY(-1px);
    background: #7fd4c8;
  }

  .primary:active {
    transform: translateY(0);
  }

  .skip {
    padding: 0.35rem 0.75rem;
    font: 600 0.8rem var(--font-sans);
    color: rgba(232, 228, 217, 0.55);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 150ms ease;
  }

  .skip:hover {
    color: #e8e4d9;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes rise-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .card,
    .primary {
      animation: none;
      transition: none;
    }
  }
</style>
