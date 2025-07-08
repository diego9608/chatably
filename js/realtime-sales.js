/**
 * REALTIME SALES TRACKER
 * Sistema profesional de ventas en tiempo real sin gamification
 */

class RealTimeSalesTracker {
    constructor() {
        this.salesData = [];
        this.totalRevenue = 47850;
        this.todaysSales = 12;
        this.conversionRate = 24.7;
        this.avgTicket = 2850;
        this.responseTime = 18;
        this.init();
    }
    
    init() {
        this.createSalesWidget();
        this.startRealTimeSales();
        this.injectStyles();
        console.log('💰 Real-Time Sales Tracker inicializado');
    }
    
    createSalesWidget() {
        const widget = document.createElement('div');
        widget.className = 'realtime-sales-widget';
        widget.innerHTML = `
            <div class="sales-header">
                <h3>💰 Ventas en Tiempo Real</h3>
                <div class="live-indicator">
                    <span class="live-dot"></span>
                    EN VIVO
                </div>
            </div>
            
            <div class="revenue-section">
                <div class="total-revenue">
                    <span class="revenue-label">Ingresos Hoy</span>
                    <span class="revenue-amount" id="live-revenue">$${this.totalRevenue.toLocaleString()}</span>
                </div>
                
                <div class="sales-count">
                    <span class="count-label">Ventas</span>
                    <span class="count-value" id="sales-count">${this.todaysSales}</span>
                </div>
            </div>
            
            <div class="recent-sales">
                <h4>Últimas Ventas</h4>
                <div class="sales-feed" id="sales-feed">
                    <!-- Ventas aparecerán aquí -->
                </div>
            </div>
            
            <div class="sales-metrics">
                <div class="metric">
                    <span class="metric-value" id="conversion-rate">${this.conversionRate}%</span>
                    <span class="metric-label">Conversión</span>
                </div>
                <div class="metric">
                    <span class="metric-value" id="avg-ticket">$${this.avgTicket.toLocaleString()}</span>
                    <span class="metric-label">Ticket Promedio</span>
                </div>
                <div class="metric">
                    <span class="metric-value" id="response-time">${this.responseTime}s</span>
                    <span class="metric-label">Respuesta</span>
                </div>
            </div>
        `;
        
        // Insertar en el dashboard principal, reemplazando la sección gamificada
        const professionalSection = document.querySelector('#professional-dashboard, .professional-dashboard');
        if (professionalSection) {
            professionalSection.innerHTML = '';
            professionalSection.appendChild(widget);
        } else {
            // Sino, insertar al inicio del dashboard
            const dashboardSection = document.querySelector('#inicio');
            if (dashboardSection) {
                dashboardSection.insertBefore(widget, dashboardSection.firstChild);
            }
        }
    }
    
    startRealTimeSales() {
        // Generar primera venta inmediata
        setTimeout(() => this.generateSale(), 3000);
        
        // Generar ventas cada 30-90 segundos
        setInterval(() => {
            this.generateSale();
        }, Math.random() * 60000 + 30000);
        
        // Actualizar métricas cada 10 segundos
        setInterval(() => {
            this.updateMetrics();
        }, 10000);
    }
    
