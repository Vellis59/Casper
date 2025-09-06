/**
 * Nexus Custom Handlebars Helpers
 * Advanced functionality for revolutionary theme
 */

// Helper to generate random numbers
if (typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper('random', function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    });

    // Helper to repeat elements
    Handlebars.registerHelper('times', function(n, options) {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += options.fn(Object.assign({}, this, { index: i }));
        }
        return result;
    });

    // Helper to get initials from name
    Handlebars.registerHelper('initials', function(name) {
        if (!name) return '';
        return name.split(' ')
                  .map(word => word.charAt(0))
                  .join('')
                  .toUpperCase()
                  .substring(0, 2);
    });

    // Helper to get random character from string
    Handlebars.registerHelper('random_char', function(chars) {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    // Helper for mathematical operations
    Handlebars.registerHelper('math', function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        
        switch (operator) {
            case '+': return lvalue + rvalue;
            case '-': return lvalue - rvalue;
            case '*': return lvalue * rvalue;
            case '/': return lvalue / rvalue;
            case '%': return lvalue % rvalue;
            default: return lvalue;
        }
    });

    // Helper for formatting dates
    Handlebars.registerHelper('formatDate', function(date, format) {
        const d = new Date(date);
        switch (format) {
            case 'YYYY-MM-DD HH:mm':
                return d.getFullYear() + '-' + 
                       String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(d.getDate()).padStart(2, '0') + ' ' +
                       String(d.getHours()).padStart(2, '0') + ':' + 
                       String(d.getMinutes()).padStart(2, '0');
            default:
                return d.toLocaleDateString();
        }
    });
}

/**
 * Nexus Advanced Interactive Features
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Matrix Rain Effect
    function initMatrixRain() {
        const matrixContainer = document.querySelector('.nexus-matrix-bg');
        if (!matrixContainer) return;
        
        const chars = '01ABCDEF';
        
        function createMatrixChar() {
            const char = document.createElement('div');
            char.className = 'nexus-matrix-char';
            char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            char.style.left = Math.random() * 100 + '%';
            char.style.animationDuration = (Math.random() * 6 + 4) + 's';
            char.style.animationDelay = Math.random() * 2 + 's';
            
            matrixContainer.appendChild(char);
            
            // Remove after animation
            setTimeout(() => {
                if (char.parentNode) {
                    char.parentNode.removeChild(char);
                }
            }, 8000);
        }
        
        // Create initial characters
        for (let i = 0; i < 20; i++) {
            setTimeout(createMatrixChar, i * 200);
        }
        
        // Continue creating characters
        setInterval(createMatrixChar, 300);
    }
    
    // Initialize Particle System
    function initParticleSystem() {
        const particleContainers = document.querySelectorAll('.nexus-particles');
        
        particleContainers.forEach(container => {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'nexus-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                container.appendChild(particle);
            }
        });
    }
    
    // Initialize Interactive Cards
    function initInteractiveCards() {
        const cards = document.querySelectorAll('.nexus-card');
        
        cards.forEach(card => {
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', function() {
                // Play subtle hover sound if audio is enabled
                playHoverSound();
            });
            
            // Particle burst on click
            card.addEventListener('click', function(e) {
                // Delay execution to ensure function is defined
                setTimeout(() => {
                    if (typeof createParticleBurst === 'function') {
                        createParticleBurst(e.clientX, e.clientY);
                    }
                }, 0);
            });
            
            // Progress bar animation
            const progressBar = card.querySelector('.nexus-card-progress');
            if (progressBar) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            progressBar.style.width = '100%';
                        }
                    });
                });
                observer.observe(card);
            }
        });
    }
    
    // Create Particle Burst Effect
    function createParticleBurst(x, y) {
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'fixed';
        burstContainer.style.left = x + 'px';
        burstContainer.style.top = y + 'px';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '9999';
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'nexus-particle-burst';
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = Math.random() * 50 + 30;
            const lifetime = Math.random() * 1000 + 500;
            
            particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
            
            burstContainer.appendChild(particle);
            
            // Animate particle
            let startTime = Date.now();
            function animateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress < 1) {
                    const x = Math.cos(angle) * velocity * progress;
                    const y = Math.sin(angle) * velocity * progress + (progress * progress * 50);
                    const opacity = 1 - progress;
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                    particle.style.opacity = opacity;
                    
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            animateParticle();
        }
        
        document.body.appendChild(burstContainer);
        
        setTimeout(() => {
            burstContainer.remove();
        }, 2000);
    }
    
    // Play Hover Sound (optional)
    function playHoverSound() {
        // Create subtle beep sound using Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    // Initialize Glitch Effect
    function initGlitchEffect() {
        const glitchElements = document.querySelectorAll('.nexus-glitch-text');
        
        glitchElements.forEach(element => {
            element.setAttribute('data-text', element.textContent);
            
            setInterval(() => {
                if (Math.random() > 0.97) {
                    element.style.animation = 'none';
                    element.offsetHeight; // Trigger reflow
                    element.style.animation = 'nexus-glitch-1 0.2s ease-in-out';
                }
            }, 100);
        });
    }
    
    // Initialize Typewriter Effect
    function initTypewriter() {
        const typewriterElements = document.querySelectorAll('.nexus-typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i > text.length) {
                    clearInterval(timer);
                    element.style.borderRight = 'none';
                }
            }, 50 + Math.random() * 50);
        });
    }
    
    // Initialize Reactive Background
    function initReactiveBackground() {
        document.addEventListener('mousemove', function(e) {
            const reactiveElements = document.querySelectorAll('.nexus-reactive-bg');
            
            reactiveElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                element.style.setProperty('--mouse-x', x + '%');
                element.style.setProperty('--mouse-y', y + '%');
            });
        });
    }
    
    // Initialize Intersection Observers for Animations
    function initIntersectionAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('nexus-animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        const animatableElements = document.querySelectorAll('.nexus-float, .nexus-pulse, .nexus-morph');
        animatableElements.forEach(el => observer.observe(el));
    }
    
    // Keyboard Shortcuts Enhancement
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + Shift + N for neon mode toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                document.body.classList.toggle('nexus-neon-mode');
            }
            
            // Ctrl/Cmd + Shift + M for matrix mode
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                document.body.classList.toggle('nexus-matrix-mode');
            }
        });
    }
    
    // Initialize all features
    initMatrixRain();
    initParticleSystem();
    initInteractiveCards();
    initGlitchEffect();
    initTypewriter();
    initReactiveBackground();
    initIntersectionAnimations();
    initKeyboardShortcuts();
    
    // Add loading completion
    window.addEventListener('load', function() {
        document.body.classList.add('nexus-loaded');
        
        // Animate loading cards
        const cards = document.querySelectorAll('.nexus-card.loading');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('loading');
            }, index * 150);
        });
    });
});

// Export for use in other files
window.NexusHelpers = {
    createParticleBurst: createParticleBurst,
    playHoverSound: playHoverSound
};