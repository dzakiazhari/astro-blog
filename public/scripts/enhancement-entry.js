(function () {
  const scripts = [
    "/scripts/scroll-manager.js",
    "/scripts/reading-progress.js",
    "/scripts/back-to-top.js",
  ];

  const scheduleIdle = callback => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 800 });
    } else {
      window.setTimeout(callback, 260);
    }
  };

  window.__scheduleIdle = window.__scheduleIdle || scheduleIdle;

  const loadScript = src =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[data-enhancement-src="${src}"]`
      );

      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.dataset.enhancementSrc = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const loadAll = async () => {
    if (window.__enhancementsLoading) {
      return window.__enhancementsLoading;
    }

    window.__enhancementsLoading = (async () => {
      for (const src of scripts) {
        await loadScript(src);
      }
    })();

    return window.__enhancementsLoading;
  };

  const triggerLoad = () => {
    scheduleIdle(() => {
      void loadAll();
    });
  };

  const interactionEvents = ["pointermove", "touchstart", "keydown"];
  const onFirstInteraction = () => {
    triggerLoad();
    interactionEvents.forEach(event =>
      window.removeEventListener(event, onFirstInteraction)
    );
    window.removeEventListener("scroll", onFirstInteraction);
  };

  interactionEvents.forEach(event =>
    window.addEventListener(event, onFirstInteraction, {
      once: true,
      passive: true,
    })
  );

  window.addEventListener("scroll", onFirstInteraction, {
    once: true,
    passive: true,
  });

  if (document.readyState === "complete") {
    triggerLoad();
  } else {
    window.addEventListener(
      "load",
      () => {
        triggerLoad();
      },
      { once: true }
    );
  }

  document.addEventListener("astro:page-load", () => {
    triggerLoad();
  });
})();
