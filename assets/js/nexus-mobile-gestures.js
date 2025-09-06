/**
 * Nexus Mobile Gestures & Touch Interactions
 * Advanced touch handling for mobile/tablet experience
 */

class NexusMobileGestures {
    constructor() {
        this.isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
        this.sidebar = document.querySelector('.nexus-sidebar');
        this.sidebarOverlay = null;
        this.mobileToggle = document.querySelector('.nexus-mobile-toggle');
        
        // Touch tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isSwipeGesture = false;
        
        // Gesture thresholds
        this.swipeThreshold = 100; // Minimum distance for swipe
        this.swipeVelocityThreshold = 0.5; // Minimum velocity
        
        this.init();
    }
    
    init() {
        if (!this.isTouch) return;
        
        this.createSidebarOverlay();
        this.setupSidebarGestures();
        this.setupCardGestures();
        this.setupMobileToggle();
        this.setupPullToRefresh();
        this.addHapticFeedback();
        
        console.log('🎯 Nexus Mobile Gestures initialized');
    }
    
    // Create overlay for sidebar on mobile
    createSidebarOverlay() {
        if (!this.sidebar) return;
        
        this.sidebarOverlay = document.createElement('div');
        this.sidebarOverlay.className = 'nexus-sidebar-overlay';
        document.body.appendChild(this.sidebarOverlay);
        
        // Close sidebar when clicking overlay
        this.sidebarOverlay.addEventListener('click', () => {
            this.closeSidebar();
        });
    }
    
