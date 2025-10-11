import { ensureScrollManager } from "@/scripts/scroll-manager";
import { initBackToTop } from "@/scripts/back-to-top";
import { initReadingProgress } from "@/scripts/reading-progress";

type IdleHandle = number;

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => IdleHandle;
  cancelIdleCallback?: (handle: IdleHandle) => void;
};

let cleanupFns: Array<() => void> = [];
let pendingIdle: IdleHandle | ReturnType<typeof setTimeout> | null = null;

const getIdleWindow = (): IdleWindow | undefined =>
  typeof window !== "undefined" ? (window as IdleWindow) : undefined;

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

  const cleanups = [
    initReadingProgress(manager),
    initBackToTop(manager),
  ].filter(Boolean) as Array<() => void>;

  if (cleanups.length > 0) {
    cleanupFns = cleanups;
    manager.refresh();
  }
};

const queueIdle = () => {
  if (pendingIdle !== null) {
    const idleWindow = getIdleWindow();

    if (idleWindow?.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(pendingIdle as IdleHandle);
    } else if (typeof window !== "undefined") {
      clearTimeout(pendingIdle as ReturnType<typeof setTimeout>);
    }
    pendingIdle = null;
  }

  const idleWindow = getIdleWindow();

  if (idleWindow?.requestIdleCallback) {
    pendingIdle = idleWindow.requestIdleCallback(
      () => {
        pendingIdle = null;
        runEnhancements();
      },
      { timeout: 300 }
    );
    return;
  }

  if (typeof window === "undefined") {
    runEnhancements();
    return;
  }

  pendingIdle = window.setTimeout(() => {
    pendingIdle = null;
    runEnhancements();
  }, 120);
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
    const idleWindow = getIdleWindow();

    if (idleWindow?.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(pendingIdle as IdleHandle);
    } else if (typeof window !== "undefined") {
      clearTimeout(pendingIdle as ReturnType<typeof setTimeout>);
    }
    pendingIdle = null;
  }
  disposeAll();
};

document.addEventListener("astro:before-swap", cleanupHandler);
window.addEventListener("pagehide", cleanupHandler);
