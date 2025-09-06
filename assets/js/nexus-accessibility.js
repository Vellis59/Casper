/**
 * Nexus Accessibility Manager
 * Complete accessibility suite with keyboard navigation, screen reader support, and user preferences
 */

class NexusAccessibility {
    constructor() {
        this.settings = {
            highContrast: false,
            highReadability: false,
            reducedMotion: false,
            fontSize: 'normal',
            dyslexiaFont: false,
            cognitiveMode: false,
            colorblindFriendly: false
        };
        
        this.keyboardShortcuts = {
            '?': () => this.toggleKeyboardHelp(),
            'h': () => this.toggleAccessibilityBar(),
            'c': () => this.toggleHighContrast(),
            'r': () => this.toggleHighReadability(),
            'm': () => this.toggleReducedMotion(),
            's': () => this.skipToContent(),
            '1': () => this.focusMainNavigation(),
            '2': () => this.focusMainContent(),
            '3': () => this.focusSidebar()
        };
        
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '.nexus-card',
            '.nexus-nav-link'
        ];
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.createAccessibilityBar();
        this.createSkipLink();
        this.createKeyboardHelp();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusTrapping();
        this.detectSystemPreferences();
        this.createLiveRegion();
        
        // Apply saved settings
        this.applySettings();
        
