(function () {
  var STORE_URL = 'https://thesilver0913.github.io/ulexite-store/v1/store.json';
  var CAT = { tools: 'ツール', info: '情報', media: 'メディア', other: 'その他' };
  var QUEST = { yes: '対応', no: '非対応', check: '要確認' };
  var LOADING = { none: 'なし', low: '少なめ', high: '多め' };

  var root = document.getElementById('app-detail');
  var id = document.body.getAttribute('data-app-id');
  if (!root || !id) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ja(obj) { return obj && (obj.ja || obj.en) || ''; }
  function color(c) { return /^#[0-9a-fA-F]{3,8}$/.test(c || '') ? c : '#16181b'; }
  function catName(c) { return CAT[c] || c || 'アプリ'; }
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function render(app) {
    var title = ja(app.name);
    var summary = ja(app.summary);
    var version = app.version || '';

    document.title = title + ' — Ulexite アプリストア';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', summary);

    var titleEl = document.getElementById('app-title');
    var summaryEl = document.getElementById('app-summary');
    var metaEl = document.getElementById('app-meta');
    var iconEl = document.getElementById('app-icon');
    if (titleEl) titleEl.textContent = title;
    if (summaryEl) summaryEl.textContent = summary;
    if (metaEl) {
      metaEl.innerHTML =
        '<span class="badge">v' + esc(version) + '</span>' +
        '<span>' + esc(catName(app.category)) + '</span>' +
        '<span>' + (app.official ? '公式' : '提携') + '</span>' +
        '<span>' + esc(app.author || '') + '</span>';
    }
    if (iconEl) {
      iconEl.style.background = color(app.color);
      iconEl.innerHTML = app.iconUrl ? '<img src="' + esc(app.iconUrl) + '" alt="">' : '';
    }

    var html = '';
    if (app.description && ja(app.description)) {
      html += '<p>' + rich(ja(app.description)) + '</p>';
    }

    if (app.releaseNotes && ja(app.releaseNotes)) {
      html += '<h2>バージョン ' + esc(version) + ' の変更</h2>';
      html += '<p class="app-detail-text">' + rich(ja(app.releaseNotes)) + '</p>';
    }

    if (app.credits && ja(app.credits)) {
      html += '<h2>クレジット</h2><p>' + rich(ja(app.credits)) + '</p>';
    }

    html += '<h2>仕様</h2><div class="table-wrap"><table><tbody>';
    html += '<tr><th>アプリ ID</th><td><code>' + esc(app.id) + '</code></td></tr>';
    html += '<tr><th>パッケージ</th><td><code>' + esc(app.package || '') + '</code></td></tr>';
    html += '<tr><th>バージョン</th><td>' + esc(version) + '</td></tr>';
    html += '<tr><th>作者</th><td>' + esc(app.author || '') + '</td></tr>';
    html += '<tr><th>カテゴリ</th><td>' + esc(catName(app.category)) + '</td></tr>';
    html += '<tr><th>Quest</th><td>' + esc(QUEST[app.quest] || app.quest || '—') + '</td></tr>';
    html += '<tr><th>画像の読み込み</th><td>' + esc(LOADING[app.imageLoading] || app.imageLoading || '—') + '</td></tr>';
    html += '<tr><th>必要な Ulexite TV</th><td>' + esc(app.minUlexite || '—') + '</td></tr>';
    if (app.profiles && app.profiles.length) {
      html += '<tr><th>端末</th><td>' + esc(app.profiles.join('・')) + '</td></tr>';
    }
    html += '</tbody></table></div>';

    if (app.url) {
      html += '<h2>ダウンロード</h2>';
      html += '<p><a class="btn btn--primary" href="' + esc(app.url) + '" target="_blank" rel="noopener">zip をダウンロード</a></p>';
      html += '<p class="muted">審査した版（v' + esc(version) + '）です。アプリストアの公開後は、ストアから入れられます。</p>';
      if (app.sha256) {
        html += '<p class="app-detail-hash">SHA-256: <code>' + esc(app.sha256) + '</code></p>';
      }
    }

    html += '<p><a href="../index.html">← アプリストアに戻る</a></p>';
    root.innerHTML = html;
  }

  fetch(STORE_URL, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) {
      var app = (data.apps || []).filter(function (a) { return a.id === id; })[0];
      if (!app) throw new Error('not found');
      render(app);
    })
    .catch(function () {
      root.innerHTML = '<p class="store-error">アプリの情報を読み込めませんでした。時間をおいて、もう一度お試しください。</p>';
    });
})();
