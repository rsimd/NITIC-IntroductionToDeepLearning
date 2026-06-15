(() => {
  const keywords = [
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
  ];
  const builtins = [
    "dict",
    "display",
    "enumerate",
    "float",
    "int",
    "len",
    "list",
    "max",
    "min",
    "next",
    "print",
    "range",
    "str",
    "super",
    "tuple",
    "zip",
  ];
  const keywordPattern = keywords.join("|");
  const builtinPattern = builtins.join("|");
  const tokenPattern = new RegExp(
    [
      String.raw`"{3}[\s\S]*?"{3}|'{3}[\s\S]*?'{3}`,
      String.raw`"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'`,
      String.raw`#[^\n]*`,
      String.raw`\b(?:${keywordPattern})\b`,
      String.raw`\b(?:${builtinPattern})\b`,
      String.raw`\b\d+(?:\.\d+)?\b`,
      String.raw`\b[A-Za-z_]\w*(?=\s*\()`,
    ].join("|"),
    "g",
  );

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function classForToken(token) {
    if (token.startsWith("#")) return "hljs-comment";
    if (token.startsWith('"') || token.startsWith("'")) return "hljs-string";
    if (/^\d/.test(token)) return "hljs-number";
    if (keywords.includes(token)) return "hljs-keyword";
    if (builtins.includes(token)) return "hljs-built_in";
    return "hljs-title function_";
  }

  function highlightPython(source) {
    let html = "";
    let lastIndex = 0;
    for (const match of source.matchAll(tokenPattern)) {
      const token = match[0];
      html += escapeHtml(source.slice(lastIndex, match.index));
      html += `<span class="${classForToken(token)}">${escapeHtml(token)}</span>`;
      lastIndex = match.index + token.length;
    }
    html += escapeHtml(source.slice(lastIndex));
    return html;
  }

  function highlightPythonBlocks() {
    document
      .querySelectorAll("article.article code.language-python:not([data-nitic-highlighted])")
      .forEach((code) => {
        const source = code.textContent;
        if (!source || !source.trim()) return;
        code.innerHTML = highlightPython(source);
        code.dataset.niticHighlighted = "true";
      });
  }

  function removeNoCssDialog() {
    document.querySelectorAll("#myst-no-css").forEach((dialog) => {
      dialog.remove();
    });
  }

  function applyLocalPreviewFixes() {
    removeNoCssDialog();
    highlightPythonBlocks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLocalPreviewFixes, { once: true });
  } else {
    applyLocalPreviewFixes();
  }
  setTimeout(applyLocalPreviewFixes, 50);
  setTimeout(applyLocalPreviewFixes, 250);
  setTimeout(applyLocalPreviewFixes, 1000);
  new MutationObserver(applyLocalPreviewFixes).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
