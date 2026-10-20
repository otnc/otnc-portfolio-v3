# コードの構成

Astro 7 を SSR (`output: 'server'`) で動かし、Cloudflare Pages に置いています。adapter は [astro-adapter-cloudflare-pages](https://www.npmjs.com/package/astro-adapter-cloudflare-pages) です。

## ディレクトリ

```text
src/
├── pages/
│   ├── index.astro          トップ。部品を並べるだけ
│   └── ca/index.astro       カタルーニャ語ページ (独立)
├── layouts/
│   └── NightLayout.astro    <head>、海の段の凸凹、砂浜のフッター、共通スクリプト
├── components/
│   ├── night/               夜の海の部品
│   │   ├── Hero.astro           夜空、アイコン、名前、キャッチコピー
│   │   ├── Marquee.astro        流れるメッセージ
│   │   ├── AboutWindow.astro    自己紹介
│   │   ├── WorksWindow.astro    作品 (GitHub pinned)
│   │   ├── BottleMail.astro     まろん｡への入口
│   │   ├── LinksWindow.astro    アカウントと支援
│   │   ├── MutualLinksWindow.astro  相互リンク先と、このサイトのバナー
│   │   ├── Window.astro         ウィンドウ枠と開くアニメーション
│   │   ├── NightSky.astro / MoonReflection.astro / WaterGlints.astro
│   │   └── Shoreline.astro      波打ち際
│   ├── PixelIcon.astro      16x16 のドット絵アイコン
│   └── Octocat.astro        手を振る octocat
├── scripts/                 ブラウザで動くスクリプト
│   ├── night-shaders.ts     背景の波とアイコンのディザ (Paper Shaders)
│   ├── marquee.ts           バナーの複製、中央開始、等速ループ
│   ├── reveal.ts            ウィンドウを開く、画面外のアニメーション停止
│   └── typewriter.ts        1文字ずつ打ち込む
├── data/
│   ├── profile.ts           名前、自己紹介、アカウント、支援などの文言
│   └── pixel-icons.ts       ドット絵のデータ
├── lib/
│   ├── github.ts            pinned リポジトリと Website 欄の取得
│   └── pixel-path.ts        ドット絵をパスにまとめる
├── styles/
│   ├── night.css            色のトークン、文字、ボタン、ページの列、凸凹の線
│   └── pixelmplus.css       フォントの @font-face (生成物、git 管理外)
├── worker.ts                Pages の入口。別ドメインを otoneko.cat に転送
└── env.d.ts                 Pages の環境変数の型
public/
├── _routes.json             Worker を通すパス (静的ファイルは通さない)
└── pixel/                   波、泡の線、カニ、貝殻などの SVG
fonts/pixelmplus/            フォントの元ファイルとライセンス
scripts/build-fonts.mjs      フォントのサブセット生成
scripts/build-images.mjs     サムネイル (OGP 画像)、相互リンク用バナー、favicon の生成
```

## よくある変更

### 文言を変える

`src/data/profile.ts` を直します。自己紹介、役割のタグ、使える言語、バナーのメッセージ、アカウント、支援、まろん｡の枠の文はすべてここにあります。

新しい文字 (特に漢字) を使うと、フォントの生成対象が変わります。`npm run dev` と `npm run build` は先にフォントを作り直すので、特別な作業はいりません。

### 相互リンクを足す

`src/data/profile.ts` の `mutualLinks` に `{ name, url }` を足します。作者名を出すときは `author` も付けます。相手のバナーを出すときは `banner: { src, width, height }` も付けます。一覧が空のあいだは "まだありません" と表示されます。

### アカウントを足す

1. `src/data/pixel-icons.ts` に 16x16 のアイコンを足します。`rows` は16文字の行が16行で、`0` は透明、`1` 以降は `colors` の番号です。
2. `src/data/profile.ts` の `accounts` に `icon` 付きで足します。ヒーローとリンクのウィンドウの両方に出ます。

### ウィンドウ (セクション) を足す

1. `src/components/night/` に部品を作り、中身を `Window` で包みます。`class="window--left"` か `window--right` で左右に少しずらします。
2. 部品のスタイルはその `.astro` の `<style>` に書きます。
3. `src/pages/index.astro` の `<main>` に並べます。

### ドット絵のスプライトを足す

`public/pixel/` に `shape-rendering="crispEdges"` の SVG を置き、CSS で1ドット 3px になる大きさで表示します。たとえば 16x10 ドットなら 48x30px です。

### 色の境目に凸凹を付ける

`<span class="pixel-edge">` を境目に重ね、`--edge-color` に下側の色を指定します。形は `public/pixel/edge-a.svg` / `edge-b.svg` (塗り) と `edge-b-line.svg` (線だけ) です。上下逆にするときは `pixel-edge--down`、ゆっくり流すときは `pixel-edge--drift` を足します。

## 作品の取得

`src/lib/github.ts` がリクエストのたびに次を取得します。結果は Cloudflare に1時間キャッシュされます。

1. [pinned.berrysauce.dev](https://pinned.berrysauce.dev) から pinned リポジトリ (説明、言語、スター数)
2. GitHub REST API から各リポジトリの Website 欄 (`Link` に使う)

GitHub API は認証なしだと IP ごとに1時間60回までです。Pages の環境変数 `GITHUB_TOKEN` があれば認証付きで呼びます。取得に失敗した場合、Link は出さず、pinned そのものが取れないときは作品欄に案内を出します。
