# 運用

## 開発

```sh
npm ci
npm run dev      # フォントを生成してから astro dev
npm run build    # フォントを生成してから astro build
```

Node.js は 22.12 以上が必要です (Astro 7 の要件)。

## デプロイ

`main` にプッシュすると、GitHub Actions ([.github/workflows/deploy.yml](../.github/workflows/deploy.yml)) がビルドして、Cloudflare の `devuloper` アカウントにある Pages プロジェクト `otnc-portfolio` にデプロイします。プロジェクトがまだなければ、最初の実行で作ります。

Pages プロジェクトは直接アップロード型なので、Cloudflare 側の Git 連携は使いません。Actions から `wrangler pages deploy` を呼んでいます。プロジェクトの `pages.dev` のアドレスは `otnc-portfolio-9n7.pages.dev` です。

リポジトリに次の設定が必要です。

| 種類 | 名前 | 中身 |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare の API トークン (`devuloper` アカウントの Cloudflare Pages: Edit) |
| Variable | `CLOUDFLARE_ACCOUNT_ID` | `devuloper` のアカウント ID (`48866beebe80d684ef2a7cb5764190a1`) |

手元からデプロイするときは、`devuloper` にログインした wrangler で `npm run deploy` を実行します。

## Pages の環境変数

| 名前 | 必須 | 用途 |
| --- | --- | --- |
| `GITHUB_TOKEN` | 任意 | 作品の Website 欄を取る GitHub API を認証付きで呼ぶ。ないと IP ごとに1時間60回まで |

## ドメイン

| ドメイン | 扱い |
| --- | --- |
| `otoneko.cat` | 正規のドメイン |
| `www.otoneko.cat` | `otoneko.cat` に 301 |
| `otnc.dev` | `otoneko.cat` に 301 |
| `www.otnc.dev` | `otoneko.cat` に 301 |

4つとも Pages の Custom domains に登録してあり、DNS は `otnc-portfolio-9n7.pages.dev` への CNAME です。転送は `src/worker.ts` が Astro より先に行います。`public/_routes.json` でページは全部 Worker を通すので、事前レンダリングしたページも転送されます。静的ファイル (`/_astro/*`、`/pixel/*`、`/fonts/*`) は Worker を通さないため、別ドメインで直接開いた場合は転送されません。

2026-10-20 に、最初は誤って `mofumofupop` アカウントに作ったプロジェクトを `devuloper` に移し、古いプロジェクトは削除しました。最初の切り替えで置き換えた DNS レコードは次の通りです。

- `otoneko.cat` と `www.otoneko.cat`: `A 5.104.86.48` (montblank.fun と同じサーバー)
- `otnc.dev`: GitHub Pages の `A 185.199.108.153` から `185.199.111.153` の4つ
- `www.otnc.dev`: レコードなし (新規追加)

## .cat ドメインの要件

.cat は、サイトに意味のあるカタルーニャ語のコンテンツがあるか、カタルーニャ語や文化を広めていることが条件です ([domini.cat の FAQ](https://domini.cat/en/faqs))。登録後に確認されることがあり、違反の通知から15日以内に反証できないと停止や取り消しになります ([.cat のルール](https://domini.cat/en/rules-of-the-cat-domain))。

このために `/ca/` を置いています。トップのフッターからリンクしています。

## フォント

`fonts/pixelmplus/` の PixelMplus10 / PixelMplus12 から、`scripts/build-fonts.mjs` が2段のサブセットを作ります。

1. `PixelMplusNN`: `src/` のソースに出てくる文字だけ。普段はこれだけ読み込まれます。
2. `PixelMplusNN Extra`: 全文字を Unicode の範囲ごとに分けたもの。GitHub から取ってきた説明文など、1にない文字があるときだけ読み込まれます。

生成物 (`public/fonts/pixelmplus/`、`src/styles/pixelmplus.css`) は git 管理外です。

## 外部素材のライセンス

| 素材 | 使い方 | ライセンス |
| --- | --- | --- |
| [PixelMplus](https://github.com/itouhiro/PixelMplus) | フォント | M+ FONT LICENSE |
| [Paper Shaders](https://github.com/paper-design/shaders) | 背景の波とアイコンのディザ | Apache-2.0 |
| [NES.css](https://github.com/nostalgic-css/NES.css) | GitHub / Twitter アイコンと octocat のドット配置 | MIT |
| [RetroUI](https://github.com/Dksie09/RetroUI) | ウィンドウ枠の角の描き方 (border-image) | BSD-3-Clause |
| [Misskey](https://github.com/misskey-dev/misskey) | Misskey アイコンのドット絵の元にした公式ロゴ | ロゴの扱いは Misskey の方針に従う |
