(function () {
  'use strict';

  var CONFIG = {
    minLoadTime: 1200,
    maxLoadTime: 3000,
    fadeOutDelay: 200,
    transitionDuration: 600,
    progressSpeed: 20,
    particleCount: 35
  };

  var applianceIcons = [
    'fa-blender',
    'fa-tv',
    'fa-fan',
    'fa-snowflake',
    'fa-tshirt',
    'fa-fire-burner'
  ];

  var statusMessages = [
    { label: 'Initializing', detail: 'Starting up' },
    { label: 'Loading', detail: 'Fetching data' },
    { label: 'Rendering', detail: 'Building UI' },
    { label: 'Ready', detail: 'Welcome!' }
  ];

  var preloader = document.getElementById('twPreloader');
  var progressFill = document.getElementById('progressFill');
  var progressGlow = document.getElementById('progressGlow');
  var progressSpark = document.getElementById('progressSpark');
  var progressPercent = document.getElementById('progressPercent');
  var progressBytes = document.getElementById('progressBytes');
  var statusLabel = document.getElementById('statusLabel');
  var statusDetail = document.getElementById('statusDetail');
  var showcaseIcon = document.getElementById('showcaseIcon');
  var carouselItems = document.querySelectorAll('.carousel-icon-item');
  var particleCanvas = document.getElementById('preloaderParticles');
  var pageTransition = document.getElementById('twPageTransition');

  if (!preloader) return;

  var progress = 0;
  var loadComplete = false;
  var currentIndex = 0;
  var currentMsgIndex = 0;
  var progressInterval, cycleInterval, particleCtx, particles = [];

  document.body.style.overflow = 'hidden';

  function initParticles() {
    if (!particleCanvas) return;
    particleCtx = particleCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (var i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 270 : 225
      });
    }
    animateParticles();
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function animateParticles() {
    if (!particleCtx || !particleCanvas) return;
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(function (p) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;

      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      particleCtx.fillStyle = 'hsla(' + p.hue + ', 70%, 55%, ' + p.opacity + ')';
      particleCtx.fill();
    });

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          particleCtx.beginPath();
          particleCtx.moveTo(particles[i].x, particles[i].y);
          particleCtx.lineTo(particles[j].x, particles[j].y);
          particleCtx.strokeStyle = 'rgba(138,43,226,' + (0.06 * (1 - dist / 100)) + ')';
          particleCtx.lineWidth = 0.5;
          particleCtx.stroke();
        }
      }
    }

    if (!preloader.classList.contains('loaded')) {
      requestAnimationFrame(animateParticles);
    }
  }

  function cycleAppliances() {
    for (var i = 0; i < carouselItems.length; i++) {
      carouselItems[i].classList.remove('active');
      if (i < currentIndex) carouselItems[i].classList.add('loaded');
    }
    if (carouselItems[currentIndex]) carouselItems[currentIndex].classList.add('active');

    if (showcaseIcon && applianceIcons[currentIndex]) {
      showcaseIcon.style.opacity = '0';
      showcaseIcon.style.transform = 'scale(0.5) rotate(-20deg)';
      setTimeout(function () {
        showcaseIcon.className = 'fas ' + applianceIcons[currentIndex];
        showcaseIcon.style.opacity = '1';
        showcaseIcon.style.transform = 'scale(1) rotate(0deg)';
      }, 120);
    }

    currentIndex = (currentIndex + 1) % carouselItems.length;
  }

  function updateStatus(index) {
    if (index >= statusMessages.length) return;
    var msg = statusMessages[index];
    if (statusLabel) {
      statusLabel.style.opacity = '0';
      setTimeout(function () {
        statusLabel.textContent = msg.label;
        statusLabel.style.opacity = '1';
      }, 100);
    }
    if (statusDetail) {
      statusDetail.style.opacity = '0';
      setTimeout(function () {
        statusDetail.textContent = msg.detail;
        statusDetail.style.opacity = '1';
      }, 120);
    }
  }

  function updateProgress(value) {
    progress = Math.min(value, 100);

    if (progressFill) progressFill.style.width = progress + '%';

    if (progressGlow) {
      progressGlow.style.left = 'calc(' + progress + '% - 10px)';
      if (progress > 2) progressGlow.classList.add('active');
    }
    if (progressSpark) {
      progressSpark.style.left = 'calc(' + progress + '% - 5px)';
      if (progress > 2) progressSpark.classList.add('active');
    }

    if (progressPercent) progressPercent.textContent = Math.round(progress) + '%';

    if (progressBytes) {
      var kb = Math.round(progress * 42.5);
      progressBytes.textContent = kb > 1000 ? (kb / 1000).toFixed(1) + ' MB' : kb + ' KB';
    }

    if (progress > 10 && currentMsgIndex < 1) { currentMsgIndex = 1; updateStatus(1); }
    else if (progress > 50 && currentMsgIndex < 2) { currentMsgIndex = 2; updateStatus(2); }
    else if (progress >= 95 && currentMsgIndex < 3) { currentMsgIndex = 3; updateStatus(3); }
  }

  function simulateProgress() {
    progressInterval = setInterval(function () {

      if (loadComplete && progress < 85) {
        progress += 8;
      } else if (loadComplete && progress >= 85) {
        progress += 4;
      } else if (progress < 25) {
        progress += Math.random() * 4 + 2;
      } else if (progress < 50) {
        progress += Math.random() * 3 + 1.5;
      } else if (progress < 70) {
        progress += Math.random() * 2 + 1;
      } else if (progress < 85) {
        progress += Math.random() * 1.5 + 0.5;
      } else if (progress < 90) {
        progress += Math.random() * 0.8;
      }

      if (!loadComplete && progress >= 90) progress = 90;

      updateProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
        finishLoading();
      }
    }, CONFIG.progressSpeed);
  }

  function finishLoading() {
    clearInterval(cycleInterval);
    clearInterval(progressInterval);
    updateProgress(100);

    for (var i = 0; i < carouselItems.length; i++) {
      carouselItems[i].classList.remove('active');
      carouselItems[i].classList.add('loaded');
    }

    setTimeout(function () {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 600);
    }, CONFIG.fadeOutDelay);
  }

  initParticles();
  updateStatus(0);
  cycleAppliances();
  cycleInterval = setInterval(cycleAppliances, 500);
  simulateProgress();

  var startTime = Date.now();

  window.addEventListener('load', function () {
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(CONFIG.minLoadTime - elapsed, 0);
    setTimeout(function () { loadComplete = true; }, remaining);
  });

  setTimeout(function () {
    loadComplete = true;
    if (progress < 90) progress = 90;

    setTimeout(function () {
      if (!preloader.classList.contains('loaded')) {
        clearInterval(progressInterval);
        clearInterval(cycleInterval);
        updateProgress(100);

        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        setTimeout(function () {
          preloader.style.display = 'none';
        }, 600);
      }
    }, 500);
  }, CONFIG.maxLoadTime);

  function initPageTransitions() {
    if (!pageTransition) return;

    var links = document.querySelectorAll(
      'a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript:"]):not([target="_blank"]):not([data-no-transition])'
    );

    for (var i = 0; i < links.length; i++) {
      (function (link) {
        try {
          var url = new URL(link.href, window.location.origin);
          if (url.origin !== window.location.origin) return;
        } catch (e) { return; }

        link.addEventListener('click', function (e) {
          var href = this.getAttribute('href');
          if (!href || href === '#' || href.startsWith('#')) return;
          if (e.ctrlKey || e.metaKey || e.shiftKey) return;

          e.preventDefault();
          pageTransition.classList.add('active');

          setTimeout(function () {
            window.location.href = href;
          }, CONFIG.transitionDuration);
        });
      })(links[i]);
    }

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        pageTransition.classList.remove('active');
        pageTransition.classList.add('exit');
        setTimeout(function () {
          pageTransition.classList.remove('exit');
        }, 500);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }

})();