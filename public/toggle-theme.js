const primaryColorScheme = ""; // "light" | "dark"

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

const scheduleThemeColorUpdate = () => {
  if (themeColorScheduled) return;
  themeColorScheduled = true;

  const run = () => {
    themeColorScheduled = false;
    const root = document.documentElement;
    const meta = document.querySelector("meta[name='theme-color']");
    if (!root || !meta) {
      return;
    }

    const computed = window.getComputedStyle(root);
    const bgColor =
      computed.getPropertyValue("--color-background") ||
      computed.backgroundColor;

    if (bgColor) {
      meta.setAttribute("content", bgColor.trim());
    }
  };

  const scheduleRun = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => run(), { timeout: 200 });
    } else {
      window.requestAnimationFrame(run);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        scheduleRun();
      },
      { once: true }
    );
  } else {
    scheduleRun();
  }
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

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  const setThemeFeature = () => {
    reflectPreference();

    const toggleButton = document.querySelector("#theme-btn");
    if (toggleButton && toggleButton.dataset.bound !== "true") {
      toggleButton.addEventListener("click", () => {
        themeValue = themeValue === "light" ? "dark" : "light";
        setPreference();
      });
      toggleButton.dataset.bound = "true";
    }
  };

  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", setThemeFeature);
};

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

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });
