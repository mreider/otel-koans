/* OpenTelemetry Koans – i18n engine
   Loads JSON locale files, replaces DOM text via data-i18n attributes,
   and exposes i18n.t(key) for JS-generated strings. */
(function () {
  'use strict';

  var STORAGE_KEY = 'otel-koans-lang';
  var DEFAULT_LOCALE = 'en-US';
  var SUPPORTED = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'pt-BR', name: 'Portugu\u00eas (BR)' },
    { code: 'es-ES', name: 'Espa\u00f1ol' },
    { code: 'fr-FR', name: 'Fran\u00e7ais' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'it-IT', name: 'Italiano' },
    { code: 'nl-NL', name: 'Nederlands' },
    { code: 'sv-SE', name: 'Svenska' },
    { code: 'cs-CZ', name: '\u010ce\u0161tina' },
    { code: 'ro-RO', name: 'Rom\u00e2n\u0103' },
    { code: 'zh-CN', name: '\u4e2d\u6587 (\u7b80\u4f53)' },
    { code: 'ko-KR', name: '\ud55c\uad6d\uc5b4' },
    { code: 'ja-JP', name: '\u65e5\u672c\u8a9e' }
  ];
  var strings = {};
  var currentLocale = DEFAULT_LOCALE;

  /* ── Detect locale ── */
  function detectLocale() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && codeSupported(saved)) return saved;

    var nav = navigator.language || navigator.userLanguage || '';
    if (codeSupported(nav)) return nav;
    var base = nav.split('-')[0];
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (SUPPORTED[i].code.split('-')[0] === base) return SUPPORTED[i].code;
    }
    return DEFAULT_LOCALE;
  }

  function codeSupported(c) {
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (SUPPORTED[i].code === c) return true;
    }
    return false;
  }

  /* ── Load JSON ── */
  function loadLocale(locale, cb) {
    var inKoans = /\/koans\//.test(location.pathname);
    var base = inKoans ? '../i18n/' : 'i18n/';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + locale + '.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        strings = JSON.parse(xhr.responseText);
        currentLocale = locale;
        cb();
      } else if (locale !== DEFAULT_LOCALE) {
        loadLocale(DEFAULT_LOCALE, cb);
      }
    };
    xhr.onerror = function () {
      if (locale !== DEFAULT_LOCALE) loadLocale(DEFAULT_LOCALE, cb);
    };
    xhr.send();
  }

  /* ── t(key) – dot-path lookup ── */
  function t(key) {
    var parts = key.split('.');
    var obj = strings;
    for (var i = 0; i < parts.length; i++) {
      if (obj && typeof obj === 'object' && parts[i] in obj) {
        obj = obj[parts[i]];
      } else {
        return key;
      }
    }
    return obj;
  }

  /* ── Apply DOM translations ── */
  function applyDOM() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v !== el.getAttribute('data-i18n')) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v !== el.getAttribute('data-i18n-html')) {
        el.innerHTML = v.replace(/\n/g, '<br>');
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-title'));
      if (v !== el.getAttribute('data-i18n-title')) el.title = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v !== el.getAttribute('data-i18n-aria')) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-placeholder'));
      if (v !== el.getAttribute('data-i18n-placeholder')) el.placeholder = v;
    });
    document.documentElement.lang = currentLocale.split('-')[0];
  }

  /* ── Set locale and re-render ── */
  function setLocale(locale) {
    localStorage.setItem(STORAGE_KEY, locale);
    loadLocale(locale, function () {
      applyDOM();
      window.dispatchEvent(new CustomEvent('i18n:ready'));
    });
  }

  /* ── Init ── */
  function init() {
    var locale = detectLocale();
    loadLocale(locale, function () {
      applyDOM();
      window.dispatchEvent(new CustomEvent('i18n:ready'));
    });
  }

  /* ── Public API ── */
  window.i18n = {
    t: t,
    setLocale: setLocale,
    getLocale: function () { return currentLocale; },
    getSupported: function () { return SUPPORTED; },
    applyDOM: applyDOM,
    init: init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
