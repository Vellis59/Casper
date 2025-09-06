/**
 * Nexus Performance Optimization Manager
 * Lazy loading, Core Web Vitals optimization, and performance monitoring
 */

class NexusPerformance {
    constructor() {
        this.observers = {};
        this.metrics = {};
        this.loadedAssets = new Set();
        this.criticalResources = new Set();
        
        // Performance thresholds
        this.thresholds = {
            LCP: 2500, // Largest Contentful Paint
            FID: 100,  // First Input Delay
            CLS: 0.1   // Cumulative Layout Shift
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupCriticalResourceHints();
        this.monitorCoreWebVitals();
        this.optimizeAnimations();
        this.setupPreloading();
        
        console.log('⚡ Nexus Performance Manager initialized');
    }
    
    // Setup Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.loadAllLazyContent();
            return;
        }
        
        // Observer for lazy content
        this.observers.lazy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    this.observers.lazy.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // Observer for animations
        this.observers.animation = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateAnimations(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        // Observer for particles (performance-heavy)
        this.observers.particles = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateParticles(entry.target);
                } else {
                    this.deactivateParticles(entry.target);
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0
        });
    }
    
    // Setup lazy loading for various content types
    setupLazyLoading() {
        // Lazy load images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observers.lazy.observe(img);
        });
        
        // Lazy load background images
        document.querySelectorAll('[data-bg]').forEach(el => {
            this.observers.lazy.observe(el);
        });
        
        // Lazy load particles and heavy animations
        document.querySelectorAll('.nexus-particles, .nexus-matrix-bg').forEach(el => {
            el.style.display = 'none'; // Hide initially
            this.observers.particles.observe(el);
        });
        
        // Lazy load cards animations
        document.querySelectorAll('.nexus-card').forEach(card => {
            this.observers.animation.observe(card);
        });
        
        // Lazy load embedded content
        this.setupEmbedLazyLoading();
    }
    
    // Load lazy element
    loadLazyElement(element) {
        if (element.dataset.src) {
            // Image lazy loading
            const img = element;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            
            // Add loading class
            img.classList.add('nexus-loading-img');
            
            img.onload = () => {
                img.classList.remove('nexus-loading-img');
                img.classList.add('nexus-loaded-img');
            };
            
            img.onerror = () => {
                img.classList.add('nexus-error-img');
            };
        }
        
        if (element.dataset.bg) {
            // Background image lazy loading
            element.style.backgroundImage = `url(${element.dataset.bg})`;
            element.removeAttribute('data-bg');
            element.classList.add('nexus-bg-loaded');
        }
        
        if (element.dataset.component) {
            // Component lazy loading
            this.loadLazyComponent(element);
        }
    }
    
    // Optimize images
    optimizeImages() {
        // Add responsive image loading
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading && !img.dataset.src) {
                img.loading = 'lazy';
            }
            
            // Add srcset for responsive images
            if (!img.srcset && img.src) {
                this.addResponsiveImages(img);
            }
        });
        
        // Preload critical images
        this.preloadCriticalImages();
    }
    
    // Add responsive image srcset
    addResponsiveImages(img) {
        const src = img.src;
        if (src.includes('ghost') || src.includes('images')) {
            // Generate responsive variants for Ghost images
            const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)/, '');
            const ext = src.match(/\.(jpg|jpeg|png|webp)/)?.[0] || '.jpg';
            
            img.srcset = [
                `${baseSrc}-480${ext} 480w`,
                `${baseSrc}-768${ext} 768w`,
                `${baseSrc}-1024${ext} 1024w`,
                `${baseSrc}-1200${ext} 1200w`
            ].join(', ');
            
            img.sizes = '(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px';
        }
    }
    
    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('.nexus-hero img, .nexus-card:nth-child(-n+3) img');
        
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src || img.dataset.src;
            
            if (img.srcset) {
                link.imageSrcset = img.srcset;
                link.imageSizes = img.sizes;
            }
            
            document.head.appendChild(link);
            this.criticalResources.add(link.href);
        });
    }
    
    // Setup critical resource hints
    setupCriticalResourceHints() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // DNS prefetch for external resources
        const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }
    
    // Monitor Core Web Vitals
    monitorCoreWebVitals() {
        // Import web-vitals library or implement basic monitoring
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        
        // Report metrics
        setTimeout(() => {
            this.reportMetrics();
        }, 3000);
    }
    
    // Measure Largest Contentful Paint
    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.LCP = lastEntry.startTime;
                
                if (this.metrics.LCP > this.thresholds.LCP) {
                    console.warn(`⚠️ LCP is ${this.metrics.LCP}ms (threshold: ${this.thresholds.LCP}ms)`);
                    this.optimizeLCP();
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    // Measure First Input Delay
    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.FID = entry.processingStart - entry.startTime;
                    
                    if (this.metrics.FID > this.thresholds.FID) {
                        console.warn(`⚠️ FID is ${this.metrics.FID}ms (threshold: ${this.thresholds.FID}ms)`);
                        this.optimizeFID();
                    }
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    // Measure Cumulative Layout Shift
    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.CLS = clsValue;
                
                if (this.metrics.CLS > this.thresholds.CLS) {
                    console.warn(`⚠️ CLS is ${this.metrics.CLS} (threshold: ${this.thresholds.CLS})`);
                    this.optimizeCLS();
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    // Optimize LCP
    optimizeLCP() {
        // Preload LCP element
        const lcpElements = document.querySelectorAll('.nexus-hero, .nexus-hero img, h1');
        lcpElements.forEach(el => {
            if (el.tagName === 'IMG') {
                el.loading = 'eager';
                el.fetchPriority = 'high';
            }
        });
        
        // Remove render-blocking resources
        this.deferNonCriticalCSS();
    }
    
    // Optimize FID
    optimizeFID() {
        // Defer heavy JavaScript
        this.deferHeavyScripts();
        
        // Use requestIdleCallback for non-critical work
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.initializeNonCriticalFeatures();
            });
        }
    }
    
    // Optimize CLS
    optimizeCLS() {
        // Add aspect ratio to images
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            img.style.aspectRatio = '16 / 9'; // Default aspect ratio
        });
        
        // Reserve space for dynamic content
        this.reserveSpaceForDynamicContent();
    }
    
    // Activate animations for visible elements
    activateAnimations(element) {
        element.classList.add('nexus-animate-in');
        
        // Stagger animations for child elements
        const children = element.querySelectorAll('.nexus-card, .nexus-nav-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('nexus-animate-in');
            }, index * 100);
        });
    }
    
    // Activate particles for visible elements
    activateParticles(element) {
        element.style.display = 'block';
        element.classList.add('nexus-particles-active');
        
        // Start particle generation
        if (element.classList.contains('nexus-particles')) {
            this.generateParticles(element);
        }
        
        if (element.classList.contains('nexus-matrix-bg')) {
            this.generateMatrix(element);
        }
    }
    
    // Deactivate particles for off-screen elements
    deactivateParticles(element) {
        element.classList.remove('nexus-particles-active');
        
        // Stop particle generation and clean up
        setTimeout(() => {
            if (!element.classList.contains('nexus-particles-active')) {
                element.style.display = 'none';
                element.innerHTML = ''; // Clean up generated particles
            }
        }, 1000);
    }
    
    // Generate particles efficiently
    generateParticles(container) {
        if (!container.classList.contains('nexus-particles-active')) return;
        
        const maxParticles = this.getOptimalParticleCount();
        const currentParticles = container.children.length;
        
        if (currentParticles < maxParticles) {
            const particle = document.createElement('div');
            particle.className = 'nexus-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        }
        
        // Continue generation
        if (container.classList.contains('nexus-particles-active')) {
            setTimeout(() => this.generateParticles(container), 200);
        }
    }
    
    // Get optimal particle count based on device performance
    getOptimalParticleCount() {
        const deviceMemory = navigator.deviceMemory || 4;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        
        if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
            return 50; // High-end device
        } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
            return 30; // Mid-range device
        } else {
            return 10; // Low-end device
        }
    }
    
    // Setup embed lazy loading
    setupEmbedLazyLoading() {
        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            this.observers.lazy.observe(iframe);
        });
        
        // Replace YouTube embeds with lite versions
        this.replaceYouTubeEmbeds();
    }
    
    // Replace YouTube embeds with lightweight alternatives
    replaceYouTubeEmbeds() {
        document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').forEach(iframe => {
            const src = iframe.src;
            const videoId = this.extractYouTubeId(src);
            
            if (videoId) {
                const liteEmbed = this.createLiteYouTubeEmbed(videoId, iframe);
                iframe.parentNode.replaceChild(liteEmbed, iframe);
            }
        });
    }
    
    // Create lightweight YouTube embed
    createLiteYouTubeEmbed(videoId, originalIframe) {
        const wrapper = document.createElement('div');
        wrapper.className = 'nexus-lite-youtube';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 56.25%;
            background: #000;
            cursor: pointer;
        `;
        
        wrapper.innerHTML = `
            <img src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" 
                 alt="YouTube video thumbnail"
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        width: 68px; height: 48px; background: rgba(255,0,0,0.8); border-radius: 6px;
                        display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        `;
        
        wrapper.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
            
            wrapper.innerHTML = '';
            wrapper.appendChild(iframe);
        });
        
        return wrapper;
    }
    
    // Extract YouTube video ID
    extractYouTubeId(url) {
        const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
        return match ? match[1] : null;
    }
    
    // Defer non-critical CSS
    deferNonCriticalCSS() {
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = () => {
                link.media = 'all';
            };
        });
    }
    
    // Defer heavy scripts
    deferHeavyScripts() {
        const heavyScripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"]');
        
        heavyScripts.forEach(script => {
            script.defer = true;
        });
    }
    
    // Initialize non-critical features
    initializeNonCriticalFeatures() {
        // Initialize features that don't affect initial page load
        this.initializeAnalytics();
        this.initializeTracking();
        this.initializeNonCriticalAnimations();
    }
    
    // Reserve space for dynamic content
    reserveSpaceForDynamicContent() {
        document.querySelectorAll('[data-dynamic-height]').forEach(el => {
            const height = el.dataset.dynamicHeight;
            el.style.minHeight = height;
        });
    }
    
    // Report performance metrics
    reportMetrics() {
        console.log('📊 Nexus Performance Metrics:', this.metrics);
        
        // Send to analytics if available
        if (window.gtag) {
            Object.entries(this.metrics).forEach(([name, value]) => {
                gtag('event', 'web_vitals', {
                    metric_name: name,
                    metric_value: Math.round(value),
                    metric_rating: this.getMetricRating(name, value)
                });
            });
        }
    }
    
    // Get metric rating (good/needs improvement/poor)
    getMetricRating(metric, value) {
        const thresholds = {
            LCP: [2500, 4000],
            FID: [100, 300],
            CLS: [0.1, 0.25]
        };
        
        const [good, poor] = thresholds[metric] || [0, Infinity];
        
        if (value <= good) return 'good';
        if (value <= poor) return 'needs-improvement';
        return 'poor';
    }
    
    // Fallback for browsers without Intersection Observer
    loadAllLazyContent() {
        document.querySelectorAll('[data-src], [data-bg]').forEach(el => {
            this.loadLazyElement(el);
        });
    }
    
    // Optimize animations based on device performance
    optimizeAnimations() {
        const isLowEndDevice = this.isLowEndDevice();
        
        if (isLowEndDevice) {
            document.body.classList.add('nexus-low-end-device');
            
            // Reduce animation complexity
            document.documentElement.style.setProperty('--nexus-animation-duration', '0.1s');
            document.documentElement.style.setProperty('--nexus-particle-count', '5');
        }
    }
    
    // Detect low-end devices
    isLowEndDevice() {
        const deviceMemory = navigator.deviceMemory || 4;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        return (
            deviceMemory < 2 ||
            hardwareConcurrency < 2 ||
            (connection && connection.saveData) ||
            /Android.*Chrome\/[3-6]/.test(navigator.userAgent)
        );
    }
    
    // Setup preloading for next page navigation
    setupPreloading() {
        // Preload links on hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a[href^="/"]') && !this.loadedAssets.has(e.target.href)) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = e.target.href;
                document.head.appendChild(link);
                
                this.loadedAssets.add(e.target.href);
            }
        });
    }
    
    // Initialize analytics (deferred)
    initializeAnalytics() {
        // Initialize analytics after initial load
        if (window.gtag) {
            gtag('config', 'GA_TRACKING_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }
    
    // Initialize tracking (deferred)
    initializeTracking() {
        // Initialize tracking scripts
        console.log('📈 Tracking initialized (deferred)');
    }
    
    // Initialize non-critical animations
    initializeNonCriticalAnimations() {
        // Start background animations that don't affect core metrics
        document.querySelectorAll('.nexus-background-animation').forEach(el => {
            el.classList.add('nexus-animate');
        });
    }
}

// Initialize performance manager
document.addEventListener('DOMContentLoaded', () => {
    window.nexusPerformance = new NexusPerformance();
});

// Add performance-related CSS
const performanceCSS = `
.nexus-loading-img {
    filter: blur(2px);
    transition: filter 0.3s ease;
}

.nexus-loaded-img {
    filter: none;
}

.nexus-error-img {
    background: linear-gradient(45deg, #f0f0f0, #ddd);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nexus-bg-loaded {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.nexus-animate-in {
    animation: nexusSlideInUp 0.6s ease-out forwards;
}

@keyframes nexusSlideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.nexus-low-end-device .nexus-particles,
.nexus-low-end-device .nexus-matrix-bg {
    display: none !important;
}

.nexus-low-end-device * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}

.nexus-lite-youtube:hover img {
    filter: brightness(1.1);
}
`;

// Inject performance CSS
const performanceStyleSheet = document.createElement('style');
performanceStyleSheet.textContent = performanceCSS;
document.head.appendChild(performanceStyleSheet);