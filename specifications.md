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

## Hands-on lab (course materials)

The book is written so readers can follow it **without attending a specific class**.

- **Training / experiments:** [Google Colab](https://colab.research.google/) for model training and quick checks; students export `.py` and trained weights (e.g. `.pt`, `.onnx`) as documented per chapter.
- **PC track:** Janken (rock-paper-scissors) classification and related exercises run on the student’s own computer (local Python or Colab export).
- **Edge robot demos (chapters 5–6):** NVIDIA **Jetson Nano** as the SBC, on the **Jetson Nano Mouse** robot kit. **Node-RED** orchestrates camera → inference (custom Python node or `exec`) → motor commands.
- **JetPack / drivers:** Pin one **JetPack** release and camera stack in lab docs when publishing a given term; keep a small **version table** (below) in sync with that image.
- **Hardware sharing:** Several students may share one robot; it is **not** group coding—each student runs the flow in turn. See robot chapters for timeboxing and queue etiquette.
- **Gesture → command mapping:** Students may define their own mapping from recognized gesture labels to robot actions; keep **safety limits** (e.g. max speed, stop) as specified by the instructor. Prefer a **single config** (JSON, Node-RED subflow, or inject node) for the mapping.

### Pinned stacks (template — update each term)

| Role | Environment | Notes |
|------|-------------|--------|
| Training | Colab default GPU runtime | Document `torch`, `torchvision`, `opencv-python` versions in the Colab notebook header. |
| PC inference | Student OS + `uv` / venv | Align with Colab export or use CPU-only wheels as documented. |
| Jetson inference | Jetson Nano + pinned JetPack | Use JetPack-bundled PyTorch wheel, or **ONNX** + `onnxruntime-gpu` / TensorRT path—pick **one** stack per course. |

Export path (conceptual): Colab trains → export **ONNX** (or TorchScript) + thin `infer.py` → copy to Jetson → Node-RED calls the same CLI / JSON contract as in chapters 5–6.

## Layout

| Path | Role |
|------|------|
| `myst.yml` | Project title, TOC, theme, GitHub URL |
| `book/index.md` | Landing page |
| `book/01_overview.md` | Overview chapter |
| `book/02_mlp.ipynb` | MLP chapter |
| `book/03_cnn.ipynb` | CNN chapter |
| `_build/` | Build output (gitignored) |
