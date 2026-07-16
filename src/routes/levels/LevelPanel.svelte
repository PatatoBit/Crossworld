<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { levels, type Level } from "$lib/levels";
  import { LEVEL_ANCHORS } from "$lib/globe/levelContinents";
  import { progress } from "$lib/progress.svelte";

  let {
    activeId = null,
    hoveredId = null,
    onHover = (_id: string | null) => {},
    onSelect = (_id: string) => {},
    itemRefs = $bindable<Record<string, HTMLElement | undefined>>({}),
    panelEl = $bindable<HTMLElement | undefined>(),
  }: {
    activeId?: string | null;
    hoveredId?: string | null;
    onHover?: (id: string | null) => void;
    onSelect?: (id: string) => void;
    itemRefs?: Record<string, HTMLElement | undefined>;
    panelEl?: HTMLElement | undefined;
  } = $props();

  const continentLevels = levels.filter((l) => l.id in LEVEL_ANCHORS);
  const otherLevels = levels.filter((l) => !(l.id in LEVEL_ANCHORS));

  const completedCount = $derived(progress.completedCount);
  const totalCount = $derived(progress.totalCount);
  const progressPct = $derived(Math.round(progress.fraction * 100));

  function isHighlighted(level: Level): boolean {
    return level.id === activeId || level.id === hoveredId;
  }

  function levelNumber(level: Level): string {
    const idx = levels.findIndex((l) => l.id === level.id);
    return String(Math.max(0, idx)).padStart(2, "0");
  }

  function statusLabel(level: Level): string {
    if (progress.isComplete(level.id)) return "ผ่านแล้ว";
    if (level.puzzle) return "เล่น ▸";
    return "เร็ว ๆ นี้";
  }

  function handleClick(level: Level) {
    onSelect(level.id);
    if (level.puzzle) goto(`${base}/play/${level.id}`);
  }

  function itemRef(node: HTMLElement, levelId: string) {
    itemRefs[levelId] = node;
    return {
      destroy() {
        delete itemRefs[levelId];
      },
    };
  }
</script>

<aside class="panel" bind:this={panelEl}>
  <header>
    <h1>เลือกทวีป</h1>
    <p class="hint">ชี้หรือคลิกทวีปบนลูกโลก หรือเลือกจากรายการ</p>
    <div
      class="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalCount}
      aria-valuenow={completedCount}
      aria-label="ความคืบหน้าด่าน"
    >
      <div class="progress-meta">
        <span class="progress-label">ความคืบหน้า</span>
        <span class="progress-count">{completedCount}/{totalCount} ด่าน</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style:width="{progressPct}%"></div>
      </div>
    </div>
  </header>

  {#if otherLevels.length > 0}
    <section>
      <h2>อื่น ๆ</h2>
      <ul>
        {#each otherLevels as level (level.id)}
          <li>
            <button
              use:itemRef={level.id}
              class:active={isHighlighted(level)}
              class:done={progress.isComplete(level.id)}
              onclick={() => handleClick(level)}
              onpointerenter={() => onHover(level.id)}
              onpointerleave={() => onHover(null)}
            >
              <span class="num">{levelNumber(level)}</span>
              <span class="copy">
                <span class="name">{level.name}</span>
                <span class="blurb">{level.blurb}</span>
              </span>
              <span class="status">{statusLabel(level)}</span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <section>
    <h2>ทวีป</h2>
    <ul>
      {#each continentLevels as level (level.id)}
        <li>
          <button
            use:itemRef={level.id}
            class:active={isHighlighted(level)}
            class:done={progress.isComplete(level.id)}
            class:locked={level.puzzle === null}
            onclick={() => handleClick(level)}
            onpointerenter={() => onHover(level.id)}
            onpointerleave={() => onHover(null)}
          >
            <span class="num">{levelNumber(level)}</span>
            <span class="copy">
              <span class="name">{level.name}</span>
              <span class="blurb">{level.blurb}</span>
            </span>
            <span class="status">{statusLabel(level)}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>
</aside>

<style>
  .panel {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    bottom: 1.25rem;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: min(340px, calc(100vw - 2.5rem));
    padding: 1.5rem 1.25rem;
    overflow-y: auto;
    color: var(--ink);
    background: var(--cream);
    border: 1px solid rgba(13, 42, 26, 0.08);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-lift);
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    .panel {
      top: auto;
      left: 1.25rem;
      right: 1.25rem;
      bottom: 1.25rem;
      width: auto;
      height: min(42vh, 280px);
      gap: 0.85rem;
      padding: 1.1rem 1rem;
    }
  }
  header {
    flex-shrink: 0;
  }
  h1 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--forest);
  }
  .hint {
    margin: 0.45rem 0 0;
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--muted);
  }
  .progress {
    margin-top: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
  }
  .progress-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--green-strong);
  }
  .progress-count {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--forest);
  }
  .progress-track {
    height: 0.45rem;
    overflow: hidden;
    background: var(--cream-soft);
    border: 1px solid rgba(13, 42, 26, 0.08);
    border-radius: var(--radius-pill);
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--green), var(--green-strong));
    border-radius: inherit;
    transition: width 0.35s ease;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  h2 {
    margin: 0;
    align-self: flex-start;
    padding: 0.25rem 0.7rem;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--green-strong);
    background: var(--green-soft);
    border-radius: var(--radius-pill);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  li button {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.65rem 0.75rem;
    text-align: left;
    color: inherit;
    font: inherit;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.85rem;
    transition:
      background 0.12s ease,
      border-color 0.12s ease;
  }
  li button:hover {
    background: rgba(13, 42, 26, 0.05);
  }
  li button.active {
    background: var(--green-soft);
    border-color: rgba(22, 163, 74, 0.35);
  }
  li button.done:not(.active) {
    background: rgba(34, 197, 94, 0.08);
  }
  li button.locked .status {
    color: var(--muted);
    background: var(--cream-soft);
  }
  li button.done .status {
    color: var(--green-strong);
    background: var(--green-soft);
  }
  .num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    height: 1.75rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--forest);
    background: var(--yellow);
    border-radius: var(--radius-pill);
  }
  li button.active .num,
  li button.done .num {
    color: #fff;
    background: var(--green);
  }
  .copy {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--forest);
  }
  .blurb {
    font-size: 0.78rem;
    line-height: 1.4;
    color: var(--muted);
  }
  li button.active .name {
    color: var(--forest);
  }
  .status {
    flex-shrink: 0;
    padding: 0.28rem 0.65rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: #fff;
    background: var(--green);
    border-radius: var(--radius-pill);
  }
</style>
