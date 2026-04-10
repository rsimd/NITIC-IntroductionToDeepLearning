---
title: 教員・運営向けメモ
description: シラバス上の授業回と書籍の章の対応。学生向け本文では実回番号を使わない方針とする。
---

# 教員・運営向けメモ

本ページは **授業運営と章の対応** をまとめたものである。学生向けの各章本文では「実第◯回」などの表記を使わず、独学でも追えるようにしてある。

## 実授業コマと書籍の対応（参考）

| 実際の授業（コマ） | 書籍での位置づけ | 主なファイル |
|-------------------|-----------------|--------------|
| 第1回 | 第0章（序章） | `00_overview_machine_learning_and_deep_learning.md` |
| 第8回 | 第1章（本編） | `01_introduction_deep_learning.md` |
| 第9回 | 第2章 | `02_neural_networks.md` |
| 第10回 | 第3章 | `03_convolutional_neural_networks.md` |
| 第11回 | 第4章 | `04_object_detection.md` |
| 第12回 | 第5章 | `05_robot_vision_inference.md` |
| 第13回 | 第6章 | `06_robot_control_node_red.md` |

実第2–7回は本リポジトリの書籍の対象外である（別教材を想定）。

## ハードウェア・方針の要約

詳細は [specifications.md](specifications.md) の **Hands-on lab** を参照する。

- 学習は主に **Google Colab**、実機は **Jetson Nano**（搭載ロボット **Jetson Nano Mouse**）と **Node-RED**。
- ロボットは **少台数・順番に各自が操作**（共同で1本のコードを書くグループワークではない）。
- ジェスチャとロボット命令の対応は **学生ごとに変更可**（安全限界は教員指定）。
