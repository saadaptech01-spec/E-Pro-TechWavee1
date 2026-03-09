(function() {
  'use strict';

  if (window.ABOUT_PAGE_INITIALIZED) {
    console.log('⚠️ About page already initialized, skipping...');
    return;
  }
  window.ABOUT_PAGE_INITIALIZED = true;

  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 About page initializing...');

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        offset: 100,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        disable: 'mobile'
      });
      console.log('  ✅ AOS initialized');
    }

    initAboutPage();
    animateTimeline();
    animateTestimonials();
    animateStats();
    animateTeamCards();
    initSmoothReveal();
    initNewsletterAbout();

    console.log('✅ About page loaded successfully!');
  });

  function initAboutPage() {
    if (typeof AppState !== 'undefined' && typeof refreshUI === 'function') {
      refreshUI();
      console.log('  ✅ UI state synced with shared.js');
    }

    setupSocialLinks();
  }

  function setupSocialLinks() {
    var socialLinks = document.querySelectorAll('.member-socials a, .team-socials a');
    socialLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof showToast === 'function') {
          showToast('Social links coming soon!', 'info');
        } else {
          alert('Social links coming soon!');
        }
      });
    });
  }

  function initNewsletterAbout() {
    var aboutForm = document.getElementById('aboutNewsletterForm');

    if (aboutForm) {
      aboutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var emailInput = this.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        var email = emailInput.value.trim();
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (typeof showToast === 'function') {
            showToast('Please enter a valid email address', 'error');
          } else {
            alert('Please enter a valid email address');
          }
          return;
        }

        var btn = this.querySelector('button[type="submit"]');
        var originalHTML = btn ? btn.innerHTML : '';
        if (btn) {
          btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
          btn.disabled = true;
        }

        setTimeout(function() {
          try {
            var subscribers = JSON.parse(localStorage.getItem('tw_subscribers')) || [];
            
            if (subscribers.includes(email)) {
              if (typeof showToast === 'function') {
                showToast('You are already subscribed!', 'info');
              } else {
                alert('You are already subscribed!');
              }
            } else {
              subscribers.push(email);
              localStorage.setItem('tw_subscribers', JSON.stringify(subscribers));
              
              if (typeof showToast === 'function') {
                showToast('🎉 Subscribed successfully! Check your email for 10% off.', 'success');
              } else {
                alert('Subscribed successfully! Check your email for 10% off.');
              }
            }
          } catch (err) {
            console.error('Newsletter error:', err);
            if (typeof showToast === 'function') {
              showToast('Something went wrong. Please try again.', 'error');
            }
          }
          
          emailInput.value = '';
          if (btn) {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }
        }, 1500);
      });

      console.log('  ✅ Newsletter form initialized');
    }
  }

  function animateTimeline() {
    var timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) {
      console.log('  ⚠️ No timeline items found');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var allItems = Array.from(timelineItems);
          var currentIndex = allItems.indexOf(entry.target);
          
          for (var i = 0; i <= currentIndex; i++) {
            if (!allItems[i].classList.contains('animate-in')) {
              setTimeout((function(item, delay) {
                return function() {
                  item.classList.add('animate-in');
                };
              })(allItems[i], i * 150), i * 150);
            }
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(function(item) {
      item.classList.add('timeline-animate');
      observer.observe(item);
    });

    console.log('  ✅ Timeline animation initialized (' + timelineItems.length + ' items)');
  }

  function animateTestimonials() {
    var testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialCards.length) {
      console.log('  ⚠️ No testimonial cards found (this is OK if not on this page)');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('reveal-visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    testimonialCards.forEach(function(card) {
      card.classList.add('reveal-element');
      observer.observe(card);
    });

    console.log('  ✅ Testimonials animation initialized (' + testimonialCards.length + ' cards)');
  }

  function animateStats() {
    var statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statNumbers.length) {
      console.log('  ⚠️ No stat numbers found');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var text = target.textContent;
          
          var match = text.match(/[\d,]+/);
          
          if (match) {
            var endValue = parseInt(match[0].replace(/,/g, ''));
            var suffix = text.replace(match[0], '');
            animateNumber(target, 0, endValue, 2000, suffix);
          }
          
          observer.unobserve(target);
        }
      });
    }, { 
      threshold: 0.5,
      rootMargin: '0px'
    });

    statNumbers.forEach(function(stat) {
      observer.observe(stat);
    });

    console.log('  ✅ Stats counter initialized (' + statNumbers.length + ' counters)');
  }

  function animateNumber(element, start, end, duration, suffix) {
    suffix = suffix || '';
    var startTime = performance.now();
    var hasComma = end >= 1000;
    
    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (end - start) * easeOut);
      
      var displayValue = hasComma ? current.toLocaleString() : current.toString();
      element.textContent = displayValue + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = (hasComma ? end.toLocaleString() : end.toString()) + suffix;
      }
    }
    
    requestAnimationFrame(update);
  }

  function animateTeamCards() {
    var teamCards = document.querySelectorAll('.team-member-card');
    
    if (!teamCards.length) {
      console.log('  ⚠️ No team cards found');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('card-visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    teamCards.forEach(function(card) {
      card.classList.add('card-animate');
      observer.observe(card);
    });

    console.log('  ✅ Team cards animation initialized (' + teamCards.length + ' members)');
  }

  function initSmoothReveal() {
    var revealElements = document.querySelectorAll(
      '.mvv-card, .why-card, .award-card, .story-content, .story-image'
    );

    if (!revealElements.length) {
      console.log('  ⚠️ No reveal elements found');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('smooth-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(function(el) {
      el.classList.add('smooth-reveal');
      observer.observe(el);
    });

    console.log('  ✅ Smooth reveal initialized (' + revealElements.length + ' elements)');
  }

  window.aboutPageReady = true;

  console.log('📄 about.js v4.0 loaded successfully');

})();