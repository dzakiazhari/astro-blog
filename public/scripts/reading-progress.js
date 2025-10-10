(function () {
  const CONTAINER_ID = "reading-progress-container";
  const BAR_ID = "reading-progress-bar";

  const state = (window.__readingProgressState =
    window.__readingProgressState || {
      scrollHandler: null,
      pageLoadListenerAttached: false,
    });

  const ensureProgressBarExists = () => {
    let progressContainer = document.getElementById(CONTAINER_ID);
    if (!progressContainer) {
      progressContainer = document.createElement("div");
      progressContainer.id = CONTAINER_ID;
      progressContainer.className =
        "progress-container fixed top-0 z-10 h-1 w-full bg-background";
      document.body.appendChild(progressContainer);
    }

    let progressBar = document.getElementById(BAR_ID);
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = BAR_ID;
      progressBar.className = "progress-bar h-1 w-0 bg-accent";
      progressContainer.appendChild(progressBar);
    }
  };

  const updateProgress = () => {
    const progressBar = document.getElementById(BAR_ID);
    const rootElement = document.documentElement;

    if (!progressBar || !rootElement) {
      return;
    }

    const scrollHeight = rootElement.scrollHeight - rootElement.clientHeight;
    const scrollTop = rootElement.scrollTop;

    let progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    // Round and clamp so the bar reaches a crisp 100%
    progress = Math.round(progress);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    progressBar.style.width = `${progress}%`;
  };

  const initializeProgressIndicator = () => {
    window.requestAnimationFrame(() => {
      ensureProgressBarExists();
      updateProgress();

      if (state.scrollHandler) {
        document.removeEventListener("scroll", state.scrollHandler);
      }

      const handler = () => updateProgress();
      document.addEventListener("scroll", handler, { passive: true });
      state.scrollHandler = handler;
    });
  };

  const registerPageEvents = () => {
    initializeProgressIndicator();
    if (!state.pageLoadListenerAttached) {
      document.addEventListener("astro:page-load", initializeProgressIndicator);
      state.pageLoadListenerAttached = true;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerPageEvents, {
      once: true,
    });
  } else {
    registerPageEvents();
  }
})();
