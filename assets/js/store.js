(function () {
  var STORE_URL = 'https://thesilver0913.github.io/ulexite-store/v1/store.json';
  var CAT = { tools: 'ツール', info: '情報', media: 'メディア', other: 'その他' };
  var CAT_COLOR = { tools: '#16181b', info: '#22344d', media: '#d33a2c', other: '#4b5563' };
  var CAT_ICON = {
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
    media: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.8"/></svg>'
  };

  var feature = document.getElementById('store-feature');
  var grid = document.getElementById('store-grid');
  var cats = document.getElementById('store-cats');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function color(c) { return /^#[0-9a-fA-F]{3,8}$/.test(c || '') ? c : '#16181b'; }
  function ja(obj) { return obj && (obj.ja || obj.en) || ''; }
  function catName(c) { return CAT[c] || c || 'アプリ'; }
  function icon(a) {
    return a.iconUrl
      ? '<img src="' + esc(a.iconUrl) + '" alt="" loading="lazy">'
      : '';
  }

  function appCard(a) {
    return '<a class="store-card" href="' + esc(a.id) + '/">' +
      '<span class="store-card__icon" style="background:' + color(a.color) + '">' + icon(a) + '</span>' +
      '<h3>' + esc(ja(a.name)) + '</h3>' +
      '<p>' + esc(ja(a.summary)) + '</p>' +
      '<span class="store-card__meta"><span class="store-card__cat">' + esc(catName(a.category)) + '</span>' +
      '<span class="store-pill">v' + esc(a.version) + '</span></span>' +
    '</a>';
  }

  function featureCard(a) {
    return '<a class="store-feature" href="' + esc(a.id) + '/">' +
      '<div class="store-feature__copy">' +
        '<p class="store-feature__eyebrow">Featured</p>' +
        '<h3>' + esc(ja(a.name)) + '</h3>' +
        '<p>' + esc(ja(a.summary)) + '</p>' +
        '<span class="store-pill store-pill--dark">v' + esc(a.version) + '</span>' +
      '</div>' +
      '<div class="store-feature__art"><div class="store-feature__icon" style="background:' + color(a.color) + '">' + icon(a) + '</div></div>' +
    '</a>';
  }

  function sideCard(a) {
    return '<a class="store-side" href="' + esc(a.id) + '/" style="background:' + color(a.color) + '">' +
      '<span class="store-side__eyebrow">Today</span>' +
      '<span class="store-side__icon">' + icon(a) + '</span>' +
      '<h3>' + esc(ja(a.name)) + '</h3>' +
      '<p>' + esc(ja(a.summary)) + '</p>' +
      '<span class="store-side__more">アプリを見る →</span>' +
    '</a>';
  }

  function render(data) {
    var apps = (data.apps || []).filter(function (a) { return a.kind !== 'core'; });
    if (!apps.length) throw new Error('no apps');

    var featured = apps.filter(function (a) { return a.id === 'clock'; })[0] || apps[0];
    var side = apps.filter(function (a) { return a.id !== featured.id; })[0];
    if (feature) {
      feature.className = 'store-feature-row' + (side ? '' : ' is-single');
      feature.innerHTML = featureCard(featured) + (side ? sideCard(side) : '');
    }
    if (grid) grid.innerHTML = apps.map(appCard).join('');

    var counts = {};
    apps.forEach(function (a) { var c = a.category || 'other'; counts[c] = (counts[c] || 0) + 1; });
    if (cats) {
      cats.innerHTML = Object.keys(counts).map(function (c) {
        return '<a class="store-cat" href="#apps">' +
          '<span class="store-cat__icon" style="background:' + (CAT_COLOR[c] || '#4b5563') + '">' + (CAT_ICON[c] || CAT_ICON.other) + '</span>' +
          '<strong>' + esc(catName(c)) + '</strong><small>' + counts[c] + '</small>' +
        '</a>';
      }).join('');
    }
  }

  fetch(STORE_URL, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(render)
    .catch(function () {
      if (feature) feature.innerHTML = '';
      if (cats) cats.innerHTML = '';
      if (grid) grid.innerHTML = '<p class="store-error">アプリの一覧を読み込めませんでした。時間をおいて、もう一度お試しください。</p>';
    });
})();
