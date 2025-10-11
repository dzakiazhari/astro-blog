import type { ScrollManager } from "./scroll-manager";

const CONTAINER_ID = "reading-progress-container";
const BAR_ID = "reading-progress-bar";

const ensureProgressElements = (): {
  container: HTMLElement | null;
  bar: HTMLElement | null;
} => {
  let container = document.getElementById(CONTAINER_ID) as HTMLElement | null;

  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.className = "progress-container fixed top-0 z-10 h-1 w-full bg-background";
    document.body.appendChild(container);
  }

  let bar = document.getElementById(BAR_ID) as HTMLElement | null;

  if (!bar) {
    bar = document.createElement("div");
    bar.id = BAR_ID;
    bar.className = "progress-bar h-1 w-0 bg-accent";
    container.appendChild(bar);
  }

  return { container, bar };
};

export const initReadingProgress = (
  manager: ScrollManager
): (() => void) | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const { bar } = ensureProgressElements();

  if (!bar) {
    return null;
  }

  let lastProgress: number | null = null;

  const apply = (progress: number) => {
    if (progress === lastProgress) {
      return;
    }

    bar.style.width = `${progress}%`;
    lastProgress = progress;
  };

  const unsubscribe = manager.subscribe(detail => {
    apply(detail.progress);
  });

  const cleanup = () => {
    unsubscribe();
    bar.style.width = "0%";
    lastProgress = null;
  };

  return cleanup;
};
