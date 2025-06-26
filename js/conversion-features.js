/**
 * Conversion Optimization Features
 * 
 * Modular features that can be enabled/disabled via feature toggles
 * Each module has init() and destroy() methods for clean setup/teardown
 */

window.ConversionFeatures = {};

/**
 * 📊 ROI Calculator Module
 * Interactive calculator showing potential earnings increase
 */
window.ConversionFeatures.RoiCalculator = {
    enabled: false,
    container: null,

    init() {
        if (this.enabled) return;
        
        this.createCalculator();
        this.setupEventListeners();
        this.enabled = true;
        console.log('📊 ROI Calculator initialized');
    },

    destroy() {
        if (!this.enabled) return;
        
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.enabled = false;
        console.log('📊 ROI Calculator destroyed');
    },

    createCalculator() {
        // Find insertion point (after hero section)
        const hero = document.querySelector('.hero');
        if (!hero) return;

        this.container = document.createElement('section');
        this.container.className = 'roi-calculator';
        this.container.id = 'roi-calculator';
        
        this.container.innerHTML = `
            <div class="calculator-container">
                <h2 class="section-title">Calcula tu ROI con Chatably</h2>
                <p class="calculator-subtitle">
                    Descubre cuánto dinero adicional podrías generar automatizando tu atención al cliente
                </p>
                
                <div class="calculator-grid">
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <label for="monthly-messages">¿Cuántos mensajes recibes al mes?</label>
                            <input type="number" id="monthly-messages" placeholder="Ej: 500" min="1" max="50000">
                            <small>Incluye WhatsApp, Instagram, Facebook, etc.</small>
                        </div>
                        
                        <div class="input-group">
                            <label for="client-value">¿Cuánto vale cada cliente promedio?</label>
                            <input type="number" id="client-value" placeholder="Ej: 1500" min="1" max="1000000">
                            <small>Ticket promedio en pesos mexicanos</small>
                        </div>
                        
                        <button class="calculate-btn" id="calculate-roi">
                            🧮 Calcular mi ROI
                        </button>
                    </div>
                    
                    <div class="calculator-results" id="calculator-results" style="display: none;">
                        <div class="result-card">
                            <div class="result-icon">💰</div>
                            <h3>Ingresos adicionales estimados</h3>
                            <div class="result-amount" id="monthly-extra">$0</div>
                            <div class="result-period">por mes</div>
                        </div>
                        
                        <div class="result-breakdown">
                            <h4>Desglose del cálculo:</h4>
                            <div class="breakdown-item">
                                <span>Mensajes perdidos sin automatización:</span>
                                <span id="lost-messages">0</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Conversiones adicionales con Chatably:</span>
                                <span id="extra-conversions">0</span>
                            </div>
                            <div class="breakdown-item">
                                <span>ROI en el primer año:</span>
                                <span id="yearly-roi">0%</span>
                            </div>
                        </div>
                        
                        <div class="cta-after-calc">
                            <a href="#planes" class="cta-button">¡Quiero estos resultados!</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        hero.insertAdjacentElement('afterend', this.container);
    },

    setupEventListeners() {
        const calculateBtn = document.getElementById('calculate-roi');
        const monthlyMessages = document.getElementById('monthly-messages');
        const clientValue = document.getElementById('client-value');

        // Calculate on button click
        calculateBtn?.addEventListener('click', () => this.calculateROI());

        // Calculate on Enter key
        [monthlyMessages, clientValue].forEach(input => {
            input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculateROI();
            });
        });

        // Enable/disable button based on inputs
        [monthlyMessages, clientValue].forEach(input => {
            input?.addEventListener('input', () => this.updateCalculateButton());
        });
    },

    updateCalculateButton() {
        const calculateBtn = document.getElementById('calculate-roi');
        const monthlyMessages = document.getElementById('monthly-messages');
        const clientValue = document.getElementById('client-value');
        
        const hasValues = monthlyMessages?.value && clientValue?.value;
        if (calculateBtn) {
            calculateBtn.disabled = !hasValues;
            calculateBtn.style.opacity = hasValues ? '1' : '0.6';
        }
    },

    calculateROI() {
        const monthlyMessages = parseInt(document.getElementById('monthly-messages')?.value || 0);
        const clientValue = parseInt(document.getElementById('client-value')?.value || 0);
        
        if (monthlyMessages <= 0 || clientValue <= 0) return;

        // ROI calculation logic
        const lostMessagesRate = 0.30; // 30% of messages lost without automation
        const conversionRate = 0.15; // 15% conversion rate with Chatably
        const monthlyPlan = 2400; // Average plan cost

        const lostMessages = Math.round(monthlyMessages * lostMessagesRate);
        const extraConversions = Math.round(lostMessages * conversionRate);
        const monthlyExtra = extraConversions * clientValue;
        const yearlyROI = Math.round(((monthlyExtra * 12 - monthlyPlan * 12) / (monthlyPlan * 12)) * 100);

        // Display results
        this.displayResults({
            monthlyExtra,
            lostMessages,
            extraConversions,
            yearlyROI
        });
    },

    displayResults(results) {
        const resultsContainer = document.getElementById('calculator-results');
        const monthlyExtraEl = document.getElementById('monthly-extra');
        const lostMessagesEl = document.getElementById('lost-messages');
        const extraConversionsEl = document.getElementById('extra-conversions');
        const yearlyROIEl = document.getElementById('yearly-roi');

        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Animate numbers
        this.animateNumber(monthlyExtraEl, results.monthlyExtra, '$', ' MXN');
        this.animateNumber(lostMessagesEl, results.lostMessages);
        this.animateNumber(extraConversionsEl, results.extraConversions);
        this.animateNumber(yearlyROIEl, results.yearlyROI, '', '%');
    },

    animateNumber(element, target, prefix = '', suffix = '') {
        if (!element) return;
        
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.round(current).toLocaleString('es-MX') + suffix;
        }, 50);
    }
};

/**
 * 🔗 Integrations Section Module
 * Showcase supported platforms and tools
 */
window.ConversionFeatures.Integrations = {
    enabled: false,
    container: null,

    init() {
        if (this.enabled) return;
        
        this.createIntegrationsSection();
        this.enabled = true;
        console.log('🔗 Integrations section initialized');
    },

    destroy() {
        if (!this.enabled) return;
        
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.enabled = false;
        console.log('🔗 Integrations section destroyed');
    },

    createIntegrationsSection() {
        // Find insertion point (after how it works section)
        const howItWorks = document.querySelector('.how-it-works');
        if (!howItWorks) return;

        this.container = document.createElement('section');
        this.container.className = 'integrations';
        this.container.id = 'integrations';
        
        this.container.innerHTML = `
            <h2 class="section-title">Se integra con tus herramientas favoritas</h2>
            <p style="text-align: center; color: var(--text-gray); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                Chatably se conecta perfectamente con las plataformas que ya usas
            </p>
            
            <div class="integrations-grid">
                <div class="integration-category">
                    <h3>Canales de comunicación</h3>
                    <div class="integration-logos">
                        <div class="integration-item">
                            <div class="integration-logo whatsapp">
                                <span>💬</span>
                            </div>
                            <span>WhatsApp Business</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo instagram">
                                <span>📷</span>
                            </div>
                            <span>Instagram</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo messenger">
                                <span>💬</span>
                            </div>
                            <span>Messenger</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo telegram">
                                <span>✈️</span>
                            </div>
                            <span>Telegram</span>
                        </div>
                    </div>
                </div>
                
                <div class="integration-category">
                    <h3>Gestión y productividad</h3>
                    <div class="integration-logos">
                        <div class="integration-item">
                            <div class="integration-logo calendar">
                                <span>📅</span>
                            </div>
                            <span>Google Calendar</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo sheets">
                                <span>📊</span>
                            </div>
                            <span>Google Sheets</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo zapier">
                                <span>⚡</span>
                            </div>
                            <span>Zapier</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo webhook">
                                <span>🔗</span>
                            </div>
                            <span>Webhooks</span>
                        </div>
                    </div>
                </div>
                
                <div class="integration-category">
                    <h3>CRMs populares</h3>
                    <div class="integration-logos">
                        <div class="integration-item">
                            <div class="integration-logo hubspot">
                                <span>🧡</span>
                            </div>
                            <span>HubSpot</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo salesforce">
                                <span>☁️</span>
                            </div>
                            <span>Salesforce</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo pipedrive">
                                <span>🔄</span>
                            </div>
                            <span>Pipedrive</span>
                        </div>
                        <div class="integration-item">
                            <div class="integration-logo monday">
                                <span>📋</span>
                            </div>
                            <span>Monday.com</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <p style="color: var(--text-gray); margin-bottom: 1rem;">
                    ¿No ves tu herramienta? También tenemos API abierta para integraciones personalizadas
                </p>
                <a href="#contacto" class="secondary-button">Consultar integración personalizada</a>
            </div>
        `;

        howItWorks.insertAdjacentElement('afterend', this.container);
    }
};

/**
 * 🔥 Urgency Banner Module
 * Limited time offer with countdown
 */
window.ConversionFeatures.UrgencyBanner = {
    enabled: false,
    container: null,
    countdown: null,

    init() {
        if (this.enabled) return;
        
        this.createUrgencyBanner();
        this.startCountdown();
        this.enabled = true;
        console.log('🔥 Urgency banner initialized');
    },

    destroy() {
        if (!this.enabled) return;
        
        if (this.countdown) {
            clearInterval(this.countdown);
            this.countdown = null;
        }
        
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.enabled = false;
        console.log('🔥 Urgency banner destroyed');
    },

    createUrgencyBanner() {
        this.container = document.createElement('div');
        this.container.className = 'urgency-banner';
        this.container.id = 'urgency-banner';
        
        this.container.innerHTML = `
            <div class="urgency-content">
                <div class="urgency-text">
                    <span class="urgency-icon">🔥</span>
                    <span class="urgency-offer">Oferta especial: 20% de descuento</span>
                    <span class="urgency-limit">Para los primeros 100 clientes</span>
                </div>
                <div class="urgency-countdown">
                    <span class="countdown-label">Quedan:</span>
                    <div class="countdown-timer">
                        <span id="countdown-days">0</span>d
                        <span id="countdown-hours">0</span>h
                        <span id="countdown-minutes">0</span>m
                        <span id="countdown-seconds">0</span>s
                    </div>
                </div>
                <button class="urgency-close" onclick="this.parentElement.parentElement.style.display='none'">
                    ×
                </button>
            </div>
        `;

        // Insert at the very top of the page
        document.body.insertBefore(this.container, document.body.firstChild);
        
        // Adjust body padding to account for banner
        document.body.style.paddingTop = '60px';
    },

    startCountdown() {
        // Set countdown to 7 days from now
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        
        this.countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance < 0) {
                clearInterval(this.countdown);
                this.container?.remove();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('countdown-days');
            const hoursEl = document.getElementById('countdown-hours');
            const minutesEl = document.getElementById('countdown-minutes');
            const secondsEl = document.getElementById('countdown-seconds');

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }, 1000);
    }
};

/**
 * 👥 Enhanced Social Proof Module
 * Testimonials, counters, and client logos
 */
window.ConversionFeatures.SocialProof = {
    enabled: false,
    containers: [],

    init() {
        if (this.enabled) return;
        
        this.enhanceExistingTestimonials();
        this.addSocialProofStats();
        this.addClientLogos();
        this.enabled = true;
        console.log('👥 Social proof enhanced');
    },

    destroy() {
        if (!this.enabled) return;
        
        this.containers.forEach(container => container?.remove());
        this.containers = [];
        this.restoreOriginalTestimonials();
        this.enabled = false;
        console.log('👥 Social proof destroyed');
    },

    enhanceExistingTestimonials() {
        const testimonialSteps = document.querySelectorAll('.demo .steps .step');
        
        testimonialSteps.forEach((step, index) => {
            const testimonialData = this.getTestimonialData(index);
            if (testimonialData) {
                // Add photo placeholder
                const photoDiv = document.createElement('div');
                photoDiv.className = 'testimonial-photo';
                photoDiv.innerHTML = `<div class="photo-placeholder">${testimonialData.initials}</div>`;
                
                step.insertBefore(photoDiv, step.firstChild);
                step.classList.add('testimonial-enhanced');
            }
        });
    },

    addSocialProofStats() {
        const stats = document.querySelector('.stats');
        if (!stats) return;

        const socialStats = document.createElement('div');
        socialStats.className = 'social-proof-stats';
        socialStats.id = 'social-proof-stats';
        
        socialStats.innerHTML = `
            <div class="social-stat">
                <div class="social-stat-number" data-target="247">0</div>
                <div class="social-stat-label">Negocios confían en Chatably</div>
            </div>
            <div class="social-stat">
                <div class="social-stat-number" data-target="15420">0</div>
                <div class="social-stat-label">Mensajes automatizados hoy</div>
            </div>
            <div class="social-stat">
                <div class="social-stat-number" data-target="98">0</div>
                <div class="social-stat-label">% de satisfacción</div>
            </div>
        `;

        stats.appendChild(socialStats);
        this.containers.push(socialStats);
        
        // Animate counters when visible
        this.setupCounterAnimation(socialStats);
    },

    addClientLogos() {
        const demo = document.querySelector('.demo');
        if (!demo) return;

        const clientLogos = document.createElement('div');
        clientLogos.className = 'client-logos';
        clientLogos.id = 'client-logos';
        
        clientLogos.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 2rem; color: var(--text-gray);">
                Empresas que ya automatizaron con Chatably
            </h3>
            <div class="logos-grid">
                <div class="client-logo">
                    <div class="logo-placeholder">🏥</div>
                    <span>Dental Sonrisas</span>
                </div>
                <div class="client-logo">
                    <div class="logo-placeholder">🍕</div>
                    <span>El Buen Sabor</span>
                </div>
                <div class="client-logo">
                    <div class="logo-placeholder">🏠</div>
                    <span>Inmobiliaria Prime</span>
                </div>
                <div class="client-logo">
                    <div class="logo-placeholder">💄</div>
                    <span>Beauty Studio</span>
                </div>
                <div class="client-logo">
                    <div class="logo-placeholder">⚽</div>
                    <span>Gym Fitness</span>
                </div>
                <div class="client-logo">
                    <div class="logo-placeholder">📚</div>
                    <span>Academia Plus</span>
                </div>
            </div>
        `;

        demo.appendChild(clientLogos);
        this.containers.push(clientLogos);
    },

    setupCounterAnimation(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(container);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(container);
    },

    animateCounters(container) {
        const counters = container.querySelectorAll('.social-stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.round(current).toLocaleString('es-MX');
            }, 40);
        });
    },

    getTestimonialData(index) {
        const testimonials = [
            { initials: 'MG', name: 'María González' },
            { initials: 'CM', name: 'Carlos Mendoza' },
            { initials: 'AR', name: 'Ana Rodríguez' }
        ];
        return testimonials[index];
    },

    restoreOriginalTestimonials() {
        const enhancedTestimonials = document.querySelectorAll('.testimonial-enhanced');
        enhancedTestimonials.forEach(testimonial => {
            const photo = testimonial.querySelector('.testimonial-photo');
            if (photo) photo.remove();
            testimonial.classList.remove('testimonial-enhanced');
        });
    }
};

