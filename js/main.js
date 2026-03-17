/* =====================================================
   SOLID SIDE - Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = window.scrollY;
        });
    }
    
    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // =====================================================
    // NEWS SLIDER
    // =====================================================
    const newsSlider = document.querySelector('.news-slider');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    
    if (newsSlider && sliderPrev && sliderNext) {
        let currentSlide = 0;
        const cards = newsSlider.querySelectorAll('.news-card');
        const totalCards = cards.length;
        let cardsPerView = getCardsPerView();
        let cardWidth = getCardWidth();
        
        function getCardsPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 992) return 2;
            return 3;
        }
        
        function getCardWidth() {
            const card = cards[0];
            if (!card) return 0;
            const style = window.getComputedStyle(card);
            const width = card.offsetWidth;
            const marginRight = parseInt(style.marginRight) || 0;
            const gap = 30; // Gap from CSS
            return width + gap;
        }
        
        function updateSlider() {
            const translateX = -currentSlide * cardWidth;
            newsSlider.style.transform = `translateX(${translateX}px)`;
        }
        
        function nextSlide() {
            const maxSlide = Math.max(0, totalCards - cardsPerView);
            if (currentSlide < maxSlide) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
        }
        
        function prevSlide() {
            const maxSlide = Math.max(0, totalCards - cardsPerView);
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = maxSlide;
            }
            updateSlider();
        }
        
        sliderNext.addEventListener('click', nextSlide);
        sliderPrev.addEventListener('click', prevSlide);
        
        // Update on window resize
        window.addEventListener('resize', function() {
            cardsPerView = getCardsPerView();
            cardWidth = getCardWidth();
            currentSlide = Math.min(currentSlide, Math.max(0, totalCards - cardsPerView));
            updateSlider();
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        newsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        newsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }
    
    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // =====================================================
    // FORM VALIDATION
    // =====================================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = contactForm.querySelector('input[name="name"]');
            const email = contactForm.querySelector('input[name="email"]');
            const message = contactForm.querySelector('textarea[name="message"]');
            
            let isValid = true;
            
            // Simple validation
            if (name && name.value.trim() === '') {
                showError(name, 'Prosím, zadajte vaše meno');
                isValid = false;
            } else if (name) {
                clearError(name);
            }
            
            if (email && !isValidEmail(email.value)) {
                showError(email, 'Prosím, zadajte platný email');
                isValid = false;
            } else if (email) {
                clearError(email);
            }
            
            if (message && message.value.trim() === '') {
                showError(message, 'Prosím, napíšte vašu správu');
                isValid = false;
            } else if (message) {
                clearError(message);
            }
            
            if (isValid) {
                // Show success message
                showSuccessMessage();
                contactForm.reset();
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        clearError(input);
        
        const errorElement = document.createElement('span');
        errorElement.className = 'form-error';
        errorElement.style.cssText = 'color: #e74c3c; font-size: 0.75rem; margin-top: 5px; display: block;';
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
        input.style.borderColor = '#e74c3c';
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--color-primary-dark, #2d3a3a);
            color: var(--color-accent-gold, #c4a77d);
            padding: 30px 50px;
            border: 1px solid var(--color-accent-gold, #c4a77d);
            z-index: 10000;
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;
        successDiv.innerHTML = `
            <p style="font-size: 1rem; margin-bottom: 10px;">Ďakujeme za vašu správu!</p>
            <p style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 0;">Budeme vás kontaktovať čo najskôr.</p>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(function() {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                successDiv.remove();
            }, 300);
        }, 3000);
    }
    
    // =====================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // =====================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    document.querySelectorAll('.fade-in').forEach(function(el) {
        observer.observe(el);
    });
    
    // =====================================================
    // ACTIVE NAVIGATION LINK
    // =====================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
