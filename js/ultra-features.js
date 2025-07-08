/**
 * ULTRA FEATURES MANAGER
 * Sistema para manejar features premium y upsells futuros
 */

class UltraFeaturesManager {
    constructor() {
        this.ultraFeatures = {
            leadMachineUltra: {
                name: 'Lead Machine Ultra',
                description: 'Sistema automatizado de generación de 10,000 leads calificados/mes',
                price: 2999,
                currency: 'MXN',
                features: [
                    'Web scraping avanzado con IA',
                    'Enriquecimiento de datos en tiempo real',
                    'Lead scoring con machine learning',
                    'Integración CRM automática',
                    'Verificación de emails garantizada'
                ],
                comingSoon: true,
                earlyAccessCount: 847
            },
            emailWarming: {
                name: 'Email Warming System',
                description: 'Garantiza 0% spam y máxima entregabilidad',
                price: 999,
                currency: 'MXN',
                features: [
                    'Calentamiento automático de IPs',
                    'Rotación inteligente de dominios',
                    'Reputación garantizada 95%+',
                    'Analytics de entregabilidad',
                    'Configuración SPF/DKIM/DMARC automática'
                ],
                comingSoon: true,
                earlyAccessCount: 623
            },
            whitelabelPro: {
                name: 'White Label Enterprise',
                description: 'Tu propia plataforma de chatbots con tu marca',
                price: 4999,
                currency: 'MXN',
                features: [
                    'Dominio personalizado completo',
                    'Branding 100% personalizable',
                    'Panel de revendedor avanzado',
                    'Comisiones del 30% garantizadas',
                    'Soporte dedicado 24/7'
                ],
                available: true
            },
            aiAdvanced: {
                name: 'AI Assistant Ultra',
                description: 'IA personalizada entrenada para tu negocio específico',
                price: 1999,
                currency: 'MXN',
                features: [
                    'Entrenamiento con tus datos',
                    'Respuestas 100% personalizadas',
                    'Integración con tu base de conocimiento',
                    'Actualizaciones automáticas del modelo',
                    'Análisis de sentimientos avanzado'
                ],
                comingSoon: true,
                earlyAccessCount: 392
            }
        };
        
        this.init();
    }
    
    init() {
        this.injectStyles();
        console.log('🚀 Ultra Features Manager inicializado');
    }
    
    addUltraSection() {
        // Check if we're on the landing page
        if (!window.location.pathname.includes('index') && window.location.pathname !== '/') {
            return;
        }
        
        const ultraSection = document.createElement('section');
        ultraSection.className = 'ultra-features-section';
        ultraSection.id = 'ultra-features';
        ultraSection.innerHTML = `
            <div class="ultra-container">
                <div class="ultra-header">
                    <h2>🚀 Ultra Features - Próximamente</h2>
                    <p>Lleva tu negocio al siguiente nivel con nuestras herramientas enterprise</p>
                </div>
                
                <div class="ultra-features-grid">
                    ${Object.entries(this.ultraFeatures).map(([key, feature]) => this.createFeatureCard(key, feature)).join('')}
                </div>
                
                <div class="ultra-teaser">
                    <h3>💎 Acceso VIP Early Access</h3>
                    <p>Sé de los primeros en probar estas herramientas revolucionarias. Regístrate para acceso prioritario.</p>
                    <form class="early-access-form" onsubmit="ultraFeatures.registerEarlyAccess(event)">
                        <input type="email" placeholder="tu@email.com" required>
                        <button type="submit">🎯 Obtener Acceso VIP</button>
                    </form>
                    <p class="vip-count">🔥 ${this.getTotalEarlyAccess()} personas ya se registraron</p>
                </div>
            </div>
        `;
        
        // Insert after pricing section
        const pricingSection = document.querySelector('.pricing, #precios');
        if (pricingSection) {
            pricingSection.insertAdjacentElement('afterend', ultraSection);
        } else {
            // If no pricing section, add before footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.insertAdjacentElement('beforebegin', ultraSection);
            }
        }
        
