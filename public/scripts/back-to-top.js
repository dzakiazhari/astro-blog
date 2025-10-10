(function () {
  const state = (window.__backToTopState = window.__backToTopState || {
    scrollHandler: null,
    pageLoadListenerAttached: false,
  });

  const attachListeners = () => {
    const rootElement = document.documentElement;
    const btnContainer = document.querySelector("#btt-btn-container");
    const backToTopBtn = document.querySelector("[data-button='back-to-top']");
    const progressIndicator = document.querySelector("#progress-indicator");

    if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator) {
      return;
    }

    if (state.scrollHandler) {
      document.removeEventListener("scroll", state.scrollHandler);
      state.scrollHandler = null;
    }

    if (backToTopBtn.dataset.clickBound !== "true") {
      backToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
      backToTopBtn.dataset.clickBound = "true";
    }

    let lastVisible = null;
    const handleScroll = () => {
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      const scrollTop = rootElement.scrollTop;
      const scrollPercent =
        scrollTotal > 0 ? Math.floor((scrollTop / scrollTotal) * 100) : 0;

      progressIndicator.style.setProperty(
        "background-image",
        `conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`
      );

      const isVisible = scrollTotal > 0 && scrollTop / scrollTotal > 0.3;

      if (isVisible !== lastVisible) {
        btnContainer.classList.toggle("opacity-100", isVisible);
        btnContainer.classList.toggle("translate-y-0", isVisible);
        btnContainer.classList.toggle("opacity-0", !isVisible);
        btnContainer.classList.toggle("translate-y-14", !isVisible);
        lastVisible = isVisible;
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener("scroll", scrollHandler, { passive: true });
    state.scrollHandler = scrollHandler;

    handleScroll();
  };

  const initialize = () => {
    window.requestAnimationFrame(attachListeners);
  };

  const registerPageEvents = () => {
    initialize();
    if (!state.pageLoadListenerAttached) {
      document.addEventListener("astro:page-load", initialize);
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