        console.log('♿ Nexus Accessibility Manager initialized');
    }
    
    // Create accessibility control bar
    createAccessibilityBar() {
        const bar = document.createElement('div');
        bar.className = 'nexus-accessibility-bar';
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Accessibility Controls');
        
        bar.innerHTML = `
            <button class="nexus-a11y-btn" data-action="contrast" aria-pressed="false">
                <span aria-hidden="true">🔆</span> Contrast
            </button>
            <button class="nexus-a11y-btn" data-action="readability" aria-pressed="false">
                <span aria-hidden="true">📖</span> Readable
            </button>
            <button class="nexus-a11y-btn" data-action="motion" aria-pressed="false">
                <span aria-hidden="true">🔄</span> Motion
            </button>
            <button class="nexus-a11y-btn" data-action="font-size" aria-pressed="false">
                <span aria-hidden="true">🔤</span> Size
            </button>
            <button class="nexus-a11y-btn" data-action="dyslexia" aria-pressed="false">
                <span aria-hidden="true">🧠</span> Dyslexia
            </button>
            <button class="nexus-a11y-btn" data-action="keyboard-help" aria-pressed="false">
                <span aria-hidden="true">⌨️</span> Help
            </button>
        `;
        
        document.body.appendChild(bar);
        
        // Event listeners
        bar.addEventListener('click', (e) => {
            if (e.target.matches('.nexus-a11y-btn')) {
                this.handleAccessibilityAction(e.target.dataset.action, e.target);
            }
        });
        
        // Show on Alt+A or focus
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAccessibilityBar();
            }
        });
        
        this.accessibilityBar = bar;
    }
    
    // Create skip to content link
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'nexus-skip-link';
        skipLink.setAttribute('accesskey', 's');
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.skipToContent();
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Create keyboard help overlay
    createKeyboardHelp() {
        const help = document.createElement('div');
        help.className = 'nexus-keyboard-help';
        help.setAttribute('role', 'dialog');
        help.setAttribute('aria-labelledby', 'keyboard-help-title');
        help.setAttribute('aria-hidden', 'true');
        
        help.innerHTML = `
            <h4 id="keyboard-help-title">Keyboard Shortcuts</h4>
            <ul>
                <li><span class="key">?</span> <span>Show this help</span></li>
                <li><span class="key">Alt+A</span> <span>Accessibility menu</span></li>
                <li><span class="key">S</span> <span>Skip to content</span></li>
                <li><span class="key">H</span> <span>Toggle contrast</span></li>
                <li><span class="key">R</span> <span>Toggle readability</span></li>
                <li><span class="key">M</span> <span>Reduce motion</span></li>
                <li><span class="key">1</span> <span>Focus navigation</span></li>
                <li><span class="key">2</span> <span>Focus main content</span></li>
                <li><span class="key">3</span> <span>Focus sidebar</span></li>
                <li><span class="key">Esc</span> <span>Close dialogs</span></li>
            </ul>
            <button onclick="nexusAccessibility.toggleKeyboardHelp()">Close (Esc)</button>
        `;
        
        document.body.appendChild(help);
        this.keyboardHelp = help;
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle escape key globally
            if (e.key === 'Escape') {
                this.handleEscape();
                return;
            }
            
            // Handle keyboard shortcuts
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                const action = this.keyboardShortcuts[e.key.toLowerCase()];
                if (action && !this.isInInputField(e.target)) {
                    e.preventDefault();
                    action();
                }
            }
            
            // Trap focus in modals
            if (e.key === 'Tab' && this.isModalOpen()) {
                this.trapFocus(e);
            }
        });
        
        // Enhanced focus management
        document.addEventListener('focusin', (e) => {
            this.announceToScreenReader(`Focused on ${this.getElementDescription(e.target)}`);
        });
        
        // Roving tabindex for card grids
        this.setupRovingTabindex('.nexus-post-grid .nexus-card');
    }
    
    // Setup screen reader support
    setupScreenReaderSupport() {
        // Add ARIA labels to visual elements
        this.addAriaLabels();
        
        // Update dynamic content announcements
        this.setupLiveRegions();
        
        // Add landmark roles
        this.addLandmarkRoles();
        
        // Describe interactive elements
        this.addInteractiveDescriptions();
    }
    
    // Add ARIA labels to elements
    addAriaLabels() {
        // Sidebar
        const sidebar = document.querySelector('.nexus-sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'complementary');
            sidebar.setAttribute('aria-label', 'Site navigation and information');
        }
        
        // Main content
        const content = document.querySelector('.site-content');
        if (content) {
            content.setAttribute('id', 'main-content');
            content.setAttribute('role', 'main');
            content.setAttribute('aria-label', 'Main content');
        }
        
        // Post grid
        const postGrid = document.querySelector('.nexus-post-grid');
        if (postGrid) {
            postGrid.setAttribute('role', 'feed');
            postGrid.setAttribute('aria-label', 'Latest blog posts');
        }
        
        // Cards
        document.querySelectorAll('.nexus-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-posinset', index + 1);
            
            const title = card.querySelector('.nexus-card-title a');
            if (title) {
                card.setAttribute('aria-labelledby', `card-title-${index}`);
                title.id = `card-title-${index}`;
            }
        });
        
        // Navigation links
        document.querySelectorAll('.nexus-nav-link').forEach(link => {
            const icon = link.querySelector('.nexus-nav-icon');
            if (icon) {
                icon.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Decorative elements
        document.querySelectorAll('.nexus-particles, .nexus-matrix-bg, .nexus-scanlines').forEach(el => {
            el.setAttribute('aria-hidden', 'true');
            el.setAttribute('role', 'presentation');
        });
    }
    
    // Create live region for announcements
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.className = 'nexus-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }
    
    // Announce to screen readers
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    // Handle accessibility actions
    handleAccessibilityAction(action, button) {
        switch (action) {
            case 'contrast':
                this.toggleHighContrast();
                break;
            case 'readability':
                this.toggleHighReadability();
                break;
            case 'motion':
                this.toggleReducedMotion();
                break;
            case 'font-size':
                this.cycleFontSize();
                break;
            case 'dyslexia':
                this.toggleDyslexiaFont();
                break;
            case 'keyboard-help':
                this.toggleKeyboardHelp();
                break;
        }
        
        // Update button state
        const isActive = this.getSettingForAction(action);
        button.setAttribute('aria-pressed', isActive);
        button.classList.toggle('active', isActive);
        
        this.saveSettings();
    }
    
    // Accessibility toggle methods
    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        document.body.classList.toggle('nexus-high-contrast', this.settings.highContrast);
        this.announceToScreenReader(`High contrast mode ${this.settings.highContrast ? 'enabled' : 'disabled'}`);
    }
    
    toggleHighReadability() {
        this.settings.highReadability = !this.settings.highReadability;
        document.body.classList.toggle('nexus-high-readability', this.settings.highReadability);
        this.announceToScreenReader(`High readability mode ${this.settings.highReadability ? 'enabled' : 'disabled'}`);
    }
    
    toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        document.body.classList.toggle('nexus-reduce-motion', this.settings.reducedMotion);
        this.announceToScreenReader(`Reduced motion ${this.settings.reducedMotion ? 'enabled' : 'disabled'}`);
    }
    
    cycleFontSize() {
        const sizes = ['normal', 'large', 'xlarge', 'small'];
        const current = sizes.indexOf(this.settings.fontSize);
        const next = (current + 1) % sizes.length;
        
        // Remove old class
        document.body.classList.remove(`nexus-font-size-${this.settings.fontSize}`);
        
        // Apply new size
        this.settings.fontSize = sizes[next];
        document.body.classList.add(`nexus-font-size-${this.settings.fontSize}`);
        
        this.announceToScreenReader(`Font size changed to ${this.settings.fontSize}`);
    }
    
    toggleDyslexiaFont() {
        this.settings.dyslexiaFont = !this.settings.dyslexiaFont;
        document.body.classList.toggle('nexus-dyslexia-font', this.settings.dyslexiaFont);
        this.announceToScreenReader(`Dyslexia-friendly font ${this.settings.dyslexiaFont ? 'enabled' : 'disabled'}`);
    }
    
    toggleAccessibilityBar() {
        const isVisible = this.accessibilityBar.classList.contains('visible');
        this.accessibilityBar.classList.toggle('visible');
        this.accessibilityBar.setAttribute('aria-hidden', isVisible);
        
        if (!isVisible) {
            this.accessibilityBar.querySelector('.nexus-a11y-btn').focus();
        }
    }
    
    toggleKeyboardHelp() {
        const isVisible = this.keyboardHelp.classList.contains('visible');
        this.keyboardHelp.classList.toggle('visible');
        this.keyboardHelp.setAttribute('aria-hidden', isVisible);
        
        if (!isVisible) {
            this.keyboardHelp.querySelector('button').focus();
        }
    }
    
    // Navigation helpers
    skipToContent() {
        const main = document.querySelector('#main-content, main, .site-content');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
            this.announceToScreenReader('Skipped to main content');
        }
    }
    
    focusMainNavigation() {
        const nav = document.querySelector('.nexus-nav, nav');
        if (nav) {
            const firstLink = nav.querySelector('a, button');
            if (firstLink) {
                firstLink.focus();
                this.announceToScreenReader('Focused on main navigation');
            }
        }
    }
    
    focusMainContent() {
        this.skipToContent();
    }
    
    focusSidebar() {
        const sidebar = document.querySelector('.nexus-sidebar');
        if (sidebar) {
            const firstFocusable = sidebar.querySelector(this.focusableElements.join(', '));
            if (firstFocusable) {
                firstFocusable.focus();
                this.announceToScreenReader('Focused on sidebar');
            }
        }
    }
    
    // Utility methods
    isInInputField(element) {
        return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) ||
               element.contentEditable === 'true';
    }
    
    isModalOpen() {
        return document.querySelector('[role="dialog"][aria-hidden="false"]') !== null;
    }
    
    getElementDescription(element) {
        return element.getAttribute('aria-label') ||
               element.getAttribute('title') ||
               element.textContent?.trim() ||
               element.tagName.toLowerCase();
    }
    
    getSettingForAction(action) {
        const map = {
            'contrast': this.settings.highContrast,
            'readability': this.settings.highReadability,
            'motion': this.settings.reducedMotion,
            'font-size': this.settings.fontSize !== 'normal',
            'dyslexia': this.settings.dyslexiaFont
        };
        return map[action] || false;
    }
    
    // Setup roving tabindex
    setupRovingTabindex(selector) {
        const items = document.querySelectorAll(selector);
        if (items.length === 0) return;
        
        // Set initial tabindex
        items.forEach((item, index) => {
            item.tabIndex = index === 0 ? 0 : -1;
        });
        
        // Handle arrow key navigation
        document.addEventListener('keydown', (e) => {
            if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
            
            const focused = document.activeElement;
            const currentIndex = Array.from(items).indexOf(focused);
            
            if (currentIndex === -1) return;
            
            e.preventDefault();
            
            let nextIndex;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
            }
            
            // Update tabindex
            focused.tabIndex = -1;
            items[nextIndex].tabIndex = 0;
            items[nextIndex].focus();
        });
    }
    
    // Detect system preferences
    detectSystemPreferences() {
        // Prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.settings.reducedMotion = true;
            this.toggleReducedMotion();
        }
        
        // Prefers high contrast
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.settings.highContrast = true;
            this.toggleHighContrast();
        }
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                this.settings.reducedMotion = true;
                this.toggleReducedMotion();
            }
        });
    }
    
    // Settings persistence
    saveSettings() {
        localStorage.setItem('nexusAccessibilitySettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('nexusAccessibilitySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    applySettings() {
        if (this.settings.highContrast) this.toggleHighContrast();
        if (this.settings.highReadability) this.toggleHighReadability();
        if (this.settings.reducedMotion) this.toggleReducedMotion();
        if (this.settings.dyslexiaFont) this.toggleDyslexiaFont();
        if (this.settings.fontSize !== 'normal') {
            document.body.classList.add(`nexus-font-size-${this.settings.fontSize}`);
        }
        
        // Update button states
        setTimeout(() => {
            document.querySelectorAll('.nexus-a11y-btn').forEach(btn => {
                const isActive = this.getSettingForAction(btn.dataset.action);
                btn.setAttribute('aria-pressed', isActive);
                btn.classList.toggle('active', isActive);
            });
        }, 100);
    }
    
    // Handle escape key
    handleEscape() {
        // Close accessibility bar
        if (this.accessibilityBar.classList.contains('visible')) {
            this.toggleAccessibilityBar();
        }
        
        // Close keyboard help
        if (this.keyboardHelp.classList.contains('visible')) {
            this.toggleKeyboardHelp();
        }
    }
    
    // Add landmark roles
    addLandmarkRoles() {
        const header = document.querySelector('header, .gh-head');
        if (header) header.setAttribute('role', 'banner');
        
        const footer = document.querySelector('footer, .site-footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
        
        const nav = document.querySelector('nav, .nexus-nav');
        if (nav) nav.setAttribute('role', 'navigation');
    }
    
    // Setup live regions
    setupLiveRegions() {
        // Monitor dynamic content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Announce new content
                    this.announceToScreenReader('Content updated');
                }
            });
        });
        
        const content = document.querySelector('.site-content');
        if (content) {
            observer.observe(content, { childList: true, subtree: true });
        }
    }
    
    // Add interactive descriptions
    addInteractiveDescriptions() {
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('title')) {
                const text = element.textContent?.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
        });
    }
    
    // Focus trapping for modals
    trapFocus(event) {
        const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (!modal) return;
        
        const focusableElements = modal.querySelectorAll(this.focusableElements.join(', '));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.nexusAccessibility = new NexusAccessibility();
});

// Export for global access
window.NexusAccessibility = NexusAccessibility;