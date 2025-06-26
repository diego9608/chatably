/**
 * Performance Optimizations
 * Lazy loading, image optimization, and other performance enhancements
 */

class PerformanceOptimizer {
    constructor() {
        this.lazyImageObserver = null;
        this.init();
    }

    init() {
        // Initialize all optimizations when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initOptimizations();
            });
        } else {
            this.initOptimizations();
        }
    }

    initOptimizations() {
        this.setupLazyLoading();
        this.optimizeResources();
        this.setupCriticalResourceHints();
        this.implementImageOptimizations();
        this.setupScrollOptimizations();
        
        console.log('🚀 Performance optimizations initialized');
    }

    /**
     * Lazy Loading Implementation
     * Uses Intersection Observer API for efficient lazy loading
     */
    setupLazyLoading() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            this.lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.lazyImageObserver.unobserve(img);
                    }
                });
            }, {
                // Start loading when image is 100px from viewport
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src attribute
            this.observeLazyImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }

        // Lazy loading for iframes (if any)
        this.setupIframeLazyLoading();
    }

    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.lazyImageObserver.observe(img);
        });
    }

    loadImage(img) {
        // Add loading placeholder
        img.classList.add('loading');
        
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        // Create a new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Image loaded successfully
            img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // Remove data attributes to clean up
            delete img.dataset.src;
            delete img.dataset.srcset;
        };
        
        imageLoader.onerror = () => {
            // Handle loading error
            img.classList.remove('loading');
            img.classList.add('error');
            console.warn('Failed to load image:', src);
        };
        
        // Start loading
        imageLoader.src = src;
    }

    loadAllImages() {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    setupIframeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const iframeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const iframe = entry.target;
                        iframe.src = iframe.dataset.src;
                        iframe.classList.add('loaded');
                        iframeObserver.unobserve(iframe);
                    }
                });
            });

            document.querySelectorAll('iframe[data-src]').forEach(iframe => {
                iframeObserver.observe(iframe);
            });
        }
    }

    /**
     * Resource Optimization
     */
    optimizeResources() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical scripts
        this.deferNonCriticalScripts();
        
        // Optimize font loading
        this.optimizeFontLoading();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/styles.css', as: 'style' },
            { href: 'js/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            if (!document.querySelector(`link[href="${resource.href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                document.head.appendChild(link);
            }
        });
    }

    deferNonCriticalScripts() {
        // Add defer attribute to non-critical scripts
        const nonCriticalScripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
        nonCriticalScripts.forEach(script => {
            // Skip if it's a critical script
            if (!script.src.includes('main.js') && !script.src.includes('gtag')) {
                script.defer = true;
            }
        });
    }

    optimizeFontLoading() {
        // Add font-display: swap to improve loading performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: system-ui;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Critical Resource Hints
     */
    setupCriticalResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
            { rel: 'dns-prefetch', href: '//connect.facebook.net' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            if (!document.querySelector(`link[href="${hint.href}"]`)) {
                const link = document.createElement('link');
                Object.assign(link, hint);
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Image Optimizations
     */
    implementImageOptimizations() {
        // Add responsive image placeholder
        this.addImagePlaceholders();
        
        // Implement progressive image loading
        this.setupProgressiveLoading();
    }

    addImagePlaceholders() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            // Add low-quality placeholder
            if (!img.src && !img.dataset.placeholder) {
                // Create a 1x1 transparent placeholder
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                img.style.backgroundColor = '#f0f0f0';
                img.style.transition = 'opacity 0.3s ease';
            }
        });
    }

    setupProgressiveLoading() {
        // Create CSS for loading states
        const loadingCSS = `
            img.loading {
                opacity: 0.7;
                filter: blur(5px);
                transform: scale(1.05);
                transition: all 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
                filter: none;
                transform: scale(1);
            }
            
            img.error {
                opacity: 0.5;
                background: #f0f0f0 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ccc" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') center/50% no-repeat;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = loadingCSS;
        document.head.appendChild(style);
    }

    /**
     * Scroll Optimizations
     */
    setupScrollOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        let lastScrollTop = 0;

        const throttledScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Only process if scroll position changed significantly
            if (Math.abs(scrollTop - lastScrollTop) > 5) {
                this.handleScroll(scrollTop);
                lastScrollTop = scrollTop;
            }
        };

        // Use passive event listeners for better performance
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                throttledScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }, { passive: true });
    }

    handleScroll(scrollTop) {
        // Implement scroll-based optimizations
        this.updateHeaderOnScroll(scrollTop);
        this.lazyLoadOnScroll(scrollTop);
    }

    updateHeaderOnScroll(scrollTop) {
        const header = document.querySelector('header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    lazyLoadOnScroll(scrollTop) {
        // Additional lazy loading optimizations based on scroll position
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Preload images that will be visible soon
        if (scrollTop + windowHeight > documentHeight * 0.8) {
            this.preloadBelowFold();
        }
    }

    preloadBelowFold() {
        // Preload images that are just below the fold
        const upcomingImages = document.querySelectorAll('img[data-src]');
        upcomingImages.forEach((img, index) => {
            if (index < 3) { // Preload next 3 images
                this.loadImage(img);
                this.lazyImageObserver?.unobserve(img);
            }
        });
    }

    /**
     * Utility Methods
     */
    
    // Convert regular images to lazy loading
    convertToLazyLoading() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.src.startsWith('data:')) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                this.lazyImageObserver?.observe(img);
            }
        });
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    
                    console.log('📊 Performance Metrics:', {
                        'Page Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
                        'DOM Ready': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
                        'First Paint': Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) + 'ms'
                    });
                    
                    // Track Core Web Vitals if available
                    this.trackCoreWebVitals();
                }, 0);
            });
        }
    }

    trackCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', Math.round(lastEntry.startTime));
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Track First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', Math.round(entry.processingStart - entry.startTime));
                });
            }).observe({ entryTypes: ['first-input'] });
        }
    }
}

// Initialize performance optimizations
new PerformanceOptimizer();

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;