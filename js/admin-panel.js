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
        this.performanceMetrics = null;
        this.metricsUpdateInterval = null;
        
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
            this.performanceMetrics = window.performanceMetrics;
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
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="features">🎛️ Features</button>
                    <button class="admin-tab" data-tab="performance">📊 Performance</button>
                </div>
                
                <div class="admin-tab-content active" id="features-tab">
                    <div class="admin-header">
                        <h3>🎛️ Feature Toggles</h3>
                        <p>Control conversion features in real-time</p>
                    </div>
                    
                    <div class="admin-features">
                        ${this.generateFeatureToggles()}
                    </div>
                </div>
                
                <div class="admin-tab-content" id="performance-tab">
                    <div class="admin-header">
                        <h3>📊 Performance Metrics</h3>
                        <p>Real-time performance monitoring</p>
                    </div>
                    
                    <div class="performance-metrics" id="performance-metrics">
                        ${this.generatePerformanceMetrics()}
                    </div>
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
        this.setupPerformanceMetrics();
        
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

    generatePerformanceMetrics() {
        if (!this.performanceMetrics) {
            return `
                <div class="metrics-placeholder">
                    <p>⏳ Performance metrics loading...</p>
                </div>
            `;
        }

        const metrics = this.performanceMetrics.getMetrics();
        
        return `
            <div class="metrics-grid">
                <!-- Page Load Metrics -->
                <div class="metric-card">
                    <h4>⚡ Page Load</h4>
                    <div class="metric-value">
                        ${metrics.pageLoad.totalLoadTime || 0}ms
                    </div>
                    <div class="metric-details">
                        <small>DOM Ready: ${metrics.pageLoad.domReady || 0}ms</small>
                        <small>First Paint: ${Math.round(metrics.pageLoad.firstPaint || 0)}ms</small>
                    </div>
                </div>

                <!-- Core Web Vitals -->
                <div class="metric-card">
                    <h4>🎯 Core Web Vitals</h4>
                    <div class="metric-vitals">
                        <div class="vital">
                            <span class="vital-label">LCP</span>
                            <span class="vital-value ${this.getVitalClass(metrics.coreWebVitals.lcp?.rating)}">
                                ${metrics.coreWebVitals.lcp?.value || 0}ms
                            </span>
                        </div>
                        <div class="vital">
                            <span class="vital-label">FID</span>
                            <span class="vital-value ${this.getVitalClass(metrics.coreWebVitals.fid?.rating)}">
                                ${metrics.coreWebVitals.fid?.value || 0}ms
                            </span>
                        </div>
                        <div class="vital">
                            <span class="vital-label">CLS</span>
                            <span class="vital-value ${this.getVitalClass(metrics.coreWebVitals.cls?.rating)}">
                                ${metrics.coreWebVitals.cls?.value || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Resources -->
                <div class="metric-card">
                    <h4>📦 Resources</h4>
                    <div class="metric-value">
                        ${metrics.resources.totalRequests || 0} requests
                    </div>
                    <div class="metric-details">
                        <small>Total Size: ${metrics.resources.totalSize || 0}KB</small>
                        <small>Avg Load: ${metrics.resources.averageLoadTime || 0}ms</small>
                    </div>
                </div>

                <!-- Runtime Performance -->
                <div class="metric-card">
                    <h4>🖥️ Runtime</h4>
                    <div class="metric-value">
                        ${metrics.runtime.fps?.current || 0} FPS
                    </div>
                    <div class="metric-details">
                        <small>Avg FPS: ${metrics.runtime.fps?.average || 0}</small>
                        ${metrics.runtime.memory ? `<small>Memory: ${metrics.runtime.memory.used}MB</small>` : ''}
                    </div>
                </div>

                <!-- Feature Impact -->
                <div class="metric-card full-width">
                    <h4>🎛️ Feature Performance Impact</h4>
                    <div class="feature-metrics" id="feature-metrics">
                        ${this.generateFeatureMetrics(metrics.features)}
                    </div>
                </div>
            </div>
        `;
    }

    generateFeatureMetrics(features) {
        if (!features || Object.keys(features).length === 0) {
            return '<p class="no-features">No feature metrics available yet</p>';
        }

        return Object.entries(features).map(([name, data]) => {
            if (!data.isEnabled) return '';
            
            const impactClass = data.impact === 'high' ? 'impact-high' : 
                               data.impact === 'medium' ? 'impact-medium' : 'impact-low';
            
            return `
                <div class="feature-metric ${impactClass}">
                    <div class="feature-metric-name">${name}</div>
                    <div class="feature-metric-stats">
                        <span class="init-time">${data.initTime}ms</span>
                        <span class="dom-nodes">+${data.domNodesAdded} DOM</span>
                        <span class="impact-badge ${impactClass}">${data.impact}</span>
                    </div>
                </div>
            `;
        }).filter(Boolean).join('');
    }

    getVitalClass(rating) {
        if (!rating) return 'vital-unknown';
        return `vital-${rating.replace('-', '_')}`;
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

        // Tab switching
        const tabs = this.panel.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
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

    switchTab(tabName) {
        // Update tab buttons
        const tabs = this.panel.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        const tabContents = this.panel.querySelectorAll('.admin-tab-content');
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Start/stop performance monitoring based on active tab
        if (tabName === 'performance') {
            this.startPerformanceMonitoring();
        } else {
            this.stopPerformanceMonitoring();
        }
    }

    setupPerformanceMetrics() {
        if (this.performanceMetrics) {
            // Subscribe to performance updates
            this.performanceMetrics.onUpdate((metrics, category) => {
                this.updatePerformanceDisplay(metrics, category);
            });
        }
    }

    startPerformanceMonitoring() {
        // Update performance metrics every 2 seconds when tab is active
        if (!this.metricsUpdateInterval) {
            this.metricsUpdateInterval = setInterval(() => {
                this.refreshPerformanceMetrics();
            }, 2000);
        }
    }

    stopPerformanceMonitoring() {
        if (this.metricsUpdateInterval) {
            clearInterval(this.metricsUpdateInterval);
            this.metricsUpdateInterval = null;
        }
    }

    refreshPerformanceMetrics() {
        const performanceTab = this.panel.querySelector('#performance-metrics');
        if (performanceTab && this.performanceMetrics) {
            performanceTab.innerHTML = this.generatePerformanceMetrics().replace(
                '<div class="metrics-grid">',
                ''
            ).replace('</div>', '').trim();
        }
    }

    updatePerformanceDisplay(metrics, category) {
        // Only update if performance tab is active
        const performanceTab = this.panel.querySelector('#performance-tab');
        if (!performanceTab?.classList.contains('active')) return;

        // Update specific metric cards based on category
        if (category === 'features') {
            const featureMetricsDiv = this.panel.querySelector('#feature-metrics');
            if (featureMetricsDiv) {
                featureMetricsDiv.innerHTML = this.generateFeatureMetrics(metrics.features);
            }
        }
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

// Add CSS animations and styles for admin panel
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

    /* Admin Panel Tabs */
    .admin-tabs {
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 1rem;
    }

    .admin-tab {
        background: none;
        border: none;
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .admin-tab:hover {
        background: #f5f5f5;
    }

    .admin-tab.active {
        border-bottom-color: #4D8DFF;
        color: #4D8DFF;
        font-weight: 600;
    }

    .admin-tab-content {
        display: none;
    }

    .admin-tab-content.active {
        display: block;
    }

    /* Performance Metrics Styles */
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .metric-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
        border-left: 4px solid #4D8DFF;
    }

    .metric-card.full-width {
        grid-column: 1 / -1;
    }

    .metric-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #666;
    }

    .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .metric-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .metric-details small {
        color: #666;
        font-size: 0.8rem;
    }

    /* Core Web Vitals */
    .metric-vitals {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .vital {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 60px;
    }

    .vital-label {
        font-size: 0.7rem;
        color: #666;
        font-weight: 600;
    }

    .vital-value {
        font-size: 1rem;
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        margin-top: 0.25rem;
    }

    .vital-good {
        background: #d4edda;
        color: #155724;
    }

    .vital-needs_improvement {
        background: #fff3cd;
        color: #856404;
    }

    .vital-poor {
        background: #f8d7da;
        color: #721c24;
    }

    .vital-unknown {
        background: #e2e3e5;
        color: #6c757d;
    }

    /* Feature Metrics */
    .feature-metrics {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .feature-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: white;
        border-radius: 6px;
        border-left: 4px solid #28a745;
    }

    .feature-metric.impact-medium {
        border-left-color: #ffc107;
    }

    .feature-metric.impact-high {
        border-left-color: #dc3545;
    }

    .feature-metric-name {
        font-weight: 600;
        color: #333;
    }

    .feature-metric-stats {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .feature-metric-stats span {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: #f8f9fa;
        color: #666;
    }

    .impact-badge {
        font-weight: 600 !important;
    }

    .impact-badge.impact-low {
        background: #d4edda !important;
        color: #155724 !important;
    }

    .impact-badge.impact-medium {
        background: #fff3cd !important;
        color: #856404 !important;
    }

    .impact-badge.impact-high {
        background: #f8d7da !important;
        color: #721c24 !important;
    }

    .no-features {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 2rem;
    }

    .metrics-placeholder {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        
        .metric-vitals {
            justify-content: center;
        }
        
        .feature-metric {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(style);