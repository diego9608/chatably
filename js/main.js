// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
        }
        
        lastScrollTop = scrollTop;
    }
});

// Form submission para Netlify
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        // No prevenir default - dejar que Netlify maneje el form
        const submitButton = e.target.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
        }
    });
}

// FAQ toggle
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question span');
        
        if (answer && icon) {
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.textContent = '+';
            } else {
                answer.style.display = 'block';
                icon.textContent = '−';
            }
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Update WhatsApp link with actual number
const whatsappLink = document.querySelector('.whatsapp-float');
if (whatsappLink) {
    whatsappLink.href = 'https://wa.me/436765748509?text=Hola,%20quiero%20información%20sobre%20Chatably';
}

// Pricing plan buttons - redirect to checkout
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to pricing buttons
    const pricingButtons = document.querySelectorAll('.pricing-card .cta-button');
    
    pricingButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determine plan based on button index or parent card
            const pricingCard = button.closest('.pricing-card');
            const planName = pricingCard.querySelector('.plan-name').textContent.toLowerCase();
            
            // Redirect to checkout with plan parameter
            window.location.href = `checkout.html?plan=${planName}`;
        });
    });
});