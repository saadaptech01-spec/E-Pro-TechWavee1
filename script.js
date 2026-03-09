(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimer();
    initOfferCountdown();
    initScrollToTop();
    initScrollAnimations();
    initNavbarScroll();
    initStatsCounter();
    initNewsletterForms();
    initFAQSystem();
    initSearchForm();
    initVideoPlayer();
    initSmoothScroll();
    initParticleCanvas();
    initHeroCarousel();
    initMobileNavClose();
    console.log('✅ TechWave script.js v3.0 loaded — all systems go');
  });

  function initFAQSystem() {
    var categoryTabs = document.querySelectorAll('#faqCategoryTabs .faq-tab');
    var faqItems = document.querySelectorAll('.faq-item');
    var searchInput = document.getElementById('faqSearchInput');
    var searchClear = document.getElementById('faqSearchClear');
    var noResults = document.getElementById('faqNoResults');
    var accordion = document.getElementById('faqAccordion');

    if (!accordion || faqItems.length === 0) {
      console.log('  ⚠️ FAQ section not found on this page');
      return;
    }

    var currentCategory = 'all';
    var currentQuery = '';

    categoryTabs.forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        e.preventDefault();

        categoryTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        currentCategory = this.getAttribute('data-category') || 'all';

        if (searchInput) {
          searchInput.value = '';
          currentQuery = '';
          if (searchClear) searchClear.style.display = 'none';
        }

        applyFilters();
      });
    });

    if (searchInput) {
      var debounceTimer = null;

      searchInput.addEventListener('input', function() {
        var val = this.value.trim();

        if (searchClear) {
          searchClear.style.display = val.length > 0 ? 'flex' : 'none';
        }

        if (val.length > 0) {
          categoryTabs.forEach(function(t) { t.classList.remove('active'); });
          var allTab = document.querySelector('#faqCategoryTabs .faq-tab[data-category="all"]');
          if (allTab) allTab.classList.add('active');
          currentCategory = 'all';
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          currentQuery = val.toLowerCase();
          applyFilters();
        }, 250);
      });

      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        this.style.display = 'none';
        currentQuery = '';
        applyFilters();
      });
    }

    function applyFilters() {
      var visibleCount = 0;
      var delay = 0;

      faqItems.forEach(function(item) {
        var itemCat = item.getAttribute('data-category') || '';
        var btn = item.querySelector('.accordion-button');
        var body = item.querySelector('.accordion-body');

        var questionText = btn ? btn.textContent.toLowerCase().trim() : '';
        var answerText = body ? body.textContent.toLowerCase().trim() : '';

        var catMatch = (currentCategory === 'all') || (itemCat === currentCategory);

        var searchMatch = true;
        if (currentQuery && currentQuery.length > 0) {
          searchMatch = questionText.indexOf(currentQuery) !== -1 ||
                        answerText.indexOf(currentQuery) !== -1;
        }

        if (catMatch && searchMatch) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';

          (function(el, d) {
            setTimeout(function() {
              el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, d);
          })(item, delay);

          delay += 60;
          visibleCount++;
        } else {
          item.style.display = 'none';

          var collapseEl = item.querySelector('.accordion-collapse.show');
          if (collapseEl) {
            try {
              var bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
              if (bsCollapse) bsCollapse.hide();
            } catch (e) {}
          }
        }
      });

      if (noResults) {
        if (visibleCount === 0) {
          noResults.style.display = 'block';
          noResults.style.opacity = '0';
          setTimeout(function() {
            noResults.style.transition = 'opacity 0.3s ease';
            noResults.style.opacity = '1';
          }, 50);
        } else {
          noResults.style.display = 'none';
        }
      }
    }

    console.log('  ✅ FAQ system initialized — ' + faqItems.length + ' items, ' + categoryTabs.length + ' categories');
  }

  function initCountdownTimer() {
    var timerEl = document.getElementById('countdownTimer');
    if (!timerEl) return;

    var storageKey = 'tw_flash_end';
    var endTime = parseInt(localStorage.getItem(storageKey));

    if (!endTime || isNaN(endTime) || endTime <= Date.now()) {
      endTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(storageKey, endTime.toString());
    }

    function tick() {
      var diff = endTime - Date.now();

      if (diff <= 0) {
        endTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(storageKey, endTime.toString());
        diff = endTime - Date.now();
      }

      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      timerEl.textContent =
        (h < 10 ? '0' : '') + h + ':' +
        (m < 10 ? '0' : '') + m + ':' +
        (s < 10 ? '0' : '') + s;
    }

    tick();
    setInterval(tick, 1000);
    console.log('  ✅ Top bar countdown initialized');
  }

  function initOfferCountdown() {
    var hoursEl = document.getElementById('offer1-hours');
    var minsEl = document.getElementById('offer1-mins');
    var secsEl = document.getElementById('offer1-secs');

    if (!hoursEl || !minsEl || !secsEl) return;

    var storageKey = 'tw_offer_end';
    var endTime = parseInt(localStorage.getItem(storageKey));

    if (!endTime || isNaN(endTime) || endTime <= Date.now()) {
      endTime = Date.now() + (23 * 3600000 + 59 * 60000 + 59 * 1000);
      localStorage.setItem(storageKey, endTime.toString());
    }

    function tick() {
      var diff = endTime - Date.now();

      if (diff <= 0) {
        endTime = Date.now() + (24 * 3600000);
        localStorage.setItem(storageKey, endTime.toString());
        diff = endTime - Date.now();
      }

      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      hoursEl.textContent = h < 10 ? '0' + h : h;
      minsEl.textContent = m < 10 ? '0' + m : m;
      secsEl.textContent = s < 10 ? '0' + s : s;
    }

    tick();
    setInterval(tick, 1000);
    console.log('  ✅ Offer countdown initialized');
  }

  function initScrollToTop() {
    var btn = document.getElementById('scrollTopBtn');
    var circle = document.getElementById('scrollProgressCircle');
    if (!btn) return;

    var circumference = 2 * Math.PI * 23;

    function onScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollTop > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }

      if (circle && docHeight > 0) {
        var percent = scrollTop / docHeight;
        var offset = circumference - (percent * circumference);
        circle.style.strokeDashoffset = offset;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onScroll();
    console.log('  ✅ Scroll-to-top initialized');
  }

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-slide-up');
    if (elements.length === 0) return;

    elements.forEach(function(el) {
      if (!el.closest('.carousel-item') && !el.closest('.carousel-inner')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      }
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var parent = el.parentElement;
            var siblings = parent ? parent.querySelectorAll('.animate-slide-up') : [];
            var index = Array.prototype.indexOf.call(siblings, el);
            var delay = Math.max(0, index) * 100;

            setTimeout(function() {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);

            observer.unobserve(el);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(function(el) {
        if (!el.closest('.carousel-item') && !el.closest('.carousel-inner')) {
          observer.observe(el);
        }
      });
    } else {
      elements.forEach(function(el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }

    console.log('  ✅ Scroll animations initialized — ' + elements.length + ' elements');
  }

  function initNavbarScroll() {
    var navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    var lastScroll = 0;
    var ticking = false;

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      if (scrollTop > 500) {
        if (scrollTop > lastScroll + 15) {
          navbar.style.transform = 'translateY(-100%)';
          navbar.style.transition = 'transform 0.35s ease';
        } else if (scrollTop < lastScroll - 10) {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScroll = scrollTop;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    console.log('  ✅ Navbar scroll behavior initialized');
  }

  function initStatsCounter() {
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length === 0) return;

    var hasAnimated = false;

    function animateAll() {
      if (hasAnimated) return;
      hasAnimated = true;

      statNumbers.forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count'));
        if (isNaN(target)) return;

        var duration = 2200;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);

          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);

          if (target >= 10000) {
            el.textContent = current.toLocaleString();
          } else {
            el.textContent = current;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            if (target >= 10000) {
              el.textContent = target.toLocaleString();
            } else {
              el.textContent = target;
            }
          }
        }

        requestAnimationFrame(step);
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateAll();
            observer.disconnect();
          }
        });
      }, { threshold: 0.25 });

      var section = document.querySelector('.stats-section');
      if (section) {
        observer.observe(section);
      }
    } else {
      setTimeout(animateAll, 2000);
    }

    console.log('  ✅ Stats counter initialized — ' + statNumbers.length + ' counters');
  }

  function initNewsletterForms() {
    handleNewsletterForm('newsletterForm', 'Successfully subscribed! 🎉 Check your email for 10% off.');
    handleNewsletterForm('footerNewsletterForm', 'Subscribed successfully! Welcome aboard. 🚀');
  }

  function handleNewsletterForm(formId, successMessage) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var emailInput = this.querySelector('input[type="email"]');
      var btn = this.querySelector('button[type="submit"]');

      if (!emailInput || !emailInput.value.trim()) {
        if (typeof showToast === 'function') {
          showToast('Please enter your email address', 'warning');
        }
        return;
      }

      var email = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (typeof showToast === 'function') {
          showToast('Please enter a valid email address', 'error');
        }
        return;
      }

      var origHTML = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
        btn.disabled = true;
      }

      setTimeout(function() {
        if (typeof showToast === 'function') {
          showToast(successMessage, 'success');
        } else {
          alert(successMessage);
        }
        emailInput.value = '';
        if (btn) {
          btn.innerHTML = origHTML;
          btn.disabled = false;
        }
      }, 1500);
    });
  }

  function initSearchForm() {
    var forms = document.querySelectorAll('#searchForm');
    var input = document.getElementById('searchInput');
    var suggestions = document.getElementById('searchSuggestions');

    if (!input) {
      console.log('  ⚠️ Search input not found');
      return;
    }

    forms.forEach(function(form) {
      form.removeAttribute('action');
      form.setAttribute('method', 'get');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var query = input.value.trim();
        if (query.length > 0) {
          if (suggestions) suggestions.style.display = 'none';

          if (window.location.pathname.indexOf('product.html') !== -1) {
            var productSearchInput = document.getElementById('productSearchInline');
            if (productSearchInput) {
              productSearchInput.value = query;
              productSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            var url = window.location.pathname + '?search=' + encodeURIComponent(query);
            window.history.replaceState({}, '', url);
            input.value = '';
            input.blur();

            if (typeof showToast === 'function') {
              showToast('Searching for "' + query + '"...', 'info');
            }
          } else {
            window.location.href = 'product.html?search=' + encodeURIComponent(query);
          }
        } else {
          if (typeof showToast === 'function') {
            showToast('Please enter a search term', 'warning');
          }
          input.focus();
        }

        return false;
      });
    });

    var searchBtns = document.querySelectorAll('.btn-search-enhanced, .btn-search');
    searchBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var form = this.closest('form') || document.getElementById('searchForm');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var form = this.closest('form') || document.getElementById('searchForm');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
      if (e.key === 'Escape') {
        if (suggestions) suggestions.style.display = 'none';
        this.blur();
      }
    });

    var searchTimer = null;

    input.addEventListener('input', function() {
      var query = this.value.trim().toLowerCase();
      clearTimeout(searchTimer);

      if (query.length < 2) {
        hideSuggestions();
        return;
      }

      searchTimer = setTimeout(function() {
        var allProducts = [];

        var sources = [
          window.ALL_PRODUCTS,
          window.TECHWAVE_PRODUCTS,
          window.products,
          window.allProducts
        ];

        sources.forEach(function(src) {
          if (src && Array.isArray(src)) {
            src.forEach(function(p) {
              var exists = allProducts.some(function(existing) {
                return existing.id === p.id && existing.name === p.name;
              });
              if (!exists && p.name && p.price) {
                allProducts.push(p);
              }
            });
          }
        });

        var matches = [];
        for (var i = 0; i < allProducts.length && matches.length < 6; i++) {
          var p = allProducts[i];
          var nameMatch = p.name && p.name.toLowerCase().indexOf(query) !== -1;
          var catMatch = p.category && p.category.toLowerCase().indexOf(query) !== -1;
          var descMatch = p.description && p.description.toLowerCase().indexOf(query) !== -1;
          var brandMatch = p.brand && p.brand.toLowerCase().indexOf(query) !== -1;

          if (nameMatch || catMatch || descMatch || brandMatch) {
            matches.push(p);
          }
        }

        if (matches.length > 0 && suggestions) {
          var html = '';

          matches.forEach(function(p) {
            var discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
            var imgSrc = p.image || 'https://via.placeholder.com/40x40/1a1a2e/8a2be2?text=' + encodeURIComponent(p.name.charAt(0));

            html +=
              '<div class="search-suggestion-item" data-product-id="' + p.id + '">' +
                '<img src="' + imgSrc + '" alt="" ' +
                  'style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:12px;flex-shrink:0;" ' +
                  'onerror="this.style.display=\'none\'">' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="font-weight:600;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff;">' +
                    highlightSearchMatch(p.name, query) +
                  '</div>' +
                  '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);">' +
                    (p.brand ? escHTML(p.brand) + ' · ' : '') +
                    escHTML(p.category || '') +
                  '</div>' +
                '</div>' +
                '<div style="text-align:right;flex-shrink:0;">' +
                  '<div style="font-weight:700;color:#8a2be2;">$' + p.price.toFixed(2) + '</div>' +
                  (discount > 0 ? '<div style="font-size:0.7rem;color:#22c55e;">-' + discount + '% OFF</div>' : '') +
                '</div>' +
              '</div>';
          });

          var searchQuery = input.value.trim();
          html +=
            '<div class="search-suggestion-item search-view-all" data-action="view-all">' +
              '<div style="width:100%;text-align:center;color:#8a2be2;font-weight:600;font-size:0.85rem;">' +
                '<i class="fas fa-search me-2"></i>View all results for "' + escHTML(searchQuery) + '"' +
              '</div>' +
            '</div>';

          suggestions.innerHTML = html;
          suggestions.style.display = 'block';

          var items = suggestions.querySelectorAll('.search-suggestion-item');
          items.forEach(function(item) {
            item.style.cssText += 'display:flex;align-items:center;padding:10px 14px;cursor:pointer;' +
              'border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s;';

            item.addEventListener('mouseenter', function() {
              this.style.background = 'rgba(138,43,226,0.1)';
            });
            item.addEventListener('mouseleave', function() {
              this.style.background = 'transparent';
            });

            item.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();

              var action = this.getAttribute('data-action');
              var productId = this.getAttribute('data-product-id');

              if (action === 'view-all') {
                window.location.href = 'product.html?search=' + encodeURIComponent(searchQuery);
              } else if (productId) {
                var id = parseInt(productId);
                if (typeof openProductModal === 'function') {
                  openProductModal(id);
                } else if (typeof openProductDetail === 'function') {
                  openProductDetail(id);
                } else {
                  window.location.href = 'product.html?search=' + encodeURIComponent(input.value.trim());
                }
              }

              hideSuggestions();
              input.value = '';
              input.blur();
            });
          });

        } else if (suggestions) {
          suggestions.innerHTML =
            '<div style="padding:20px;text-align:center;color:rgba(255,255,255,0.5);">' +
              '<i class="fas fa-search" style="font-size:1.5rem;margin-bottom:8px;display:block;opacity:0.3;"></i>' +
              '<div style="font-weight:600;margin-bottom:4px;">No results found</div>' +
              '<div style="font-size:0.8rem;">Try different keywords or browse ' +
                '<a href="product.html" style="color:#8a2be2;text-decoration:none;">all products</a>' +
              '</div>' +
            '</div>';
          suggestions.style.display = 'block';
        }
      }, 300);
    });

    input.addEventListener('focus', function() {
      if (this.value.trim().length >= 2) {
        this.dispatchEvent(new Event('input'));
      }
    });

    document.addEventListener('click', function(e) {
      var searchWrapper = e.target.closest('.search-form-enhanced, .search-wrapper-enhanced, #searchForm');
      if (!searchWrapper) {
        hideSuggestions();
      }
    });

    function hideSuggestions() {
      if (suggestions) suggestions.style.display = 'none';
    }

    function highlightSearchMatch(text, query) {
      if (!query) return escHTML(text);
      var safe = escHTML(text);
      try {
        var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escaped + ')', 'gi');
        return safe.replace(regex, '<strong style="color:#8a2be2;">$1</strong>');
      } catch (e) {
        return safe;
      }
    }

    console.log('  ✅ Search form initialized (no page reload)');
  }

  function initVideoPlayer() {
    var playBtn = document.querySelector('.play-btn');
    if (!playBtn) return;

    playBtn.addEventListener('click', function(e) {
      e.preventDefault();

      this.style.transform = 'scale(1.3)';
      var self = this;
      setTimeout(function() { self.style.transform = ''; }, 300);

      if (typeof showToast === 'function') {
        showToast('🎬 Video player coming soon! Stay tuned.', 'info');
      }
    });
  }

  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');

        if (!href || href === '#' || href.length < 2) return;

        if (this.getAttribute('onclick')) return;

        var target = null;
        try {
          target = document.querySelector(href);
        } catch (err) {
          return;
        }

        if (target) {
          e.preventDefault();

          var navbarHeight = 100;
          var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });

          closeMobileNav();
        }
      });
    });

    console.log('  ✅ Smooth scroll initialized');
  }

  function initParticleCanvas() {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var animId = null;
    var mouseX = -1000;
    var mouseY = -1000;

    var isMobile = window.innerWidth < 768;
    var PARTICLE_COUNT = isMobile ? 25 : 50;
    var CONNECTION_DIST = isMobile ? 100 : 150;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 270 : 220
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          p.vx += dx / dist * 0.01;
          p.vy += dy / dist * 0.01;
        }

        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1) {
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ', 70%, 60%, ' + p.opacity + ')';
        ctx.fill();
      }

      if (!isMobile) {
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var ddx = particles[a].x - particles[b].x;
            var ddy = particles[a].y - particles[b].y;
            var dd = Math.sqrt(ddx * ddx + ddy * ddy);

            if (dd < CONNECTION_DIST) {
              var lineOpacity = (1 - dd / CONNECTION_DIST) * 0.12;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.strokeStyle = 'rgba(138, 43, 226, ' + lineOpacity + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(animId);
        animId = null;
      } else {
        if (!animId) animate();
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        isMobile = window.innerWidth < 768;
        PARTICLE_COUNT = isMobile ? 25 : 50;
        CONNECTION_DIST = isMobile ? 100 : 150;
        init();
      }, 250);
    });

    init();
    animate();
    console.log('  ✅ Particle canvas initialized — ' + PARTICLE_COUNT + ' particles');
  }

  function initHeroCarousel() {
    var carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    carousel.addEventListener('slid.bs.carousel', function() {
      var activeSlide = carousel.querySelector('.carousel-item.active');
      if (!activeSlide) return;

      var captions = activeSlide.querySelectorAll('.animate-caption');
      captions.forEach(function(el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(function() {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 200 + (i * 150));
      });
    });

    var firstSlide = carousel.querySelector('.carousel-item.active');
    if (firstSlide) {
      var firstCaptions = firstSlide.querySelectorAll('.animate-caption');
      firstCaptions.forEach(function(el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(function() {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 500 + (i * 200));
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        var bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) bsCarousel.prev();
      } else if (e.key === 'ArrowRight') {
        var bsCarousel2 = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel2) bsCarousel2.next();
      }
    });

    console.log('  ✅ Hero carousel initialized');
  }

  function initMobileNavClose() {
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        closeMobileNav();
      });
    });
  }

  function closeMobileNav() {
    var navCollapse = document.querySelector('.navbar-collapse.show');
    if (navCollapse) {
      try {
        var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      } catch (e) {}
    }
  }

  function escHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();

function escHTML(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}