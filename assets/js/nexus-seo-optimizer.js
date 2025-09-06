/**
 * Nexus SEO Optimizer
 * Comprehensive SEO enhancement system for Ghost themes
 * Handles structured data, meta tags, analytics, and multilingual support
 * Version: 3.0.0
 */

class NexusSEOOptimizer {
    constructor(options = {}) {
        this.options = {
            enableStructuredData: true,
            enableAnalytics: true,
            enableMetaTags: true,
            enableMultilingual: false,
            analyticsId: options.analyticsId || null,
            gtmId: options.gtmId || null,
            language: options.language || 'en',
            alternateLanguages: options.alternateLanguages || [],
            ...options
        };

        this.structuredDataCache = new Map();
        this.metaTagsCache = new Map();
        this.analyticsQueue = [];
        this.seoMetrics = {
            pageLoadTime: 0,
            interactionTracking: [],
            scrollDepth: 0,
            timeOnPage: Date.now()
        };

        this.init();
    }

    /**
     * Initialize SEO optimizer
     */
    async init() {
        try {
            console.log('🔍 Nexus SEO Optimizer initializing...');
            
            if (this.options.enableStructuredData) {
                this.initStructuredData();
            }

            if (this.options.enableAnalytics) {
                this.initAnalytics();
            }

            if (this.options.enableMetaTags) {
                this.optimizeMetaTags();
            }

            if (this.options.enableMultilingual) {
                this.initMultilingual();
            }

            this.initSEOTracking();
            this.setupSEOEventListeners();

            console.log('✅ Nexus SEO Optimizer initialized successfully');
        } catch (error) {
            console.error('❌ SEO Optimizer initialization failed:', error);
        }
    }

    /**
     * Initialize structured data (JSON-LD)
     */
    initStructuredData() {
        console.log('🏗️ Initializing structured data...');

        // Website structured data
        this.addStructuredData('website', {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": document.title,
            "url": window.location.origin,
            "description": this.getMetaContent('description'),
            "publisher": {
                "@type": "Organization",
                "name": this.getMetaContent('author') || 'Nexus Theme',
                "logo": {
                    "@type": "ImageObject",
                    "url": this.findLogo()
                }
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": window.location.origin + "/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        });

        // Page-specific structured data
        this.detectPageType();
    }

    /**
     * Detect page type and add appropriate structured data
     */
    detectPageType() {
        const bodyClasses = document.body.className;

        if (bodyClasses.includes('post-template')) {
            this.addArticleStructuredData();
        } else if (bodyClasses.includes('page-template')) {
            this.addWebPageStructuredData();
        } else if (bodyClasses.includes('author-template')) {
            this.addPersonStructuredData();
        } else if (bodyClasses.includes('tag-template')) {
            this.addCollectionPageStructuredData();
        } else if (bodyClasses.includes('home-template')) {
            this.addBlogStructuredData();
        }
    }

    /**
     * Add article structured data
     */
    addArticleStructuredData() {
        const articleData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": document.title,
            "description": this.getMetaContent('description'),
            "image": this.findFeaturedImage(),
            "author": {
                "@type": "Person",
                "name": this.getMetaContent('author')
            },
            "publisher": {
                "@type": "Organization",
                "name": this.getMetaContent('publisher') || 'Nexus Blog',
                "logo": {
                    "@type": "ImageObject",
                    "url": this.findLogo()
                }
            },
            "datePublished": this.getMetaContent('article:published_time'),
            "dateModified": this.getMetaContent('article:modified_time'),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            }
        };

