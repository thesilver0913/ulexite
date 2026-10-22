"""サイトの HTML を確かめる（リンク切れ・id・タグの対応）。

    python tools/check.py

ulexite-site/ の中の .html を読み、次を見る。
- タグの開き閉じが対応しているか
- href / src の指すファイルがあるか（外部 URL は除く）
- #名前 の指す id があるか
- 同じ id が2回出ていないか
"""
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}


class Check(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        for key in ("href", "src"):
            if key in a and a[key]:
                self.links.append(a[key])
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        for key in ("href", "src"):
            if key in a and a[key]:
                self.links.append(a[key])

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append("閉じだけのタグ </%s>" % tag)
            return
        top, pos = self.stack[-1]
        if top == tag:
            self.stack.pop()
        else:
            self.errors.append("対応しない閉じ </%s>（開いているのは <%s>、%d 行目）"
                               % (tag, top, pos[0]))


def main():
    pages = {}
    for base, _dirs, files in os.walk(ROOT):
        if os.path.basename(base) in (".git", "assets"):
            continue
        for name in files:
            if name.endswith(".html"):
                pages[os.path.join(base, name)] = None

    problems = 0
    for path in sorted(pages):
        with open(path, encoding="utf-8") as f:
            text = f.read()
        c = Check()
        c.feed(text)
        c.close()
        for tag, pos in c.stack:
            c.errors.append("閉じていないタグ <%s>（%d 行目）" % (tag, pos[0]))
        for i in set(c.ids):
            if c.ids.count(i) > 1:
                c.errors.append("id が重複: %s" % i)

        for link in c.links:
            if re.match(r"^(https?:|mailto:|data:|//)", link):
                continue
            if link.endswith("/"):
                c.errors.append("末尾が / のリンク（手元のファイルで開くと一覧になる）: %s" % link)
                continue
            target, _, frag = link.partition("#")
            target = target.split("?")[0]
            if target.startswith("/"):
                c.errors.append("ルート相対のリンク: %s" % link)
                continue
            dest = os.path.normpath(os.path.join(os.path.dirname(path), target)) if target else path
            if target.endswith("/"):
                dest = os.path.join(dest, "index.html")
            if not os.path.exists(dest):
                c.errors.append("リンク先がない: %s" % link)
                continue
            if frag:
                with open(dest, encoding="utf-8") as f:
                    if ('id="%s"' % frag) not in f.read():
                        c.errors.append("id がない: %s" % link)

        rel = os.path.relpath(path, ROOT)
        if c.errors:
            problems += len(c.errors)
            print("%s" % rel)
            for e in c.errors:
                print("  - " + e)
        else:
            print("%s  OK" % rel)

    print("\n%d ページ、%d 件の問題" % (len(pages), problems))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
