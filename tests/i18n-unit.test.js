/**
 * i18n.js unit tests — verify core API behavior using jsdom.
 *
 * @jest-environment jsdom
 */
var fs = require('fs');
var path = require('path');

var enStrings = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'site', 'i18n', 'en-US.json'), 'utf8')
);

/**
 * Load i18n.js into the jsdom global with a fake XHR that returns
 * the given strings object. Each call fully re-initializes the module.
 */
function bootI18n(strings) {
  // Stub XHR to synchronously return our strings
  window.XMLHttpRequest = function () {
    var self = this;
    self.status = 200;
    self.responseText = JSON.stringify(strings);
    self.open = function () {};
    self.send = function () { if (self.onload) self.onload(); };
  };

  var code = fs.readFileSync(
    path.join(__dirname, '..', 'site', 'js', 'i18n.js'), 'utf8'
  );
  eval(code);
}

beforeEach(function () {
  document.body.innerHTML = '';
  document.documentElement.lang = '';
  bootI18n(enStrings);
});

/* ══════════════════════════════════════════════════════════════════
   t() — dot-path lookup
   ══════════════════════════════════════════════════════════════════ */

describe('i18n.t()', function () {
  test('returns translated string for valid key', function () {
    expect(window.i18n.t('common.check')).toBe('Check');
  });

  test('returns nested key value', function () {
    expect(window.i18n.t('koan01.title')).toBe('The Silent Failure');
  });

  test('returns the key itself when key is missing', function () {
    expect(window.i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  test('returns the key for partially valid path', function () {
    expect(window.i18n.t('common.nonexistent')).toBe('common.nonexistent');
  });
});

/* ══════════════════════════════════════════════════════════════════
   applyText()
   ══════════════════════════════════════════════════════════════════ */

describe('i18n.applyText()', function () {
  test('sets textContent to translated value', function () {
    var el = document.createElement('div');
    window.i18n.applyText(el, 'common.check');
    expect(el.textContent).toBe('Check');
  });

  test('sets data-i18n attribute', function () {
    var el = document.createElement('div');
    window.i18n.applyText(el, 'common.check');
    expect(el.getAttribute('data-i18n')).toBe('common.check');
  });

  test('removes data-i18n-html attribute if present', function () {
    var el = document.createElement('div');
    el.setAttribute('data-i18n-html', 'old.key');
    window.i18n.applyText(el, 'common.check');
    expect(el.hasAttribute('data-i18n-html')).toBe(false);
  });

  test('preserves child elements when updating text', function () {
    var el = document.createElement('div');
    el.appendChild(document.createTextNode('old text'));
    var child = document.createElement('button');
    child.textContent = 'Pick';
    el.appendChild(child);

    window.i18n.applyText(el, 'common.check');
    expect(el.firstChild.nodeValue).toBe('Check');
    expect(el.querySelector('button')).not.toBeNull();
    expect(el.querySelector('button').textContent).toBe('Pick');
  });

  test('inserts text node when element has only child elements', function () {
    var el = document.createElement('div');
    var child = document.createElement('span');
    child.textContent = 'child';
    el.appendChild(child);

    window.i18n.applyText(el, 'common.check');
    expect(el.firstChild.nodeType).toBe(3); // TEXT_NODE
    expect(el.firstChild.nodeValue).toBe('Check');
    expect(el.querySelector('span')).not.toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════════
   applyHtml()
   ══════════════════════════════════════════════════════════════════ */

describe('i18n.applyHtml()', function () {
  test('sets innerHTML to translated value', function () {
    var el = document.createElement('div');
    window.i18n.applyHtml(el, 'common.check');
    expect(el.innerHTML).toBe('Check');
  });

  test('converts newlines to <br>', function () {
    var el = document.createElement('div');
    window.i18n.applyHtml(el, 'common.desktopOnlyText');
    expect(el.innerHTML).toContain('<br>');
    expect(el.innerHTML).not.toContain('\n');
  });

  test('sets data-i18n-html attribute', function () {
    var el = document.createElement('div');
    window.i18n.applyHtml(el, 'common.check');
    expect(el.getAttribute('data-i18n-html')).toBe('common.check');
  });

  test('removes data-i18n attribute if present', function () {
    var el = document.createElement('div');
    el.setAttribute('data-i18n', 'old.key');
    window.i18n.applyHtml(el, 'common.check');
    expect(el.hasAttribute('data-i18n')).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════════
   applyDOM() — re-translates all marked elements
   ══════════════════════════════════════════════════════════════════ */

describe('i18n.applyDOM()', function () {
  test('translates data-i18n elements', function () {
    var el = document.createElement('div');
    el.setAttribute('data-i18n', 'common.check');
    el.textContent = 'old';
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.textContent).toBe('Check');
  });

  test('translates data-i18n-html elements with newline conversion', function () {
    var el = document.createElement('div');
    el.setAttribute('data-i18n-html', 'common.desktopOnlyText');
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.innerHTML).toContain('<br>');
  });

  test('translates data-i18n-title elements', function () {
    var el = document.createElement('button');
    el.setAttribute('data-i18n-title', 'common.check');
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.title).toBe('Check');
  });

  test('translates data-i18n-aria elements', function () {
    var el = document.createElement('button');
    el.setAttribute('data-i18n-aria', 'common.toggleMusic');
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.getAttribute('aria-label')).toBe('Toggle music');
  });

  test('translates data-i18n-placeholder elements', function () {
    var el = document.createElement('input');
    el.setAttribute('data-i18n-placeholder', 'cert.namePlaceholder');
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.placeholder).toBe('Your name');
  });

  test('skips elements where key has no translation', function () {
    var el = document.createElement('div');
    el.setAttribute('data-i18n', 'nonexistent.key');
    el.textContent = 'original';
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.textContent).toBe('original');
  });

  test('preserves child elements when re-translating', function () {
    var el = document.createElement('div');
    el.appendChild(document.createTextNode('old'));
    var btn = document.createElement('button');
    btn.className = 'picker';
    btn.textContent = 'A';
    el.appendChild(btn);
    el.setAttribute('data-i18n', 'common.check');
    document.body.appendChild(el);

    window.i18n.applyDOM();
    expect(el.firstChild.nodeValue).toBe('Check');
    expect(el.querySelector('button.picker')).not.toBeNull();
    expect(el.querySelector('button.picker').textContent).toBe('A');
  });
});

/* ══════════════════════════════════════════════════════════════════
   getLocale() / getSupported()
   ══════════════════════════════════════════════════════════════════ */

describe('i18n metadata', function () {
  test('getSupported() returns all 14 locales', function () {
    var supported = window.i18n.getSupported();
    expect(supported.length).toBe(14);
    expect(supported[0].code).toBe('en-US');
  });

  test('each supported locale has a JSON file', function () {
    var i18nDir = path.join(__dirname, '..', 'site', 'i18n');
    var supported = window.i18n.getSupported();
    supported.forEach(function (loc) {
      var filePath = path.join(i18nDir, loc.code + '.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
