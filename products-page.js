(function() {
  'use strict';

  var CONFIG = {
    ANIMATION_DELAY: 40,
    DEBOUNCE_MS: 250,
    PRODUCTS_PER_PAGE: 12,
    INITIAL_LOAD: 12,
    LOAD_MORE_COUNT: 8,
    COMPANY: {
      name: 'TechWave',
      tagline: 'Home Appliances Redefined',
      website: 'www.techwave.com',
      email: 'support@techwave.com',
      phone: '+1 (123) 456-7890',
      address: '123 Tech Street, Innovation City, IC 12345'
    }
  };

  var State = {
    allProducts: [],
    filteredProducts: [],
    displayedProducts: [],
    currentPage: 1,
    totalPages: 1,
    filters: {
      category: 'all',
      brand: 'all',
      priceMin: 0,
      priceMax: 5000,
      rating: 'all',
      inStockOnly: false,
      onSaleOnly: false,
      search: ''
    },
    sort: 'default',
    gridCols: 3,
    compareList: [],
    recentlyViewed: [],
    initialized: false,
    isLoading: false
  };

  window.ProductPageState = State;

  document.addEventListener('DOMContentLoaded', function() {
    if (State.initialized) return;
    State.initialized = true;

    loadProducts();
    initAllFilters();
    initSearch();
    initGridToggle();
    initQuickTabs();
    initCategoryCards();
    initPriceFilter();
    initCompare();
    loadRecentlyViewed();
    handleURLParams();
    
    if (!document.querySelector('.brand-showcase-card')) {
      renderBrandShowcase();
    }
    
    initSmoothScrolling();
    
    window.applyExternalBrandFilter = function(brand) {
      if (brand && brand !== 'all') State.filters.brand = brand;
      State.currentPage = 1;
      applyFilters();
    };
    
    applyFilters();
    updateAllCounts();
  });

  function initSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function loadProducts() {
    var sources = [
      window.TECHWAVE_PRODUCTS,
      window.ALL_PRODUCTS,
      window.products,
      window.allProducts
    ];

    State.allProducts = [];
    var seenIds = {};

    sources.forEach(function(src) {
      if (src && Array.isArray(src)) {
        src.forEach(function(p) {
          if (p && p.id && !seenIds[p.id]) {
            seenIds[p.id] = true;
            State.allProducts.push({
              id: parseInt(p.id),
              name: p.name || 'Product',
              category: p.category || 'Uncategorized',
              subcategory: p.subcategory || '',
              brand: p.brand || 'TechWave',
              price: parseFloat(p.price) || 0,
              originalPrice: parseFloat(p.originalPrice) || null,
              image: p.image || '',
              rating: parseFloat(p.rating) || 0,
              reviews: parseInt(p.reviews) || 0,
              badge: p.badge || '',
              badgeType: p.badgeType || p.badgeClass || '',
              description: p.description || '',
              features: p.features || [],
              inStock: p.inStock !== false,
              detailedSpecs: p.detailedSpecs || {}
            });
          }
        });
      }
    });

    State.allProducts.sort(function(a, b) {
      return b.rating - a.rating || b.reviews - a.reviews;
    });

    State.filteredProducts = State.allProducts.slice();

    if (State.allProducts.length > 0) {
      var maxPrice = Math.max.apply(null, State.allProducts.map(function(p) { return p.price; }));
      State.filters.priceMax = Math.ceil(maxPrice / 100) * 100 + 100;
    }
  }

  function renderProducts() {
    var container = document.getElementById('productsGrid');
    var noResults = document.getElementById('noProductsFound');
    
    if (!container) return;

    container.querySelectorAll('.skeleton-card').forEach(function(s) {
      if (s.parentElement) s.parentElement.remove();
    });

    if (State.filteredProducts.length === 0) {
      container.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      updateResultsCount(0, State.allProducts.length);
      hideLoadMore();
      hidePagination();
      return;
    }

    if (noResults) noResults.style.display = 'none';

    State.totalPages = Math.ceil(State.filteredProducts.length / CONFIG.PRODUCTS_PER_PAGE);
    
    var startIndex = (State.currentPage - 1) * CONFIG.PRODUCTS_PER_PAGE;
    var endIndex = startIndex + CONFIG.PRODUCTS_PER_PAGE;
    State.displayedProducts = State.filteredProducts.slice(startIndex, endIndex);

    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(function() {
      var html = '';
      var colClass = getColumnClass();

      State.displayedProducts.forEach(function(product, index) {
        html += buildProductCard(product, index, colClass);
      });

      container.innerHTML = html;

      requestAnimationFrame(function() {
        container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        
        var cards = container.querySelectorAll('.product-col');
        cards.forEach(function(card, index) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(function() {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * CONFIG.ANIMATION_DELAY);
        });
      });

      updateResultsCount(State.filteredProducts.length, State.allProducts.length);
      renderPagination();
      updateLoadMoreSection();
      
    }, 150);
  }

  function renderPagination() {
    var existingPagination = document.getElementById('productsPagination');
    if (existingPagination) existingPagination.remove();

    if (State.totalPages <= 1) return;

    var loadMoreSection = document.getElementById('loadMoreSection');
    var insertBefore = loadMoreSection || document.querySelector('.products-grid-wrapper');
    
    if (!insertBefore || !insertBefore.parentNode) return;

    var paginationHTML = '<div id="productsPagination" class="pagination-container">';
    paginationHTML += '<div class="pagination-wrapper">';
    
    paginationHTML += '<button class="pagination-btn pagination-prev' + (State.currentPage === 1 ? ' disabled' : '') + '" ' +
      'onclick="goToPage(' + (State.currentPage - 1) + ')"' + (State.currentPage === 1 ? ' disabled' : '') + '>';
    paginationHTML += '<i class="fas fa-chevron-left"></i><span>Previous</span></button>';

    paginationHTML += '<div class="pagination-numbers">';
    
    var startPage = Math.max(1, State.currentPage - 2);
    var endPage = Math.min(State.totalPages, State.currentPage + 2);

    if (startPage > 1) {
      paginationHTML += '<button class="pagination-num" onclick="goToPage(1)">1</button>';
      if (startPage > 2) paginationHTML += '<span class="pagination-ellipsis">...</span>';
    }

    for (var i = startPage; i <= endPage; i++) {
      paginationHTML += '<button class="pagination-num' + (i === State.currentPage ? ' active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
    }

    if (endPage < State.totalPages) {
      if (endPage < State.totalPages - 1) paginationHTML += '<span class="pagination-ellipsis">...</span>';
      paginationHTML += '<button class="pagination-num" onclick="goToPage(' + State.totalPages + ')">' + State.totalPages + '</button>';
    }

    paginationHTML += '</div>';

    paginationHTML += '<button class="pagination-btn pagination-next' + (State.currentPage === State.totalPages ? ' disabled' : '') + '" ' +
      'onclick="goToPage(' + (State.currentPage + 1) + ')"' + (State.currentPage === State.totalPages ? ' disabled' : '') + '>';
    paginationHTML += '<span>Next</span><i class="fas fa-chevron-right"></i></button>';

    paginationHTML += '</div>';
    
    paginationHTML += '<div class="pagination-info">';
    paginationHTML += '<span>Page <strong>' + State.currentPage + '</strong> of <strong>' + State.totalPages + '</strong></span>';
    paginationHTML += '<span class="pagination-divider">|</span>';
    paginationHTML += '<span><strong>' + State.filteredProducts.length + '</strong> products total</span>';
    paginationHTML += '</div>';
    
    paginationHTML += '</div>';

    if (loadMoreSection) {
      loadMoreSection.insertAdjacentHTML('beforebegin', paginationHTML);
    } else {
      insertBefore.insertAdjacentHTML('afterend', paginationHTML);
    }
  }

  window.goToPage = function(page) {
    if (page < 1 || page > State.totalPages || page === State.currentPage) return;
    State.currentPage = page;
    scrollToProducts(true);
    setTimeout(function() {
      renderProducts();
    }, 300);
  };

  function hidePagination() {
    var pagination = document.getElementById('productsPagination');
    if (pagination) pagination.style.display = 'none';
  }

  function updateLoadMoreSection() {
    var loadMoreSection = document.getElementById('loadMoreSection');
    var loadedCount = document.getElementById('loadedCount');
    var loadedTotal = document.getElementById('loadedTotal');
    var loadMoreFill = document.getElementById('loadMoreFill');

    if (!loadMoreSection) return;

    var currentlyShowing = Math.min(State.currentPage * CONFIG.PRODUCTS_PER_PAGE, State.filteredProducts.length);
    var total = State.filteredProducts.length;
    var percentage = (currentlyShowing / total) * 100;

    if (loadedCount) loadedCount.textContent = currentlyShowing;
    if (loadedTotal) loadedTotal.textContent = total;
    if (loadMoreFill) loadMoreFill.style.width = percentage + '%';

    loadMoreSection.style.display = State.currentPage >= State.totalPages ? 'none' : 'block';
  }

  window.loadMoreProducts = function() {
    if (State.currentPage < State.totalPages) {
      goToPage(State.currentPage + 1);
    }
  };

  function hideLoadMore() {
    var loadMoreSection = document.getElementById('loadMoreSection');
    if (loadMoreSection) loadMoreSection.style.display = 'none';
  }

  function buildProductCard(p, index, colClass) {
    var discount = (p.originalPrice && p.originalPrice > p.price) 
      ? Math.round((1 - p.price / p.originalPrice) * 100) 
      : 0;
    
    var isOnSale = discount > 0;
    var inWishlist = isInWishlist(p.id);
    var inCart = isInCart(p.id);
    var inCompare = State.compareList.indexOf(p.id) !== -1;

    var badgeHtml = '';
    if (p.badge) {
      var badgeClass = 'product-badge';
      var bt = (p.badgeType || '').toLowerCase();
      if (bt.indexOf('hot') !== -1 || bt.indexOf('bestseller') !== -1) badgeClass += ' badge-hot';
      else if (bt.indexOf('sale') !== -1) badgeClass += ' badge-sale';
      else if (bt.indexOf('new') !== -1) badgeClass += ' badge-new';
      else if (bt.indexOf('premium') !== -1) badgeClass += ' badge-premium';
      else badgeClass += ' badge-default';
      badgeHtml = '<span class="' + badgeClass + '">' + esc(p.badge) + '</span>';
    }

    var starsHtml = generateStars(p.rating);

    var featuresHtml = '';
    if (p.features && p.features.length > 0) {
      featuresHtml = '<div class="product-features-preview">';
      var max = Math.min(3, p.features.length);
      for (var i = 0; i < max; i++) {
        featuresHtml += '<span class="feat-tag"><i class="fas fa-check"></i>' + esc(p.features[i]) + '</span>';
      }
      if (p.features.length > 3) {
        featuresHtml += '<span class="feat-tag feat-more">+' + (p.features.length - 3) + '</span>';
      }
      featuresHtml += '</div>';
    }

    var stockHtml = p.inStock 
      ? '<span class="stock-status in-stock"><i class="fas fa-check-circle me-1"></i>In Stock</span>'
      : '<span class="stock-status out-stock"><i class="fas fa-times-circle me-1"></i>Out of Stock</span>';

    var s = '';
    s += '<div class="' + colClass + ' product-col product-item" data-product-id="' + p.id + '" data-id="' + p.id + '" data-brand="' + escAttr(p.brand) + '" style="opacity:0;transform:translateY(20px);">';
    s += '<div class="product-card" data-category="' + escAttr(p.category) + '" data-brand="' + escAttr(p.brand) + '">';
    
    s += '<div class="product-image-wrap">';
    s += badgeHtml;
    s += '<img src="' + p.image + '" alt="' + escAttr(p.name) + '" class="product-image" loading="lazy" onerror="this.src=\'https://via.placeholder.com/300x220/1a1a2e/8a2be2?text=' + encodeURIComponent(p.name.charAt(0)) + '\'">';
    
    s += '<button class="wishlist-heart-btn' + (inWishlist ? ' active' : '') + '" onclick="event.stopPropagation();toggleProductWishlist(' + p.id + ',this)" title="Wishlist">';
    s += '<i class="' + (inWishlist ? 'fas' : 'far') + ' fa-heart"></i></button>';
    
    s += '<div class="product-actions">';
    s += '<button class="product-action-btn" onclick="event.stopPropagation();openProductDetail(' + p.id + ')" title="Quick View"><i class="fas fa-eye"></i></button>';
    s += '<button class="product-action-btn" onclick="event.stopPropagation();quickAddToCart(' + p.id + ')" title="Add to Cart"><i class="fas fa-cart-plus"></i></button>';
    s += '<button class="product-action-btn download-btn" onclick="event.stopPropagation();downloadProductWord(' + p.id + ',this)" title="Download Info (Word)"><i class="fas fa-file-word"></i></button>';
    s += '</div>';
    
    s += '<label class="compare-check" onclick="event.stopPropagation()">';
    s += '<input type="checkbox" ' + (inCompare ? 'checked' : '') + ' onchange="toggleCompare(' + p.id + ',this)">';
    s += '<span class="compare-check-mark"><i class="fas fa-balance-scale"></i></span>';
    s += '</label>';
    
    s += '<div class="quick-add-bar">';
    s += '<button class="quick-add-btn" onclick="event.stopPropagation();quickAddToCart(' + p.id + ')"><i class="fas fa-cart-plus me-2"></i>Quick Add</button>';
    s += '</div>';
    
    s += '</div>';

    s += '<div class="product-info" onclick="openProductDetail(' + p.id + ')">';
    
    s += '<div class="product-info-top">';
    s += '<span class="product-category-tag">' + esc(p.category) + '</span>';
    s += stockHtml;
    s += '</div>';
    
    s += '<div class="product-brand-row"><span class="brand-tag">' + esc(p.brand) + '</span></div>';
    s += '<h5 class="product-name">' + esc(p.name) + '</h5>';
    s += '<div class="product-rating">' + starsHtml + '<span class="rating-text">(' + p.reviews.toLocaleString() + ')</span></div>';
    
    s += '<div class="product-price-row">';
    s += '<span class="product-price">$' + p.price.toFixed(2) + '</span>';
    if (isOnSale) {
      s += '<span class="product-original-price">$' + p.originalPrice.toFixed(2) + '</span>';
      s += '<span class="product-discount">-' + discount + '%</span>';
    }
    s += '</div>';
    
    if (isOnSale) {
      s += '<div class="product-savings"><i class="fas fa-tag me-1"></i>Save $' + (p.originalPrice - p.price).toFixed(2) + '</div>';
    }
    
    s += featuresHtml;
    s += '</div>';

    s += '<div class="product-actions-row" style="padding:0 1rem 1rem;">';
    s += '<button class="btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' w-100 add-to-cart-btn" id="cartBtn' + p.id + '" onclick="event.stopPropagation();quickAddToCart(' + p.id + ')"' + (!p.inStock ? ' disabled' : '') + '>';
    s += '<i class="fas ' + (inCart ? 'fa-check' : 'fa-cart-plus') + ' me-2"></i>' + (inCart ? 'In Cart' : 'Add to Cart');
    s += '</button>';
    s += '</div>';

    s += '</div>';
    s += '</div>';

    return s;
  }

  function getColumnClass() {
    switch (State.gridCols) {
      case 2: return 'col-lg-6 col-md-6';
      case 4: return 'col-xl-3 col-lg-4 col-md-6';
      case 'list': return 'col-12';
      default: return 'col-xl-4 col-lg-4 col-md-6';
    }
  }

  function applyFilters() {
    var f = State.filters;

    State.filteredProducts = State.allProducts.filter(function(p) {
      if (f.category !== 'all' && p.category !== f.category) return false;
      if (f.brand !== 'all' && p.brand !== f.brand) return false;
      if (p.price < f.priceMin || p.price > f.priceMax) return false;
      if (f.rating !== 'all' && p.rating < parseFloat(f.rating)) return false;
      if (f.inStockOnly && !p.inStock) return false;
      if (f.onSaleOnly && !(p.originalPrice && p.originalPrice > p.price)) return false;
      if (f.search) {
        var q = f.search.toLowerCase();
        var text = (p.name + ' ' + p.category + ' ' + p.brand + ' ' + p.description + ' ' + (p.features || []).join(' ')).toLowerCase();
        if (text.indexOf(q) === -1) return false;
      }
      return true;
    });

    applySorting();
    State.currentPage = 1;
    renderProducts();
    updateActiveFilterTags();
  }

  function applySorting() {
    var sort = State.sort;

    State.filteredProducts.sort(function(a, b) {
      switch (sort) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name-az': return a.name.localeCompare(b.name);
        case 'name-za': return b.name.localeCompare(a.name);
        case 'rating': return b.rating - a.rating || b.reviews - a.reviews;
        case 'reviews': return b.reviews - a.reviews;
        case 'discount':
          var dA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          var dB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return dB - dA;
        case 'newest': return b.id - a.id;
        default:
          if (a.badge && !b.badge) return -1;
          if (!a.badge && b.badge) return 1;
          return b.rating - a.rating || b.reviews - a.reviews;
      }
    });
  }

  function initAllFilters() {
    document.querySelectorAll('input[name="categoryFilter"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        State.filters.category = this.value;
        State.currentPage = 1;
        applyFilters();
        updateAllCounts();
      });
    });

    document.querySelectorAll('input[name="brandFilter"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        State.filters.brand = this.value;
        State.currentPage = 1;
        applyFilters();
      });
    });

    document.querySelectorAll('input[name="ratingFilter"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        State.filters.rating = this.value;
        State.currentPage = 1;
        applyFilters();
      });
    });

    var inStockCb = document.getElementById('inStockOnly');
    if (inStockCb) {
      inStockCb.addEventListener('change', function() {
        State.filters.inStockOnly = this.checked;
        State.currentPage = 1;
        applyFilters();
      });
    }

    var onSaleCb = document.getElementById('onSaleOnly');
    if (onSaleCb) {
      onSaleCb.addEventListener('change', function() {
        State.filters.onSaleOnly = this.checked;
        State.currentPage = 1;
        applyFilters();
      });
    }

    var sortSelect = document.getElementById('sortFilter');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        State.sort = this.value;
        State.currentPage = 1;
        applyFilters();
      });
    }

    document.querySelectorAll('.filter-group-title').forEach(function(title) {
      title.addEventListener('click', function() {
        var group = this.closest('.filter-group');
        if (group) {
          group.classList.toggle('open');
          var icon = this.querySelector('.filter-toggle-icon');
          if (icon) {
            icon.style.transform = group.classList.contains('open') ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        }
      });
    });

    var mobileToggle = document.getElementById('mobileFilterToggle');
    var sidebar = document.getElementById('filterSidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show-mobile');
        this.innerHTML = sidebar.classList.contains('show-mobile') 
          ? '<i class="fas fa-times me-2"></i>Hide Filters'
          : '<i class="fas fa-sliders-h me-2"></i>Show Filters';
      });
    }
  }

  function initPriceFilter() {
    var priceMin = document.getElementById('priceMin');
    var priceMax = document.getElementById('priceMax');
    var priceRange = document.getElementById('priceRange');
    var quickBtns = document.querySelectorAll('.price-quick-btn');

    var maxPrice = State.filters.priceMax;

    if (priceMax) priceMax.value = maxPrice;
    if (priceRange) {
      priceRange.max = maxPrice;
      priceRange.value = maxPrice;
    }

    if (priceMin) {
      priceMin.addEventListener('change', function() {
        State.filters.priceMin = parseInt(this.value) || 0;
        State.currentPage = 1;
        applyFilters();
      });
    }

    if (priceMax) {
      priceMax.addEventListener('change', function() {
        State.filters.priceMax = parseInt(this.value) || maxPrice;
        if (priceRange) priceRange.value = State.filters.priceMax;
        State.currentPage = 1;
        applyFilters();
      });
    }

    if (priceRange) {
      priceRange.addEventListener('input', function() {
        State.filters.priceMax = parseInt(this.value);
        if (priceMax) priceMax.value = this.value;
        State.currentPage = 1;
        applyFilters();
      });
    }

    quickBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var min = parseInt(this.getAttribute('data-min')) || 0;
        var max = parseInt(this.getAttribute('data-max')) || maxPrice;

        State.filters.priceMin = min;
        State.filters.priceMax = max;

        if (priceMin) priceMin.value = min;
        if (priceMax) priceMax.value = max;
        if (priceRange) priceRange.value = max;

        quickBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        State.currentPage = 1;
        applyFilters();
      });
    });
  }

  function initSearch() {
    var searchInput = document.getElementById('productSearchInline');
    var searchClear = document.getElementById('inlineSearchClear');
    var debounceTimer = null;

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var query = this.value.trim();

        if (searchClear) {
          searchClear.style.display = query.length > 0 ? 'flex' : 'none';
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          State.filters.search = query;
          State.currentPage = 1;
          applyFilters();
        }, CONFIG.DEBOUNCE_MS);
      });

      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Escape') {
          this.value = '';
          State.filters.search = '';
          State.currentPage = 1;
          if (searchClear) searchClear.style.display = 'none';
          applyFilters();
        }
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        State.filters.search = '';
        State.currentPage = 1;
        this.style.display = 'none';
        applyFilters();
      });
    }
  }

  function initGridToggle() {
    var gridBtns = document.querySelectorAll('.grid-btn');

    gridBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var cols = this.getAttribute('data-cols');
        
        gridBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        State.gridCols = cols === 'list' ? 'list' : parseInt(cols);

        var container = document.getElementById('productsGrid');
        if (container) {
          container.classList.toggle('list-view', cols === 'list');
        }

        renderProducts();
      });
    });
  }

  function initQuickTabs() {
    var quickTabs = document.querySelectorAll('.quick-tab');

    quickTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var category = this.getAttribute('data-category');

        quickTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        State.filters.category = category;
        State.currentPage = 1;

        var radio = document.querySelector('input[name="categoryFilter"][value="' + category + '"]');
        if (radio) radio.checked = true;

        applyFilters();
        updateAllCounts();
      });
    });
  }

  function initCategoryCards() {
    document.querySelectorAll('.cat-card[data-category]').forEach(function(card) {
      card.addEventListener('click', function() {
        var category = this.getAttribute('data-category');
        setFilter('category', category);
        scrollToProducts();
      });
    });
  }

  function renderBrandShowcase() {
    var container = document.getElementById('brandShowcaseGrid');
    if (!container) return;

    var brands = window.TECHWAVE_BRANDS || [];
    if (brands.length === 0) return;

    var html = '';
    brands.forEach(function(brand) {
      var count = countByBrand(brand.name);
      var avgRating = avgRatingByBrand(brand.name);
      var topProduct = getTopProductByBrand(brand.name);

      html += '<div class="brand-showcase-card" data-brand="' + escAttr(brand.name) + '">';
      html += '<div class="brand-showcase-bg" style="background:linear-gradient(135deg,' + brand.color[0] + ',' + brand.color[1] + ');"></div>';
      html += '<div class="brand-showcase-content">';
      html += '<div class="brand-showcase-logo" style="background:linear-gradient(135deg,' + brand.color[0] + ',' + brand.color[1] + ');">' + brand.logo + '</div>';
      html += '<div class="brand-showcase-info">';
      html += '<h4>' + esc(brand.name) + '</h4>';
      html += '<p class="brand-tagline">"' + esc(brand.tagline) + '"</p>';
      html += '<p class="brand-origin"><i class="fas fa-map-marker-alt me-1"></i>' + esc(brand.country) + '</p>';
      html += '</div>';
      html += '<div class="brand-showcase-stats">';
      html += '<div class="brand-stat"><span class="brand-stat-value">' + count + '</span><span class="brand-stat-label">Products</span></div>';
      html += '<div class="brand-stat"><span class="brand-stat-value">' + avgRating + '</span><span class="brand-stat-label">Avg Rating</span></div>';
      html += '</div>';
      if (topProduct) {
        html += '<div class="brand-top-product">';
        html += '<img src="' + topProduct.image + '" alt="" onerror="this.style.display=\'none\'">';
        html += '<span>Top: ' + esc(topProduct.name.substring(0, 20)) + (topProduct.name.length > 20 ? '...' : '') + '</span>';
        html += '</div>';
      }
      html += '</div>';
      html += '<div class="brand-showcase-arrow"><i class="fas fa-arrow-right"></i></div>';
      html += '</div>';
    });

    container.innerHTML = html;

    container.querySelectorAll('.brand-showcase-card').forEach(function(card) {
      card.addEventListener('click', function() {
        setFilter('brand', this.getAttribute('data-brand'));
        scrollToProducts();
      });
    });
  }

  function handleURLParams() {
    var params = new URLSearchParams(window.location.search);

    var category = params.get('category');
    var brand = params.get('brand');
    var search = params.get('search');
    var page = params.get('page');

    if (category) {
      State.filters.category = category;
      var radio = document.querySelector('input[name="categoryFilter"][value="' + category + '"]');
      if (radio) radio.checked = true;
      var quickTab = document.querySelector('.quick-tab[data-category="' + category + '"]');
      if (quickTab) {
        document.querySelectorAll('.quick-tab').forEach(function(t) { t.classList.remove('active'); });
        quickTab.classList.add('active');
      }
      updatePageTitle(category);
    }

    if (brand) {
      State.filters.brand = brand;
      var brandRadio = document.querySelector('input[name="brandFilter"][value="' + brand + '"]');
      if (brandRadio) brandRadio.checked = true;
    }

    if (search) {
      State.filters.search = search;
      var searchInput = document.getElementById('productSearchInline');
      if (searchInput) searchInput.value = search;
    }

    if (page) {
      var pageNum = parseInt(page);
      if (!isNaN(pageNum) && pageNum >= 1) {
        State.currentPage = pageNum;
      }
    }
  }

  function updatePageTitle(category) {
    var titleEl = document.getElementById('pageTitle');
    var subtitleEl = document.getElementById('pageSubtitle');
    var breadcrumbEl = document.getElementById('breadcrumbCategory');

    if (titleEl && category !== 'all') titleEl.textContent = category;
    if (subtitleEl && category !== 'all') subtitleEl.textContent = 'Browse our collection of ' + category.toLowerCase();
    if (breadcrumbEl) breadcrumbEl.textContent = category === 'all' ? 'All Products' : category;
  }

  function initCompare() {
    try {
      State.compareList = JSON.parse(localStorage.getItem('tw_compare')) || [];
    } catch (e) {
      State.compareList = [];
    }
    updateCompareUI();
  }

  window.toggleCompare = function(id, checkbox) {
    id = parseInt(id);
    var index = State.compareList.indexOf(id);

    if (index !== -1) {
      State.compareList.splice(index, 1);
      if (checkbox) checkbox.checked = false;
    } else {
      if (State.compareList.length >= 4) {
        showToastSafe('Maximum 4 products can be compared', 'warning');
        if (checkbox) checkbox.checked = false;
        return;
      }
      State.compareList.push(id);
      if (checkbox) checkbox.checked = true;
    }

    localStorage.setItem('tw_compare', JSON.stringify(State.compareList));
    updateCompareUI();
  };

  function updateCompareUI() {
    var floatBar = document.getElementById('compareFloatBar');
    var toolbarBtn = document.getElementById('compareToolbarBtn');
    var countEl = document.getElementById('compareCount');
    var countToolbar = document.getElementById('compareCountToolbar');
    var productsContainer = document.getElementById('compareFloatProducts');

    var count = State.compareList.length;

    if (floatBar) floatBar.style.display = count > 0 ? 'block' : 'none';
    if (toolbarBtn) toolbarBtn.style.display = count > 0 ? 'inline-flex' : 'none';
    if (countEl) countEl.textContent = count;
    if (countToolbar) countToolbar.textContent = count;

    if (productsContainer && count > 0) {
      var html = '';
      State.compareList.forEach(function(id) {
        var p = findProduct(id);
        if (p) {
          html += '<div class="compare-float-item">';
          html += '<img src="' + p.image + '" alt="' + escAttr(p.name) + '">';
          html += '<button class="compare-float-remove" onclick="toggleCompare(' + id + ')"><i class="fas fa-times"></i></button>';
          html += '</div>';
        }
      });
      productsContainer.innerHTML = html;
    }
  }

  window.clearCompare = function() {
    State.compareList = [];
    localStorage.removeItem('tw_compare');
    updateCompareUI();
    document.querySelectorAll('.compare-check input').forEach(function(cb) { cb.checked = false; });
    showToastSafe('Compare list cleared', 'info');
  };

  window.openCompareModal = function() {
    if (State.compareList.length < 2) {
      showToastSafe('Please select at least 2 products to compare', 'warning');
      return;
    }

    var modal = document.getElementById('compareModal');
    var body = document.getElementById('compareModalBody');
    if (!modal || !body) return;

    var products = State.compareList.map(function(id) { return findProduct(id); }).filter(Boolean);

    var html = '<div class="compare-table-wrapper"><table class="compare-table">';

    html += '<tr><th>Product</th>';
    products.forEach(function(p) {
      html += '<td class="compare-product-cell">';
      html += '<img src="' + p.image + '" alt="' + escAttr(p.name) + '" class="compare-img">';
      html += '<h6>' + esc(p.name) + '</h6>';
      html += '<button class="btn btn-sm btn-primary mt-2" onclick="quickAddToCart(' + p.id + ')"><i class="fas fa-cart-plus me-1"></i>Add</button>';
      html += '</td>';
    });
    html += '</tr>';

    var rows = [
      { label: 'Price', fn: function(p) { 
        var h = '<strong style="color:#8a2be2;">$' + p.price.toFixed(2) + '</strong>';
        if (p.originalPrice && p.originalPrice > p.price) {
          h += ' <span style="text-decoration:line-through;color:rgba(255,255,255,0.4);">$' + p.originalPrice.toFixed(2) + '</span>';
        }
        return h;
      }},
      { label: 'Brand', fn: function(p) { return esc(p.brand); }},
      { label: 'Category', fn: function(p) { return esc(p.category); }},
      { label: 'Rating', fn: function(p) { return generateStars(p.rating) + ' <span style="color:rgba(255,255,255,0.5);">(' + p.reviews + ')</span>'; }},
      { label: 'Features', fn: function(p) {
        if (!p.features || p.features.length === 0) return '—';
        return '<ul style="list-style:none;padding:0;margin:0;font-size:0.85rem;">' + 
          p.features.slice(0, 5).map(function(f) { return '<li><i class="fas fa-check" style="color:#22c55e;margin-right:5px;"></i>' + esc(f) + '</li>'; }).join('') + '</ul>';
      }}
    ];

    rows.forEach(function(row) {
      html += '<tr><th>' + row.label + '</th>';
      products.forEach(function(p) { html += '<td>' + row.fn(p) + '</td>'; });
      html += '</tr>';
    });

    var specKeys = [];
    products.forEach(function(p) {
      if (p.detailedSpecs) {
        Object.keys(p.detailedSpecs).forEach(function(key) {
          if (specKeys.indexOf(key) === -1) specKeys.push(key);
        });
      }
    });

    specKeys.slice(0, 8).forEach(function(key) {
      html += '<tr><th>' + esc(key) + '</th>';
      products.forEach(function(p) {
        var val = (p.detailedSpecs && p.detailedSpecs[key]) || '—';
        html += '<td>' + esc(val) + '</td>';
      });
      html += '</tr>';
    });

    html += '</table></div>';
    
    html += '<div class="compare-download-section" style="text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">';
    html += '<button class="btn btn-info btn-lg" onclick="downloadComparisonWord()" style="background:linear-gradient(135deg,#2b579a,#1e3a6e);border:none;">';
    html += '<i class="fas fa-file-word me-2"></i>Download Comparison (Word)';
    html += '</button>';
    html += '</div>';
    
    body.innerHTML = html;

    new bootstrap.Modal(modal).show();
  };

  function loadRecentlyViewed() {
    try {
      State.recentlyViewed = JSON.parse(localStorage.getItem('tw_recently_viewed')) || [];
    } catch (e) {
      State.recentlyViewed = [];
    }
    renderRecentlyViewed();
  }

  function addToRecentlyViewed(id) {
    id = parseInt(id);
    State.recentlyViewed = State.recentlyViewed.filter(function(i) { return i !== id; });
    State.recentlyViewed.unshift(id);
    State.recentlyViewed = State.recentlyViewed.slice(0, 10);
    localStorage.setItem('tw_recently_viewed', JSON.stringify(State.recentlyViewed));
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    var section = document.getElementById('recentlyViewedSection');
    var grid = document.getElementById('recentlyViewedGrid');

    if (!section || !grid || State.recentlyViewed.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    var html = '';
    State.recentlyViewed.forEach(function(id) {
      var p = findProduct(id);
      if (!p) return;
      html += '<div class="recently-viewed-item" onclick="openProductDetail(' + p.id + ')">';
      html += '<div class="rv-img"><img src="' + p.image + '" alt="' + escAttr(p.name) + '"></div>';
      html += '<div class="rv-info">';
      html += '<h6>' + esc(p.name.substring(0, 25)) + (p.name.length > 25 ? '...' : '') + '</h6>';
      html += '<span class="rv-price">$' + p.price.toFixed(2) + '</span>';
      html += '</div></div>';
    });

    grid.innerHTML = html;
  }

  window.clearRecentlyViewed = function() {
    State.recentlyViewed = [];
    localStorage.removeItem('tw_recently_viewed');
    renderRecentlyViewed();
    showToastSafe('Recently viewed cleared', 'info');
  };

  function updateActiveFilterTags() {
    var container = document.getElementById('activeFilterTags');
    var bar = document.getElementById('activeFiltersBar');

    if (!container || !bar) return;

    var f = State.filters;
    var tags = [];

    if (f.category !== 'all') tags.push({ type: 'category', label: f.category });
    if (f.brand !== 'all') tags.push({ type: 'brand', label: f.brand });
    if (f.rating !== 'all') tags.push({ type: 'rating', label: f.rating + '+ Stars' });
    if (f.inStockOnly) tags.push({ type: 'inStockOnly', label: 'In Stock' });
    if (f.onSaleOnly) tags.push({ type: 'onSaleOnly', label: 'On Sale' });
    if (f.search) tags.push({ type: 'search', label: '"' + f.search + '"' });

    if (tags.length === 0) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'block';

    var html = '';
    tags.forEach(function(tag) {
      html += '<span class="active-filter-tag">' + esc(tag.label);
      html += '<button class="tag-remove" onclick="removeFilterTag(\'' + tag.type + '\')"><i class="fas fa-times"></i></button>';
      html += '</span>';
    });

    container.innerHTML = html;
  }

  window.removeFilterTag = function(type) {
    switch (type) {
      case 'category':
        State.filters.category = 'all';
        setRadio('categoryFilter', 'all');
        document.querySelectorAll('.quick-tab').forEach(function(t) { t.classList.remove('active'); });
        var allTab = document.querySelector('.quick-tab[data-category="all"]');
        if (allTab) allTab.classList.add('active');
        break;
      case 'brand':
        State.filters.brand = 'all';
        setRadio('brandFilter', 'all');
        document.querySelectorAll('.brand-pill').forEach(function(p) { p.classList.remove('active'); });
        var allBrand = document.querySelector('.brand-pill[data-brand="all"]');
        if (allBrand) allBrand.classList.add('active');
        break;
      case 'rating':
        State.filters.rating = 'all';
        setRadio('ratingFilter', 'all');
        break;
      case 'inStockOnly':
        State.filters.inStockOnly = false;
        var stockCb = document.getElementById('inStockOnly');
        if (stockCb) stockCb.checked = false;
        break;
      case 'onSaleOnly':
        State.filters.onSaleOnly = false;
        var saleCb = document.getElementById('onSaleOnly');
        if (saleCb) saleCb.checked = false;
        break;
      case 'search':
        State.filters.search = '';
        var searchInput = document.getElementById('productSearchInline');
        if (searchInput) searchInput.value = '';
        var searchClear = document.getElementById('inlineSearchClear');
        if (searchClear) searchClear.style.display = 'none';
        break;
    }
    State.currentPage = 1;
    applyFilters();
    updateAllCounts();
  };

  window.clearAllFilters = function() {
    State.filters = {
      category: 'all',
      brand: 'all',
      priceMin: 0,
      priceMax: 5000,
      rating: 'all',
      inStockOnly: false,
      onSaleOnly: false,
      search: ''
    };
    State.sort = 'default';
    State.currentPage = 1;

    setRadio('categoryFilter', 'all');
    setRadio('brandFilter', 'all');
    setRadio('ratingFilter', 'all');

    var inStockCb = document.getElementById('inStockOnly');
    var onSaleCb = document.getElementById('onSaleOnly');
    if (inStockCb) inStockCb.checked = false;
    if (onSaleCb) onSaleCb.checked = false;

    var sortSelect = document.getElementById('sortFilter');
    if (sortSelect) sortSelect.value = 'default';

    var searchInput = document.getElementById('productSearchInline');
    if (searchInput) searchInput.value = '';
    var searchClear = document.getElementById('inlineSearchClear');
    if (searchClear) searchClear.style.display = 'none';

    var priceMin = document.getElementById('priceMin');
    var priceMax = document.getElementById('priceMax');
    var priceRange = document.getElementById('priceRange');
    if (priceMin) priceMin.value = 0;
    if (priceMax) priceMax.value = 5000;
    if (priceRange) priceRange.value = 5000;

    document.querySelectorAll('.quick-tab').forEach(function(t) { t.classList.remove('active'); });
    var allTab = document.querySelector('.quick-tab[data-category="all"]');
    if (allTab) allTab.classList.add('active');

    document.querySelectorAll('.brand-pill').forEach(function(p) { p.classList.remove('active'); });
    var allBrand = document.querySelector('.brand-pill[data-brand="all"]');
    if (allBrand) allBrand.classList.add('active');

    document.querySelectorAll('.price-quick-btn').forEach(function(b) { b.classList.remove('active'); });

    window.history.replaceState({}, '', window.location.pathname);

    applyFilters();
    updateAllCounts();
    showToastSafe('All filters cleared', 'info');
  };

  window.toggleFilterGroup = function(element) {
    var group = element.closest('.filter-group');
    if (group) {
      group.classList.toggle('open');
      var icon = element.querySelector('.filter-toggle-icon');
      if (icon) {
        icon.style.transform = group.classList.contains('open') ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    }
  };

  function updateAllCounts() {
    var total = State.allProducts.length;

    setCount('totalProductCount', total);
    setCount('countAll', total);
    setCount('countKitchen', countByCategory('Kitchen Appliances'));
    setCount('countHome', countByCategory('Home Appliances'));
    setCount('countPersonal', countByCategory('Personal Care'));
    setCount('countEntertainment', countByCategory('Entertainment'));

    setCount('categoryCountKitchen', countByCategory('Kitchen Appliances') + ' Products');
    setCount('categoryCountHome', countByCategory('Home Appliances') + ' Products');
    setCount('categoryCountPersonal', countByCategory('Personal Care') + ' Products');
    setCount('categoryCountEntertainment', countByCategory('Entertainment') + ' Products');

    setCount('countBrandAll', total);
    setCount('countBrandHaier', countByBrand('Haier'));
    setCount('countBrandSamsung', countByBrand('Samsung'));
    setCount('countBrandLG', countByBrand('LG'));
    setCount('countBrandDawlance', countByBrand('Dawlance'));
    setCount('countBrandPhilips', countByBrand('Philips'));
  }

  function setCount(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateResultsCount(visible, total) {
    setCount('visibleCount', visible);
    setCount('totalCount', total);
  }

  function setFilter(type, value) {
    State.filters[type] = value;
    State.currentPage = 1;
    setRadio(type + 'Filter', value);
    applyFilters();
    updateAllCounts();
  }

  function setRadio(name, value) {
    var radio = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (radio) radio.checked = true;
  }

  function scrollToProducts(smooth) {
    var section = document.querySelector('.products-page-section');
    if (section) {
      var top = section.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ 
        top: top, 
        behavior: smooth !== false ? 'smooth' : 'auto' 
      });
    }
  }

  function countByCategory(category) {
    return State.allProducts.filter(function(p) { return p.category === category; }).length;
  }

  function countByBrand(brand) {
    return State.allProducts.filter(function(p) { return p.brand === brand; }).length;
  }

  function avgRatingByBrand(brand) {
    var products = State.allProducts.filter(function(p) { return p.brand === brand; });
    if (products.length === 0) return '0.0';
    var total = products.reduce(function(sum, p) { return sum + p.rating; }, 0);
    return (total / products.length).toFixed(1);
  }

  function getTopProductByBrand(brand) {
    var products = State.allProducts.filter(function(p) { return p.brand === brand; });
    if (products.length === 0) return null;
    return products.sort(function(a, b) { return b.rating - a.rating; })[0];
  }

  function findProduct(id) {
    id = parseInt(id);
    var p = State.allProducts.find(function(p) { return p.id === id; });
    if (p) return p;
    if (typeof window.findProductById === 'function') return window.findProductById(id);
    return null;
  }

  function isInWishlist(id) {
    if (typeof AppState !== 'undefined' && AppState.wishlist) {
      return AppState.wishlist.indexOf(parseInt(id)) !== -1;
    }
    try {
      var wishlist = JSON.parse(localStorage.getItem('tw_wishlist')) || [];
      return wishlist.indexOf(parseInt(id)) !== -1;
    } catch (e) { return false; }
  }

  function isInCart(id) {
    if (typeof AppState !== 'undefined' && AppState.cart) {
      return AppState.cart.some(function(c) { return parseInt(c.id) === parseInt(id); });
    }
    try {
      var cart = JSON.parse(localStorage.getItem('tw_cart')) || [];
      return cart.some(function(c) { return parseInt(c.id) === parseInt(id); });
    } catch (e) { return false; }
  }

  function generateStars(rating) {
    rating = parseFloat(rating) || 0;
    var html = '';
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.5;

    for (var i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) { html += '<i class="fas fa-star-half-alt"></i>'; full++; }
    for (var j = full; j < 5; j++) html += '<i class="far fa-star"></i>';
    html += '<span class="rating-num">' + rating.toFixed(1) + '</span>';
    return html;
  }

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function showToastSafe(message, type) {
    if (typeof showToast === 'function') {
      showToast(message, type);
    } else {
      console.log('[Toast]', type, message);
    }
  }

  window.quickAddToCart = function(id) {
    var product = findProduct(id);
    if (!product) {
      showToastSafe('Product not found!', 'error');
      return;
    }

    if (!product.inStock) {
      showToastSafe('This product is out of stock', 'warning');
      return;
    }

    if (typeof addToCart === 'function') {
      addToCart(id, 1);
    } else {
      var cart = [];
      try { cart = JSON.parse(localStorage.getItem('tw_cart')) || []; } catch (e) {}
      
      var existing = cart.find(function(c) { return parseInt(c.id) === parseInt(id); });
      if (existing) {
        existing.qty++;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          brand: product.brand,
          qty: 1
        });
      }
      localStorage.setItem('tw_cart', JSON.stringify(cart));
      showToastSafe(product.name + ' added to cart!', 'success');

      if (typeof refreshUI === 'function') refreshUI();
    }

    var btn = document.getElementById('cartBtn' + id);
    if (btn) {
      btn.className = 'btn btn-success w-100 add-to-cart-btn';
      btn.innerHTML = '<i class="fas fa-check me-2"></i>In Cart';
    }

    if (typeof animateCartIcon === 'function') animateCartIcon();
  };

  window.toggleProductWishlist = function(id, btn) {
    var product = findProduct(id);
    var name = product ? product.name : 'Product';

    if (typeof toggleWishlist === 'function') {
      toggleWishlist(id);
    } else {
      var wishlist = [];
      try { wishlist = JSON.parse(localStorage.getItem('tw_wishlist')) || []; } catch (e) {}
      
      var index = wishlist.indexOf(parseInt(id));
      if (index !== -1) {
        wishlist.splice(index, 1);
        showToastSafe(name + ' removed from wishlist', 'info');
      } else {
        wishlist.push(parseInt(id));
        showToastSafe(name + ' added to wishlist!', 'success');
      }
      localStorage.setItem('tw_wishlist', JSON.stringify(wishlist));
    }

    if (btn) {
      var inWishlist = isInWishlist(id);
      btn.classList.toggle('active', inWishlist);
      var icon = btn.querySelector('i');
      if (icon) icon.className = inWishlist ? 'fas fa-heart' : 'far fa-heart';
      btn.classList.add('heart-pop');
      setTimeout(function() { btn.classList.remove('heart-pop'); }, 400);
    }
  };

  window.openProductDetail = function(id) {
    var product = findProduct(id);
    if (!product) {
      showToastSafe('Product not found!', 'error');
      return;
    }

    addToRecentlyViewed(id);

    if (typeof openProductModal === 'function') {
      openProductModal(id);
      return;
    }

    var modal = document.getElementById('productModal');
    var titleEl = document.getElementById('productModalTitle');
    var bodyEl = document.getElementById('productModalBody');

    if (!modal || !bodyEl) return;

    if (titleEl) titleEl.textContent = product.name;

    var discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    var inWishlist = isInWishlist(id);
    var inCart = isInCart(id);
    var starsHtml = generateStars(product.rating);

    var featuresHtml = '';
    if (product.features && product.features.length > 0) {
      featuresHtml = '<div class="detail-features mt-3"><h6><i class="fas fa-list-check me-2"></i>Key Features</h6><div class="detail-features-grid">';
      product.features.forEach(function(f) {
        featuresHtml += '<div class="detail-feature-item"><i class="fas fa-check-circle"></i><span>' + esc(f) + '</span></div>';
      });
      featuresHtml += '</div></div>';
    }

    var specsHtml = '';
    if (product.detailedSpecs && Object.keys(product.detailedSpecs).length > 0) {
      specsHtml = '<div class="mt-4"><h6><i class="fas fa-cog me-2"></i>Specifications</h6><table class="specs-table">';
      Object.keys(product.detailedSpecs).slice(0, 10).forEach(function(key) {
        specsHtml += '<tr><td>' + esc(key) + '</td><td>' + esc(product.detailedSpecs[key]) + '</td></tr>';
      });
      specsHtml += '</table></div>';
    }

    var html = '<div class="row g-4">';
    html += '<div class="col-md-5">';
    html += '<div class="detail-main-img">';
    if (product.badge) {
      html += '<span class="product-badge badge-' + (product.badgeType || 'hot') + '">' + esc(product.badge) + '</span>';
    }
    html += '<img src="' + product.image + '" alt="' + escAttr(product.name) + '" class="img-fluid rounded-3">';
    html += '</div></div>';
    
    html += '<div class="col-md-7">';
    html += '<div class="detail-top-row">';
    html += '<span class="brand-tag">' + esc(product.brand) + '</span>';
    html += '<span class="product-category-tag ms-2">' + esc(product.category) + '</span>';
    html += '</div>';
    html += '<h3 class="detail-name mt-2">' + esc(product.name) + '</h3>';
    html += '<div class="detail-rating">' + starsHtml + '<span class="detail-review-count ms-2">(' + product.reviews.toLocaleString() + ' reviews)</span></div>';
    
    html += '<div class="detail-price-section mt-3">';
    html += '<span class="detail-price">$' + product.price.toFixed(2) + '</span>';
    if (product.originalPrice && product.originalPrice > product.price) {
      html += '<span class="detail-original ms-2">$' + product.originalPrice.toFixed(2) + '</span>';
      html += '<span class="product-discount ms-2">-' + discount + '%</span>';
      html += '<div class="detail-savings mt-1"><i class="fas fa-tag me-1"></i>You save $' + (product.originalPrice - product.price).toFixed(2) + '</div>';
    }
    html += '</div>';
    
    html += '<p class="detail-desc mt-3">' + esc(product.description) + '</p>';
    html += featuresHtml;
    html += specsHtml;
    
    html += '<div class="detail-btns mt-4 d-flex gap-2 flex-wrap">';
    html += '<button class="btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' btn-lg flex-fill" onclick="quickAddToCart(' + product.id + ');openProductDetail(' + product.id + ')">';
    html += '<i class="fas ' + (inCart ? 'fa-check' : 'fa-cart-plus') + ' me-2"></i>' + (inCart ? 'In Cart' : 'Add to Cart');
    html += '</button>';
    html += '<button class="btn btn-outline-light btn-lg detail-wish-btn' + (inWishlist ? ' active' : '') + '" onclick="toggleProductWishlist(' + product.id + ',this)">';
    html += '<i class="' + (inWishlist ? 'fas' : 'far') + ' fa-heart"></i>';
    html += '</button>';
    html += '<button class="btn btn-info btn-lg" onclick="downloadProductWord(' + product.id + ',this)" title="Download Product Info" style="background:linear-gradient(135deg,#2b579a,#1e3a6e);border:none;">';
    html += '<i class="fas fa-file-word"></i>';
    html += '</button>';
    html += '</div>';
    
    html += '<div class="detail-trust mt-3">';
    html += '<span><i class="fas fa-truck me-1"></i>Free Shipping $100+</span>';
    html += '<span><i class="fas fa-undo me-1"></i>30-Day Returns</span>';
    html += '<span><i class="fas fa-shield-alt me-1"></i>' + (product.detailedSpecs && product.detailedSpecs.Warranty ? product.detailedSpecs.Warranty : 'Warranty') + '</span>';
    html += '</div>';
    
    html += '</div></div>';

    bodyEl.innerHTML = html;
    new bootstrap.Modal(modal).show();
  };

  window.filterByBrand = function(brand) {
    State.filters.brand = brand;
    State.currentPage = 1;
    setRadio('brandFilter', brand);
    applyFilters();
    scrollToProducts();
  };

  window.filterByCategory = function(category) {
    State.filters.category = category;
    State.currentPage = 1;
    setRadio('categoryFilter', category);
    applyFilters();
    scrollToProducts();
  };

  window.downloadProductWord = function(productId, btnElement) {
    var product = findProduct(productId);
    if (!product) {
      showToastSafe('Product not found!', 'error');
      return;
    }

    var originalContent = '';
    if (btnElement) {
      originalContent = btnElement.innerHTML;
      btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btnElement.disabled = true;
    }

    setTimeout(function() {
      try {
        var htmlContent = generateWordDocument(product);
        var blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        var fileName = sanitizeFileName(product.name) + '_TechWave.doc';
        
        downloadBlob(blob, fileName);
        showToastSafe('Product info downloaded successfully!', 'success');
      } catch (error) {
        showToastSafe('Failed to generate document', 'error');
      }
      
      if (btnElement) {
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
      }
    }, 300);
  };

  window.downloadComparisonWord = function() {
    if (State.compareList.length < 2) {
      showToastSafe('Select at least 2 products to compare', 'warning');
      return;
    }

    var products = State.compareList.map(function(id) { return findProduct(id); }).filter(Boolean);
    
    if (products.length < 2) {
      showToastSafe('Not enough valid products', 'error');
      return;
    }

    try {
      var htmlContent = generateComparisonDocument(products);
      var blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      var fileName = 'TechWave_Comparison_' + products.length + '_Products.doc';
      
      downloadBlob(blob, fileName);
      showToastSafe('Comparison downloaded!', 'success');
    } catch (error) {
      showToastSafe('Failed to generate comparison', 'error');
    }
  };

  window.downloadCatalogWord = function(productIds) {
    productIds = productIds || State.filteredProducts.map(function(p) { return p.id; });
    
    if (productIds.length === 0) {
      showToastSafe('No products to download', 'warning');
      return;
    }

    var products = productIds.map(function(id) { return findProduct(id); }).filter(Boolean);

    try {
      var htmlContent = generateCatalogDocument(products);
      var blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      var fileName = 'TechWave_Catalog_' + products.length + '_Products.doc';
      
      downloadBlob(blob, fileName);
      showToastSafe(products.length + ' products downloaded!', 'success');
    } catch (error) {
      showToastSafe('Failed to generate catalog', 'error');
    }
  };

  function generateWordDocument(product) {
    var discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    var savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : 0;
    var currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var html = '<!DOCTYPE html>';
    html += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">';
    html += '<head><meta charset="utf-8"><title>' + escHtml(product.name) + '</title>';
    html += '<style>' + getWordStyles() + '</style></head><body>';

    html += '<div style="border-bottom:3px solid #8a2be2;padding-bottom:15px;margin-bottom:20px;">';
    html += '<table width="100%"><tr><td>';
    html += '<div style="font-size:28pt;font-weight:bold;color:#1a1a2e;">TECH<span style="color:#8a2be2;">WAVE</span></div>';
    html += '<div style="font-size:10pt;color:#666;">Home Appliances Redefined</div>';
    html += '</td><td align="right" style="font-size:9pt;color:#666;">';
    html += '<div><strong>Product Information Sheet</strong></div>';
    html += '<div>Generated: ' + currentDate + '</div>';
    html += '<div>Product ID: TW-' + product.id + '</div>';
    html += '</td></tr></table></div>';

    html += '<h1 style="font-size:22pt;color:#1a1a2e;margin:0 0 10px 0;">' + escHtml(product.name) + '</h1>';
    html += '<div style="margin-bottom:15px;">';
    html += '<span style="background:#e8f4fd;color:#0066cc;padding:3px 10px;border-radius:4px;font-size:9pt;margin-right:8px;">' + escHtml(product.category) + '</span>';
    html += '<span style="background:#f0f0f0;color:#333;padding:3px 10px;border-radius:4px;font-size:9pt;margin-right:8px;">' + escHtml(product.brand) + '</span>';
    if (product.badge) {
      html += '<span style="background:#fff3e0;color:#e65100;padding:3px 10px;border-radius:4px;font-size:9pt;font-weight:bold;">' + escHtml(product.badge) + '</span>';
    }
    html += '</div>';

    html += '<div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">';
    html += '<table width="100%"><tr><td>';
    html += '<div style="font-size:24pt;font-weight:bold;color:#8a2be2;">$' + product.price.toFixed(2) + '</div>';
    if (product.originalPrice && product.originalPrice > product.price) {
      html += '<div style="font-size:14pt;color:#999;text-decoration:line-through;">$' + product.originalPrice.toFixed(2) + '</div>';
      html += '<div style="font-size:11pt;color:#22c55e;font-weight:bold;">You Save: $' + savings + ' (' + discount + '% OFF)</div>';
    }
    html += '</td><td align="right">';
    html += '<div style="color:' + (product.inStock !== false ? '#22c55e' : '#dc3545') + ';font-weight:bold;">';
    html += (product.inStock !== false ? '✓ In Stock' : '✗ Out of Stock') + '</div>';
    html += '<div style="font-size:10pt;color:#666;">' + generateTextStars(product.rating) + ' (' + product.reviews + ' Reviews)</div>';
    html += '</td></tr></table></div>';

    html += '<h3 style="font-size:12pt;color:#1a1a2e;border-bottom:1px solid #eee;padding-bottom:5px;">Description</h3>';
    html += '<p style="color:#555;">' + escHtml(product.description || 'No description available.') + '</p>';

    if (product.features && product.features.length > 0) {
      html += '<h3 style="font-size:12pt;color:#1a1a2e;border-bottom:1px solid #eee;padding-bottom:5px;margin-top:20px;">Key Features</h3>';
      html += '<ul style="list-style:none;padding:0;margin:0;">';
      product.features.forEach(function(f) {
        html += '<li style="padding:4px 0;"><span style="color:#22c55e;font-weight:bold;margin-right:5px;">✓</span>' + escHtml(f) + '</li>';
      });
      html += '</ul>';
    }

    if (product.detailedSpecs && Object.keys(product.detailedSpecs).length > 0) {
      html += '<h2 style="font-size:14pt;color:#1a1a2e;border-bottom:2px solid #8a2be2;padding-bottom:5px;margin-top:25px;">Technical Specifications</h2>';
      html += '<table width="100%" style="border-collapse:collapse;margin-top:10px;">';
      
      var specs = product.detailedSpecs;
      var specKeys = Object.keys(specs);
      
      specKeys.forEach(function(key, index) {
        var bgColor = index % 2 === 0 ? '#f8f9fa' : '#fff';
        html += '<tr style="background:' + bgColor + ';">';
        html += '<td style="border:1px solid #ddd;padding:8px;font-weight:bold;color:#555;width:30%;">' + escHtml(key) + '</td>';
        html += '<td style="border:1px solid #ddd;padding:8px;">' + escHtml(specs[key]) + '</td>';
        html += '</tr>';
      });
      html += '</table>';
    }

    html += '<div style="margin-top:25px;background:#f8f9fa;padding:15px;border-radius:8px;">';
    html += '<h3 style="font-size:12pt;color:#1a1a2e;margin-top:0;">Warranty & Support</h3>';
    html += '<table width="100%"><tr>';
    html += '<td width="33%" style="text-align:center;padding:10px;">';
    html += '<div style="font-size:20pt;">🛡️</div><div style="font-weight:bold;">Warranty</div>';
    html += '<div style="font-size:9pt;color:#666;">' + (product.detailedSpecs && product.detailedSpecs.Warranty ? escHtml(product.detailedSpecs.Warranty) : 'Standard Warranty') + '</div>';
    html += '</td>';
    html += '<td width="33%" style="text-align:center;padding:10px;">';
    html += '<div style="font-size:20pt;">🚚</div><div style="font-weight:bold;">Free Shipping</div>';
    html += '<div style="font-size:9pt;color:#666;">On orders over $100</div>';
    html += '</td>';
    html += '<td width="33%" style="text-align:center;padding:10px;">';
    html += '<div style="font-size:20pt;">↩️</div><div style="font-weight:bold;">Easy Returns</div>';
    html += '<div style="font-size:9pt;color:#666;">30-day return policy</div>';
    html += '</td>';
    html += '</tr></table></div>';

    html += '<hr style="border:none;border-top:2px solid #8a2be2;margin:25px 0 15px 0;">';
    html += '<table width="100%"><tr><td>';
    html += '<div style="font-size:9pt;color:#666;">';
    html += '<strong>' + CONFIG.COMPANY.name + '</strong><br>';
    html += CONFIG.COMPANY.address + '<br>';
    html += 'Phone: ' + CONFIG.COMPANY.phone + ' | Email: ' + CONFIG.COMPANY.email;
    html += '</div></td><td align="right">';
    html += '<div style="font-size:10pt;color:#8a2be2;">' + CONFIG.COMPANY.website + '</div>';
    html += '<div style="font-size:8pt;color:#999;margin-top:5px;">Prices and availability subject to change.</div>';
    html += '</td></tr></table>';

    html += '</body></html>';
    return html;
  }

  function generateComparisonDocument(products) {
    var currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var html = '<!DOCTYPE html>';
    html += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">';
    html += '<head><meta charset="utf-8"><title>Product Comparison</title>';
    html += '<style>' + getWordStyles() + '</style></head><body>';

    html += '<div style="border-bottom:3px solid #8a2be2;padding-bottom:15px;margin-bottom:20px;">';
    html += '<div style="font-size:28pt;font-weight:bold;color:#1a1a2e;">TECH<span style="color:#8a2be2;">WAVE</span></div>';
    html += '<div style="font-size:14pt;font-weight:bold;color:#1a1a2e;margin-top:10px;">Product Comparison Report</div>';
    html += '<div style="font-size:9pt;color:#666;">Generated: ' + currentDate + ' | ' + products.length + ' Products</div>';
    html += '</div>';

    html += '<table width="100%" style="border-collapse:collapse;">';
    
    html += '<tr style="background:#8a2be2;color:white;">';
    html += '<th style="border:1px solid #ddd;padding:10px;width:20%;">Specification</th>';
    products.forEach(function(p) {
      html += '<th style="border:1px solid #ddd;padding:10px;text-align:center;">' + escHtml(p.name) + '</th>';
    });
    html += '</tr>';

    var rows = [
      { label: 'Brand', key: 'brand' },
      { label: 'Category', key: 'category' },
      { label: 'Price', key: 'price', format: 'price' },
      { label: 'Original Price', key: 'originalPrice', format: 'price' },
      { label: 'Discount', key: null, format: 'discount' },
      { label: 'Rating', key: 'rating', format: 'rating' },
      { label: 'Reviews', key: 'reviews', format: 'number' },
      { label: 'In Stock', key: 'inStock', format: 'boolean' }
    ];

    rows.forEach(function(row, idx) {
      var bgColor = idx % 2 === 0 ? '#f8f9fa' : '#fff';
      html += '<tr style="background:' + bgColor + ';">';
      html += '<td style="border:1px solid #ddd;padding:8px;font-weight:bold;">' + row.label + '</td>';
      
      products.forEach(function(p) {
        var val = '';
        
        if (row.format === 'discount') {
          if (p.originalPrice && p.originalPrice > p.price) {
            val = Math.round((1 - p.price / p.originalPrice) * 100) + '% OFF';
          } else {
            val = '-';
          }
        } else if (row.format === 'price') {
          val = p[row.key] ? '$' + parseFloat(p[row.key]).toFixed(2) : '-';
        } else if (row.format === 'rating') {
          val = p[row.key] ? generateTextStars(p[row.key]) : '-';
        } else if (row.format === 'number') {
          val = p[row.key] ? p[row.key].toLocaleString() : '-';
        } else if (row.format === 'boolean') {
          val = p[row.key] !== false ? '✓ Yes' : '✗ No';
        } else {
          val = p[row.key] || '-';
        }
        
        html += '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + escHtml(val) + '</td>';
      });
      html += '</tr>';
    });

    html += '<tr style="background:#e8f4fd;">';
    html += '<td style="border:1px solid #ddd;padding:8px;font-weight:bold;">Key Features</td>';
    products.forEach(function(p) {
      html += '<td style="border:1px solid #ddd;padding:8px;font-size:9pt;">';
      if (p.features && p.features.length > 0) {
        p.features.slice(0, 5).forEach(function(f) {
          html += '• ' + escHtml(f) + '<br>';
        });
      } else {
        html += '-';
      }
      html += '</td>';
    });
    html += '</tr>';

    var allSpecKeys = [];
    products.forEach(function(p) {
      if (p.detailedSpecs) {
        Object.keys(p.detailedSpecs).forEach(function(key) {
          if (allSpecKeys.indexOf(key) === -1) allSpecKeys.push(key);
        });
      }
    });

    if (allSpecKeys.length > 0) {
      html += '<tr style="background:#1a1a2e;color:white;">';
      html += '<th colspan="' + (products.length + 1) + '" style="border:1px solid #ddd;padding:10px;text-align:center;">Technical Specifications</th>';
      html += '</tr>';
    }

    allSpecKeys.forEach(function(key, idx) {
      var bgColor = idx % 2 === 0 ? '#f8f9fa' : '#fff';
      html += '<tr style="background:' + bgColor + ';">';
      html += '<td style="border:1px solid #ddd;padding:8px;font-weight:bold;">' + escHtml(key) + '</td>';
      products.forEach(function(p) {
        var specVal = (p.detailedSpecs && p.detailedSpecs[key]) || '-';
        html += '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + escHtml(specVal) + '</td>';
      });
      html += '</tr>';
    });

    html += '</table>';

    html += '<hr style="border:none;border-top:2px solid #8a2be2;margin:25px 0 15px 0;">';
    html += '<div style="font-size:9pt;color:#666;text-align:center;">';
    html += CONFIG.COMPANY.name + ' | ' + CONFIG.COMPANY.website + ' | ' + CONFIG.COMPANY.phone;
    html += '<br><span style="font-size:8pt;">Prices and specifications subject to change. Visit our website for the latest information.</span>';
    html += '</div>';

    html += '</body></html>';
    return html;
  }

  function generateCatalogDocument(products) {
    var currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var html = '<!DOCTYPE html>';
    html += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">';
    html += '<head><meta charset="utf-8"><title>TechWave Product Catalog</title>';
    html += '<style>' + getWordStyles() + '</style></head><body>';

    html += '<div style="text-align:center;padding-top:200px;">';
    html += '<div style="font-size:48pt;font-weight:bold;color:#1a1a2e;">TECH<span style="color:#8a2be2;">WAVE</span></div>';
    html += '<div style="font-size:14pt;color:#666;margin-top:10px;">Home Appliances Redefined</div>';
    html += '<h1 style="font-size:36pt;color:#8a2be2;margin-top:50px;">Product Catalog</h1>';
    html += '<div style="margin-top:30px;font-size:12pt;color:#666;">';
    html += '<div>' + products.length + ' Products</div>';
    html += '<div>Generated: ' + currentDate + '</div>';
    html += '</div></div>';

    html += '<br clear="all" style="page-break-before:always">';

    html += '<h2 style="border-bottom:2px solid #8a2be2;padding-bottom:5px;">Table of Contents</h2>';
    html += '<table width="100%" style="border-collapse:collapse;">';
    products.forEach(function(p, idx) {
      html += '<tr style="border-bottom:1px dotted #ddd;">';
      html += '<td style="padding:8px;">' + (idx + 1) + '. ' + escHtml(p.name) + '</td>';
      html += '<td style="padding:8px;text-align:right;">' + escHtml(p.category) + '</td>';
      html += '<td style="padding:8px;text-align:right;font-weight:bold;color:#8a2be2;">$' + p.price.toFixed(2) + '</td>';
      html += '</tr>';
    });
    html += '</table>';

    products.forEach(function(p, idx) {
      html += '<br clear="all" style="page-break-before:always">';
      
      var discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
      
      html += '<div style="font-size:9pt;color:#8a2be2;text-transform:uppercase;letter-spacing:1px;">Product ' + (idx + 1) + ' of ' + products.length + '</div>';
      html += '<h2 style="font-size:20pt;color:#1a1a2e;margin:5px 0 10px 0;">' + escHtml(p.name) + '</h2>';
      html += '<div style="font-size:10pt;color:#666;margin-bottom:15px;">';
      html += escHtml(p.brand) + ' | ' + escHtml(p.category);
      if (p.badge) html += ' | <span style="color:#e65100;font-weight:bold;">' + escHtml(p.badge) + '</span>';
      html += '</div>';

      html += '<div style="margin-bottom:15px;">';
      html += '<span style="font-size:18pt;font-weight:bold;color:#8a2be2;">$' + p.price.toFixed(2) + '</span>';
      if (p.originalPrice && p.originalPrice > p.price) {
        html += ' <span style="color:#999;text-decoration:line-through;">$' + p.originalPrice.toFixed(2) + '</span>';
        html += ' <span style="color:#22c55e;font-weight:bold;">-' + discount + '%</span>';
      }
      html += '</div>';

      html += '<div style="font-size:10pt;color:#666;margin-bottom:10px;">';
      html += generateTextStars(p.rating) + ' (' + p.reviews.toLocaleString() + ' reviews)';
      html += '</div>';

      html += '<p style="font-size:10pt;color:#555;">' + escHtml(p.description || '') + '</p>';

      if (p.features && p.features.length > 0) {
        html += '<div style="background:#f8f9fa;padding:10px;border-radius:5px;margin-top:10px;">';
        html += '<strong>Key Features:</strong><br>';
        p.features.slice(0, 5).forEach(function(f) {
          html += '✓ ' + escHtml(f) + '<br>';
        });
        html += '</div>';
      }

      if (p.detailedSpecs) {
        var quickSpecs = ['Power', 'Capacity', 'Warranty', 'Dimensions'];
        html += '<div style="margin-top:15px;font-size:10pt;">';
        html += '<strong>Quick Specifications:</strong><br>';
        quickSpecs.forEach(function(key) {
          if (p.detailedSpecs[key]) {
            html += '<strong>' + key + ':</strong> ' + escHtml(p.detailedSpecs[key]) + ' | ';
          }
        });
        html += '</div>';
      }
    });

    html += '<br clear="all" style="page-break-before:always">';
    html += '<div style="text-align:center;padding-top:250px;">';
    html += '<div style="font-size:36pt;font-weight:bold;color:#1a1a2e;">TECH<span style="color:#8a2be2;">WAVE</span></div>';
    html += '<div style="margin-top:50px;">';
    html += '<h3>Contact Us</h3>';
    html += '<p>' + CONFIG.COMPANY.address + '</p>';
    html += '<p>Phone: ' + CONFIG.COMPANY.phone + '</p>';
    html += '<p>Email: ' + CONFIG.COMPANY.email + '</p>';
    html += '<p style="color:#8a2be2;font-size:14pt;">' + CONFIG.COMPANY.website + '</p>';
    html += '</div>';
    html += '<div style="margin-top:100px;font-size:10pt;color:#666;">© ' + new Date().getFullYear() + ' TechWave. All rights reserved.</div>';
    html += '</div>';

    html += '</body></html>';
    return html;
  }

  function getWordStyles() {
    return '@page{margin:0.75in;size:letter;}body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;color:#333;margin:0;padding:0;}';
  }

  function generateTextStars(rating) {
    rating = parseFloat(rating) || 0;
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    
    var stars = '';
    for (var i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    for (var j = 0; j < empty; j++) stars += '☆';
    
    return stars + ' ' + rating.toFixed(1);
  }

  function sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function downloadBlob(blob, fileName) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

})();