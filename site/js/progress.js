/* Navigation bar */
(function () {
  var KOAN_ORDER = [
    { n: 0,  file: 'index.html',              title: 'The Opening' },
    { n: 1,  file: 'koans/01-telemetry.html',  title: 'Telemetry' },
    { n: 2,  file: 'koans/02-three-signals.html', title: 'Three Signals' },
    { n: 3,  file: 'koans/03-metric.html',     title: 'Metric' },
    { n: 4,  file: 'koans/04-metric-types.html', title: 'Metric Types' },
    { n: 5,  file: 'koans/05-trace.html',      title: 'Trace' },
    { n: 6,  file: 'koans/06-spans.html',      title: 'Spans' },
    { n: 7,  file: 'koans/07-log.html',        title: 'Log' },
    { n: 8,  file: 'koans/08-attributes.html',  title: 'Attributes' },
    { n: 9,  file: 'koans/10-naming.html',     title: 'Naming' },
    { n: 10, file: 'koans/09-resources.html',  title: 'Resources' },
    { n: 11, file: 'koans/11-instrumentation.html', title: 'Instrumentation' },
    { n: 12, file: 'koans/12-export.html',     title: 'Export' },
    { n: 13, file: 'koans/13-formats.html',    title: 'Formats' },
    { n: 14, file: 'koans/14-collector.html',   title: 'Collector' },
    { n: 15, file: 'koans/15-pipeline.html',   title: 'Pipeline' },
    { n: 16, file: 'koans/16-sampling.html',   title: 'Sampling' },
    { n: 17, file: 'koans/17-service-map.html', title: 'Service Map' },
    { n: 18, file: 'koans/18-correlation.html', title: 'Correlation' },
    { n: 19, file: 'koans/19-full-picture.html', title: 'Full Picture' }
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

  // Build navigation bar
  var nav = document.createElement('div');
  nav.className = 'progress-nav';

  // Prev arrow
  if (currentIdx > 0) {
    var prevLink = document.createElement('a');
    prevLink.href = koanHref(currentIdx - 1);
    prevLink.className = 'progress-arrow';
    prevLink.title = KOAN_ORDER[currentIdx - 1].title;
    prevLink.textContent = '\u2039';
    nav.appendChild(prevLink);
  }

  // Dots
  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'progress-dots';

  for (var k = 0; k < KOAN_ORDER.length; k++) {
    var dot = document.createElement('a');
    dot.href = koanHref(k);
    dot.className = 'progress-dot';
    dot.title = KOAN_ORDER[k].title;
    if (k === currentIdx) dot.classList.add('current');
    dotsWrap.appendChild(dot);
  }
  nav.appendChild(dotsWrap);

  // Next arrow
  if (currentIdx < KOAN_ORDER.length - 1) {
    var nextLink = document.createElement('a');
    nextLink.href = koanHref(currentIdx + 1);
    nextLink.className = 'progress-arrow';
    nextLink.title = KOAN_ORDER[currentIdx + 1].title;
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

  // GitHub link
  var ghLink = document.createElement('a');
  ghLink.href = 'https://github.com/mreider/otel-koans';
  ghLink.className = 'progress-icon';
  ghLink.title = 'View on GitHub';
  ghLink.target = '_blank';
  ghLink.rel = 'noopener';
  ghLink.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
  nav.appendChild(ghLink);

  // Copyright (appears above bar on hover)
  var copy = document.createElement('div');
  copy.className = 'site-copyright';
  copy.textContent = '\u00A9 2026 Matthew Reider \u00B7 MIT License \u00B7 v0.3.5';
  nav.appendChild(copy);

  document.body.appendChild(nav);
})();
