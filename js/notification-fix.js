/**
 * NOTIFICATION CONTRAST FIX
 * Arregla el contraste de todas las notificaciones del sistema
 */

class NotificationFix {
    constructor() {
        this.init();
    }
    
    init() {
        this.injectGlobalNotificationStyles();
        this.fixExistingNotifications();
        this.overrideNotificationMethods();
        console.log('🔧 Notification Contrast Fix aplicado');
    }
    
    injectGlobalNotificationStyles() {
        if (document.querySelector('#notification-fix-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'notification-fix-styles';
        styles.textContent = `
/* Global Notification Contrast Fix */
.notification,
.toast,
.alert,
.message,
.popup,
.banner,
.snackbar,
.notice,
.flash,
[class*="notification"],
[class*="toast"],
[class*="alert"],
[class*="message"] {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
    border-radius: 12px !important;
    font-weight: 500 !important;
}

/* Success notifications */
.notification.success,
.notification-success,
.toast-success,
.alert-success,
.message-success,
[class*="success"] {
    border-left: 4px solid #10b981 !important;
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
}

/* Warning notifications */
.notification.warning,
.notification-warning,
.toast-warning,
.alert-warning,
.message-warning,
[class*="warning"] {
    border-left: 4px solid #f59e0b !important;
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
}

/* Error notifications */
.notification.error,
.notification-error,
.toast-error,
.alert-error,
.message-error,
[class*="error"],
[class*="danger"] {
    border-left: 4px solid #ef4444 !important;
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
}

/* Info notifications */
.notification.info,
.notification-info,
.toast-info,
.alert-info,
.message-info,
[class*="info"] {
    border-left: 4px solid #3b82f6 !important;
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
}

/* Trial notifications */
.trial-notification,
.ultra-notification {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-left: 4px solid #10b981 !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}

.trial-notification.warning,
.ultra-notification.warning {
    border-left-color: #f59e0b !important;
}

/* Toast container positioning */
.toast-container {
    z-index: 10000 !important;
}

/* Notification text elements */
.notification-text,
.notification-title,
.notification-content,
.notification-message,
.toast-text,
.toast-title,
.toast-content,
.alert-text,
.alert-title {
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

/* Close buttons */
.notification-close,
.toast-close,
.alert-close,
.close-btn,
[class*="close"] {
    color: rgba(255, 255, 255, 0.8) !important;
    background: none !important;
    border: none !important;
    font-size: 1.2rem !important;
    cursor: pointer !important;
    padding: 0.25rem !important;
    border-radius: 4px !important;
    transition: all 0.2s ease !important;
}

.notification-close:hover,
.toast-close:hover,
.alert-close:hover {
    color: white !important;
    background: rgba(255, 255, 255, 0.1) !important;
}

/* Icons in notifications */
.notification-icon,
.toast-icon,
.alert-icon,
.message-icon {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

/* Override any specific notification libraries */
/* Toastr */
.toast-success {
    background: rgba(15, 23, 42, 0.95) !important;
    border-left: 4px solid #10b981 !important;
}

.toast-error {
    background: rgba(15, 23, 42, 0.95) !important;
    border-left: 4px solid #ef4444 !important;
}

.toast-warning {
    background: rgba(15, 23, 42, 0.95) !important;
    border-left: 4px solid #f59e0b !important;
}

.toast-info {
    background: rgba(15, 23, 42, 0.95) !important;
    border-left: 4px solid #3b82f6 !important;
}

/* SweetAlert2 */
.swal2-popup {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(15px) !important;
}

.swal2-title,
.swal2-content {
    color: white !important;
}

/* Notyf */
.notyf__toast {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Notiflix */
.nx-message,
.nx-notify {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .notification,
    .toast,
    .alert,
    [class*="notification"] {
        left: 10px !important;
        right: 10px !important;
        max-width: none !important;
    }
}

/* Ensure high specificity for overrides */
body .notification,
body .toast,
body .alert,
body [class*="notification"] {
    background: rgba(15, 23, 42, 0.95) !important;
    color: white !important;
}

/* Animation enhancements */
.notification,
.toast {
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Loading states */
.notification.loading,
.toast.loading {
    position: relative !important;
}

.notification.loading::after,
.toast.loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: loadingBar 1.5s ease-in-out infinite;
}

@keyframes loadingBar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
        `;
        document.head.appendChild(styles);
    }
    
    fixExistingNotifications() {
        // Fix any existing notifications on the page
        const selectors = [
            '.notification',
            '.toast',
            '.alert',
            '.message',
            '.popup',
            '.banner',
            '.snackbar',
            '.notice',
            '[class*="notification"]',
            '[class*="toast"]',
            '[class*="alert"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.applyFixToElement(element);
            });
        });
    }
    
    applyFixToElement(element) {
        // Apply consistent styling
        element.style.background = 'rgba(15, 23, 42, 0.95)';
        element.style.color = 'white';
        element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        element.style.backdropFilter = 'blur(15px)';
        element.style.webkitBackdropFilter = 'blur(15px)';
        element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        element.style.borderRadius = '12px';
        
        // Add border-left based on type
        if (element.classList.contains('success') || element.classList.contains('notification-success')) {
            element.style.borderLeft = '4px solid #10b981';
        } else if (element.classList.contains('warning') || element.classList.contains('notification-warning')) {
            element.style.borderLeft = '4px solid #f59e0b';
        } else if (element.classList.contains('error') || element.classList.contains('notification-error')) {
            element.style.borderLeft = '4px solid #ef4444';
        } else if (element.classList.contains('info') || element.classList.contains('notification-info')) {
            element.style.borderLeft = '4px solid #3b82f6';
        }
        
        // Fix text color for child elements
        const textElements = element.querySelectorAll('*');
        textElements.forEach(child => {
            if (child.tagName !== 'BUTTON' && child.tagName !== 'INPUT') {
                child.style.color = 'white';
            }
        });
    }
    
    overrideNotificationMethods() {
        // Override common notification methods to ensure consistent styling
        
        // Override console methods that might create notifications
        if (window.showNotification) {
            const originalShowNotification = window.showNotification;
            window.showNotification = (message, type = 'info', duration = 5000) => {
                originalShowNotification.call(this, message, type, duration);
                setTimeout(() => this.fixExistingNotifications(), 100);
            };
        }
        
        // Create a global notification method with proper styling
        window.showProNotification = (message, type = 'info', duration = 5000) => {
            const notification = document.createElement('div');
            notification.className = `pro-notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">${this.getTypeIcon(type)}</span>
                    <span class="notification-text">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `;
            
            // Apply styling
            this.applyFixToElement(notification);
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.zIndex = '10000';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.padding = '1rem 1.5rem';
            notification.style.transform = 'translateX(400px)';
            notification.style.transition = 'transform 0.3s ease';
            
            // Add to page
            document.body.appendChild(notification);
            
            // Show with animation
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Auto-hide
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
            
            // Close button
            notification.querySelector('.notification-close').onclick = () => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            };
        };
    }
    
    getTypeIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
    
    // Monitor for new notifications added dynamically
    observeNewNotifications() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is a notification
                        const selectors = [
                            '.notification',
                            '.toast',
                            '.alert',
                            '[class*="notification"]',
                            '[class*="toast"]',
                            '[class*="alert"]'
                        ];
                        
                        selectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.applyFixToElement(node);
                            }
                            
                            // Also check child elements
                            node.querySelectorAll && node.querySelectorAll(selector).forEach(element => {
                                this.applyFixToElement(element);
                            });
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
}

// Initialize notification fix when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.notificationFix = new NotificationFix();
    window.notificationFix.observeNewNotifications();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.notificationFix = new NotificationFix();
        window.notificationFix.observeNewNotifications();
    });
} else {
    window.notificationFix = new NotificationFix();
    window.notificationFix.observeNewNotifications();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationFix;
}