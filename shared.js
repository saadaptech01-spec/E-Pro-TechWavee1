

(function() {
  'use strict';

  var ALL_PRODUCTS = [
    { id: 1,  name: 'Smart Blender Pro',        category: 'Kitchen Appliances', price: 129.99, originalPrice: 179.99, description: '1200W high-performance blender with smart speed control, 6-blade system, and BPA-free pitcher.',          image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 245, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['1200W Motor','Smart Speed Control','6 Stainless Steel Blades','BPA Free','Auto Clean'] },
    { id: 2,  name: 'Espresso Coffee Machine',  category: 'Kitchen Appliances', price: 299.99, originalPrice: 399.99, description: 'Professional espresso machine with 15-bar pressure, built-in grinder, and milk frother.',                  image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 312, badge: 'Hot',         badgeClass: 'badge-hot',        features: ['15-Bar Pressure','Built-in Grinder','Milk Frother','LCD Display','Auto Descaling'] },
    { id: 3,  name: 'Digital Air Fryer XL',     category: 'Kitchen Appliances', price: 89.99,  originalPrice: 129.99, description: '5.8QT digital air fryer with 8 presets. Crispy results with 85% less oil.',                             image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 189, badge: 'Sale',        badgeClass: 'badge-sale',       features: ['5.8QT Capacity','8 Presets','85% Less Oil','Digital Touch Screen','Dishwasher Safe'] },
    { id: 4,  name: 'Smart Toaster Elite',      category: 'Kitchen Appliances', price: 59.99,  originalPrice: 79.99,  description: '4-slice smart toaster with 7 browning levels, bagel mode, and countdown display.',                       image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=400&q=80', rating: 4.5, reviews: 156, badge: '',           badgeClass: '',                 features: ['4 Slice','7 Browning Levels','Bagel Mode','LED Countdown','Stainless Steel'] },
    { id: 5,  name: 'Food Processor 12-Cup',    category: 'Kitchen Appliances', price: 149.99, originalPrice: 199.99, description: '750W food processor with 12-cup capacity, multiple blades, and pulse function.',                         image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 134, badge: '',           badgeClass: '',                 features: ['750W Motor','12-Cup Bowl','Multiple Blades','Pulse Function','Safety Lock'] },
    { id: 6,  name: 'Smart Microwave Oven',     category: 'Kitchen Appliances', price: 199.99, originalPrice: 249.99, description: '1100W smart microwave with voice control, sensor cooking, and WiFi connectivity.',                       image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=400&q=80', rating: 4.4, reviews: 98,  badge: 'New',         badgeClass: 'badge-new',        features: ['1100W Power','Voice Control','WiFi Enabled','Sensor Cooking','10 Power Levels'] },
    { id: 7,  name: 'Electric Kettle Pro',      category: 'Kitchen Appliances', price: 49.99,  originalPrice: 69.99,  description: '1.7L stainless steel electric kettle with variable temperature and keep-warm.',                         image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 267, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['1.7L Capacity','Variable Temp','Keep Warm','Auto Shutoff','Stainless Steel'] },
    { id: 8,  name: 'Smart Dishwasher',         category: 'Kitchen Appliances', price: 549.99, originalPrice: 699.99, description: 'Energy-efficient smart dishwasher with 14 place settings and WiFi control.',                             image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 87,  badge: 'Sale',        badgeClass: 'badge-sale',       features: ['14 Place Settings','WiFi Control','Whisper Quiet','Energy Star','6 Wash Cycles'] },
    { id: 9,  name: 'Robot Vacuum X1',          category: 'Home Appliances',    price: 349.99, originalPrice: 449.99, description: 'LiDAR robot vacuum with 2700Pa suction, auto-empty dock, and smart mapping.',                           image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 423, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['LiDAR Navigation','2700Pa Suction','Auto-Empty Dock','Smart Mapping','Voice Control'] },
    { id: 10, name: 'Smart Air Conditioner',    category: 'Home Appliances',    price: 499.99, originalPrice: 649.99, description: '12000 BTU inverter AC with WiFi, energy saving, and air purification.',                                  image: 'https://images.unsplash.com/photo-1631545806609-3c480b3e9a1e?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 176, badge: '',           badgeClass: '',                 features: ['12000 BTU','Inverter Tech','WiFi Control','Air Purifier','Energy Saving'] },
    { id: 11, name: 'HEPA Air Purifier',        category: 'Home Appliances',    price: 179.99, originalPrice: 229.99, description: 'True HEPA H13 covering 1200 sq ft. Removes 99.97% of allergens.',                                       image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 298, badge: 'Hot',         badgeClass: 'badge-hot',        features: ['True HEPA H13','1200 sq ft','99.97% Filtration','Sleep Mode','Air Quality Sensor'] },
    { id: 12, name: 'Smart Washing Machine',    category: 'Home Appliances',    price: 599.99, originalPrice: 799.99, description: '10kg front-load washer with AI optimization, steam clean, and app control.',                             image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 145, badge: 'Sale',        badgeClass: 'badge-sale',       features: ['10kg Capacity','AI Optimization','Steam Clean','App Control','Quiet Operation'] },
    { id: 13, name: 'Smart Thermostat',         category: 'Home Appliances',    price: 129.99, originalPrice: 169.99, description: 'Learning thermostat with auto-schedule, remote control, and energy reports.',                            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 356, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['Auto Schedule','Remote Control','Energy Reports','Voice Compatible','Easy Install'] },
    { id: 14, name: 'Smart Door Lock',          category: 'Home Appliances',    price: 199.99, originalPrice: 259.99, description: 'Fingerprint smart lock with auto-lock, app control, and emergency backup.',                              image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 201, badge: 'New',         badgeClass: 'badge-new',        features: ['Fingerprint Scanner','Keypad Entry','Auto-Lock','App Control','Emergency Key'] },
    { id: 15, name: '4K Security Camera',       category: 'Home Appliances',    price: 79.99,  originalPrice: 109.99, description: '4K outdoor camera with night vision, motion detection, and 2-way audio.',                                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80', rating: 4.5, reviews: 189, badge: '',           badgeClass: '',                 features: ['4K Resolution','Night Vision','Motion Detection','2-Way Audio','Cloud Storage'] },
    { id: 16, name: 'Smart LED Bulbs (4-Pack)', category: 'Home Appliances',    price: 39.99,  originalPrice: 59.99,  description: 'Color-changing smart LEDs with voice control, scheduling, and 16M colors.',                              image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=400&q=80', rating: 4.4, reviews: 412, badge: 'Sale',        badgeClass: 'badge-sale',       features: ['16M Colors','Voice Control','Scheduling','Energy Efficient','Easy Setup'] },
    { id: 17, name: 'Electric Pro Shaver',      category: 'Personal Care',      price: 89.99,  originalPrice: 119.99, description: 'Wet & dry rotary shaver with flex heads and 60-min cordless runtime.',                                  image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 234, badge: '',           badgeClass: '',                 features: ['Wet & Dry','Flex Heads','Pop-Up Trimmer','60-Min Runtime','Fast Charge'] },
    { id: 18, name: 'Ionic Hair Dryer',         category: 'Personal Care',      price: 69.99,  originalPrice: 99.99,  description: '1875W ionic dryer with 3 heat settings, cool shot, and concentrator nozzle.',                            image: 'https://images.unsplash.com/photo-1522338242992-e1a54571a9b6?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 178, badge: 'Hot',         badgeClass: 'badge-hot',        features: ['1875W Power','Ionic Technology','3 Heat Settings','Cool Shot','Lightweight'] },
    { id: 19, name: 'Sonic Electric Toothbrush',category: 'Personal Care',      price: 49.99,  originalPrice: 69.99,  description: '40000 VPM sonic toothbrush with 5 modes and 30-day battery life.',                                       image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 345, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['40000 VPM','5 Modes','Smart Timer','30-Day Battery','IPX7 Waterproof'] },
    { id: 20, name: 'Deep Tissue Massage Gun',  category: 'Personal Care',      price: 119.99, originalPrice: 159.99, description: 'Percussion gun with 6 heads, 30 speeds, and ultra-quiet motor.',                                         image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 267, badge: '',           badgeClass: '',                 features: ['6 Massage Heads','30 Speeds','Ultra Quiet','4-Hour Battery','Carry Case'] },
    { id: 21, name: 'Smart Body Scale',         category: 'Personal Care',      price: 39.99,  originalPrice: 54.99,  description: '13-metric smart scale with Bluetooth app and unlimited users.',                                          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80', rating: 4.5, reviews: 198, badge: 'New',         badgeClass: 'badge-new',        features: ['13 Body Metrics','Bluetooth App','Tempered Glass','Unlimited Users','High Precision'] },
    { id: 22, name: 'Titanium Hair Straightener',category: 'Personal Care',     price: 59.99,  originalPrice: 89.99,  description: 'Titanium flat iron 250-450 F with auto shutoff and dual voltage.',                                       image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 156, badge: 'Sale',        badgeClass: 'badge-sale',       features: ['Titanium Plates','250-450 F','30-Sec Heat Up','Auto Shutoff','Dual Voltage'] },
    { id: 23, name: '55" 4K Smart TV',          category: 'Entertainment',      price: 499.99, originalPrice: 699.99, description: '55" 4K UHD with HDR10+, Dolby Atmos, streaming apps, and voice remote.',                                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 534, badge: 'Best Seller', badgeClass: 'badge-bestseller', features: ['4K UHD','HDR10+','Dolby Atmos','Smart Apps','Voice Remote'] },
    { id: 24, name: 'Bluetooth Speaker Max',    category: 'Entertainment',      price: 79.99,  originalPrice: 109.99, description: '360 Bluetooth speaker with 24hr battery, IPX7, and RGB lights.',                                         image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 289, badge: 'Hot',         badgeClass: 'badge-hot',        features: ['360 Sound','24-Hour Battery','IPX7 Waterproof','RGB Lights','Bluetooth 5.3'] },
    { id: 25, name: 'Next-Gen Gaming Console',  category: 'Entertainment',      price: 449.99, originalPrice: 499.99, description: 'Next-gen console with 4K/120fps, 1TB SSD, and wireless controller.',                                    image: 'https://images.unsplash.com/photo-1606318313647-137d1f3b4d3c?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 678, badge: 'Hot',         badgeClass: 'badge-hot',        features: ['4K/120fps','1TB SSD','Ray Tracing','Wireless Controller','Backward Compatible'] },
    { id: 26, name: 'VR Headset Pro',           category: 'Entertainment',      price: 349.99, originalPrice: 449.99, description: 'Standalone VR with 4K display, hand tracking, and 256GB. No PC needed.',                                image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 198, badge: 'New',         badgeClass: 'badge-new',        features: ['4K Per Eye','Hand Tracking','256GB Storage','Standalone','6DoF Tracking'] },
    { id: 27, name: 'Dolby Atmos Sound Bar',    category: 'Entertainment',      price: 249.99, originalPrice: 329.99, description: '5.1.2 channel sound bar with wireless sub and Dolby Atmos.',                                           image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 167, badge: '',           badgeClass: '',                 features: ['5.1.2 Channel','Wireless Sub','Dolby Atmos','HDMI eARC','Wall Mountable'] },
    { id: 28, name: '4K Laser Projector',       category: 'Entertainment',      price: 799.99, originalPrice: 999.99, description: '4K laser projector with 2500 lumens, 150" display, and smart TV built-in.',                             image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 89,  badge: 'Sale',        badgeClass: 'badge-sale',       features: ['4K Resolution','2500 Lumens','150" Display','Auto Keystone','Smart TV Built-in'] }
  ];

  window.ALL_PRODUCTS = ALL_PRODUCTS;

  var BRANDS = [
    { id: 'samsung',  name: 'Samsung',  country: 'South Korea' },
    { id: 'lg',       name: 'LG',       country: 'South Korea' },
    { id: 'dawlance', name: 'Dawlance', country: 'Pakistan'    },
    { id: 'haier',    name: 'Haier',    country: 'China'       },
    { id: 'philips',  name: 'Philips',  country: 'Netherlands' }
  ];

  var PRODUCT_BRANDS = {
    1:'Philips', 2:'Samsung', 3:'Philips', 4:'Haier',   5:'Philips',
    6:'Samsung', 7:'Haier',   8:'Samsung', 9:'Samsung', 10:'LG',
    11:'Philips',12:'LG',     13:'Samsung',14:'Samsung',15:'Samsung',
    16:'Philips',17:'Philips',18:'Philips',19:'Philips',20:'Philips',
    21:'Philips',22:'Philips',23:'Samsung',24:'Philips',25:'Samsung',
    26:'Samsung',27:'Samsung',28:'LG'
  };

  ALL_PRODUCTS.forEach(function(p) {
    p.brand   = PRODUCT_BRANDS[p.id] || 'TechWave';
    p.inStock = true;
  });

  function findProductById(id) {
    id = parseInt(id);
    if (isNaN(id)) return null;

    var product = null;
    var sources = [
      ALL_PRODUCTS,
      window.ALL_PRODUCTS,
      window.TECHWAVE_PRODUCTS,
      window.products,
      window.productsData,
      window.PRODUCTS,
      window.allProducts
    ];

    for (var i = 0; i < sources.length; i++) {
      var src = sources[i];
      if (src && Array.isArray(src)) {
        product = src.find(function(p) { return parseInt(p.id) === id; });
        if (product) return product;
      }
    }

    var cardEl = document.querySelector('[data-product-id="' + id + '"]');
    if (cardEl) {
      try {
        var nameEl  = cardEl.querySelector('.card-title, h5, .product-name');
        var priceEl = cardEl.querySelector('.current-price, .price, .product-price');
        var imgEl   = cardEl.querySelector('img');
        product = {
          id:           id,
          name:         cardEl.getAttribute('data-product-name') || (nameEl  ? nameEl.textContent.trim()                           : 'Product'),
          price:        parseFloat(cardEl.getAttribute('data-product-price') || (priceEl ? priceEl.textContent.replace(/[^0-9.]/g,'') : 0)) || 0,
          image:        imgEl ? imgEl.src : '',
          category:     cardEl.getAttribute('data-category') || '',
          brand:        cardEl.getAttribute('data-brand')    || '',
          features:     [],
          rating:       0,
          reviews:      0
        };
        if (product.name && product.price > 0) return product;
      } catch (e) {
        console.warn('findProductById DOM fallback error:', e);
      }
    }

    return null;
  }

  window.findProductById = findProductById;

  var AppState = {
    cart:     [],
    wishlist: [],
    user:     null,
    orders:   [],

    load: function() {
      try {
        this.cart     = JSON.parse(localStorage.getItem('tw_cart'))     || [];
        this.wishlist = JSON.parse(localStorage.getItem('tw_wishlist')) || [];
        this.user     = JSON.parse(localStorage.getItem('tw_user'))     || null;
        this.orders   = JSON.parse(localStorage.getItem('tw_orders'))   || [];
      } catch (e) {
        this.cart = []; this.wishlist = []; this.user = null; this.orders = [];
      }
    },

    save: function() {
      try {
        localStorage.setItem('tw_cart',     JSON.stringify(this.cart));
        localStorage.setItem('tw_wishlist', JSON.stringify(this.wishlist));
        localStorage.setItem('tw_user',     JSON.stringify(this.user));
        localStorage.setItem('tw_orders',   JSON.stringify(this.orders));
      } catch (e) {
        console.error('Error saving state:', e);
      }
    },

    isLoggedIn: function() {
      return this.user !== null && this.user.loggedIn === true;
    },

    getCartTotal: function() {
      return this.cart.reduce(function(sum, item) {
        var price = item.price;
        if (!price || price <= 0) {
          var product = findProductById(item.id);
          price = product ? product.price : 0;
        }
        return sum + (price * (item.qty || 1));
      }, 0);
    },

    getCartCount: function() {
      return this.cart.reduce(function(sum, item) { return sum + (item.qty || 1); }, 0);
    }
  };

  AppState.load();

  var Toast = {
    container: null,

    init: function() {
      this.container = document.getElementById('toastContainer');
      if (!this.container) {
        this.container            = document.createElement('div');
        this.container.id        = 'toastContainer';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },

    show: function(message, type, options) {
      if (!this.container) this.init();

      type    = type    || 'success';
      options = options || {};
      var duration = options.duration || 3500;
      var title    = options.title    || null;

      var icons = {
        success: 'fa-check-circle',
        error:   'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info:    'fa-info-circle',
        cart:    'fa-shopping-cart'
      };

      var titles = {
        success: 'Success!',
        error:   'Error!',
        warning: 'Warning!',
        info:    'Info',
        cart:    'Added to Cart!'
      };
      var knownType  = icons.hasOwnProperty(type);
      var iconClass  = knownType ? icons[type]  : icons.success;
      var toastClass = knownType ? type         : 'success';

      var toast = document.createElement('div');
      toast.className = 'toast-notification toast-' + toastClass;
      toast.style.setProperty('--toast-duration', duration + 'ms');

      var actionHTML = '';
      if (options.actionText) {
        actionHTML =
          '<button class="toast-action-btn" data-toast-action>' +
            options.actionText + ' <i class="fas fa-arrow-right"></i>' +
          '</button>';
      }

      toast.innerHTML =
        '<div class="toast-icon"><i class="fas ' + iconClass + '"></i></div>' +
        '<div class="toast-content">' +
          '<p class="toast-title">'   + (title || titles[type] || 'Notification') + '</p>' +
          '<p class="toast-message">' + message + '</p>' +
          actionHTML +
        '</div>' +
        '<button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>' +
        '<div class="toast-progress">' +
          '<div class="toast-progress-bar" style="animation-duration:' + duration + 'ms"></div>' +
        '</div>';

      this.container.appendChild(toast);

      toast.querySelector('.toast-close').addEventListener('click', function() {
        removeToastEl(toast);
      });

      if (options.actionText && options.actionCallback) {
        var actionBtn = toast.querySelector('[data-toast-action]');
        if (actionBtn) {
          actionBtn.addEventListener('click', function() {
            options.actionCallback();
            removeToastEl(toast);
          });
        }
      }

      var autoTimer;
      function startTimer() { autoTimer = setTimeout(function() { removeToastEl(toast); }, duration); }
      function pauseTimer() { clearTimeout(autoTimer); }
      toast.addEventListener('mouseenter', pauseTimer);
      toast.addEventListener('mouseleave', startTimer);
      startTimer();

      var allToasts = this.container.querySelectorAll('.toast-notification');
      if (allToasts.length > 4) removeToastEl(allToasts[0]);

      return toast;
    }
  };

  function removeToastEl(toast) {
    if (!toast || toast.classList.contains('toast-removing')) return;
    toast.classList.add('toast-removing');
    toast.addEventListener('animationend', function() {
      if (toast.parentNode) toast.remove();
    }, { once: true });
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 500);
  }

  function showToast(message, type, options) { return Toast.show(message, type, options); }
  window.showToast = showToast;

  var Utils = {
    generateStars: function(rating) {
      rating = parseFloat(rating) || 0;
      var html = '<div class="stars">';
      for (var i = 1; i <= 5; i++) {
        if      (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
        else if (i - rating < 1)          html += '<i class="fas fa-star-half-alt"></i>';
        else                              html += '<i class="far fa-star"></i>';
      }
      return html + '</div>';
    },

    formatCurrency: function(a) {
      return '$' + parseFloat(a || 0).toFixed(2);
    },

    formatDate: function(d, f) {
      var date = new Date(d);
      var opts = (f === 'short')
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'long',  day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', opts);
    },

    isValidEmail: function(e) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    },

    generateOrderNumber: function() {
      return 'TW-' + Date.now().toString(36).toUpperCase() +
             '-'   + Math.random().toString(36).substr(2, 4).toUpperCase();
    },

    getInitials: function(name) {
      if (!name) return '?';
      var p = name.trim().split(' ');
      return p.length === 1
        ? p[0].charAt(0).toUpperCase()
        : (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();
    },

    getAvatarColor: function(name) {
      var c = [
        ['#667eea','#764ba2'], ['#f093fb','#f5576c'], ['#4facfe','#00f2fe'],
        ['#43e97b','#38f9d7'], ['#fa709a','#fee140'], ['#a8edea','#fed6e3'],
        ['#ff9a9e','#fecfef'], ['#ffecd2','#fcb69f']
      ];
      return c[name ? name.charCodeAt(0) % c.length : 0];
    }
  };

  function addToCart(idOrProduct, qty) {
    var id, product;

    if (typeof idOrProduct === 'object' && idOrProduct !== null && idOrProduct.id) {
      id      = parseInt(idOrProduct.id);
      product = idOrProduct;
      qty     = parseInt(qty) || 1;
    } else {
      id      = parseInt(idOrProduct);
      qty     = parseInt(qty) || 1;
      product = null;
    }

    if (isNaN(id) || id <= 0) {
      console.error('addToCart: Invalid product ID:', idOrProduct);
      showToast('Invalid product!', 'error');
      return false;
    }

    if (!product || !product.name || !product.price) {
      product = findProductById(id);
    }

    if (!product) {
      console.error('addToCart FAILED: Product ID ' + id + ' not found in ANY source.');
      showToast('Product not found! Please refresh the page.', 'error');
      return false;
    }

    if (!product.price || product.price <= 0) {
      showToast('Invalid product data!', 'error');
      return false;
    }

    var existing = AppState.cart.find(function(c) { return parseInt(c.id) === id; });

    if (existing) {
      existing.qty          += qty;
      existing.name          = existing.name          || product.name;
      existing.price         = product.price;
      existing.originalPrice = product.originalPrice  || existing.originalPrice || null;
      existing.image         = product.image          || existing.image         || '';
      existing.category      = product.category       || existing.category      || '';
      existing.brand         = product.brand          || existing.brand         || '';

      showToast('<strong>' + product.name + '</strong> quantity updated to ' + existing.qty + '!', 'cart', {
        title:          'Cart Updated!',
        actionText:     'View Cart',
        actionCallback: function() { openCartTab(); }
      });
    } else {
      AppState.cart.push({
        id:            id,
        qty:           qty,
        name:          product.name,
        price:         product.price,
        originalPrice: product.originalPrice || null,
        image:         product.image         || '',
        category:      product.category      || '',
        brand:         product.brand         || '',
        description:   product.description   || '',
        rating:        product.rating        || 0,
        reviews:       product.reviews       || 0,
        features:      product.features      || []
      });

      showToast('<strong>' + product.name + '</strong> added to cart!', 'cart', {
        title:          'Added to Cart!',
        actionText:     'View Cart',
        actionCallback: function() { openCartTab(); }
      });
    }

    AppState.save();
    refreshUI();
    renderCart();
    updateProductButtons(id);
    animateCartIcon();
    return true;
  }

  function removeFromCart(id) {
    id = parseInt(id);
    var item = AppState.cart.find(function(c) { return parseInt(c.id) === id; });
    var name = item ? item.name : '';
    if (!name) {
      var product = findProductById(id);
      name = product ? product.name : 'Item';
    }
    AppState.cart = AppState.cart.filter(function(c) { return parseInt(c.id) !== id; });
    AppState.save();
    refreshUI();
    renderCart();
    updateProductButtons(id);
    showToast('<strong>' + name + '</strong> removed from cart', 'warning', { title: 'Removed' });
  }

  function updateCartQty(id, delta) {
    id = parseInt(id);
    var item = AppState.cart.find(function(c) { return parseInt(c.id) === id; });
    if (!item) return;
    item.qty += parseInt(delta);
    if (item.qty < 1)  { removeFromCart(id); return; }
    if (item.qty > 99) { item.qty = 99; showToast('Maximum quantity is 99', 'warning'); }
    AppState.save();
    refreshUI();
    renderCart();
  }

  function setCartQty(id, newQty) {
    id     = parseInt(id);
    newQty = parseInt(newQty);
    if (isNaN(newQty) || newQty < 1) { removeFromCart(id); return; }
    if (newQty > 99) newQty = 99;
    var item = AppState.cart.find(function(c) { return parseInt(c.id) === id; });
    if (!item) return;
    item.qty = newQty;
    AppState.save();
    refreshUI();
    renderCart();
  }

  function clearCart() {
    if (AppState.cart.length === 0) { showToast('Cart is already empty!', 'info'); return; }
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    var ids = AppState.cart.map(function(c) { return c.id; });
    AppState.cart = [];
    AppState.save();
    refreshUI();
    renderCart();
    ids.forEach(function(id) { updateProductButtons(id); });
    showToast('Cart cleared', 'info', { title: 'Cart Cleared' });
  }

  function renderCart() {
    var container = document.getElementById('cartContent');
    var totalDiv  = document.getElementById('cartTotal');
    if (!container) return;

    updateCartBadge();
    updateWishlistBadge();

    if (!AppState.cart || AppState.cart.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon"><i class="fas fa-shopping-cart"></i></div>' +
          '<h5>Your cart is empty</h5>' +
          '<p>Browse our products and add items to your cart!</p>' +
          '<a href="product.html" class="btn btn-primary btn-sm mt-2">' +
            '<i class="fas fa-shopping-bag me-2"></i>Start Shopping</a>' +
        '</div>';
      if (totalDiv) totalDiv.style.display = 'none';
      return;
    }

    var html      = '<div class="cart-items-list">';
    var subtotal  = 0;
    var totalItems = 0;

    AppState.cart.forEach(function(cartItem, index) {
      var product   = findProductById(cartItem.id);
      var name      = (product && product.name)          ? product.name          : (cartItem.name          || 'Product');
      var price     = (product && product.price)         ? product.price         : (cartItem.price         || 0);
      var origPrice = (product && product.originalPrice) ? product.originalPrice : (cartItem.originalPrice || null);
      var image     = (product && product.image)         ? product.image         : (cartItem.image         || '');
      var category  = (product && product.category)      ? product.category      : (cartItem.category      || '');
      var brand     = (product && product.brand)         ? product.brand         : (cartItem.brand         || '');

      var qty         = parseInt(cartItem.qty) || 1;
      var lineTotal   = price * qty;
      var hasDiscount = origPrice && origPrice > price;
      var discount    = hasDiscount ? Math.round((1 - price / origPrice) * 100) : 0;

      subtotal   += lineTotal;
      totalItems += qty;

      var placeholder = 'https://via.placeholder.com/80x80/1a1a2e/8a2be2?text=' +
                        encodeURIComponent(name.charAt(0));

      html +=
        '<div class="cart-item" data-id="' + cartItem.id + '" ' +
             'style="animation:slideInLeft 0.3s ease ' + (index * 0.05) + 's both;">' +
          '<div class="cart-item-image">' +
            '<img src="' + image + '" alt="' + name + '" ' +
              'onerror="this.onerror=null;this.src=\'' + placeholder + '\'">' +
            (hasDiscount ? '<span class="cart-discount-tag">-' + discount + '%</span>' : '') +
          '</div>' +
          '<div class="cart-item-details">' +
            (brand ? '<span class="cart-item-brand">'    + brand    + '</span>' : '') +
            '<h6 class="cart-item-name">'     + name     + '</h6>' +
            '<p class="cart-item-category">'  + category + '</p>' +
            '<div class="cart-item-price-row">' +
              '<span class="cart-item-price">' + Utils.formatCurrency(price) + '</span>' +
              (hasDiscount ? '<span class="cart-item-original">' + Utils.formatCurrency(origPrice) + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="cart-item-actions">' +
            '<div class="cart-qty-controls">' +
              '<button type="button" class="qty-btn" onclick="updateCartQty(' + cartItem.id + ',-1)"' +
                (qty <= 1 ? ' disabled' : '') + ' aria-label="Decrease"><i class="fas fa-minus"></i></button>' +
              '<input type="number" class="qty-value-input" value="' + qty + '" min="1" max="99" ' +
                'onchange="setCartQty(' + cartItem.id + ',parseInt(this.value))" ' +
                'onclick="this.select()" aria-label="Quantity">' +
              '<button type="button" class="qty-btn" onclick="updateCartQty(' + cartItem.id + ',1)" ' +
                'aria-label="Increase"><i class="fas fa-plus"></i></button>' +
            '</div>' +
            '<div class="cart-item-line-total">' +
              '<span class="line-total-label">Total</span>' +
              '<span class="line-total-value">' + Utils.formatCurrency(lineTotal) + '</span>' +
            '</div>' +
            '<button type="button" class="btn-remove" onclick="removeFromCart(' + cartItem.id + ')" ' +
              'title="Remove ' + name + '" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>' +
          '</div>' +
        '</div>';
    });

    html += '</div>';
    container.innerHTML = html;

    if (totalDiv) {
      if (totalItems === 0) { totalDiv.style.display = 'none'; return; }

      var shipping   = subtotal >= 100 ? 0 : 9.99;
      var tax        = subtotal * 0.08;
      var grandTotal = subtotal + shipping + tax;

      var el = function(elId) { return document.getElementById(elId); };
      if (el('cartSubtotal'))    el('cartSubtotal').textContent = Utils.formatCurrency(subtotal);
      if (el('cartShipping')) {
        el('cartShipping').innerHTML = (shipping === 0)
          ? '<span class="free-shipping"><i class="fas fa-check-circle me-1"></i>FREE</span>'
          : Utils.formatCurrency(shipping);
      }
      if (el('cartTax'))         el('cartTax').textContent         = Utils.formatCurrency(tax);
      if (el('cartTotalAmount')) el('cartTotalAmount').textContent  = Utils.formatCurrency(grandTotal);
      totalDiv.style.display = 'block';
    }
  }

  function openCartTab() {
    var modalEl = document.getElementById('profileModal');
    if (!modalEl) return;
    var m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    m.show();
    setTimeout(function() {
      var t = document.getElementById('cart-tab');
      if (t) new bootstrap.Tab(t).show();
    }, 300);
  }

  function toggleWishlist(id) {
    id = parseInt(id);
    var product = findProductById(id);
    var name    = product ? product.name : 'Product';

    var idx = AppState.wishlist.indexOf(id);
    if (idx > -1) {
      AppState.wishlist.splice(idx, 1);
      showToast('<strong>' + name + '</strong> removed from wishlist', 'warning', { title: 'Removed' });
    } else {
      AppState.wishlist.push(id);
      showToast('<strong>' + name + '</strong> added to wishlist!', 'info', {
        title:          'Added to Wishlist!',
        actionText:     'View Wishlist',
        actionCallback: function() { openWishlistTab(); }
      });
    }
    AppState.save();
    refreshUI();
    updateProductButtons(id);
    renderWishlist();
  }

  function clearWishlist() {
    if (AppState.wishlist.length === 0) { showToast('Wishlist is already empty!', 'info'); return; }
    var ids = AppState.wishlist.slice();
    AppState.wishlist = [];
    AppState.save();
    refreshUI();
    renderWishlist();
    ids.forEach(function(id) { updateProductButtons(id); });
    showToast('Wishlist cleared', 'info', { title: 'Wishlist Cleared' });
  }

  function addAllWishlistToCart() {
    if (AppState.wishlist.length === 0) { showToast('Wishlist is empty!', 'warning'); return; }
    var added = 0;
    AppState.wishlist.forEach(function(id) {
      var product = findProductById(id);
      if (!product) return;
      var existing = AppState.cart.find(function(c) { return parseInt(c.id) === id; });
      if (existing) {
        existing.qty++;
      } else {
        AppState.cart.push({
          id: id, qty: 1, name: product.name, price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.image || '', category: product.category || '', brand: product.brand || ''
        });
      }
      added++;
    });
    AppState.wishlist = [];
    AppState.save();
    refreshUI();
    renderCart();
    renderWishlist();
    showToast('<strong>' + added + ' item(s)</strong> moved to cart!', 'cart', {
      title:          'All Moved to Cart!',
      actionText:     'View Cart',
      actionCallback: function() {
        var t = document.getElementById('cart-tab');
        if (t) new bootstrap.Tab(t).show();
      }
    });
  }

  function renderWishlist() {
    var container  = document.getElementById('wishlistContent');
    var actionsDiv = document.getElementById('wishlistActions');
    if (!container) return;
    updateWishlistBadge();

    if (AppState.wishlist.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon"><i class="fas fa-heart"></i></div>' +
          '<h5>Your wishlist is empty</h5>' +
          '<p>Click the heart on products you love!</p>' +
        '</div>';
      if (actionsDiv) actionsDiv.style.display = 'none';
      return;
    }

    var html = '<div class="wishlist-items-list">';
    AppState.wishlist.forEach(function(id) {
      var p = findProductById(id);
      if (!p) return;
      var inCart = AppState.cart.some(function(c) { return parseInt(c.id) === id; });
      html +=
        '<div class="wishlist-item">' +
          '<div class="wishlist-item-image"><img src="' + (p.image || '') + '" alt="' + p.name + '"></div>' +
          '<div class="wishlist-item-details">' +
            (p.brand ? '<span class="wishlist-item-brand">' + p.brand + '</span>' : '') +
            '<h6 class="wishlist-item-name">'  + p.name + '</h6>' +
            '<div class="wishlist-item-price">' + Utils.formatCurrency(p.price) + '</div>' +
          '</div>' +
          '<div class="wishlist-item-actions">' +
            '<button class="btn btn-sm ' + (inCart ? 'btn-success' : 'btn-primary') + '" onclick="addToCart(' + p.id + ')">' +
              '<i class="fas ' + (inCart ? 'fa-check' : 'fa-cart-plus') + '"></i></button>' +
            '<button class="btn btn-sm btn-outline-danger" onclick="toggleWishlist(' + p.id + ')">' +
              '<i class="fas fa-times"></i></button>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
    if (actionsDiv) actionsDiv.style.display = 'block';
  }

  function openWishlistTab() {
    var modalEl = document.getElementById('profileModal');
    if (!modalEl) return;
    var m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    m.show();
    setTimeout(function() {
      var t = document.getElementById('wishlist-tab');
      if (t) new bootstrap.Tab(t).show();
    }, 300);
  }

  function refreshUI() { updateCartBadge(); updateWishlistBadge(); }

  function updateCartBadge() {
    var count     = AppState.getCartCount();
    var selectors = ['#cartBadge','#cartCount','.cart-badge','.navbar-cart-count','[data-cart-count]'];
    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.textContent  = count > 99 ? '99+' : count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    });
    var tabCount = document.getElementById('cartTabCount');
    if (tabCount) tabCount.textContent = count > 0 ? '(' + count + ')' : '';
  }

  function updateWishlistBadge() {
    var count     = AppState.wishlist.length;
    var selectors = ['#wishlistBadge','#wishlistCount','.wishlist-badge','[data-wishlist-count]'];
    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.textContent   = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    });
    var tabCount = document.getElementById('wishlistTabCount');
    if (tabCount) tabCount.textContent = count > 0 ? '(' + count + ')' : '';
  }
  function updateProductButtons(id) {
    id = parseInt(id);
    var cartBtn = document.getElementById('cartBtn' + id);
    var wishBtn = document.getElementById('wishBtn' + id);
    var inCart  = AppState.cart.some(function(c)     { return parseInt(c.id) === id; });
    var inWish  = AppState.wishlist.indexOf(id) > -1;

    if (cartBtn) {
      cartBtn.className = 'btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' w-100 btn-sm';
      cartBtn.innerHTML =
        '<i class="fas ' + (inCart ? 'fa-check' : 'fa-shopping-cart') + ' me-2"></i>' +
        (inCart ? 'In Cart' : 'Add to Cart');
    }

    if (wishBtn) {
      var wishIcon = wishBtn.querySelector('i');  
      if (inWish) {
        wishBtn.classList.add('wishlisted');
        if (wishIcon) { wishIcon.classList.remove('far'); wishIcon.classList.add('fas'); }
      } else {
        wishBtn.classList.remove('wishlisted');
        if (wishIcon) { wishIcon.classList.remove('fas'); wishIcon.classList.add('far'); }
      }
    }
  }

  function animateCartIcon() {
    document.querySelectorAll('.fa-shopping-cart, [data-cart-icon], #cartBadge').forEach(function(icon) {
      icon.classList.add('cart-bounce');
      setTimeout(function() { icon.classList.remove('cart-bounce'); }, 600);
    });
  }

  function generateProductCardHTML(product, index) {
    var p        = product;
    var discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    var starsHtml = Utils.generateStars(p.rating);
    var inWish   = AppState.wishlist.indexOf(p.id) > -1;
    var inCart   = AppState.cart.some(function(c) { return parseInt(c.id) === p.id; });

    return (
      '<div class="col-xl-3 col-lg-4 col-md-6 animate-slide-up" ' +
           'style="animation-delay:' + ((index || 0) * 0.06) + 's;">' +
        '<div class="product-card" ' +
             'data-brand="'         + (p.brand    || '') + '" ' +
             'data-category="'      + (p.category || '') + '" ' +
             'data-product-id="'    + p.id               + '" ' +
             'data-product-name="'  + p.name             + '" ' +
             'data-product-price="' + p.price            + '">' +
          '<div class="card">' +
            '<div class="product-img-wrap">' +
              (p.badge
                ? '<span class="product-badge ' + (p.badgeClass || p.badgeType || '') + '">' + p.badge + '</span>'
                : '') +
              '<img src="' + p.image + '" class="card-img-top" alt="' + p.name + '" loading="lazy">' +
              '<div class="product-actions">' +
                '<button class="product-action-btn ' + (inWish ? 'wishlisted' : '') + '" ' +
                  'onclick="event.stopPropagation();toggleWishlist(' + p.id + ')" ' +
                  'title="Wishlist" id="wishBtn' + p.id + '">' +
                  '<i class="fas fa-heart"></i></button>' +
                '<button class="product-action-btn" ' +
                  'onclick="event.stopPropagation();openProductModal(' + p.id + ')" ' +
                  'title="Quick View"><i class="fas fa-eye"></i></button>' +
              '</div>' +
            '</div>' +
            '<div class="card-body" onclick="openProductModal(' + p.id + ')">' +
              (p.brand ? '<div class="product-brand-row"><span class="brand-tag">' + p.brand + '</span></div>' : '') +
              '<div class="product-category-label">' + (p.category || '') + '</div>' +
              '<h5 class="card-title">' + p.name + '</h5>' +
              '<div class="product-rating">' + starsHtml +
                '<span class="rating-count">(' + (p.reviews || 0) + ')</span></div>' +
              '<p class="card-text">' + (p.description || '') + '</p>' +
              '<div class="product-price">' +
                '<span class="current-price">' + Utils.formatCurrency(p.price) + '</span>' +
                (p.originalPrice
                  ? '<span class="original-price">' + Utils.formatCurrency(p.originalPrice) + '</span>'
                  : '') +
                (discount > 0 ? '<span class="discount-badge">-' + discount + '%</span>' : '') +
              '</div>' +
            '</div>' +
            '<div style="padding:0 1.2rem 1.2rem;">' +
              '<button class="btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' w-100 btn-sm" ' +
                'id="cartBtn' + p.id + '" ' +
                'onclick="event.stopPropagation();addToCart(' + p.id + ')">' +
                '<i class="fas ' + (inCart ? 'fa-check' : 'fa-shopping-cart') + ' me-2"></i>' +
                (inCart ? 'In Cart' : 'Add to Cart') +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function openProductModal(id) {
    id = parseInt(id);
    var product = findProductById(id);
    if (!product) {
      showToast('Product not found!', 'error');
      return;
    }

    var modalId = 'productQuickViewModal';
    var existing = document.getElementById(modalId);
    if (existing) existing.remove();

    var discount  = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    var starsHtml = Utils.generateStars(product.rating);
    var inCart    = AppState.cart.some(function(c) { return parseInt(c.id) === id; });
    var inWish    = AppState.wishlist.indexOf(id) > -1;

    var featuresHtml = '';
    if (product.features && product.features.length) {
      featuresHtml = '<ul class="product-modal-features">' +
        product.features.map(function(f) {
          return '<li><i class="fas fa-check-circle me-2 text-success"></i>' + f + '</li>';
        }).join('') +
      '</ul>';
    }

    var modalHTML =
      '<div class="modal fade" id="' + modalId + '" tabindex="-1" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg modal-dialog-centered">' +
          '<div class="modal-content">' +
            '<div class="modal-header border-0 pb-0">' +
              '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '</div>' +
            '<div class="modal-body pt-0">' +
              '<div class="row g-4">' +
                '<div class="col-md-5 text-center">' +
                  '<img src="' + (product.image || '') + '" alt="' + product.name + '" ' +
                    'class="img-fluid rounded" style="max-height:320px;object-fit:contain;">' +
                  (product.badge
                    ? '<div class="mt-2"><span class="product-badge ' + (product.badgeClass || '') + '">' +
                        product.badge + '</span></div>'
                    : '') +
                '</div>' +
                '<div class="col-md-7">' +
                  (product.brand ? '<span class="brand-tag mb-2 d-inline-block">' + product.brand + '</span>' : '') +
                  '<h4 class="fw-bold mb-1">' + product.name + '</h4>' +
                  '<p class="text-muted small mb-2">' + (product.category || '') + '</p>' +
                  '<div class="d-flex align-items-center gap-2 mb-3">' +
                    starsHtml +
                    '<span class="text-muted small">(' + (product.reviews || 0) + ' reviews)</span>' +
                  '</div>' +
                  '<div class="product-price mb-3">' +
                    '<span class="current-price fs-4 fw-bold">' + Utils.formatCurrency(product.price) + '</span>' +
                    (product.originalPrice
                      ? '<span class="original-price ms-2">' + Utils.formatCurrency(product.originalPrice) + '</span>'
                      : '') +
                    (discount > 0
                      ? '<span class="discount-badge ms-2">-' + discount + '%</span>'
                      : '') +
                  '</div>' +
                  '<p class="mb-3">' + (product.description || '') + '</p>' +
                  featuresHtml +
                  '<div class="d-flex gap-2 mt-3">' +
                    '<button class="btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' flex-fill" ' +
                      'id="modalCartBtn' + id + '" ' +
                      'onclick="addToCart(' + id + ');updateModalCartBtn(' + id + ')">' +
                      '<i class="fas ' + (inCart ? 'fa-check' : 'fa-shopping-cart') + ' me-2"></i>' +
                      (inCart ? 'In Cart' : 'Add to Cart') +
                    '</button>' +
                    '<button class="btn ' + (inWish ? 'btn-danger' : 'btn-outline-danger') + '" ' +
                      'id="modalWishBtn' + id + '" ' +
                      'onclick="toggleWishlist(' + id + ');updateModalWishBtn(' + id + ')">' +
                      '<i class="fas fa-heart"></i>' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    var modalEl = document.getElementById(modalId);
    var bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();

    modalEl.addEventListener('hidden.bs.modal', function() {
      modalEl.remove();
    }, { once: true });
  }

  function updateModalCartBtn(id) {
    var btn    = document.getElementById('modalCartBtn' + id);
    var inCart = AppState.cart.some(function(c) { return parseInt(c.id) === id; });
    if (!btn) return;
    btn.className = 'btn ' + (inCart ? 'btn-success' : 'btn-primary') + ' flex-fill';
    btn.innerHTML =
      '<i class="fas ' + (inCart ? 'fa-check' : 'fa-shopping-cart') + ' me-2"></i>' +
      (inCart ? 'In Cart' : 'Add to Cart');
  }

  function updateModalWishBtn(id) {
    var btn    = document.getElementById('modalWishBtn' + id);
    var inWish = AppState.wishlist.indexOf(id) > -1;
    if (!btn) return;
    btn.className = 'btn ' + (inWish ? 'btn-danger' : 'btn-outline-danger');
  }

  window.updateModalCartBtn = updateModalCartBtn;
  window.updateModalWishBtn = updateModalWishBtn;

  var Auth = {
    getUsers:  function()      { try { return JSON.parse(localStorage.getItem('tw_users')) || []; } catch(e) { return []; } },
    saveUsers: function(u)     { localStorage.setItem('tw_users', JSON.stringify(u)); },
    findUser:  function(email) { return this.getUsers().find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); }); },

    login: function(email, password) {
      if (!email || !password)         return { success: false, message: 'Please fill in all fields' };
      if (!Utils.isValidEmail(email))  return { success: false, message: 'Please enter a valid email' };
      var existing = this.findUser(email);
      if (existing) {
        if (existing.password !== password) return { success: false, message: 'Incorrect password' };
        AppState.user = {
          id: existing.id, name: existing.name, email: existing.email,
          avatar: existing.avatar || null, joinDate: existing.joinDate,
          loggedIn: true, lastLogin: new Date().toISOString()
        };
      } else {
        var newU = {
          id: Date.now(), name: email.split('@')[0], email: email,
          password: password, joinDate: new Date().toISOString()
        };
        var users = this.getUsers(); users.push(newU); this.saveUsers(users);
        AppState.user = {
          id: newU.id, name: newU.name, email: newU.email,
          avatar: null, joinDate: newU.joinDate,
          loggedIn: true, lastLogin: new Date().toISOString()
        };
      }
      AppState.save();
      return { success: true, message: 'Welcome back, ' + AppState.user.name + '!' };
    },

    signup: function(name, email, password) {
      if (!name || !email || !password)  return { success: false, message: 'Please fill in all fields' };
      if (name.length < 2)               return { success: false, message: 'Name must be at least 2 characters' };
      if (!Utils.isValidEmail(email))    return { success: false, message: 'Please enter a valid email' };
      if (password.length < 6)           return { success: false, message: 'Password must be at least 6 characters' };
      if (this.findUser(email))          return { success: false, message: 'Email already registered. Please login.' };
      var newU = {
        id: Date.now(), name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, joinDate: new Date().toISOString()
      };
      var users = this.getUsers(); users.push(newU); this.saveUsers(users);
      AppState.user = {
        id: newU.id, name: newU.name, email: newU.email,
        avatar: null, joinDate: newU.joinDate,
        loggedIn: true, lastLogin: new Date().toISOString()
      };
      AppState.save();
      return { success: true, message: 'Account created! Welcome, ' + AppState.user.name + '!' };
    },

    logout: function() {
      AppState.user = null;
      AppState.save();
      updateAuthUI();
      showToast('Logged out successfully', 'info', { title: 'Logged Out' });
    },

    updateProfile: function(data) {
      if (!AppState.isLoggedIn()) return { success: false, message: 'Not logged in' };
      var users = this.getUsers();
      var idx   = users.findIndex(function(u) { return u.id === AppState.user.id; });
      if (idx > -1) {
        if (data.name !== undefined)   { users[idx].name   = data.name.trim(); AppState.user.name   = data.name.trim(); }
        if (data.avatar !== undefined) { users[idx].avatar = data.avatar;      AppState.user.avatar = data.avatar; }
        this.saveUsers(users);
        AppState.save();
        return { success: true, message: 'Profile updated!' };
      }
      return { success: false, message: 'User not found' };
    }
  };

  function updateAuthUI() {
    var loginTabItem   = document.getElementById('loginTabItem');
    var profileTabItem = document.getElementById('profileDataTabItem');
    if (AppState.isLoggedIn()) {
      if (loginTabItem)   loginTabItem.style.display   = 'none';
      if (profileTabItem) profileTabItem.style.display = 'block';
      renderProfile();
      showTab('profile-data-tab');
    } else {
      if (loginTabItem)   loginTabItem.style.display   = 'block';
      if (profileTabItem) profileTabItem.style.display = 'none';
      switchAuthForm('login');
      var pi = document.getElementById('profileInfo');
      if (pi) pi.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon"><i class="fas fa-user-lock"></i></div>' +
          '<h5>Please login to view your profile</h5>' +
          '<p>Create an account or login to access your profile.</p>' +
        '</div>';
    }
  }

  function switchAuthForm(form) {
    var lc = document.getElementById('loginFormContainer');
    var sc = document.getElementById('signupFormContainer');
    var fc = document.getElementById('forgotPasswordContainer');
    if (lc) lc.style.display = 'none';
    if (sc) sc.style.display = 'none';
    if (fc) fc.style.display = 'none';
    if      (form === 'signup' && sc) { sc.style.display = 'block'; sc.style.animation = 'authFadeIn 0.4s ease'; }
    else if (form === 'forgot' && fc) { fc.style.display = 'block'; fc.style.animation = 'authFadeIn 0.4s ease'; }
    else if (lc)                      { lc.style.display = 'block'; lc.style.animation = 'authFadeIn 0.4s ease'; }
  }

  function showForgotPassword() { switchAuthForm('forgot'); }

  function socialLogin(provider) {
    showToast('<strong>' + provider.charAt(0).toUpperCase() + provider.slice(1) +
              '</strong> login coming soon!', 'info');
  }

  function togglePassword(inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
      input.type = 'password';
      if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
  }

  function renderProfile() {
    var profileInfo = document.getElementById('profileInfo');
    if (!profileInfo || !AppState.user) return;
    var u          = AppState.user;
    var colors     = Utils.getAvatarColor(u.name);
    var initials   = Utils.getInitials(u.name);
    var joinDate   = Utils.formatDate(u.joinDate, 'short');
    var totalSpent = AppState.orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
    var tier       = totalSpent >= 1000 ? 'Gold' : totalSpent >= 500 ? 'Silver' : 'Bronze';
    var tierIcon   = tier === 'Gold' ? 'fa-crown' : tier === 'Silver' ? 'fa-medal' : 'fa-award';
    var tierColor  = tier === 'Gold' ? '#FFD700'  : tier === 'Silver' ? '#C0C0C0'  : '#CD7F32';

    profileInfo.innerHTML =
      '<div class="profile-container">' +
        '<div class="profile-header">' +
          '<div class="profile-avatar" style="background:linear-gradient(135deg,' + colors[0] + ',' + colors[1] + ')">' +
            (u.avatar
              ? '<img src="' + u.avatar + '" alt="Avatar">'
              : '<span>' + initials + '</span>') +
            '<button class="avatar-edit-btn" onclick="editAvatar()" title="Change Avatar">' +
              '<i class="fas fa-camera"></i></button>' +
          '</div>' +
          '<div class="profile-info">' +
            '<h4 class="profile-name">'  + u.name  + '</h4>' +
            '<p class="profile-email"><i class="fas fa-envelope me-2"></i>' + u.email + '</p>' +
            '<div class="profile-tier">' +
              '<i class="fas ' + tierIcon + '" style="color:' + tierColor + '"></i>' +
              '<span>' + tier + ' Member</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="profile-stats">' +
          '<div class="stat-card"><div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>' +
            '<div class="stat-value">' + AppState.getCartCount()       + '</div><div class="stat-label">Cart</div></div>' +
          '<div class="stat-card"><div class="stat-icon"><i class="fas fa-heart"></i></div>' +
            '<div class="stat-value">' + AppState.wishlist.length      + '</div><div class="stat-label">Wishlist</div></div>' +
          '<div class="stat-card"><div class="stat-icon"><i class="fas fa-box"></i></div>' +
            '<div class="stat-value">' + AppState.orders.length        + '</div><div class="stat-label">Orders</div></div>' +
          '<div class="stat-card"><div class="stat-icon"><i class="fas fa-coins"></i></div>' +
            '<div class="stat-value">' + Math.floor(totalSpent * 10)   + '</div><div class="stat-label">Points</div></div>' +
        '</div>' +
        '<div class="profile-details-grid">' +
          '<div class="detail-item"><i class="fas fa-calendar-alt"></i>' +
            '<div><span class="detail-label">Member Since</span>' +
            '<span class="detail-value">' + joinDate + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="profile-actions">' +
          '<button class="btn btn-outline-primary"   onclick="editProfile()">' +
            '<i class="fas fa-edit me-2"></i>Edit Profile</button>' +
          '<button class="btn btn-outline-secondary" onclick="viewOrderHistory()">' +
            '<i class="fas fa-history me-2"></i>Orders</button>' +
          '<button class="btn btn-outline-danger"    onclick="logout()">' +
            '<i class="fas fa-sign-out-alt me-2"></i>Logout</button>' +
        '</div>' +
      '</div>';
  }

  function editProfile() {
    if (!AppState.isLoggedIn()) return;
    var pi = document.getElementById('profileInfo');
    if (!pi) return;
    var u = AppState.user;
    var c = Utils.getAvatarColor(u.name);
    var initials = Utils.getInitials(u.name);
    pi.innerHTML =
      '<div class="profile-edit-container">' +
        '<h5 class="mb-4"><i class="fas fa-edit me-2"></i>Edit Profile</h5>' +
        '<form id="editProfileForm">' +
          '<div class="text-center mb-4">' +
            '<div class="profile-avatar mx-auto" style="background:linear-gradient(135deg,' + c[0] + ',' + c[1] + ')">' +
              (u.avatar ? '<img src="' + u.avatar + '">' : '<span>' + initials + '</span>') +
            '</div>' +
            '<button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="editAvatar()">' +
              '<i class="fas fa-camera me-1"></i>Change Photo</button>' +
          '</div>' +
          '<div class="mb-3"><label class="form-label">Full Name</label>' +
            '<input type="text" class="form-control" id="editName" value="' + u.name + '" required minlength="2"></div>' +
          '<div class="mb-3"><label class="form-label">Email</label>' +
            '<input type="email" class="form-control" value="' + u.email + '" disabled>' +
            '<small class="text-muted">Email cannot be changed</small></div>' +
          '<div class="d-flex gap-2">' +
            '<button type="submit" class="btn btn-primary flex-fill"><i class="fas fa-save me-2"></i>Save</button>' +
            '<button type="button" class="btn btn-outline-secondary" onclick="renderProfile()">' +
              '<i class="fas fa-times me-2"></i>Cancel</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    document.getElementById('editProfileForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var n = document.getElementById('editName').value.trim();
      if (n.length >= 2) {
        var r = Auth.updateProfile({ name: n });
        showToast(r.message, r.success ? 'success' : 'error');
        if (r.success) renderProfile();
      }
    });
  }

  function editAvatar() {
    var avatars = [
      null,
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face'
    ];
    var idx = avatars.indexOf(AppState.user.avatar);
    Auth.updateProfile({ avatar: avatars[(idx + 1) % avatars.length] });
    renderProfile();
    showToast('Avatar updated!', 'success');
  }

  function viewOrderHistory() {
    var pi = document.getElementById('profileInfo');
    if (!pi) return;
    var orders = AppState.orders.slice().reverse();
    var html =
      '<div class="order-history-container">' +
        '<div class="order-history-header">' +
          '<h5><i class="fas fa-history me-2"></i>Order History</h5>' +
          '<button class="btn btn-sm btn-outline-primary" onclick="renderProfile()">' +
            '<i class="fas fa-arrow-left me-1"></i>Back</button>' +
        '</div>';

    if (orders.length === 0) {
      html +=
        '<div class="empty-state">' +
          '<div class="empty-state-icon"><i class="fas fa-box-open"></i></div>' +
          '<h5>No orders yet</h5><p>Your order history will appear here.</p>' +
        '</div>';
    } else {
      html += '<div class="orders-list-full">';
      orders.forEach(function(o) {
        var sc         = o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'info' : 'warning';
        var statusIcon = o.status === 'Delivered' ? 'fa-check-circle' : o.status === 'Shipped' ? 'fa-truck' : 'fa-clock';
        html +=
          '<div class="order-card">' +
            '<div class="order-card-header">' +
              '<div><span class="order-id">#'   + o.id + '</span>' +
                '<span class="order-date">' + Utils.formatDate(o.date) + '</span></div>' +
              '<span class="order-status status-' + sc + '">' +
                '<i class="fas ' + statusIcon + ' me-1"></i>' + o.status + '</span>' +
            '</div>' +
            '<div class="order-card-items">' +
              (o.items || []).slice(0, 3).map(function(i) {
                return '<span class="order-item-tag">' + i.name + ' x' + i.qty + '</span>';
              }).join('') +
              ((o.items && o.items.length > 3)
                ? '<span class="order-item-more">+' + (o.items.length - 3) + ' more</span>'
                : '') +
            '</div>' +
            '<div class="order-card-footer">' +
              '<span class="order-total">Total: ' + Utils.formatCurrency(o.total) + '</span>' +
            '</div>' +
          '</div>';
      });
      html += '</div>';
    }
    pi.innerHTML = html + '</div>';
  }

  function processCheckout() {
    if (AppState.cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }
    if (!AppState.isLoggedIn()) {
      showToast('Please login to checkout', 'warning', { title: 'Login Required' });
      var modalEl = document.getElementById('profileModal');
      if (modalEl) {
        var m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        m.show();
        setTimeout(function() { showTab('login-tab'); }, 300);
      }
      return;
    }

    var btn         = document.getElementById('checkoutBtn');
    var originalHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...'; btn.disabled = true; }

    var subtotal = AppState.getCartTotal();
    var shipping = subtotal >= 100 ? 0 : 9.99;
    var tax      = subtotal * 0.08;
    var total    = subtotal + shipping + tax;

    setTimeout(function() {
      var order = {
        id:       Utils.generateOrderNumber(),
        date:     new Date().toISOString(),
        items:    AppState.cart.map(function(c) {
          var p = findProductById(c.id);
          return { id: c.id, name: p ? p.name : (c.name || 'Item'), qty: c.qty, price: p ? p.price : (c.price || 0) };
        }),
        subtotal: subtotal,
        shipping: shipping,
        tax:      tax,
        total:    total,
        status:   'Processing'
      };

      AppState.orders.push(order);
      var ids = AppState.cart.map(function(c) { return c.id; });
      AppState.cart = [];
      AppState.save();
      refreshUI();
      renderCart();
      ids.forEach(function(id) { updateProductButtons(id); });

      var orderEl = document.getElementById('orderNumber');
      if (orderEl) orderEl.textContent = order.id;
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }

      var pm = document.getElementById('profileModal');
      if (pm) { var inst = bootstrap.Modal.getInstance(pm); if (inst) inst.hide(); }

      setTimeout(function() {
        var cm = document.getElementById('checkoutModal');
        if (cm) new bootstrap.Modal(cm).show();
      }, 400);

      showToast('Order <strong>#' + order.id + '</strong> placed!', 'success', {
        title: 'Order Confirmed!', duration: 6000
      });
    }, 2000);
  }

  function updatePasswordStrengthUI(pw) {
    var container = document.getElementById('passwordStrengthContainer');
    var fill      = document.getElementById('passwordStrengthFill');
    var label     = document.getElementById('passwordStrengthLabel');
    if (!fill || !label) return;

    if (pw.length === 0) { if (container) container.classList.remove('active'); return; }
    if (container) container.classList.add('active');

    var score  = 0;
    var checks = {
      length:  pw.length >= 6,
      upper:   /[A-Z]/.test(pw),
      number:  /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw)
    };

    Object.keys(checks).forEach(function(k) {
      if (checks[k]) score++;
      var el = document.getElementById('req-' + k);
      if (el) {
        if (checks[k]) el.classList.add('met'); else el.classList.remove('met');
        el.style.color = checks[k] ? '#22c55e' : '';
        var ic = el.querySelector('i');
        if (ic) ic.className = 'fas ' + (checks[k] ? 'fa-check-circle' : 'fa-circle');
      }
    });

    var levels = [
      { w: '25%',  c: '#ef4444', t: 'Weak'   },
      { w: '50%',  c: '#f59e0b', t: 'Fair'   },
      { w: '75%',  c: '#22c55e', t: 'Good'   },
      { w: '100%', c: '#16a34a', t: 'Strong' }
    ];
    var lv = levels[Math.min(Math.max(score - 1, 0), 3)];
    fill.style.width      = lv.w;
    fill.style.background = lv.c;
    label.textContent     = lv.t;
    label.style.color     = lv.c;
  }

  function showTab(tabId) {
    var t = document.getElementById(tabId);
    if (t && typeof bootstrap !== 'undefined') new bootstrap.Tab(t).show();
  }

  function clearNotifications() {
    var b = document.getElementById('notificationsBody');
    if (b) b.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-state-icon"><i class="fas fa-bell-slash"></i></div>' +
        '<h5>All caught up!</h5>' +
      '</div>';
    var badge = document.querySelector('.notification-badge');
    if (badge) badge.style.display = 'none';
    showToast('Notifications cleared', 'info');
  }

  function scrollToAndFilter(cat) {
    window.location.href = 'product.html?category=' + encodeURIComponent(cat);
  }

  function filterByBrand(brand) {
    document.querySelectorAll('.product-card').forEach(function(card) {
      card.parentElement.style.display =
        (!brand || brand === 'all' || card.dataset.brand === brand) ? '' : 'none';
    });
  }

  function filterByCategory(cat) {
    document.querySelectorAll('.product-card').forEach(function(card) {
      card.parentElement.style.display =
        (!cat || cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  }

  function initApp() {
    Toast.init();
    refreshUI();
    updateAuthUI();
    renderCart();
    renderWishlist();

    var profileModal = document.getElementById('profileModal');
    if (profileModal) {
      profileModal.addEventListener('show.bs.modal', function() {
        updateAuthUI(); renderCart(); renderWishlist();
      });
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value.trim();
        var pw    = document.getElementById('loginPassword').value;
        if (!email || !pw) { showToast('Please fill in all fields', 'error'); return; }
        var btn  = loginForm.querySelector('button[type="submit"]');
        var orig = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...'; btn.disabled = true; }
        setTimeout(function() {
          var r = Auth.login(email, pw);
          if (r.success) {
            showToast(r.message, 'success', { title: 'Welcome!' });
            loginForm.reset();
            updateAuthUI();
          } else {
            showToast(r.message, 'error');
          }
          if (btn) { btn.innerHTML = orig; btn.disabled = false; }
        }, 800);
      });
    }

    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var name  = document.getElementById('signupName').value.trim();
        var email = document.getElementById('signupEmail').value.trim();
        var pw    = document.getElementById('signupPassword').value;
        var cpw   = document.getElementById('signupConfirmPassword');
        var agree = document.getElementById('agreeTerms');
        if (!name || !email || !pw)          { showToast('Please fill in all fields', 'error');              return; }
        if (cpw && cpw.value !== pw)         { showToast('Passwords do not match', 'error');                 return; }
        if (agree && !agree.checked)         { showToast('Please agree to Terms of Service', 'warning');     return; }
        var btn  = signupForm.querySelector('button[type="submit"]');
        var orig = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating account...'; btn.disabled = true; }
        setTimeout(function() {
          var r = Auth.signup(name, email, pw);
          if (r.success) {
            showToast(r.message, 'success', { title: 'Account Created!' });
            signupForm.reset();
            var sc = document.getElementById('passwordStrengthContainer');
            if (sc) sc.classList.remove('active');
            updateAuthUI();
          } else {
            showToast(r.message, 'error');
          }
          if (btn) { btn.innerHTML = orig; btn.disabled = false; }
        }, 1000);
      });

      var pwInput = document.getElementById('signupPassword');
      if (pwInput) pwInput.addEventListener('input', function() { updatePasswordStrengthUI(this.value); });
    }

    var forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('forgotEmail').value.trim();
        if (!Utils.isValidEmail(email)) { showToast('Please enter a valid email', 'error'); return; }
        var btn  = forgotForm.querySelector('button[type="submit"]');
        var orig = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'; btn.disabled = true; }
        setTimeout(function() {
          showToast('Password reset link sent to ' + email, 'success', { title: 'Email Sent!' });
          forgotForm.reset();
          if (btn) { btn.innerHTML = orig; btn.disabled = false; }
          setTimeout(function() { switchAuthForm('login'); }, 2000);
        }, 1500);
      });
    }

    var params = new URLSearchParams(window.location.search);
    var cat    = params.get('category');
    if (cat) setTimeout(function() { filterByCategory(cat); }, 100);

    console.log(
      'TechWave shared.js v2.5 loaded — ' + ALL_PRODUCTS.length + ' built-in products' +
      (window.TECHWAVE_PRODUCTS ? ' + ' + window.TECHWAVE_PRODUCTS.length + ' TECHWAVE_PRODUCTS' : '')
    );
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
  else initApp();

  window.ALL_PRODUCTS            = ALL_PRODUCTS;
  window.BRANDS                  = BRANDS;
  window.AppState                = AppState;
  window.Utils                   = Utils;
  window.showToast               = showToast;
  window.findProductById         = findProductById;
  window.generateProductCardHTML = generateProductCardHTML;
  window.addToCart               = addToCart;
  window.removeFromCart          = removeFromCart;
  window.updateCartQty           = updateCartQty;
  window.setCartQty              = setCartQty;
  window.clearCart               = clearCart;
  window.renderCart              = renderCart;
  window.openCartTab             = openCartTab;
  window.toggleWishlist          = toggleWishlist;
  window.clearWishlist           = clearWishlist;
  window.addAllWishlistToCart    = addAllWishlistToCart;
  window.renderWishlist          = renderWishlist;
  window.openWishlistTab         = openWishlistTab;
  window.openProductModal        = openProductModal;   
  window.processCheckout         = processCheckout;
  window.togglePassword          = togglePassword;
  window.switchAuthForm          = switchAuthForm;
  window.showForgotPassword      = showForgotPassword;
  window.socialLogin             = socialLogin;
  window.updateAuthUI            = updateAuthUI;
  window.renderProfile           = renderProfile;
  window.editProfile             = editProfile;
  window.editAvatar              = editAvatar;
  window.viewOrderHistory        = viewOrderHistory;
  window.logout                  = function() { Auth.logout(); };
  window.clearNotifications      = clearNotifications;
  window.scrollToAndFilter       = scrollToAndFilter;
  window.showTab                 = showTab;
  window.refreshUI               = refreshUI;
  window.filterByBrand           = filterByBrand;
  window.filterByCategory        = filterByCategory;
  window.animateCartIcon         = animateCartIcon;
  window.updateProductButtons    = updateProductButtons;
})();
