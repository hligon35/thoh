// House of Humanity Website JavaScript
// Enhanced functionality for interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initForms();
    initAnimations();
    initDonationFeatures();
    initAccessibility();
    initAnalytics();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update ARIA attributes
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling and validation
function initForms() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }

    // Donation form
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmit);
        initDonationAmountSelection();
        initPaymentMethodSelection();
    }

    // Newsletter signup
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
}

// Contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
    
    // Track form submission
    trackEvent('contact_form_submit', {
        subject: data.subject,
        urgency: data.urgency
    });
}

// Donation form submission
function handleDonationSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate donation form
    if (!validateDonationForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate donation processing (replace with actual payment processor)
    setTimeout(() => {
        showNotification('Thank you for your generous donation!', 'success');
        showDonationConfirmation(data);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 3000);
    
    // Track donation
    trackEvent('donation_submit', {
        amount: data.amount,
        frequency: data.frequency,
        payment_method: data.payment_method
    });
}

// Newsletter signup
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate newsletter signup
    setTimeout(() => {
        showNotification('Successfully subscribed to our newsletter!', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
    
    // Track newsletter signup
    trackEvent('newsletter_signup', { email_domain: email.split('@')[1] });
}

// Form validation functions
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long.');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address.');
    }
    
    if (!data.subject) {
        errors.push('Please select how we can help you.');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long.');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join(' '), 'error');
        return false;
    }
    
    return true;
}

function validateDonationForm(data) {
    const errors = [];
    
    if (!data.amount || parseFloat(data.amount) < 1) {
        errors.push('Please enter a valid donation amount.');
    }
    
    if (!data.payment_method) {
        errors.push('Please select a payment method.');
    }
    
    if (!data.donor_name || data.donor_name.trim().length < 2) {
        errors.push('Please enter your full name.');
    }
    
    if (!data.donor_email || !isValidEmail(data.donor_email)) {
        errors.push('Please enter a valid email address.');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join(' '), 'error');
        return false;
    }
    
    return true;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    if (field.required && !value) {
        isValid = false;
        message = 'This field is required.';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number.';
    }
    
    if (!isValid) {
        showFieldError(field, message);
    }
    
    return isValid;
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

// Donation-specific features
function initDonationFeatures() {
    initDonationAmountSelection();
    initPaymentMethodSelection();
    initRecurringDonation();
}

function initDonationAmountSelection() {
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountInput = document.querySelector('#custom-amount');
    
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add active class to clicked option
            this.classList.add('selected');
            
            // Set the amount value
            const amount = this.dataset.amount;
            if (customAmountInput && amount !== 'custom') {
                customAmountInput.value = amount;
            }
            
            // Clear custom input if preset amount selected
            if (amount !== 'custom' && customAmountInput) {
                customAmountInput.value = amount;
            }
        });
    });
    
    // Handle custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select custom option if exists
            const customOption = document.querySelector('.amount-option[data-amount="custom"]');
            if (customOption) {
                customOption.classList.add('selected');
            }
        });
    }
}

function initPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Add active class to clicked method
            this.classList.add('selected');
            
            // Show/hide relevant form fields
            const paymentType = this.dataset.method;
            togglePaymentFields(paymentType);
        });
    });
}

function togglePaymentFields(paymentType) {
    const cardFields = document.querySelector('.card-fields');
    const bankFields = document.querySelector('.bank-fields');
    const paypalFields = document.querySelector('.paypal-fields');
    
    // Hide all payment fields
    if (cardFields) cardFields.style.display = 'none';
    if (bankFields) bankFields.style.display = 'none';
    if (paypalFields) paypalFields.style.display = 'none';
    
    // Show relevant fields
    switch (paymentType) {
        case 'card':
            if (cardFields) cardFields.style.display = 'block';
            break;
        case 'bank':
            if (bankFields) bankFields.style.display = 'block';
            break;
        case 'paypal':
            if (paypalFields) paypalFields.style.display = 'block';
            break;
    }
}

function initRecurringDonation() {
    const recurringCheckbox = document.querySelector('#recurring-donation');
    const frequencySelect = document.querySelector('#donation-frequency');
    
    if (recurringCheckbox && frequencySelect) {
        recurringCheckbox.addEventListener('change', function() {
            frequencySelect.style.display = this.checked ? 'block' : 'none';
            frequencySelect.required = this.checked;
        });
    }
}

