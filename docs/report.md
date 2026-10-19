# 音猫｡ポートフォリオ v3 事前調査レポート

> [!NOTE]
> 最初の調査の記録です。その後デモページは削除し、構成もこのレポートとは変わっています。今の方針は [rules.md](rules.md) と [concept.md](concept.md) を見てください。

調査日: 2026-10-19

レトロドット風のポートフォリオを作る前に、参考サイト・UI ライブラリ・フォント・掲載情報を調べた結果をまとめる。実装はまだ行っていない。

## 1. 結論

- UI のベースは **8bitcn/ui** が最有力。RetroUI (retroui.io) と同じ「ピクセル調 React コンポーネント」で、2026-10 時点でも活発に更新されている。
- 背景やヒーローの演出は **Paper Shaders** の `dithering` / `dot-grid` / `halftone-dots` が合う。参考に挙がった shadercn は現状オーブ系シェーダーしかなく、ドット表現には向かない。
- 動きは Bencho 的なマイクロインタラクションを、Animate UI か Motion で少量足す程度に留める。
- 欧文は **Geist Pixel**、和文は **DotGothic16** (Google Fonts で配信、OFL) の組み合わせが扱いやすい。
- 技術スタックは既存の portfolio-v3 と同じ Astro を土台にし、React は必要な部分だけ island として使う構成を推す。

## 2. 参考サイトの分析

