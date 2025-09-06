/**
 * Nexus Tech Interactions
 * Enhanced functionality for developer experience
 */

(function() {
    'use strict';
    
    // Reading progress bar
    function initReadingProgress() {
        const progress = document.querySelector('.nexus-progress-bar');
        if (!progress) return;
        
        function updateProgress() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progress.style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }
    
    // Code copy functionality
    function initCodeCopy() {
        document.querySelectorAll('pre code').forEach(function(codeBlock) {
            if (codeBlock.closest('.nexus-code-block')) return; // Skip if already enhanced
            
            const pre = codeBlock.parentElement;
            const button = document.createElement('button');
            button.className = 'nexus-code-copy';
            button.textContent = 'Copy';
            button.style.position = 'absolute';
            button.style.top = '8px';
            button.style.right = '8px';
            button.style.zIndex = '10';
            
            pre.style.position = 'relative';
            pre.appendChild(button);
            
            button.addEventListener('click', function() {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    button.textContent = 'Copied!';
                    button.style.background = 'var(--nexus-success)';
                    
                    setTimeout(function() {
                        button.textContent = 'Copy';
                        button.style.background = '';
                    }, 2000);
                });
            });
        });
    }
    
    // Keyboard shortcuts for developers
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchButton = document.querySelector('[data-ghost-search]');
                if (searchButton) searchButton.click();
            }
            
            // Ctrl/Cmd + D for dark/light mode toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                toggleColorScheme();
            }
        });
    }
    
    // Color scheme toggle
    function toggleColorScheme() {
        const body = document.body;
        
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('nexus-theme', 'light');
        } else if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('auto-color');
            localStorage.setItem('nexus-theme', 'auto');
        } else {
            body.classList.remove('auto-color');
            body.classList.add('dark-mode');
            localStorage.setItem('nexus-theme', 'dark');
        }
    }
    
    // Load saved color scheme
    function loadColorScheme() {
        const saved = localStorage.getItem('nexus-theme');
        const body = document.body;
        
        if (saved) {
            body.classList.remove('dark-mode', 'light-mode', 'auto-color');
            
            switch(saved) {
                case 'light':
                    body.classList.add('light-mode');
                    break;
                case 'auto':
                    body.classList.add('auto-color');
                    break;
                default:
                    body.classList.add('dark-mode');
            }
        }
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Tech badge hover effects
    function initTechBadges() {
        document.querySelectorAll('.nexus-badge').forEach(function(badge) {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Loading animations for images
    function initImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('nexus-loading');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(function(img) {
                img.classList.add('nexus-loading');
                imageObserver.observe(img);
            });
        }
    }
    
    // Terminal typing effect for hero sections
    function initTypingEffect() {
        const typeElements = document.querySelectorAll('[data-typing]');
        
        typeElements.forEach(function(element) {
            const text = element.dataset.typing;
            const speed = parseInt(element.dataset.speed) || 100;
            let i = 0;
            
            element.textContent = '';
            
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            }
            
            // Start typing when element comes into view
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Table of contents generator for long posts
    function generateTableOfContents() {
        const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4');
        if (headings.length < 3) return; // Only generate TOC for posts with 3+ headings
        
        const tocContainer = document.createElement('div');
        tocContainer.className = 'nexus-toc';
        tocContainer.innerHTML = '<h3>Table of Contents</h3>';
        
        const tocList = document.createElement('ul');
        
        headings.forEach(function(heading, index) {
            const id = 'heading-' + index;
            heading.id = id;
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = heading.textContent;
            link.className = 'nexus-toc-link level-' + heading.tagName.toLowerCase();
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        tocContainer.appendChild(tocList);
        
        // Insert TOC after first paragraph
        const firstParagraph = document.querySelector('.post-content p');
        if (firstParagraph) {
            firstParagraph.parentNode.insertBefore(tocContainer, firstParagraph.nextSibling);
        }
    }
    
    // Initialize all features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadColorScheme();
        initReadingProgress();
        initCodeCopy();
        initKeyboardShortcuts();
        initSmoothScroll();
        initTechBadges();
        initImageLoading();
        initTypingEffect();
        generateTableOfContents();
        
        // Add keyboard shortcut info to footer
        const footer = document.querySelector('.site-footer');
        if (footer) {
            const shortcuts = document.createElement('div');
            shortcuts.className = 'nexus-shortcuts';
            shortcuts.innerHTML = `
                <small>
                    <span class="nexus-mono">Ctrl/⌘ + K</span> Search • 
                    <span class="nexus-mono">Ctrl/⌘ + D</span> Toggle Theme
                </small>
            `;
            shortcuts.style.marginTop = '1rem';
            shortcuts.style.textAlign = 'center';
            shortcuts.style.color = 'var(--text-muted)';
            footer.appendChild(shortcuts);
        }
    });
    
    // Add global CSS for tech features
    const style = document.createElement('style');
    style.textContent = `
        .nexus-loading {
            opacity: 0.5;
            filter: blur(2px);
            transition: all 0.3s ease;
        }
        
        .nexus-toc {
            background: var(--bg-secondary);
            border: 1px solid var(--nexus-border);
            border-radius: var(--nexus-radius-lg);
            padding: var(--nexus-space-lg);
            margin: var(--nexus-space-2xl) 0;
        }
        
        .nexus-toc h3 {
            color: var(--nexus-primary);
            margin-bottom: var(--nexus-space-md);
            font-size: var(--nexus-text-lg);
        }
        
        .nexus-toc ul {
            list-style: none;
            padding: 0;
        }
        
        .nexus-toc-link {
            display: block;
            padding: var(--nexus-space-xs) 0;
            color: var(--text-secondary);
            transition: color var(--nexus-transition-fast);
        }
        
        .nexus-toc-link:hover {
            color: var(--nexus-primary);
        }
        
        .nexus-toc-link.level-h3 {
            padding-left: var(--nexus-space-md);
            font-size: var(--nexus-text-sm);
        }
        
        .nexus-toc-link.level-h4 {
            padding-left: var(--nexus-space-lg);
            font-size: var(--nexus-text-sm);
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
    
})();