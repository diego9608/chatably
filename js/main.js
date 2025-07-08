console.log('Main.js cargado correctamente');

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

// VALUE-BASED PRICING FUNCTIONS

// Plan selection function for direct Stripe Payment Links - UPDATED
window.selectPlan = function(planType) {
    const paymentLinks = {
        'starter': 'https://buy.stripe.com/28E9AS1T99SQcW18Qz7ok0b',
        'pro': 'https://buy.stripe.com/7sYfZgcxN3usbRX0k37ok0c',
        'enterprise': 'https://buy.stripe.com/cNifZg0P54yw2hnfeX7ok0d'
    };
    
    const planPrices = {
        'starter': 1499,
        'pro': 4999,
        'enterprise': 9999
    };
    
    console.log(`selectPlan llamado con: ${planType}`);
    
    // Track pricing interaction
    if (typeof gtag !== 'undefined') {
        gtag('event', 'value_based_pricing_click', {
            'event_category': 'conversion',
            'event_label': planType,
            'value': planPrices[planType] || 0,
            'currency': 'MXN'
        });
    }
    
    if (paymentLinks[planType]) {
        localStorage.setItem('chatably_selected_plan', planType);
        localStorage.setItem('chatably_plan_price', planPrices[planType]);
        console.log(`Usuario seleccionó plan: ${planType} por $${planPrices[planType]}`);
        console.log(`Redirigiendo a: ${paymentLinks[planType]}`);
        
        // Show loading state
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Redirigiendo...';
        button.disabled = true;
        
        // Redirect after a brief delay to show loading state
        setTimeout(() => {
            window.location.href = paymentLinks[planType];
        }, 800);
        
    } else {
        console.error(`Plan no válido: ${planType}`);
        alert('Por favor selecciona un plan válido');
    }
}

// Track pricing view analytics
window.trackPricingView = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_pricing', {
            'event_category': 'engagement',
            'event_label': 'value_based_pricing',
            'custom_parameter_1': 'premium_pricing_viewed'
        });
    }
}

// Track ROI justification view
window.trackROIJustification = function(planType, roiValue) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'roi_justification_viewed', {
            'event_category': 'engagement',
            'event_label': planType,
            'value': parseInt(roiValue) || 0
        });
    }
}

// Track guarantee interaction
window.trackGuaranteeClick = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'guarantee_click', {
            'event_category': 'engagement',
            'event_label': 'money_back_guarantee'
        });
    }
}

// Enhanced pricing card interactions
document.addEventListener('DOMContentLoaded', () => {
    // Track when pricing section is viewed
    const pricingSection = document.getElementById('planes');
    if (pricingSection) {
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackPricingView();
                    pricingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        pricingObserver.observe(pricingSection);
    }
    
    // Add hover effects and analytics to pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const planType = card.classList.contains('starter') ? 'starter' :
                           card.classList.contains('pro') ? 'pro' :
                           card.classList.contains('enterprise') ? 'enterprise' : 'unknown';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pricing_card_hover', {
                    'event_category': 'engagement',
                    'event_label': planType
                });
            }
        });
    });
    
    // Track guarantee badge clicks
    const guaranteeBadge = document.querySelector('.guarantee-badge');
    if (guaranteeBadge) {
        guaranteeBadge.addEventListener('click', trackGuaranteeClick);
        guaranteeBadge.style.cursor = 'pointer';
    }
    
    // Add click handlers to new pricing buttons
    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.pricing-card');
            const planType = card.classList.contains('starter') ? 'starter' :
                           card.classList.contains('pro') ? 'pro' :
                           card.classList.contains('enterprise') ? 'enterprise' : 'unknown';
            
            if (planType !== 'enterprise') {
                e.preventDefault();
                selectPlan(planType);
            }
        });
    });
});

// ===========================
// ROI CALCULATOR PREMIUM
// ===========================

