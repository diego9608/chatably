/**
 * CHATABLY DASHBOARD CONTROLLER
 * Premium JavaScript para dashboard nivel Apple/Netlify/Scale AI
 */

class DashboardController {
    constructor() {
        this.currentSection = 'inicio';
        this.charts = {};
        this.realTimeInterval = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Chatably Dashboard inicializado');
        
        this.initializeUser();
        this.initializeNavigation();
        this.initializeCharts();
        this.initializeWhatsAppConnection();
        this.initializeModals();
        this.initializeRealTimeUpdates();
        this.initializeAnimations();
        this.initializeOnboardingSystem();
        
        // Show welcome notification
        setTimeout(() => {
            this.showNotification('¡Bienvenido a tu dashboard de Chatably!', 'success');
        }, 1000);
    }

    /**
     * Initialize user data and personalization
     */
    initializeUser() {
        try {
            // Detect user plan and email
            const userPlan = localStorage.getItem('chatably_selected_plan') || 'pro';
            const userEmail = localStorage.getItem('chatably_user_email') || 'usuario@ejemplo.com';
            
            // Update UI elements
            const planNameEl = document.querySelector('.plan-name');
            const userNameEl = document.querySelector('.user-name');
            
            if (planNameEl) {
                planNameEl.textContent = `Plan ${this.capitalize(userPlan)}`;
            }
            
            if (userNameEl) {
                userNameEl.textContent = this.getBusinessName(userEmail);
            }
            
            // Update user avatar
            const avatarEl = document.querySelector('.user-avatar');
            if (avatarEl) {
                const businessName = this.getBusinessName(userEmail);
                avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=4D8DFF&color=fff&size=64`;
            }
            
            console.log(`👤 Usuario inicializado: ${userPlan} plan`);
        } catch (error) {
            console.error('Error inicializando usuario:', error);
        }
    }

    /**
     * Initialize smooth navigation between sections
     */
    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const sections = document.querySelectorAll('.dashboard-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.dataset.section;
                this.navigateToSection(targetSection, navItems, sections);
            });
        });

        // Mobile menu toggle (if needed)
        this.initializeMobileMenu();
    }

    navigateToSection(targetSection, navItems, sections) {
        // Update active states with smooth transitions
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.transform = 'translateY(10px)';
            section.style.opacity = '0';
        });
        
        // Set new active states
        const activeNav = document.querySelector(`[data-section="${targetSection}"]`);
        const activeSection = document.getElementById(targetSection);
        
        if (activeNav) activeNav.classList.add('active');
        if (activeSection) {
            activeSection.classList.add('active');
            
            // Smooth animation
            setTimeout(() => {
                activeSection.style.transform = 'translateY(0)';
                activeSection.style.opacity = '1';
            }, 50);
        }
        
        this.currentSection = targetSection;
        console.log(`📱 Navegado a: ${targetSection}`);
    }

    initializeMobileMenu() {
        // Mobile menu functionality for responsive design
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const sidebar = document.querySelector('.dashboard-sidebar');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }

    /**
     * Initialize Chart.js visualizations
     */
    initializeCharts() {
        this.initializeSalesMiniChart();
        // Add more charts as needed
    }

    initializeSalesMiniChart() {
        const ctx = document.getElementById('salesMiniChart');
        if (!ctx) return;

        try {
            this.charts.salesMini = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'],
                    datasets: [{
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 24350],
                        borderColor: '#4D8DFF',
                        backgroundColor: 'rgba(77, 141, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#4D8DFF',
                        pointHoverBorderColor: '#FFFFFF',
                        pointHoverBorderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#FFFFFF',
                            bodyColor: '#FFFFFF',
                            borderColor: '#4D8DFF',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `$${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: { 
                            display: false,
                            grid: { display: false }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic'
                    }
                }
            });
            
            console.log('📊 Chart de ventas inicializado');
        } catch (error) {
            console.error('Error inicializando chart:', error);
        }
    }

    /**
     * WhatsApp connection flow
     */
    initializeWhatsAppConnection() {
        const connectBtn = document.querySelector('.connect-whatsapp-btn');
        const modal = document.getElementById('whatsappModal');
        
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                this.showModal(modal);
            });
        }

        // Connection method selection
        document.querySelectorAll('.connection-method').forEach(method => {
            method.addEventListener('click', () => {
                const isRecommended = method.classList.contains('recommended');
                this.simulateConnection(isRecommended ? 'meta' : 'qr');
                this.hideModal(modal);
            });
        });
    }

    simulateConnection(method = 'meta') {
        const statusCard = document.querySelector('.whatsapp-status-card');
        if (!statusCard) return;

        // Show loading state
        statusCard.innerHTML = `
            <div class="status-content connecting">
                <div class="status-icon">
                    <div class="spinner"></div>
                </div>
                <div class="status-info">
                    <h2>Conectando con WhatsApp...</h2>
                    <p>Estableciendo conexión segura con Meta</p>
                    <div class="connection-progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;

        // Animate progress bar
        setTimeout(() => {
            const progressBar = statusCard.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '30%';
            }
        }, 500);

        setTimeout(() => {
            const progressBar = statusCard.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '70%';
            }
        }, 1500);

        setTimeout(() => {
            const progressBar = statusCard.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 2500);

        // Show success after 3 seconds
        setTimeout(() => {
            statusCard.innerHTML = `
                <div class="status-content connected">
                    <div class="status-icon connected">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <div class="status-info">
                        <h2>WhatsApp Conectado ✅</h2>
                        <p>+52 811 234 5678 • <strong>Activo y funcionando</strong></p>
                        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                            <button class="manage-btn">Administrar conexión</button>
                            <button class="test-btn">Enviar mensaje de prueba</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners to new buttons
            this.initializeConnectionButtons();
            
            // Show success notification
            this.showNotification('¡WhatsApp conectado exitosamente! 🎉', 'success');
            
            // Update nav badge
            this.updateMessagesBadge(5);
            
            console.log(`📱 WhatsApp conectado via ${method}`);
        }, 3000);
    }

    initializeConnectionButtons() {
        const manageBtn = document.querySelector('.manage-btn');
        const testBtn = document.querySelector('.test-btn');
        
        if (manageBtn) {
            manageBtn.className = 'setup-btn';
            manageBtn.addEventListener('click', () => {
                this.showNotification('Configuración de WhatsApp próximamente', 'info');
            });
        }
        
        if (testBtn) {
            testBtn.className = 'setup-btn';
            testBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            testBtn.addEventListener('click', () => {
                this.sendTestMessage();
            });
        }
    }

    sendTestMessage() {
        this.showNotification('Enviando mensaje de prueba...', 'info');
        
        setTimeout(() => {
            this.showNotification('✅ Mensaje de prueba enviado correctamente', 'success');
            this.addActivity('test', 'Mensaje de prueba enviado a tu número', 'Ahora');
        }, 2000);
    }

    /**
     * Modal management
     */
    initializeModals() {
        // Close modal when clicking backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            const backdrop = modal.querySelector('.modal-backdrop');
            const closeBtn = modal.querySelector('.modal-close');
            
            if (backdrop) {
                backdrop.addEventListener('click', () => this.hideModal(modal));
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideModal(modal));
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.hideModal(openModal);
                }
            }
        });
    }

    showModal(modal) {
        if (!modal) return;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Real-time updates simulation
     */
    initializeRealTimeUpdates() {
        // Update every 15 seconds
        this.realTimeInterval = setInterval(() => {
            this.updateKPIs();
        }, 15000);
        
        // Simulate message updates
        setTimeout(() => {
            this.simulateNewMessage();
        }, 30000);
    }

    updateKPIs() {
        // Update active clients count
        const clientsValue = document.querySelector('.kpi-card:last-child .kpi-value');
        if (clientsValue) {
            const currentClients = parseInt(clientsValue.textContent);
            const newClients = Math.max(0, currentClients + Math.floor(Math.random() * 3) - 1);
            
            if (newClients !== currentClients) {
                this.animateValue(clientsValue, currentClients, newClients, 1000);
            }
        }
        
        // Update sales with small variations
        const salesValue = document.querySelector('.kpi-card:first-child .kpi-value');
        if (salesValue) {
            const currentSales = parseInt(salesValue.textContent.replace(/[$,]/g, ''));
            const variation = Math.floor(Math.random() * 1000) - 500;
            const newSales = Math.max(0, currentSales + variation);
            
            if (Math.abs(variation) > 100) {
                salesValue.textContent = `$${newSales.toLocaleString()}`;
                salesValue.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    salesValue.style.animation = '';
                }, 500);
            }
        }
    }

    simulateNewMessage() {
        const messages = [
            { sender: 'Ana López', message: '¿Cuándo estará disponible?' },
            { sender: 'Carlos Rivera', message: 'Me interesa el plan pro' },
            { sender: 'María García', message: 'Excelente servicio, gracias!' },
            { sender: 'Luis Mendoza', message: '¿Hay descuentos disponibles?' }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.addActivity('message', `Mensaje de ${randomMessage.sender}: "${randomMessage.message}"`, 'Ahora');
        this.updateMessagesBadge();
        
        this.showNotification(`💬 Nuevo mensaje de ${randomMessage.sender}`, 'info');
    }

    addActivity(type, content, time) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        const icons = {
            sale: '💰',
            message: '💬',
            automation: '🤖',
            lead: '🎯',
            test: '🧪'
        };
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${type}">${icons[type] || '📝'}</div>
            <div class="activity-content">
                <p><strong>${content}</strong></p>
                <span class="activity-time">${time}</span>
            </div>
        `;
        
        // Add with animation
        activityItem.style.opacity = '0';
        activityItem.style.transform = 'translateX(-20px)';
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        setTimeout(() => {
            activityItem.style.transition = 'all 0.3s ease';
            activityItem.style.opacity = '1';
            activityItem.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove oldest items if more than 6
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 6) {
            items[items.length - 1].remove();
        }
    }

    updateMessagesBadge(count = null) {
        const badge = document.querySelector('[data-section="mensajes"] .nav-badge');
        if (!badge) return;
        
        if (count === null) {
            const currentCount = parseInt(badge.textContent) || 0;
            count = currentCount + 1;
        }
        
        badge.textContent = count;
        badge.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            badge.style.animation = '';
        }, 500);
    }

    /**
     * Initialize smooth animations
     */
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe KPI cards
        document.querySelectorAll('.kpi-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    /**
     * Notification system
     */
    showNotification(message, type = 'info', duration = 4000) {
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Utility functions
     */
    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getBusinessName(email) {
        const username = email.split('@')[0];
        return username.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Initialize gamified onboarding system
     */
    initializeOnboardingSystem() {
        // Initialize onboarding only if element exists
        const onboardingElement = document.getElementById('onboarding-system');
        if (onboardingElement && !window.onboardingManager) {
            // Delay initialization to ensure all other systems are ready
            setTimeout(() => {
                window.onboardingManager = new OnboardingGameManager();
            }, 500);
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        console.log('🧹 Dashboard controller destroyed');
    }
}

// Global functions for external use
window.dashboardController = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardController = new DashboardController();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboardController) {
        window.dashboardController.destroy();
    }
});

// Add some global utilities
window.ChatableDashboard = {
    showNotification: (message, type, duration) => {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type, duration);
        }
    },
    
    addActivity: (type, content, time) => {
        if (window.dashboardController) {
            window.dashboardController.addActivity(type, content, time);
        }
    },
    
    navigateTo: (section) => {
        if (window.dashboardController) {
            const navItems = document.querySelectorAll('.nav-item[data-section]');
            const sections = document.querySelectorAll('.dashboard-section');
            window.dashboardController.navigateToSection(section, navItems, sections);
        }
    }
};

/**
 * OMNICHANNEL MANAGER
 * Gestiona conexiones de TikTok, Instagram, Messenger, WhatsApp y Telegram
 */
class OmnichannelManager {
    constructor() {
        this.channels = {
            tiktok: { 
                connected: false, 
                priority: 1,
                features: ['DMs', 'Comentarios', 'Lives'],
                responseTime: '23 seg',
                messages: 89
            },
            whatsapp: { 
                connected: true, 
                priority: 2,
                number: '+52 811 234 5678',
                responseTime: '45 seg',
                messages: 142
            },
            instagram: { 
                connected: false, 
                priority: 3,
                features: ['DMs', 'Comentarios', 'Stories'],
                responseTime: '1 min',
                messages: 67
            },
            messenger: { 
                connected: false, 
                priority: 4,
                responseTime: '2 min',
                messages: 45
            },
            telegram: { 
                connected: false, 
                priority: 5,
                status: 'coming_soon',
                responseTime: 'N/A',
                messages: 0
            }
        };
        
        this.init();
    }

    init() {
        console.log('🚀 OmnichannelManager inicializado');
        this.initializeChannelButtons();
        this.initializeUnifiedInbox();
        this.startChannelSimulation();
    }

    initializeChannelButtons() {
        document.querySelectorAll('.connect-channel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const channelCard = e.target.closest('.channel-card');
                const channel = channelCard.dataset.channel;
                
                // Check if it's a premium upgrade button
                if (btn.classList.contains('premium-upgrade')) {
                    this.showUpgradeModal(channel);
                } else {
                    this.connectChannel(channel);
                }
            });
        });

        // Manage buttons for connected channels
        document.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const channelCard = e.target.closest('.channel-card');
                const channel = channelCard.dataset.channel;
                this.manageChannel(channel);
            });
        });

        // Initialize freemium upgrade buttons
        this.initializeUpgradeButtons();
    }

    connectChannel(channel) {
        if (channel === 'tiktok') {
            this.showTikTokModal();
        } else if (channel === 'telegram') {
            this.showNotification('Telegram llegará pronto. ¡Sé el primero en saberlo!', 'info');
        } else if (channel === 'instagram' || channel === 'messenger') {
            this.showMetaConnectionModal(channel);
        }
    }

    showTikTokModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.tiktok-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal tiktok-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎯 Conecta TikTok for Business</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="tiktok-benefits">
                        <h3>¡Sé pionero en México!</h3>
                        <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                            <li style="padding: 0.5rem 0;">✨ Responde DMs automáticamente</li>
                            <li style="padding: 0.5rem 0;">💬 Gestiona comentarios con IA</li>
                            <li style="padding: 0.5rem 0;">🔥 Detecta tendencias y oportunidades</li>
                            <li style="padding: 0.5rem 0;">📊 Analytics exclusivos</li>
                        </ul>
                    </div>
                    <button class="connect-tiktok-now tiktok-gradient" style="width: 100%; padding: 1rem; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin: 1rem 0;">
                        <span>⚡</span> Conectar Ahora
                    </button>
                    <p class="exclusive-note" style="text-align: center; color: #666; font-size: 0.875rem;">
                        🏆 Oferta especial para early adopters
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const connectBtn = modal.querySelector('.connect-tiktok-now');
        
        closeBtn.addEventListener('click', () => this.hideChannelModal(modal));
        backdrop.addEventListener('click', () => this.hideChannelModal(modal));
        connectBtn.addEventListener('click', () => {
            this.simulateChannelConnection('tiktok');
            this.hideChannelModal(modal);
        });
    }

    showMetaConnectionModal(channel) {
        const channelName = channel === 'instagram' ? 'Instagram' : 'Facebook Messenger';
        
        const modal = document.createElement('div');
        modal.className = 'modal meta-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🔗 Conecta ${channelName}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: #666;">
                        Conecta tu cuenta de ${channelName} de forma segura con Meta
                    </p>
                    <button class="connect-meta-now ${channel}-gradient" style="width: 100%; padding: 1rem; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer;">
                        Autorizar con Meta
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const connectBtn = modal.querySelector('.connect-meta-now');
        
        closeBtn.addEventListener('click', () => this.hideChannelModal(modal));
        backdrop.addEventListener('click', () => this.hideChannelModal(modal));
        connectBtn.addEventListener('click', () => {
            this.simulateChannelConnection(channel);
            this.hideChannelModal(modal);
        });
    }

    hideChannelModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    simulateChannelConnection(channel) {
        this.showNotification(`Conectando ${channel}...`, 'info');
        
        setTimeout(() => {
            this.channels[channel].connected = true;
            this.updateChannelCard(channel);
            this.updateUnifiedStats();
            this.showNotification(`¡${channel} conectado exitosamente! 🎉`, 'success');
            
            // Add some activity
            this.addChannelActivity(channel);
        }, 2000);
    }

    updateChannelCard(channel) {
        const channelCard = document.querySelector(`[data-channel="${channel}"]`);
        if (!channelCard) return;
        
        const button = channelCard.querySelector('.connect-channel-btn');
        const channelInfo = channelCard.querySelector('.channel-info');
        
        if (button && channelInfo) {
            button.outerHTML = `
                <div class="channel-status connected">
                    <span>✅ Conectado</span>
                    <button class="manage-btn">Gestionar</button>
                </div>
            `;
            
            // Re-attach event listener
            const newManageBtn = channelCard.querySelector('.manage-btn');
            if (newManageBtn) {
                newManageBtn.addEventListener('click', () => this.manageChannel(channel));
            }
        }
        
        // Update channel count in sidebar
        this.updateChannelCount();
    }

    updateChannelCount() {
        const connectedChannels = Object.values(this.channels).filter(ch => ch.connected).length;
        const channelCountEl = document.querySelector('.channel-count');
        if (channelCountEl) {
            channelCountEl.textContent = `${connectedChannels}/5`;
        }
    }

    updateUnifiedStats() {
        const connectedChannels = Object.values(this.channels).filter(ch => ch.connected).length;
        const totalMessages = Object.values(this.channels).reduce((sum, ch) => sum + ch.messages, 0);
        
        // Update stats in the hub
        const stats = document.querySelectorAll('.unified-stats .stat');
        if (stats[0]) {
            stats[0].querySelector('.stat-value').textContent = totalMessages;
        }
        if (stats[1]) {
            stats[1].querySelector('.stat-value').textContent = connectedChannels;
        }
    }

    manageChannel(channel) {
        this.showNotification(`Gestión de ${channel} próximamente disponible`, 'info');
    }

    initializeUnifiedInbox() {
        // Simular mensajes de diferentes canales
        const unifiedMessages = [
            {
                channel: 'tiktok',
                user: '@trendy_user',
                message: '¿Hacen envíos? Vi tu video',
                time: 'Hace 2 min',
                priority: 'high'
            },
            {
                channel: 'whatsapp',
                user: 'María García',
                message: 'Quiero información sobre precios',
                time: 'Hace 5 min',
                priority: 'medium'
            },
            {
                channel: 'instagram',
                user: '@cliente_vip',
                message: 'Me encantó el producto del reel',
                time: 'Hace 8 min',
                priority: 'high'
            }
        ];
        
        this.renderUnifiedMessages(unifiedMessages);
    }

    renderUnifiedMessages(messages) {
        // Actualizar actividades con badges de canal
        messages.forEach(msg => {
            const channelEmojis = {
                tiktok: '📺',
                whatsapp: '📱',
                instagram: '📷',
                messenger: '💬',
                telegram: '✈️'
            };
            
            if (window.dashboardController) {
                window.dashboardController.addActivity(
                    'message',
                    `${channelEmojis[msg.channel]} ${msg.user}: "${msg.message}"`,
                    msg.time
                );
            }
        });
    }

    addChannelActivity(channel) {
        const activities = {
            tiktok: 'Nuevo DM desde TikTok - @usuario_trendy',
            instagram: 'Comentario en post - @fan_instagram',
            messenger: 'Mensaje desde página de Facebook',
            telegram: 'Mensaje en canal de Telegram'
        };
        
        if (window.dashboardController && activities[channel]) {
            window.dashboardController.addActivity('message', activities[channel], 'Ahora');
        }
    }

    startChannelSimulation() {
        // Simular actividad cada 30 segundos
        setInterval(() => {
            const connectedChannels = Object.entries(this.channels)
                .filter(([_, data]) => data.connected)
                .map(([name, _]) => name);
            
            if (connectedChannels.length > 0) {
                const randomChannel = connectedChannels[Math.floor(Math.random() * connectedChannels.length)];
                this.addChannelActivity(randomChannel);
            }
        }, 30000);
    }

    showNotification(message, type = 'success') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }
}

/**
 * FREEMIUM UPGRADE SYSTEM
 * Gestiona las funcionalidades de upgrade y premium features
 */
class FreemiumUpgradeManager {
    constructor() {
        this.currentPlan = 'starter';
        this.usageData = {
            messages: 3650,
            maxMessages: 5000,
            channels: 1,
            maxChannels: 5
        };
        
        this.init();
    }

    init() {
        console.log('🚀 FreemiumUpgradeManager inicializado');
        this.initializeUpgradeButtons();
        this.trackFreemiumInteractions();
        this.updateUsageDisplays();
    }

    initializeUpgradeButtons() {
        // Main upgrade banner button
        const upgradeMainBtn = document.querySelector('.upgrade-banner-btn');
        if (upgradeMainBtn) {
            upgradeMainBtn.addEventListener('click', () => this.showUpgradeModal('main_banner'));
        }

        // Sidebar upgrade button
        const upgradeSidebarBtn = document.querySelector('.upgrade-btn');
        if (upgradeSidebarBtn) {
            upgradeSidebarBtn.addEventListener('click', () => this.showUpgradeModal('sidebar'));
        }

        // Mini upgrade buttons in KPIs
        document.querySelectorAll('.upgrade-mini-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const context = e.target.closest('.kpi-card') ? 'kpi_card' : 'general';
                this.showUpgradeModal(context);
            });
        });

        // Premium feature upgrade buttons
        document.querySelectorAll('.premium-upgrade').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = btn.dataset.feature || 'unknown';
                this.showUpgradeModal('premium_feature', feature);
            });
        });
    }

    showUpgradeModal(source, feature = null) {
        console.log(`🎯 Usuario quiere upgrade desde: ${source}${feature ? ` (${feature})` : ''}`);
        
        // Track the upgrade intent
        this.trackUpgradeIntent(source, feature);
        
        // Create upgrade modal
        const modal = this.createUpgradeModal(source, feature);
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Add event listeners
        this.attachModalEventListeners(modal);
        
        // Show notification
        this.showNotification('✨ ¡Descubre todo lo que puedes lograr con Pro!', 'info');
    }

    createUpgradeModal(source, feature) {
        const modal = document.createElement('div');
        modal.className = 'modal upgrade-modal';
        
        const featureMessages = {
            'tiktok': {
                title: '🎯 Desbloquea TikTok for Business',
                description: 'Sé pionero en México conectando TikTok. Responde DMs automáticamente y convierte cada video viral en ventas.',
                benefits: ['📺 Automatiza TikTok DMs', '💬 Gestiona comentarios', '🎯 Detecta leads de videos', '📊 Analytics de TikTok']
            },
            'instagram': {
                title: '📷 Conecta Instagram Direct',
                description: 'Automatiza mensajes directos y comentarios de Instagram. Convierte followers en clientes.',
                benefits: ['📱 DMs automáticos', '💬 Gestión de comentarios', '📊 Analytics de Instagram', '🎯 Lead generation']
            },
            'messenger': {
                title: '💬 Activa Facebook Messenger',
                description: 'Conecta tu página de Facebook y automatiza todas las conversaciones de Messenger.',
                benefits: ['💬 Chat automático', '📱 Messenger integrado', '👥 Gestión de leads', '📊 Métricas completas']
            }
        };

        const featureData = featureMessages[feature] || {
            title: '💎 Upgrade a Chatably Pro',
            description: 'Desbloquea todo el potencial de Chatably con funciones premium.',
            benefits: ['✨ +4 canales premium', '🤖 IA GPT-4 avanzada', '📊 Analytics profundos', '⚡ Respuesta < 30 seg']
        };

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content upgrade-modal-content">
                <div class="modal-header">
                    <h2>${featureData.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="upgrade-modal-description">
                        <p>${featureData.description}</p>
                    </div>
                    
                    <div class="upgrade-benefits-list">
                        <h4>Con Pro obtienes:</h4>
                        <ul>
                            ${featureData.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="upgrade-pricing-summary">
                        <div class="current-plan">
                            <span class="plan-label">Plan actual:</span>
                            <span class="plan-name">Starter - $1,499/mes</span>
                        </div>
                        <div class="upgrade-arrow">↓</div>
                        <div class="new-plan">
                            <span class="plan-label">Upgrade a:</span>
                            <span class="plan-name gold">Pro - $4,999/mes</span>
                            <span class="plan-roi">Se paga solo con 2 ventas extra</span>
                        </div>
                    </div>
                    
                    <div class="upgrade-guarantee">
                        <div class="guarantee-icon">🛡️</div>
                        <div class="guarantee-text">
                            <h5>Garantía Total</h5>
                            <p>Si no generas 2x tu inversión en 30 días, te devolvemos todo tu dinero.</p>
                        </div>
                    </div>
                    
                    <div class="upgrade-actions">
                        <button class="upgrade-now-btn" data-source="${source}" data-feature="${feature}">
                            💎 Upgrade Ahora - $4,999/mes
                        </button>
                        <button class="schedule-demo-btn">
                            📞 Hablar con Experto
                        </button>
                        <p class="upgrade-note">✅ Upgrade instantáneo • 🔄 Cancela cuando quieras</p>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    attachModalEventListeners(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const upgradeBtn = modal.querySelector('.upgrade-now-btn');
        const demoBtn = modal.querySelector('.schedule-demo-btn');
        
        // Close modal handlers
        closeBtn.addEventListener('click', () => this.closeUpgradeModal(modal));
        backdrop.addEventListener('click', () => this.closeUpgradeModal(modal));
        
        // Upgrade action handlers
        upgradeBtn.addEventListener('click', (e) => {
            const source = e.target.dataset.source;
            const feature = e.target.dataset.feature;
            this.processUpgrade(source, feature);
        });
        
        demoBtn.addEventListener('click', () => {
            this.scheduleDemo();
            this.closeUpgradeModal(modal);
        });
    }

    closeUpgradeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    }

    processUpgrade(source, feature) {
        console.log(`💳 Procesando upgrade desde ${source} para ${feature}`);
        
        // Track conversion
        this.trackUpgradeConversion(source, feature);
        
        // Show loading state
        this.showNotification('🚀 Redirigiendo a checkout...', 'info');
        
        // Redirect to Pro plan payment link
        setTimeout(() => {
            window.location.href = 'https://buy.stripe.com/7sYfZgcxN3usbRX0k37ok0c';
        }, 1000);
    }

    scheduleDemo() {
        this.showNotification('📞 Te contactaremos en las próximas 2 horas', 'success');
        
        // Track demo request
        if (typeof gtag !== 'undefined') {
            gtag('event', 'demo_request', {
                'event_category': 'conversion',
                'event_label': 'freemium_upgrade_flow'
            });
        }
    }

    trackFreemiumInteractions() {
        // Track when users hover over locked features
        document.querySelectorAll('.premium-locked').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'premium_feature_hover', {
                        'event_category': 'engagement',
                        'event_label': 'freemium_exploration'
                    });
                }
            });
        });
        
        // Track usage bar interactions
        const usageBar = document.querySelector('.usage-bar');
        if (usageBar) {
            usageBar.addEventListener('click', () => {
                this.showUpgradeModal('usage_limit');
            });
        }
    }

    trackUpgradeIntent(source, feature) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'upgrade_intent', {
                'event_category': 'conversion',
                'event_label': source,
                'custom_parameter_1': feature || 'general'
            });
        }
    }

    trackUpgradeConversion(source, feature) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'upgrade_conversion', {
                'event_category': 'conversion',
                'event_label': source,
                'value': 4999,
                'currency': 'MXN',
                'custom_parameter_1': feature || 'general'
            });
        }
    }

    updateUsageDisplays() {
        // Update usage percentage
        const usagePercentage = Math.round((this.usageData.messages / this.usageData.maxMessages) * 100);
        const usageFill = document.querySelector('.usage-fill');
        if (usageFill) {
            usageFill.style.width = `${usagePercentage}%`;
        }
        
        // Update usage text
        const usageText = document.querySelector('.usage-text');
        if (usageText) {
            usageText.textContent = `${this.usageData.messages.toLocaleString()} / ${this.usageData.maxMessages.toLocaleString()} mensajes usados`;
        }
        
        // Update channel count
        const channelCount = document.querySelector('.channel-count');
        if (channelCount) {
            channelCount.textContent = `${this.usageData.channels}/${this.usageData.maxChannels}`;
        }
        
        // Show warning if approaching limits
        if (usagePercentage > 85) {
            this.showUsageLimitWarning();
        }
    }

    showUsageLimitWarning() {
        const warningShown = localStorage.getItem('usage_warning_shown');
        if (!warningShown) {
            setTimeout(() => {
                this.showNotification('⚠️ Te quedan pocos mensajes este mes. ¡Upgrade para ilimitados!', 'warning', 6000);
                localStorage.setItem('usage_warning_shown', 'true');
            }, 3000);
        }
    }

    showNotification(message, type = 'info', duration = 4000) {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type, duration);
        }
    }
}

// Add upgrade modal styles
const upgradeModalStyles = `
<style>
.upgrade-modal-content {
    max-width: 600px;
    margin: 3% auto;
}

.upgrade-modal-description {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
}

.upgrade-benefits-list {
    margin-bottom: 1.5rem;
}

.upgrade-benefits-list h4 {
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.upgrade-benefits-list ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
}

.upgrade-benefits-list li {
    padding: 0.5rem;
    background: rgba(77, 141, 255, 0.05);
    border-radius: 8px;
    font-size: 0.9rem;
}

.upgrade-pricing-summary {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.current-plan, .new-plan {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.plan-label {
    font-size: 0.8rem;
    color: var(--gray-600);
}

.plan-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.plan-name.gold {
    color: #B45309;
}

.plan-roi {
    font-size: 0.85rem;
    color: var(--success-green);
    font-weight: 600;
}

.upgrade-arrow {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    color: var(--primary);
}

.upgrade-guarantee {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.guarantee-icon {
    font-size: 2rem;
}

.guarantee-text h5 {
    margin-bottom: 0.25rem;
    color: var(--success-green);
}

.guarantee-text p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--gray-600);
}

.upgrade-actions {
    text-align: center;
}

.upgrade-now-btn {
    width: 100%;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: var(--text-dark);
    border: none;
    padding: 1.25rem 2rem;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

.upgrade-now-btn:hover {
    background: linear-gradient(135deg, #FFA500, #FF8C00);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.schedule-demo-btn {
    width: 100%;
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

.schedule-demo-btn:hover {
    background: var(--primary);
    color: white;
}

.upgrade-note {
    font-size: 0.8rem;
    color: var(--gray-600);
    margin: 0;
}

@media (max-width: 768px) {
    .upgrade-benefits-list ul {
        grid-template-columns: 1fr;
    }
    
    .upgrade-modal-content {
        margin: 5% 1rem;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', upgradeModalStyles);

// Initialize FreemiumUpgradeManager along with other managers
document.addEventListener('DOMContentLoaded', () => {
    // Wait for DashboardController to initialize
    setTimeout(() => {
        window.freemiumUpgradeManager = new FreemiumUpgradeManager();
    }, 1000);
});

// Initialize OmnichannelManager along with DashboardController
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for DashboardController to initialize
    setTimeout(() => {
        window.omnichannelManager = new OmnichannelManager();
    }, 500);
});

// ===========================
// GAMIFIED ONBOARDING MANAGER
// ===========================

class OnboardingGameManager {
    constructor() {
        this.currentLevel = 3;
        this.currentXP = 1250;
        this.maxXP = 2000;
        this.completedTasks = new Set(['profile', 'whatsapp']);
        this.achievements = new Set(['first-step', 'communicator']);
        
        this.questSteps = [
            { id: 'whatsapp', title: 'Conectar WhatsApp', completed: true },
            { id: 'schedule', title: 'Configurar horarios', completed: true },
            { id: 'ai-training', title: 'Entrenar IA con tu marca', completed: false },
            { id: 'auto-responses', title: 'Configurar auto-respuestas', completed: false }
        ];
        
        this.tasks = [
            { id: 'profile', title: 'Perfil Completo', xp: 100, completed: true },
            { id: 'whatsapp', title: 'WhatsApp Conectado', xp: 150, completed: true },
            { id: 'ai-training', title: 'Entrena tu IA', xp: 300, completed: false },
            { id: 'first-automation', title: 'Primera Automatización', xp: 250, completed: false },
            { id: 'multichannel', title: 'Multicanal Pro', xp: 500, completed: false, premium: true },
            { id: 'analytics-setup', title: 'Analytics Dashboard', xp: 200, completed: false }
        ];
        
        this.achievementsList = [
            { id: 'first-step', title: 'Primer Paso', description: 'Registraste tu cuenta', earned: true, date: 'Ayer' },
            { id: 'communicator', title: 'Comunicador', description: 'Conectaste WhatsApp', earned: true, date: 'Hoy' },
            { id: 'ai-master', title: 'Maestro IA', description: 'Personaliza tu asistente', earned: false, requirement: 'Completa entrenamiento IA' },
            { id: 'omnichannel', title: 'Omnicanal', description: 'Conecta 3+ redes sociales', earned: false, requirement: 'Requiere Plan Pro', premium: true },
            { id: 'analyst-pro', title: 'Analista Pro', description: 'Configura dashboard avanzado', earned: false, requirement: 'Completa configuración' },
            { id: 'chatably-master', title: 'Chatably Master', description: 'Completa todo el onboarding', earned: false, requirement: 'Todos los objetivos', legendary: true }
        ];
        
        this.init();
    }
    
    init() {
        this.updateProgressRing();
        this.updateXPBar();
        this.updateActiveQuest();
        this.updateQuickWins();
        this.updateAchievements();
        this.bindEvents();
        this.startProgressAnimations();
        
        // Track onboarding engagement
        this.trackOnboardingView();
    }
    
    updateProgressRing() {
        const circle = document.querySelector('.progress-ring-circle');
        if (!circle) return;
        
        const completedCount = this.tasks.filter(task => task.completed).length;
        const totalTasks = this.tasks.length;
        const percentage = (completedCount / totalTasks) * 100;
        
        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        
        // Update completion text
        const completionText = document.querySelector('.completion-text');
        if (completionText) {
            completionText.textContent = `${completedCount} de ${totalTasks} objetivos completados`;
        }
    }
    
    updateXPBar() {
        const xpFill = document.querySelector('.xp-fill');
        const xpLabel = document.querySelector('.xp-label');
        
        if (xpFill) {
            const percentage = (this.currentXP / this.maxXP) * 100;
            xpFill.style.width = `${percentage}%`;
        }
        
        if (xpLabel) {
            xpLabel.textContent = `XP: ${this.currentXP.toLocaleString()} / ${this.maxXP.toLocaleString()}`;
        }
    }
    
    updateActiveQuest() {
        const questSteps = document.querySelectorAll('.quest-step');
        
        questSteps.forEach((stepEl, index) => {
            const step = this.questSteps[index];
            if (!step) return;
            
            stepEl.classList.remove('completed', 'active');
            
            if (step.completed) {
                stepEl.classList.add('completed');
            } else if (index === this.questSteps.findIndex(s => !s.completed)) {
                stepEl.classList.add('active');
            }
        });
    }
    
    updateQuickWins() {
        this.tasks.forEach(task => {
            const taskCard = document.querySelector(`[data-task="${task.id}"]`);
            if (!taskCard) return;
            
            taskCard.classList.remove('completed', 'active');
            
            if (task.completed) {
                taskCard.classList.add('completed');
                const actionBtn = taskCard.querySelector('.quick-win-action');
                if (actionBtn) {
                    actionBtn.style.display = 'none';
                }
            } else if (!task.premium || this.isPremiumUser()) {
                taskCard.classList.add('active');
            }
        });
    }
    
    updateAchievements() {
        this.achievementsList.forEach(achievement => {
            const badgeEl = document.querySelector(`[data-achievement="${achievement.id}"]`);
            if (!badgeEl) return;
            
            badgeEl.classList.remove('earned', 'locked', 'premium', 'legendary');
            
            if (achievement.earned) {
                badgeEl.classList.add('earned');
            } else {
                badgeEl.classList.add('locked');
                if (achievement.premium) badgeEl.classList.add('premium');
                if (achievement.legendary) badgeEl.classList.add('legendary');
            }
        });
    }
    
    bindEvents() {
        // Quest action button
        const questActionBtn = document.querySelector('.quest-action-btn');
        if (questActionBtn) {
            questActionBtn.addEventListener('click', () => this.startAITraining());
        }
        
        // Quick win actions
        document.querySelectorAll('.quick-win-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('[data-task]').dataset.task;
                this.completeTask(taskId);
            });
        });
        
        // Achievement hover effects
        document.querySelectorAll('.achievement-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                if (badge.classList.contains('earned')) {
                    this.showAchievementTooltip(badge);
                }
            });
        });
    }
    
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return;
        
        // Mark task as completed
        task.completed = true;
        this.completedTasks.add(taskId);
        
        // Add XP
        this.addXP(task.xp);
        
        // Update UI
        this.updateProgressRing();
        this.updateQuickWins();
        
        // Show completion animation
        this.showTaskCompletion(task);
        
        // Check for level up
        this.checkLevelUp();
        
        // Check for achievements
        this.checkAchievements();
        
        // Track completion
        this.trackTaskCompletion(taskId, task.xp);
        
        console.log(`✅ Task completed: ${task.title} (+${task.xp} XP)`);
    }
    
    addXP(amount) {
        this.currentXP += amount;
        
        // Animate XP gain
        this.animateXPGain(amount);
        
        // Update XP bar with animation
        setTimeout(() => {
            this.updateXPBar();
        }, 500);
    }
    
    animateXPGain(amount) {
        const xpLabel = document.querySelector('.xp-label');
        if (!xpLabel) return;
        
        // Create floating XP text
        const floatingXP = document.createElement('div');
        floatingXP.textContent = `+${amount} XP`;
        floatingXP.style.cssText = `
            position: absolute;
            color: #10B981;
            font-weight: 700;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUpFade 2s ease-out forwards;
        `;
        
        const rect = xpLabel.getBoundingClientRect();
        floatingXP.style.left = rect.right + 10 + 'px';
        floatingXP.style.top = rect.top + 'px';
        
        document.body.appendChild(floatingXP);
        
        setTimeout(() => floatingXP.remove(), 2000);
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.currentXP / 1000) + 1;
        
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            this.maxXP = newLevel * 1000;
            
            // Show level up notification
            this.showLevelUp(newLevel);
            
            // Update level badge
            const levelBadge = document.querySelector('.level-badge');
            if (levelBadge) {
                levelBadge.textContent = `Level ${newLevel}`;
            }
            
            // Track level up
            this.trackLevelUp(newLevel);
        }
    }
    
    checkAchievements() {
        // Check AI Master achievement
        if (this.completedTasks.has('ai-training') && !this.achievements.has('ai-master')) {
            this.unlockAchievement('ai-master');
        }
        
        // Check Analyst Pro achievement
        if (this.completedTasks.has('analytics-setup') && !this.achievements.has('analyst-pro')) {
            this.unlockAchievement('analyst-pro');
        }
        
        // Check Chatably Master achievement
        const allTasksCompleted = this.tasks.every(task => task.completed || task.premium);
        if (allTasksCompleted && !this.achievements.has('chatably-master')) {
            this.unlockAchievement('chatably-master');
        }
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievementsList.find(a => a.id === achievementId);
        if (!achievement) return;
        
        achievement.earned = true;
        achievement.date = 'Ahora';
        this.achievements.add(achievementId);
        
        // Update UI
        this.updateAchievements();
        
        // Show unlock animation
        this.showAchievementUnlock(achievement);
        
        // Track achievement
        this.trackAchievementUnlock(achievementId);
        
        console.log(`🏆 Achievement unlocked: ${achievement.title}`);
    }
    
    showTaskCompletion(task) {
        // Create completion notification
        if (window.dashboardController) {
            window.dashboardController.showNotification(
                `¡Tarea completada! ${task.title} (+${task.xp} XP)`,
                'success'
            );
        }
    }
    
    showLevelUp(newLevel) {
        // Create level up modal/notification
        if (window.dashboardController) {
            window.dashboardController.showNotification(
                `🎉 ¡Level Up! Ahora eres Level ${newLevel}`,
                'success'
            );
        }
    }
    
    showAchievementUnlock(achievement) {
        // Create achievement unlock animation
        if (window.dashboardController) {
            window.dashboardController.showNotification(
                `🏆 ¡Logro desbloqueado! ${achievement.title}`,
                'success'
            );
        }
    }
    
    isPremiumUser() {
        const userPlan = localStorage.getItem('chatably_selected_plan') || 'starter';
        return userPlan === 'pro' || userPlan === 'enterprise';
    }
    
    startAITraining() {
        this.completeTask('ai-training');
        console.log('🤖 AI training started and completed!');
    }
    
    // Analytics tracking methods
    trackOnboardingView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'onboarding_view', {
                'event_category': 'engagement',
                'event_label': 'gamified_onboarding',
                'custom_parameter_1': `level_${this.currentLevel}`
            });
        }
    }
    
    trackTaskCompletion(taskId, xp) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'onboarding_task_complete', {
                'event_category': 'engagement',
                'event_label': taskId,
                'value': xp
            });
        }
    }
    
    trackLevelUp(newLevel) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'onboarding_level_up', {
                'event_category': 'progression',
                'event_label': `level_${newLevel}`,
                'value': newLevel
            });
        }
    }
    
    trackAchievementUnlock(achievementId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'onboarding_achievement', {
                'event_category': 'progression',
                'event_label': achievementId,
                'value': 1
            });
        }
    }
}

