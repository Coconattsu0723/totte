# totte project instructions

## Project root

- 正式なプロジェクトルートは `/Users/natsumikato/Documents/Portfolio/totte`。
- 企画、調査、デザイン正本、書き出し画像、実装、制作記録はすべてこの配下へ置く。

## Required reading

作業開始時に、ユーザーの最新指示、`/Users/natsumikato/.codex/skills/common-web-design/SKILL.md`、次の文書の順で確認する。

1. `docs/00_PROJECT_BRIEF.md`
2. `docs/01_SITE_STRUCTURE.md`
3. `docs/02_DESIGN_RULES.md`
4. `docs/04_IMPLEMENTATION_NOTES.md`
5. `docs/05_DECISIONS_LOG.md`
6. `docs/06_HANDOFF.md`
7. `docs/07_PORTFOLIO_CASE_STUDY.md`

## Scope and constraints

- プロジェクト名は `totte（トッテ）`。旧仮称 `mise` は使用しない。
- 小規模カフェ3店舗の店長向け、売上・在庫・発注を扱う業務Webアプリを制作する。
- 初期対象は「ダッシュボード／売上分析／在庫管理／発注管理」の4画面と主要状態。
- 実装は HTML / CSS / Vanilla JavaScript と架空データを基本とし、変更内容はブラウザ内へ保存する。
- POS連携、サーバー、認証、仕入先への実送信、レシピ別材料消費、賞味期限管理は初期範囲外。
- 店舗名は「中央通り本店・北口駅前店・水辺公園店」を正式な架空名称として使用する。
- 正式ロゴは `assets/images/brand/` 配下のSVGを使用する。形状・色・比率を変更する場合は `docs/02_DESIGN_RULES.md` と `docs/05_DECISIONS_LOG.md` も更新する。
- 主要仕様を変える場合は、デザイン・実装だけでなく正式文書も更新する。

## Design source and QA

- Pencilのデザイン正本は `design/pencil/` 配下で1ファイルに定める。重複する正本候補を作らない。
- デザイン更新後はスクリーンショットを書き出し、文字切れ、重なり、余白、階層、状態表現を目視確認する。
- 実装QAの代表幅は 375 / 390 / 768 / 1024 / 1366 / 1440px。

