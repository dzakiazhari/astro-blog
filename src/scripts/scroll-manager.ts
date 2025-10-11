export interface ScrollDetail {
  progress: number;
  scrollTop: number;
  scrollHeight: number;
}

export interface ScrollManager {
  subscribe(callback: (detail: ScrollDetail) => void): () => void;
  refresh(): void;
  getSnapshot(): ScrollDetail;
}

let manager: ScrollManager | null = null;

const callbacks = new Set<(detail: ScrollDetail) => void>();

const state = {
  attached: false,
  ticking: false,
  lastDetail: {
    progress: 0,
    scrollTop: 0,
    scrollHeight: 0,
  } satisfies ScrollDetail,
};

const measure = (): ScrollDetail => {
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

  return {
    progress,
    scrollTop,
    scrollHeight,
  };
};

const notify = (detail: ScrollDetail) => {
  for (const callback of callbacks) {
    callback(detail);
  }
};

const compute = (): ScrollDetail | null => {
  const next = measure();

  if (
    next.progress === state.lastDetail.progress &&
    next.scrollTop === state.lastDetail.scrollTop &&
    next.scrollHeight === state.lastDetail.scrollHeight
  ) {
    return null;
  }

  state.lastDetail = next;
  return next;
};

const prime = (): ScrollDetail => {
  const snapshot = measure();
  state.lastDetail = snapshot;
  return snapshot;
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
  if (state.attached) {
    return;
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  state.attached = true;
};

const detach = () => {
  if (!state.attached || callbacks.size > 0) {
    return;
  }

  document.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  state.attached = false;
};

const subscribe = (callback: (detail: ScrollDetail) => void) => {
  callbacks.add(callback);
  attach();

  callback(prime());

  return () => {
    callbacks.delete(callback);
    detach();
  };
};

const refresh = () => {
  notify(prime());
};

export const ensureScrollManager = (): ScrollManager | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  if (manager) {
    return manager;
  }

  manager = {
    subscribe,
    refresh,
    getSnapshot: () => state.lastDetail,
  } satisfies ScrollManager;

  document.addEventListener("astro:page-load", refresh);

  return manager;
};
