> This project was created by the AI code editor “Cursor”.
> The large language model (LLM) used by Cursor follows the model selected in the editor.
> Site configuration is documented in [myst.yml](myst.yml).
> Reproducibility notes are in [specifications.md](specifications.md).

# NITIC: Introduction to Deep Learning（Jupyter Book / MyST）

[Jupyter Book](https://jupyterbook.org/)（[MyST](https://mystmd.org/)）でビルドする Markdown ドキュメントです。

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
```

生成物は `_build/html/` に出力されます。

## GitHub Pages で公開する

リポジトリの **Settings → Pages** で **Source** を **GitHub Actions** に設定します。`main` または `master` へ push すると [.github/workflows/deploy-book.yml](.github/workflows/deploy-book.yml) が実行され、次の URL 形式で公開されます。

公開 URL の例: [https://rsimd.github.io/NITIC-IntroductionToDeepLearning/](https://rsimd.github.io/NITIC-IntroductionToDeepLearning/)

ソースや修正の送付先は [GitHub — rsimd/NITIC-IntroductionToDeepLearning](https://github.com/rsimd/NITIC-IntroductionToDeepLearning) を参照してください。
