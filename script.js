// DOM Elements
const updateBtn = document.getElementById('update-btn');
const verifyBtn = document.getElementById('verify-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const updateForm = document.getElementById('update-form');
const avatarInput = document.getElementById('form-avatar');
const avatarPreview = document.getElementById('avatar-preview');
const profileAvatarImg = document.getElementById('profile-avatar-img');

// Profile data elements
const profileElements = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    department: document.getElementById('department'),
    degree: document.getElementById('degree'),
    passoutYear: document.getElementById('passout-year'),
    jobTitle: document.getElementById('job-title'),
    company: document.getElementById('company'),
    location: document.getElementById('location'),
    testimonial: document.getElementById('testimonial-text')
};

// Form elements
const formElements = {
    name: document.getElementById('form-name'),
    email: document.getElementById('form-email'),
    department: document.getElementById('form-department'),
    degree: document.getElementById('form-degree'),
    passoutYear: document.getElementById('form-passout-year'),
    jobTitle: document.getElementById('form-job-title'),
    company: document.getElementById('form-company'),
    location: document.getElementById('form-location'),
    testimonial: document.getElementById('form-testimonial')
};

// Verification elements
const verifyModalOverlay = document.getElementById('verify-modal-overlay');
const verifyModalClose = document.getElementById('verify-modal-close');
const verifyBtnModal = document.getElementById('verify-btn-modal');
const verifyEmailSpan = document.getElementById('verify-email');
const statusBadge = document.querySelector('.status-badge');

let isVerified = false;

// Event Listeners
updateBtn?.addEventListener('click', openModal);
verifyBtn?.addEventListener('click', requestVerification);
modalClose?.addEventListener('click', closeModal);
cancelBtn?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', handleOverlayClick);
updateForm?.addEventListener('submit', handleFormSubmit);
document.addEventListener('keydown', handleKeyDown);

// Avatar preview functionality
if (avatarInput) {
    avatarInput.addEventListener('change', function() {
        const file = avatarInput.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file.', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size should be less than 5MB.', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Modal Functions
function openModal() {
    populateForm();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input after animation
    setTimeout(() => {
        formElements.name?.focus();
    }, 300);
    
    // Set preview to current avatar
    if (avatarPreview && profileAvatarImg) {
        avatarPreview.src = profileAvatarImg.src;
    }
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form after animation
    setTimeout(() => {
        populateForm();
        clearValidationErrors();
    }, 300);
}

function handleOverlayClick(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
}

function handleKeyDown(event) {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
}

function populateForm() {
    if (!profileElements.name || !formElements.name) return;
    
    formElements.name.value = profileElements.name.textContent.trim();
    formElements.email.value = profileElements.email.textContent.trim();
    formElements.department.value = profileElements.department.textContent.trim();
    formElements.degree.value = profileElements.degree.textContent.trim();
    formElements.passoutYear.value = profileElements.passoutYear.textContent.trim();
    formElements.jobTitle.value = profileElements.jobTitle.textContent.trim();
    formElements.company.value = profileElements.company.textContent.trim();
    formElements.location.value = profileElements.location.textContent.trim();
    formElements.testimonial.value = profileElements.testimonial.textContent.trim();
}

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        updateProfile();
        showNotification('Profile updated successfully!', 'success');
        closeModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function updateProfile() {
    // Update profile display
    profileElements.name.textContent = formElements.name.value;
    profileElements.email.textContent = formElements.email.value;
    profileElements.department.textContent = formElements.department.value;
    profileElements.degree.textContent = formElements.degree.value;
    profileElements.passoutYear.textContent = formElements.passoutYear.value;
    profileElements.jobTitle.textContent = formElements.jobTitle.value;
    profileElements.company.textContent = formElements.company.value;
    profileElements.location.textContent = formElements.location.value;
    profileElements.testimonial.textContent = formElements.testimonial.value;
    
    // Update avatar
    if (avatarPreview && profileAvatarImg && avatarPreview.src !== profileAvatarImg.src) {
        profileAvatarImg.src = avatarPreview.src;
    }
    
    // Add update animation
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            profileCard.style.transform = '';
        }, 200);
    }
}

// Verification Request
function requestVerification() {
    // Simulate sending email
    const email = profileElements.email.textContent.trim();
    if (verifyEmailSpan) verifyEmailSpan.textContent = email;
    if (verifyModalOverlay) verifyModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

if (verifyBtnModal) {
    verifyBtnModal.addEventListener('click', function() {
        isVerified = true;
        if (statusBadge) {
            statusBadge.textContent = 'Verified';
            statusBadge.style.background = '#90EE90';
        }
        if (verifyModalOverlay) verifyModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        showNotification('Your email has been verified!', 'success');
    });
}

if (verifyModalClose) {
    verifyModalClose.addEventListener('click', function() {
        if (verifyModalOverlay) verifyModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Form Validation
function validateForm() {
    const requiredFields = [
        { element: formElements.name, name: 'Name' },
        { element: formElements.email, name: 'Email' },
        { element: formElements.department, name: 'Department' },
        { element: formElements.degree, name: 'Degree' },
        { element: formElements.passoutYear, name: 'Graduation Year' },
        { element: formElements.jobTitle, name: 'Job Title' },
        { element: formElements.company, name: 'Company' },
        { element: formElements.location, name: 'Location' },
        { element: formElements.testimonial, name: 'Testimonial' }
    ];
    
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
            showFieldError(field.element, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formElements.email.value && !emailRegex.test(formElements.email.value)) {
        showFieldError(formElements.email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Year validation
    const currentYear = new Date().getFullYear();
    const passoutYear = parseInt(formElements.passoutYear.value);
    if (formElements.passoutYear.value && (passoutYear < 2015 || passoutYear > currentYear + 5)) {
        showFieldError(formElements.passoutYear, `Year must be between 2015 and ${currentYear + 5}`);
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearValidationErrors() {
    Object.values(formElements).forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// Real-time validation
Object.values(formElements).forEach(field => {
    field.addEventListener('input', () => {
        if (field.value.trim()) {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
});

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add icon based on type
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.top-header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll listener for header effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Add loading animation to profile card
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.opacity = '0';
        profileCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            profileCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            profileCard.style.opacity = '1';
            profileCard.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Add stagger animation to detail items
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 400 + (index * 100));
    });
});

// Smooth scroll for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.detail-item, .btn').forEach(el => {
    observer.observe(el);
});