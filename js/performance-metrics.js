/**
 * Performance Metrics Collector
 * Real-time performance monitoring with feature impact tracking
 */

class PerformanceMetrics {
    constructor() {
        this.metrics = {
            pageLoad: {},
            coreWebVitals: {},
            features: {},
            resources: {},
            runtime: {}
        };
        
        this.observers = new Map();
        this.featureTimings = new Map();
        this.isCollecting = false;
        this.updateCallbacks = new Set();
        
        this.init();
    }

    init() {
        this.collectPageLoadMetrics();
        this.setupCoreWebVitals();
        this.setupResourceMonitoring();
        this.setupRuntimeMonitoring();
        this.startPeriodicCollection();
        
        console.log('📊 Performance metrics collector initialized');
    }

    /**
     * Page Load Metrics
     */
    collectPageLoadMetrics() {
        if (!performance.getEntriesByType) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                this.metrics.pageLoad = {
                    // Navigation Timing
                    dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
                    tcpConnection: Math.round(navigation.connectEnd - navigation.connectStart),
                    serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),
                    domParsing: Math.round(navigation.domContentLoadedEventEnd - navigation.responseEnd),
                    resourceLoading: Math.round(navigation.loadEventEnd - navigation.domContentLoadedEventEnd),
                    
                    // Total Times
                    totalLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                    firstByte: Math.round(navigation.responseStart - navigation.requestStart),
                    
                    // Paint Timing
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                    
                    // Additional Metrics
                    transferSize: navigation.transferSize || 0,
                    encodedBodySize: navigation.encodedBodySize || 0,
                    decodedBodySize: navigation.decodedBodySize || 0,
                    
                    timestamp: Date.now()
                };
                
