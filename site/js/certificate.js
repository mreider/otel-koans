/* OpenTelemetry Koans – Completion Certificate Generator
   Canvas-based shareable certificate for LinkedIn. */
(function () {
  'use strict';

  var SITE_URL = 'otel.mreider.com';
  var SHARE_URL = 'https://otel.mreider.com';
  var TOTAL_KOANS = 29;

  /* ── i18n helper ── */
  function t(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      var v = window.i18n.t(key);
      return v !== key ? v : (fallback || key);
    }
    return fallback || key;
  }

  /* ── Trophy SVG (for nav button) ── */
  var TROPHY_SVG = '<svg viewBox="0 0 24 24" width="16" height="16">' +
    '<path d="M5 3h14v2h3v3c0 1.7-1.3 3-3 3h-.7c-.7 1.8-2.2 3-4.3 3.3V17h3v2H7v-2h3v-2.7C7.9 14 6.4 12.8 5.7 11H5c-1.7 0-3-1.3-3-3V5h3V3z' +
    'M5 7H4v1c0 .6.4 1 1 1h.2C5.1 8.4 5 7.7 5 7z' +
    'M19 7v0c0 .7-.1 1.4-.2 2H19c.6 0 1-.4 1-1V7h-1z' +
    'M7 5v2c0 2.8 2.2 5 5 5s5-2.2 5-5V5H7z" fill="currentColor"/>' +
    '</svg>';

  /* ── Draw trophy on canvas ── */
  function drawTrophy(ctx, cx, cy, scale) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Gold gradient
    var grad = ctx.createLinearGradient(0, -40, 0, 40);
    grad.addColorStop(0, '#f0c040');
    grad.addColorStop(0.5, '#d4a020');
    grad.addColorStop(1, '#b8860b');

    // Cup body
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-22, -32);
    ctx.bezierCurveTo(-24, -10, -18, 10, -10, 18);
    ctx.lineTo(-6, 22);
    ctx.lineTo(6, 22);
    ctx.lineTo(10, 18);
    ctx.bezierCurveTo(18, 10, 24, -10, 22, -32);
    ctx.closePath();
    ctx.fill();

    // Highlight on cup
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(-14, -28);
    ctx.bezierCurveTo(-16, -10, -12, 5, -8, 14);
    ctx.lineTo(-4, 14);
    ctx.bezierCurveTo(-8, 5, -10, -10, -8, -28);
    ctx.closePath();
    ctx.fill();

    // Handles
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-25, -12, 9, -1.2, 1.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(25, -12, 9, Math.PI - 1.2, Math.PI + 1.2);
    ctx.stroke();

    // Stem
    ctx.fillStyle = grad;
    ctx.fillRect(-3, 22, 6, 10);

    // Base
    ctx.beginPath();
    ctx.moveTo(-14, 32);
    ctx.lineTo(14, 32);
    ctx.lineTo(11, 38);
    ctx.lineTo(-11, 38);
    ctx.closePath();
    ctx.fill();

    // Star on cup
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawStar(ctx, 0, -8, 5, 7, 5);

    ctx.restore();
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (var i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  }

  /* ── OpenTelemetry logo paths (128×128 viewBox) ── */
  var OTEL_ORANGE = 'M67.648 69.797c-5.246 5.25-5.246 13.758 0 19.008 5.25 5.246 13.758 5.246 19.004 0 5.25-5.25 5.25-13.758 0-19.008-5.246-5.246-13.754-5.246-19.004 0Zm14.207 14.219a6.649 6.649 0 0 1-9.41 0 6.65 6.65 0 0 1 0-9.407 6.649 6.649 0 0 1 9.41 0c2.598 2.586 2.598 6.809 0 9.407ZM86.43 3.672l-8.235 8.234a4.17 4.17 0 0 0 0 5.875l32.149 32.149a4.17 4.17 0 0 0 5.875 0l8.234-8.235c1.61-1.61 1.61-4.261 0-5.87L92.29 3.671a4.159 4.159 0 0 0-5.86 0ZM28.738 108.895a3.763 3.763 0 0 0 0-5.31l-4.183-4.187a3.768 3.768 0 0 0-5.313 0l-8.644 8.649-.016.012-2.371-2.375c-1.313-1.313-3.45-1.313-4.75 0-1.313 1.312-1.313 3.449 0 4.75l14.246 14.242a3.353 3.353 0 0 0 4.746 0c1.3-1.313 1.313-3.45 0-4.746l-2.375-2.375.016-.012Zm0 0';
  var OTEL_BLUE = 'M72.297 27.313 54.004 45.605c-1.625 1.625-1.625 4.301 0 5.926L65.3 62.824c7.984-5.746 19.18-5.035 26.363 2.153l9.148-9.149c1.622-1.625 1.622-4.297 0-5.922L78.22 27.313a4.185 4.185 0 0 0-5.922 0ZM60.55 67.585l-6.672-6.672c-1.563-1.562-4.125-1.562-5.684 0l-23.53 23.54a4.036 4.036 0 0 0 0 5.687l13.331 13.332a4.036 4.036 0 0 0 5.688 0l15.132-15.157c-3.199-6.609-2.625-14.593 1.735-20.73Zm0 0';

  function drawOTelLogo(ctx, cx, cy, scale) {
    ctx.save();
    ctx.translate(cx - 64 * scale, cy - 64 * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f5a800';
    ctx.fill(new Path2D(OTEL_ORANGE));
    ctx.fillStyle = '#425cc7';
    ctx.fill(new Path2D(OTEL_BLUE));
    ctx.restore();
  }

  function drawOTelWatermark(ctx, cx, cy, scale, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(cx - 64 * scale, cy - 64 * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#58a6ff';
    ctx.fill(new Path2D(OTEL_ORANGE));
    ctx.fill(new Path2D(OTEL_BLUE));
    ctx.restore();
  }

  /* ── Certificate border system ── */
  function drawCertificateBorder(ctx, w, h) {
    // Layer 1: Outer guard line — barely visible outermost boundary
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.1)';
    ctx.lineWidth = 0.5;
    roundRect(ctx, 18, 12, w - 36, h - 24, 8);
    ctx.stroke();

    // Layer 2: Main double-line border with glow
    // Glow pass — soft bloom behind the crisp line
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.06)';
    ctx.lineWidth = 6;
    roundRect(ctx, 30, 22, w - 60, h - 44, 6);
    ctx.stroke();
    // Outer line of the double border
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.35)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 30, 22, w - 60, h - 44, 6);
    ctx.stroke();
    // Inner line of the double border (6px channel)
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.2)';
    ctx.lineWidth = 0.75;
    roundRect(ctx, 38, 30, w - 76, h - 60, 4);
    ctx.stroke();

    // Layer 3: Guilloche wave pattern in the channel between double lines
    drawGuilloche(ctx, w, h);

    // Layer 4: Inner content border — whisper of structure
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.06)';
    ctx.lineWidth = 0.5;
    roundRect(ctx, 48, 40, w - 96, h - 80, 3);
    ctx.stroke();

    // Corner rosettes at the four corners of the main border
    drawCornerRosettes(ctx, w, h);
  }

  function drawGuilloche(ctx, w, h) {
    var amp = 2.8;         // wave amplitude (fits in 6px channel)
    var waveLen = 36;      // wavelength
    var halfWave = waveLen / 2;
    var cp = waveLen / 4;  // control point offset

    ctx.strokeStyle = 'rgba(88, 166, 255, 0.14)';
    ctx.lineWidth = 0.5;

    // Midline of the channel: between the 30px and 38px borders
    var midY_top = 26;     // midpoint between y=22 and y=30
    var midY_bot = h - 26;
    var midX_left = 34;    // midpoint between x=30 and x=38
    var midX_right = w - 34;

    // Rounded corner insets — don't draw waves into corners
    var cornerSkip = 16;
    var xStart = 30 + cornerSkip;
    var xEnd = w - 30 - cornerSkip;
    var yStart = 22 + cornerSkip;
    var yEnd = h - 22 - cornerSkip;

    // ── Top edge: two interleaved sine waves ──
    drawWaveLine(ctx, xStart, midY_top, xEnd, midY_top, amp, waveLen, cp, true);
    drawWaveLine(ctx, xStart + halfWave, midY_top, xEnd, midY_top, amp, waveLen, cp, false);

    // ── Bottom edge ──
    drawWaveLine(ctx, xStart, midY_bot, xEnd, midY_bot, amp, waveLen, cp, true);
    drawWaveLine(ctx, xStart + halfWave, midY_bot, xEnd, midY_bot, amp, waveLen, cp, false);

    // ── Left edge (vertical) ──
    drawWaveLineV(ctx, midX_left, yStart, midX_left, yEnd, amp, waveLen, cp, true);
    drawWaveLineV(ctx, midX_left, yStart + halfWave, midX_left, yEnd, amp, waveLen, cp, false);

    // ── Right edge (vertical) ──
    drawWaveLineV(ctx, midX_right, yStart, midX_right, yEnd, amp, waveLen, cp, true);
    drawWaveLineV(ctx, midX_right, yStart + halfWave, midX_right, yEnd, amp, waveLen, cp, false);
  }

  // Horizontal sine wave using bezier curves
  function drawWaveLine(ctx, x1, y, x2, _y, amp, waveLen, cp, startUp) {
    var dir = startUp ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    for (var x = x1; x < x2; x += waveLen / 2) {
      var segEnd = Math.min(x + waveLen / 2, x2);
      var segLen = segEnd - x;
      var ratio = segLen / (waveLen / 2);
      ctx.bezierCurveTo(
        x + cp * ratio, y + amp * dir * ratio,
        segEnd - cp * ratio, y + amp * dir * ratio,
        segEnd, y
      );
      dir *= -1;
    }
    ctx.stroke();
  }

  // Vertical sine wave using bezier curves
  function drawWaveLineV(ctx, x, y1, _x, y2, amp, waveLen, cp, startRight) {
    var dir = startRight ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    for (var y = y1; y < y2; y += waveLen / 2) {
      var segEnd = Math.min(y + waveLen / 2, y2);
      var segLen = segEnd - y;
      var ratio = segLen / (waveLen / 2);
      ctx.bezierCurveTo(
        x + amp * dir * ratio, y + cp * ratio,
        x + amp * dir * ratio, segEnd - cp * ratio,
        x, segEnd
      );
      dir *= -1;
    }
    ctx.stroke();
  }

  function drawCornerRosettes(ctx, w, h) {
    // Small radial bursts at each corner of the main border
    var corners = [
      [34, 26],           // top-left
      [w - 34, 26],       // top-right
      [34, h - 26],       // bottom-left
      [w - 34, h - 26]    // bottom-right
    ];
    var spokes = 12;
    var spokeLen = 6;
    var angleStep = (Math.PI * 2) / spokes;

    ctx.strokeStyle = 'rgba(88, 166, 255, 0.25)';
    ctx.lineWidth = 0.75;

    corners.forEach(function (c) {
      // Radial spokes
      for (var i = 0; i < spokes; i++) {
        var angle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(
          c[0] + Math.cos(angle) * 2,
          c[1] + Math.sin(angle) * 2
        );
        ctx.lineTo(
          c[0] + Math.cos(angle) * spokeLen,
          c[1] + Math.sin(angle) * spokeLen
        );
        ctx.stroke();
      }
      // Tiny center dot
      ctx.fillStyle = 'rgba(88, 166, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(c[0], c[1], 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ── Render certificate on canvas ── */
  function renderCertificate(canvas, name) {
    var ctx = canvas.getContext('2d');
    var w = 1200, h = 627;
    canvas.width = w;
    canvas.height = h;
    var cx = w / 2;
    var cy = h / 2;

    // Background gradient
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0d1117');
    bg.addColorStop(1, '#0a0e14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Centered radial glow
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 450);
    glow.addColorStop(0, 'rgba(88, 166, 255, 0.04)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // OTel watermark — large, centered, very subtle
    drawOTelWatermark(ctx, cx, cy, 4.0, 0.03);

    // ── Certificate border system (4 layers) ──
    drawCertificateBorder(ctx, w, h);

    // ── Left anchor: Trophy ──
    drawTrophy(ctx, 140, cy, 1.5);

    // ── Right anchor: OTel logo (monochrome, decorative) ──
    drawOTelWatermark(ctx, 1060, cy, 0.7, 0.15);

    // ── Centered text ──
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Branding
    ctx.font = '500 15px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#58a6ff';
    ctx.fillText('O P E N T E L E M E T R Y   K O A N S', cx, 95);

    // Wide accent line
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - 250, 130);
    ctx.lineTo(cx + 250, 130);
    ctx.stroke();

    // "COMPLETED"
    ctx.font = '300 22px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(165, 165, 165, 0.6)';
    ctx.fillText(t('cert.completed', 'COMPLETED'), cx, 175);

    // Name — the hero element
    ctx.font = 'italic 72px Baskerville, "Times New Roman", Georgia, serif';
    ctx.fillStyle = '#e6e6e6';
    var displayName = name.length > 24 ? name.substring(0, 21) + '\u2026' : name;
    ctx.fillText(displayName, cx, 300);

    // Wide accent below name
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - 250, 360);
    ctx.lineTo(cx + 250, 360);
    ctx.stroke();

    // Details: koan count + date
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var now = new Date();
    var dateStr = TOTAL_KOANS + ' koans \u00B7 ' + months[now.getMonth()] + ' ' + now.getFullYear();
    ctx.font = '20px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(165, 165, 165, 0.55)';
    ctx.fillText(dateStr, cx, 425);

    // Site URL
    ctx.font = '500 20px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#3fb950';
    ctx.fillText(SITE_URL, cx, 490);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ── Modal ── */
  function createModal() {
    var overlay = document.createElement('div');
    overlay.className = 'cert-overlay';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });

    var modal = document.createElement('div');
    modal.className = 'cert-modal';

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'cert-close';
    closeBtn.innerHTML = '\u00D7';
    closeBtn.addEventListener('click', function () { closeModal(overlay); });
    modal.appendChild(closeBtn);

    // Trophy icon header
    var iconWrap = document.createElement('div');
    iconWrap.className = 'cert-icon';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40">' +
      '<path d="M5 3h14v2h3v3c0 1.7-1.3 3-3 3h-.7c-.7 1.8-2.2 3-4.3 3.3V17h3v2H7v-2h3v-2.7C7.9 14 6.4 12.8 5.7 11H5c-1.7 0-3-1.3-3-3V5h3V3z' +
      'M5 7H4v1c0 .6.4 1 1 1h.2C5.1 8.4 5 7.7 5 7z' +
      'M19 7v0c0 .7-.1 1.4-.2 2H19c.6 0 1-.4 1-1V7h-1z' +
      'M7 5v2c0 2.8 2.2 5 5 5s5-2.2 5-5V5H7z" fill="#d29922"/>' +
      '</svg>';
    modal.appendChild(iconWrap);

    // Title
    var title = document.createElement('div');
    title.className = 'cert-title';
    title.textContent = t('cert.shareTitle', 'Share Your Achievement');
    modal.appendChild(title);

    // Subtitle
    var subtitle = document.createElement('div');
    subtitle.className = 'cert-subtitle';
    subtitle.textContent = t('cert.shareSubtitle', 'Generate a certificate to share on LinkedIn');
    modal.appendChild(subtitle);

    // Name input
    var inputWrap = document.createElement('div');
    inputWrap.className = 'cert-input-wrap';

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'cert-name-input';
    nameInput.placeholder = t('cert.namePlaceholder', 'Your name');
    nameInput.maxLength = 50;
    nameInput.autocomplete = 'name';
    inputWrap.appendChild(nameInput);
    modal.appendChild(inputWrap);

    // Canvas preview
    var previewWrap = document.createElement('div');
    previewWrap.className = 'cert-preview';
    previewWrap.style.display = 'none';

    var canvas = document.createElement('canvas');
    canvas.className = 'cert-canvas';
    previewWrap.appendChild(canvas);
    modal.appendChild(previewWrap);

    // Action buttons
    var actions = document.createElement('div');
    actions.className = 'cert-actions';

    var genBtn = document.createElement('button');
    genBtn.className = 'cert-btn cert-btn--generate';
    genBtn.textContent = t('cert.generate', 'Generate Certificate');
    actions.appendChild(genBtn);

    var dlBtn = document.createElement('button');
    dlBtn.className = 'cert-btn cert-btn--download';
    dlBtn.textContent = t('cert.download', 'Download Image');
    dlBtn.style.display = 'none';
    actions.appendChild(dlBtn);

    var liBtn = document.createElement('button');
    liBtn.className = 'cert-btn cert-btn--linkedin';
    liBtn.textContent = t('cert.shareLinkedIn', 'Share on LinkedIn');
    liBtn.style.display = 'none';
    actions.appendChild(liBtn);

    modal.appendChild(actions);

    // Hint text (shown after copy)
    var hint = document.createElement('div');
    hint.className = 'cert-hint';
    hint.style.display = 'none';
    modal.appendChild(hint);

    // Event handlers
    genBtn.addEventListener('click', function () {
      var name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        nameInput.classList.add('cert-shake');
        setTimeout(function () { nameInput.classList.remove('cert-shake'); }, 500);
        return;
      }
      renderCertificate(canvas, name);
      previewWrap.style.display = 'block';
      genBtn.style.display = 'none';
      dlBtn.style.display = '';
      liBtn.style.display = '';
      hint.style.display = '';
      // Scroll preview into view within modal
      previewWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') genBtn.click();
    });

    // Re-generate if name changes after first generation
    nameInput.addEventListener('input', function () {
      if (previewWrap.style.display !== 'none') {
        var name = nameInput.value.trim();
        if (name) renderCertificate(canvas, name);
      }
    });

    dlBtn.addEventListener('click', function () {
      var link = document.createElement('a');
      link.download = 'otel-koans-certificate.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    liBtn.addEventListener('click', function () {
      var url = encodeURIComponent(SHARE_URL);
      var shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;

      // Try to copy image to clipboard first, then open LinkedIn
      canvas.toBlob(function (blob) {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(function () {
            hint.textContent = t('cert.copiedHint', '\u2705 Image copied! Paste it into your LinkedIn post (Ctrl+V / \u2318V)');
            hint.style.display = '';
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
          }).catch(function () {
            // Clipboard failed — fall back to download + open
            downloadCert();
            hint.textContent = t('cert.downloadedHint', '\u2B07 Image downloaded! Attach it to your LinkedIn post');
            hint.style.display = '';
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
          });
        } else {
          // Clipboard API not available — download instead
          downloadCert();
          hint.textContent = t('cert.downloadedHint', '\u2B07 Image downloaded! Attach it to your LinkedIn post');
          hint.style.display = '';
          window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
      }, 'image/png');
    });

    function downloadCert() {
      var link = document.createElement('a');
      link.download = 'otel-koans-certificate.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    overlay.appendChild(modal);
    return overlay;
  }

  function openModal() {
    var existing = document.querySelector('.cert-overlay');
    if (existing) {
      existing.classList.add('cert-visible');
      var input = existing.querySelector('.cert-name-input');
      if (input) setTimeout(function () { input.focus(); }, 200);
      return;
    }
    var overlay = createModal();
    document.body.appendChild(overlay);
    // Trigger reflow then add class for animation
    overlay.offsetHeight;
    overlay.classList.add('cert-visible');
    var input = overlay.querySelector('.cert-name-input');
    if (input) setTimeout(function () { input.focus(); }, 300);
  }

  function closeModal(overlay) {
    overlay.classList.remove('cert-visible');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  }

  /* ── Public API ── */
  window.certificate = {
    open: openModal,
    TROPHY_SVG: TROPHY_SVG
  };
})();