        // Animate on scroll
        this.observeSection(ultraSection);
    }
    
    createFeatureCard(key, feature) {
        const isAvailable = !feature.comingSoon;
        const badgeText = feature.comingSoon ? 'PRÓXIMAMENTE' : 'DISPONIBLE';
        const ctaText = feature.comingSoon ? '🔔 Notificarme' : '⚡ Activar ahora';
        const ctaClass = feature.comingSoon ? 'notify-me' : 'activate-now';
        
        return `
            <div class="ultra-feature-card ${feature.comingSoon ? 'coming-soon' : 'available'}" data-feature="${key}">
                <div class="feature-badge ${isAvailable ? 'available' : 'coming-soon'}">${badgeText}</div>
                
                <div class="feature-icon">
                    ${this.getFeatureIcon(key)}
                </div>
                
                <h3 class="feature-title">${feature.name}</h3>
                <p class="feature-description">${feature.description}</p>
                
                <div class="feature-price">
                    <span class="price-amount">$${feature.price.toLocaleString()}</span>
                    <span class="price-period">/mes</span>
                </div>
                
                <ul class="feature-list">
                    ${feature.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                
                ${feature.comingSoon ? `
                    <div class="early-access-info">
                        <span class="access-count">${feature.earlyAccessCount} personas registradas</span>
                    </div>
                ` : ''}
                
                <button class="ultra-cta-btn ${ctaClass}" onclick="ultraFeatures.handleCTA('${key}')">
                    ${ctaText}
                </button>
            </div>
        `;
    }
    
    getFeatureIcon(key) {
        const icons = {
            leadMachineUltra: '🎯',
            emailWarming: '📧',
            whitelabelPro: '🏢',
            aiAdvanced: '🧠'
        };
        return icons[key] || '⚡';
    }
    
    getTotalEarlyAccess() {
        return Object.values(this.ultraFeatures)
            .filter(f => f.comingSoon)
            .reduce((total, f) => total + f.earlyAccessCount, 0);
    }
    
    handleCTA(featureKey) {
        const feature = this.ultraFeatures[featureKey];
        
        if (feature.comingSoon) {
            this.showEarlyAccessModal(feature, featureKey);
        } else {
            this.activateUltraFeature(featureKey);
        }
        
        // Track interaction
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ultra_feature_interest', {
                'event_category': 'engagement',
                'event_label': featureKey
            });
        }
    }
    
    showEarlyAccessModal(feature, featureKey) {
        const modal = document.createElement('div');
        modal.className = 'early-access-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.early-access-modal').remove()">&times;</button>
                
                <div class="modal-header">
                    <div class="feature-icon-large">${this.getFeatureIcon(featureKey)}</div>
                    <h3>🎯 Acceso Prioritario: ${feature.name}</h3>
                    <p>Sé de los primeros en usar esta herramienta revolucionaria.</p>
                </div>
                
                <div class="modal-body">
                    <div class="feature-preview">
                        <h4>Vista previa de funciones:</h4>
                        <ul class="preview-list">
                            ${feature.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="early-access-stats">
                        <div class="stat">
                            <span class="stat-number">${feature.earlyAccessCount}</span>
                            <span class="stat-label">Ya registrados</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">Q1 2025</span>
                            <span class="stat-label">Lanzamiento</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">50%</span>
                            <span class="stat-label">Descuento early access</span>
                        </div>
                    </div>
                    
                    <form class="early-access-form-modal" onsubmit="ultraFeatures.submitEarlyAccess(event, '${featureKey}')">
                        <input type="email" placeholder="tu@email.com" required>
                        <input type="tel" placeholder="WhatsApp (opcional)">
                        <textarea placeholder="¿Por qué te interesa esta herramienta?" rows="3"></textarea>
                        <button type="submit" class="submit-btn">
                            🚀 Reservar mi lugar con 50% descuento
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    activateUltraFeature(featureKey) {
        const feature = this.ultraFeatures[featureKey];
        
        // Show activation modal
        const modal = document.createElement('div');
        modal.className = 'activation-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="activation-header">
                    <h3>⚡ Activar ${feature.name}</h3>
                    <p>Complemento premium para tu plan actual</p>
                </div>
                
                <div class="activation-body">
                    <div class="price-info">
                        <span class="activation-price">$${feature.price.toLocaleString()}/mes</span>
                        <span class="price-note">Se suma a tu plan actual</span>
                    </div>
                    
                    <div class="activation-benefits">
                        <h4>Incluye:</h4>
                        <ul>
                            ${feature.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="activation-guarantee">
                        <p>✅ Garantía 30 días • Cancela cuando quieras</p>
                    </div>
                    
                    <button class="activate-btn" onclick="ultraFeatures.processActivation('${featureKey}')">
                        💎 Activar ${feature.name}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    processActivation(featureKey) {
        // In a real implementation, this would process the payment
        this.showNotification(`🎉 ${this.ultraFeatures[featureKey].name} activado correctamente!`, 'success');
        
        // Close modal
        document.querySelector('.activation-modal')?.remove();
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ultra_feature_activation', {
                'event_category': 'conversion',
                'event_label': featureKey,
                'value': this.ultraFeatures[featureKey].price
            });
        }
    }
    
    registerEarlyAccess(event) {
        event.preventDefault();
        const email = event.target.querySelector('input[type="email"]').value;
        
        // Track interest
        if (typeof gtag !== 'undefined') {
            gtag('event', 'early_access_request', {
                'event_category': 'engagement',
                'event_label': 'general_early_access'
            });
        }
        
        // Show success
        this.showNotification('✅ ¡Registrado! Serás de los primeros en saber cuando lancemos.', 'success');
        event.target.reset();
        
        // Update counter visually
        const counter = document.querySelector('.vip-count');
        if (counter) {
            const currentCount = this.getTotalEarlyAccess();
            counter.textContent = `🔥 ${currentCount + 1} personas ya se registraron`;
        }
    }
    
    submitEarlyAccess(event, featureKey) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
        
        // Track specific feature interest
        if (typeof gtag !== 'undefined') {
            gtag('event', 'early_access_request', {
                'event_category': 'engagement',
                'event_label': featureKey
            });
        }
        
        // Show success and close modal
        this.showNotification(`🎯 ¡Registrado para ${this.ultraFeatures[featureKey].name}! Te contactaremos pronto.`, 'success');
        document.querySelector('.early-access-modal')?.remove();
        
        // Update counter for this specific feature
        this.ultraFeatures[featureKey].earlyAccessCount += 1;
        const featureCard = document.querySelector(`[data-feature="${featureKey}"] .access-count`);
        if (featureCard) {
            featureCard.textContent = `${this.ultraFeatures[featureKey].earlyAccessCount} personas registradas`;
        }
    }
    
    observeSection(section) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate cards one by one
                    const cards = entry.target.querySelectorAll('.ultra-feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(section);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ultra-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Remove existing notifications
        document.querySelectorAll('.ultra-notification').forEach(n => n.remove());
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    injectStyles() {
        if (document.querySelector('#ultra-features-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'ultra-features-styles';
        styles.textContent = `
/* Ultra Features Section */
.ultra-features-section {
    padding: 6rem 5%;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
    color: white;
    position: relative;
    overflow: hidden;
}

.ultra-features-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    pointer-events: none;
}

.ultra-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}

.ultra-header {
    text-align: center;
    margin-bottom: 4rem;
}

.ultra-header h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.ultra-header p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    max-width: 600px;
    margin: 0 auto;
}

.ultra-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.ultra-feature-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: translateY(30px);
    opacity: 0;
}

.ultra-feature-card.animate-in {
    transform: translateY(0);
    opacity: 1;
}

.ultra-feature-card:hover {
    transform: translateY(-10px);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 25px 50px rgba(139, 92, 246, 0.2);
}

.ultra-feature-card.coming-soon {
    border-color: rgba(236, 72, 153, 0.3);
}

.ultra-feature-card.available {
    border-color: rgba(16, 185, 129, 0.3);
}

.feature-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
}

.feature-badge.coming-soon {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
}

.feature-badge.available {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
    text-align: center;
}

.feature-description {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
    line-height: 1.6;
    text-align: center;
}

.feature-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.price-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fbbf24;
}

.price-period {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
}

.feature-list {
    list-style: none;
    margin-bottom: 2rem;
}

.feature-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.5;
}

.feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: bold;
    font-size: 1.1rem;
}

.early-access-info {
    text-align: center;
    margin-bottom: 1.5rem;
}

.access-count {
    color: #f093fb;
    font-weight: 600;
    font-size: 0.9rem;
}

.ultra-cta-btn {
    width: 100%;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    position: relative;
    overflow: hidden;
}

.ultra-cta-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
}

.ultra-cta-btn:hover::before {
    left: 100%;
}

.ultra-cta-btn.activate-now {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.ultra-cta-btn.notify-me {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.ultra-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

/* Ultra Teaser */
.ultra-teaser {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    backdrop-filter: blur(20px);
}

.ultra-teaser h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.ultra-teaser p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.early-access-form {
    display: flex;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto 1rem;
}

.early-access-form input {
    flex: 1;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-radius: 12px;
    font-size: 1rem;
}

.early-access-form input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.early-access-form button {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.early-access-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(240, 147, 251, 0.4);
}

.vip-count {
    color: #f093fb;
    font-weight: 600;
    margin-top: 1rem;
}

/* Modal Styles */
.early-access-modal,
.activation-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.early-access-modal.show,
.activation-modal.show {
    opacity: 1;
}

.early-access-modal .modal-backdrop,
.activation-modal .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.early-access-modal .modal-content,
.activation-modal .modal-content {
    background: white;
    color: #1a1a1a;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    z-index: 1;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    z-index: 2;
}

.modal-header {
    padding: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 20px 20px 0 0;
}

.feature-icon-large {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.modal-header h3 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.modal-body {
    padding: 2rem;
}

.feature-preview h4 {
    margin-bottom: 1rem;
    color: #333;
}

.preview-list {
    list-style: none;
    margin-bottom: 2rem;
}

.preview-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
}

.preview-list li::before {
    content: '🚀';
    position: absolute;
    left: 0;
}

.early-access-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    text-align: center;
}

.stat {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 12px;
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    color: #4D8DFF;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.8rem;
    color: #666;
}

.early-access-form-modal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.early-access-form-modal input,
.early-access-form-modal textarea {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
}

.submit-btn {
    padding: 1rem;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
}

/* Activation Modal Specific */
.activation-header {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 20px 20px 0 0;
}

.price-info {
    text-align: center;
    margin-bottom: 2rem;
}

.activation-price {
    display: block;
    font-size: 2.5rem;
    font-weight: 800;
    color: #10b981;
    margin-bottom: 0.5rem;
}

.price-note {
    color: #666;
    font-size: 0.9rem;
}

.activation-benefits {
    margin-bottom: 2rem;
}

.activation-benefits h4 {
    margin-bottom: 1rem;
    color: #333;
}

.activation-benefits ul {
    list-style: none;
}

.activation-benefits li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
}

.activation-benefits li::before {
    content: '✅';
    position: absolute;
    left: 0;
}

.activation-guarantee {
    text-align: center;
    background: #f0fdf4;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.activate-btn {
    width: 100%;
    padding: 1.5rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.activate-btn:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
}

/* Ultra Notification */
.ultra-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: #10b981;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 350px;
}

.ultra-notification.success {
    background: #10b981;
}

.ultra-notification.warning {
    background: #f59e0b;
}

.ultra-notification.show {
    transform: translateX(0);
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

/* Animation */
.ultra-features-section.animate-in {
    animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .ultra-header h2 {
        font-size: 2rem;
    }
    
    .ultra-features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .early-access-form {
        flex-direction: column;
    }
    
    .early-access-stats {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .ultra-notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .ultra-notification.show {
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .ultra-features-section {
        padding: 4rem 3%;
    }
    
    .ultra-teaser {
        padding: 2rem;
    }
    
    .feature-price {
        flex-direction: column;
        gap: 0;
    }
    
    .price-amount {
        font-size: 2rem;
    }
}
        `;
        document.head.appendChild(styles);
    }
}

// Initialize Ultra Features Manager
document.addEventListener('DOMContentLoaded', () => {
    window.ultraFeatures = new UltraFeaturesManager();
    
    // Add ultra section to landing page
    if (window.location.pathname === '/' || window.location.pathname.includes('index')) {
        setTimeout(() => {
            window.ultraFeatures.addUltraSection();
        }, 1000);
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraFeaturesManager;
}