(function () {
  const state = (window.__backToTopState = window.__backToTopState || {
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

  const attachListeners = () => {
    const rootElement = document.documentElement;
    const btnContainer = document.querySelector("#btt-btn-container");
    const backToTopBtn = document.querySelector("[data-button='back-to-top']");
    const progressIndicator = document.querySelector("#progress-indicator");

    if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator) {
      return;
    }

    if (backToTopBtn.dataset.clickBound !== "true") {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      backToTopBtn.dataset.clickBound = "true";
    }

    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
    }

    let lastVisible = null;

    const applyProgress = detail => {
      const { progress, scrollHeight, scrollTop } = detail;
      progressIndicator.style.setProperty("--progress", `${progress}%`);

      const isVisible = scrollHeight > 0 && scrollTop / scrollHeight > 0.3;

      if (isVisible !== lastVisible) {
        btnContainer.classList.toggle("opacity-100", isVisible);
        btnContainer.classList.toggle("translate-y-0", isVisible);
        btnContainer.classList.toggle("opacity-0", !isVisible);
        btnContainer.classList.toggle("translate-y-16", !isVisible);
        lastVisible = isVisible;
      }
    };

    const manager = window.__scrollManager;
    if (!manager) {
      return;
    }

    state.unsubscribe = manager.subscribe(applyProgress);
  };

  const initialize = () => {
    window.requestAnimationFrame(attachListeners);
  };

  const registerPageEvents = () => {
    scheduleIdle(() => {
      initialize();
    });
    if (!state.pageLoadListenerAttached) {
      document.addEventListener("astro:page-load", () => {
        scheduleIdle(() => {
          initialize();
        });
      });
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
