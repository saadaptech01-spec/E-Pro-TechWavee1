(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initImageZoom();
    initTooltips();
    initRippleEffect();
    initParallax();
    initCountUp();
    initTypewriter();
    initSmoothReveal();
    console.log('✨ Enhancements loaded');
  });

  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      var lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  function initImageZoom() {
    document.querySelectorAll('.product-image-wrap').forEach(function(wrap) {
      var img = wrap.querySelector('img');
      if (!img) return;

      wrap.addEventListener('mousemove', function(e) {
        var rect = wrap.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width * 100;
        var y = (e.clientY - rect.top) / rect.height * 100;
        img.style.transformOrigin = x + '% ' + y + '%';
      });
    });
  }

  function initTooltips() {
    document.querySelectorAll('[title]').forEach(function(el) {
      var title = el.getAttribute('title');
      if (!title) return;

      el.removeAttribute('title');
      el.setAttribute('data-tooltip', title);

      el.addEventListener('mouseenter', function(e) {
        var tooltip = document.createElement('div');
        tooltip.className = 'tw-tooltip';
        tooltip.textContent = title;
        document.body.appendChild(tooltip);

        var rect = el.getBoundingClientRect();
        tooltip.style.cssText = 'position:fixed;background:rgba(0,0,0,0.9);color:#fff;padding:8px 12px;border-radius:6px;font-size:0.8rem;z-index:9999;pointer-events:none;white-space:nowrap;animation:fadeIn 0.2s ease;top:' + (rect.top - 40) + 'px;left:' + (rect.left + rect.width / 2) + 'px;transform:translateX(-50%);';
        
        el._tooltip = tooltip;
      });

      el.addEventListener('mouseleave', function() {
        if (el._tooltip) {
          el._tooltip.remove();
          delete el._tooltip;
        }
      });
    });
  }

  function initRippleEffect() {
    document.querySelectorAll('.btn, .quick-tab, .brand-pill, .appliance-type-card').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;left:' + x + 'px;top:' + y + 'px;width:100px;height:100px;margin-left:-50px;margin-top:-50px;';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(function() {
          ripple.remove();
        }, 600);
      });
    });

    if (!document.getElementById('ripple-styles')) {
      var style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
      document.head.appendChild(style);
    }
  }

  function initParallax() {
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrolled = window.pageYOffset;
          
          parallaxElements.forEach(function(el) {
            var speed = parseFloat(el.dataset.parallax) || 0.5;
            var offset = scrolled * speed;
            el.style.transform = 'translateY(' + offset + 'px)';
          });
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initCountUp() {
    var counters = document.querySelectorAll('[data-count-up]');
    if (counters.length === 0) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function(counter) {
        observer.observe(counter);
      });
    }
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.countUp) || 0;
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  function initTypewriter() {
    var typewriters = document.querySelectorAll('[data-typewriter]');
    
    typewriters.forEach(function(el) {
      var text = el.dataset.typewriter || el.textContent;
      var speed = parseInt(el.dataset.typewriterSpeed) || 50;
      
      el.textContent = '';
      el.style.borderRight = '2px solid var(--primary)';
      
      var i = 0;
      function type() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {

          setInterval(function() {
            el.style.borderRightColor = el.style.borderRightColor === 'transparent' ? 'var(--primary)' : 'transparent';
          }, 500);
        }
      }
      
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting) {
            type();
            observer.disconnect();
          }
        });
        observer.observe(el);
      } else {
        type();
      }
    });
  }

  function initSmoothReveal() {
    var revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length === 0) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = parseInt(el.dataset.revealDelay) || 0;
            
            setTimeout(function() {
              el.classList.add('revealed');
            }, delay);
            
            observer.unobserve(el);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }

    if (!document.getElementById('reveal-styles')) {
      var style = document.createElement('style');
      style.id = 'reveal-styles';
      style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
      document.head.appendChild(style);
    }
  }

  document.addEventListener('keydown', function(e) {
   
    if (e.key === 'Escape') {
      var openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(function(modal) {
        var instance = bootstrap.Modal.getInstance(modal);
        if (instance) instance.hide();
      });
    }
    
    if (e.key === '/' && !isInputFocused()) {
      e.preventDefault();
      var searchInput = document.getElementById('productSearchInline') || document.getElementById('searchInput');
      if (searchInput) searchInput.focus();
    }
  });

  function isInputFocused() {
    var active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      
      var target;
      try {
        target = document.querySelector(href);
      } catch (err) {
        return;
      }
      
      if (target) {
        e.preventDefault();
        var offset = 100;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  window.TW = window.TW || {};
  
  window.TW.smoothScrollTo = function(element, offset) {
    offset = offset || 100;
    var top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  };

  window.TW.animateElement = function(element, animation, duration) {
    duration = duration || 500;
    element.style.animation = animation + ' ' + duration + 'ms ease';
    setTimeout(function() {
      element.style.animation = '';
    }, duration);
  };

})();

console.log('✨ enhancements.js loaded');