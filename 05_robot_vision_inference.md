---
title: "第5章 ロボット上の視覚推論（Jetson Nano）"
description: ジェスチャ推論スクリプトの入出力契約と、実機・PC の両方での検証手順。
---

# 第5章 ロボット上の視覚推論（Jetson Nano）

## この章の前に

[第4章 物体検知の概要](04_object_detection.md) で検知と分類の違いを押さえておく。第3章のじゃんけんラボで、自分の PC 上に Python 環境があるとよい。

## ハードウェアの呼び方

- **シングルボードコンピュータ**：本書では **NVIDIA Jetson Nano** を使う。推論と **Node-RED** はここで動く。
- **ロボット**：**Jetson Nano Mouse** は、Jetson Nano を搭載した車体・カメラ・駆動をまとめたキットである。

## 推論プログラムの契約（本書の共通 I/F）

Node-RED やシェルから同じ形で呼べるように、**標準入出力の JSON** で統一する。第6章のマッピングノードは、この出力の `label` を読む。

### 起動形（推奨）

```bash
python infer_gesture.py --stdin < request.json > response.json
```

またはパイプ：

```bash
echo '{"image_path":"/tmp/capture.jpg"}' | python infer_gesture.py --stdin
```

### リクエスト（1行 JSON）

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `image_path` | string | はい | 読み込む画像の絶対パス（JPEG/PNG 推奨） |

例：

```json
{"image_path": "/home/jetson/captures/frame_001.jpg"}
```

### レスポンス（1行 JSON）

| フィールド | 型 | 説明 |
|------------|-----|------|
| `ok` | boolean | 成功なら `true` |
| `label` | string | 採用したクラス名（例：`open_palm`, `fist`, `point`） |
| `confidence` | number | 0–1 付近の信頼度（モデルに応じて未校準でもよい） |
| `candidates` | array | 任意。`{"label","score"}` の上位候補 |
| `error` | string | `ok:false` のときのメッセージ |

成功例：

```json
{"ok":true,"label":"fist","confidence":0.87,"candidates":[{"label":"fist","score":0.87},{"label":"open_palm","score":0.09}]}
```

失敗例：

```json
{"ok":false,"error":"file not found: /tmp/missing.jpg"}
```

### 単体テストの手順

1. 任意の静止画を `test.jpg` に置く。
2. `echo '{"image_path":"/.../test.jpg"}' | python infer_gesture.py --stdin` を実行する。
3. 標準出力が上記 JSON 形であり、`ok:true` になることを確認する。

**Node-RED に繋ぐ前に** 必ずこの CLI で通す。ここで落ちる問題はフローではなくモデル側にある。

## 環境とバージョン（開講時に固定）

[specifications.md](specifications.md) の **Pinned stacks** を、使用する JetPack・Colab の `torch` 版に合わせて更新する。原則として **1コース1スタック**（例：学習は Colab の PyTorch、Jetson では ONNX + 指定ビルドの onnxruntime）に絞る。

## 実機がない場合（独学トラック）

同じ `infer_gesture.py` を PC の Python で動かし、USB カメラで保存したフレームを `image_path` に渡す。ロボットの動きは第6章の **記録した JSON を inject するだけ** のデモで代替できる。

## 教室で行う場合（少台数・順番実演）

- **Jetson Nano Mouse** は **数台** しかないことがある。**グループで1本のコードを共同編集する** のではなく、**順番に各自がフローをデプロイ／実行** する。
- **1人あたりの目安**：推論確認 5–10 分＋ NR 接続 10–15 分（調整可）。
- **待機中**：次の手順を読む、Colab で自分用の重みを用意する、観察メモを取る。
- **上書き防止**：各自の `infer_gesture.py` や重みは USB メモリやクラウドからコピーし、**ホームディレクトリの退避ルール** を教員指示に従う。

## 演習（第5章メイン）

- **目的**：上記契約どおりの `infer_gesture.py` を用意し、テスト画像で `ok:true` を得る。
- **環境**：Jetson Nano（Mouse 上）または自分の PC。
- **所要時間**：初回 60–90 分。
- **成功の見え方**：CLI の JSON が Node-RED の `exec` ノードからも同じように取得できる（次章）。

次は [第6章 Node-RED とロボット制御](06_robot_control_node_red.md) へ。

## 用語メモ

| 口語 | 用語 |
|------|------|
| 推論だけ | 推論、インファレンス |
| 1行 JSON | NDJSON 風のプロセス通信 |
