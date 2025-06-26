/**
 * Admin Panel for Real-time Feature Toggling
 * 
 * Access with: ?admin=true in URL
 * Allows testing features without code changes
 */

class AdminPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.features = null;
        this.featureManager = null;
        
        this.init();
    }

    init() {
        // Only initialize if admin parameter is present
        if (!new URLSearchParams(window.location.search).has('admin')) {
            return;
        }

        // Wait for feature manager to be ready
        this.waitForFeatureManager();
    }

    waitForFeatureManager() {
        if (window.FeatureToggle?.manager) {
            this.features = window.FeatureToggle.features;
            this.featureManager = window.FeatureToggle.manager;
            this.createAdminPanel();
        } else {
            setTimeout(() => this.waitForFeatureManager(), 100);
        }
    }

    createAdminPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'admin-panel';
        this.panel.className = 'admin-panel';
        
        this.panel.innerHTML = `
            <div class="admin-panel-toggle" id="admin-toggle">
                <span class="admin-icon">⚙️</span>
                <span class="admin-text">Admin</span>
            </div>
            
            <div class="admin-panel-content" id="admin-content">
                <div class="admin-header">
                    <h3>🎛️ Feature Toggles</h3>
                    <p>Control conversion features in real-time</p>
                </div>
                
                <div class="admin-features">
                    ${this.generateFeatureToggles()}
                </div>
                
                <div class="admin-actions">
                    <button class="admin-btn primary" onclick="window.adminPanel.saveChanges()">
                        💾 Guardar cambios
                    </button>
                    <button class="admin-btn secondary" onclick="window.adminPanel.resetFeatures()">
                        🔄 Resetear todo
                    </button>
                    <button class="admin-btn secondary" onclick="window.adminPanel.exportConfig()">
                        📋 Copiar config
                    </button>
                </div>
                
                <div class="admin-info">
                    <small>
                        💡 Los cambios se guardan automáticamente en localStorage<br>
                        🔄 Recarga la página para ver todos los efectos
                    </small>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
        this.setupEventListeners();
        
        // Make globally accessible
        window.adminPanel = this;
        
        console.log('⚙️ Admin panel initialized - Feature toggles ready');
    }

    generateFeatureToggles() {
        const featureDescriptions = {
            roiCalculator: {
                name: '📊 Calculadora ROI',
                description: 'Calculadora interactiva de retorno de inversión'
            },
            integrations: {
                name: '🔗 Integraciones',
                description: 'Muestra logos de plataformas compatibles'
            },
            urgencyBanner: {
                name: '🔥 Banner de urgencia',
                description: 'Banner con descuento y countdown'
            },
            socialProof: {
                name: '👥 Social Proof',
                description: 'Testimonios mejorados y contadores animados'
            },
            searchableFAQ: {
                name: '🔍 FAQ con búsqueda',
                description: 'Búsqueda en tiempo real en FAQ'
            }
        };

        return Object.keys(this.features).map(featureKey => {
            const feature = featureDescriptions[featureKey];
            const isEnabled = this.features[featureKey];
            
            return `
                <div class="admin-feature">
                    <div class="feature-info">
                        <div class="feature-name">${feature.name}</div>
                        <div class="feature-description">${feature.description}</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" 
                               data-feature="${featureKey}" 
                               ${isEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        const toggle = document.getElementById('admin-toggle');
        const content = document.getElementById('admin-content');
        
        // Toggle panel visibility
        toggle.addEventListener('click', () => {
            this.isVisible = !this.isVisible;
            content.style.display = this.isVisible ? 'block' : 'none';
            toggle.classList.toggle('active', this.isVisible);
        });

        // Feature toggle listeners
        const checkboxes = this.panel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleFeature(e.target.dataset.feature, e.target.checked);
            });
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && this.isVisible) {
                this.closePanel();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + A to toggle admin panel
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.togglePanel();
            }
            
            // Escape to close panel
            if (e.key === 'Escape' && this.isVisible) {
                this.closePanel();
            }
        });
    }

    toggleFeature(featureKey, enabled) {
        // Update feature state
        this.features[featureKey] = enabled;
        
        // Toggle the feature in real-time
        this.featureManager.toggleFeature(featureKey, enabled);
        
        // Visual feedback
        this.showNotification(
            `${enabled ? '✅' : '❌'} ${featureKey} ${enabled ? 'activado' : 'desactivado'}`,
            enabled ? 'success' : 'warning'
        );
        
        console.log(`🎛️ Feature ${featureKey}: ${enabled ? 'ON' : 'OFF'}`);
    }

    togglePanel() {
        const toggle = document.getElementById('admin-toggle');
        if (toggle) {
            toggle.click();
        }
    }

    closePanel() {
        this.isVisible = false;
        const content = document.getElementById('admin-content');
        const toggle = document.getElementById('admin-toggle');
        
        if (content) content.style.display = 'none';
        if (toggle) toggle.classList.remove('active');
    }

    saveChanges() {
        this.featureManager.saveFeatures();
        this.showNotification('💾 Configuración guardada', 'success');
    }

    resetFeatures() {
        if (confirm('¿Seguro que quieres resetear todas las configuraciones?')) {
            // Reset to default values
            const defaultFeatures = {
                roiCalculator: true,
                integrations: true,
                urgencyBanner: false,
                socialProof: true,
                searchableFAQ: true
            };

            Object.keys(defaultFeatures).forEach(featureKey => {
                this.features[featureKey] = defaultFeatures[featureKey];
                this.featureManager.toggleFeature(featureKey, defaultFeatures[featureKey]);
                
                // Update checkbox
                const checkbox = this.panel.querySelector(`input[data-feature="${featureKey}"]`);
                if (checkbox) {
                    checkbox.checked = defaultFeatures[featureKey];
                }
            });

            localStorage.removeItem('chatably_feature_toggles');
            this.showNotification('🔄 Configuración reseteada', 'info');
        }
    }

    exportConfig() {
        const config = JSON.stringify(this.features, null, 2);
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(config).then(() => {
                this.showNotification('📋 Configuración copiada al portapapeles', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = config;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('📋 Configuración copiada', 'success');
        }
        
        console.log('Current feature config:', config);
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        
        // Position near admin panel
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 10001;
            animation: slideInLeft 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutLeft 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Auto-initialize if admin parameter is present
document.addEventListener('DOMContentLoaded', () => {
    if (new URLSearchParams(window.location.search).has('admin')) {
        new AdminPanel();
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);