        this.addStructuredData('article', articleData);
    }

    /**
     * Add blog structured data
     */
    addBlogStructuredData() {
        const blogData = {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": document.title,
            "description": this.getMetaContent('description'),
            "url": window.location.href,
            "image": this.findLogo(),
            "author": {
                "@type": "Organization",
                "name": this.getMetaContent('author') || 'Nexus Blog'
            }
        };

        this.addStructuredData('blog', blogData);
    }

    /**
     * Add person structured data for author pages
     */
    addPersonStructuredData() {
        const personData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": this.extractAuthorName(),
            "url": window.location.href,
            "image": this.findAuthorImage(),
            "description": this.getMetaContent('description'),
            "sameAs": this.extractSocialLinks()
        };

        this.addStructuredData('person', personData);
    }

    /**
     * Add collection page structured data for tag pages
     */
    addCollectionPageStructuredData() {
        const collectionData = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": document.title,
            "description": this.getMetaContent('description'),
            "url": window.location.href,
            "isPartOf": {
                "@type": "WebSite",
                "url": window.location.origin
            }
        };

        this.addStructuredData('collection', collectionData);
    }

    /**
     * Add web page structured data
     */
    addWebPageStructuredData() {
        const webPageData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": document.title,
            "description": this.getMetaContent('description'),
            "url": window.location.href,
            "isPartOf": {
                "@type": "WebSite",
                "url": window.location.origin
            },
            "datePublished": this.getMetaContent('article:published_time'),
            "dateModified": this.getMetaContent('article:modified_time')
        };

        this.addStructuredData('webpage', webPageData);
    }

    /**
     * Add structured data to page
     */
    addStructuredData(type, data) {
        // Cache the data
        this.structuredDataCache.set(type, data);

        // Create and inject JSON-LD script
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        script.id = `structured-data-${type}`;

        document.head.appendChild(script);
        console.log(`📊 Added ${type} structured data`);
    }

    /**
     * Initialize analytics tracking
     */
    initAnalytics() {
        console.log('📈 Initializing analytics...');

        // Google Analytics 4
        if (this.options.analyticsId) {
            this.initGoogleAnalytics();
        }

        // Google Tag Manager
        if (this.options.gtmId) {
            this.initGoogleTagManager();
        }

        // Custom analytics tracking
        this.initCustomAnalytics();
    }

    /**
     * Initialize Google Analytics 4
     */
    initGoogleAnalytics() {
        const ga4Script = document.createElement('script');
        ga4Script.async = true;
        ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${this.options.analyticsId}`;
        document.head.appendChild(ga4Script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.options.analyticsId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_dimension_1': 'theme_name',
                'custom_dimension_2': 'page_type'
            }
        });

        // Set custom dimensions
        gtag('event', 'page_view', {
            theme_name: 'Nexus',
            page_type: this.getPageType()
        });

        window.gtag = gtag;
        console.log('✅ Google Analytics 4 initialized');
    }

    /**
     * Initialize Google Tag Manager
     */
    initGoogleTagManager() {
        // GTM script
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',this.options.gtmId);

        // GTM noscript fallback
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${this.options.gtmId}`;
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);

        console.log('✅ Google Tag Manager initialized');
    }

    /**
     * Initialize custom analytics tracking
     */
    initCustomAnalytics() {
        // Track page performance
        this.trackPagePerformance();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
    }

    /**
     * Track page performance metrics
     */
    trackPagePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const metrics = {
                        pageLoadTime: perfData.loadEventEnd - perfData.fetchStart,
                        domInteractive: perfData.domInteractive - perfData.fetchStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    };

                    this.sendAnalyticsEvent('page_performance', metrics);
                }, 0);
            });
        }
    }

    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * Get First Contentful Paint timing
     */
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }

    /**
     * Track user interactions
     */
    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a, button, .interactive')) {
                this.sendAnalyticsEvent('user_interaction', {
                    type: 'click',
                    element: e.target.tagName,
                    text: e.target.textContent?.slice(0, 100),
                    url: e.target.href || null
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.sendAnalyticsEvent('user_interaction', {
                type: 'form_submit',
                form: e.target.id || e.target.className
            });
        });
    }

    /**
     * Track scroll depth
     */
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const triggered = new Set();

        const trackScroll = () => {
            const scrolled = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            maxScroll = Math.max(maxScroll, scrolled);

            milestones.forEach(milestone => {
                if (scrolled >= milestone && !triggered.has(milestone)) {
                    triggered.add(milestone);
                    this.sendAnalyticsEvent('scroll_depth', {
                        depth: milestone
                    });
                }
            });
        };

        window.addEventListener('scroll', this.throttle(trackScroll, 250));
    }

    /**
     * Track time on page
     */
    trackTimeOnPage() {
        let startTime = Date.now();
        let isActive = true;

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                startTime = Date.now();
                isActive = true;
            } else {
                if (isActive) {
                    const timeSpent = Date.now() - startTime;
                    this.sendAnalyticsEvent('time_on_page', {
                        duration: timeSpent,
                        page: window.location.pathname
                    });
                }
                isActive = false;
            }
        });

        // Track before unload
        window.addEventListener('beforeunload', () => {
            if (isActive) {
                const totalTime = Date.now() - this.seoMetrics.timeOnPage;
                this.sendAnalyticsEvent('session_end', {
                    totalTime: totalTime,
                    maxScrollDepth: this.seoMetrics.scrollDepth
                });
            }
        });
    }

    /**
     * Optimize meta tags
     */
    optimizeMetaTags() {
        console.log('🏷️ Optimizing meta tags...');

        this.addOpenGraphTags();
        this.addTwitterCardTags();
        this.addBasicMetaTags();
        this.addTechnicalMetaTags();
    }

    /**
     * Add Open Graph meta tags
     */
    addOpenGraphTags() {
        const ogTags = {
            'og:title': document.title,
            'og:description': this.getMetaContent('description'),
            'og:image': this.findFeaturedImage(),
            'og:url': window.location.href,
            'og:type': this.getOGType(),
            'og:site_name': this.getSiteName(),
            'og:locale': this.options.language
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            if (content) {
                this.setMetaTag('property', property, content);
            }
        });

        console.log('✅ Open Graph tags added');
    }

    /**
     * Add Twitter Card meta tags
     */
    addTwitterCardTags() {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': document.title,
            'twitter:description': this.getMetaContent('description'),
            'twitter:image': this.findFeaturedImage(),
            'twitter:site': this.getTwitterHandle(),
            'twitter:creator': this.getTwitterHandle()
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            if (content) {
                this.setMetaTag('name', name, content);
            }
        });

        console.log('✅ Twitter Card tags added');
    }

    /**
     * Add basic SEO meta tags
     */
    addBasicMetaTags() {
        const basicTags = {
            'keywords': this.extractKeywords(),
            'author': this.getMetaContent('author'),
            'robots': 'index, follow',
            'canonical': window.location.href,
            'theme-color': this.getThemeColor()
        };

        Object.entries(basicTags).forEach(([name, content]) => {
            if (content) {
                if (name === 'canonical') {
                    this.setLinkTag('rel', 'canonical', content);
                } else {
                    this.setMetaTag('name', name, content);
                }
            }
        });

        console.log('✅ Basic meta tags added');
    }

    /**
     * Add technical meta tags
     */
    addTechnicalMetaTags() {
        const technicalTags = {
            'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            'format-detection': 'telephone=no',
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
            'msapplication-TileColor': this.getThemeColor(),
            'application-name': this.getSiteName()
        };

        Object.entries(technicalTags).forEach(([name, content]) => {
            if (content) {
                this.setMetaTag('name', name, content);
            }
        });

        console.log('✅ Technical meta tags added');
    }

    /**
     * Initialize multilingual support
     */
    initMultilingual() {
        console.log('🌐 Initializing multilingual support...');

        // Add hreflang tags
        this.addHrefLangTags();
        
        // Set language attributes
        document.documentElement.lang = this.options.language;

        console.log('✅ Multilingual support initialized');
    }

    /**
     * Add hreflang tags for multilingual SEO
     */
    addHrefLangTags() {
        // Add self-referencing hreflang
        this.setLinkTag('rel', 'alternate', window.location.href, {
            hreflang: this.options.language
        });

        // Add alternate language versions
        this.options.alternateLanguages.forEach(lang => {
            const alternateUrl = this.getAlternateLanguageUrl(lang);
            if (alternateUrl) {
                this.setLinkTag('rel', 'alternate', alternateUrl, {
                    hreflang: lang.code
                });
            }
        });

        // Add x-default for international targeting
        if (this.options.alternateLanguages.length > 0) {
            this.setLinkTag('rel', 'alternate', window.location.href, {
                hreflang: 'x-default'
            });
        }
    }

    /**
     * Initialize SEO tracking
     */
    initSEOTracking() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Track SEO-relevant user behavior
        this.trackSEOBehavior();
    }

    /**
     * Monitor Core Web Vitals for SEO
     */
    monitorCoreWebVitals() {
        // Import web-vitals library if available
        if (window.webVitals) {
            webVitals.getLCP(this.onLCP.bind(this));
            webVitals.getFID(this.onFID.bind(this));
            webVitals.getCLS(this.onCLS.bind(this));
            webVitals.getFCP(this.onFCP.bind(this));
            webVitals.getTTFB(this.onTTFB.bind(this));
        }
    }

    /**
     * Handle LCP (Largest Contentful Paint)
     */
    onLCP(metric) {
        this.sendAnalyticsEvent('core_web_vital', {
            name: 'LCP',
            value: metric.value,
            rating: this.getCWVRating('LCP', metric.value)
        });
    }

    /**
     * Handle FID (First Input Delay)
     */
    onFID(metric) {
        this.sendAnalyticsEvent('core_web_vital', {
            name: 'FID',
            value: metric.value,
            rating: this.getCWVRating('FID', metric.value)
        });
    }

    /**
     * Handle CLS (Cumulative Layout Shift)
     */
    onCLS(metric) {
        this.sendAnalyticsEvent('core_web_vital', {
            name: 'CLS',
            value: metric.value,
            rating: this.getCWVRating('CLS', metric.value)
        });
    }

    /**
     * Handle FCP (First Contentful Paint)
     */
    onFCP(metric) {
        this.sendAnalyticsEvent('core_web_vital', {
            name: 'FCP',
            value: metric.value,
            rating: this.getCWVRating('FCP', metric.value)
        });
    }

    /**
     * Handle TTFB (Time to First Byte)
     */
    onTTFB(metric) {
        this.sendAnalyticsEvent('core_web_vital', {
            name: 'TTFB',
            value: metric.value,
            rating: this.getCWVRating('TTFB', metric.value)
        });
    }

    /**
     * Get Core Web Vitals rating
     */
    getCWVRating(metric, value) {
        const thresholds = {
            LCP: { good: 2500, poor: 4000 },
            FID: { good: 100, poor: 300 },
            CLS: { good: 0.1, poor: 0.25 },
            FCP: { good: 1800, poor: 3000 },
            TTFB: { good: 800, poor: 1800 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Track SEO-relevant behavior
     */
    trackSEOBehavior() {
        // Track internal link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"], a[href^="./"], a[href^="../"]')) {
                this.sendAnalyticsEvent('internal_link_click', {
                    from: window.location.pathname,
                    to: e.target.getAttribute('href'),
                    text: e.target.textContent?.slice(0, 50)
                });
            }
        });

        // Track external link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="http"]:not([href*="' + window.location.hostname + '"])')) {
                this.sendAnalyticsEvent('external_link_click', {
                    url: e.target.href,
                    text: e.target.textContent?.slice(0, 50)
                });
            }
        });
    }

    /**
     * Setup SEO event listeners
     */
    setupSEOEventListeners() {
        // Listen for dynamic content changes
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        this.handleDynamicContent(mutation.addedNodes);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Listen for history changes (SPA)
        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
    }

    /**
     * Handle dynamic content for SEO
     */
    handleDynamicContent(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Update structured data for new content
                if (node.matches('article, .post-card')) {
                    this.updateStructuredDataForNewContent(node);
                }
                
                // Add SEO attributes to new links
                const newLinks = node.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
                newLinks.forEach(link => {
                    if (!link.hasAttribute('rel')) {
                        link.setAttribute('rel', 'noopener');
                    }
                });
            }
        });
    }

    /**
     * Handle page changes (SPA navigation)
     */
    handlePageChange() {
        // Update meta tags for new page
        setTimeout(() => {
            this.optimizeMetaTags();
            this.updateStructuredData();
            
            // Track page view
            this.sendAnalyticsEvent('page_view', {
                page: window.location.pathname,
                title: document.title
            });
        }, 100);
    }

    /**
     * Update structured data for new content
     */
    updateStructuredDataForNewContent(element) {
        // Implementation depends on the specific content type
        console.log('🔄 Updating structured data for new content');
    }

    /**
     * Update structured data
     */
    updateStructuredData() {
        // Clear existing structured data
        document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            if (script.id.startsWith('structured-data-')) {
                script.remove();
            }
        });

        // Regenerate structured data
        this.structuredDataCache.clear();
        this.detectPageType();
    }

    /**
     * Send analytics event
     */
    sendAnalyticsEvent(eventName, eventData) {
        // Google Analytics 4
        if (window.gtag) {
            window.gtag('event', eventName, eventData);
        }

        // Google Tag Manager
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...eventData
            });
        }

        // Custom analytics queue
        this.analyticsQueue.push({
            timestamp: Date.now(),
            event: eventName,
            data: eventData
        });

        console.log(`📊 Analytics event: ${eventName}`, eventData);
    }

    // Utility methods

    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta ? meta.getAttribute('content') : null;
    }

    setMetaTag(attribute, name, content) {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    setLinkTag(attribute, name, href, additionalAttrs = {}) {
        let link = document.querySelector(`link[${attribute}="${name}"]`);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute(attribute, name);
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
        
        Object.entries(additionalAttrs).forEach(([attr, value]) => {
            link.setAttribute(attr, value);
        });
    }

    findLogo() {
        const logo = document.querySelector('.site-logo img, .logo img, [data-logo]');
        return logo ? logo.src : '/assets/images/logo.png';
    }

    findFeaturedImage() {
        const featuredImg = document.querySelector('.post-feature-image img, .featured-image img, meta[property="og:image"]');
        if (featuredImg) {
            return featuredImg.src || featuredImg.getAttribute('content');
        }
        return this.findLogo();
    }

    findAuthorImage() {
        const authorImg = document.querySelector('.author-image img, .profile-image img');
        return authorImg ? authorImg.src : null;
    }

    extractAuthorName() {
        const authorElement = document.querySelector('.author-name, .post-author, h1');
        return authorElement ? authorElement.textContent.trim() : null;
    }

    extractSocialLinks() {
        const socialLinks = [];
        document.querySelectorAll('a[href*="twitter.com"], a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]').forEach(link => {
            socialLinks.push(link.href);
        });
        return socialLinks;
    }

    extractKeywords() {
        const existingKeywords = this.getMetaContent('keywords');
        if (existingKeywords) return existingKeywords;

        // Extract from tags, categories, or content
        const tags = Array.from(document.querySelectorAll('.tag, .category')).map(el => el.textContent.trim());
        return tags.slice(0, 10).join(', ');
    }

    getPageType() {
        const bodyClasses = document.body.className;
        if (bodyClasses.includes('post-template')) return 'article';
        if (bodyClasses.includes('page-template')) return 'page';
        if (bodyClasses.includes('author-template')) return 'profile';
        if (bodyClasses.includes('tag-template')) return 'archive';
        if (bodyClasses.includes('home-template')) return 'website';
        return 'page';
    }

    getOGType() {
        const pageType = this.getPageType();
        return pageType === 'article' ? 'article' : 'website';
    }

    getSiteName() {
        return this.getMetaContent('og:site_name') || 
               document.querySelector('title')?.textContent?.split(' | ')?.[1] ||
               'Nexus Blog';
    }

    getTwitterHandle() {
        return this.getMetaContent('twitter:site') || '@nexusblog';
    }

    getThemeColor() {
        return this.getMetaContent('theme-color') || 
               getComputedStyle(document.documentElement).getPropertyValue('--color-primary') ||
               '#15171a';
    }

    getAlternateLanguageUrl(lang) {
        // This would depend on your URL structure
        // Example: /en/page-slug -> /fr/page-slug
        const currentPath = window.location.pathname;
        return currentPath.replace(`/${this.options.language}/`, `/${lang.code}/`);
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusSEOOptimizer;
} else if (typeof window !== 'undefined') {
    window.NexusSEOOptimizer = NexusSEOOptimizer;
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.nexusSEOConfig) {
            new NexusSEOOptimizer(window.nexusSEOConfig);
        }
    });
} else if (typeof window !== 'undefined') {
    // DOM is already ready
    if (window.nexusSEOConfig) {
        new NexusSEOOptimizer(window.nexusSEOConfig);
    }
}