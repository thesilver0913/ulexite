# フォントの作り方
`assets/fonts/` の woff2 と `assets/css/fonts.css` は `build-fonts.py` で作る。

- 元：Noto Sans CJK JP 2.004（Light・Regular・Bold。Noto Sans JP と同じ字形。SIL Open Font License 1.1、`assets/fonts/OFL.txt`）
- 入れる字：英数字・記号・かな（JIS の非漢字）と、JIS 第1・第2水準の漢字。漢字は Unicode の順に10個に分け、ページで使った字の入った分だけをブラウザが読む
- 太さ：400・700（本文と見出し）。300 は英数字・かなだけ（大きな時計の数字用）
- 大きさの目安：400・700 が各 約1.1MB（全部読んだ場合）、300 が 約80KB
- Google Fonts は使わない（見た人の IP アドレスが Google に送られるため。プライバシーポリシーを簡単に保つ）

## 作り直すとき

Noto Sans CJK の `.ttc`（`/usr/share/fonts/opentype/noto/`）と fontTools が要る。woff2 の圧縮に brotli のモジュールがなければ、`brotli_shim.py` を `brotli.py` という名前で置いたフォルダを `PYTHONPATH` に足す（libbrotli を直接呼ぶ代わりの小さなモジュール）。

```
mkdir shim && cp brotli_shim.py shim/brotli.py
PYTHONPATH=shim python3 build-fonts.py
# out/ にできたものを assets/fonts/ と assets/css/fonts.css に置く
```

# ページの確かめ方

`check.py` は、サイトの HTML を読んで次を確かめる（Python 3 だけで動く）。

- タグの開き閉じが対応しているか
- `href` / `src` の指すファイルがあるか（外部 URL は除く）
- `#名前` の指す `id` があるか、同じ `id` が2回出ていないか
- 末尾が `/` のリンクがないか（手元のファイルで開くとフォルダ一覧になってしまう）

```
python3 check.py
```

問題があればページ名と内容が出て、終了コードが 1 になる。文章を足したりリンクを張ったりしたら、コミットの前に1回動かす。

# アプリ個別ページの作り方

`build-app-pages.py` は、アプリストアのカタログ JSON（`ulexite-store/v1/store.json`）から `apps/<id>/index.html` を作る。本文は `assets/js/app-detail.js` が同じ JSON から描く。

```
python tools/build-app-pages.py https://thesilver0913.github.io/ulexite-store/v1/store.json
```

カタログにアプリを足したら、このコマンドを実行して個別ページも足す（一覧は `assets/js/store.js` が実行時に読むので自動で増える）。
