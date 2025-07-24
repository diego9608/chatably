/**
 * Analytics Tracker - Growth-Driven Design
 * Tracks user behavior for continuous improvement
 */

class AnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.config = {
            endpoint: '/api/analytics',
            batchSize: 10,
            flushInterval: 30000, // 30 seconds
            enabledEvents: ['click', 'view', 'scroll', 'conversion', 'error']
        };
        
        this.metrics = {
            pageLoadTime: 0,
            timeOnPage: 0,
            scrollDepth: 0,
            interactionCount: 0,
            errorCount: 0
        };
        
        this.init();
    }
    
    init() {
        // Track page load performance
        this.trackPageLoadMetrics();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start batching timer
        this.startBatchTimer();
        
        // Track Web Vitals
        this.trackWebVitals();
    }
    
    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;
                
                this.track('page_load', {
                    loadTime: this.metrics.pageLoadTime,
                    domReady: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                    firstPaint: perfData.responseEnd - perfData.fetchStart
                });
            }
        });
    }
    
    setupEventListeners() {
        // Click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track], button, a');
            if (target) {
                const trackingData = {
                    element: target.tagName.toLowerCase(),
                    text: target.textContent?.trim().substring(0, 50),
                    trackId: target.dataset.track,
                    href: target.href,
                    action: target.dataset.action
                };
                
                this.track('click', trackingData);
                
                // Track conversions
                if (target.classList.contains('upgrade-btn') || 
                    target.dataset.track?.includes('upgrade')) {
                    this.trackConversion('upgrade_click', trackingData);
                }
            }
        });
        
        // View tracking for sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.track('section_view', {
                        section: entry.target.id || entry.target.dataset.trackSection,
                        viewTime: Date.now(),
                        visibilityRatio: entry.intersectionRatio
                    });
                }
            });
        }, { threshold: [0.25, 0.5, 0.75, 1.0] });
        
        document.querySelectorAll('[data-track-section], .dashboard-section').forEach(section => {
            observer.observe(section);
        });
        
        // Scroll depth tracking
        let maxScrollDepth = 0;
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
                const scrollPercentage = Math.round((scrolled / scrollHeight) * 100);
                
                if (scrollPercentage > maxScrollDepth) {
                    maxScrollDepth = scrollPercentage;
                    this.metrics.scrollDepth = maxScrollDepth;
                    
                    // Track milestone scroll depths
                    if ([25, 50, 75, 90, 100].includes(maxScrollDepth)) {
                        this.track('scroll_depth', {
                            depth: maxScrollDepth,
                            timestamp: Date.now()
                        });
                    }
                }
            }, 100);
        });
        
        // Time on page tracking
        let startTime = Date.now();
        let isActive = true;
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                this.metrics.timeOnPage += Date.now() - startTime;
            } else {
                isActive = true;
                startTime = Date.now();
            }
        });
        
        // Track before unload
        window.addEventListener('beforeunload', () => {
            if (isActive) {
                this.metrics.timeOnPage += Date.now() - startTime;
            }
            this.flush(); // Send remaining events
        });
        
        // Error tracking
        window.addEventListener('error', (e) => {
            this.trackError({
                message: e.message,
                source: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack
            });
        });
    }
    
    trackWebVitals() {
        // Track Core Web Vitals if available
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.track('web_vital', {
                        metric: 'LCP',
                        value: lastEntry.renderTime || lastEntry.loadTime,
                        rating: this.getVitalRating('LCP', lastEntry.renderTime || lastEntry.loadTime)
                    });
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.error('LCP tracking error:', e);
            }
            
            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.track('web_vital', {
                            metric: 'FID',
                            value: entry.processingStart - entry.startTime,
                            rating: this.getVitalRating('FID', entry.processingStart - entry.startTime)
                        });
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.error('FID tracking error:', e);
            }
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
                // Report CLS when page is about to unload
                window.addEventListener('beforeunload', () => {
                    this.track('web_vital', {
                        metric: 'CLS',
                        value: clsValue,
                        rating: this.getVitalRating('CLS', clsValue)
                    });
                });
            } catch (e) {
                console.error('CLS tracking error:', e);
            }
        }
    }
    
    getVitalRating(metric, value) {
        const thresholds = {
            LCP: { good: 2500, needsImprovement: 4000 },
            FID: { good: 100, needsImprovement: 300 },
            CLS: { good: 0.1, needsImprovement: 0.25 }
        };
        
        const threshold = thresholds[metric];
        if (value <= threshold.good) return 'good';
        if (value <= threshold.needsImprovement) return 'needs-improvement';
        return 'poor';
    }
    
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: {
                ...data,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                url: window.location.href,
                referrer: document.referrer,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent
            }
        };
        
        this.events.push(event);
        this.metrics.interactionCount++;
        
        // Auto-flush if batch size reached
        if (this.events.length >= this.config.batchSize) {
            this.flush();
        }
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('📊 Analytics Event:', eventName, data);
        }
    }
    
    trackConversion(conversionType, data = {}) {
        this.track('conversion', {
            type: conversionType,
            value: data.value || 0,
            ...data
        });
        
        // Also track in window for other scripts
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'conversion',
            conversionType,
            conversionData: data
        });
    }
    
    trackError(errorData) {
        this.metrics.errorCount++;
        this.track('error', errorData);
    }
    
    startBatchTimer() {
        setInterval(() => {
            if (this.events.length > 0) {
                this.flush();
            }
        }, this.config.flushInterval);
    }
    
    async flush() {
        if (this.events.length === 0) return;
        
        const eventsToSend = [...this.events];
        this.events = []; // Clear events array
        
        try {
            // In production, send to analytics endpoint
            if (window.location.hostname !== 'localhost') {
                await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': this.sessionId
                    },
                    body: JSON.stringify({
                        events: eventsToSend,
                        metrics: this.metrics
                    })
                });
            }
            
            // Also send to any configured third-party analytics
            this.sendToThirdParty(eventsToSend);
            
        } catch (error) {
            console.error('Analytics flush error:', error);
            // Re-add events to queue on error
            this.events = eventsToSend.concat(this.events);
        }
    }
    
    sendToThirdParty(events) {
        // Google Analytics 4 integration
        if (window.gtag) {
            events.forEach(event => {
                window.gtag('event', event.name, event.data);
            });
        }
        
        // Facebook Pixel integration
        if (window.fbq) {
            events.forEach(event => {
                if (event.name === 'conversion') {
                    window.fbq('track', 'Purchase', event.data);
                }
            });
        }
        
        // Custom webhook integration
        if (window.analyticsWebhook) {
            fetch(window.analyticsWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events)
            }).catch(e => console.error('Webhook error:', e));
        }
    }
    
    // Public API methods
    setUserId(userId) {
        this.userId = userId;
    }
    
    setUserProperties(properties) {
        this.userProperties = { ...this.userProperties, ...properties };
    }
    
    trackCustomEvent(eventName, data) {
        this.track(`custom_${eventName}`, data);
    }
    
    getSessionMetrics() {
        return {
            sessionId: this.sessionId,
            metrics: this.metrics,
            eventCount: this.events.length
        };
    }
}

// Initialize Analytics Tracker
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsTracker = new AnalyticsTracker();
    
    // Expose global tracking function
    window.trackEvent = (eventName, data) => {
        window.analyticsTracker.trackCustomEvent(eventName, data);
    };
});