                this.notifyUpdate('pageLoad');
            }, 100);
        });
    }

    /**
     * Core Web Vitals
     */
    setupCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    this.metrics.coreWebVitals.lcp = {
                        value: Math.round(lastEntry.startTime),
                        rating: this.getLCPRating(lastEntry.startTime),
                        element: lastEntry.element?.tagName || 'unknown',
                        timestamp: Date.now()
                    };
                    
                    this.notifyUpdate('coreWebVitals');
                });
                
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        const fid = entry.processingStart - entry.startTime;
                        
                        this.metrics.coreWebVitals.fid = {
                            value: Math.round(fid),
                            rating: this.getFIDRating(fid),
                            eventType: entry.name,
                            timestamp: Date.now()
                        };
                        
                        this.notifyUpdate('coreWebVitals');
                    });
                });
                
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);
            } catch (e) {
                console.warn('FID observer not supported');
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    
                    this.metrics.coreWebVitals.cls = {
                        value: Math.round(clsValue * 1000) / 1000,
                        rating: this.getCLSRating(clsValue),
                        timestamp: Date.now()
                    };
                    
                    this.notifyUpdate('coreWebVitals');
                });
                
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }
    }

    /**
     * Resource Monitoring
     */
    setupResourceMonitoring() {
        if (!performance.getEntriesByType) return;

        const updateResourceMetrics = () => {
            const resources = performance.getEntriesByType('resource');
            const totalSize = resources.reduce((acc, resource) => {
                return acc + (resource.transferSize || 0);
            }, 0);

            this.metrics.resources = {
                totalRequests: resources.length,
                totalSize: Math.round(totalSize / 1024), // KB
                averageLoadTime: Math.round(
                    resources.reduce((acc, r) => acc + r.duration, 0) / resources.length
                ),
                
                // By type
                byType: this.categorizeResources(resources),
                
                // Slow resources (>1s)
                slowResources: resources
                    .filter(r => r.duration > 1000)
                    .map(r => ({
                        name: r.name.split('/').pop(),
                        duration: Math.round(r.duration),
                        size: Math.round((r.transferSize || 0) / 1024)
                    })),
                
                timestamp: Date.now()
            };
            
            this.notifyUpdate('resources');
        };

        // Update on load and periodically
        window.addEventListener('load', updateResourceMetrics);
        setInterval(updateResourceMetrics, 5000);
    }

    categorizeResources(resources) {
        const categories = {
            scripts: { count: 0, size: 0, time: 0 },
            stylesheets: { count: 0, size: 0, time: 0 },
            images: { count: 0, size: 0, time: 0 },
            fonts: { count: 0, size: 0, time: 0 },
            other: { count: 0, size: 0, time: 0 }
        };

        resources.forEach(resource => {
            let category = 'other';
            
            if (resource.initiatorType === 'script' || resource.name.includes('.js')) {
                category = 'scripts';
            } else if (resource.initiatorType === 'link' || resource.name.includes('.css')) {
                category = 'stylesheets';
            } else if (resource.initiatorType === 'img' || /\.(png|jpg|jpeg|gif|svg|webp)/.test(resource.name)) {
                category = 'images';
            } else if (/\.(woff|woff2|ttf|eot)/.test(resource.name)) {
                category = 'fonts';
            }

            categories[category].count++;
            categories[category].size += Math.round((resource.transferSize || 0) / 1024);
            categories[category].time += resource.duration;
        });

        // Calculate averages
        Object.keys(categories).forEach(key => {
            const cat = categories[key];
            cat.avgTime = cat.count > 0 ? Math.round(cat.time / cat.count) : 0;
        });

        return categories;
    }

    /**
     * Runtime Performance Monitoring
     */
    setupRuntimeMonitoring() {
        this.startTime = performance.now();
        this.frameCount = 0;
        this.fpsHistory = [];
        
        // FPS monitoring
        const measureFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            const elapsed = currentTime - this.lastFrameTime || currentTime;
            
            if (elapsed >= 1000) { // Every second
                const fps = Math.round((this.frameCount * 1000) / elapsed);
                this.fpsHistory.push(fps);
                
                // Keep only last 10 seconds
                if (this.fpsHistory.length > 10) {
                    this.fpsHistory.shift();
                }
                
                this.metrics.runtime.fps = {
                    current: fps,
                    average: Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length),
                    history: [...this.fpsHistory],
                    timestamp: Date.now()
                };
                
                this.frameCount = 0;
                this.lastFrameTime = currentTime;
                this.notifyUpdate('runtime');
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);

        // Memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.metrics.runtime.memory = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024), // MB
                    timestamp: Date.now()
                };
                
                this.notifyUpdate('runtime');
            }, 2000);
        }
    }

    /**
     * Feature Performance Tracking
     */
    startFeatureTracking(featureName) {
        const startTime = performance.now();
        this.featureTimings.set(featureName, {
            startTime,
            domNodesBefore: document.querySelectorAll('*').length,
            timestamp: Date.now()
        });
    }

    endFeatureTracking(featureName) {
        const timing = this.featureTimings.get(featureName);
        if (!timing) return;

        const endTime = performance.now();
        const duration = endTime - timing.startTime;
        const domNodesAfter = document.querySelectorAll('*').length;
        const domNodesAdded = domNodesAfter - timing.domNodesBefore;

        this.metrics.features[featureName] = {
            initTime: Math.round(duration),
            domNodesAdded,
            isEnabled: true,
            impact: this.calculateFeatureImpact(duration, domNodesAdded),
            timestamp: Date.now()
        };

        this.featureTimings.delete(featureName);
        this.notifyUpdate('features');
        
        console.log(`📊 Feature "${featureName}" took ${Math.round(duration)}ms, added ${domNodesAdded} DOM nodes`);
    }

    calculateFeatureImpact(duration, domNodes) {
        let impact = 'low';
        
        if (duration > 100 || domNodes > 50) {
            impact = 'high';
        } else if (duration > 50 || domNodes > 20) {
            impact = 'medium';
        }
        
        return impact;
    }

    markFeatureDisabled(featureName) {
        if (this.metrics.features[featureName]) {
            this.metrics.features[featureName].isEnabled = false;
            this.notifyUpdate('features');
        }
    }

    /**
     * Rating Helpers
     */
    getLCPRating(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }

    getFIDRating(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }

    getCLSRating(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Periodic Collection
     */
    startPeriodicCollection() {
        this.isCollecting = true;
        
        setInterval(() => {
            if (!this.isCollecting) return;
            
            // Update general metrics
            this.metrics.runtime.uptime = Math.round((performance.now() - this.startTime) / 1000);
            this.metrics.runtime.timestamp = Date.now();
            
            this.notifyUpdate('runtime');
        }, 1000);
    }

    stopCollection() {
        this.isCollecting = false;
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }

    /**
     * Subscription Management
     */
    onUpdate(callback) {
        this.updateCallbacks.add(callback);
        
        // Send current metrics immediately
        callback(this.metrics);
    }

    offUpdate(callback) {
        this.updateCallbacks.delete(callback);
    }

    notifyUpdate(category) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(this.metrics, category);
            } catch (error) {
                console.error('Error in metrics callback:', error);
            }
        });
    }

    /**
     * Export Methods
     */
    getMetrics() {
        return { ...this.metrics };
    }

    exportMetrics() {
        return {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.getMetrics()
        };
    }

    generateReport() {
        const metrics = this.getMetrics();
        const report = [];

        // Page Load Performance
        if (metrics.pageLoad.totalLoadTime) {
            report.push(`Page Load: ${metrics.pageLoad.totalLoadTime}ms`);
            report.push(`DOM Ready: ${metrics.pageLoad.domReady}ms`);
            report.push(`First Paint: ${Math.round(metrics.pageLoad.firstPaint)}ms`);
        }

        // Core Web Vitals
        if (metrics.coreWebVitals.lcp) {
            report.push(`LCP: ${metrics.coreWebVitals.lcp.value}ms (${metrics.coreWebVitals.lcp.rating})`);
        }
        if (metrics.coreWebVitals.fid) {
            report.push(`FID: ${metrics.coreWebVitals.fid.value}ms (${metrics.coreWebVitals.fid.rating})`);
        }
        if (metrics.coreWebVitals.cls) {
            report.push(`CLS: ${metrics.coreWebVitals.cls.value} (${metrics.coreWebVitals.cls.rating})`);
        }

        // Features Impact
        const features = Object.entries(metrics.features);
        if (features.length > 0) {
            report.push('--- Features Impact ---');
            features.forEach(([name, data]) => {
                if (data.isEnabled) {
                    report.push(`${name}: ${data.initTime}ms (${data.impact} impact)`);
                }
            });
        }

        // Resources
        if (metrics.resources.totalRequests) {
            report.push(`Resources: ${metrics.resources.totalRequests} requests, ${metrics.resources.totalSize}KB`);
        }

        // Runtime
        if (metrics.runtime.fps) {
            report.push(`FPS: ${metrics.runtime.fps.current} (avg: ${metrics.runtime.fps.average})`);
        }
        if (metrics.runtime.memory) {
            report.push(`Memory: ${metrics.runtime.memory.used}MB / ${metrics.runtime.memory.total}MB`);
        }

        return report.join('\n');
    }
}

// Initialize performance metrics
window.PerformanceMetrics = PerformanceMetrics;
window.performanceMetrics = new PerformanceMetrics();

// Hook into feature toggles to track performance impact
if (window.FeatureToggle) {
    const originalToggleFeature = window.FeatureToggle.manager?.toggleFeature;
    if (originalToggleFeature) {
        window.FeatureToggle.manager.toggleFeature = function(featureName, enabled) {
            if (enabled) {
                window.performanceMetrics.startFeatureTracking(featureName);
            } else {
                window.performanceMetrics.markFeatureDisabled(featureName);
            }
            
            const result = originalToggleFeature.call(this, featureName, enabled);
            
            if (enabled) {
                // End tracking after a short delay to capture initialization
                setTimeout(() => {
                    window.performanceMetrics.endFeatureTracking(featureName);
                }, 100);
            }
            
            return result;
        };
    }
}

console.log('📊 Performance metrics system ready');