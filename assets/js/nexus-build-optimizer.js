/**
 * Nexus Build Optimizer
 * CSS/JS minification and optimization utilities
 * Version: 3.0.0
 */

class NexusBuildOptimizer {
    constructor() {
        this.cssCache = new Map();
        this.jsCache = new Map();
        this.optimizedAssets = new Set();
        this.loadedResources = new Map();
        
        this.init();
    }

    /**
     * Initialize build optimizer
     */
    init() {
        console.log('⚡ Nexus Build Optimizer initializing...');
        
        // Optimize critical CSS delivery
        this.optimizeCriticalCSS();
        
        // Setup dynamic import optimization
        this.setupDynamicImports();
        
        // Optimize font loading
        this.optimizeFontLoading();
        
        // Setup resource bundling
        this.setupResourceBundling();
        
        // Monitor and optimize
        this.startPerformanceMonitoring();
        
        console.log('✅ Nexus Build Optimizer initialized');
    }

    /**
     * Optimize critical CSS delivery
     */
    optimizeCriticalCSS() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
        /* Critical CSS - Above the fold optimizations */
        .critical-above-fold { display: block; visibility: visible; opacity: 1; }
        .prevent-cls { width: 100%; height: auto; aspect-ratio: attr(width) / attr(height); }
        
        /* Critical layout styles */
        .gh-head { position: relative; z-index: 100; }
        .site-content { min-height: 50vh; }
        
        /* Critical typography */
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        h1, h2, h3 { font-weight: 600; line-height: 1.2; }
        