/**
 * 🔍 Searchable FAQ Module
 * Real-time search in FAQ section
 */
window.ConversionFeatures.SearchableFAQ = {
    enabled: false,
    container: null,
    originalFAQs: [],

    init() {
        if (this.enabled) return;
        
        this.enhanceFAQSection();
        this.setupSearch();
        this.enabled = true;
        console.log('🔍 Searchable FAQ initialized');
    },

    destroy() {
        if (!this.enabled) return;
        
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.restoreOriginalFAQ();
        this.enabled = false;
        console.log('🔍 Searchable FAQ destroyed');
    },

    enhanceFAQSection() {
        const faqSection = document.querySelector('.faq');
        if (!faqSection) return;

        // Store original FAQs
        this.originalFAQs = Array.from(faqSection.querySelectorAll('.faq-item'));

        // Add search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'faq-search-container';
        searchContainer.id = 'faq-search-container';
        
        searchContainer.innerHTML = `
            <div class="faq-search-box">
                <input type="text" id="faq-search" placeholder="🔍 Busca tu pregunta..." autocomplete="off">
                <div class="search-results-count" id="search-results-count"></div>
            </div>
        `;

        // Insert search box before FAQ grid
        const faqGrid = faqSection.querySelector('.faq-grid');
        if (faqGrid) {
            faqGrid.insertBefore(searchContainer, faqGrid.firstChild);
        }

        this.container = searchContainer;
    },

    setupSearch() {
        const searchInput = document.getElementById('faq-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value.toLowerCase().trim());
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.performSearch('');
                searchInput.blur();
            }
        });
    },

    performSearch(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        const resultsCount = document.getElementById('search-results-count');
        let visibleCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
            const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
            
            const matches = !query || question.includes(query) || answer.includes(query);
            
            if (matches) {
                item.style.display = 'block';
                this.highlightText(item, query);
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update results count
        if (resultsCount) {
            if (query) {
                resultsCount.textContent = `${visibleCount} resultado${visibleCount !== 1 ? 's' : ''}`;
                resultsCount.style.display = 'block';
            } else {
                resultsCount.style.display = 'none';
            }
        }

        // Show "no results" message if needed
        this.toggleNoResultsMessage(visibleCount === 0 && query);
    },

    highlightText(item, query) {
        if (!query) return;

        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        [question, answer].forEach(element => {
            if (element && element.dataset.originalText) {
                element.innerHTML = element.dataset.originalText;
            } else if (element) {
                element.dataset.originalText = element.innerHTML;
            }

            if (element && query) {
                const regex = new RegExp(`(${query})`, 'gi');
                element.innerHTML = element.innerHTML.replace(regex, '<mark>$1</mark>');
            }
        });
    },

    toggleNoResultsMessage(show) {
        let noResults = document.getElementById('faq-no-results');
        
        if (show && !noResults) {
            noResults = document.createElement('div');
            noResults.id = 'faq-no-results';
            noResults.className = 'faq-no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <div class="no-results-icon">🤔</div>
                    <h3>No encontramos esa pregunta</h3>
                    <p>¿No encuentras lo que buscas? Contáctanos directamente</p>
                    <a href="#contacto" class="cta-button">Hacer mi pregunta</a>
                </div>
            `;
            
            const faqGrid = document.querySelector('.faq-grid');
            if (faqGrid) faqGrid.appendChild(noResults);
        } else if (!show && noResults) {
            noResults.remove();
        }
    },

    restoreOriginalFAQ() {
        // Remove highlights
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.style.display = 'block';
            
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            [question, answer].forEach(element => {
                if (element?.dataset.originalText) {
                    element.innerHTML = element.dataset.originalText;
                    delete element.dataset.originalText;
                }
            });
        });

        // Remove no results message
        const noResults = document.getElementById('faq-no-results');
        if (noResults) noResults.remove();
    }
};

console.log('🎯 Conversion features loaded and ready');