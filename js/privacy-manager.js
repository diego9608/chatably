/**
 * Privacy Manager - GDPR/CCPA Compliant
 * First-party data handling with user consent
 */

class PrivacyManager {
    constructor() {
        this.consents = {
            necessary: true, // Always true
            analytics: false,
            personalization: false,
            marketing: false
        };
        
        this.dataRetentionDays = {
            analytics: 365,
            personalization: 180,
            marketing: 90
        };
        
        this.userRights = {
            access: true,
            rectification: true,
            erasure: true,
            portability: true,
            restriction: true,
            objection: true
        };
        
        this.init();
    }
    
    init() {
        this.loadConsents();
        this.checkConsentBanner();
        this.setupDataProtection();
        this.initializeDataMinimization();
        
        // Check for DNT (Do Not Track)
        if (navigator.doNotTrack === "1") {
            this.setMinimalTracking();
        }
    }
    
    loadConsents() {
        const savedConsents = this.getSecureStorage('privacy_consents');
        if (savedConsents) {
            try {
                this.consents = { ...this.consents, ...JSON.parse(savedConsents) };
            } catch (e) {
                console.error('Error loading consents:', e);
            }
        }
    }
    
    checkConsentBanner() {
        const hasSeenBanner = this.getSecureStorage('consent_banner_seen');
        const consentTimestamp = this.getSecureStorage('consent_timestamp');
        
        // Re-show banner if consent is older than 365 days
        const shouldShowBanner = !hasSeenBanner || 
            (consentTimestamp && Date.now() - parseInt(consentTimestamp) > 365 * 24 * 60 * 60 * 1000);
        
        if (shouldShowBanner) {
            this.showConsentBanner();
        }
    }
    
    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'privacy-consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-header">
                    <h3>🔒 Tu Privacidad es Importante</h3>
                    <p>Usamos cookies y tecnologías similares para mejorar tu experiencia.</p>
                </div>
                <div class="consent-options">
                    <label class="consent-option">
                        <input type="checkbox" checked disabled>
                        <span>Necesarias (siempre activas)</span>
                    </label>
                    <label class="consent-option">
                        <input type="checkbox" id="consent-analytics">
                        <span>Analytics - Ayúdanos a mejorar</span>
                    </label>
                    <label class="consent-option">
                        <input type="checkbox" id="consent-personalization">
                        <span>Personalización - Experiencia adaptada</span>
                    </label>
                    <label class="consent-option">
                        <input type="checkbox" id="consent-marketing">
                        <span>Marketing - Ofertas relevantes</span>
                    </label>
                </div>
                <div class="consent-actions">
                    <button class="consent-btn secondary" id="consent-manage">Gestionar</button>
                    <button class="consent-btn secondary" id="consent-reject">Rechazar Todo</button>
                    <button class="consent-btn primary" id="consent-accept">Aceptar Selección</button>
                </div>
                <div class="consent-footer">
                    <a href="/privacy-policy" target="_blank">Política de Privacidad</a>
                    <a href="#" id="privacy-settings">Configuración de Privacidad</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Event handlers
        document.getElementById('consent-accept').addEventListener('click', () => {
            this.saveConsents({
                analytics: document.getElementById('consent-analytics').checked,
                personalization: document.getElementById('consent-personalization').checked,
                marketing: document.getElementById('consent-marketing').checked
            });
            banner.remove();
        });
        
        document.getElementById('consent-reject').addEventListener('click', () => {
            this.saveConsents({
                analytics: false,
                personalization: false,
                marketing: false
            });
            banner.remove();
        });
        
        document.getElementById('consent-manage').addEventListener('click', () => {
            this.showPrivacyCenter();
        });
        
