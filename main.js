        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    const menuToggle = document.querySelector('.menu-toggle');
                    const navLinks = document.querySelector('.nav-links');
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    
                    // Add offset for fixed navigation
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced scroll animations with single optimized observer
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Disconnect observer for this element to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply stagger delays to service cards
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.classList.add('slide-up', `stagger-${index + 1}`);
            observer.observe(card);
        });

        // Apply animations to gallery items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.classList.add('slide-up', `stagger-${(index % 3) + 1}`);
            observer.observe(item);
        });

        // Apply animations to section headers (except booking)
        document.querySelectorAll('.section-header').forEach(header => {
            if (!header.closest('#booking')) {
                header.classList.add('slide-up');
                observer.observe(header);
            }
        });

        // Apply animations to contact items
        document.querySelectorAll('.contact-item').forEach((item, index) => {
            item.classList.add('slide-up', `stagger-${index + 1}`);
            observer.observe(item);
        });

        // Animate "Why Shield & Shine" stats
        document.querySelectorAll('[style*="font-size: clamp(20px"]').forEach(stat => {
            if (!stat.classList.contains('animated')) {
                stat.classList.add('slide-up');
                observer.observe(stat);
            }
        });

        // Nav background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.8)';
            }
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Subtle parallax effect on hero
  window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const scrollTop = window.pageYOffset;
  const heroHeight = hero.offsetHeight;

  // Move until hero fully scrolls off screen
  if (scrollTop <= heroHeight) {
    const parallax = scrollTop * 0.4; // adjust strength
    hero.style.transform = `translateY(${parallax}px)`;
    hero.style.opacity = 1 - scrollTop / (heroHeight * 0.8);
  } else {
    hero.style.transform = `translateY(${heroHeight * 0.4}px)`;
    hero.style.opacity = 0;
  }
});

        // Square booking widget fallback detection
        setTimeout(() => {
            const squareWidget = document.getElementById('square-booking-widget');
            const fallback = document.getElementById('square-fallback');
            
            // Check if Square widget loaded
            if (squareWidget && squareWidget.children.length <= 1) {
                if (fallback) fallback.style.display = 'block';
            }
        }, 3000);
        
        // Track phone clicks for analytics
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_click', {
                        'event_category': 'engagement',
                        'event_label': link.href
                    });
                }
            });
        });
        
        // Track booking button clicks
        document.querySelectorAll('a[href*="booking"], a[href*="square"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'booking_click', {
                        'event_category': 'conversion',
                        'event_label': link.href
                    });
                }
            });
        });
        
        // Google Reviews Widget Fallback
        setTimeout(() => {
            const reviewsWidget = document.querySelector('.elfsight-app-397f2635-d294-484b-86fc-2d670e185cf0');
            const fallback = document.getElementById('reviews-fallback');
            
            // Check if Elfsight widget loaded
            if (reviewsWidget && !reviewsWidget.children.length) {
                if (fallback) fallback.style.display = 'block';
            }
        }, 5000);
        
        // Before/After Slider Functionality - Rewritten
        document.querySelectorAll('.before-after-slider').forEach(slider => {
            const handle = slider.querySelector('.slider-handle');
            const beforeWrapper = slider.querySelector('.before-image-wrapper');
            const beforeImage = beforeWrapper.querySelector('.before-image');
            const container = slider.querySelector('.before-after-container');
            let isActive = false;
            
// Set initial position to 50%
const setInitialPosition = () => {
    const containerWidth = container.offsetWidth;
    const initialPos = containerWidth / 2;
    handle.style.left = initialPos + 'px';
    beforeWrapper.style.width = initialPos + 'px';
    
    // Set before image width to match container
    if (beforeImage) {
        beforeImage.style.width = containerWidth + 'px';
        beforeImage.style.maxWidth = 'none';
        beforeImage.style.left = '0';
    }
};
            
            // Update slider position
            const updateSliderPosition = (clientX) => {
                const rect = container.getBoundingClientRect();
                let position = clientX - rect.left;
                
                // Constrain position within bounds
                position = Math.max(0, Math.min(position, rect.width));
                
                // Update handle and before wrapper ONLY
                handle.style.left = position + 'px';
                beforeWrapper.style.width = position + 'px';
                // Don't touch the before image dimensions
            };
            
            // Handle start
            const handleStart = (e) => {
                isActive = true;
                e.preventDefault();
                slider.style.cursor = 'grabbing';
                
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                updateSliderPosition(clientX);
            };
            
            // Handle move
            const handleMove = (e) => {
                if (!isActive) return;
                e.preventDefault();
                
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                updateSliderPosition(clientX);
            };
            
            // Handle end
            const handleEnd = () => {
                isActive = false;
                slider.style.cursor = 'col-resize';
            };
            
            // Mouse events
            handle.addEventListener('mousedown', handleStart);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            
            // Touch events
            handle.addEventListener('touchstart', handleStart);
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('touchend', handleEnd);
            
            // Click anywhere on slider to jump to position
            slider.addEventListener('click', (e) => {
                if (e.target === handle) return;
                updateSliderPosition(e.clientX);
            });
            
            // Initialize on load
            setInitialPosition();
            
            // Reinitialize on window resize
            window.addEventListener('resize', setInitialPosition);
        });