// Global functions for onboarding interactions
window.startAITraining = function() {
    if (window.onboardingManager) {
        window.onboardingManager.startAITraining();
    } else {
        console.log('🤖 Opening AI training...');
    }
}

window.openAITraining = function() {
    window.startAITraining();
}

window.showUpgradeModal = function() {
    if (window.freemiumUpgradeManager) {
        window.freemiumUpgradeManager.showUpgradeModal();
    }
}

window.showTipModal = function() {
    console.log('💡 Showing tips modal...');
}

// Add floating animation keyframes
const onboardingStyles = document.createElement('style');
onboardingStyles.textContent = `
    @keyframes floatUpFade {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(77, 141, 255, 0.4);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(77, 141, 255, 0);
        }
    }
`;
document.head.appendChild(onboardingStyles);

// Initialize OnboardingGameManager along with other managers
document.addEventListener('DOMContentLoaded', () => {
    // Wait for DashboardController to initialize
    setTimeout(() => {
        if (document.getElementById('onboarding-system') && !window.onboardingManager) {
            window.onboardingManager = new OnboardingGameManager();
        }
    }, 1200);
});

// ===========================
// ANALYTICS PRO MANAGER - ELITE TIER
// ===========================

class AnalyticsProManager {
    constructor() {
        this.realTimeUpdates = null;
        this.charts = {};
        this.isActive = false;
        
        // Datos en tiempo real que se actualizan
        this.realtimeData = {
            dailyRevenue: 47389,
            mrrValue: 1247893,
            ltvValue: 23567,
            churnValue: 2.3,
            activeUsers: 1247,
            conversionRate: 6.4
        };
        
        this.init();
    }
    
