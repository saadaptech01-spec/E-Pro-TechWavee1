
(function () {
  'use strict';

  var products = window.TECHWAVE_PRODUCTS || [];

  document.addEventListener('DOMContentLoaded', function () {
    var featuredContainer = document.getElementById('featuredProducts');
    var modulesContainer = document.getElementById('productModules');
    if (featuredContainer) renderFeaturedProducts(featuredContainer);
    if (modulesContainer && modulesContainer.children.length === 0) renderCategoryModules(modulesContainer);
    console.log('Product Display loaded — ' + products.length + ' products available');
  });

  function renderFeaturedProducts(container) {
    if (products.length === 0) { container.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No products available.</p></div>'; return; }
    var featured = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].badge && (products[i].badgeType === 'hot' || products[i].badge.toLowerCase().indexOf('best') !== -1 || products[i].badge.toLowerCase().indexOf('top') !== -1)) featured.push(products[i]);
    }
    var byRating = products.slice().sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
    for (var j = 0; j < byRating.length; j++) {
      if (featured.length >= 8) break;
      var exists = false;
      for (var k = 0; k < featured.length; k++) { if (featured[k].id === byRating[j].id) { exists = true; break; } }
      if (!exists) featured.push(byRating[j]);
    }
    featured = featured.slice(0, 8);
    var html = '';
    for (var f = 0; f < featured.length; f++) html += buildFeaturedCard(featured[f]);
    container.innerHTML = html;
    setTimeout(function () {
      var cards = container.querySelectorAll('.animate-slide-up');
      for (var a = 0; a < cards.length; a++) {
        (function (el, idx) {
          el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          setTimeout(function () { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, idx * 100);
        })(cards[a], a);
      }
    }, 100);
  }

  function buildFeaturedCard(p) {
    var discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    var stars = generateStars(p.rating);
    var badgeHtml = '';
    if (p.badge) {
      var bc = 'product-badge';
      if (p.badgeType === 'hot') bc += ' badge-hot'; else if (p.badgeType === 'sale') bc += ' badge-sale'; else if (p.badgeType === 'new') bc += ' badge-new';
      badgeHtml = '<span class="' + bc + '">' + esc(p.badge) + '</span>';
    }
    var featHtml = '';
    if (p.features && p.features.length > 0) {
      featHtml = '<div class="product-features-preview">';
      var max = Math.min(3, p.features.length);
      for (var i = 0; i < max; i++) featHtml += '<span class="feat-tag"><i class="fas fa-check me-1"></i>' + esc(p.features[i]) + '</span>';
      featHtml += '</div>';
    }
    var s = '';
    s += '<div class="col-xl-3 col-lg-4 col-md-6 animate-slide-up">';
    s += '<div class="product-card featured-product-card">';
    s += '<div class="product-image-wrap">' + badgeHtml;
    s += '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" class="product-image">';
    s += '<button class="wishlist-heart-btn" onclick="featuredAddWishlist(' + p.id + ', this)" title="Add to Wishlist"><i class="far fa-heart"></i></button>';
    s += '<div class="product-overlay"><button class="product-action-btn" onclick="featuredQuickView(' + p.id + ')" title="Quick View"><i class="fas fa-eye"></i></button>';
    s += '<button class="product-action-btn" onclick="featuredAddCart(' + p.id + ')" title="Add to Cart"><i class="fas fa-cart-plus"></i></button></div>';
    s += '<div class="quick-add-bar"><button class="quick-add-btn" onclick="featuredAddCart(' + p.id + ')"><i class="fas fa-cart-plus me-2"></i>Quick Add</button></div>';
    s += '</div>';
    s += '<div class="product-info"><div class="product-info-top"><span class="product-category-tag">' + esc(p.category) + '</span>';
    s += '<span class="stock-status in-stock"><i class="fas fa-check-circle me-1"></i>In Stock</span></div>';
    s += '<h5 class="product-name" onclick="featuredQuickView(' + p.id + ')">' + esc(p.name) + '</h5>';
    s += '<div class="product-rating">' + stars + '<span class="rating-text">(' + p.reviews.toLocaleString() + ')</span></div>';
    s += '<div class="product-price-row"><span class="product-price">$' + p.price.toFixed(2) + '</span>';
    if (p.originalPrice && p.originalPrice > p.price) {
      s += '<span class="product-original-price">$' + p.originalPrice.toFixed(2) + '</span>';
      s += '<span class="product-discount">-' + discount + '%</span>';
    }
    s += '</div>';
    if (p.originalPrice && p.originalPrice > p.price) s += '<div class="product-savings"><i class="fas fa-tag me-1"></i>You save $' + (p.originalPrice - p.price).toFixed(2) + '</div>';
    s += featHtml;
    s += '<button class="btn btn-primary w-100 mt-auto add-to-cart-btn" onclick="featuredAddCart(' + p.id + ')" id="featured-btn-' + p.id + '"><i class="fas fa-cart-plus me-2"></i>Add to Cart</button>';
    s += '</div></div></div>';
    return s;
  }

  function renderCategoryModules(container) {
    var categories = [
      { name: 'Kitchen Appliances', slug: 'Kitchen', icon: 'fa-blender', colorClass: 'category-kitchen', desc: 'Smart appliances for modern cooking', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=60', tags: ['Blenders', 'Ovens', 'Mixers', 'Cookers'] },
      { name: 'Home Appliances', slug: 'Home', icon: 'fa-couch', colorClass: 'category-home', desc: 'Smart solutions for comfortable living', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=60', tags: ['AC', 'Washing', 'Vacuum', 'Fans'] },
      { name: 'Personal Care', slug: 'Personal Care', icon: 'fa-spa', colorClass: 'category-personal', desc: 'Premium grooming & wellness tech', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=60', tags: ['Trimmers', 'Dryers', 'Shavers', 'Iron'] },
      { name: 'Entertainment', slug: 'Entertainment', icon: 'fa-tv', colorClass: 'category-entertainment', desc: 'Immersive audio & visual experience', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=60', tags: ['TVs', 'Speakers', 'Gaming', 'Audio'] }
    ];
    var html = '';
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i]; var count = countByCategory(cat.name); var avgR = avgRatingByCategory(cat.name);
      html += '<div class="col-lg-3 col-md-6 animate-slide-up"><a href="product.html?category=' + encodeURIComponent(cat.name) + '" class="category-card-link"><div class="category-card ' + cat.colorClass + '"><div class="category-bg-pattern"></div>';
      html += '<div class="category-icon-wrap"><div class="category-icon"><i class="fas ' + cat.icon + '"></i></div><div class="category-icon-glow"></div></div>';
      html += '<div class="category-content"><h4>' + esc(cat.slug) + '</h4><p>' + esc(cat.desc) + '</p>';
      html += '<div class="category-stats"><span><i class="fas fa-box me-1"></i>' + count + '+ Products</span><span><i class="fas fa-star me-1"></i>' + avgR + ' Avg</span></div>';
      html += '<div class="category-tags">'; for (var t = 0; t < cat.tags.length; t++) html += '<span class="cat-tag">' + esc(cat.tags[t]) + '</span>'; html += '</div></div>';
      html += '<div class="category-arrow"><i class="fas fa-arrow-right"></i></div>';
      html += '<div class="category-hover-img"><img src="' + cat.img + '" alt="' + esc(cat.name) + '" loading="lazy"></div>';
      html += '</div></a></div>';
    }
    container.innerHTML = html;
  }

  function countByCategory(catName) { var c = 0; for (var i = 0; i < products.length; i++) if (products[i].category === catName) c++; return c; }
  function avgRatingByCategory(catName) { var t = 0, c = 0; for (var i = 0; i < products.length; i++) if (products[i].category === catName) { t += products[i].rating; c++; } return c > 0 ? (t / c).toFixed(1) : '0.0'; }
  function generateStars(rating) { var h = ''; var full = Math.floor(rating); var half = rating % 1 >= 0.5; for (var i = 0; i < full; i++) h += '<i class="fas fa-star"></i>'; if (half) { h += '<i class="fas fa-star-half-alt"></i>'; full++; } for (var j = full; j < 5; j++) h += '<i class="far fa-star"></i>'; h += '<span class="rating-num">' + rating + '</span>'; return h; }
  function esc(str) { var div = document.createElement('div'); div.appendChild(document.createTextNode(str)); return div.innerHTML; }
  function findProduct(id) { for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; }


  
  window.featuredAddCart = function (id) {
    var p = findProduct(id);
    if (!p) return;


    if (typeof window.addToCart === 'function') {
      window.addToCart(p.id, 1);
    } else {

      var cart = [];
      try { cart = JSON.parse(localStorage.getItem('tw_cart') || '[]'); } catch (e) { cart = []; }
      var found = false;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) { cart[i].qty = (cart[i].qty || 1) + 1; found = true; break; }
      }
      if (!found) {
        cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category, qty: 1 });
      }
      localStorage.setItem('tw_cart', JSON.stringify(cart));
      if (typeof showToast === 'function') showToast(p.name + ' added to cart!', 'success');
      var badge = document.getElementById('cartBadge');
      if (badge) { var totalQty = 0; for (var j = 0; j < cart.length; j++) totalQty += (cart[j].qty || 1); badge.textContent = totalQty; badge.style.display = totalQty > 0 ? 'inline-block' : 'none'; }
    }

    var btn = document.getElementById('featured-btn-' + id);
    if (btn) {
      var orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
      btn.classList.add('btn-success'); btn.classList.remove('btn-primary');
      setTimeout(function () { btn.innerHTML = orig; btn.classList.remove('btn-success'); btn.classList.add('btn-primary'); }, 1500);
    }
  };

  window.featuredAddWishlist = function (id, btn) {
    var p = findProduct(id);
    if (!p) return;
    var wishlist = [];
    try { wishlist = JSON.parse(localStorage.getItem('tw_wishlist') || '[]'); } catch (e) { wishlist = []; }
    var idx = wishlist.indexOf(id);
    if (idx !== -1) {
      wishlist.splice(idx, 1);
      if (btn) { btn.classList.remove('active'); btn.querySelector('i').className = 'far fa-heart'; btn.classList.add('heart-pop'); setTimeout(function () { btn.classList.remove('heart-pop'); }, 400); }
      if (typeof showToast === 'function') showToast(p.name + ' removed from wishlist', 'info');
    } else {
      wishlist.push(id);
      if (btn) { btn.classList.add('active'); btn.querySelector('i').className = 'fas fa-heart'; btn.classList.add('heart-pop'); setTimeout(function () { btn.classList.remove('heart-pop'); }, 400); }
      if (typeof showToast === 'function') showToast(p.name + ' added to wishlist', 'success');
    }
    localStorage.setItem('tw_wishlist', JSON.stringify(wishlist));
  };

  window.featuredQuickView = function (id) {
    var p = findProduct(id);
    if (!p) return;
    if (typeof openProductDetail === 'function') { openProductDetail(id); return; }
    var modal = document.getElementById('productModal');
    var titleEl = document.getElementById('productModalTitle');
    var bodyEl = document.getElementById('productModalBody');
    if (!modal || !bodyEl) return;
    if (titleEl) titleEl.textContent = p.name;

    var discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    var stars = generateStars(p.rating);
    var featHtml = '';
    if (p.features) {
      featHtml = '<div class="detail-features mt-3"><h6><i class="fas fa-list-check me-2"></i>Key Features</h6><div class="detail-features-grid">';
      for (var i = 0; i < p.features.length; i++) featHtml += '<div class="detail-feature-item"><i class="fas fa-check-circle"></i><span>' + esc(p.features[i]) + '</span></div>';
      featHtml += '</div></div>';
    }
    var html = '<div class="row g-4">';
    html += '<div class="col-md-5"><div class="detail-main-img">';
    if (p.badge) html += '<span class="product-badge badge-' + (p.badgeType || 'hot') + '">' + esc(p.badge) + '</span>';
    html += '<img src="' + p.image + '" alt="' + esc(p.name) + '" class="img-fluid rounded-3"></div></div>';
    html += '<div class="col-md-7"><span class="product-category-tag mb-2 d-inline-block">' + esc(p.category) + '</span>';
    html += '<h3 class="fw-bold mb-2" style="color:#fff;">' + esc(p.name) + '</h3>';
    html += '<div class="product-rating mb-3">' + stars + '<span class="rating-text">(' + p.reviews.toLocaleString() + ' reviews)</span></div>';
    html += '<div class="product-price-row mb-3"><span class="product-price" style="font-size:1.8rem;">$' + p.price.toFixed(2) + '</span>';
    if (p.originalPrice && p.originalPrice > p.price) {
      html += '<span class="product-original-price ms-2" style="font-size:1.1rem;">$' + p.originalPrice.toFixed(2) + '</span>';
      html += '<span class="product-discount ms-2">-' + discount + '%</span>';
      html += '<div class="product-savings mt-1"><i class="fas fa-tag me-1"></i>You save $' + (p.originalPrice - p.price).toFixed(2) + '</div>';
    }
    html += '</div>';
    html += '<p class="text-secondary mb-3">' + esc(p.description) + '</p>';
    html += featHtml;
    html += '<div class="d-flex gap-2 flex-wrap mt-3"><button class="btn btn-primary btn-lg flex-fill" onclick="featuredAddCart(' + p.id + ')"><i class="fas fa-cart-plus me-2"></i>Add to Cart</button>';
    html += '<button class="btn btn-outline-light btn-lg" onclick="featuredAddWishlist(' + p.id + ', this)"><i class="far fa-heart"></i></button></div>';
    html += '<div class="mt-3 d-flex gap-3 flex-wrap"><small class="text-success"><i class="fas fa-check-circle me-1"></i>In Stock</small><small style="color:rgba(255,255,255,0.5);"><i class="fas fa-truck me-1"></i>Free Shipping</small><small style="color:rgba(255,255,255,0.5);"><i class="fas fa-undo me-1"></i>30-Day Returns</small></div>';
    html += '<div class="mt-3"><a href="product.html?category=' + encodeURIComponent(p.category) + '" class="btn btn-outline-primary btn-sm"><i class="fas fa-th-large me-2"></i>View All ' + esc(p.category) + '</a></div>';
    html += '</div></div>';
    bodyEl.innerHTML = html;
    new bootstrap.Modal(modal).show();
  };

})();