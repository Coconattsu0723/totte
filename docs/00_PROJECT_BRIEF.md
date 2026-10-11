# totte Project Brief

更新日：2026-10-10  
正式なプロジェクトルート：`/Users/natsumikato/Documents/Portfolio/totte`

## 1. プロジェクト概要

| 項目 | 内容 | 区分 |
|---|---|---|
| Project Name | totte（トッテ） | 決定済み |
| Category | ポートフォリオ制作候補 No.16「業務Dashboard / Web App」 | 決定済み |
| Product Type | カフェ向け売上・在庫管理Webアプリ | 決定済み |
| Key Message | お店の毎日を、ひとつに整える。 | 決定済み |
| Concept | 必要な情報に手が届き、日々の業務を扱いやすくする。 | 決定済み |
| Logo | 「取っ手」と小文字の `t` を組み合わせたシンボル＋独自ワードマーク | 決定済み |
| Primary Language | 日本語 | 決定済み |
| Stores | 3店舗程度 | 初期案 |
| Store Names | 中央通り本店・北口駅前店・水辺公園店 | 決定済み |
| Primary User | 各店舗の店長 | 初期案 |

旧仮称「mise」は使用しない。正式ロゴは `assets/images/brand/` 配下のSVGを使用する。

## 2. Target / Problem / Goal

### Target

3店舗ほどを展開する小規模カフェの各店舗店長。開店前の在庫確認、営業後の売上確認、補充手配を日常的に行う。

### User Problem

売上と在庫を別々に確認しているため、営業状況を踏まえた補充判断と発注着手に時間がかかる。

### Product Value

営業状況と在庫不足をひとつの画面群で把握し、不足品の確認から発注、入荷後の在庫反映まで迷わず進められる。

### Business / Portfolio Goal

- 複数データを整理する業務ダッシュボードの情報設計力を示す。
- 日常業務の主要導線と、確認・完了・二重処理防止を含む状態設計を示す。
- 温かみと可読性を両立するBtoB業務UIを、レスポンシブ実装まで一貫して制作する。

## 3. Primary / Secondary Actions

### Primary action

在庫不足を見つけ、対象店舗・品目を引き継いだ発注を作成・確認・確定する。

### Secondary actions

- 当日および期間指定の売上・客数・客単価を確認する。
- 入荷待ち数量を確認し、重複発注を避ける。
- 入荷済みに変更し、在庫数へ反映する。
- 店舗を切り替え、選択状態を全画面へ引き継ぐ。

## 4. Pages and initial scope

1. ダッシュボード
2. 売上分析
3. 在庫管理
4. 発注管理

在庫品目は豆・牛乳・カップなど12〜16点程度。HTML / CSS / Vanilla JavaScript と架空データを基本とし、変更内容はブラウザ内へ保存する。

正式な架空データは14品目とし、仕入先を「森灯ロースタリー／朝原デイリー／風見フーズ／丸葉パッケージ」の4分類で設定する。発注番号は `PO-YYYYMMDD-連番`、日付は日単位で表示する。

### Out of scope

- 実際のPOS連携
- サーバー、アカウント認証
- 仕入先への発注送信
- レシピごとの材料消費
- 賞味期限管理

## 5. Core workflow

`ダッシュボードの在庫アラート → 在庫確認 → 発注作成・確認・確定 → 入荷処理 → 在庫への数量反映`

必須条件：

- 発注フォームへ店舗と品目を引き継ぐ。
- 入荷待ち数量を表示し、重複発注に気づけるようにする。
- 入荷処理済みの発注は二度処理できないようにする。

## 6. Data definitions

| 項目 | 定義 |
|---|---|
| 客単価 | 売上 ÷ 客数。客数0の場合は「—」 |
| 売上分析の前期間比 | 同じ日数の直前期間との比較 |
| ダッシュボード売上カード | 前日比 |
| 要補充 | 現在庫が品目ごとの補充基準以下 |
| 在庫単位 | 品目ごとに固定 |
| 発注ステータス | 「発注済み／入荷済み」 |
| 在庫状態と発注状態 | 別々に表示 |
| 店舗選択 | 全画面で引き継ぐ |
| 日付選択 | 売上情報に適用 |
| 在庫・発注の時点 | 現在の状態を表示し、画面上で「現在」と明記 |

