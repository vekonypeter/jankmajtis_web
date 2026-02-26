(function() {
  'use strict';

  // ========================
  //  NAVIGATION
  // ========================

  var openDropdown = null;

  function initNav() {
    // Desktop dropdown toggles
    document.querySelectorAll('[data-dropdown]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var targetId = btn.getAttribute('data-dropdown');
        var panel = document.getElementById(targetId);
        if (!panel) return;

        if (panel.classList.contains('is-open')) {
          closeDropdown(panel, btn);
        } else {
          closeAllDropdowns();
          openDropdownPanel(panel, btn);
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function() {
      closeAllDropdowns();
    });

    // Prevent dropdown panels from closing on click inside
    document.querySelectorAll('.site-nav__dropdown').forEach(function(panel) {
      panel.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });

    // Mobile burger
    var burger = document.querySelector('.site-nav__burger');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (burger && mobileMenu) {
      burger.addEventListener('click', function() {
        burger.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open');
        document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
      });
    }

    // Mobile sub-menu toggles
    document.querySelectorAll('[data-mobile-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetId = btn.getAttribute('data-mobile-toggle');
        var sub = document.getElementById(targetId);
        if (!sub) return;
        sub.classList.toggle('is-open');
      });
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992) {
        if (mobileMenu) mobileMenu.classList.remove('is-open');
        if (burger) burger.classList.remove('is-open');
        document.body.style.overflow = '';
        closeAllDropdowns();
      }
    });
  }

  function openDropdownPanel(panel, btn) {
    panel.classList.add('is-open');
    if (btn) btn.classList.add('site-nav__link--active');
    openDropdown = { panel: panel, btn: btn };
  }

  function closeDropdown(panel, btn) {
    panel.classList.remove('is-open');
    if (btn) btn.classList.remove('site-nav__link--active');
    openDropdown = null;
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.site-nav__dropdown.is-open').forEach(function(panel) {
      panel.classList.remove('is-open');
    });
    document.querySelectorAll('.site-nav__link--active').forEach(function(btn) {
      btn.classList.remove('site-nav__link--active');
    });
    openDropdown = null;
  }

  // ========================
  //  LIGHTBOX
  // ========================

  var lightboxOverlay = null;
  var lightboxImg = null;
  var lightboxCaption = null;
  var lightboxGroups = {};
  var currentGroup = null;
  var currentIndex = 0;

  function initLightbox() {
    // Build lightbox overlay
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML =
      '<button class="lightbox-overlay__close" aria-label="Bezárás">&times;</button>' +
      '<button class="lightbox-overlay__nav lightbox-overlay__nav--prev" aria-label="Előző">&#8249;</button>' +
      '<img class="lightbox-overlay__img" src="" alt="">' +
      '<button class="lightbox-overlay__nav lightbox-overlay__nav--next" aria-label="Következő">&#8250;</button>' +
      '<div class="lightbox-overlay__caption"></div>';
    document.body.appendChild(lightboxOverlay);

    lightboxImg = lightboxOverlay.querySelector('.lightbox-overlay__img');
    lightboxCaption = lightboxOverlay.querySelector('.lightbox-overlay__caption');

    // Close button
    lightboxOverlay.querySelector('.lightbox-overlay__close').addEventListener('click', closeLightbox);

    // Background click to close
    lightboxOverlay.addEventListener('click', function(e) {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    // Nav buttons
    lightboxOverlay.querySelector('.lightbox-overlay__nav--prev').addEventListener('click', function(e) {
      e.stopPropagation();
      navigateLightbox(-1);
    });
    lightboxOverlay.querySelector('.lightbox-overlay__nav--next').addEventListener('click', function(e) {
      e.stopPropagation();
      navigateLightbox(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightboxOverlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Collect lightbox items
    document.querySelectorAll('[data-lightbox-group]').forEach(function(el) {
      var group = el.getAttribute('data-lightbox-group');
      if (!lightboxGroups[group]) lightboxGroups[group] = [];
      lightboxGroups[group].push({
        href: el.getAttribute('href'),
        title: el.getAttribute('title') || ''
      });

      el.addEventListener('click', function(e) {
        e.preventDefault();
        currentGroup = group;
        currentIndex = lightboxGroups[group].indexOf(
          lightboxGroups[group].filter(function(item) { return item.href === el.getAttribute('href'); })[0]
        );
        showLightbox();
      });
    });
  }

  function showLightbox() {
    if (!currentGroup || !lightboxGroups[currentGroup]) return;
    var item = lightboxGroups[currentGroup][currentIndex];
    if (!item) return;

    lightboxImg.src = item.href;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;

    var navPrev = lightboxOverlay.querySelector('.lightbox-overlay__nav--prev');
    var navNext = lightboxOverlay.querySelector('.lightbox-overlay__nav--next');
    var groupLen = lightboxGroups[currentGroup].length;
    navPrev.style.display = groupLen > 1 ? '' : 'none';
    navNext.style.display = groupLen > 1 ? '' : 'none';

    lightboxOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function navigateLightbox(dir) {
    if (!currentGroup) return;
    var len = lightboxGroups[currentGroup].length;
    currentIndex = (currentIndex + dir + len) % len;
    showLightbox();
  }

  // ========================
  //  SCROLL ANIMATIONS
  // ========================

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      elements.forEach(function(el) {
        el.classList.add('is-visible');
      });
    }
  }

  // ========================
  //  ONE FORM
  // ========================

  function initOneForm() {
    var form = document.getElementById('oneForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!window.CryptoJS) {
        sendOneAlert("A belepteto szolgaltatas sajnos nem erheto el. Kerjuk probaja meg kesobb.");
        return;
      }

      var value = document.getElementById('onePassword').value;
      var hash = CryptoJS.MD5(value).toString();

      if (hash === "b777b38f200b690d8c15642d343f861e") {
        sendOneAlert();
        window.open("https://multimedia.one.hu/pdf/one/kozep-nagyvallalatok/egyeb/aol/CorporateArlista.pdf", "_blank");
      } else {
        sendOneAlert("Helytelen jelszo!");
      }
    });
  }

  function sendOneAlert(message) {
    var el = document.getElementById('oneAlert');
    if (el) el.textContent = message || '';
  }

  // ========================
  //  INIT
  // ========================

  document.addEventListener('DOMContentLoaded', function() {
    initNav();
    initLightbox();
    initScrollAnimations();
    initOneForm();
  });

})();
