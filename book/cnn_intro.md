# CNNとは

CNN（Convolutional Neural Network, 畳み込みニューラルネットワーク）は，画像のように「近くにある値どうしの関係」が大事なデータを扱いやすくしたニューラルネットワークである。
普通の Dense 層だけでも画像分類はできるが，画像を一列の数に直すため，線の向き，端，近くの模様といった空間的な手がかりを最初から扱いやすい形では持てない。

CNN は，画像を小さな範囲に分けて見ながら，「このあたりに縦線がある」「このあたりに角がある」「このあたりに目や耳のような模様がある」といった特徴を段階的に取り出す。
最後は，取り出した特徴を使って，数字，ひらがな，犬，猫のようなクラスを予測する。

```{figure} ../assets/cnn_dense_vs_cnn.svg
:alt: Dense層は画像を一列に並べ，CNNは近くの画素の関係を保ったまま小さな範囲を見ることを示す図
:width: 100%

Dense 層だけで画像を見る場合と，CNN で画像を見る場合の違い。
```

## 畳み込み層

畳み込み層（convolution layer）は，画像に小さなフィルタを重ねて動かしながら，画像の特徴を取り出す層である。
フィルタは小さな表で，たとえば `3 x 3` や `5 x 5` の大きさを持つ。
フィルタを画像の一部に重ね，対応する値をかけて足すと，その場所にどれくらい特徴があるかを表す値が得られる。

重要なのは，CNN ではこのフィルタの値を人間が手で決めるのではなく，学習によって決める点である。
最初はランダムな値でも，学習が進むと，エッジ，曲線，模様などを見つけやすい値に変わっていく。

```{figure} ../assets/cnn_convolution_example.svg
:alt: 4x4の画像に3x3のフィルタを重ね，かけて足す計算で2x2の特徴マップを作る図
:width: 100%

畳み込みの計算例。フィルタを少しずつ動かすことで，特徴マップが作られる。
```

実際にフィルタを動かすと，入力画像のどの場所を見て，どの値が出力に入るのかが分かりやすい。

<iframe
  class="nitic-demo-iframe"
  src="../demos/cnn_convolution_animation.html?v=20260610"
  width="100%"
  height="900"
  style="border: 1px solid #d7dde5; border-radius: 8px;"
  loading="lazy"
  title="CNN Convolution Animation"
></iframe>

1つのフィルタは1種類の特徴に反応する。
実際の CNN では複数のフィルタを使うので，1枚の画像から何枚もの特徴マップが作られる。
浅い層では線や明暗の境目を見つけ，深い層ではそれらを組み合わせて，より大きな形や対象の一部を見つける。

## プーリング層

プーリング層（pooling layer）は，近くの値を1つにまとめる層である。
よく使われる Max pooling では，たとえば `2 x 2` の範囲の中から最大値だけを残す。
これにより，特徴マップの縦横サイズが小さくなり，計算量も減る。

```{figure} ../assets/cnn_max_pooling.svg
:alt: 4x4の特徴マップを2x2ごとに最大値でまとめ，2x2の特徴マップにする図
:width: 100%

`2 x 2` の Max pooling の例。各領域で一番強い反応だけを残す。
```

Max pooling では，選ばれた値だけが次の特徴マップへ進む。
最大値以外が消える様子を見ておくと，「小さくする」と「代表値を残す」が同じ処理であることが見える。

<iframe
  class="nitic-demo-iframe"
  src="../demos/cnn_pooling_animation.html?v=20260610"
  width="100%"
  height="900"
  style="border: 1px solid #d7dde5; border-radius: 8px;"
  loading="lazy"
  title="CNN Pooling Animation"
></iframe>

プーリング層には，通常，学習する重みはない。
単に決められた規則で値を選ぶだけである。
そのかわり，線や模様の位置が少しずれても，同じような特徴として扱いやすくなる。

ただし，すべての CNN に必ず pooling が必要というわけではない。
最近のモデルでは，stride を使った畳み込みでサイズを小さくしたり，最後に Global Average Pooling を使ったりすることも多い。
まずは「近くの情報をまとめて，おおまかな特徴にする層」と考えるとよい。

## 全体の流れ

基本的な CNN は，次のように進む。

```{figure} ../assets/cnn_basic_structure.svg
:alt: 入力画像，ConvとReLU，Pooling，FlattenまたはGlobal Average Pooling，Dense層，出力へ進むCNNの基本構造
:width: 100%

CNN の基本構造。畳み込みで特徴を取り出し，最後に分類器でクラスを決める。
```

1. 入力画像を受け取る。
2. 畳み込み層で，小さな範囲の特徴を取り出す。
3. ReLU などの活性化関数で，重要な反応を残しやすくする。
4. プーリング層などで，特徴マップを少し小さくする。
5. これを何回かくり返して，より複雑な特徴を作る。
6. 最後に `Flatten` または Global Average Pooling で分類器に渡し，Dense 層でクラスごとのスコアを出す。

ここで `Flatten` は，縦横を持つ特徴マップを1次元のベクトルに直す操作である。
単純な CNN では `Flatten` してから Dense 層に渡すことが多い。
一方で，最近の画像分類モデルでは，特徴マップ全体を平均する Global Average Pooling を使ってから分類することも多い。

畳み込みと pooling を重ねると，浅い層では線や角のような小さな特徴を見て，深い層では部品や全体の配置に近い特徴を見るようになる。
次のデモでは，層を進むごとに特徴がどのように抽象的になるかを確認できる。

<iframe
  class="nitic-demo-iframe"
  src="../demos/cnn_feature_hierarchy.html?v=20260610"
  width="100%"
  height="900"
  style="border: 1px solid #d7dde5; border-radius: 8px;"
  loading="lazy"
  title="CNN Feature Hierarchy"
></iframe>

## コードで見るときの注目点

PyTorch で CNN を読むときは，まず次を見ると構造がつかみやすい。

- `nn.Conv2d`: 畳み込み層。`in_channels`，`out_channels`，`kernel_size`，`padding` を見る。
- `nn.ReLU`: 活性化関数。負の値を0にして，非線形な表現を作る。
- `nn.MaxPool2d`: Max pooling。特徴マップの縦横を小さくする。
- `nn.Flatten`: 特徴マップを1次元に直す。
- `nn.Linear`: Dense 層。最後にクラスごとのスコアを出す。

CNN の本質は，「画像全体を一気に見る」のではなく，「小さな範囲の特徴を見つけ，それを組み合わせて判断する」ことである。
この考え方を持っておくと，次の CNN 実験ノートで `Conv2d` や `MaxPool2d` が何をしているのかを追いやすくなる。
