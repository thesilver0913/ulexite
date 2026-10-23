# Ulexite 公式サイト

Ulexite TV の公式サイトです。**公開 URL: https://thesilver0913.github.io/ulexite/**

- 静的な HTML・CSS と、小さな JavaScript。ビルドなし
- 外部のフォント・解析は読み込まない（プライバシーポリシーを簡単に保つため）
- ページ：トップ、アプリストア、導入ガイド、開発者ガイド（1・3・4・6・7・9章）、リリースノート、不具合の報告
- 色は紙の白と濃い青。ロゴは `assets/img/logo/`
- ヘッダーのメガメニューは `assets/js/nav.js`。項目は「製品・入手・サポート」で、**アプリストアだけはメガメニューを出さず `apps/` の専用ページへ**。`?menu=products` で開いた状態を確認できます
- ページの確認：`python tools/check.py`（リンク切れ・`id` の重複・タグの対応）
