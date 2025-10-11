(function () {
  const state = (window.__giscusLoader = window.__giscusLoader || {
    root: null,
    config: null,
    observer: null,
    loaded: false,
    detachTheme: null,
    currentIdentifier: null,
  });

  const scheduleIdle = callback => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 300 });
    } else {
      window.setTimeout(callback, 120);
    }
  };

  const parseConfig = root => {
    const script = root.querySelector("[data-giscus-config]");
    if (!script?.textContent) return null;

    try {
      const parsed = JSON.parse(script.textContent);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  };

  const preferredTheme = () => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const selectThemeName = config =>
    preferredTheme() === "dark" ? config.darkTheme : config.lightTheme;

  const postThemeMessage = (root, themeName) => {
    const iframe = root.querySelector("iframe.giscus-frame");
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: themeName,
          },
        },
      },
      "https://giscus.app"
    );
  };

  const hidePlaceholder = root => {
    root.querySelector("[data-giscus-placeholder]")?.classList.add("hidden");
    root.querySelector("[data-giscus-load]")?.classList.add("hidden");
  };

  const showPlaceholder = root => {
    root.querySelector("[data-giscus-placeholder]")?.classList.remove("hidden");
    root.querySelector("[data-giscus-load]")?.classList.remove("hidden");
  };

  const detachThemeListeners = () => {
    if (typeof state.detachTheme === "function") {
      state.detachTheme();
      state.detachTheme = null;
    }
  };

  const detachObserver = () => {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
  };

  const teardown = root => {
    if (!root) return;
    detachThemeListeners();
    detachObserver();
    root.querySelector("iframe.giscus-frame")?.remove();
    root
      .querySelectorAll("script[data-giscus-instance]")
      .forEach(node => node.remove());
    state.loaded = false;
    showPlaceholder(root);
  };

  const attachThemeListeners = (root, config) => {
    detachThemeListeners();

    const cleanups = [];

    const update = () => {
      scheduleIdle(() => {
        postThemeMessage(root, selectThemeName(config));
      });
    };

    const themeButton = document.querySelector("#theme-btn");
    if (themeButton) {
      const handler = () => update();
      themeButton.addEventListener("click", handler);
      cleanups.push(() => themeButton.removeEventListener("click", handler));
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      update();
    };
    mediaQuery.addEventListener("change", onMediaChange);
    cleanups.push(() =>
      mediaQuery.removeEventListener("change", onMediaChange)
    );

    document.addEventListener("astro:after-swap", update);
    cleanups.push(() =>
      document.removeEventListener("astro:after-swap", update)
    );

    state.detachTheme = () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  };

  const setAttributes = (element, attributes) => {
    for (const [key, value] of Object.entries(attributes)) {
      if (value == null) continue;
      const attrName =
        "data-" + key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
      element.setAttribute(attrName, String(value));
    }
  };

  const loadDiscussion = (root, config) => {
    if (state.loaded) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.giscusInstance = "true";

    setAttributes(script, {
      ...config,
      term: root.dataset.identifier || config.term,
      theme: selectThemeName(config),
    });

    hidePlaceholder(root);
    root.appendChild(script);
    state.loaded = true;

    scheduleIdle(() => {
      postThemeMessage(root, selectThemeName(config));
    });
  };

  const ensureLoaded = (root, config) => {
    if (!config) return;
    loadDiscussion(root, config);
  };

  const ensureObserver = root => {
    detachObserver();

    state.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ensureLoaded(root, state.config);
          }
        }
      },
      { rootMargin: "256px 0px" }
    );

    state.observer.observe(root);
  };

  const bootstrap = root => {
    const config = parseConfig(root);
    if (!config) {
      return;
    }

    state.root = root;
    state.config = config;
    state.currentIdentifier = root.dataset.identifier || config.term || "";
    showPlaceholder(root);

    const button = root.querySelector("[data-giscus-load]");
    if (button) {
      button.addEventListener(
        "click",
        () => {
          ensureLoaded(root, config);
        },
        { once: true }
      );
    }

    ensureObserver(root);
    attachThemeListeners(root, config);
  };

  const initialise = () => {
    const root = document.querySelector("[data-giscus-root]");
    if (!root) {
      detachThemeListeners();
      detachObserver();
      state.root = null;
      state.config = null;
      state.currentIdentifier = null;
      state.loaded = false;
      return;
    }

    if (state.root && state.root !== root) {
      teardown(state.root);
    }

    const identifier = root.dataset.identifier;
    if (state.loaded && identifier && identifier !== state.currentIdentifier) {
      teardown(state.root || root);
    }

    bootstrap(root);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }

  document.addEventListener("astro:page-load", () => {
    scheduleIdle(initialise);
  });
})();
