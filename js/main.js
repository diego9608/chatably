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

// Plan selection function for direct Stripe Payment Links - GLOBAL
window.selectPlan = function(planType) {
    const paymentLinks = {
        'básico': 'https://buy.stripe.com/28E9AS1T99SQcW18Qz7ok0b',
        'pro': 'https://buy.stripe.com/7sYfZgcxN3usbRX0k37ok0c',
        'ultra': 'https://buy.stripe.com/cNifZg0P54yw2hnfeX7ok0d'
    };
    
    console.log(`selectPlan llamado con: ${planType}`);
    
    if (paymentLinks[planType]) {
        localStorage.setItem('chatably_selected_plan', planType);
        console.log(`Usuario seleccionó plan: ${planType}`);
        console.log(`Redirigiendo a: ${paymentLinks[planType]}`);
        window.location.href = paymentLinks[planType];
    } else {
        console.error(`Plan no válido: ${planType}`);
        alert('Por favor selecciona un plan válido');
    }
}

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