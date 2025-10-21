(function () {
  const state = (window.__postEnhancements = window.__postEnhancements || {
    bootstrapped: false,
    headingDecorated: false,
    navHandler: null,
  });

  const mark = label => {
    window.__layoutAudit?.mark?.(label);
  };

  const scheduleIdle = callback => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 300 });
    } else {
      window.setTimeout(callback, 120);
    }
  };

  const addHeadingLinks = root => {
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2, h3, h4, h5, h6"));

    for (const heading of headings) {
      if (heading.querySelector(".heading-link")) {
        continue;
      }

      heading.classList.add("group");
      const link = document.createElement("a");
      link.className =
        "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
      link.href = `#${heading.id}`;

      const span = document.createElement("span");
      span.ariaHidden = "true";
      span.innerText = "#";
      link.appendChild(span);

      heading.appendChild(link);
    }
  };

  const createCopyButton = (codeBlock, label) => {
    const computedStyle = getComputedStyle(codeBlock);
    const baseOffset =
      computedStyle.getPropertyValue("--code-copy-offset").trim() ||
      computedStyle.getPropertyValue("padding-top").trim() ||
      "1.4rem";
    const fileNameOffset = computedStyle
      .getPropertyValue("--file-name-offset")
      .trim();

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-code";
    copyButton.textContent = label;
    copyButton.setAttribute("aria-label", "Copy code to clipboard");
    copyButton.setAttribute("data-state", "idle");

    const buttonOffset =
      fileNameOffset && fileNameOffset !== "0"
        ? `calc(${baseOffset} + ${fileNameOffset})`
        : baseOffset;
    copyButton.style.setProperty("--copy-button-top", buttonOffset);

    return copyButton;
  };

  const attachCopyButtons = root => {
    if (!root) return;

    const copyButtonLabel = "Copy";
    const codeBlocks = Array.from(root.querySelectorAll("pre")).filter(
      code => !code.closest(".expressive-code")
    );

    for (const codeBlock of codeBlocks) {
      const parent = codeBlock.parentElement;
      const existingButton = parent?.classList.contains("code-block")
        ? parent.querySelector(".copy-code")
        : codeBlock.querySelector(".copy-code");

      if (existingButton) continue;

      let wrapper = parent;
      if (!wrapper || !wrapper.classList.contains("code-block")) {
        wrapper = document.createElement("div");
        wrapper.className = "code-block group relative";
        codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
      } else {
        wrapper.classList.add("group", "relative");
      }

      const copyButton = createCopyButton(codeBlock, copyButtonLabel);
      wrapper.appendChild(copyButton);
      codeBlock.setAttribute("tabindex", "0");

      copyButton.addEventListener("click", async () => {
        await copyCode(codeBlock, copyButton, copyButtonLabel);
      });
    }
  };

  const copyCode = async (block, button, idleLabel) => {
    const code = block.querySelector("code");
    const text = code?.innerText ?? "";
    await navigator.clipboard.writeText(text);

    button.dataset.state = "copied";
    button.textContent = "Copied";
    button.setAttribute("aria-label", "Code copied to clipboard");

    window.setTimeout(() => {
      button.dataset.state = "idle";
      button.textContent = idleLabel;
      button.setAttribute("aria-label", "Copy code to clipboard");
    }, 1200);
  };

  const enhance = () => {
    const article = document.querySelector("#article");
    if (!article) {
      return;
    }

    addHeadingLinks(article);
    attachCopyButtons(article);
  };

  const queueEnhancements = () => {
    mark("post-enhancements:queue");
    scheduleIdle(() => {
      mark("post-enhancements:idle:start");
      window.requestAnimationFrame(enhance);
      window.requestAnimationFrame(() => {
        mark("post-enhancements:idle:post-frame");
      });
    });
  };

  if (!state.bootstrapped) {
    state.bootstrapped = true;

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          queueEnhancements();
        },
        { once: true }
      );
    } else {
      queueEnhancements();
    }

    state.navHandler = () => {
      mark("post-enhancements:astro:page-load:start");
      queueEnhancements();
      mark("post-enhancements:astro:page-load:end");
    };

    document.addEventListener("astro:page-load", state.navHandler);
    document.addEventListener("astro:after-swap", () => {
      mark("post-enhancements:astro:after-swap:start");
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
      mark("post-enhancements:astro:after-swap:end");
    });
  }
})();
