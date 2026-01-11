// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize stats animation
    initStatsAnimation();
    
    // Initialize scroll effects
    initScrollEffects();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Change icon based on menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Stats Counter Animation
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statsSection || statNumbers.length === 0) return;
    
    // Check if stats have already been animated
    let statsAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const originalValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        const isDistance = originalText.includes('km') || originalText.includes('mi');
        const isPlus = originalText.includes('+');
        const unit = originalText.includes('km') ? ' km' : originalText.includes('mi') ? ' mi' : '';
        
        // Reset counter
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const increment = originalValue / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= originalValue) {
                clearInterval(timer);
                stat.textContent = originalText;
            } else {
                if (isDistance) {
                    stat.textContent = Math.floor(currentValue).toLocaleString() + unit;
                } else if (isPlus) {
                    stat.textContent = Math.floor(currentValue) + '+';
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }
        }, 16);
    });
}

// Scroll Effects
function initScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            header.style.padding = '20px 0';
        }
    });
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.offer-card, .stat-card, .partner-logo, .gallery-item');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(element);
    });
}

// Add active class to navigation links based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        if (window.scrollY >= sectionTop - headerHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Form validation (if you add a form later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Make functions available globally if needed
window.validateForm = validateForm;
