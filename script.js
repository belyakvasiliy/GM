// Smooth scrolling for navigation
function scrollToRegistration() {
  document.getElementById("registration").scrollIntoView({
    behavior: "smooth",
  });
}

// Plan selection
function selectPlan(plan) {
  const radioButtons = document.querySelectorAll('input[name="plan"]');
  radioButtons.forEach((radio) => {
    if (radio.value === plan) {
      radio.checked = true;
    }
  });
  scrollToRegistration();
}

// Countdown timer
function updateCountdown() {
  const targetDate = new Date("2025-06-19T11:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Form submission
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    const form = this;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitButton = document.getElementById("submitButton");
    const buttonText = submitButton.querySelector(".button-text");
    const buttonLoading = submitButton.querySelector(".button-loading");
    const formStatus = document.getElementById("formStatus");
    const statusMessage = document.getElementById("statusMessage");

    // Client-side validation
    if (!validateForm(data)) {
      e.preventDefault();
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = "none";
    buttonLoading.style.display = "inline-flex";

    // Show loading message
    showFormStatus("loading", "Отправляем вашу заявку...");

    // If validation passes, let the form submit normally to FormSpree
    // The form will redirect to the thank you page or show FormSpree's default response

    // Optional: Handle the submission with AJAX instead of form redirect
    e.preventDefault();

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          showFormStatus(
            "success",
            "🎉 Отлично! Ваша заявка отправлена. Мы свяжемся с вами в течение 2 часов для подтверждения участия.",
          );
          form.reset();

          // Track successful submission
          trackFormSubmission(data);

          // Show thank you message for longer
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 10000);
        } else {
          response.json().then((data) => {
            if (data.errors) {
              showFormStatus(
                "error",
                "Ошибка: " +
                  data.errors.map((error) => error.message).join(", "),
              );
            } else {
              showFormStatus(
                "error",
                "Произошла ошибка при отправке. Попробуйте еще раз или свяжитесь с нами по телефону.",
              );
            }
          });
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        showFormStatus(
          "error",
          "Произошла ошибка при отправке. Проверьте подключение к интернету и попробуйте еще раз.",
        );
      })
      .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = "inline";
        buttonLoading.style.display = "none";
      });
  });

// Form validation function
function validateForm(data) {
  const formStatus = document.getElementById("formStatus");

  // Required fields validation
  if (!data.name || data.name.trim().length < 2) {
    showFormStatus(
      "error",
      "Пожалуйста, введите ваше полное имя (минимум 2 символа)",
    );
    document.getElementById("name").focus();
    return false;
  }

  if (!data.email || !isValidEmail(data.email)) {
    showFormStatus("error", "Пожалуйста, введите корректный email адрес");
    document.getElementById("email").focus();
    return false;
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    showFormStatus("error", "Пожалуйста, введите корректный номер телефона");
    document.getElementById("phone").focus();
    return false;
  }

  if (!data.plan) {
    showFormStatus("error", "Пожалуйста, выберите пакет участия");
    return false;
  }

  return true;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (international format)
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return cleanPhone.length >= 7 && phoneRegex.test(cleanPhone);
}

// Show form status
function showFormStatus(type, message) {
  const formStatus = document.getElementById("formStatus");
  const statusMessage = document.getElementById("statusMessage");

  formStatus.className = `form-status ${type}`;
  statusMessage.textContent = message;
  formStatus.style.display = "block";

  // Auto-hide error and loading messages after 5 seconds
  if (type === "error" || type === "loading") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
}

// Track form submission for analytics
function trackFormSubmission(data) {
  // Google Analytics tracking (if implemented)
  if (typeof gtag !== "undefined") {
    gtag("event", "form_submit", {
      event_category: "engagement",
      event_label: "workshop_registration",
      value: data.plan === "premium" ? 1000 : 550,
    });
  }

  // Console log for debugging
  console.log("Form submitted successfully:", {
    name: data.name,
    email: data.email,
    plan: data.plan,
    business_type: data.business_type,
    timestamp: new Date().toISOString(),
  });
}

// Real-time validation
document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Name validation
  nameInput.addEventListener("blur", function () {
    if (this.value.trim().length < 2 && this.value.length > 0) {
      this.style.borderColor = "#EF4444";
    } else if (this.value.trim().length >= 2) {
      this.style.borderColor = "#10B981";
    } else {
      this.style.borderColor = "#E5E7EB";
    }
  });

  // Email validation
  emailInput.addEventListener("blur", function () {
    if (this.value && !isValidEmail(this.value)) {
      this.style.borderColor = "#EF4444";
    } else if (this.value && isValidEmail(this.value)) {
      this.style.borderColor = "#10B981";
    } else {
      this.style.borderColor = "#E5E7EB";
    }
  });

  // Phone validation
  phoneInput.addEventListener("blur", function () {
    if (this.value && !isValidPhone(this.value)) {
      this.style.borderColor = "#EF4444";
    } else if (this.value && isValidPhone(this.value)) {
      this.style.borderColor = "#10B981";
    } else {
      this.style.borderColor = "#E5E7EB";
    }
  });
});

// Scroll animations
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".program-day, .testimonial, .pricing-card",
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

// Initialize scroll animations
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(
    ".program-day, .testimonial, .pricing-card",
  );
  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });
});

window.addEventListener("scroll", animateOnScroll);

// Header background on scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector(".sticky-header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
  }
});

// Add pulse animation to CTA buttons periodically
setInterval(function () {
  const ctaButtons = document.querySelectorAll(".cta-button.primary");
  ctaButtons.forEach((button) => {
    button.classList.add("pulse");
    setTimeout(() => {
      button.classList.remove("pulse");
    }, 2000);
  });
}, 10000);

// Exit intent popup (simplified version)
let exitIntentShown = false;

document.addEventListener("mouseleave", function (e) {
  if (e.clientY <= 0 && !exitIntentShown) {
    exitIntentShown = true;
    if (
      confirm(
        "Подождите! Не упустите возможность изменить свой бизнес. Хотите узнать больше о специальном предложении?",
      )
    ) {
      scrollToRegistration();
    }
  }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
  // Implementation for mobile menu if needed
}

// Lazy loading for images
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = "1";
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
    imageObserver.observe(img);
  });
});

// Add loading animation
window.addEventListener("load", function () {
  document.body.style.opacity = "1";
  document.body.style.transition = "opacity 0.5s ease";
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = "0";

  // Smooth reveal animation
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);

  // Initialize animations
  animateOnScroll();
});