    generateSale() {
        const products = [
            { name: 'Plan Premium Mensual', price: 4999 },
            { name: 'Consulta Especializada', price: 1500 },
            { name: 'Setup Completo', price: 3200 },
            { name: 'Automatización VIP', price: 8500 },
            { name: 'Plan Anual', price: 45000 },
            { name: 'Integración Personalizada', price: 12000 }
        ];
        
        const channels = ['WhatsApp', 'Landing Page', 'Chat Widget', 'Instagram DM'];
        const locations = ['México', 'Colombia', 'España', 'Argentina', 'Perú'];
        
        const product = products[Math.floor(Math.random() * products.length)];
        const channel = channels[Math.floor(Math.random() * channels.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        const sale = {
            id: Date.now(),
            product: product.name,
            price: product.price,
            channel: channel,
            location: location,
            time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        };
        
        this.salesData.unshift(sale);
        this.addSaleToFeed(sale);
        this.updateRevenue(sale.price);
        this.showSaleNotification(sale);
        this.updateSalesCount();
    }
    
    addSaleToFeed(sale) {
        const feed = document.getElementById('sales-feed');
        if (!feed) return;
        
        const saleElement = document.createElement('div');
        saleElement.className = 'sale-item new-sale';
        saleElement.innerHTML = `
            <div class="sale-main">
                <div class="sale-info">
                    <span class="sale-product">${sale.product}</span>
                    <span class="sale-details">${sale.channel} • ${sale.location}</span>
                </div>
                <div class="sale-price">+$${sale.price.toLocaleString()}</div>
            </div>
            <div class="sale-time">${sale.time}</div>
        `;
        
        feed.insertBefore(saleElement, feed.firstChild);
        
        // Mantener solo últimas 6 ventas
        if (feed.children.length > 6) {
            feed.removeChild(feed.lastChild);
        }
        
        // Animación de entrada
        setTimeout(() => saleElement.classList.remove('new-sale'), 100);
    }
    
    updateRevenue(amount) {
        this.totalRevenue += amount;
        const revenueElement = document.getElementById('live-revenue');
        if (revenueElement) {
            revenueElement.classList.add('updating');
            revenueElement.textContent = `$${this.totalRevenue.toLocaleString()}`;
            setTimeout(() => revenueElement.classList.remove('updating'), 500);
        }
    }
    
    updateSalesCount() {
        this.todaysSales++;
        const countElement = document.getElementById('sales-count');
        if (countElement) {
            countElement.classList.add('updating');
            countElement.textContent = this.todaysSales;
            setTimeout(() => countElement.classList.remove('updating'), 500);
        }
    }
    
    updateMetrics() {
        // Simular pequeñas fluctuaciones realistas
        this.conversionRate += (Math.random() - 0.5) * 0.2;
        this.conversionRate = Math.max(20, Math.min(30, this.conversionRate));
        
        this.responseTime += Math.floor((Math.random() - 0.5) * 4);
        this.responseTime = Math.max(12, Math.min(25, this.responseTime));
        
        if (this.salesData.length > 0) {
            this.avgTicket = this.salesData.reduce((sum, sale) => sum + sale.price, 0) / this.salesData.length;
        }
        
        // Actualizar UI
        const conversionEl = document.getElementById('conversion-rate');
        const responseEl = document.getElementById('response-time');
        const ticketEl = document.getElementById('avg-ticket');
        
        if (conversionEl) conversionEl.textContent = `${this.conversionRate.toFixed(1)}%`;
        if (responseEl) responseEl.textContent = `${this.responseTime}s`;
        if (ticketEl) ticketEl.textContent = `$${Math.floor(this.avgTicket).toLocaleString()}`;
    }
    
    showSaleNotification(sale) {
        // Remover notification anterior si existe
        const existing = document.querySelector('.sale-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'sale-notification';
        notification.innerHTML = `
            <div class="notification-icon">💰</div>
            <div class="notification-content">
                <div class="notification-title">¡Nueva Venta!</div>
                <div class="notification-text">${sale.product}</div>
                <div class="notification-details">$${sale.price.toLocaleString()} • ${sale.channel}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    injectStyles() {
        if (document.querySelector('#sales-tracker-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'sales-tracker-styles';
        styles.textContent = `
/* Real-Time Sales Tracker Styles */
.realtime-sales-widget {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.realtime-sales-widget::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    animation: salesPulse 6s ease-in-out infinite;
}

@keyframes salesPulse {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    50% { transform: scale(1.1) rotate(180deg); opacity: 0.4; }
}

.sales-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;
}

.sales-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
}

.live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(239, 68, 68, 0.15);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(239, 68, 68, 0.3);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.live-dot {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    animation: livePulse 2s ease-in-out infinite;
}

@keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
}

.revenue-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
}

.total-revenue {
    text-align: left;
}

.revenue-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.revenue-amount {
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #10b981, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1;
}

.revenue-amount.updating {
    transform: scale(1.05);
    filter: brightness(1.2);
}

.sales-count {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.count-label {
    display: block;
    font-size: 0.85rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.count-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fbbf24;
    transition: all 0.5s ease;
}

.count-value.updating {
    transform: scale(1.1);
    color: #f59e0b;
}

.recent-sales {
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
}

.recent-sales h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    opacity: 0.9;
    font-weight: 600;
}

.sales-feed {
    max-height: 300px;
    overflow-y: auto;
}

.sale-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
    opacity: 1;
}

.sale-item.new-sale {
    transform: translateX(100%);
    opacity: 0;
}

.sale-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(16, 185, 129, 0.3);
}

.sale-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.sale-info {
    flex: 1;
}

.sale-product {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
}

.sale-details {
    font-size: 0.8rem;
    opacity: 0.7;
}

.sale-price {
    font-weight: 700;
    font-size: 1.1rem;
    color: #10b981;
    white-space: nowrap;
}

.sale-time {
    font-size: 0.75rem;
    opacity: 0.6;
    text-align: right;
}

.sales-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    position: relative;
    z-index: 2;
}

.metric {
    text-align: center;
    padding: 1.25rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.metric:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
}

.metric-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: #fbbf24;
}

.metric-label {
    font-size: 0.8rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Sale Notification - Fixed contrast */
.sale-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-left: 4px solid #10b981;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    display: flex;
    align-items: center;
    gap: 1rem;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    max-width: 350px;
}

.sale-notification.show {
    transform: translateX(0);
}

.notification-icon {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.notification-content {
    flex: 1;
}

.notification-title {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: white !important;
}

.notification-text {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.25rem;
    color: white !important;
}

.notification-details {
    font-size: 0.8rem;
    opacity: 0.7;
    color: #10b981 !important;
    font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
    .revenue-section {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .revenue-amount {
        font-size: 2.5rem;
    }
    
    .sales-metrics {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .sale-notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .sale-notification.show {
        transform: translateY(0);
    }
    
    .sale-main {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .sale-price {
        align-self: flex-end;
    }
}

@media (max-width: 480px) {
    .realtime-sales-widget {
        padding: 1.5rem;
        border-radius: 16px;
    }
    
    .revenue-amount {
        font-size: 2rem;
    }
    
    .count-value {
        font-size: 2rem;
    }
    
    .sales-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

/* Scrollbar Styling */
.sales-feed::-webkit-scrollbar {
    width: 4px;
}

.sales-feed::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.sales-feed::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.5);
    border-radius: 2px;
}

.sales-feed::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.7);
}
        `;
        document.head.appendChild(styles);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard')) {
        // Wait for dashboard to load, then initialize
        setTimeout(() => {
            window.realTimeSales = new RealTimeSalesTracker();
        }, 1000);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeSalesTracker;
}