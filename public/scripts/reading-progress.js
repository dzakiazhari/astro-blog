(function () {
  const CONTAINER_ID = "reading-progress-container";
  const BAR_ID = "reading-progress-bar";

  const ensureProgressBarExists = () => {
    if (document.getElementById(CONTAINER_ID)) {
      return;
    }

    const progressContainer = document.createElement("div");
    progressContainer.id = CONTAINER_ID;
    progressContainer.className =
      "progress-container fixed top-0 z-10 h-1 w-full bg-background";

    const progressBar = document.createElement("div");
    progressBar.id = BAR_ID;
    progressBar.className = "progress-bar h-1 w-0 bg-accent";

    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
  };

  const updateProgress = () => {
    const progressBar = document.getElementById(BAR_ID);
    const rootElement = document.documentElement;

    if (!progressBar || !rootElement) {
      return;
    }

    const scrollHeight = rootElement.scrollHeight - rootElement.clientHeight;
    const scrollTop = rootElement.scrollTop;

    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  const initializeProgressIndicator = () => {
    if (window.__progressIndicatorInitialized) {
      return;
    }

    window.__progressIndicatorInitialized = true;
    ensureProgressBarExists();
    updateProgress();

    document.addEventListener("scroll", updateProgress, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProgressIndicator, {
      once: true,
    });
  } else {
    initializeProgressIndicator();
  }
})();
