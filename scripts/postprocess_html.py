"""Postprocess generated MyST HTML files for this book."""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path


SCRIPT_NAME = "nitic-python-highlight.js"
NO_CSS_DIALOG_RE = re.compile(r'<dialog id="myst-no-css".*?</dialog>', re.DOTALL)


def script_tag_for(html_path: Path, output_dir: Path) -> str:
    """Create a relative script tag for a generated HTML file.

    Args:
        html_path: Path to the generated HTML file.
        output_dir: Root directory of the generated site.

    Returns:
        A `script` tag with a path relative to `html_path`.
    """
    script_path = output_dir / SCRIPT_NAME
    relative_src = os.path.relpath(script_path, html_path.parent).replace(os.sep, "/")
    return f'<script defer src="{relative_src}"></script>'


def postprocess_html(html_path: Path, output_dir: Path) -> bool:
    """Apply local-preview fixes to one generated HTML file.

    Args:
        html_path: Path to the generated HTML file.
        output_dir: Root directory of the generated site.

    Returns:
        Whether the file was changed.
    """
    html = html_path.read_text(encoding="utf-8")
    updated = NO_CSS_DIALOG_RE.sub("", html)

    if SCRIPT_NAME not in updated and "</body>" in updated:
        tag = script_tag_for(html_path, output_dir)
        updated = updated.replace("</body>", f"{tag}</body>", 1)

    if updated == html:
        return False

    html_path.write_text(updated, encoding="utf-8")
    return True


def postprocess(output_dir: Path) -> int:
    """Postprocess all generated HTML files.

    Args:
        output_dir: Root directory of the generated site.

    Returns:
        Number of changed HTML files.

    Raises:
        FileNotFoundError: If the generated site or highlighter asset is missing.
    """
    output_dir = output_dir.resolve()
    if not output_dir.exists():
        raise FileNotFoundError(f"missing output directory: {output_dir}")
    if not (output_dir / SCRIPT_NAME).exists():
        raise FileNotFoundError(f"missing static asset: {output_dir / SCRIPT_NAME}")

    changed = 0
    for html_path in sorted(output_dir.rglob("*.html")):
        if postprocess_html(html_path, output_dir):
            changed += 1
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", nargs="?", default="_build/html")
    args = parser.parse_args()
    changed = postprocess(Path(args.output_dir))
    print(f"postprocessed HTML files: {changed}")


if __name__ == "__main__":
    main()
