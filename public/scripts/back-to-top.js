(function () {
  const initializeBackToTop = () => {
    const rootElement = document.documentElement;
    const btnContainer = document.querySelector("#btt-btn-container");
    const backToTopBtn = document.querySelector("[data-button='back-to-top']");
    const progressIndicator = document.querySelector("#progress-indicator");

    if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator) {
      return;
    }

    if (btnContainer.dataset.initialized === "true") {
      return;
    }
    btnContainer.dataset.initialized = "true";

    backToTopBtn.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

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
    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    handleScroll();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBackToTop, {
      once: true,
    });
  } else {
    initializeBackToTop();
  }
})();