        /* Critical loading states */
        .loading { opacity: 0.6; pointer-events: none; }
        .loaded { opacity: 1; pointer-events: auto; transition: opacity 0.3s ease; }
        `;

        // Inject critical CSS
        const style = document.createElement('style');
        style.textContent = this.minifyCSS(criticalCSS);
        style.setAttribute('data-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);

        // Mark non-critical CSS for deferred loading
        this.deferNonCriticalCSS();
    }

    /**
     * Defer non-critical CSS loading
     */
    deferNonCriticalCSS() {
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        nonCriticalCSS.forEach((link, index) => {
            // Skip first 3 stylesheets (critical)
            if (index < 3) return;
            
            // Convert to preload and load asynchronously
            link.setAttribute('rel', 'preload');
            link.setAttribute('as', 'style');
            link.setAttribute('onload', 'this.onload=null;this.rel="stylesheet"');
            
            // Fallback for browsers that don't support preload
            const noscript = document.createElement('noscript');
            const fallbackLink = link.cloneNode();
            fallbackLink.setAttribute('rel', 'stylesheet');
            noscript.appendChild(fallbackLink);
            link.parentNode.insertBefore(noscript, link.nextSibling);
        });
    }

    /**
     * Setup dynamic imports for non-critical JavaScript
     */
    setupDynamicImports() {
        // Define modules that can be loaded on-demand
        const dynamicModules = {
            'admin': () => import('./nexus-admin-customization.js'),
            'accessibility': () => import('./nexus-accessibility.js'),
            'mobile-gestures': () => import('./nexus-mobile-gestures.js')
        };

        // Create module loader
        window.nexusLoadModule = async (moduleName) => {
            if (this.loadedResources.has(moduleName)) {
                return this.loadedResources.get(moduleName);
            }

            if (dynamicModules[moduleName]) {
                try {
                    const module = await dynamicModules[moduleName]();
                    this.loadedResources.set(moduleName, module);
                    return module;
                } catch (error) {
                    console.error(`Failed to load module ${moduleName}:`, error);
                    return null;
                }
            }

            console.warn(`Module ${moduleName} not found`);
            return null;
        };

        // Load modules based on user interaction
        this.setupIntersectionBasedLoading();
    }

    /**
     * Setup intersection-based loading
     */
    setupIntersectionBasedLoading() {
        // Load admin module when admin trigger is visible
        const adminTrigger = document.querySelector('.nexus-admin-toggle');
        if (adminTrigger) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        window.nexusLoadModule('admin');
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(adminTrigger);
        }

        // Load mobile gestures on touch devices
        if ('ontouchstart' in window) {
            window.nexusLoadModule('mobile-gestures');
        }

        // Load accessibility features on keyboard navigation
        document.addEventListener('keydown', () => {
            window.nexusLoadModule('accessibility');
        }, { once: true });
    }

    /**
     * Optimize font loading
     */
    optimizeFontLoading() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
            'https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2'
        ];

        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = fontUrl;
            document.head.appendChild(link);
        });

        // Implement font display swap strategy
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
            }
            @font-face {
                font-family: 'JetBrains Mono';
                font-display: swap;
            }
            @font-face {
                font-family: 'Fira Code';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup resource bundling
     */
    setupResourceBundling() {
        // Create a resource loader that bundles requests
        this.resourceQueue = [];
        this.resourceTimer = null;

        window.nexusLoadResource = (type, url, callback) => {
            this.resourceQueue.push({ type, url, callback });
            
            // Debounce resource loading
            clearTimeout(this.resourceTimer);
            this.resourceTimer = setTimeout(() => {
                this.processResourceQueue();
            }, 100);
        };
    }

    /**
     * Process queued resources
     */
    processResourceQueue() {
        if (this.resourceQueue.length === 0) return;

        // Group resources by type
        const grouped = this.resourceQueue.reduce((acc, resource) => {
            if (!acc[resource.type]) acc[resource.type] = [];
            acc[resource.type].push(resource);
            return acc;
        }, {});

        // Load resources in batches
        Object.entries(grouped).forEach(([type, resources]) => {
            if (type === 'css') {
                this.loadCSSBatch(resources);
            } else if (type === 'js') {
                this.loadJSBatch(resources);
            }
        });

        // Clear the queue
        this.resourceQueue = [];
    }

    /**
     * Load CSS resources in batch
     */
    loadCSSBatch(resources) {
        const fragment = document.createDocumentFragment();
        
        resources.forEach(({ url, callback }) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => {
                if (callback) callback();
                console.log(`📦 Loaded CSS: ${url}`);
            };
            link.onerror = () => {
                console.error(`❌ Failed to load CSS: ${url}`);
            };
            fragment.appendChild(link);
        });

        document.head.appendChild(fragment);
    }

    /**
     * Load JS resources in batch
     */
    loadJSBatch(resources) {
        // Use Promise.all for parallel loading
        const loadPromises = resources.map(({ url, callback }) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => {
                    if (callback) callback();
                    console.log(`📦 Loaded JS: ${url}`);
                    resolve(url);
                };
                script.onerror = () => {
                    console.error(`❌ Failed to load JS: ${url}`);
                    reject(new Error(`Failed to load ${url}`));
                };
                document.head.appendChild(script);
            });
        });

        Promise.allSettled(loadPromises).then(results => {
            const loaded = results.filter(r => r.status === 'fulfilled').length;
            console.log(`📦 Batch loaded ${loaded}/${resources.length} JS resources`);
        });
    }

    /**
     * Minify CSS string
     */
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/:\s+/g, ':') // Remove spaces after colons
            .replace(/,\s+/g, ',') // Remove spaces after commas
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
            .replace(/}\s*/g, '}') // Remove spaces after closing braces
            .trim();
    }

    /**
     * Minify JavaScript string
     */
    minifyJS(js) {
        return js
            .replace(/\/\/.*$/gm, '') // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Clean up before closing braces
            .replace(/\s*([{}();,:])\s*/g, '$1') // Remove spaces around operators
            .trim();
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        // Monitor resource loading times
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.analyzeResourcePerformance(entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        }

        // Monitor long tasks
        this.monitorLongTasks();

        // Monitor memory usage
        this.monitorMemoryUsage();
    }

    /**
     * Analyze resource performance
     */
    analyzeResourcePerformance(entry) {
        const threshold = 1000; // 1 second threshold
        
        if (entry.duration > threshold) {
            console.warn(`🐌 Slow resource detected:`, {
                name: entry.name,
                duration: Math.round(entry.duration),
                type: this.getResourceType(entry.name)
            });
            
            // Suggest optimizations
            this.suggestOptimizations(entry);
        }
    }

    /**
     * Get resource type from URL
     */
    getResourceType(url) {
        if (url.includes('.css')) return 'CSS';
        if (url.includes('.js')) return 'JavaScript';
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) return 'Image';
        if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'Font';
        return 'Other';
    }

    /**
     * Suggest optimizations based on performance data
     */
    suggestOptimizations(entry) {
        const suggestions = [];
        
        if (entry.transferSize > entry.encodedBodySize * 0.9) {
            suggestions.push('Enable compression (gzip/brotli)');
        }
        
        if (entry.duration > 2000) {
            suggestions.push('Consider CDN or resource optimization');
        }
        
        if (this.getResourceType(entry.name) === 'Image' && entry.transferSize > 100000) {
            suggestions.push('Optimize image size and format');
        }

        if (suggestions.length > 0) {
            console.log(`💡 Optimization suggestions for ${entry.name}:`, suggestions);
        }
    }

    /**
     * Monitor long tasks that block the main thread
     */
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        console.warn(`🚫 Long task detected:`, {
                            duration: Math.round(entry.duration),
                            startTime: Math.round(entry.startTime),
                            name: entry.name
                        });
                    }
                }
            });

            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Long task observer not supported
                console.log('Long task observer not supported');
            }
        }
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryUsage = {
                    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
                };

                // Warn if memory usage is high
                const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100;
                if (usagePercentage > 80) {
                    console.warn(`🧠 High memory usage detected:`, memoryUsage);
                }
            }, 30000); // Check every 30 seconds
        }
    }

    /**
     * Optimize existing resources
     */
    optimizeExistingResources() {
        // Find and optimize inline scripts
        const inlineScripts = document.querySelectorAll('script:not([src])');
        inlineScripts.forEach(script => {
            if (script.textContent.length > 1000) {
                script.textContent = this.minifyJS(script.textContent);
            }
        });

        // Find and optimize inline styles
        const inlineStyles = document.querySelectorAll('style');
        inlineStyles.forEach(style => {
            if (style.textContent.length > 500) {
                style.textContent = this.minifyCSS(style.textContent);
            }
        });
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            optimizedAssets: Array.from(this.optimizedAssets),
            loadedResources: Array.from(this.loadedResources.keys()),
            cacheStats: {
                cssCache: this.cssCache.size,
                jsCache: this.jsCache.size
            }
        };

        console.log('📊 Nexus Build Optimization Report:', report);
        return report;
    }

    /**
     * Save optimization report to localStorage
     */
    saveOptimizationReport() {
        const report = this.generatePerformanceReport();
        try {
            localStorage.setItem('nexus-optimization-report', JSON.stringify(report));
        } catch (error) {
            console.warn('Failed to save optimization report:', error);
        }
    }
}

// Initialize build optimizer
if (typeof window !== 'undefined') {
    window.NexusBuildOptimizer = NexusBuildOptimizer;
    
    // Auto-initialize on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new NexusBuildOptimizer();
        });
    } else {
        // DOM is already ready
        new NexusBuildOptimizer();
    }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusBuildOptimizer;
}