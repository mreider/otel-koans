/* Progress tracking and navigation */
(function () {
  var KEY = 'otel-koans-progress';
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

  // Determine current koan from URL
  var path = location.pathname;
  var isRoot = !path.match(/\/koans\//);
  var currentFile = isRoot ? 'index.html' : 'koans/' + path.split('/').pop();
  var currentIdx = -1;
  for (var i = 0; i < KOAN_ORDER.length; i++) {
    if (KOAN_ORDER[i].file === currentFile) { currentIdx = i; break; }
  }

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  // Mark current koan as visited
  if (currentIdx >= 0) {
    var prog = getProgress();
    prog[currentIdx] = Math.max(prog[currentIdx] || 0, 1); // 1 = visited
    saveProgress(prog);
  }

  // Watch for completion - when "next" link becomes clickable/visible or koan-complete appears
  function markComplete() {
    if (currentIdx < 0) return;
    var prog = getProgress();
    prog[currentIdx] = 2; // 2 = completed
    saveProgress(prog);
    updateDots();
  }

  // Observe for completion signals
  var compObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var el = mutations[i].target;
      if (el.classList && el.classList.contains('visible')) {
        // Check if it's a completion element (insight, continue, koan-complete)
        if (el.classList.contains('opening-continue') ||
            el.id === 'continueLink' ||
            el.querySelector('.koan-nav a[href]')) {
          markComplete();
        }
        // Check class names that suggest completion
        var cn = el.className || '';
        if (cn.match(/insight|complete|final/i)) {
          markComplete();
        }
      }
    }
  });
  compObserver.observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });

  // Also mark complete if user clicks a "next" nav link
  var nextLinks = document.querySelectorAll('.koan-nav a');
  for (var j = 0; j < nextLinks.length; j++) {
    (function(link) {
      if (link.textContent.match(/→|next|→/i)) {
        link.addEventListener('click', markComplete);
      }
    })(nextLinks[j]);
  }

  // Build navigation dots
  var nav = document.createElement('div');
  nav.className = 'progress-nav';

  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'progress-dots';

  var dots = [];
  for (var k = 0; k < KOAN_ORDER.length; k++) {
    var dot = document.createElement('a');
    var href = isRoot ? KOAN_ORDER[k].file : '../' + KOAN_ORDER[k].file;
    dot.href = href;
    dot.className = 'progress-dot';
    dot.title = KOAN_ORDER[k].title;
    if (k === currentIdx) dot.classList.add('current');
    dots.push(dot);
    dotsWrap.appendChild(dot);
  }

  // Reset button
  var resetBtn = document.createElement('button');
  resetBtn.className = 'progress-reset';
  resetBtn.title = 'Start over';
  resetBtn.textContent = '\u21BA';
  resetBtn.addEventListener('click', function () {
    if (confirm('Reset all progress and start from the beginning?')) {
      localStorage.removeItem(KEY);
      var rootUrl = isRoot ? 'index.html' : '../index.html';
      location.href = rootUrl;
    }
  });

  nav.appendChild(dotsWrap);
  nav.appendChild(resetBtn);
  document.body.appendChild(nav);

  function updateDots() {
    var prog = getProgress();
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.remove('visited', 'completed');
      if (prog[d] === 2) dots[d].classList.add('completed');
      else if (prog[d] === 1) dots[d].classList.add('visited');
    }
  }
  updateDots();

  // On index page: show continue prompt if there's progress
  if (isRoot && currentIdx === 0) {
    var prog = getProgress();
    var furthest = -1;
    for (var p in prog) {
      var pi = parseInt(p);
      if (prog[p] >= 1 && pi > furthest) furthest = pi;
    }
    // If user has been past koan 0, offer to continue
    if (furthest > 0) {
      // Find next incomplete koan after furthest completed
      var resumeIdx = furthest;
      for (var r = 0; r <= furthest; r++) {
        if (prog[r] === 2 && r === resumeIdx) resumeIdx = r + 1;
      }
      if (resumeIdx >= KOAN_ORDER.length) resumeIdx = KOAN_ORDER.length - 1;

      // Remove the default "Begin the path" link since we're showing a resume link instead
      var beginLink = document.querySelector('.opening-continue');
      if (beginLink) beginLink.remove();

      var cont = document.createElement('div');
      cont.className = 'resume-prompt';
      cont.innerHTML = '<a href="' + KOAN_ORDER[resumeIdx].file + '">Continue: ' +
        KOAN_ORDER[resumeIdx].title + ' →</a>';
      // Insert after the opening-continue div or at end of opening
      var opening = document.querySelector('.opening');
      if (opening) opening.appendChild(cont);
    }
  }
})();
