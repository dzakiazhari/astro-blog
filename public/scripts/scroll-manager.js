(function () {
  if (window.__scrollManager) {
    return;
  }

  if (!window.__scheduleIdle) {
    window.__scheduleIdle = callback => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(callback, { timeout: 200 });
      } else {
        window.setTimeout(callback, 120);
      }
    };
  }

  const callbacks = new Set();
  const state = {
    attached: false,
    ticking: false,
    lastDetail: {
      progress: 0,
      scrollTop: 0,
      scrollHeight: 0,
    },
  };

  const compute = () => {
    const root = document.scrollingElement || document.documentElement;
    if (!root) {
      return state.lastDetail;
    }

    const scrollHeight = Math.max(root.scrollHeight - root.clientHeight, 0);
    const scrollTop = Math.max(root.scrollTop || window.scrollY || 0, 0);
    const progress =
      scrollHeight > 0
        ? Math.min(Math.round((scrollTop / scrollHeight) * 100), 100)
        : 0;

    if (
      progress === state.lastDetail.progress &&
      scrollTop === state.lastDetail.scrollTop &&
      scrollHeight === state.lastDetail.scrollHeight
    ) {
      return null;
    }

    const next = { progress, scrollTop, scrollHeight };
    state.lastDetail = next;
    return next;
  };

  const notify = detail => {
    for (const callback of callbacks) {
      callback(detail);
    }
  };

  const flush = () => {
    state.ticking = false;
    const detail = compute();
    if (!detail) {
      return;
    }
    notify(detail);
  };

  const onScroll = () => {
    if (!state.ticking) {
      state.ticking = true;
      window.requestAnimationFrame(flush);
    }
  };

  const attach = () => {
    if (state.attached) return;
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    state.attached = true;
  };

  const detach = () => {
    if (!state.attached || callbacks.size > 0) return;
    document.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    state.attached = false;
  };

  const subscribe = callback => {
    callbacks.add(callback);
    attach();
    window.requestAnimationFrame(() => callback(compute()));

    return () => {
      callbacks.delete(callback);
      detach();
    };
  };

  const refresh = () => {
    const detail = compute();
    notify(detail ?? state.lastDetail);
  };

  document.addEventListener("astro:page-load", refresh);

  window.__scrollManager = {
    subscribe,
    refresh,
  };
})();
