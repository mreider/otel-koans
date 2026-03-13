/* Smooth auto-scroll - gently bring newly revealed elements into view */
(function () {
  var SCROLL_DELAY = 150;  // let opacity transition start before scrolling
  var pending = null;

  function scrollToCenter(el) {
    // Only scroll if element is below the current viewport
    var rect = el.getBoundingClientRect();
    var viewH = window.innerHeight;
    if (rect.top > viewH * 0.65 || rect.bottom < 0) {
      // Scroll so element is roughly centered
      var targetY = window.scrollY + rect.top - (viewH / 2) + (rect.height / 2);
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  }

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
      var el = m.target;
      // Only care about elements that just gained 'visible'
      if (!el.classList.contains('visible')) continue;
      // Skip tiny inline elements (hints, individual letters, etc.)
      if (el.offsetHeight < 30) continue;
      // Debounce - if multiple reveals happen rapidly, scroll to the last one
      clearTimeout(pending);
      pending = setTimeout(function () { scrollToCenter(el); }, SCROLL_DELAY);
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
})();