// Animation and scroll effects
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('impact-card') || 
                    entry.target.classList.contains('value-card') ||
                    entry.target.classList.contains('program-card')) {
                    const cards = entry.target.parentNode.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.impact-card, .value-card, .program-card, .testimonial-card, .access-card, .faq-item, .mission-stats, .founder-bio');
    animatedElements.forEach(el => observer.observe(el));
    
    // Counter animation for statistics
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // Format number with commas
                    const formatted = Math.floor(current).toLocaleString();
                    counter.textContent = counter.textContent.replace(/[\d,]+/, formatted);
                }, 16);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Accessibility enhancements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.addEventListener('focus', function() {
        this.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', function() {
        this.classList.add('sr-only');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Social media links accessibility - uncomment when ready to use
    /*
    // Add aria-labels to social media links
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
        const icon = link.textContent.trim();
        let ariaLabel = '';
        
        switch (icon) {
            case '📘':
                ariaLabel = 'Visit our Facebook page';
                break;
            case '🐦':
                ariaLabel = 'Follow us on Twitter';
                break;
            case '📸':
                ariaLabel = 'Follow us on Instagram';
                break;
            case '💼':
                ariaLabel = 'Connect with us on LinkedIn';
                break;
            default:
                ariaLabel = 'Social media link';
        }
        
        link.setAttribute('aria-label', ariaLabel);
    });
    */
    
    // Keyboard navigation for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Focus management for modals and overlays
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        }
    });
}

// Analytics and tracking
function initAnalytics() {
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title
    });
    
    // Track scroll depth
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90];
    
    window.addEventListener('scroll', debounce(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !window[`milestone_${milestone}_tracked`]) {
                    trackEvent('scroll_depth', { depth: milestone });
                    window[`milestone_${milestone}_tracked`] = true;
                }
            });
        }
    }, 250));
    
    // Track external link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link) {
            console.log('Link clicked:', link.textContent.trim(), 'href:', link.href, 'hostname:', link.hostname, 'current hostname:', window.location.hostname);
        }
        if (link && link.hostname !== window.location.hostname) {
            trackEvent('external_link_click', {
                url: link.href,
                text: link.textContent.trim()
            });
        }
    });
    
    // Track donation button clicks
    const donationButtons = document.querySelectorAll('a[href*="donate"], .btn-primary');
    donationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Button clicked:', this.textContent.trim(), 'href:', this.href);
            trackEvent('donation_button_click', {
                location: this.closest('section')?.className || 'unknown',
                text: this.textContent.trim()
            });
            // Don't prevent default navigation
        });
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showDonationConfirmation(data) {
    const modal = document.createElement('div');
    modal.className = 'donation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Thank You for Your Donation!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="confirmation-icon">💚</div>
                <p>Your generous donation of <strong>$${data.amount}</strong> will help us continue our mission of making a way for those who need it most.</p>
                <p>A confirmation email has been sent to <strong>${data.donor_email}</strong>.</p>
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>You'll receive a tax-deductible receipt via email</li>
                        <li>Your donation will be put to work immediately</li>
                        <li>We'll keep you updated on our impact</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close">Close</button>
            </div>
        </div>
    `;
    
    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Add close functionality
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.remove();
        });
    });
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4 tracking (replace with your actual tracking ID)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // Console log for development (remove in production)
    console.log('Event tracked:', eventName, parameters);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const animationCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .field-error {
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .modal-content {
        background: white;
        border-radius: var(--radius-lg);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-body {
        padding: 1.5rem;
        text-align: center;
    }
    
    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        text-align: right;
    }
    
    .confirmation-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .next-steps {
        text-align: left;
        margin-top: 1.5rem;
        padding: 1rem;
        background: var(--background-color);
        border-radius: var(--radius-md);
    }
    
    .next-steps ul {
        margin: 0.5rem 0 0 1rem;
    }
    
    .next-steps li {
        margin-bottom: 0.5rem;
    }
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Service Worker registration for PWA features (optional)
// Commented out until service-worker.js is implemented
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}
*/
