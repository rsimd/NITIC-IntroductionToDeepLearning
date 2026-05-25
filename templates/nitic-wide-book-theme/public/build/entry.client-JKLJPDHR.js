import {
  RemixBrowser,
  require_jsx_dev_runtime
} from "/myst_assets_folder/_shared/chunk-2RVQXRZB.js";
import {
  require_client,
  require_react
} from "/myst_assets_folder/_shared/chunk-3RNZ6DIW.js";
import {
  __toESM
} from "/myst_assets_folder/_shared/chunk-CGOEG7L2.js";

// app/entry.client.tsx
var import_react2 = __toESM(require_react());
var import_client = __toESM(require_client());
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
function hydrate() {
  (0, import_react2.startTransition)(() => {
    (0, import_client.hydrateRoot)(
      document,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RemixBrowser, {}, void 0, false, {
        fileName: "app/entry.client.tsx",
        lineNumber: 10,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "app/entry.client.tsx",
        lineNumber: 9,
        columnNumber: 7
      }, this)
    );
  });
}
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}

(() => {
  const activeLinkClass = "myst-outline-hash-active";
  const activeItemClass = "myst-outline-hash-active-item";

  function updateOutlineHashActive() {
    document.querySelectorAll(`.${activeLinkClass}`).forEach((node) => node.classList.remove(activeLinkClass));
    document.querySelectorAll(`.${activeItemClass}`).forEach((node) => node.classList.remove(activeItemClass));

    const hash = decodeURIComponent(window.location.hash || "");
    if (!hash || hash === "#") return;

    const id = hash.slice(1);
    const target = document.getElementById(id);
    const outline = document.querySelector(".myst-outline-list");
    if (!target || !outline) return;

    const rect = target.getBoundingClientRect();
    const upperActiveLimit = Math.max(160, window.innerHeight * 0.25);
    if (rect.top < -80 || rect.top > upperActiveLimit) return;

    const safeId = id.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const link = outline.querySelector(`a[href="#${safeId}"]`);
    if (!link) return;

    link.classList.add(activeLinkClass);
    link.closest(".myst-outline-item")?.classList.add(activeItemClass);
  }

  function scheduleOutlineHashActive() {
    cancelAnimationFrame(window.__niticOutlineHashRaf || 0);
    window.__niticOutlineHashRaf = requestAnimationFrame(updateOutlineHashActive);
  }

  window.addEventListener("hashchange", scheduleOutlineHashActive);
  window.addEventListener("scroll", scheduleOutlineHashActive, { passive: true });
  window.addEventListener("resize", scheduleOutlineHashActive);
  document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest?.('.myst-outline-list a[href^="#"]')) {
        setTimeout(scheduleOutlineHashActive, 0);
      }
    },
    true,
  );
  new MutationObserver(scheduleOutlineHashActive).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleOutlineHashActive, { once: true });
  } else {
    scheduleOutlineHashActive();
  }
  setTimeout(scheduleOutlineHashActive, 100);
  setTimeout(scheduleOutlineHashActive, 500);
})();
//# sourceMappingURL=/myst_assets_folder/entry.client-JKLJPDHR.js.map
