import type { ScrollDetail, ScrollManager } from "./scroll-manager";

const CONTAINER_ID = "btt-btn-container";
const BUTTON_SELECTOR = "[data-button='back-to-top']";
const PROGRESS_SELECTOR = "#progress-indicator";
const VISIBILITY_THRESHOLD = 0.3;

const toggleVisibility = (
  container: HTMLElement,
  isVisible: boolean,
  lastVisible: boolean | null
): boolean => {
  if (isVisible === lastVisible) {
    return lastVisible;
  }

  container.classList.toggle("opacity-100", isVisible);
  container.classList.toggle("translate-y-0", isVisible);
  container.classList.toggle("opacity-0", !isVisible);
  container.classList.toggle("translate-y-16", !isVisible);

  return isVisible;
};

const updateProgress = (
  indicator: HTMLElement,
  progress: number,
  lastProgress: number | null
): number => {
  if (progress === lastProgress) {
    return lastProgress;
  }

  indicator.style.setProperty("--progress", `${progress}%`);
  return progress;
};

const applyProgress = (
  detail: ScrollDetail,
  container: HTMLElement,
  indicator: HTMLElement,
  state: { lastVisible: boolean | null; lastProgress: number | null }
) => {
  const { progress, scrollHeight, scrollTop } = detail;

  state.lastProgress = updateProgress(indicator, progress, state.lastProgress);

  const isVisible =
    scrollHeight > 0 && scrollTop / scrollHeight > VISIBILITY_THRESHOLD;
  state.lastVisible = toggleVisibility(container, isVisible, state.lastVisible);
};

export const initBackToTop = (manager: ScrollManager): (() => void) | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const container = document.getElementById(CONTAINER_ID) as HTMLElement | null;
  const button = document.querySelector(
    BUTTON_SELECTOR
  ) as HTMLButtonElement | null;
  const indicator = document.querySelector(
    PROGRESS_SELECTOR
  ) as HTMLElement | null;

  if (!container || !button || !indicator) {
    return null;
  }

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  button.addEventListener("click", handleClick, { once: false });

  const state = { lastVisible: null, lastProgress: null };

  const unsubscribe = manager.subscribe(detail => {
    applyProgress(detail, container, indicator, state);
  });

  const cleanup = () => {
    unsubscribe();
    button.removeEventListener("click", handleClick);
    indicator.style.removeProperty("--progress");
  };

  return cleanup;
};
