# Ulexite 公式サイト

GitHub Pages で公開している静的なサイト。**公開 URL は `https://thesilver0913.github.io/ulexite/`**（リポジトリ `thesilver0913/ulexite`、`main` の root）。書くのは claude.ai の広報のセッション。ロードマップ 19（構想ノート 36）。

- HTML と CSS だけ（ビルドなし）。外部のフォントや解析は読み込まない（プライバシーポリシーを簡単に保つため）
- 色は Ulexite Store の「素材と色」とロゴ（`docs/design/logo-v2/`）に合わせている。共通の見た目は `assets/css/site.css`（下層ページ用の `.prose`・`.release` などもここ）
- 画面の見本は HTML と CSS で描いた「イメージ」。ワールドで撮った本物の画面ができたら差し替える（デザインキャンバスの PNG は `[...]` の仮の文字が入っているので使わない）
- 英語は後から `en/` に足す
- ページを作り直したら `python tools/check.py` で、リンク切れ・`id` の重複・タグの対応を確かめる
- **リンクはフォルダではなく `index.html` まで書く**（`developers/index.html`）。`developers/` だと、GitHub Pages では動くが、手元の HTML をブラウザで開いたときにフォルダの一覧になってしまう

## ページ

| ページ | 状態 |
| --- | --- |
| `index.html`（トップ） | 公開中。Community Labs の Ulexite Store を案内 |
| `guide/index.html`（導入ガイド） | 公開中。テスト版の手順。公開後に VCC の手順を足す |
| `developers/index.html`（開発者ガイドの目次と1章） | 公開中 |
| `developers/declarative.html`（4章 データで書くアプリ） | 公開中 |
| `developers/design.html`（6章 デザイン言語） | 公開中 |
| `developers/rules.html`（7章 守ること） | 公開中 |
| `releases/index.html`（リリースノート） | 公開中。0.3.0・0.2.0・開発キット・時計 |
| プライバシーポリシー・利用規約・お布施 | 未着手（今は ulexite-catalog の Pages にリンクしている） |

## 公開のしかた

`ulexite.github.io` は使えない（GitHub のユーザー名 `ulexite` がすでに使われていて、同名の組織も作れない）。いまは `thesilver0913` の下のリポジトリで、プロジェクト Pages（`/ulexite/`）として公開している。

- リポジトリ：`thesilver0913/ulexite`（公開、`main` の root を Pages で配信）
- 初回だけ：`git init` → `git add .` → `git commit` → `gh repo create thesilver0913/ulexite --public --source=. --remote=origin --push` → Pages を `main` / `/` で有効にする
- 更新：`git add .` → `git commit` → `git push`（1〜2分で Pages に反映）
- カスタムドメインに移すときは、`canonical`・`og:url`・`og:image`・`sitemap.xml`・`robots.txt`・`404.html` の URL をまとめて直す

Pages 用のファイル：

- `.nojekyll`：Jekyll を通さない
- `404.html`：見つからないページ（絶対 URL で書いてある）
- `robots.txt`・`sitemap.xml`：検索向け
- `assets/img/og.png`：SNS で共有されたときの画像（1200×630）

## 開発者ガイドの写し方

- 正本は `docs/dev-guide/`（1・4・6・7章が書けた章）。サイトはそれを HTML に書き写した**写し**なので、章を直したらサイトも同じ変更で直す
- 準備中の章（2・3・5・8・9）は、サイトでは目次に「準備中」と書くだけにして、ページを作らない
- 章のページは `developers/<名前>.html`。前後の章へのリンク（`.pager`）を付ける

## 公開後にやること

- 「VCC に追加」の URL、BOOTH の URL（いまは「準備中」で押せない）
- プライバシーポリシー・利用規約を ulexite-catalog から移すか、リンクのままにするか
- Store の「入手方法」の画面（`getting_started.png`）の `ulexite.github.io` を、このサイトの URL に直す（store-3d・store-unity）
- プロフィールのウェブサイトと固定投稿の `[URL]` を、このサイトの URL にする（`docs/sns.md`）
