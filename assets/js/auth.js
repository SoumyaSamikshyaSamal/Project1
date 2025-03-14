/**
 * Authentication JavaScript for LMS Platform
 * Handles login, registration, and user session management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication functionality
    initAuth();
});

/**
 * Initialize all authentication related functionality
 */
function initAuth() {
    setupLoginForm();
    setupRegisterForm();
    setupLogout();
    checkUserSession();
}

/**
 * Setup login form validation and submission
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(loginForm)) return;
        
        // Get form data
        const formData = new FormData(loginForm);
        const userType = formData.get('user-type');
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.has('remember');
        
        // Simulate API call with timeout
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        // In a real application, this would be an API call to your backend
        setTimeout(() => {
            // For demo purposes, we'll simulate a successful login
            // Store user session
            storeUserSession({
                userType: userType,
                email: email,
                name: email.split('@')[0], // Just for demo
                isLoggedIn: true
            }, rememberMe);
            
            // Redirect to appropriate dashboard
            redirectToDashboard(userType);
        }, 1500);
    });
}

/**
 * Setup register form validation and submission
 */
function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    // Handle user type selection to show/hide specific fields
    const userTypeRadios = registerForm.querySelectorAll('input[name="user-type"]');
    const studentFields = document.getElementById('student-fields');
    const instructorFields = document.getElementById('instructor-fields');
    const adminFields = document.getElementById('admin-fields');
    
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all specific fields first
            if (studentFields) studentFields.style.display = 'none';
            if (instructorFields) instructorFields.style.display = 'none';
            if (adminFields) adminFields.style.display = 'none';
            
            // Show the selected user type fields
            const selectedType = this.value;
            if (selectedType === 'student' && studentFields) {
                studentFields.style.display = 'block';
            } else if (selectedType === 'instructor' && instructorFields) {
                instructorFields.style.display = 'block';
            } else if (selectedType === 'admin' && adminFields) {
                adminFields.style.display = 'block';
            }
        });
    });
    
    // Check URL parameters for pre-selected user type
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam) {
        const radioToSelect = registerForm.querySelector(`input[name="user-type"][value="${typeParam}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
            // Trigger change event to show/hide appropriate fields
            radioToSelect.dispatchEvent(new Event('change'));
        }
    }
    
    // Password confirmation validation
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');
    
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            if (passwordField.value !== this.value) {
                this.classList.add('error');
                
                // Add error message if it doesn't exist
                let errorMsg = this.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Passwords do not match';
                    this.parentNode.insertBefore(errorMsg, this.nextSibling);
                }
            } else {
                this.classList.remove('error');
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    }
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(registerForm)) return;
        
        // Additional validation for password confirmation
        if (passwordField && confirmPasswordField && passwordField.value !== confirmPasswordField.value) {
            confirmPasswordField.classList.add('error');
            // Add error message if it doesn't exist
            let errorMsg = confirmPasswordField.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Passwords do not match';
                confirmPasswordField.parentNode.insertBefore(errorMsg, confirmPasswordField.nextSibling);
            }
            return;
        }
        
        // Get form data
        const formData = new FormData(registerForm);
        const userType = formData.get('user-type');
        const email = formData.get('email');
        const firstName = formData.get('first-name');
        const lastName = formData.get('last-name');
        
        // Simulate API call with timeout
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        
        // In a real application, this would be an API call to your backend
        setTimeout(() => {
            // For demo purposes, we'll simulate a successful registration
            // Store user session
            storeUserSession({
                userType: userType,
                email: email,
                name: `${firstName} ${lastName}`,
                isLoggedIn: true
            }, true);
            
            // Redirect to appropriate dashboard
            redirectToDashboard(userType);
        }, 1500);
    });
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutLinks = document.querySelectorAll('a[href*="login.html"]');
    
    logoutLinks.forEach(link => {
        // Only target links in dashboard areas (not in the main navigation)
        if (link.closest('.sidebar')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear user session
                clearUserSession();
                
                // Redirect to login page
                window.location.href = this.href;
            });
        }
    });
}

/**
 * Check if user is logged in and redirect if necessary
 */
function checkUserSession() {
    const user = getUserSession();
    const currentPath = window.location.pathname;
    
    // If user is logged in and trying to access login/register pages, redirect to dashboard
    if (user && user.isLoggedIn && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
        redirectToDashboard(user.userType);
        return;
    }
    
    // If user is not logged in and trying to access dashboard pages, redirect to login
    const isDashboardPage = currentPath.includes('/student/') || 
                           currentPath.includes('/instructor/') || 
                           currentPath.includes('/admin/');
    
    if (isDashboardPage && (!user || !user.isLoggedIn)) {
        window.location.href = '../shared/login.html';
        return;
    }
    
    // If user is logged in, update UI with user info
    if (user && user.isLoggedIn) {
        updateUIWithUserInfo(user);
    }
}

/**
 * Update UI elements with user information
 */
function updateUIWithUserInfo(user) {
    // Update user dropdown if it exists
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
        userDropdown.textContent = `${user.name} ▼`;
    }
    
    // Update sidebar welcome message if it exists
    const sidebarWelcome = document.querySelector('.sidebar-header p');
    if (sidebarWelcome) {
        sidebarWelcome.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
}

/**
 * Validate form fields
 */
function validateForm(form) {
    let isValid = true;
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
    
    return isValid;
}

/**
 * Store user session in localStorage or sessionStorage
 */
function storeUserSession(user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('lmsUser', JSON.stringify(user));
}

/**
 * Get user session from storage
 */
function getUserSession() {
    // Check localStorage first, then sessionStorage
    const localUser = localStorage.getItem('lmsUser');
    const sessionUser = sessionStorage.getItem('lmsUser');
    
    return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
}

/**
 * Clear user session from all storages
 */
function clearUserSession() {
    localStorage.removeItem('lmsUser');
    sessionStorage.removeItem('lmsUser');
}

/**
 * Redirect to appropriate dashboard based on user type
 */
function redirectToDashboard(userType) {
    switch(userType) {
        case 'student':
            window.location.href = '../student/dashboard.html';
            break;
        case 'instructor':
            window.location.href = '../instructor/dashboard.html';
            break;
        case 'admin':
            window.location.href = '../admin/dashboard.html';
            break;
        default:
            window.location.href = '../index.html';
    }
}