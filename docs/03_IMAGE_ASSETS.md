# totte Image Assets

更新日：2026-10-11

## 1. 方針

在庫・発注の品目を短時間で識別できるよう、14品目に背景透過の商品サムネイルを使用する。実在ブランドの包装は再現せず、店舗で実際の資材を撮影して切り抜いたような、無地に近い商品写真として統一する。

- 用途：在庫アラート、在庫一覧、発注一覧、発注・入荷ダイアログ
- 表示領域：44px角
- 元画像：長辺256px、PNG、透過背景
- 表現：自然な紙・樹脂・ガラスの質感、やわらかな拡散光、低いコントラスト、わずかな折れや個体差
- 構図：資材1点のみを正面〜わずかな斜め方向で撮影し、全体を表示する
- 禁止：ブランド名、読める商品名、価格、透かし、背景矩形、過度な艶、CG的な造形
- 添え物：豆、オーツ、粉、葉、スプーン、飲料など、資材の周囲に内容物や演出物を置かない
- アクセシビリティ：品目名が隣接するため画像の `alt` は空とする

## 2. 正式素材

| ID | 品目 | ファイル |
|---|---|---|
| beans-dark | 深煎りブレンド | `assets/images/products/beans-dark.png` |
| beans-light | 浅煎りブレンド | `assets/images/products/beans-light.png` |
| beans-decaf | デカフェ豆 | `assets/images/products/beans-decaf.png` |
| milk | 牛乳 1L | `assets/images/products/milk.png` |
| oat-milk | オーツミルク 1L | `assets/images/products/oat-milk.png` |
| syrup | バニラシロップ | `assets/images/products/syrup.png` |
| cocoa | ココアパウダー | `assets/images/products/cocoa.png` |
| matcha | 抹茶パウダー | `assets/images/products/matcha.png` |
| cup-s | 紙カップ S | `assets/images/products/cup-s.png` |
| cup-m | 紙カップ M | `assets/images/products/cup-m.png` |
| lid-m | カップ蓋 M | `assets/images/products/lid-m.png` |
| napkin | ペーパーナプキン | `assets/images/products/napkin.png` |
| straw | ストロー | `assets/images/products/straw.png` |
| takeout-bag | テイクアウト袋 | `assets/images/products/takeout-bag.png` |

## 3. 制作情報

OpenAIの組み込みImageGenで、品目ごとに個別生成した。添付された参考写真は、無彩色寄りのパッケージ、自然な素材感、簡潔な商品撮影の方向だけに使用し、ラベル・文字・ロゴ・構図は複製していない。共通プロンプトでは、背景透過、資材1点のみ、店舗で撮影したような自然な質感、文字・ブランド・透かし・内容物・装飾小物なしを指定した。生成後、透過を維持したまま長辺256pxへ縮小し、プロジェクト内へ格納した。

14点は同じ表示領域へ `object-fit: contain` で配置し、個別の切り抜き位置をCSSで調整しない。これにより、品目追加時も同じ規則で運用できる。

## 4. 公開用OGP

- ファイル：`assets/images/brand/totte-ogp.png`
- サイズ：1200 × 630px
- 用途：GitHub Pages公開時のOGP / Twitter Card
- 内容：正式な反転ロゴ、サービス説明、ダッシュボードを抽象化した表示
- 正本：`design/pencil/totte-dashboard-desktop.pen` 内の `OGP / totte GitHub Pages`
- 画像生成AIは使用せず、既存のブランドトークンとUI要素で構成した。
