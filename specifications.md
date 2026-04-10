# Specifications

## Repository

- **GitHub:** https://github.com/rsimd/NITIC-IntroductionToDeepLearning
- **Book title:** NITIC: Introduction to Deep Learning

## Toolchain

- **Python:** 3.12.2 or newer
- **Package manager:** [uv](https://docs.astral.sh/uv/) only (`uv sync`, `uv run`)
- **Static site:** Jupyter Book 2.x (MyST), configured in [myst.yml](myst.yml)

## Commands

```bash
uv sync --frozen --all-groups
uv run jupyter-book start
BASE_URL=/NITIC-IntroductionToDeepLearning uv run jupyter-book build --html --ci
```

## CI

GitHub Actions workflow: [.github/workflows/deploy-book.yml](.github/workflows/deploy-book.yml)  
Deploys `_build/html` to GitHub Pages with `BASE_URL=/NITIC-IntroductionToDeepLearning`.

## Layout

| Path | Role |
|------|------|
| `myst.yml` | Project title, TOC, theme, GitHub URL |
| `index.md` | Landing page |
| `lecture*.md` / `*.ipynb` | Chapter content (add to `project.toc` in `myst.yml`) |
| `_build/` | Build output (gitignored) |
