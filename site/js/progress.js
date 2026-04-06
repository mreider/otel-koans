/* Navigation bar */
(function () {
  var NAV_KEYS = [
    'theOpening', 'telemetry', 'threeSignals', 'metric', 'metricTypes',
    'outliers', 'trace', 'spans', 'log', 'attributes', 'resources',
    'semanticConventions', 'instrumentation', 'exporters', 'otlp',
    'isItAllOpen', 'collector', 'pipeline', 'processors',
    'deploymentModes', 'traceContext', 'baggage', 'sampling',
    'traceAwareRouting', 'spanEvents', 'spanLinks',
    'correlation', 'theInvestigation', 'profiling'
  ];
  var KOAN_ORDER = [
    { n: 0,  file: 'index.html',                       titleKey: 'nav.theOpening',           fallback: 'The Opening' },
    { n: 1,  file: 'koans/01-telemetry.html',           titleKey: 'nav.telemetry',           fallback: 'Telemetry' },
    { n: 2,  file: 'koans/02-three-signals.html',       titleKey: 'nav.threeSignals',        fallback: 'Core Signals' },
    { n: 3,  file: 'koans/03-metric.html',              titleKey: 'nav.metric',              fallback: 'Metric' },
    { n: 4,  file: 'koans/04-metric-types.html',        titleKey: 'nav.metricTypes',         fallback: 'Metric Types' },
    { n: 5,  file: 'koans/05-outliers.html',             titleKey: 'nav.outliers',           fallback: 'Outliers' },
    { n: 6,  file: 'koans/06-trace.html',               titleKey: 'nav.trace',               fallback: 'Trace' },
    { n: 7,  file: 'koans/07-spans.html',               titleKey: 'nav.spans',               fallback: 'Spans' },
    { n: 8,  file: 'koans/08-log.html',                 titleKey: 'nav.log',                 fallback: 'Log' },
    { n: 9,  file: 'koans/09-attributes.html',          titleKey: 'nav.attributes',          fallback: 'Attributes' },
    { n: 10, file: 'koans/10-resources.html',            titleKey: 'nav.resources',          fallback: 'Resources' },
    { n: 11, file: 'koans/11-semantic-conventions.html', titleKey: 'nav.semanticConventions', fallback: 'Semantic Conventions' },
    { n: 12, file: 'koans/12-instrumentation.html',      titleKey: 'nav.instrumentation',    fallback: 'Instrumentation' },
    { n: 13, file: 'koans/13-exporters.html',            titleKey: 'nav.exporters',          fallback: 'Exporters' },
    { n: 14, file: 'koans/14-otlp.html',                titleKey: 'nav.otlp',               fallback: 'OTLP' },
    { n: 15, file: 'koans/15-is-it-all-open.html',      titleKey: 'nav.isItAllOpen',        fallback: 'Is It All Open?' },
    { n: 16, file: 'koans/16-collector.html',            titleKey: 'nav.collector',          fallback: 'Collector' },
    { n: 17, file: 'koans/17-pipeline.html',             titleKey: 'nav.pipeline',           fallback: 'Pipeline' },
    { n: 18, file: 'koans/18-processors.html',           titleKey: 'nav.processors',         fallback: 'Processors' },
    { n: 19, file: 'koans/19-deployment-modes.html',     titleKey: 'nav.deploymentModes',    fallback: 'Deployment Modes' },
    { n: 20, file: 'koans/20-trace-context.html',        titleKey: 'nav.traceContext',       fallback: 'Trace Context' },
    { n: 21, file: 'koans/21-baggage.html',              titleKey: 'nav.baggage',            fallback: 'Baggage' },
    { n: 22, file: 'koans/22-sampling.html',             titleKey: 'nav.sampling',           fallback: 'Sampling' },
    { n: 23, file: 'koans/23-trace-aware-routing.html',  titleKey: 'nav.traceAwareRouting',  fallback: 'Trace-Aware Routing' },
    { n: 24, file: 'koans/24-events.html',               titleKey: 'nav.spanEvents',         fallback: 'Events' },
    { n: 25, file: 'koans/25-span-links.html',           titleKey: 'nav.spanLinks',          fallback: 'Span Links' },
    { n: 26, file: 'koans/26-correlation.html',           titleKey: 'nav.correlation',       fallback: 'Correlation' },
    { n: 27, file: 'koans/27-the-investigation.html',    titleKey: 'nav.theInvestigation',   fallback: 'The Investigation' },
    { n: 28, file: 'koans/28-profiling.html',            titleKey: 'nav.profiling',          fallback: 'Profiling' }
  ];

  var path = location.pathname;
  var isRoot = !path.match(/\/koans\//);
  var currentFile = isRoot ? 'index.html' : 'koans/' + path.split('/').pop();
  var currentIdx = -1;
  for (var i = 0; i < KOAN_ORDER.length; i++) {
    if (KOAN_ORDER[i].file === currentFile) { currentIdx = i; break; }
  }

  function koanHref(idx) {
    if (idx < 0 || idx >= KOAN_ORDER.length) return null;
    return isRoot ? KOAN_ORDER[idx].file : '../' + KOAN_ORDER[idx].file;
  }

  function t(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      var v = window.i18n.t(key);
      return v !== key ? v : (fallback || key);
    }
    return fallback || key;
  }

  function koanTitle(idx) {
    return t(KOAN_ORDER[idx].titleKey, KOAN_ORDER[idx].fallback);
  }

  // Build navigation bar
  var nav = document.createElement('div');
  nav.className = 'progress-nav';

  // Prev arrow
  var prevLink;
  if (currentIdx > 0) {
    prevLink = document.createElement('a');
    prevLink.href = koanHref(currentIdx - 1);
    prevLink.className = 'progress-arrow';
    prevLink.title = koanTitle(currentIdx - 1);
    prevLink.textContent = '\u2039';
    nav.appendChild(prevLink);
  }

  // Dot color groups (phases matching OTel Primer)
  var DOT_GROUPS = [
    { start: 0,  end: 5,  color: '#5eead4' },  // The Three Signals (teal)
    { start: 6,  end: 11, color: '#4ade80' },  // Adding Meaning (green)
    { start: 12, end: 15, color: '#c084fc' },  // Producing Telemetry (purple)
    { start: 16, end: 19, color: '#38bdf8' },  // Collecting & Processing (sky)
    { start: 20, end: 23, color: '#60a5fa' },  // Crossing Boundaries (blue)
    { start: 24, end: 25, color: '#34d399' },  // Within Spans (emerald)
    { start: 26, end: 27, color: '#fbbf24' },  // Connecting Signals (amber)
    { start: 28, end: 28, color: '#a78bfa' }   // What's Next (violet)
  ];

  function getGroupColor(idx) {
    for (var g = 0; g < DOT_GROUPS.length; g++) {
      if (idx >= DOT_GROUPS[g].start && idx <= DOT_GROUPS[g].end) return DOT_GROUPS[g].color;
    }
    return null;
  }

  // Dots
  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'progress-dots';
  var dots = [];

  for (var k = 0; k < KOAN_ORDER.length; k++) {
    var dot = document.createElement('a');
    dot.href = koanHref(k);
    dot.className = 'progress-dot';
    dot.title = koanTitle(k);
    var color = getGroupColor(k);
    if (color) dot.style.setProperty('--dot-color', color);
    if (k <= currentIdx) dot.classList.add('reached');
    if (k === currentIdx) dot.classList.add('current');
    dots.push(dot);
    dotsWrap.appendChild(dot);
  }
  nav.appendChild(dotsWrap);

  // Next arrow
  var nextLink;
  if (currentIdx < KOAN_ORDER.length - 1) {
    nextLink = document.createElement('a');
    nextLink.href = koanHref(currentIdx + 1);
    nextLink.className = 'progress-arrow';
    nextLink.title = koanTitle(currentIdx + 1);
    nextLink.textContent = '\u203A';
    nav.appendChild(nextLink);
  }

  // Divider + music toggle (created by music.js which loads first)
  var musicBtn = document.querySelector('.music-toggle');
  if (musicBtn) {
    var div1 = document.createElement('div');
    div1.className = 'progress-divider';
    nav.appendChild(div1);
    nav.appendChild(musicBtn);
  }

  // TOC button
  var tocDiv = document.createElement('div');
  tocDiv.className = 'progress-divider';
  nav.appendChild(tocDiv);

  var tocBtn = document.createElement('button');
  tocBtn.className = 'toc-toggle';
  tocBtn.title = t('common.tableOfContents', 'Table of Contents');
  tocBtn.setAttribute('aria-label', t('common.tableOfContents', 'Table of Contents'));
  tocBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>';
  nav.appendChild(tocBtn);

  var tocDrop = document.createElement('div');
  tocDrop.className = 'toc-dropdown';
  tocDrop.hidden = true;

  KOAN_ORDER.forEach(function (koan, idx) {
    if (idx === 0) return; // skip index page
    var entry = document.createElement('a');
    entry.href = koanHref(idx);
    entry.className = 'toc-entry';
    if (idx === currentIdx) entry.classList.add('current');

    var num = document.createElement('span');
    num.className = 'toc-num';
    num.textContent = koan.n;
    var entryColor = getGroupColor(idx);
    if (entryColor && idx !== currentIdx) num.style.color = entryColor;
    entry.appendChild(num);

    var info = document.createElement('span');
    info.className = 'toc-info';
    var title = document.createElement('span');
    title.className = 'toc-title';
    title.textContent = koanTitle(idx);
    info.appendChild(title);
    entry.appendChild(info);

    tocDrop.appendChild(entry);
  });

  tocBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    tocDrop.hidden = !tocDrop.hidden;
    langDrop.hidden = true;
  });
  nav.appendChild(tocDrop);

  // Language picker
  var langDiv = document.createElement('div');
  langDiv.className = 'progress-divider';
  nav.appendChild(langDiv);

  var langBtn = document.createElement('button');
  langBtn.className = 'lang-toggle';
  // Pulse on first visit to draw attention to language options
  var LANG_SEEN_KEY = 'otel-koans-lang-seen';
  if (!localStorage.getItem(LANG_SEEN_KEY)) {
    langBtn.classList.add('lang-pulse');
    langBtn.addEventListener('click', function () {
      langBtn.classList.remove('lang-pulse');
      localStorage.setItem(LANG_SEEN_KEY, '1');
    }, { once: true });
    // Also stop pulsing after they navigate (next page load will have the flag set)
    localStorage.setItem(LANG_SEEN_KEY, '1');
  }
  langBtn.title = t('common.changeLanguage', 'Change language');
  langBtn.setAttribute('aria-label', t('common.changeLanguage', 'Change language'));
  langBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
  nav.appendChild(langBtn);

  var langDrop = document.createElement('div');
  langDrop.className = 'lang-dropdown';
  langDrop.hidden = true;

  var supported = (window.i18n && window.i18n.getSupported) ? window.i18n.getSupported() : [{ code: 'en-US', name: 'English (US)' }];
  var currentLang = (window.i18n && window.i18n.getLocale) ? window.i18n.getLocale() : 'en-US';

  supported.forEach(function (loc) {
    var opt = document.createElement('button');
    opt.className = 'lang-option';
    if (loc.code === currentLang) opt.classList.add('active');
    opt.textContent = loc.name;
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      langDrop.hidden = true;
      if (window.i18n) window.i18n.setLocale(loc.code);
    });
    langDrop.appendChild(opt);
  });

  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    langDrop.hidden = !langDrop.hidden;
    tocDrop.hidden = true;
  });
  document.addEventListener('click', function () { langDrop.hidden = true; tocDrop.hidden = true; });
  nav.appendChild(langDrop);

  // Trophy / certificate button
  var trophyDiv = document.createElement('div');
  trophyDiv.className = 'progress-divider';
  nav.appendChild(trophyDiv);

  var trophyBtn = document.createElement('button');
  trophyBtn.className = 'trophy-toggle';
  trophyBtn.title = t('cert.shareTitle', 'Share Your Achievement');
  trophyBtn.setAttribute('aria-label', t('cert.shareTitle', 'Share Your Achievement'));
  trophyBtn.innerHTML = window.certificate ? window.certificate.TROPHY_SVG : '';
  trophyBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (window.certificate) window.certificate.open();
  });
  nav.appendChild(trophyBtn);

  // Reference guide link (external)
  var refDiv = document.createElement('div');
  refDiv.className = 'progress-divider';
  nav.appendChild(refDiv);

  var refLink = document.createElement('a');
  refLink.href = 'https://otel-primer.mreider.com';
  refLink.className = 'progress-icon';
  refLink.title = t('common.referenceGuide', 'OTel Primer');
  refLink.target = '_blank';
  refLink.rel = 'noopener';
  refLink.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7z"/></svg>';
  nav.appendChild(refLink);

  // GitHub link
  var ghDiv = document.createElement('div');
  ghDiv.className = 'progress-divider';
  nav.appendChild(ghDiv);

  var ghLink = document.createElement('a');
  ghLink.href = 'https://github.com/mreider/otel-koans';
  ghLink.className = 'progress-icon';
  ghLink.title = t('common.viewOnGithub', 'View on GitHub');
  ghLink.target = '_blank';
  ghLink.rel = 'noopener';
  ghLink.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
  nav.appendChild(ghLink);

  // Copyright (appears above bar on hover)
  var copy = document.createElement('div');
  copy.className = 'site-copyright';
  copy.textContent = t('common.copyright', '\u00A9 2026 Matthew Reider \u00B7 MIT License \u00B7 v0.3.11');
  nav.appendChild(copy);

  document.body.appendChild(nav);

  // Re-translate nav when locale changes
  window.addEventListener('i18n:ready', function () {
    for (var d = 0; d < dots.length; d++) {
      dots[d].title = koanTitle(d);
    }
    if (prevLink) prevLink.title = koanTitle(currentIdx - 1);
    if (nextLink) nextLink.title = koanTitle(currentIdx + 1);
    trophyBtn.title = t('cert.shareTitle', 'Share Your Achievement');
    trophyBtn.setAttribute('aria-label', t('cert.shareTitle', 'Share Your Achievement'));
    refLink.title = t('common.referenceGuide', 'OTel Primer');
    ghLink.title = t('common.viewOnGithub', 'View on GitHub');
    copy.textContent = t('common.copyright', '\u00A9 2026 Matthew Reider \u00B7 MIT License \u00B7 v0.3.11');
    langBtn.title = t('common.changeLanguage', 'Change language');
    langBtn.setAttribute('aria-label', t('common.changeLanguage', 'Change language'));
    tocBtn.title = t('common.tableOfContents', 'Table of Contents');
    tocBtn.setAttribute('aria-label', t('common.tableOfContents', 'Table of Contents'));
    var musicBtn = document.querySelector('.music-toggle');
    if (musicBtn) {
      var musicLabel = t('common.toggleMusic', 'Toggle music');
      musicBtn.title = musicLabel;
      musicBtn.setAttribute('aria-label', musicLabel);
    }
    var tocEntries = tocDrop.querySelectorAll('.toc-title');
    tocEntries.forEach(function (el, idx) {
      el.textContent = koanTitle(idx + 1);
    });

    // Update active state in dropdown
    var curLang = window.i18n.getLocale();
    var opts = langDrop.querySelectorAll('.lang-option');
    var sup = window.i18n.getSupported();
    opts.forEach(function (o, idx) {
      o.classList.toggle('active', sup[idx] && sup[idx].code === curLang);
    });
  });

  // Inject reference link into mobile gate
  var gate = document.querySelector('.mobile-gate');
  if (gate) {
    var mobileRef = document.createElement('a');
    mobileRef.href = 'https://otel-primer.mreider.com';
    mobileRef.className = 'mobile-gate-ref';
    mobileRef.target = '_blank';
    mobileRef.rel = 'noopener';
    mobileRef.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7z"/></svg>' +
      '<span>' + t('common.referenceGuide', 'OTel Primer') + '</span>';
    gate.appendChild(mobileRef);
  }
})();
