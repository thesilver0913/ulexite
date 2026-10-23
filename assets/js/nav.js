(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var brand = nav.querySelector('.nav__brand');
  var links = Array.prototype.slice.call(document.querySelectorAll('#nav-links a'));
  if (!brand || !links.length) return;
  if (window.matchMedia('(max-width: 820px)').matches) return;

  var brandHref = brand.getAttribute('href') || 'index.html';
  if (!/index\.html$/.test(brandHref)) return;
  var prefix = brandHref.replace(/index\.html$/, '');

  var MENUS = {
    products: {
      eyebrow: 'Products',
      title: 'ワールドに、テレビを。',
      lead: 'VRChat のワールドに置く、アプリで広がるテレビ。リモコンひとつで、みんなで同じ画面を見られます。',
      groups: [
        { title: '見る', links: [
          { label: 'Ulexite TV とは', note: 'テレビの全体像', href: 'index.html#tv' },
          { label: 'できること', note: 'アプリ・操作・置き場所', href: 'index.html#features' },
          { label: 'Ulexite Store', note: '触って試せるデモワールド', href: 'index.html#store' }
        ] },
        { title: 'これから', links: [
          { label: 'アプリ', note: '入っているアプリと、これから', href: 'index.html#apps' },
          { label: 'ロードマップ', note: 'Ulexite のこれから', href: 'index.html#roadmap' },
          { label: 'リリースノート', note: '変更の記録', href: 'releases/index.html' }
        ] }
      ]
    },
    get: {
      eyebrow: 'Get Ulexite',
      title: '入手する。',
      lead: 'いまはテスト版を、試してくださる方にお渡ししています。VCC と BOOTH からの配布は、公開の準備ができてから。',
      groups: [
        { title: 'いま', links: [
          { label: '入手方法', note: 'テスト版の配布', href: 'index.html#get' },
          { label: '導入ガイド', note: 'ワールドへの入れ方', href: 'guide/index.html' },
          { label: 'Ulexite Store', note: '触って試す', href: 'index.html#store' }
        ] },
        { title: '公開後', links: [
          { label: 'BOOTH（準備中）', note: '商品ページは公開前', href: 'index.html#get' },
          { label: 'VCC に追加（準備中）', note: '公開後にここから', href: 'index.html#get' },
          { label: 'リリースノート', note: '変更の記録', href: 'releases/index.html' }
        ] }
      ]
    },
    apps: {
      eyebrow: 'App Store',
      title: 'アプリで、広がる。',
      lead: '動画も、天気も、音楽も。ホームに並ぶアプリから選ぶだけ。アプリストアは公開の準備をしています。',
      groups: [
        { title: 'アプリ', links: [
          { label: 'アプリ一覧', note: '入っているアプリと、これから', href: 'index.html#apps' },
          { label: '動画', note: 'おすすめから選んで再生', href: 'index.html#apps' },
          { label: '時計・天気', note: 'くらしのアプリ', href: 'index.html#apps' },
          { label: '音楽・ラジオ', note: '流しっぱなしにしたい音', href: 'index.html#apps' }
        ] },
        { title: 'つくる', links: [
          { label: '開発者ガイド', note: '全体像と章の一覧', href: 'developers/index.html' },
          { label: '3章 ワールドのアプリ（U#）', note: 'U# で作る', href: 'developers/world-native.html' },
          { label: '4章 データで書くアプリ', note: 'JSON で作る', href: 'developers/declarative.html' },
          { label: '9章 リファレンス', note: 'コードから書き出した一覧', href: 'developers/reference.html' }
        ] }
      ]
    },
    support: {
      eyebrow: 'Support',
      title: '使い方とサポート。',
      lead: '導入ガイド、開発者ガイド、リリースノート。困ったときは、まずガイドを確かめてください。',
      groups: [
        { title: '使い方', links: [
          { label: '導入ガイド', note: 'ワールドへの入れ方', href: 'guide/index.html' },
          { label: '開発者ガイド', note: 'アプリの作り方', href: 'developers/index.html' },
          { label: 'リリースノート', note: '変更の記録', href: 'releases/index.html' }
        ] },
        { title: '困ったとき', links: [
          { label: '不具合の報告', note: '返信はしません', href: 'contact/index.html' },
          { label: 'Ulexite Store', note: '触って確かめる', href: 'index.html#store' },
          { label: 'X @UlexiteOfficial', note: '最新のお知らせ', href: 'https://x.com/UlexiteOfficial', external: true }
        ] }
      ]
    }
  };

  var old = document.getElementById('nav-panel');
  if (old && old.parentNode) old.parentNode.removeChild(old);
  var panel = document.createElement('div');
  panel.className = 'nav__panel';
  panel.id = 'nav-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML =
    '<div class="wrap nav__panel__inner">' +
      '<div class="nav__panel__head">' +
        '<p class="nav__panel__eyebrow"></p>' +
        '<h2 class="nav__panel__title"></h2>' +
        '<p class="nav__panel__lead"></p>' +
      '</div>' +
      '<div class="nav__panel__groups"></div>' +
    '</div>';
  nav.appendChild(panel);

  var oldScrim = document.getElementById('nav-scrim');
  if (oldScrim && oldScrim.parentNode) oldScrim.parentNode.removeChild(oldScrim);
  var scrim = document.createElement('div');
  scrim.className = 'nav__scrim';
  scrim.id = 'nav-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrim);
  scrim.addEventListener('click', close);

  var eyebrowEl = panel.querySelector('.nav__panel__eyebrow');
  var titleEl = panel.querySelector('.nav__panel__title');
  var leadEl = panel.querySelector('.nav__panel__lead');
  var groupsEl = panel.querySelector('.nav__panel__groups');

  function linkHtml(link) {
    var href = link.external ? link.href : prefix + link.href;
    var attrs = link.external ? ' target="_blank" rel="noopener"' : '';
    return '<li><a href="' + href + '"' + attrs + '>' +
      '<span class="nav__panel__label">' + link.label + '</span>' +
      '<span class="nav__panel__note">' + link.note + '</span>' +
    '</a></li>';
  }

  function render(menu) {
    eyebrowEl.textContent = menu.eyebrow;
    titleEl.textContent = menu.title;
    leadEl.textContent = menu.lead;
    groupsEl.innerHTML = menu.groups.map(function (group) {
      return '<div class="nav__panel__group"><h3>' + group.title + '</h3><ul>' +
        group.links.map(linkHtml).join('') + '</ul></div>';
    }).join('');
  }

  var map = { '製品': 'products', '入手': 'get', 'アプリストア': 'apps', 'サポート': 'support' };
  var triggers = [];
  var timer = null;
  var current = null;
  var suppressOpen = false;

  function open(key) {
    if (suppressOpen) return;
    var menu = MENUS[key];
    if (!menu) return;
    render(menu);
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-open');
    current = key;
    triggers.forEach(function (a) {
      a.setAttribute('aria-expanded', a.getAttribute('data-menu') === key ? 'true' : 'false');
    });
  }

  function close() {
    if (!current) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-open');
    current = null;
    triggers.forEach(function (a) { a.setAttribute('aria-expanded', 'false'); });
  }

  links.forEach(function (a) {
    var key = map[a.textContent.replace(/\s+/g, ' ').trim()];
    if (!key) return;
    a.setAttribute('data-menu', key);
    a.setAttribute('aria-haspopup', 'true');
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('aria-controls', 'nav-panel');
    a.addEventListener('mouseenter', function () { clearTimeout(timer); open(key); });
    a.addEventListener('focus', function () { clearTimeout(timer); open(key); });
    triggers.push(a);
  });

  var cta = nav.querySelector('.nav__cta');
  if (cta) {
    cta.setAttribute('data-menu', 'get');
    cta.setAttribute('aria-haspopup', 'true');
    cta.setAttribute('aria-expanded', 'false');
    cta.setAttribute('aria-controls', 'nav-panel');
    cta.addEventListener('mouseenter', function () { clearTimeout(timer); open('get'); });
    cta.addEventListener('focus', function () { clearTimeout(timer); open('get'); });
    triggers.push(cta);
  }

  nav.addEventListener('mouseleave', function () { timer = setTimeout(close, 140); });
  nav.addEventListener('mouseenter', function () { clearTimeout(timer); });
  nav.addEventListener('focusout', function (e) {
    if (!nav.contains(e.relatedTarget)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !current) return;
    var key = current;
    suppressOpen = true;
    close();
    var trigger = triggers.filter(function (a) { return a.getAttribute('data-menu') === key; })[0];
    if (trigger) trigger.focus();
    suppressOpen = false;
  });
  window.addEventListener('scroll', close, { passive: true });

  // 動作確認用（?menu=products などで開いた状態を出せる）
  var initial = new URLSearchParams(window.location.search).get('menu');
  if (initial && MENUS[initial]) open(initial);
})();
