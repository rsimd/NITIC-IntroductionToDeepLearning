# NITIC: Introduction to Deep Learning（Jupyter Book / MyST）

[Jupyter Book](https://jupyterbook.org/)（[MyST](https://mystmd.org/)）でビルドする Markdown ドキュメントです。

教科書構成の更新はブランチ **`feature/nitic-textbook-plan`** で進め、`main` へマージする前にビルドを確認します。

## ローカルでプレビューする

開発用サーバーを起動します。依存関係を入れたうえで、プロジェクトのルートで次を実行します。

```bash
uv sync --frozen --all-groups
uv run jupyter-book start
```

ターミナルに表示される URL（多くの場合 `http://localhost:3000`）をブラウザで開きます。終了するときはそのターミナルで `Ctrl+C` します。別ポートにする場合は `uv run jupyter-book start --port 8080` のように指定します。

## ローカルで HTML をビルドする

リポジトリ名に合わせて `BASE_URL` を設定すると、GitHub Pages と同じパスでリンクが解決されます。

```bash
uv sync --frozen --all-groups
BASE_URL=/NITIC-IntroductionToDeepLearning uv run jupyter-book build --html --ci
uv run python scripts/postprocess_html.py _build/html
```

生成物は `_build/html/` に出力されます。

## PyTorch Playground 風の学習可視化

`nitic_playground` には、`torch.nn.Sequential` で作った小さな MLP の学習過程を Jupyter Lab / Colab 上で再生するための HTML 生成器があります。訓練そのものは PyTorch 側で行い、HTML は記録済みの重み・損失・決定境界または回帰曲線を表示するだけです。

```python
import numpy as np
import torch
from torch import nn
from IPython.display import HTML

from nitic_playground import create_playground_recorder

model = nn.Sequential(
    nn.Linear(2, 8),
    nn.Tanh(),
    nn.Linear(8, 1),
)

X = np.random.randn(200, 2).astype("float32")
y = (X[:, 0] * X[:, 1] > 0).astype("float32")

optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
criterion = nn.BCEWithLogitsLoss()
recorder = create_playground_recorder(model, X, y, problem="classification")

for epoch in range(100):
    optimizer.zero_grad()
    logits = model(torch.tensor(X))
    loss = criterion(logits[:, 0], torch.tensor(y))
    loss.backward()
    optimizer.step()

    if epoch % 5 == 0:
        recorder.capture(step=epoch, loss=float(loss.item()))

HTML(recorder.to_html())
```

`recorder.to_html()` は VS Code Notebook / Jupyter Lab / Colab で初回表示から JavaScript が動くように、`iframe srcdoc` 形式の HTML を返します。`recorder.to_html("playground.html")` のようにパスを渡すと、単体で開ける HTML ファイルも同時に保存します。対応している構造は `nn.Linear` と `nn.ReLU`、`nn.Tanh`、`nn.Sigmoid`、`nn.Identity` の組み合わせです。可視化対象は、2次元入力の分類・回帰、または1次元入力の回帰です。

## GitHub Pages で公開する

リポジトリの **Settings → Pages** で **Source** を **GitHub Actions** に設定します。`main` または `master` へ push すると [.github/workflows/deploy-book.yml](.github/workflows/deploy-book.yml) が実行され、次の URL 形式で公開されます。

公開 URL の例: [https://rsimd.github.io/NITIC-IntroductionToDeepLearning/](https://rsimd.github.io/NITIC-IntroductionToDeepLearning/)

ソースや修正の送付先は [GitHub — rsimd/NITIC-IntroductionToDeepLearning](https://github.com/rsimd/NITIC-IntroductionToDeepLearning) を参照してください。
