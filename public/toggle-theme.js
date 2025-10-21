const mark = label => {
  window.__layoutAudit?.mark?.(label);
};

const primaryColorScheme = "light"; // "light" | "dark"

const scheduleIdle =
  window.__scheduleIdle ||
  (callback => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 200 });
    } else {
      window.setTimeout(callback, 120);
    }
  });

const state = (window.__themeToggleState = window.__themeToggleState || {
  buttonBound: false,
  mediaListenerBound: false,
});

const getStoredTheme = () => localStorage.getItem("theme");

function getPreferTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (primaryColorScheme) return primaryColorScheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();
let themeColorScheduled = false;

const updateMetaTheme = () => {
  const root = document.documentElement;
  const meta = document.querySelector("meta[name='theme-color']");
  if (!root || !meta) {
    return;
  }

  const computed = window.getComputedStyle(root);
  const bgColor =
    computed.getPropertyValue("--color-background") || computed.backgroundColor;

  if (bgColor) {
    meta.setAttribute("content", bgColor.trim());
  }
};

const scheduleThemeColorUpdate = () => {
  if (themeColorScheduled) return;
  themeColorScheduled = true;

  scheduleIdle(() => {
    mark("toggle-theme:update-meta");
    themeColorScheduled = false;
    updateMetaTheme();
  });
};

function reflectPreference() {
  document.documentElement.setAttribute("data-theme", themeValue);
  const toggleButton = document.querySelector("#theme-btn");
  if (toggleButton) {
    const nextLabel =
      themeValue === "light" ? "Switch to dark theme" : "Switch to light theme";
    toggleButton.setAttribute("aria-label", nextLabel);
    toggleButton.setAttribute("title", nextLabel);
  }
  scheduleThemeColorUpdate();
}

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

const bindToggle = () => {
  mark("toggle-theme:bind-toggle:start");
  if (state.buttonBound) return;

  const toggleButton = document.querySelector("#theme-btn");
  if (!toggleButton) {
    return;
  }

  if (toggleButton.dataset.bound !== "true") {
    toggleButton.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      setPreference();
    });
    toggleButton.dataset.bound = "true";
  }

  state.buttonBound = true;
  mark("toggle-theme:bind-toggle:end");
};

const queueBootstrap = () => {
  mark("toggle-theme:queue-bootstrap");
  scheduleIdle(() => {
    mark("toggle-theme:bootstrap:start");
    bindToggle();
    scheduleThemeColorUpdate();
    mark("toggle-theme:bootstrap:end");
  });
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      queueBootstrap();
    },
    { once: true }
  );
} else {
  queueBootstrap();
}

if (!state.mediaListenerBound) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", ({ matches }) => {
    themeValue = matches ? "dark" : "light";
    setPreference();
  });
  state.mediaListenerBound = true;
}

// Set early so no page flashes / CSS is made aware
reflectPreference();

const rebind = () => {
  mark("toggle-theme:astro:after-swap:start");
  themeValue = getPreferTheme();
  state.buttonBound = false;
  queueBootstrap();
  mark("toggle-theme:astro:after-swap:end");
};

document.addEventListener("astro:after-swap", rebind);
document.addEventListener("astro:page-load", () => {
  mark("toggle-theme:astro:page-load:start");
  themeValue = getPreferTheme();
  reflectPreference();
  state.buttonBound = false;
  queueBootstrap();
  mark("toggle-theme:astro:page-load:end");
});

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", event => {
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  event.newDocument
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bgColor);
});
