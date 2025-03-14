// Main JavaScript file for the LMS Platform

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const setupMobileNav = () => {
        const header = document.querySelector('header');
        if (!header) return;
        
        // Create mobile nav toggle button if it doesn't exist
        if (!document.querySelector('.mobile-nav-toggle')) {
            const navToggle = document.createElement('button');
            navToggle.className = 'mobile-nav-toggle';
            navToggle.innerHTML = '<span></span><span></span><span></span>';
            navToggle.setAttribute('aria-label', 'Toggle Navigation');
            
            const nav = header.querySelector('nav');
            if (nav) {
                header.insertBefore(navToggle, nav);
                
                navToggle.addEventListener('click', function() {
                    header.classList.toggle('nav-open');
                    const isExpanded = header.classList.contains('nav-open');
                    navToggle.setAttribute('aria-expanded', isExpanded);
                });
            }
        }
    };
    
    // Initialize tooltips
    const initTooltips = () => {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltipEl = document.createElement('div');
                tooltipEl.className = 'tooltip';
                tooltipEl.textContent = tooltipText;
                document.body.appendChild(tooltipEl);
                
                const rect = this.getBoundingClientRect();
                tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
                tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2)}px`;
                tooltipEl.style.opacity = '1';
            });
            
            tooltip.addEventListener('mouseleave', function() {
                const tooltipEl = document.querySelector('.tooltip');
                if (tooltipEl) {
                    tooltipEl.remove();
                }
            });
        });
    };
    
    // Smooth scrolling for anchor links
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    // Form validation
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                
                // Check required fields
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Add error message if it doesn't exist
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'This field is required';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });
                
                // Check email format
                const emailFields = form.querySelectorAll('input[type="email"]');
                emailFields.forEach(field => {
                    if (field.value.trim() && !validateEmail(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Add error message if it doesn't exist
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Please enter a valid email address';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                field.addEventListener('blur', function() {
                    // Required field validation
                    if (field.hasAttribute('required') && !field.value.trim()) {
                        field.classList.add('error');
                        
                        // Add error message if it doesn't exist
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'This field is required';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                        
                        // Email validation
                        if (field.type === 'email' && field.value.trim() && !validateEmail(field.value)) {
                            field.classList.add('error');
                            
                            // Add error message if it doesn't exist
                            let errorMsg = field.nextElementSibling;
                            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                                errorMsg = document.createElement('div');
                                errorMsg.className = 'error-message';
                                errorMsg.textContent = 'Please enter a valid email address';
                                field.parentNode.insertBefore(errorMsg, field.nextSibling);
                            }
                        }
                    }
                });
            });
        });
    };
    
    // Helper function to validate email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Initialize all functions
    setupMobileNav();
    initTooltips();
    initSmoothScroll();
    initFormValidation();
    
    // Add mobile nav styles dynamically
    const addMobileNavStyles = () => {
        if (!document.getElementById('mobile-nav-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'mobile-nav-styles';
            styleEl.textContent = `
                @media (max-width: 768px) {
                    .mobile-nav-toggle {
                        display: block;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 10px;
                        z-index: 1000;
                    }
                    
                    .mobile-nav-toggle span {
                        display: block;
                        width: 25px;
                        height: 3px;
                        background-color: #333;
                        margin: 5px 0;
                        transition: all 0.3s ease;
                    }
                    
                    header.nav-open .mobile-nav-toggle span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    
                    header.nav-open .mobile-nav-toggle span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    header.nav-open .mobile-nav-toggle span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -7px);
                    }
                    
                    header nav {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 80%;
                        max-width: 300px;
                        height: 100vh;
                        background-color: white;
                        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                        transition: right 0.3s ease;
                        z-index: 999;
                        padding: 80px 20px 20px;
                    }
                    
                    header.nav-open nav {
                        right: 0;
                    }
                    
                    nav ul {
                        flex-direction: column;
                    }
                    
                    nav ul li {
                        margin: 0 0 15px 0;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-nav-toggle {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
    };
    
    addMobileNavStyles();
});