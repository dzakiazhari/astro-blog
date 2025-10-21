(function () {
  const html = document.documentElement;
  const auditEnabled = html.dataset.layoutAuditMode === "true";

  if (!auditEnabled) {
    return;
  }

  const supportsPerformance =
    typeof performance !== "undefined" && typeof performance.mark === "function";

  const audit = (window.__layoutAudit = window.__layoutAudit || {
    marks: [],
  });

  audit.enabled = true;
  audit.push = (entry => {
    return detail => {
      if (!supportsPerformance) {
        entry.marks.push({
          detail,
          timestamp: Date.now(),
          pathname: location.pathname,
        });
        return;
      }

      const markId = `layout-audit:${detail.label}`;
      performance.mark(markId);
      entry.marks.push({
        detail,
        markId,
        time: performance.now(),
        pathname: location.pathname,
      });
    };
  })(audit);

  const push = detail => {
    audit.push({
      label: detail,
      metrics: {
        scrollHeight: document.documentElement.scrollHeight,
        bodyHeight: document.body?.getBoundingClientRect().height ?? null,
        viewportHeight: window.innerHeight,
        timestamp: performance.now?.() ?? Date.now(),
      },
    });
  };

  audit.mark = push;

  const markEvent = eventName => () => {
    push(eventName);
    window.requestAnimationFrame(() => {
      push(`${eventName}:post-frame`);
    });
  };

  document.addEventListener("astro:page-load", markEvent("astro:page-load"));
  document.addEventListener("astro:after-swap", markEvent("astro:after-swap"));
})();