    init() {
        this.isActive = true;
        console.log('🚀 Analytics Pro Manager initialized');
        
        this.startRealTimeUpdates();
        this.initializeCharts();
        this.initializeLiveActions();
        this.initializeCountryActivity();
        this.bindEvents();
        
        // Track analytics view
        this.trackAnalyticsView();
    }
    
    startRealTimeUpdates() {
        // Actualizar cada 3 segundos
        this.realTimeUpdates = setInterval(() => {
            if (!this.isActive) return;
            
            this.updateRevenueMetrics();
            this.updateActiveUsers();
            this.addNewLiveAction();
            this.updateCharts();
        }, 3000);
        
        console.log('📊 Real-time updates started');
    }
    
    updateRevenueMetrics() {
        // Simular fluctuaciones realistas en los datos
        this.realtimeData.dailyRevenue += Math.floor(Math.random() * 2000) - 1000;
        this.realtimeData.mrrValue += Math.floor(Math.random() * 10000) - 5000;
        this.realtimeData.ltvValue += Math.floor(Math.random() * 500) - 250;
        this.realtimeData.churnValue += (Math.random() - 0.5) * 0.1;
        this.realtimeData.activeUsers += Math.floor(Math.random() * 20) - 10;
        
        // Actualizar UI con animaciones
        this.animateValueUpdate('daily-revenue', `$${this.realtimeData.dailyRevenue.toLocaleString()}`);
        this.animateValueUpdate('mrr-value', `$${this.realtimeData.mrrValue.toLocaleString()}`);
        this.animateValueUpdate('ltv-value', `$${this.realtimeData.ltvValue.toLocaleString()}`);
        this.animateValueUpdate('churn-value', `${this.realtimeData.churnValue.toFixed(1)}%`);
        this.animateValueUpdate('active-users', this.realtimeData.activeUsers.toLocaleString());
    }
    
    animateValueUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Añadir efecto de flash
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.05)';
        element.style.color = '#10B981';
        
        // Actualizar valor
        setTimeout(() => {
            element.textContent = newValue;
        }, 150);
        
        // Restaurar estado normal
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }
    
    updateActiveUsers() {
        const element = document.getElementById('active-users');
        if (element) {
            this.animateValueUpdate('active-users', this.realtimeData.activeUsers.toLocaleString());
        }
    }
    
    addNewLiveAction() {
        const actionsContainer = document.getElementById('live-actions');
        if (!actionsContainer) return;
        
        const actions = [
            {
                type: 'purchase',
                icon: '💰',
                business: this.getRandomBusiness(),
                action: 'se suscribió a Plan Pro',
                value: '+$4,999 MRR',
                time: this.getRandomTime()
            },
            {
                type: 'interaction',
                icon: '🧮',
                business: this.getRandomBusiness(),
                action: 'completó ROI Calculator',
                value: `ROI: ${Math.floor(Math.random() * 1000) + 200}%`,
                time: this.getRandomTime()
            },
            {
                type: 'signup',
                icon: '🚀',
                business: this.getRandomBusiness(),
                action: 'completó onboarding',
                value: `Level ${Math.floor(Math.random() * 5) + 1}`,
                time: this.getRandomTime()
            },
            {
                type: 'upgrade',
                icon: '⬆️',
                business: this.getRandomBusiness(),
                action: 'considerando upgrade',
                value: `${Math.floor(Math.random() * 30) + 70}% probabilidad`,
                time: this.getRandomTime()
            }
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        // Crear nuevo elemento
        const actionElement = document.createElement('div');
        actionElement.className = `action-item ${randomAction.type}`;
        actionElement.style.opacity = '0';
        actionElement.style.transform = 'translateX(-20px)';
        
        actionElement.innerHTML = `
            <span class="action-icon">${randomAction.icon}</span>
            <span class="action-text">
                <strong>${randomAction.business}</strong> ${randomAction.action}
                <span class="action-${randomAction.type === 'purchase' ? 'value' : 
                              randomAction.type === 'interaction' ? 'result' : 
                              randomAction.type === 'signup' ? 'badge' : 'probability'}">${randomAction.value}</span>
            </span>
            <span class="action-time">${randomAction.time}</span>
        `;
        
        // Insertar al principio
        actionsContainer.insertBefore(actionElement, actionsContainer.firstChild);
        
        // Animar entrada
        setTimeout(() => {
            actionElement.style.transition = 'all 0.5s ease';
            actionElement.style.opacity = '1';
            actionElement.style.transform = 'translateX(0)';
        }, 100);
        
        // Mantener solo 4 elementos
        const allActions = actionsContainer.querySelectorAll('.action-item');
        if (allActions.length > 4) {
            const lastAction = allActions[allActions.length - 1];
            lastAction.style.transition = 'all 0.5s ease';
            lastAction.style.opacity = '0';
            lastAction.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (lastAction.parentNode) {
                    lastAction.remove();
                }
            }, 500);
        }
        
        // Track action
        this.trackLiveAction(randomAction.type, randomAction.business);
    }
    
    getRandomBusiness() {
        const businesses = [
            'Restaurante El Sabor', 'TechStore CDMX', 'Farmacia San Juan',
            'Clínica Dental Smile', 'Boutique Elegance', 'Pizzería Della Nonna',
            'Gimnasio FitLife', 'Café Central', 'Tienda Deportiva Pro',
            'Inmobiliaria Prime', 'Beauty Center Glamour', 'Ferretería México',
            'Librería Universitaria', 'Pastelería Dulce Vida', 'AutoDealer Pro'
        ];
        return businesses[Math.floor(Math.random() * businesses.length)];
    }
    
    getRandomTime() {
        const times = ['hace 12 seg', 'hace 34 seg', 'hace 1 min', 'hace 2 min', 'hace 3 min'];
        return times[Math.floor(Math.random() * times.length)];
    }
    
    initializeCharts() {
        // Inicializar charts con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            this.createRevenueChart();
            this.createPredictionChart();
            this.createTrendCharts();
        }
    }
    
    createRevenueChart() {
        const ctx = document.getElementById('revenue-prediction');
        if (!ctx) return;
        
        // Generar datos de predicción
        const labels = [];
        const actualData = [];
        const predictedData = [];
        
        // Últimos 30 días (actual)
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }));
            
            // Simular datos históricos con tendencia
            const baseValue = 45000 + (30 - i) * 800 + Math.random() * 5000;
            actualData.push(baseValue);
            predictedData.push(null);
        }
        
        // Próximos 30 días (predicción)
        for (let i = 1; i <= 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            labels.push(date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }));
            
            // Simular predicción con crecimiento
            const baseValue = 45000 + (30 + i) * 800 + Math.random() * 3000;
            actualData.push(null);
            predictedData.push(baseValue);
        }
        
        this.charts.revenuePrediction = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos Reales',
                        data: actualData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Predicción IA',
                        data: predictedData,
                        borderColor: '#6B46C1',
                        backgroundColor: 'rgba(107, 70, 193, 0.1)',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: $${context.parsed.y?.toLocaleString() || 'N/A'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Ingresos ($)'
                        },
                        ticks: {
                            callback: (value) => `$${value.toLocaleString()}`
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    createTrendCharts() {
        // Crear mini charts para los revenue cards
        const trendCanvases = ['daily-trend', 'mrr-chart'];
        
        trendCanvases.forEach(canvasId => {
            const ctx = document.getElementById(canvasId);
            if (!ctx) return;
            
            // Generar datos de tendencia
            const data = [];
            for (let i = 0; i < 7; i++) {
                data.push(Math.random() * 100 + 50);
            }
            
            this.charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: data,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });
        });
    }
    
    updateCharts() {
        // Actualizar charts con nuevos datos
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data && chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                    // Añadir nuevo punto y remover el primero
                    if (dataset.data.length > 0) {
                        dataset.data.push(Math.random() * 100 + 50);
                        if (dataset.data.length > 7) {
                            dataset.data.shift();
                        }
                    }
                });
                chart.update('none'); // Sin animación para mejor performance
            }
        });
    }
    
    initializeCountryActivity() {
        // Simular actividad por países con updates periódicos
        setInterval(() => {
            if (!this.isActive) return;
            
            const countries = document.querySelectorAll('.country');
            countries.forEach(country => {
                const usersEl = country.querySelector('.country-users');
                if (usersEl) {
                    const currentCount = parseInt(usersEl.textContent.split(' ')[0]);
                    const newCount = currentCount + Math.floor(Math.random() * 10) - 5;
                    usersEl.textContent = `${Math.max(0, newCount)} usuarios`;
                }
            });
        }, 5000);
    }
    
    initializeLiveActions() {
        // Inicializar el feed con algunas acciones
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.addNewLiveAction();
            }, i * 1000);
        }
    }
    
    bindEvents() {
        // Botones de acción
        document.querySelectorAll('.implement-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleImplementAction(btn);
            });
        });
        
        document.querySelectorAll('.optimize-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleOptimizeAction(btn);
            });
        });
        
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleExportReport(btn);
            });
        });
        
        document.querySelectorAll('.new-test-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleNewTest(btn);
            });
        });
        
        // Period selector
        const periodSelector = document.querySelector('.period-selector');
        if (periodSelector) {
            periodSelector.addEventListener('change', (e) => {
                this.handlePeriodChange(e.target.value);
            });
        }
    }
    
    handleImplementAction(button) {
        // Simular implementación
        button.textContent = 'Implementando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '✅ Implementado';
            button.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            // Mostrar notificación de éxito
            if (window.dashboardController) {
                window.dashboardController.showNotification(
                    '🚀 Optimización implementada exitosamente!',
                    'success'
                );
            }
            
            // Simular impacto en métricas
            setTimeout(() => {
                this.realtimeData.conversionRate += 0.5;
                this.updateConversionMetrics();
            }, 2000);
        }, 3000);
        
        this.trackActionImplemented('urgency_popup');
    }
    
    handleOptimizeAction(button) {
        button.textContent = 'Optimizando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '📈 Optimizado';
            button.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            if (window.dashboardController) {
                window.dashboardController.showNotification(
                    '⚡ ROI Calculator optimizado para máximo rendimiento!',
                    'success'
                );
            }
        }, 2000);
        
        this.trackActionImplemented('roi_optimization');
    }
    
    handleExportReport(button) {
        button.textContent = 'Exportando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '📊 Exportar Reporte';
            button.disabled = false;
            
            if (window.dashboardController) {
                window.dashboardController.showNotification(
                    '📁 Reporte exportado a tu email!',
                    'success'
                );
            }
        }, 2000);
        
        this.trackReportExport('funnel_analysis');
    }
    
    handleNewTest(button) {
        if (window.dashboardController) {
            window.dashboardController.showNotification(
                '🧪 Nuevo A/B Test creado: "CTA Button Color"',
                'success'
            );
        }
        
        this.trackNewTest('cta_button_color');
    }
    
    handlePeriodChange(period) {
        // Simular cambio de período
        if (window.dashboardController) {
            window.dashboardController.showNotification(
                `📊 Datos actualizados para: ${period}`,
                'info'
            );
        }
        
        this.trackPeriodChange(period);
    }
    
    updateConversionMetrics() {
        // Actualizar métricas de conversión después de implementar optimizaciones
        const conversionElements = document.querySelectorAll('.stage-percentage');
        conversionElements.forEach((el, index) => {
            if (index === conversionElements.length - 1) { // Último elemento (conversión final)
                const currentValue = parseFloat(el.textContent);
                const newValue = currentValue + 0.3;
                el.textContent = `${newValue.toFixed(1)}%`;
                el.style.color = '#10B981';
                el.style.fontWeight = '800';
            }
        });
    }
    
    // Analytics tracking methods
    trackAnalyticsView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_pro_view', {
                'event_category': 'engagement',
                'event_label': 'analytics_dashboard'
            });
        }
    }
    
    trackLiveAction(actionType, business) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_live_action', {
                'event_category': 'engagement',
                'event_label': actionType,
                'custom_parameter_1': business
            });
        }
    }
    
    trackActionImplemented(actionType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_action_implemented', {
                'event_category': 'conversion',
                'event_label': actionType,
                'value': 1
            });
        }
    }
    
    trackReportExport(reportType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_report_export', {
                'event_category': 'engagement',
                'event_label': reportType
            });
        }
    }
    
    trackNewTest(testType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_new_test', {
                'event_category': 'engagement',
                'event_label': testType
            });
        }
    }
    
    trackPeriodChange(period) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'analytics_period_change', {
                'event_category': 'engagement',
                'event_label': period
            });
        }
    }
    
    // Cleanup
    destroy() {
        this.isActive = false;
        
        if (this.realTimeUpdates) {
            clearInterval(this.realTimeUpdates);
        }
        
        // Destruir charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        console.log('🧹 Analytics Pro Manager destroyed');
    }
}

// Initialize Analytics Pro Manager when analytics section is active
document.addEventListener('DOMContentLoaded', () => {
    // Observer para inicializar solo cuando se visite la sección analytics
    const analyticsSection = document.getElementById('analytics');
    if (analyticsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !window.analyticsProManager) {
                    window.analyticsProManager = new AnalyticsProManager();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(analyticsSection);
    }
});

// Handle navigation to analytics section
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-section="analytics"]') || e.target.closest('[data-section="analytics"]')) {
        setTimeout(() => {
            if (!window.analyticsProManager) {
                window.analyticsProManager = new AnalyticsProManager();
            }
        }, 500);
    }
});

// Cleanup analytics manager when leaving
window.addEventListener('beforeunload', () => {
    if (window.analyticsProManager) {
        window.analyticsProManager.destroy();
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardController, OmnichannelManager, OnboardingGameManager, AnalyticsProManager };
}