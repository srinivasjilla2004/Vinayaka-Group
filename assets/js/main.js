/* ==========================================================================
   VINAYAKA GROUP OF COMPANIES — SHARED JAVASCRIPT
   ARC Group Style Navigation, Animations & Interactive Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* 0. Cinematic Opening Preloader (Full Black & Animated Logo) */
  const preloader = document.getElementById('sitePreloader');
  if (preloader) {
    const dismissPreloader = () => {
      if (preloader.classList.contains('fade-out')) return;
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 850);
    };

    // Auto dismiss after animation completes (1.85 seconds)
    setTimeout(dismissPreloader, 1850);

    // Allow user to click anywhere to dismiss immediately
    preloader.addEventListener('click', dismissPreloader);
  }

  /* 1. Dynamic Current Year */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* 2. Header Scroll Effect & Scroll-to-Top Button */
  const header = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 450) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  /* 3. Mobile Off-Canvas Drawer */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (mobileBtn) mobileBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (mobileBtn) mobileBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      if (drawer && drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  /* 4. Hero Carousel Slider (Home Page Only) */
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .slider-dot');
  const nextBtn = document.getElementById('nextSlideBtn');
  const prevBtn = document.getElementById('prevSlideBtn');
  const heroSlider = document.querySelector('.hero-slider');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5500);

    function showSlide(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentSlide = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    window.goToSlide = function(index) {
      clearInterval(slideInterval);
      showSlide(index);
      slideInterval = setInterval(nextSlide, 5500);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5500);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5500);
      });
    }

    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroSlider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5500));
    }
  }

  /* 5. Scroll Reveal Animations */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px"
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* 6. Animated Number Counters (ARC Group Style Stats) */
  let counted = false;
  const statsSection = document.querySelector('.stats-bar-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (!target) return;
            const duration = 1600;
            const stepTime = 30;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
                if (target === 50000) {
                  counter.textContent = '50K+';
                } else if (target === 25 || target === 6) {
                  counter.textContent = target + '+';
                } else {
                  counter.textContent = target;
                }
              } else {
                if (target === 50000) {
                  counter.textContent = Math.floor(current / 1000) + 'K+';
                } else {
                  counter.textContent = Math.floor(current) + (target > 5 ? '+' : '');
                }
              }
            }, stepTime);
          });
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }
});

/* ==========================================================================
   GLOBAL UTILITIES & INTERACTIVE CONTROLS
   ========================================================================== */

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileAccordion(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

/* Modal Handling */
const modal = document.getElementById('bookingModal');

function openBookingModal(itemName) {
  const modalEl = document.getElementById('bookingModal');
  if (!modalEl) return;
  const interestInput = document.getElementById('modalInterestItem');
  const titleInput = document.getElementById('modalTitle');
  if (interestInput) interestInput.value = itemName || 'General Enquiry';
  if (titleInput) {
    if (itemName && itemName.toLowerCase().includes('yamaha')) {
      titleInput.textContent = 'Book a Yamaha Test Ride';
    } else if (itemName && itemName.toLowerCase().includes('gopuram')) {
      titleInput.textContent = 'Gopuram Order Enquiry';
    } else if (itemName && itemName.toLowerCase().includes('c&f')) {
      titleInput.textContent = 'C&F Logistics Consultation';
    } else {
      titleInput.textContent = 'Connect with Vinayaka Group';
    }
  }
  modalEl.classList.add('active');
}

function closeBookingModal() {
  const modalEl = document.getElementById('bookingModal');
  if (modalEl) modalEl.classList.remove('active');
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBookingModal();
  });
}

function handleModalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modalCustomerName').value;
  const phone = document.getElementById('modalCustomerPhone').value;
  const item = document.getElementById('modalInterestItem').value;
  const branchEl = document.getElementById('modalBranch');
  const branch = branchEl ? branchEl.value : 'Main Branch';

  const message = encodeURIComponent(`Hello Vinayaka Group,\n\nName: ${name}\nPhone: ${phone}\nInterested in: ${item}\nBranch: ${branch}\n\nPlease confirm availability and details.`);
  
  let targetPhone = '919849150525';
  if (item.toLowerCase().includes('yamaha')) {
    targetPhone = '918886650040';
  } else if (item.toLowerCase().includes('gopuram') || window.location.pathname.includes('gopuram')) {
    targetPhone = '919281434830';
  }
  window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
  closeBookingModal();
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  const vertical = document.getElementById('contactVertical').value;
  const notes = document.getElementById('contactMessage').value;

  const message = encodeURIComponent(`Hello Vinayaka Group of Companies,\n\nName: ${name}\nContact: ${phone}\nVertical: ${vertical}\nMessage: ${notes}`);
  
  const targetPhone = vertical.toLowerCase().includes('yamaha') ? '918886650040' : '919849150525';
  window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
}

/* Yamaha Models Filter */
function filterModels(category) {
  const filterBtns = document.querySelectorAll('#yamahaFilters .filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    const btn = event.target.closest('.filter-btn');
    if (btn) btn.classList.add('active');
  }

  const modelCards = document.querySelectorAll('#modelsContainer .model-card');
  modelCards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    if (category === 'all' || cardCat.includes(category)) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 40);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 250);
    }
  });
}

/* Gopuram Products Filter */
function filterGopuramProducts(category) {
  const filterBtns = document.querySelectorAll('#gopuramFilters .filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    const btn = event.target.closest('.filter-btn');
    if (btn) btn.classList.add('active');
  }

  const productCards = document.querySelectorAll('#gopuramProductsContainer .product-card');
  productCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 40);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 250);
    }
  });
}

/* WhatsApp Quick Order for Gopuram */
function orderWhatsAppProduct(productName) {
  const msg = encodeURIComponent(`Hello Gopuram Pooja Store, I would like to order / enquire about "${productName}" from your catalog. Please share pack sizes and price details.`);
  window.open(`https://wa.me/919281434830?text=${msg}`, '_blank');
}

/* Open Gopuram WhatsApp Catalog directly */
function openGopuramCatalog() {
  window.open('https://wa.me/c/919281434830', '_blank');
}

/* Yamaha Showroom Network Locations Switcher */
const locations = [
  {
    title: "Vinayaka Yamaha Blue Square Showroom — Bhavanipuram (Main Branch)",
    address: "Main Road, Bhavanipuram, Vijayawada, Andhra Pradesh 520012.",
    phone: "Yamaha Showroom: 88866 50040 · 99599 69696",
    mapUrl: "https://maps.google.com/maps?q=Vinayaka%20Yamaha%2C%20Bhavanipuram%2C%20Vijayawada&t=&z=15&ie=UTF8&iwloc=&output=embed",
    extLink: "https://maps.app.goo.gl/LGT5Q8bSUp8ZAzZf8?g_st=iw"
  },
  {
    title: "Vinayaka Yamaha Showroom — Eluru Road",
    address: "Opposite BSNL Office, Eluru Road, Bhavanipuram, Vijayawada, Andhra Pradesh 520012.",
    phone: "Phone: 88866 50040 · 99599 69696",
    mapUrl: "https://maps.google.com/maps?q=Vinayaka%20Yamaha%20Eluru%20Road%20Vijayawada&z=14&output=embed",
    extLink: "https://www.google.com/maps/search/?api=1&query=Vinayaka+Yamaha+Eluru+Road+Vijayawada"
  },
  {
    title: "Vinayaka Yamaha Showroom — Ajith Singh Nagar",
    address: "Main Road, Ajith Singh Nagar, Vijayawada, Andhra Pradesh 520015.",
    phone: "Phone: 88866 50040 · 98491 50525",
    mapUrl: "https://maps.google.com/maps?q=Vinayaka%20Yamaha%20Ajith%20Singh%20Nagar%20Vijayawada&z=14&output=embed",
    extLink: "https://www.google.com/maps/search/?api=1&query=Vinayaka+Yamaha+Ajith+Singh+Nagar+Vijayawada"
  },
  {
    title: "Vinayaka Yamaha Showroom — Nandigama",
    address: "National Highway Bypass / Main Road, Nandigama, NTR District, Andhra Pradesh 521185.",
    phone: "Phone: 88866 50040 · 99599 69696",
    mapUrl: "https://maps.google.com/maps?q=Vinayaka%20Yamaha%20Nandigama%20Andhra%20Pradesh&z=14&output=embed",
    extLink: "https://www.google.com/maps/search/?api=1&query=Vinayaka+Yamaha+Nandigama+Andhra+Pradesh"
  }
];

