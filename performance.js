// Performance monitoring and optimization script
// Add this to your main JavaScript file or load it separately

(function() {
    'use strict';
    
    // Web Vitals monitoring
    function measureWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            // Track to analytics
            trackPerformanceMetric('LCP', lastEntry.startTime);
        }).observe({entryTypes: ['largest-contentful-paint']});

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
                trackPerformanceMetric('FID', entry.processingStart - entry.startTime);
            }
        }).observe({entryTypes: ['first-input']});

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
            trackPerformanceMetric('CLS', clsValue);
        }).observe({entryTypes: ['layout-shift']});
    }

    // Performance metric tracking
    function trackPerformanceMetric(name, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value)
            });
        }
    }

    // Resource loading optimization
    function optimizeResourceLoading() {
        // Lazy load images with intersection observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        const criticalResources = [
            { href: 'styles.css', as: 'style' },
            { href: 'script.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Font loading optimization
    function optimizeFontLoading() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Inter'),
                document.fonts.load('600 1em Inter'),
                document.fonts.load('400 1em Playfair Display'),
                document.fonts.load('600 1em Playfair Display')
            ]).then(() => {
                document.body.classList.add('font-loaded');
            });
        }
    }

    // Image optimization with WebP support
    function optimizeImages() {
        function supportsWebP() {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('webp') > -1;
        }

        if (supportsWebP()) {
            document.body.classList.add('webp-support');
        }
    }

    // Critical CSS injection for faster rendering
    function injectCriticalCSS() {
        const criticalCSS = `
            .navbar{position:fixed;top:0;width:100%;z-index:1000;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.1)}
            .hero{background:linear-gradient(135deg,#02c9aa,#bfadd7);color:#fff;padding:120px 0 80px;min-height:100vh}
            .nav-menu{display:flex;gap:2rem}
            .nav-link{color:#000;font-weight:500;text-decoration:none}
            .btn{display:inline-block;padding:1rem 2rem;border-radius:8px;font-weight:600;text-decoration:none}
            .btn-primary{background:#02c9aa;color:#fff}
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Performance budget monitoring
    function monitorPerformanceBudget() {
        window.addEventListener('load', () => {
            const navTiming = performance.getEntriesByType('navigation')[0];
            const loadTime = navTiming.loadEventEnd - navTiming.fetchStart;
            
            // Performance budget: 3 seconds
            if (loadTime > 3000) {
                console.warn('Performance budget exceeded:', loadTime, 'ms');
                trackPerformanceMetric('budget_exceeded', loadTime);
            }

            // Monitor resource sizes
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.transferSize > 500000) { // 500KB
                    console.warn('Large resource detected:', resource.name, resource.transferSize);
                }
            });
        });
    }

    // Initialize all optimizations
    function initializeOptimizations() {
        // Only run on browsers that support the features
        if ('IntersectionObserver' in window && 'PerformanceObserver' in window) {
            measureWebVitals();
            optimizeResourceLoading();
            optimizeFontLoading();
            optimizeImages();
            monitorPerformanceBudget();
        }
    }

    // Run optimizations when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOptimizations);
    } else {
        initializeOptimizations();
    }

    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

})();
