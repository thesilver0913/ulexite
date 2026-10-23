# Ulexite 公式サイト

Ulexite TV の公式サイトです。**公開 URL: https://thesilver0913.github.io/ulexite/**

- 静的な HTML・CSS と、小さな JavaScript。サイトのビルドはなし（アプリ個別ページだけ `tools/build-app-pages.py` で生成）
- 外部のフォント・解析は読み込まない（プライバシーポリシーを簡単に保つため）
- ページ：トップ、アプリストア（GitHub の JSON カタログから一覧を描画）、アプリ個別（時計・天気・METAR）、導入ガイド、開発者ガイド（1・3・4・6・7・9章）、リリースノート、不具合の報告
- 色は紙の白と濃い青。ロゴは `assets/img/logo/`
- ヘッダーのメガメニューは `assets/js/nav.js`。項目は「製品・入手・サポート」で、**アプリストアだけはメガメニューを出さず `apps/` へ直接**。`?menu=products` で開いた状態を確認できます
- アプリの一覧は `assets/js/store.js` が `https://thesilver0913.github.io/ulexite-store/v1/store.json` を読みます。個別ページは `python tools/build-app-pages.py <store.json>` で生成（`assets/js/app-detail.js` が本文を描画）
- ページの確認：`python tools/check.py`（リンク切れ・`id` の重複・タグの対応）
