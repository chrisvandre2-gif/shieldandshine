/**
 * Shield & Shine - Main JavaScript
 * Performance-optimized with throttling, proper event handling, and accessibility
 */

(function() {
  'use strict';

  // Utility: Throttle function for performance
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function(...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Utility: Debounce function
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Mobile Navigation
  function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link, .nav-cta');
    const body = document.body;
    
    if (!menuToggle || !navLinks) return;

    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      menuToggle.setAttribute('aria-expanded', isOpen);
      navLinks.classList.toggle('active', isOpen);
      
      // Prevent background scroll when menu is open
      if (isOpen) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    }

    function closeMenu() {
      if (isOpen) {
        isOpen = false;
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        body.style.overflow = '';
      }
    }

    // Toggle menu on button click
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on links
    navLinksItems.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !e.target.closest('.nav-container')) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Handle resize events
    const handleResize = debounce(() => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    }, 250);

    window.addEventListener('resize', handleResize);
  }

  // Navigation Background Change on Scroll
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
      } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Parallax Effect with IntersectionObserver
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Only apply parallax on larger screens and if reduced motion is not preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;
    const heroHeight = hero.offsetHeight;
    const viewportHeight = window.innerHeight;

    function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      // Calculate progress (0 to 1) of hero scrolling out of view
      const progress = Math.min(Math.max(scrollTop / heroHeight, 0), 1);
      
      // Apply parallax and opacity
      if (progress <= 1) {
        const parallaxAmount = scrollTop * 0.4;
        const opacity = 1 - (progress * 0.8);
        
        hero.style.transform = `translateY(${parallaxAmount}px) translateZ(0)`;
        hero.style.opacity = opacity;
      }
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Intersection Observer for Animations
  function initAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.slide-up, .fade-in').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class with stagger delay if present
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll(
      '.service-card, .gallery-item, .contact-item, .process-item, .stat, .section-header'
    );

    animatedElements.forEach((el, index) => {
      // Add animation classes
      if (el.classList.contains('gallery-item') || el.classList.contains('service-card')) {
        el.classList.add('slide-up');
        // Add stagger delay for grid items
        const row = Math.floor(index / 3);
        const col = index % 3;
        el.dataset.delay = (row * 100) + (col * 50);
      } else {
        el.classList.add('fade-in');
        el.dataset.delay = index * 50;
      }
      
      observer.observe(el);
    });
  }

  // Square Booking Widget Fallback
  function initBookingFallback() {
    const widget = document.getElementById('square-booking-widget');
    const fallback = document.getElementById('booking-fallback');
    
    if (!widget || !fallback) return;

    // Check if Square widget loads
    let checkAttempts = 0;
    const maxAttempts = 10;
    
    const checkWidget = setInterval(() => {
      checkAttempts++;
      
      // Check if widget has loaded content
      if (widget.querySelector('iframe') || widget.children.length > 0) {
        clearInterval(checkWidget);
        return;
      }
      
      // Show fallback after max attempts
      if (checkAttempts >= maxAttempts) {
        clearInterval(checkWidget);
        fallback.classList.add('show');
      }
    }, 500);
  }

  // Smooth Scroll for Anchor Links
  function initSmoothScroll() {
    // Only for browsers that don't support scroll-behavior: smooth
    if ('scrollBehavior' in document.documentElement.style) {
      return;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const offset = 80; // Nav height
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Analytics Event Tracking
  function initAnalytics() {
    if (typeof gtag === 'undefined') return;

    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'phone_click', {
          'event_category': 'engagement',
          'event_label': link.href.replace('tel:', '')
        });
      });
    });

    // Track booking clicks
    document.querySelectorAll('a[href*="booking"], a[href*="square"], .nav-cta, .btn-primary').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'booking_intent', {
          'event_category': 'conversion',
          'event_label': link.textContent
        });
      });
    });

    // Track service card interactions
    document.querySelectorAll('.service-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        gtag('event', 'service_view', {
          'event_category': 'engagement',
          'event_label': serviceName,
          'value': index
        });
      });
    });

    // Track scroll depth
    let scrollDepths = [25, 50, 75, 100];
    let scrolledDepths = [];
    
    const trackScrollDepth = throttle(() => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !scrolledDepths.includes(depth)) {
          scrolledDepths.push(depth);
          gtag('event', 'scroll_depth', {
            'event_category': 'engagement',
            'event_label': `${depth}%`
          });
        }
      });
    }, 500);
    
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
  }

  // Lazy Loading Images (fallback for older browsers)
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for older browsers
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    if (!window.performance || !window.performance.timing) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log('Page Load Time:', loadTime + 'ms');
          console.log('DOM Ready Time:', domReadyTime + 'ms');
        }
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            'name': 'load',
            'value': loadTime,
            'event_category': 'performance'
          });
        }
      }, 0);
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    initMobileNav();
    initNavScroll();
    initParallax();
    initAnimations();
    initBookingFallback();
    initSmoothScroll();
    initAnalytics();
    initLazyLoading();
    initPerformanceMonitoring();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle visibility change (pause animations when tab is not visible)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause expensive operations
      document.querySelectorAll('.gallery-item img, .service-card').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations
      document.querySelectorAll('.gallery-item img, .service-card').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  });

})();
