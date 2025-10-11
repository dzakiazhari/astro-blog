import { ensureScrollManager } from "@/scripts/scroll-manager";
import { initBackToTop } from "@/scripts/back-to-top";
import { initReadingProgress } from "@/scripts/reading-progress";

let cleanupFns: Array<() => void> = [];
let pendingIdle: ReturnType<typeof setTimeout> | number | null = null;

const disposeAll = () => {
  for (const cleanup of cleanupFns) {
    try {
      cleanup();
    } catch {}
  }
  cleanupFns = [];
};

const runEnhancements = () => {
  disposeAll();

  const manager = ensureScrollManager();
  if (!manager) {
    return;
  }

  const cleanups = [initReadingProgress(manager), initBackToTop(manager)].filter(
    Boolean
  ) as Array<() => void>;

  if (cleanups.length > 0) {
    cleanupFns = cleanups;
    manager.refresh();
  }
};

const queueIdle = () => {
  if (pendingIdle !== null) {
    if ("cancelIdleCallback" in window) {
      (window as any).cancelIdleCallback(pendingIdle);
    } else {
      clearTimeout(pendingIdle as ReturnType<typeof setTimeout>);
    }
    pendingIdle = null;
  }

  if ("requestIdleCallback" in window) {
    pendingIdle = (window as any).requestIdleCallback(
      () => {
        pendingIdle = null;
        runEnhancements();
      },
      { timeout: 300 }
    );
  } else {
    pendingIdle = setTimeout(() => {
      pendingIdle = null;
      runEnhancements();
    }, 120);
  }
};

const setup = () => {
  queueIdle();
};

// Initial run
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup, { once: true });
} else {
  setup();
}

// Re-run after Astro client router navigations
document.addEventListener("astro:page-load", () => {
  queueIdle();
});

// Cleanup before page is swapped or hidden
const cleanupHandler = () => {
  if (pendingIdle !== null) {
    if ("cancelIdleCallback" in window) {
      (window as any).cancelIdleCallback(pendingIdle);
    } else {
      clearTimeout(pendingIdle as ReturnType<typeof setTimeout>);
    }
    pendingIdle = null;
  }
  disposeAll();
};

document.addEventListener("astro:before-swap", cleanupHandler);
window.addEventListener("pagehide", cleanupHandler);
