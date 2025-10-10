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
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      backToTopBtn.dataset.clickBound = "true";
    }

    let lastVisible = null;
    const handleScroll = () => {
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      const scrollTop = rootElement.scrollTop;
      let percent = scrollTotal > 0 ? (scrollTop / scrollTotal) * 100 : 0;
      percent = Math.round(percent);
      if (percent > 100) percent = 100;
      if (percent < 0) percent = 0;

      // Use CSS variable for ring fill to allow layered backgrounds (as %)
      progressIndicator.style.setProperty("--progress", `${percent}%`);

      const isVisible = scrollTotal > 0 && scrollTop / scrollTotal > 0.3;

      if (isVisible !== lastVisible) {
        btnContainer.classList.toggle("opacity-100", isVisible);
        btnContainer.classList.toggle("translate-y-0", isVisible);
        btnContainer.classList.toggle("opacity-0", !isVisible);
        btnContainer.classList.toggle("translate-y-16", !isVisible);
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
