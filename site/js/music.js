/* Background music */
(function () {
  var VOLUME = 0.12;
  var KEY_ENABLED = 'otel-koans-music';
  var KEY_TIME = 'otel-koans-music-time';

  var isRoot = !location.pathname.match(/\/koans\//);
  var audioSrc = isRoot ? 'audio/bg-music.mp3' : '../audio/bg-music.mp3';

  var audio = new Audio(audioSrc);
  audio.loop = true;
  audio.volume = VOLUME;
  audio.preload = 'auto';

  // Save position periodically so next page can resume near same spot
  setInterval(function () {
    if (!audio.paused) {
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
    }
  }, 1000);

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

  function updateBtn() {
    var on = !audio.paused;
    btn.innerHTML = '\u266A<span class="music-bars"><span></span><span></span><span></span></span>';
    btn.classList.toggle('music-on', on);
  }

  function startPlayback() {
    var savedTime = parseFloat(localStorage.getItem(KEY_TIME) || '0');
    if (savedTime && isFinite(savedTime)) {
      // Set immediately - if duration isn't loaded yet, also set once metadata loads
      try { audio.currentTime = savedTime; } catch (e) {}
      audio.addEventListener('loadedmetadata', function handler() {
        if (savedTime < audio.duration) {
          audio.currentTime = savedTime;
        }
        audio.removeEventListener('loadedmetadata', handler);
      });
    }
    audio.play().then(updateBtn).catch(function () {});
  }

  // Toggle on click
  btn.addEventListener('click', function () {
    if (audio.paused) {
      localStorage.setItem(KEY_ENABLED, '1');
      startPlayback();
    } else {
      localStorage.setItem(KEY_ENABLED, '0');
      audio.pause();
    }
    updateBtn();
  });

  // Music is OFF by default. Only auto-start for returning users who enabled it.
  var userEnabled = localStorage.getItem(KEY_ENABLED) === '1';

  if (userEnabled) {
    startPlayback();
    // Fallback: start on first user interaction (browser autoplay policy)
    var autoStart = function () {
      if (audio.paused && localStorage.getItem(KEY_ENABLED) === '1') {
        startPlayback();
      }
      document.removeEventListener('click', autoStart, true);
      document.removeEventListener('keydown', autoStart, true);
    };
    document.addEventListener('click', autoStart, true);
    document.addEventListener('keydown', autoStart, true);
  }

  updateBtn();
  document.body.appendChild(btn);
})();
