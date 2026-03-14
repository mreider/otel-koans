/* Smooth auto-scroll - gently bring newly revealed elements into view */
(function () {
  var SCROLL_DELAY = 150;  // let opacity transition start before scrolling
  var pending = null;

  function scrollIntoView(el) {
    var rect = el.getBoundingClientRect();
    var viewH = window.innerHeight;
    if (rect.top > viewH * 0.65 || rect.bottom < 0) {
      // Scroll so element's bottom is visible with padding
      var targetY = window.scrollY + rect.bottom - viewH + 80;
      // But don't scroll past the element's top — keep top visible too
      var topY = window.scrollY + rect.top - 60;
      window.scrollTo({ top: Math.max(0, Math.min(targetY, topY)), behavior: 'smooth' });
    }
  }

  function isExpanding(el) {
    // Elements transitioning from max-height: 0 start with near-zero height
    return el.offsetHeight < 30;
  }

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
      var el = m.target;
      if (!el.classList.contains('visible')) continue;

      if (isExpanding(el)) {
        // Element is transitioning from max-height: 0 — wait for expansion
        (function (target) {
          target.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'max-height' || e.propertyName === 'opacity') {
              target.removeEventListener('transitionend', handler);
              scrollIntoView(target);
            }
          });
        })(el);
      } else {
        clearTimeout(pending);
        pending = setTimeout((function (target) {
          return function () { scrollIntoView(target); };
        })(el), SCROLL_DELAY);
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
})();
