(function () {
  const STORAGE_KEY = "site-nav-open";
  const doc = document.documentElement;

  const readStored = () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const writeStored = value => {
    try {
      if (value === null) {
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, value ? "true" : "false");
      }
    } catch {
      /* no-op */
    }
  };

  const applyDataset = value => {
    doc.dataset.navOpen = value ? "true" : "false";
  };

  const restore = () => {
    const disclosure = document.querySelector("[data-nav-disclosure]");
    if (!(disclosure instanceof HTMLDetailsElement)) {
      applyDataset(false);
      return;
    }

    const stored = readStored();
    const datasetPref = doc.dataset.navOpen === "true";
    const shouldOpen =
      stored === "true" || (stored === null && datasetPref);
    applyDataset(shouldOpen);

    if (shouldOpen && !disclosure.hasAttribute("open")) {
      disclosure.setAttribute("open", "");
    }

    if (!shouldOpen && disclosure.hasAttribute("open")) {
      disclosure.removeAttribute("open");
    }

    if (disclosure.dataset.navBound === "true") {
      return;
    }

    const handleToggle = () => {
      const nextState = disclosure.hasAttribute("open");
      applyDataset(nextState);
      writeStored(nextState);
    };

    disclosure.addEventListener("toggle", handleToggle);
    disclosure.dataset.navBound = "true";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restore, { once: true });
  } else {
    restore();
  }

  document.addEventListener("astro:page-load", restore);
})();
