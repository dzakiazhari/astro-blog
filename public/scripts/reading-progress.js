(function () {
  const CONTAINER_ID = "reading-progress-container";
  const BAR_ID = "reading-progress-bar";

  const state = (window.__readingProgressState =
    window.__readingProgressState || {
      unsubscribe: null,
      pageLoadListenerAttached: false,
    });

  const scheduleIdle = callback => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => callback(), { timeout: 300 });
    } else {
      window.setTimeout(callback, 120);
    }
  };

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

  const updateBar = progress => {
    const progressBar = document.getElementById(BAR_ID);
    if (!progressBar) return;
    progressBar.style.width = `${progress}%`;
  };

  const initializeProgressIndicator = () => {
    window.requestAnimationFrame(() => {
      ensureProgressBarExists();

      if (state.unsubscribe) {
        state.unsubscribe();
        state.unsubscribe = null;
      }

      const manager = window.__scrollManager;
      if (!manager) {
        return;
      }

      state.unsubscribe = manager.subscribe(detail => {
        updateBar(detail.progress);
      });
    });
  };

  const queueInitialization = () => {
    scheduleIdle(() => {
      initializeProgressIndicator();
    });
  };

  const registerPageEvents = () => {
    queueInitialization();
    if (!state.pageLoadListenerAttached) {
      document.addEventListener("astro:page-load", queueInitialization);
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