class ROICalculator {
    constructor() {
        this.chart = null;
        this.defaultValues = {
            visitors: 5000,
            ticket: 2500,
            conversion: 2.5
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.calculate(); // Calcular con valores por defecto
        this.createChart();
        
        // Trackear cuando el usuario interactúa con la calculadora
        this.trackROIInteraction();
    }
    
    bindEvents() {
        const inputs = ['monthly-visitors', 'average-ticket', 'conversion-rate'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculate();
                    this.updateChart();
                });
                
                input.addEventListener('focus', () => {
                    this.trackROIEngagement('input_focus', inputId);
                });
            }
        });
    }
    
    calculate() {
        const visitors = this.getInputValue('monthly-visitors') || this.defaultValues.visitors;
        const ticket = this.getInputValue('average-ticket') || this.defaultValues.ticket;
        const conversionRate = this.getInputValue('conversion-rate') || this.defaultValues.conversion;
        
        // Calcular escenario SIN Chatably
        const leadsWithout = Math.round(visitors * (conversionRate / 100));
        const salesWithout = leadsWithout * ticket;
        
        // Calcular escenario CON Chatably (mejora del 4x en conversión)
        const improvedConversion = Math.min(conversionRate * 4, 20); // Max 20%
        const leadsWith = Math.round(visitors * (improvedConversion / 100));
        const salesWith = leadsWith * ticket;
        
        // Calcular métricas
        const extraRevenue = salesWith - salesWithout;
        const roiPercentage = ((extraRevenue / 4999) * 100).toFixed(0); // Basado en plan Pro
        const paybackDays = Math.ceil(4999 / (extraRevenue / 30)); // Días para recuperar inversión
        const yearlyExtra = extraRevenue * 12;
        
        // Actualizar UI
        this.updateResults({
            salesWithout,
            salesWith,
            leadsWithout,
            leadsWith,
            conversionWithout: conversionRate,
            conversionWith: improvedConversion,
            extraRevenue,
            roiPercentage,
            paybackDays,
            yearlyExtra
        });
        
        // Trackear el cálculo
        this.trackROICalculation(extraRevenue, roiPercentage);
    }
    
    getInputValue(id) {
        const input = document.getElementById(id);
        return input ? parseFloat(input.value) : 0;
    }
    
    updateResults(data) {
        // Actualizar números con animación
        this.animateNumber('sales-without', data.salesWithout, '$');
        this.animateNumber('sales-with', data.salesWith, '$');
        this.animateNumber('leads-without', data.leadsWithout, '', ' leads');
        this.animateNumber('leads-with', data.leadsWith, '', ' leads');
        this.animateNumber('extra-revenue', data.extraRevenue, '$');
        this.animateNumber('roi-percentage', data.roiPercentage, '', '%');
        this.animateNumber('payback-days', data.paybackDays, '', ' días');
        this.animateNumber('yearly-extra', data.yearlyExtra, '$');
        
        // Actualizar conversiones
        const conversionWithoutEl = document.getElementById('conversion-without');
        const conversionWithEl = document.getElementById('conversion-with');
        
        if (conversionWithoutEl) {
            conversionWithoutEl.textContent = `${data.conversionWithout}% conversión`;
        }
        if (conversionWithEl) {
            conversionWithEl.textContent = `${data.conversionWith.toFixed(1)}% conversión`;
        }
    }
    
    animateNumber(elementId, finalValue, prefix = '', suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
        const increment = (finalValue - currentValue) / 30;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= finalValue) || (increment < 0 && current <= finalValue)) {
                current = finalValue;
                clearInterval(timer);
            }
            
            const displayValue = prefix + this.formatNumber(Math.round(current)) + suffix;
            element.textContent = displayValue;
        }, 50);
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat('es-MX').format(num);
    }
    
    createChart() {
        const ctx = document.getElementById('roi-chart');
        if (!ctx) return;
        
        const visitors = this.getInputValue('monthly-visitors') || this.defaultValues.visitors;
        const ticket = this.getInputValue('average-ticket') || this.defaultValues.ticket;
        const conversionRate = this.getInputValue('conversion-rate') || this.defaultValues.conversion;
        
        const salesWithout = (visitors * (conversionRate / 100)) * ticket;
        const salesWith = (visitors * (Math.min(conversionRate * 4, 20) / 100)) * ticket;
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['SIN Chatably', 'CON Chatably'],
                datasets: [{
                    label: 'Ventas Mensuales',
                    data: [salesWithout, salesWith],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `$${this.formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return '$' + this.formatNumber(value);
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    updateChart() {
        if (!this.chart) return;
        
        const visitors = this.getInputValue('monthly-visitors') || this.defaultValues.visitors;
        const ticket = this.getInputValue('average-ticket') || this.defaultValues.ticket;
        const conversionRate = this.getInputValue('conversion-rate') || this.defaultValues.conversion;
        
        const salesWithout = (visitors * (conversionRate / 100)) * ticket;
        const salesWith = (visitors * (Math.min(conversionRate * 4, 20) / 100)) * ticket;
        
        this.chart.data.datasets[0].data = [salesWithout, salesWith];
        this.chart.update('active');
    }
    
    trackROIInteraction() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'roi_calculator_loaded', {
                'event_category': 'engagement',
                'event_label': 'calculator_interaction'
            });
        }
    }
    
    trackROIEngagement(action, element) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'roi_calculator_engagement', {
                'event_category': 'engagement',
                'event_label': action,
                'custom_parameter': element
            });
        }
    }
    
    trackROICalculation(extraRevenue, roiPercentage) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'roi_calculator_calculated', {
                'event_category': 'conversion',
                'event_label': 'roi_calculation',
                'value': Math.round(extraRevenue),
                'custom_parameter_1': roiPercentage
            });
        }
    }
}

// Inicializar ROI Calculator cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const roiSection = document.querySelector('.roi-calculator');
    if (roiSection) {
        // Usar Intersection Observer para cargar solo cuando sea visible
        const roiObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.roiCalculator = new ROICalculator();
                    roiObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        roiObserver.observe(roiSection);
    }
});

// Global function para trackear clicks en CTA del ROI
window.trackROICTA = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'roi_cta_click', {
            'event_category': 'conversion',
            'event_label': 'roi_calculator_cta'
        });
    }
    
    // Scroll suave hacia pricing
    const pricingSection = document.getElementById('planes');
    if (pricingSection) {
        pricingSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// ===========================
// SOCIAL PROOF INTERACTIONS
// ===========================

class SocialProofManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeVideoTestimonials();
        this.initializeCaseStudyTracking();
        this.initializeScrollAnimations();
        this.initializeLogoCarousel();
        this.initializeTrustSignals();
    }

    initializeVideoTestimonials() {
        document.querySelectorAll('.video-testimonial').forEach(video => {
            video.addEventListener('click', (e) => {
                const name = video.querySelector('h4').textContent;
                const company = video.querySelector('p').textContent;
                
                // Track video interaction
                this.trackVideoClick(name, company);
                
                // Show modal or redirect to video
                this.showVideoModal(name, company);
            });
        });
    }

    showVideoModal(name, company) {
        // Create modal for video testimonial
        const modal = document.createElement('div');
        modal.className = 'modal video-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎥 Testimonio de ${name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="video-placeholder-large">
                        <p>Video testimonial de <strong>${name}</strong> de ${company}</p>
                        <p>🎬 Video disponible próximamente</p>
                        <button class="schedule-demo-btn" onclick="this.closest('.modal').remove(); document.getElementById('contacto').scrollIntoView({behavior: 'smooth'});">
                            📞 Hablar con Experto Ahora
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        [closeBtn, backdrop].forEach(el => {
            el.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });
    }

    initializeCaseStudyTracking() {
        // Track when case studies come into view
        const caseStudies = document.querySelectorAll('.case-study');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const businessName = entry.target.querySelector('h3').textContent;
                    this.trackCaseStudyView(businessName);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        caseStudies.forEach(study => observer.observe(study));

        // Track case study interactions
        caseStudies.forEach(study => {
            study.addEventListener('click', () => {
                const businessName = study.querySelector('h3').textContent;
                const metric = study.querySelector('.metric-value').textContent;
                this.trackCaseStudyClick(businessName, metric);
            });
        });
    }

    initializeScrollAnimations() {
        // Animate stats on scroll
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatsNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const successStats = document.querySelector('.success-stats');
        if (successStats) {
            statsObserver.observe(successStats);
        }
    }

    animateStatsNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            
            // Only animate numeric values
            if (/^\d+/.test(finalValue)) {
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                this.animateNumber(stat, 0, numericValue, finalValue);
            }
        });
    }

    animateNumber(element, start, end, originalText) {
        const duration = 2000;
        const increment = (end - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            // Preserve original formatting
            const newText = originalText.replace(/\d+/, Math.floor(current).toLocaleString());
            element.textContent = newText;
        }, 16);
    }

    initializeLogoCarousel() {
        // Duplicate logos for seamless loop
        const logoScrolls = document.querySelectorAll('.logos-scroll');
        logoScrolls.forEach(scroll => {
            const logos = scroll.innerHTML;
            scroll.innerHTML = logos + logos; // Duplicate for seamless loop
        });

        // Pause animation on hover
        const logoMarquees = document.querySelectorAll('.logos-marquee');
        logoMarquees.forEach(marquee => {
            marquee.addEventListener('mouseenter', () => {
                marquee.style.animationPlayState = 'paused';
            });
            
            marquee.addEventListener('mouseleave', () => {
                marquee.style.animationPlayState = 'running';
            });
        });
    }

    initializeTrustSignals() {
        document.querySelectorAll('.trust-item').forEach(trust => {
            trust.addEventListener('click', () => {
                const trustType = trust.querySelector('h4').textContent;
                this.trackTrustSignalClick(trustType);
                
                // Show more info or redirect
                if (trustType.includes('ISO')) {
                    this.showSecurityInfo();
                } else if (trustType.includes('Partner')) {
                    this.showPartnerInfo();
                }
            });
        });
    }

    showSecurityInfo() {
        alert('🔒 Chatably cumple con los más altos estándares de seguridad:\n\n• Certificación ISO 27001\n• Datos encriptados end-to-end\n• Servidores en México\n• Auditorías regulares\n• Cumplimiento GDPR');
    }

    showPartnerInfo() {
        alert('🚀 Chatably es Partner Oficial de Meta:\n\n• Acceso directo a WhatsApp Business API\n• Soporte técnico prioritario\n• Nuevas funciones antes que nadie\n• Integración certificada y segura');
    }

    // Analytics tracking methods
    trackVideoClick(name, company) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_testimonial_click', {
                'event_category': 'engagement',
                'event_label': name,
                'custom_parameter_1': company
            });
        }
    }

    trackCaseStudyView(businessName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'case_study_view', {
                'event_category': 'engagement',
                'event_label': businessName
            });
        }
    }

    trackCaseStudyClick(businessName, metric) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'case_study_click', {
                'event_category': 'engagement',
                'event_label': businessName,
                'custom_parameter_1': metric
            });
        }
    }

    trackTrustSignalClick(trustType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'trust_signal_click', {
                'event_category': 'engagement',
                'event_label': trustType
            });
        }
    }
}

// Initialize social proof interactions
document.addEventListener('DOMContentLoaded', () => {
    const socialProofSection = document.querySelector('.social-proof');
    if (socialProofSection) {
        window.socialProofManager = new SocialProofManager();
    }
});