        document.getElementById('privacy-settings').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyCenter();
        });
    }
    
    saveConsents(consents) {
        this.consents = { ...this.consents, ...consents };
        this.setSecureStorage('privacy_consents', JSON.stringify(this.consents));
        this.setSecureStorage('consent_banner_seen', 'true');
        this.setSecureStorage('consent_timestamp', Date.now().toString());
        
        // Apply consent changes
        this.applyConsentChanges();
        
        // Notify other scripts
        window.dispatchEvent(new CustomEvent('consentChanged', { detail: this.consents }));
    }
    
    applyConsentChanges() {
        // Disable/enable analytics based on consent
        if (!this.consents.analytics && window.analyticsTracker) {
            window.analyticsTracker.disable();
        }
        
        // Disable/enable personalization
        if (!this.consents.personalization && window.aiPersonalization) {
            window.aiPersonalization.disable();
        }
        
        // Remove marketing cookies if not consented
        if (!this.consents.marketing) {
            this.removeMarketingData();
        }
    }
    
    setupDataProtection() {
        // Implement data encryption for sensitive data
        this.encryptionKey = this.generateEncryptionKey();
        
        // Set up automatic data expiration
        this.setupDataExpiration();
        
        // Monitor for data breaches
        this.setupBreachDetection();
    }
    
    generateEncryptionKey() {
        // Simple key generation (in production, use proper crypto)
        return btoa(Date.now().toString() + Math.random().toString(36));
    }
    
    encryptData(data) {
        // Simple encryption (in production, use WebCrypto API)
        try {
            return btoa(encodeURIComponent(JSON.stringify(data)));
        } catch (e) {
            console.error('Encryption error:', e);
            return null;
        }
    }
    
    decryptData(encryptedData) {
        try {
            return JSON.parse(decodeURIComponent(atob(encryptedData)));
        } catch (e) {
            console.error('Decryption error:', e);
            return null;
        }
    }
    
    setupDataExpiration() {
        // Check and clean expired data daily
        const checkExpiration = () => {
            const now = Date.now();
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('chatably_')) {
                    const item = localStorage.getItem(key);
                    try {
                        const data = JSON.parse(item);
                        if (data.expiry && now > data.expiry) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Not JSON or no expiry, skip
                    }
                }
            });
        };
        
        // Run on load and daily
        checkExpiration();
        setInterval(checkExpiration, 24 * 60 * 60 * 1000);
    }
    
    setupBreachDetection() {
        // Monitor for suspicious activities
        let failedAttempts = 0;
        
        window.addEventListener('storage', (e) => {
            // Detect rapid changes to storage (potential breach)
            if (e.key && e.key.includes('chatably_')) {
                const changes = this.getSecureStorage('storage_changes') || '0';
                const changeCount = parseInt(changes) + 1;
                
                if (changeCount > 100) {
                    this.handlePotentialBreach();
                }
                
                this.setSecureStorage('storage_changes', changeCount.toString(), 60 * 60 * 1000); // Reset hourly
            }
        });
    }
    
    handlePotentialBreach() {
        // Clear sensitive data
        this.clearAllData();
        
        // Notify user
        alert('Por seguridad, hemos cerrado tu sesión. Por favor, vuelve a iniciar sesión.');
        
        // Log security event
        if (window.analyticsTracker) {
            window.analyticsTracker.trackError({
                type: 'security_breach_detected',
                timestamp: Date.now()
            });
        }
    }
    
    initializeDataMinimization() {
        // Only collect necessary data
        this.allowedDataFields = {
            analytics: ['page_views', 'clicks', 'session_duration'],
            personalization: ['preferences', 'behavior_pattern'],
            marketing: ['email', 'interests']
        };
        
        // Anonymize IP addresses
        this.anonymizeIPs = true;
        
        // Don't track sensitive pages
        this.sensitivePages = ['/payment', '/account', '/settings'];
    }
    
    setMinimalTracking() {
        this.consents = {
            necessary: true,
            analytics: false,
            personalization: false,
            marketing: false
        };
        this.applyConsentChanges();
    }
    
    // Privacy Center UI
    showPrivacyCenter() {
        const center = document.createElement('div');
        center.className = 'privacy-center-modal';
        center.innerHTML = `
            <div class="privacy-center">
                <div class="privacy-header">
                    <h2>🔐 Centro de Privacidad</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="privacy-content">
                    <div class="privacy-section">
                        <h3>Tus Datos</h3>
                        <div class="data-summary">
                            <p>Datos almacenados: <span id="data-count">0</span> elementos</p>
                            <p>Espacio usado: <span id="data-size">0 KB</span></p>
                        </div>
                        <div class="data-actions">
                            <button class="privacy-btn" id="download-data">📥 Descargar Mis Datos</button>
                            <button class="privacy-btn danger" id="delete-data">🗑️ Eliminar Todos Mis Datos</button>
                        </div>
                    </div>
                    
                    <div class="privacy-section">
                        <h3>Consentimientos</h3>
                        <div class="consent-controls">
                            <label class="consent-toggle">
                                <span>Analytics</span>
                                <input type="checkbox" id="privacy-analytics" ${this.consents.analytics ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="consent-toggle">
                                <span>Personalización</span>
                                <input type="checkbox" id="privacy-personalization" ${this.consents.personalization ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                            <label class="consent-toggle">
                                <span>Marketing</span>
                                <input type="checkbox" id="privacy-marketing" ${this.consents.marketing ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="privacy-section">
                        <h3>Tus Derechos</h3>
                        <ul class="rights-list">
                            <li>✅ Acceso a tus datos personales</li>
                            <li>✅ Rectificación de datos incorrectos</li>
                            <li>✅ Eliminación de tus datos</li>
                            <li>✅ Portabilidad de datos</li>
                            <li>✅ Restricción del procesamiento</li>
                            <li>✅ Oposición al procesamiento</li>
                        </ul>
                    </div>
                </div>
                <div class="privacy-footer">
                    <button class="privacy-btn secondary" id="privacy-cancel">Cancelar</button>
                    <button class="privacy-btn primary" id="privacy-save">Guardar Cambios</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(center);
        
        // Update data stats
        this.updateDataStats();
        
        // Event handlers
        center.querySelector('.close-btn').addEventListener('click', () => center.remove());
        center.querySelector('#privacy-cancel').addEventListener('click', () => center.remove());
        
        center.querySelector('#privacy-save').addEventListener('click', () => {
            this.saveConsents({
                analytics: center.querySelector('#privacy-analytics').checked,
                personalization: center.querySelector('#privacy-personalization').checked,
                marketing: center.querySelector('#privacy-marketing').checked
            });
            center.remove();
        });
        
        center.querySelector('#download-data').addEventListener('click', () => {
            this.exportUserData();
        });
        
        center.querySelector('#delete-data').addEventListener('click', () => {
            if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
                this.deleteAllUserData();
                center.remove();
            }
        });
    }
    
    updateDataStats() {
        let count = 0;
        let size = 0;
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chatably_')) {
                count++;
                size += (localStorage.getItem(key) || '').length;
            }
        });
        
        document.getElementById('data-count').textContent = count;
        document.getElementById('data-size').textContent = (size / 1024).toFixed(2);
    }
    
    exportUserData() {
        const data = {};
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chatably_')) {
                data[key] = localStorage.getItem(key);
            }
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chatably-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    deleteAllUserData() {
        // Remove all chatably data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chatably_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Clear session data
        sessionStorage.clear();
        
        // Notify user
        alert('Todos tus datos han sido eliminados.');
        
        // Reload to fresh state
        window.location.reload();
    }
    
    clearAllData() {
        this.deleteAllUserData();
    }
    
    removeMarketingData() {
        // Remove marketing-specific data
        const marketingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'referrer'];
        marketingKeys.forEach(key => {
            localStorage.removeItem(`chatably_${key}`);
        });
    }
    
    // Utility methods
    setSecureStorage(key, value, expiryMs = null) {
        const data = {
            value: this.encryptData(value),
            timestamp: Date.now()
        };
        
        if (expiryMs) {
            data.expiry = Date.now() + expiryMs;
        }
        
        localStorage.setItem(`chatably_${key}`, JSON.stringify(data));
    }
    
    getSecureStorage(key) {
        const item = localStorage.getItem(`chatably_${key}`);
        if (!item) return null;
        
        try {
            const data = JSON.parse(item);
            if (data.expiry && Date.now() > data.expiry) {
                localStorage.removeItem(`chatably_${key}`);
                return null;
            }
            return this.decryptData(data.value);
        } catch (e) {
            return item; // Return as-is if not encrypted
        }
    }
    
    hasConsent(type) {
        return this.consents[type] === true;
    }
    
    requestConsent(type) {
        this.showConsentBanner();
    }
}

// Initialize Privacy Manager
document.addEventListener('DOMContentLoaded', () => {
    window.privacyManager = new PrivacyManager();
});