## 7. Dashboard information architecture

### Desktop（1440px主軸）

- 左サイドバー：約224px
- メイン領域の左右余白：32px
- ヘッダー：店舗切り替え、利用者メニュー
- 冒頭：画面名、対象日
- 上段：売上・客数・客単価の3カード
- 中段左：約60%／過去7日間の売上推移
- 中段右：約40%／要補充の在庫
- 下段：入荷待ちの発注一覧

ワイヤーフレーム用数値：売上84,000円、客数120人、客単価700円。

### Mobile content order

`店舗・対象日 → 数値 → 要補充の在庫 → 売上推移 → 入荷待ち`

## 8. Brand and tone

- Tone & Mood：温かみ、明るさ、落ち着き、扱いやすさ、信頼感。
- Logo Concept：「totte＝取っ手」と「必要な情報に手が届く」を、取っ手のアーチと小文字の `t` に統合する。
- Wordmark：既存UIの丸みと合わせた、低いコントラストのストロークと丸い端部を持つ独自字形。
- 背景：薄いウォームグレー。
- Surface：白。
- Primary：深いグリーン。
- Text：チャコール。
- Warning：アンバー候補。
- Error：赤候補。
- 状態は色だけに依存せず、文字とアイコンを併用する。
- 日本語フォント候補：Noto Sans JP。

## 9. Common UI and states

Navigation、Button、Input、Status、Data Table、Modal、Toastを共通化する。通常、Focus、Disabled、Processing、Empty、Input Error、Confirm、Completeを必要な範囲で設計する。

## 10. Reference research summary

調査日：2026-10-10。参考は情報設計・操作・状態表現の根拠として使用し、見た目やコピーは複製しない。

- [Square Inventory Management](https://squareup.com/us/en/point-of-sale/features/inventory-management)：低在庫の把握、複数拠点の在庫、発注管理を一つの管理画面で扱う考え方を確認。totteでは「不足の発見から発注へ」を主要導線にする。
- [Square Support: Track your inventory](https://api.squareup.com/help/us/en/article/7746-tracking-your-inventory-with-square-for-retail)：低在庫通知から補充準備へ進む実務フローを確認。ダッシュボードの在庫アラートを行動の入口にする。
- [Lightspeed: Managing purchase orders and deliveries](https://o-series-support.lightspeedhq.com/hc/en-us/articles/31330392951963-Sending-purchase-orders-receiving-stock-deliveries)：入荷処理で在庫が更新されるフローを確認。totteでは「発注済み／入荷済み」を明示し、入荷済みの二重処理を防止する。
- [Shopify Polaris: Color](https://polaris-site-prod-kit.shopify.prod.shopifyapps.com/design/colors)：色だけで意味を伝えず、ラベルやアイコンと併用する原則を採用する。
- [IBM Design Language: Data visualization basics](https://www.ibm.com/design/language/data-visualization/design/basics/)：グリッドや軸要素を増やしすぎず、単位と変化を読み取れる密度にする。

## 11. Current phase

2026年10月11日に制作完了。企画、情報設計、ワイヤーフレーム、主要状態、レスポンシブ、ビジュアルデザイン、HTML / CSS / Vanilla JavaScript実装、公開後QA、README、ケーススタディ原稿まで完了している。主要4画面と発注・入荷フローはブラウザで動作確認済み。正式ロゴをSVGで制作し、サイドバー、ナビゲーションレール、モバイルヘッダー、faviconへ反映した。GitHub Pages（`https://coconattsu0723.github.io/totte/`）で公開済み。本番URLのcanonical、OGP、favicon、404、Consoleを確認し、公開後QAで見つかった中間幅の一覧とボタン改行も修正・再公開・本番確認まで完了している。