| サイト | 種類 | 取り入れたい点 |
| --- | --- | --- |
| [Animate UI](https://animate-ui.com/) | shadcn/ui 向けアニメーション付きプリミティブ (Radix UI / Base UI / React Aria + Motion) | Switch・Tabs・Accordion・Sliding Number などのばね系の動き。hover / tap / 画面内に入った時の反応 |
| [RetroUI](https://retroui.io/) | ピクセル調 React コンポーネント (React + Tailwind + TypeScript) | ドット枠のボタン・カードなど見た目の方向性そのもの |
| [shadercn](https://www.shadercn.run/) | shadcn レジストリ形式の React シェーダーコンポーネント (vgpu + TypeGPU、WebGPU) | GPU で描く背景演出というアイデア |
| [Bencho](https://bencho.dev/) | インタラクティブな UI ブロック集 | 黒背景に角丸の暗いカードを並べたグリッド。スライダーの目盛りやグラフなど、触ると反応する小さな部品 |
| [Designeer](https://designeer.xyz/) | デザイナー・開発者向けのキュレーションカタログ | 単一のデザインではなく素材集。Portfolios カテゴリで他人のポートフォリオを探す用途に使える |

補足:

- Bencho のフォントは Google Sans / Instrument Sans / Inter。全体はモノトーンで、色はグラフなどのデータ部分にだけ使っている。
- shadercn のコンポーネントは `registry/components/orbs/orb-01` から `orb-33` までの 33 種で、すべて球体 (オーブ) 系。ディザ・ピクセル・CRT・ASCII 系はない。WebGPU 前提なので非対応ブラウザへのフォールバックも必要になる。
- 以下は Claude in Chrome で実際に画面を見た結果 (2026-10-19)。
  - RetroUI: 方眼紙柄の白背景に、黒い太枠のピクセルカード・吹き出し・ドット絵のキラキラを斜めに散らしたヒーロー。差し色はクリーム色と紫。
  - 8bitcn: 黒背景にドット枠のパネルを敷き詰めたダッシュボード風。HP / XP バー、RPG のメニュー、キャラクターの会話吹き出しなど、ゲーム画面そのものの部品が並ぶ。見出しは Press Start 2P 系。
  - Pixelact UI: 黒背景に白い影で描いたピクセル枠。プロフィール画面・コマンドパレット・カレンダーなどアプリ寄りの部品が中心で、8bitcn よりおとなしい。ヒーロー背景にうっすらドットのノイズがある。
  - shadercn: 黒背景に白文字の、shadcn/ui のドキュメントと同じ見た目。オーブのシェーダーを一覧から選んでコピーする構成。
  - Animate UI: shadcn/ui 系の黒背景・白文字。見出しの文字が切り替わるアニメーションがある。
  - Designeer: 左にナビゲーションの縦サイドバー、右に角丸カードのメイソンリーグリッド。黒背景で、作品画像だけに色がある。

## 3. RetroUI の現状と代替候補

retroui.io の実体は [Dksie09/RetroUI](https://github.com/Dksie09/RetroUI) (BSD-3-Clause、Star 484)。最終 push は 2025-05-11 で、直近のコミットも `.DS_Store` の削除のみ。調査時点で約 1 年 5 か月更新がない。

| 候補 | ライセンス | Star | 最終 push | 導入方法 | メモ |
| --- | --- | --- | --- | --- | --- |
| [8bitcn/ui](https://www.8bitcn.com/) | MIT | 2,055 | 2026-10-08 | `shadcn add @8bitcn/<name>` | 約 50 コンポーネント。`health-bar` `mana-bar` `xp-bar` などゲーム風の部品やテーマ・ブロックもある。Vercel OSS Program 採択 |
| [Pixelact UI](https://www.pixelactui.com/) | MIT | 113 | 2026-07-29 | `shadcn add https://pixelactui.com/r/<name>.json` | 約 27 コンポーネント。shadcn と同じ構成で、ピクセル寄りの見た目に絞っている |
| [retroui-svelte](https://retroui-svelte.netlify.app) | 不明 | 74 | 2026-06-13 | - | Svelte 版。Svelte で組むなら候補 |
| [NES.css](https://nostalgic-css.github.io/NES.css/) | MIT | 21,837 | 2024-01-17 | CSS | ファミコン風 CSS フレームワーク。知名度は高いが更新は止まっている |
| [98.css](https://jdan.github.io/98.css) / [XP.css](https://botoxparty.github.io/XP.css/) | MIT | 11,545 / 3,113 | 2025-09 / 2025-03 | CSS | ドットではなく Windows 98 / XP 風。方向性が少し違う |

選び方:

- 8bitcn: 部品数・更新頻度・知名度のどれも一番。迷ったらこれ。
- Pixelact UI: 部品は少ないが見た目がピクセルに寄っていて、手を入れやすい。
- どちらも shadcn レジストリ方式なので、ソースを自分のプロジェクトにコピーして自由に改造できる。ライブラリが止まっても困らない。

## 4. ドット演出 (シェーダー・アニメーション)

[Paper Shaders](https://shaders.paper.design) (Apache-2.0、Star 3,776、2026-10-19 push) は依存なしの canvas シェーダー集で、ドット風に使えるものが揃っている。

- `dithering` / `image-dithering`: ディザリング。アイコンや写真をドット化して見せられる
- `dot-grid` / `dot-orbit`: ドットの格子・軌道
- `halftone-dots` / `halftone-cmyk`: 網点
- `grain-gradient` / `paper-texture`: 粗い質感の背景

shadercn と違い WebGPU 前提ではないので、対応ブラウザの心配が少ない。

動きの部分は次のどちらか。

- [Animate UI](https://animate-ui.com/): ライセンスは MIT + Commons Clause。サイトで使うのは自由だが、コンポーネントそのものを売ったり再配布したりはできない。ポートフォリオ用途なら問題ない。
- Motion を直接使い、Bencho のような小さな反応 (hover でドットが詰まる、数字がパラパラ変わるなど) を自作する。

## 5. フォント

| フォント | 対象 | ライセンス | メモ |
| --- | --- | --- | --- |
| [Geist Pixel](https://vercel.com/font?type=pixel) | 欧文 | OFL-1.1 | 2026-02-06 公開。Square / Grid / Circle / Triangle / Line の 5 種。npm の `geist` パッケージで配布 |
| [DotGothic16](https://fonts.google.com/specimen/DotGothic16) | 和文 + 欧文 | OFL-1.1 | フォントワークス製。Adobe-Japan1-3 をカバー。Google Fonts から読み込める |
| [PixelMplus](https://github.com/itouhiro/PixelMplus) | 和文 + 欧文 | M+ FONT LICENSE | 10px / 12px の 2 種。最終更新 2022-02 |
| [美咲フォント](https://littlelimit.net/misaki.htm) | 和文 | フリーソフトウェア | 8x8 ドット。最新版 2021-05-05。Web フォント利用の可否はサイト上で明記なし |
| [k8x12](https://littlelimit.net/k8x12.htm) | 和文 | フリーソフトウェア | 8x12 ドット。最新版 2021-05-05。同上 |

日本語本文をすべてドットフォントにすると長文が読みにくい。見出し・ラベル・数字をドットフォントにして、本文は普通のゴシック体にする使い分けを想定している。日本語フォントはサイズが大きいので、portfolio-v3 と同じくサブセット化が要る。

## 6. 技術スタック案

既存の [portfolio-v3](../../portfolio-v3) は Astro 7 + `subset-font` + `simple-icons` で作られている。これを踏襲し、次の構成を推す。

- Astro (静的出力)
- Tailwind CSS v4
- React integration (`@astrojs/react`): 8bitcn / Animate UI など shadcn 系を使う部分だけ island にする
- Paper Shaders: ヒーロー背景など
- フォントはサブセット化して自前配信

React を全面採用しないのは、ポートフォリオは静的な部分が大半で、JS を減らしたほうが軽くなるため。

## 7. 掲載する情報

### アカウント

| 名義 | 用途 | リンク |
| --- | --- | --- |
| 音猫｡ | メイン (このポートフォリオの主役) | Twitter [@rin_pineapple](https://twitter.com/rin_pineapple) / GitHub [otnc](https://github.com/otnc) / Misskey [@o@misskey.otnc.dev](https://misskey.otnc.dev/@o) |
| まろん｡ | 大学・日常・技術 | Twitter [@rin_montblank](https://twitter.com/rin_montblank) / Misskey [@m@misskey.otnc.dev](https://misskey.otnc.dev/@m) / ポートフォリオ [montblank.fun](https://montblank.fun) |

@rin_montblank は「もうひとつの顔」として、フッターかプロフィール欄の Links に別枠 (例: `ALT ACCOUNT` / `大学・日常・技術`) で載せる案を考えている。

### 既存リソースから流用できるもの

- GitHub プロフィール README ([otnc/otnc](https://github.com/otnc/otnc)): 自己紹介文 (`I'm swimming in the ocean, forever and ever...`)、スキル一覧 (JS / TS / HTML / CSS / CoffeeScript / Python / Ruby / Go / React / Node.js / Astro / Svelte)、チーム ([@oto-home](https://github.com/oto-home)) と個人 org ([@oto-lab](https://github.com/oto-lab))、Evex Developers のスタッフ、スポンサーリンク
- 旧ポートフォリオ ([my-portfolio](../../my-portfolio)) の作品: Milkee、nekos、ドメインフォ、oto.im、U'n'IVERSE など
- portfolio-v3 の GitHub 連携 (リポジトリ・コントリビューション・アクティビティの取得処理)

## 8. ページ構成のたたき台

1. ヒーロー: ドット化したアイコン (dithering) + 名前 + タイピング風の肩書き
2. About: 自己紹介、スキル (ドットアイコン)、所属
3. Works: 作品カード (ピクセル枠)
4. Activity: GitHub の活動 (XP バーやヘルスバー風の表示で遊べる)
5. Community: Evex Developers / Oto Home
6. Links: 音猫｡のアカウント + まろん｡のアカウント (別枠)
7. Support: GitHub Sponsors / Buy Me a Coffee / Ko-fi

## 9. 決めておきたいこと

- ドメイン: `otoneko.cat` は現在 Misskey (`Devuloper Posts`) を配信している。ポートフォリオをどのドメインに置くか
- 配色: ゲームボーイ風の 4 階調、ファミコン風、モノクロ + 差し色 1 色など、方向性
- まろん｡側の情報 (大学名・経歴など) をどこまでこちらにも載せるか
- Works に載せる作品の選定
- ダークモード / ライトモードの両対応にするか

## 出典

- [Animate UI](https://animate-ui.com/) / [imskyleen/animate-ui](https://github.com/imskyleen/animate-ui)
- [RetroUI](https://retroui.io/) / [Dksie09/RetroUI](https://github.com/Dksie09/RetroUI)
- [shadercn](https://www.shadercn.run/) / [shadcn-labs/shadercn](https://github.com/shadcn-labs/shadercn)
- [Bencho](https://bencho.dev/)
- [Designeer](https://designeer.xyz/)
- [8bitcn/ui](https://www.8bitcn.com/) / [TheOrcDev/8bitcn-ui](https://github.com/TheOrcDev/8bitcn-ui)
- [Pixelact UI](https://www.pixelactui.com/) / [pixelact-ui/pixelact-ui](https://github.com/pixelact-ui/pixelact-ui)
- [shadcn/ui Registry: Pixelact UI](https://shadcnregistry.com/pixelact-ui)
- [8bitcn/ui (allshadcn)](https://allshadcn.com/components/8bitcnui/)
- [21st.dev: 8-bit Button](https://21st.dev/@theorcdev/components/8bit-button)
- [NES.css](https://github.com/nostalgic-css/NES.css) / [98.css](https://github.com/jdan/98.css) / [XP.css](https://github.com/botoxparty/XP.css)
- [Paper Shaders](https://github.com/paper-design/shaders)
- [Introducing Geist Pixel](https://vercel.com/blog/introducing-geist-pixel) / [vercel/geist-font](https://github.com/vercel/geist-font)
- [DotGothic16](https://fonts.google.com/specimen/DotGothic16)
- [PixelMplus](https://github.com/itouhiro/PixelMplus)
- [美咲フォント](https://littlelimit.net/misaki.htm) / [k8x12](https://littlelimit.net/k8x12.htm)