    // Sidebar swipe gestures
    setupSidebarGestures() {
        if (!this.sidebar || window.innerWidth > 1024) return;
        
        // Swipe from left edge to open sidebar
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            
            // If touch starts from left edge (first 20px)
            if (touch.clientX < 20 && !this.sidebar.classList.contains('open')) {
                this.isSwipeGesture = true;
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isSwipeGesture) return;
            
            const touch = e.touches[0];
            const diffX = touch.clientX - this.touchStartX;
            
            // Follow finger movement
            if (diffX > 0 && diffX < 280) {
                this.sidebar.style.transform = `translateX(${diffX - 280}px)`;
                this.sidebar.style.transition = 'none';
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!this.isSwipeGesture) return;
            
            const touch = e.changedTouches[0];
            this.touchEndX = touch.clientX;
            const diffX = this.touchEndX - this.touchStartX;
            
            // Reset transition
            this.sidebar.style.transition = '';
            this.sidebar.style.transform = '';
            
            // Open if swiped enough
            if (diffX > this.swipeThreshold) {
                this.openSidebar();
                this.hapticFeedback('medium');
            }
            
            this.isSwipeGesture = false;
        });
        
        // Swipe sidebar to close
        this.sidebar.addEventListener('touchstart', (e) => {
            if (!this.sidebar.classList.contains('open')) return;
            
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.isSwipeGesture = true;
        });
        
        this.sidebar.addEventListener('touchmove', (e) => {
            if (!this.isSwipeGesture || !this.sidebar.classList.contains('open')) return;
            
            const touch = e.touches[0];
            const diffX = touch.clientX - this.touchStartX;
            
            // Follow finger to close
            if (diffX < 0) {
                const translateX = Math.max(diffX, -280);
                this.sidebar.style.transform = `translateX(${translateX}px)`;
                this.sidebar.style.transition = 'none';
            }
        });
        
        this.sidebar.addEventListener('touchend', (e) => {
            if (!this.isSwipeGesture || !this.sidebar.classList.contains('open')) return;
            
            const touch = e.changedTouches[0];
            this.touchEndX = touch.clientX;
            const diffX = this.touchEndX - this.touchStartX;
            
            // Reset
            this.sidebar.style.transition = '';
            this.sidebar.style.transform = '';
            
            // Close if swiped left enough
            if (diffX < -this.swipeThreshold) {
                this.closeSidebar();
                this.hapticFeedback('light');
            }
            
            this.isSwipeGesture = false;
        });
    }
    
    // Enhanced card interactions
    setupCardGestures() {
        const cards = document.querySelectorAll('.nexus-card');
        
        cards.forEach(card => {
            let touchStartTime = 0;
            let longPressTimer = null;
            
            // Long press for card actions
            card.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                const touch = e.touches[0];
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
                
                // Long press detection (500ms)
                longPressTimer = setTimeout(() => {
                    this.showCardActions(card, touch.clientX, touch.clientY);
                    this.hapticFeedback('heavy');
                }, 500);
            });
            
            card.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                const diffX = Math.abs(touch.clientX - this.touchStartX);
                const diffY = Math.abs(touch.clientY - this.touchStartY);
                
                // Cancel long press if moved too much
                if (diffX > 10 || diffY > 10) {
                    clearTimeout(longPressTimer);
                }
            });
            
            card.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
                
                // Quick tap feedback
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 200) {
                    this.hapticFeedback('light');
                }
            });
            
            // Double tap to bookmark (example)
            let lastTap = 0;
            card.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    // Double tap detected
                    e.preventDefault();
                    this.bookmarkCard(card);
                    this.hapticFeedback('medium');
                }
                lastTap = currentTime;
            });
        });
    }
    
    // Mobile toggle with haptic feedback
    setupMobileToggle() {
        if (!this.mobileToggle) return;
        
        // Update mobile toggle HTML
        this.mobileToggle.innerHTML = `
            <div class="nexus-hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        this.mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
            this.hapticFeedback('medium');
        });
        
        // Touch feedback
        this.mobileToggle.addEventListener('touchstart', () => {
            this.mobileToggle.style.transform = 'scale(0.95)';
        });
        
        this.mobileToggle.addEventListener('touchend', () => {
            setTimeout(() => {
                this.mobileToggle.style.transform = '';
            }, 100);
        });
    }
    
    // Pull to refresh gesture
    setupPullToRefresh() {
        if (window.innerWidth > 1024) return;
        
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        const pullThreshold = 80;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = false;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY > 0 || startY === 0) return;
            
            const currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 20) {
                isPulling = true;
                e.preventDefault();
                
                // Visual feedback
                const intensity = Math.min(pullDistance / pullThreshold, 1);
                document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 40)}px)`;
                document.body.style.transition = 'none';
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (isPulling) {
                document.body.style.transition = 'transform 0.3s ease';
                document.body.style.transform = '';
                
                if (pullDistance > pullThreshold) {
                    // Trigger refresh
                    this.showRefreshFeedback();
                    this.hapticFeedback('heavy');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                }
            }
            
            startY = 0;
            pullDistance = 0;
            isPulling = false;
        });
    }
    
    // Haptic feedback (if supported)
    hapticFeedback(intensity = 'light') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30, 10, 30]
            };
            navigator.vibrate(patterns[intensity] || patterns.light);
        }
    }
    
    // Sidebar control methods
    toggleSidebar() {
        if (this.sidebar.classList.contains('open')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('open');
        this.mobileToggle.classList.add('active');
        this.sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('open');
        this.mobileToggle.classList.remove('active');
        this.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Card actions menu
    showCardActions(card, x, y) {
        // Remove existing action menu
        const existingMenu = document.querySelector('.nexus-card-actions-menu');
        if (existingMenu) existingMenu.remove();
        
        const menu = document.createElement('div');
        menu.className = 'nexus-card-actions-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${y - 60}px;
            left: ${x - 80}px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid var(--nexus-primary);
            border-radius: 12px;
            padding: 8px;
            display: flex;
            gap: 8px;
            z-index: 10000;
            animation: nexusPopIn 0.2s ease-out;
        `;
        
        menu.innerHTML = `
            <button class="nexus-action-btn-mini" data-action="share">📤</button>
            <button class="nexus-action-btn-mini" data-action="bookmark">🔖</button>
            <button class="nexus-action-btn-mini" data-action="copy">📋</button>
        `;
        
        document.body.appendChild(menu);
        
        // Handle action clicks
        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleCardAction(card, action);
                menu.remove();
            }
        });
        
        // Remove on outside click
        setTimeout(() => {
            document.addEventListener('click', function removeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                }
            });
        }, 100);
    }
    
    handleCardAction(card, action) {
        const cardLink = card.querySelector('a[href]');
        const cardUrl = cardLink ? cardLink.href : window.location.href;
        const cardTitle = card.querySelector('.nexus-card-title')?.textContent || 'Article';
        
        switch (action) {
            case 'share':
                if (navigator.share) {
                    navigator.share({
                        title: cardTitle,
                        url: cardUrl
                    });
                } else {
                    this.copyToClipboard(cardUrl);
                    this.showToast('Link copied!');
                }
                break;
                
            case 'bookmark':
                this.bookmarkCard(card);
                break;
                
            case 'copy':
                this.copyToClipboard(cardUrl);
                this.showToast('Link copied!');
                break;
        }
    }
    
    bookmarkCard(card) {
        card.classList.toggle('bookmarked');
        const isBookmarked = card.classList.contains('bookmarked');
        this.showToast(isBookmarked ? 'Bookmarked! 🔖' : 'Bookmark removed');
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'nexus-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--nexus-bg-tertiary);
            color: var(--nexus-text-primary);
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid var(--nexus-primary);
            z-index: 10000;
            font-size: 14px;
            animation: nexusSlideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'nexusSlideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    showRefreshFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Refreshing...';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--nexus-primary);
            color: var(--nexus-bg-primary);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 2000);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.nexusMobileGestures = new NexusMobileGestures();
});

// Add CSS animations
const mobileAnimationsCSS = `
@keyframes nexusPopIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

@keyframes nexusSlideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

@keyframes nexusSlideDown {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(20px); opacity: 0; }
}

.nexus-action-btn-mini {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: rgba(0, 212, 255, 0.2);
    color: var(--nexus-primary);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.nexus-action-btn-mini:active {
    transform: scale(0.9);
    background: rgba(0, 212, 255, 0.3);
}

.nexus-card.bookmarked::before {
    content: '🔖';
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    z-index: 10;
}
`;

// Inject animations CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileAnimationsCSS;
document.head.appendChild(styleSheet);