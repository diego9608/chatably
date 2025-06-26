/**
 * Feature Toggles Configuration
 * 
 * Control which conversion optimization features are active
 * Set any feature to false to disable it completely
 * 
 * ✨ How to use:
 * - To disable a feature: set to false
 * - To enable a feature: set to true
 * - Changes take effect on page reload
 * 
 * 🧪 For A/B Testing:
 * - Test different combinations
 * - Monitor analytics to see which works best
 * - Easy rollback by changing true/false
 */

const features = {
    // 📊 ROI Calculator
    // Interactive calculator showing potential earnings
    roiCalculator: true,
    
    // 🔗 Integrations Showcase 
    // Display logos of supported platforms (WhatsApp, Instagram, etc.)
    integrations: true,
    
    // 🔥 Urgency Banner
    // "20% discount - X days left" countdown banner
    // NOTE: Disabled by default - can be overwhelming
    urgencyBanner: false,
    
    // 👥 Enhanced Social Proof
    // Testimonials with photos, animated counters, client logos
    socialProof: true,
    
    // 🔍 Searchable FAQ
    // Real-time search in FAQ section
    searchableFAQ: true
};

/**
 * Admin Panel Toggle (URL parameter: ?admin=true)
 * Allows real-time feature toggling without code changes
 */
const adminFeatures = {
    // Show admin panel if ?admin=true in URL
    adminPanel: new URLSearchParams(window.location.search).has('admin'),
    
    // Save changes to localStorage for persistence
    persistChanges: true
};

/**
 * Feature Manager
 * Handles initialization and destruction of features
 */
class FeatureManager {
    constructor() {
        this.loadedFeatures = new Set();
        this.init();
    }

    init() {
        // Load feature states from localStorage if admin panel was used
        this.loadPersistedFeatures();
        
        // Initialize enabled features
        this.initializeFeatures();
        
        // Setup admin panel if enabled
        if (adminFeatures.adminPanel) {
            this.initAdminPanel();
        }
    }

    loadPersistedFeatures() {
        if (adminFeatures.persistChanges) {
            try {
                const saved = localStorage.getItem('chatably_feature_toggles');
                if (saved) {
                    const savedFeatures = JSON.parse(saved);
                    Object.assign(features, savedFeatures);
                }
            } catch (e) {
                console.log('Could not load persisted features:', e);
            }
        }
    }

    saveFeatures() {
        if (adminFeatures.persistChanges) {
            try {
                localStorage.setItem('chatably_feature_toggles', JSON.stringify(features));
            } catch (e) {
                console.log('Could not save features:', e);
            }
        }
    }

    initializeFeatures() {
        // Wait for DOM and other scripts to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadEnabledFeatures());
        } else {
            this.loadEnabledFeatures();
        }
    }

    loadEnabledFeatures() {
        // Load features in order to avoid conflicts
        const featureOrder = [
            'urgencyBanner',    // Load first (top of page)
            'roiCalculator',
            'integrations', 
            'socialProof',
            'searchableFAQ'     // Load last (modifies existing elements)
        ];

        featureOrder.forEach(featureName => {
            if (features[featureName]) {
                this.enableFeature(featureName);
            }
        });
    }

    enableFeature(featureName) {
        if (this.loadedFeatures.has(featureName)) return;

        try {
            // Check if the feature module exists
            const featureModule = window.ConversionFeatures?.[this.getModuleName(featureName)];
            
            if (featureModule && typeof featureModule.init === 'function') {
                featureModule.init();
                this.loadedFeatures.add(featureName);
                console.log(`✅ Feature enabled: ${featureName}`);
            } else {
                console.warn(`⚠️ Feature module not found: ${featureName}`);
            }
        } catch (error) {
            console.error(`❌ Error enabling feature ${featureName}:`, error);
        }
    }

    disableFeature(featureName) {
        if (!this.loadedFeatures.has(featureName)) return;

        try {
            const featureModule = window.ConversionFeatures?.[this.getModuleName(featureName)];
            
            if (featureModule && typeof featureModule.destroy === 'function') {
                featureModule.destroy();
                this.loadedFeatures.delete(featureName);
                console.log(`🔄 Feature disabled: ${featureName}`);
            }
        } catch (error) {
            console.error(`❌ Error disabling feature ${featureName}:`, error);
        }
    }

    toggleFeature(featureName, enabled) {
        features[featureName] = enabled;
        
        if (enabled) {
            this.enableFeature(featureName);
        } else {
            this.disableFeature(featureName);
        }
        
        this.saveFeatures();
    }

    getModuleName(featureName) {
        // Convert camelCase to PascalCase for module names
        return featureName.charAt(0).toUpperCase() + featureName.slice(1);
    }

    initAdminPanel() {
        // Admin panel will be created by the admin module
        // This just sets up the foundation
        window.AdminPanel = {
            features: features,
            featureManager: this
        };
    }
}

// Export for global access
window.FeatureToggle = {
    features,
    adminFeatures,
    manager: null
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    window.FeatureToggle.manager = new FeatureManager();
});

/**
 * 📝 USAGE EXAMPLES:
 * 
 * // Disable ROI calculator
 * features.roiCalculator = false;
 * 
 * // Enable urgency banner for promotion
 * features.urgencyBanner = true;
 * 
 * // Runtime toggling (if admin panel is active)
 * window.FeatureToggle.manager.toggleFeature('socialProof', false);
 * 
 * // Check if feature is enabled
 * if (features.roiCalculator) {
 *   // Feature-specific code
 * }
 */