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
                this.connectChannel(channel);
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

// Initialize OmnichannelManager along with DashboardController
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for DashboardController to initialize
    setTimeout(() => {
        window.omnichannelManager = new OmnichannelManager();
    }, 500);
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardController, OmnichannelManager };
}