function switchLocation(index) {
  const loc = locations[index];
  const titleEl = document.getElementById('locTitle');
  const addressEl = document.getElementById('locAddress');
  const phoneEl = document.getElementById('locPhone');
  const frameEl = document.getElementById('locMapFrame');
  const linkEl = document.getElementById('locMapLink');

  if (titleEl) titleEl.textContent = loc.title;
  if (addressEl) addressEl.textContent = loc.address;
  if (phoneEl) phoneEl.textContent = loc.phone;
  if (frameEl) frameEl.src = loc.mapUrl;
  if (linkEl) linkEl.href = loc.extLink;

  const tabs = document.querySelectorAll('#locationTabs .location-tab-btn');
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

/* ==========================================================================
   CALLIGRAPHIC "V" PAGE TRANSITION LOADER (HANDWRITING EFFECT)
   Exempts Home Page (index.html) as requested
   ========================================================================== */
function initPageTransitions() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isCurrentHome = currentPath === 'index.html' || currentPath === '';

  // 0. Completely exempt Home page from page transition overlay
  if (isCurrentHome) {
    return;
  }

  // 1. Inject transition overlay if not present on secondary pages
  let overlay = document.getElementById('pageTransitionOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.id = 'pageTransitionOverlay';
    overlay.innerHTML = `
      <div class="v-transition-container">
        <div class="v-transition-glow"></div>
        <svg class="v-transition-svg" viewBox="0 0 140 140" aria-label="Vinayaka Loading">
          <defs>
            <linearGradient id="vStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e02424" />
              <stop offset="45%" stop-color="#ff2e2e" />
              <stop offset="100%" stop-color="#ff6b00" />
            </linearGradient>
            <filter id="vStrokeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path class="v-stroke-base" d="M 30,52 C 24,34 40,14 54,16 C 58,17 48,46 42,70 C 34,98 25,120 28,126 C 31,130 40,126 48,116 C 68,90 96,48 122,16" />
          <path class="v-stroke-pen" filter="url(#vStrokeGlow)" d="M 30,52 C 24,34 40,14 54,16 C 58,17 48,46 42,70 C 34,98 25,120 28,126 C 31,130 40,126 48,116 C 68,90 96,48 122,16" />
        </svg>
        <div class="v-transition-text">VINAYAKA</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // 2. Hide on pageshow (including back/forward cache)
  window.addEventListener('pageshow', () => {
    if (overlay) overlay.classList.remove('active');
  });

  // 3. Attach click handler to page transition links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, JS, tel, mailto, whatsapp, target="_blank", or modifier keys
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:') || href.includes('wa.me')) {
      return;
    }
    if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
      return;
    }

    // Check if it's an internal HTML link
    const isHtmlPage = href.endsWith('.html') || href.includes('.html#') || href === '/' || href === 'index.html';
    const isSameHost = !href.startsWith('http://') && !href.startsWith('https://') || href.includes(window.location.host);

    if (isHtmlPage && isSameHost) {
      const cleanHref = href.split('#')[0];
      
      // Exempt navigating to Home page
      if (cleanHref === 'index.html' || cleanHref === '' || cleanHref === '/') {
        return;
      }

      // Don't trigger if linking to current page's own anchor
      if (cleanHref === currentPath && href.includes('#')) {
        return; // standard in-page smooth scroll
      }

      e.preventDefault();
      
      // Reset & trigger handwriting animation
      overlay.classList.remove('active');
      void overlay.offsetWidth; // force reflow
      overlay.classList.add('active');

      // Allow the V to write itself from left to right, then navigate smoothly
      setTimeout(() => {
        window.location.href = href;
      }, 580);
    }
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
  initPageTransitions();
}
