/* Background music — "Celestial" by Scott Buckley (CC-BY 4.0) */
(function () {
  var VOLUME = 0.12;
  var KEY_ENABLED = 'otel-koans-music';
  var KEY_TIME = 'otel-koans-music-time';

  // Determine audio path based on page depth
  var isRoot = !location.pathname.match(/\/koans\//);
  var audioSrc = isRoot ? 'audio/celestial.mp3' : '../audio/celestial.mp3';

  var audio = new Audio(audioSrc);
  audio.loop = true;
  audio.volume = VOLUME;
  audio.preload = 'auto';

  // Save position periodically so next page can resume
  setInterval(function () {
    if (!audio.paused) {
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
    }
  }, 1000);

  // Also save on page unload
  window.addEventListener('beforeunload', function () {
    if (!audio.paused) {
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
    }
  });

  // Create toggle button
  var btn = document.createElement('button');
  btn.className = 'music-toggle';
  btn.setAttribute('aria-label', 'Toggle music');
  btn.title = 'Toggle music';

  var enabled = localStorage.getItem(KEY_ENABLED) === '1';
  btn.textContent = enabled ? '\u266B' : '\u266A';
  btn.classList.toggle('music-on', enabled);

  function play() {
    var savedTime = parseFloat(localStorage.getItem(KEY_TIME) || '0');
    if (savedTime && isFinite(savedTime)) {
      audio.currentTime = savedTime;
    }
    audio.play().catch(function () {});
  }

  // If previously enabled, try to resume on first interaction
  if (enabled) {
    // Try immediate play (may work if user has interacted with domain before)
    play();
    // Fallback: play on first click/key anywhere
    var resumeOnce = function () {
      if (audio.paused && localStorage.getItem(KEY_ENABLED) === '1') {
        play();
      }
      document.removeEventListener('click', resumeOnce);
      document.removeEventListener('keydown', resumeOnce);
    };
    document.addEventListener('click', resumeOnce);
    document.addEventListener('keydown', resumeOnce);
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) {
      localStorage.setItem(KEY_ENABLED, '1');
      btn.textContent = '\u266B';
      btn.classList.add('music-on');
      play();
    } else {
      localStorage.setItem(KEY_ENABLED, '0');
      btn.textContent = '\u266A';
      btn.classList.remove('music-on');
      audio.pause();
    }
  });

  document.body.appendChild(btn);
})();
