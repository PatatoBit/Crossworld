<script lang="ts">
  /** Animated glyph for the navigation / input tutorial gestures. */
  let {
    kind,
  }: {
    kind: "rotate" | "zoom" | "click" | "type" | "dblclick";
  } = $props();
</script>

{#if kind === "type"}
  <div class="hint type" aria-hidden="true">
    <div class="keys">
      <span class="key k1">A</span>
      <span class="key k2">B</span>
      <span class="key k3">C</span>
    </div>
  </div>
{:else}
  <div
    class="hint"
    class:rotate={kind === "rotate"}
    class:zoom={kind === "zoom"}
    class:click={kind === "click"}
    class:dblclick={kind === "dblclick"}
    aria-hidden="true"
  >
    <svg class="mouse" viewBox="0 0 64 96" fill="none">
      <rect
        class="body"
        x="8"
        y="4"
        width="48"
        height="80"
        rx="24"
        stroke="currentColor"
        stroke-width="3.5"
      />
      <line
        class="seam"
        x1="32"
        y1="4"
        x2="32"
        y2="36"
        stroke="currentColor"
        stroke-width="3"
      />
      <rect
        class="wheel"
        x="28"
        y="16"
        width="8"
        height="14"
        rx="4"
        fill="currentColor"
      />
      {#if kind === "rotate" || kind === "click" || kind === "dblclick"}
        <path
          class="btn-l"
          d="M8 28 V28 A24 24 0 0 1 32 4 V36 H8 Z"
          fill="currentColor"
          opacity="0.35"
        />
      {/if}
    </svg>

    {#if kind === "rotate"}
      <svg class="trail" viewBox="0 0 120 120" fill="none">
        <path
          class="arc"
          d="M 28 78 C 18 52, 32 22, 60 18 C 92 14, 108 42, 98 70"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="6 8"
        />
        <path
          class="arrow"
          d="M 90 66 L 100 72 L 88 78"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {:else if kind === "zoom"}
      <div class="scroll-arrows">
        <span class="up">▴</span>
        <span class="down">▾</span>
      </div>
    {:else if kind === "click"}
      <div class="clicks">
        <span class="pulse p1"></span>
      </div>
    {:else}
      <div class="clicks">
        <span class="pulse p1"></span>
        <span class="pulse p2"></span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .hint {
    --ease: cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
    margin-inline: auto;
    color: #6ec4b8;
    display: grid;
    place-items: center;
  }

  .mouse {
    width: 2.75rem;
    height: auto;
    z-index: 1;
    filter: drop-shadow(0 4px 12px rgba(12, 28, 44, 0.35));
  }

  .rotate .mouse {
    animation: drag-orbit 1.8s var(--ease) infinite;
  }

  .zoom .wheel {
    transform-origin: 32px 23px;
    animation: wheel-roll 1.4s var(--ease) infinite;
  }

  .zoom .mouse {
    animation: bob 1.4s var(--ease) infinite;
  }

  .click .btn-l {
    animation: click-flash-once 1.5s var(--ease) infinite;
  }

  .click .mouse {
    animation: click-press-once 1.5s var(--ease) infinite;
  }

  .dblclick .btn-l {
    animation: click-flash 1.5s var(--ease) infinite;
  }

  .dblclick .mouse {
    animation: click-press 1.5s var(--ease) infinite;
  }

  .trail {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: rgba(110, 196, 184, 0.7);
    animation: trail-fade 1.8s var(--ease) infinite;
  }

  .scroll-arrows {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    translate: 0 -50%;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.95rem;
    color: #e8e4d9;
    line-height: 1;
  }

  .scroll-arrows .up {
    animation: arrow-nudge 1.4s var(--ease) infinite;
  }

  .scroll-arrows .down {
    animation: arrow-nudge 1.4s var(--ease) infinite 0.2s;
    opacity: 0.55;
  }

  .clicks {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse {
    position: absolute;
    left: 50%;
    top: 42%;
    width: 1.1rem;
    height: 1.1rem;
    margin: -0.55rem 0 0 -0.55rem;
    border-radius: 50%;
    border: 2px solid #e8e4d9;
    opacity: 0;
  }

  .p1 {
    animation: ripple 1.5s var(--ease) infinite;
  }

  .click .p1 {
    animation: ripple-once 1.5s var(--ease) infinite;
  }

  .p2 {
    animation: ripple 1.5s var(--ease) infinite 0.22s;
  }

  .type .keys {
    display: flex;
    gap: 0.45rem;
    align-items: flex-end;
  }

  .key {
    display: grid;
    place-items: center;
    width: 2.15rem;
    height: 2.15rem;
    font: 800 0.95rem var(--font-sans);
    color: #0c1c2c;
    background: #e8e4d9;
    border-radius: 0.45rem;
    box-shadow:
      0 3px 0 #9aa3ad,
      0 6px 14px rgba(4, 12, 24, 0.35);
    transform-origin: center bottom;
  }

  .k1 {
    animation: key-press 1.6s var(--ease) infinite;
  }

  .k2 {
    animation: key-press 1.6s var(--ease) infinite 0.35s;
  }

  .k3 {
    animation: key-press 1.6s var(--ease) infinite 0.7s;
  }

  @keyframes drag-orbit {
    0%,
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(10px, -6px) rotate(-8deg);
    }
    50% {
      transform: translate(0, -12px) rotate(0deg);
    }
    75% {
      transform: translate(-10px, -6px) rotate(8deg);
    }
  }

  @keyframes trail-fade {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes wheel-roll {
    0%,
    100% {
      transform: translateY(0);
      opacity: 1;
    }
    40% {
      transform: translateY(5px);
      opacity: 0.55;
    }
    70% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  @keyframes bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(3px);
    }
  }

  @keyframes arrow-nudge {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.45;
    }
    50% {
      transform: translateY(-3px);
      opacity: 1;
    }
  }

  @keyframes click-press {
    0%,
    12%,
    28%,
    40%,
    100% {
      transform: scale(1);
    }
    6%,
    34% {
      transform: scale(0.92);
    }
  }

  @keyframes click-flash {
    0%,
    12%,
    28%,
    40%,
    100% {
      opacity: 0.2;
    }
    6%,
    34% {
      opacity: 0.7;
    }
  }

  @keyframes click-press-once {
    0%,
    18%,
    100% {
      transform: scale(1);
    }
    8% {
      transform: scale(0.92);
    }
  }

  @keyframes click-flash-once {
    0%,
    18%,
    100% {
      opacity: 0.2;
    }
    8% {
      opacity: 0.7;
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0.4);
      opacity: 0.85;
    }
    70%,
    100% {
      transform: scale(2.2);
      opacity: 0;
    }
  }

  @keyframes ripple-once {
    0%,
    8% {
      transform: scale(0.4);
      opacity: 0;
    }
    12% {
      transform: scale(0.4);
      opacity: 0.85;
    }
    70%,
    100% {
      transform: scale(2.2);
      opacity: 0;
    }
  }

  @keyframes key-press {
    0%,
    100% {
      transform: translateY(0);
      box-shadow:
        0 3px 0 #9aa3ad,
        0 6px 14px rgba(4, 12, 24, 0.35);
      background: #e8e4d9;
    }
    18%,
    32% {
      transform: translateY(3px);
      box-shadow:
        0 0 0 #9aa3ad,
        0 2px 8px rgba(4, 12, 24, 0.25);
      background: #6ec4b8;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mouse,
    .trail,
    .wheel,
    .scroll-arrows .up,
    .scroll-arrows .down,
    .btn-l,
    .pulse,
    .key {
      animation: none !important;
    }
  }
</style>
