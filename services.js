(function() {
  'use strict';

  var isServicesPage = window.location.pathname.indexOf('services.html') !== -1;
  if (!isServicesPage) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    injectAnimationCSS();
    createHeroParticles();
    setupScrollReveal();
    setupStatsObserver();
    setupFAQSystem();
    setupNewsletterForms();
    setupScrollToTop();
    setupNavbarScroll();
  });

  function injectAnimationCSS() {
    if (document.getElementById('servicesAnimCSS')) return;
    
    var style = document.createElement('style');
    style.id = 'servicesAnimCSS';
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
        25% { opacity: 0.6; }
        50% { transform: translateY(-100px) translateX(40px); opacity: 0.8; }
        75% { opacity: 0.4; }
      }
      
      .reveal-up,
      .reveal-left,
      .reveal-right,
      .reveal-scale {
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .reveal-up { transform: translateY(60px); }
      .reveal-left { transform: translateX(-60px); }
      .reveal-right { transform: translateX(60px); }
      .reveal-scale { transform: scale(0.88); }
      
      .reveal-up.revealed,
      .reveal-left.revealed,
      .reveal-right.revealed,
      .reveal-scale.revealed {
        opacity: 1;
        transform: translateY(0) translateX(0) scale(1);
      }
      
      .scroll-to-top {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: all 0.3s ease !important;
      }
      
      .scroll-to-top.visible {
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      
      .navbar.scrolled {
        background: rgba(0, 0, 0, 0.98) !important;
        box-shadow: 0 4px 30px rgba(138, 43, 226, 0.15);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .reveal-up, .reveal-left, .reveal-right, .reveal-scale,
        .scroll-to-top, .navbar {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createHeroParticles() {
    var container = document.getElementById('heroParticles');
    if (!container) return;
    
    container.innerHTML = '';
    var count = window.innerWidth < 768 ? 20 : 30;
    
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'hero-particle';
      var size = 3 + Math.random() * 6;
      
      p.style.cssText = 
        'position:absolute;' +
        'background:rgba(138,43,226,' + (0.3 + Math.random() * 0.4) + ');' +
        'border-radius:50%;' +
        'pointer-events:none;' +
        'left:' + (Math.random() * 100) + '%;' +
        'top:' + (Math.random() * 100) + '%;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'animation:particleFloat ' + (6 + Math.random() * 8) + 's ease-in-out infinite;' +
        'animation-delay:' + (Math.random() * 5) + 's;';
      
      container.appendChild(p);
    }
  }

  function setupScrollReveal() {
    addRevealClasses();
    
    if (!window.IntersectionObserver) {
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(function(el) { 
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(function(el) {
        observer.observe(el);
      });
  }

  function addRevealClasses() {
    document.querySelectorAll('.stat-card').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 100) + 'ms';
    });

    document.querySelectorAll('.step-card').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 100) + 'ms';
    });

    document.querySelectorAll('.service-card').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 80) + 'ms';
    });

    document.querySelectorAll('.service-card-extended').forEach(function(el, i) {
      el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      el.style.transitionDelay = (i * 100) + 'ms';
    });

    document.querySelectorAll('.guarantee-card').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 80) + 'ms';
    });

    document.querySelectorAll('.testimonial-card').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 100) + 'ms';
    });

    document.querySelectorAll('.timeline-item').forEach(function(el, i) {
      if (el.classList.contains('left')) {
        el.classList.add('reveal-left');
      } else {
        el.classList.add('reveal-right');
      }
      el.style.transitionDelay = (i * 150) + 'ms';
    });

    document.querySelectorAll('.partner-card').forEach(function(el, i) {
      el.classList.add('reveal-scale');
      el.style.transitionDelay = (i * 60) + 'ms';
    });

    document.querySelectorAll('.faq-item').forEach(function(el, i) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 50) + 'ms';
    });

    document.querySelectorAll('.section-badge').forEach(function(el) {
      el.classList.add('reveal-scale');
    });

    var newsletter = document.querySelector('.newsletter-card');
    if (newsletter) newsletter.classList.add('reveal-up');

    var cta = document.querySelector('.cta-section');
    if (cta) cta.classList.add('reveal-scale');

    var table = document.querySelector('.table-responsive');
    if (table) table.classList.add('reveal-up');
  }

  function setupStatsObserver() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var hasAnimated = false;

    function animateCounters() {
      if (hasAnimated) return;
      hasAnimated = true;

      counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) return;

        var duration = 2200;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);

          if (target >= 1000) {
            counter.textContent = current.toLocaleString() + '+';
          } else if (target < 100) {
            counter.textContent = current + '%';
          } else {
            counter.textContent = current + '+';
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
      });
    }

    if (window.IntersectionObserver) {
      var section = document.querySelector('.stats-section');
      if (section) {
        var observer = new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        }, { threshold: 0.3 });
        observer.observe(section);
      }
    } else {
      setTimeout(animateCounters, 1000);
    }
  }

  function setupFAQSystem() {
    var tabs = document.querySelectorAll('.faq-tab');
    var items = document.querySelectorAll('.faq-item');
    var searchInput = document.getElementById('faqSearchInput');
    var clearBtn = document.getElementById('faqSearchClear');
    var noResults = document.getElementById('faqNoResults');

    if (!tabs.length) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var cat = tab.getAttribute('data-category');
        if (searchInput) {
          searchInput.value = '';
          if (clearBtn) clearBtn.style.display = 'none';
        }

        var visible = 0;
        items.forEach(function(item) {
          var itemCat = item.getAttribute('data-category');
          if (cat === 'all' || itemCat === cat) {
            item.style.display = '';
            visible++;
          } else {
            item.style.display = 'none';
          }
        });

        if (noResults) {
          noResults.style.display = visible === 0 ? 'block' : 'none';
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        if (query) {
          tabs.forEach(function(t) { t.classList.remove('active'); });
          var allTab = document.querySelector('.faq-tab[data-category="all"]');
          if (allTab) allTab.classList.add('active');
        }

        var visible = 0;
        items.forEach(function(item) {
          var text = item.textContent.toLowerCase();
          if (!query || text.indexOf(query) !== -1) {
            item.style.display = '';
            visible++;
          } else {
            item.style.display = 'none';
          }
        });

        if (noResults) {
          noResults.style.display = (visible === 0 && query) ? 'block' : 'none';
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    }
  }

  function setupNewsletterForms() {
    var forms = ['serviceNewsletterForm', 'footerNewsletterForm'];
    
    forms.forEach(function(id) {
      var form = document.getElementById(id);
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var input = form.querySelector('input[type="email"]');
          if (input && input.value.trim()) {
            if (typeof showToast === 'function') {
              showToast('Thanks for subscribing!', 'success');
            } else {
              alert('Thanks for subscribing!');
            }
            input.value = '';
          }
        });
      }
    });
  }

  function setupScrollToTop() {
    var btn = document.querySelector('.scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupNavbarScroll() {
    var nav = document.getElementById('mainNavbar') || document.querySelector('.navbar');
    if (!nav) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  window.subscribeToPlan = function(plan) {
    if (typeof showToast === 'function') {
      showToast('Subscribed to ' + plan.toUpperCase() + ' plan!', 'success');
    } else {
      alert('Subscribed to ' + plan.toUpperCase() + ' plan!');
    }
  };

})();