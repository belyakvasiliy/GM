// Smooth scrolling for navigation
function scrollToRegistration() {
    document.getElementById('registration').scrollIntoView({
        behavior: 'smooth'
    });
}

// Plan selection
function selectPlan(plan) {
    const radioButtons = document.querySelectorAll('input[name="plan"]');
    radioButtons.forEach(radio => {
        if (radio.value === plan) {
            radio.checked = true;
        }
    });
    scrollToRegistration();
}

// Countdown timer
function updateCountdown() {
    const targetDate = new Date('2025-06-19T11:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// HubSpot form integration: fall back to local handler if the old form exists
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.phone || !data.plan) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Пожалуйста, введите корректный email адрес');
            return;
        }

        alert('Спасибо за регистрацию! Мы свяжемся с вами в ближайшее время для подтверждения участия.');
        this.reset();
        console.log('Registration data:', data);
    });
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.program-day, .testimonial, .pricing-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.program-day, .testimonial, .pricing-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

window.addEventListener('scroll', animateOnScroll);

// Header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.sticky-header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Add pulse animation to CTA buttons periodically
setInterval(function() {
    const ctaButtons = document.querySelectorAll('.cta-button.primary');
    ctaButtons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 2000);
    });
}, 10000);

// Exit intent popup (simplified version)
let exitIntentShown = false;

document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        if (confirm('Подождите! Не упустите возможность изменить свой бизнес. Хотите узнать больше о специальном предложении?')) {
            scrollToRegistration();
        }
    }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    // Implementation for mobile menu if needed
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    
    // Smooth reveal animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize animations
    animateOnScroll();
});

