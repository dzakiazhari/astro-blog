const primaryColorScheme = ""; // "light" | "dark"

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
    themeColorScheduled = false;
    updateMetaTheme();
  });
};

function reflectPreference() {
  document.documentElement.setAttribute("data-theme", themeValue);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
  scheduleThemeColorUpdate();
}

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

const bindToggle = () => {
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
};

const queueBootstrap = () => {
  scheduleIdle(() => {
    bindToggle();
    scheduleThemeColorUpdate();
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
  themeValue = getPreferTheme();
  state.buttonBound = false;
  queueBootstrap();
};

document.addEventListener("astro:after-swap", rebind);
document.addEventListener("astro:page-load", () => {
  themeValue = getPreferTheme();
  reflectPreference();
  state.buttonBound = false;
  queueBootstrap();
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
