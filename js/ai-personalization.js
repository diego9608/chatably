/**
 * AI Personalization Engine
 * Adapts dashboard content based on user behavior and segment
 */

class AIPersonalizationEngine {
    constructor() {
        this.userProfile = {
            segment: 'starter',
            behaviorPattern: 'explorer',
            preferences: {},
            interactionHistory: [],
            conversionProbability: 0
        };
        
        this.personalizationRules = {
            'growth-focused': {
                insights: [
                    { type: 'tip', content: 'Conecta Instagram para aumentar tu alcance 3x', priority: 'high' },
                    { type: 'metric', content: 'Tu ROI potencial: 847% con plan Pro', priority: 'medium' },
                    { type: 'action', content: 'Configura tu primera automatización en 2 minutos', priority: 'high' }
                ],
                recommendations: ['multi-channel', 'automation', 'analytics']
            },
            'efficiency-seeker': {
                insights: [
                    { type: 'optimization', content: 'Reduce tiempo de respuesta 40% con templates IA', priority: 'high' },
                    { type: 'workflow', content: '3 flujos pueden automatizar 80% de consultas', priority: 'medium' }
                ],
                recommendations: ['ai-templates', 'bulk-actions', 'shortcuts']
            },
            'revenue-optimizer': {
                insights: [
                    { type: 'revenue', content: 'Oportunidad: $23K adicionales con campañas SMS', priority: 'high' },
                    { type: 'conversion', content: 'Tu tasa de conversión puede mejorar 34%', priority: 'medium' }
                ],
                recommendations: ['advanced-analytics', 'a-b-testing', 'crm-integration']
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.trackUserBehavior();
        this.personalizeContent();
        this.predictNextAction();
        
        // Update personalization every 30 seconds
        setInterval(() => this.updatePersonalization(), 30000);
    }
    
    loadUserProfile() {
        // Load from localStorage with privacy considerations
        const savedProfile = localStorage.getItem('ai_user_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                this.userProfile = { ...this.userProfile, ...parsed };
            } catch (e) {
                console.error('Error loading user profile:', e);
            }
        }
        
        // Detect user segment from data attributes
        const container = document.getElementById('ai-personalization-container');
        if (container) {
            this.userProfile.segment = container.dataset.userSegment || 'starter';
            this.userProfile.behaviorPattern = container.dataset.behaviorProfile || 'explorer';
        }
    }
    
    trackUserBehavior() {
        // Track clicks and interactions
        document.addEventListener('click', (e) => {
            const trackable = e.target.closest('[data-track]');
            if (trackable) {
                this.recordInteraction({
                    type: 'click',
                    element: trackable.dataset.track,
                    timestamp: Date.now()
                });
            }
        });
        
        // Track time spent on sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.recordInteraction({
                        type: 'view',
                        section: entry.target.dataset.trackSection,
                        timestamp: Date.now()
                    });
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('[data-track-section]').forEach(section => {
            observer.observe(section);
        });
    }
    
    recordInteraction(interaction) {
        this.userProfile.interactionHistory.push(interaction);
        
        // Keep only last 100 interactions for performance
        if (this.userProfile.interactionHistory.length > 100) {
            this.userProfile.interactionHistory = this.userProfile.interactionHistory.slice(-100);
        }
        
        // Update behavior pattern based on interactions
        this.analyzeBehaviorPattern();
        
        // Save profile (privacy-compliant)
        this.saveProfile();
    }
    
    analyzeBehaviorPattern() {
        const recentInteractions = this.userProfile.interactionHistory.slice(-20);
        
        // Count interaction types
        const interactionCounts = recentInteractions.reduce((acc, interaction) => {
            acc[interaction.element || interaction.section] = (acc[interaction.element || interaction.section] || 0) + 1;
            return acc;
        }, {});
        
        // Determine behavior pattern
        if (interactionCounts['analytics'] > 5 || interactionCounts['metrics'] > 3) {
            this.userProfile.behaviorPattern = 'revenue-optimizer';
        } else if (interactionCounts['automation'] > 3 || interactionCounts['flows'] > 2) {
            this.userProfile.behaviorPattern = 'efficiency-seeker';
        } else {
            this.userProfile.behaviorPattern = 'growth-focused';
        }
        
        // Calculate conversion probability
        this.calculateConversionProbability();
    }
    
    calculateConversionProbability() {
        let score = 0;
        
        // Factors that increase conversion probability
        const factors = {
            viewedPricing: 20,
            usedCalculator: 30,
            viewedAnalytics: 15,
            clickedUpgrade: 25,
            timeOnSite: Math.min(this.userProfile.interactionHistory.length, 10)
        };
        
        // Check for specific interactions
        this.userProfile.interactionHistory.forEach(interaction => {
            if (interaction.element === 'pricing') score += factors.viewedPricing;
            if (interaction.element === 'roi-calculator') score += factors.usedCalculator;
            if (interaction.section === 'analytics') score += factors.viewedAnalytics;
            if (interaction.element && interaction.element.includes('upgrade')) score += factors.clickedUpgrade;
        });
        
        score += factors.timeOnSite;
        
        this.userProfile.conversionProbability = Math.min(score, 100);
    }
    
    personalizeContent() {
        // Get personalized insights
        const insights = this.getPersonalizedInsights();
        
        // Update insights widget
        const insightsContainer = document.getElementById('personalized-insights');
        if (insightsContainer) {
            insightsContainer.innerHTML = insights.map(insight => `
                <div class="insight-item ${insight.priority}" data-ai-insight="${insight.type}">
                    <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
                    <span class="insight-text">${insight.content}</span>
                    ${insight.action ? `<button class="insight-action btn btn-sm">${insight.action}</button>` : ''}
                </div>
            `).join('');
        }
        
        // Personalize quick actions based on behavior
        this.personalizeQuickActions();
        
        // Show/hide features based on segment
        this.adaptUIForSegment();
    }
    
    getPersonalizedInsights() {
        const rules = this.personalizationRules[this.userProfile.behaviorPattern] || this.personalizationRules['growth-focused'];
        let insights = [...rules.insights];
        
        // Add dynamic insights based on real-time data
        if (this.userProfile.conversionProbability > 70) {
            insights.unshift({
                type: 'urgent',
                content: '🔥 Oferta especial: 20% descuento en Pro por las próximas 2 horas',
                priority: 'urgent',
                action: 'Aprovechar Oferta'
            });
        }
        
        // Add time-based insights
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 11) {
            insights.push({
                type: 'tip',
                content: '🌅 Mejor momento del día para enviar campañas: Ahora',
                priority: 'medium'
            });
        }
        
        return insights.slice(0, 3); // Show top 3 insights
    }
    
    getInsightIcon(type) {
        const icons = {
            tip: '💡',
            metric: '📊',
            action: '🎯',
            optimization: '⚡',
            workflow: '🔄',
            revenue: '💰',
            conversion: '📈',
            urgent: '🔥'
        };
        return icons[type] || '📌';
    }
    
    personalizeQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action-btn');
        const recommendations = this.personalizationRules[this.userProfile.behaviorPattern]?.recommendations || [];
        
        // Reorder quick actions based on user preferences
        quickActions.forEach(action => {
            const actionType = action.dataset.action;
            if (recommendations.includes(actionType)) {
                action.parentElement.style.order = '-1'; // Move to front
                action.classList.add('recommended');
            }
        });
    }
    
    adaptUIForSegment() {
        // Show/hide premium features based on segment and behavior
        if (this.userProfile.segment === 'starter' && this.userProfile.conversionProbability > 50) {
            // Highlight upgrade opportunities
            document.querySelectorAll('.premium-locked').forEach(el => {
                el.classList.add('highlight-premium');
            });
        }
        
        // Adapt messaging based on segment
        if (this.userProfile.behaviorPattern === 'revenue-optimizer') {
            // Show more revenue-focused metrics
            document.querySelectorAll('[data-metric="revenue"]').forEach(el => {
                el.classList.add('emphasized');
            });
        }
    }
    
    predictNextAction() {
        // Use simple ML-like logic to predict user's next action
        const lastActions = this.userProfile.interactionHistory.slice(-5);
        const patterns = {
            'dashboard-analytics': ['view-reports', 'export-data'],
            'settings-integration': ['connect-channel', 'test-integration'],
            'messages-inbox': ['send-message', 'create-template']
        };
        
        // Find matching pattern
        const lastPath = lastActions.map(a => a.element || a.section).join('-');
        Object.keys(patterns).forEach(pattern => {
            if (lastPath.includes(pattern)) {
                this.showPredictiveAction(patterns[pattern][0]);
            }
        });
    }
    
    showPredictiveAction(action) {
        // Create subtle predictive UI element
        const predictiveBar = document.createElement('div');
        predictiveBar.className = 'predictive-action-bar';
        predictiveBar.innerHTML = `
            <span class="predictive-text">¿Quieres ${this.getActionText(action)}?</span>
            <button class="predictive-btn" data-predicted-action="${action}">Sí, hacerlo</button>
            <button class="predictive-dismiss">No ahora</button>
        `;
        
        // Add to UI if not already present
        if (!document.querySelector('.predictive-action-bar')) {
            const mainContent = document.querySelector('.dashboard-main');
            if (mainContent) {
                mainContent.insertBefore(predictiveBar, mainContent.firstChild);
            }
        }
    }
    
    getActionText(action) {
        const actionTexts = {
            'view-reports': 'ver reportes detallados',
            'export-data': 'exportar tus datos',
            'connect-channel': 'conectar otro canal',
            'test-integration': 'probar la integración',
            'send-message': 'enviar un mensaje',
            'create-template': 'crear una plantilla'
        };
        return actionTexts[action] || action;
    }
    
    updatePersonalization() {
        // Refresh personalization based on new data
        this.analyzeBehaviorPattern();
        this.personalizeContent();
        
        // Check for segment upgrade opportunities
        if (this.userProfile.segment === 'starter' && this.userProfile.conversionProbability > 80) {
            this.triggerUpgradeNudge();
        }
    }
    
    triggerUpgradeNudge() {
        // Show contextual upgrade nudge
        const nudge = document.createElement('div');
        nudge.className = 'upgrade-nudge-contextual';
        nudge.innerHTML = `
            <div class="nudge-content">
                <span class="nudge-icon">🚀</span>
                <span class="nudge-text">Basado en tu uso, el plan Pro te ahorraría 5 horas/semana</span>
                <button class="nudge-cta">Ver Beneficios</button>
            </div>
        `;
        
        // Add to appropriate location
        const targetSection = document.querySelector('.dashboard-section.active');
        if (targetSection && !targetSection.querySelector('.upgrade-nudge-contextual')) {
            targetSection.insertBefore(nudge, targetSection.children[2]);
        }
    }
    
    saveProfile() {
        // Save profile with privacy considerations
        if (window.privacyManager && window.privacyManager.hasConsent('personalization')) {
            localStorage.setItem('ai_user_profile', JSON.stringify({
                segment: this.userProfile.segment,
                behaviorPattern: this.userProfile.behaviorPattern,
                preferences: this.userProfile.preferences,
                // Don't save full interaction history for privacy
                interactionCount: this.userProfile.interactionHistory.length,
                conversionProbability: this.userProfile.conversionProbability
            }));
        }
    }
}

// Initialize AI Personalization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiPersonalization = new AIPersonalizationEngine();
});