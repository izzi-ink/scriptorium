// Scriptarium Design System - JavaScript
// Version: 1.0.0
// Author: Design System Team
// Description: Progressive enhancement JavaScript for Scriptarium Design System

console.log('🎨 Scriptarium Design System Loading...');

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.toggle = document.getElementById('mobile-toggle');
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('mobile-overlay');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.toggle || !this.sidebar || !this.overlay) {
            console.warn('Mobile navigation elements not found');
            return;
        }

        console.log('✅ Mobile navigation initialized');

        // Bind event listeners
        this.toggle.addEventListener('click', (e) => this.handleToggle(e));
        this.toggle.addEventListener('touchstart', (e) => this.handleToggle(e));
        this.overlay.addEventListener('click', () => this.close());

        // Close menu when clicking nav links on mobile
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && this.isOpen) {
                    this.close();
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });

        // Keyboard support
        this.toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToggle(e);
            }
        });
    }

    handleToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('🎯 Mobile menu toggle clicked');
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        console.log('📱 Opening mobile menu');
        
        this.isOpen = true;
        this.sidebar.classList.add('mobile-open');
        this.overlay.style.display = 'block';
        
        // Force reflow before adding active class for smooth animation
        this.overlay.offsetHeight;
        this.overlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Update ARIA attributes
        this.toggle.setAttribute('aria-expanded', 'true');
        this.sidebar.setAttribute('aria-hidden', 'false');
    }

    close() {
        console.log('📱 Closing mobile menu');
        
        this.isOpen = false;
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Update ARIA attributes
        this.toggle.setAttribute('aria-expanded', 'false');
        this.sidebar.setAttribute('aria-hidden', 'true');
        
        // Hide overlay after animation
        setTimeout(() => {
            if (!this.isOpen) {
                this.overlay.style.display = 'none';
            }
        }, 300);
    }
}

// Smooth Scrolling Navigation
class SmoothNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        console.log('🧭 Smooth navigation initialized');

        // Add click handlers for smooth scrolling
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });

        // Set up intersection observer for active states
        this.setupActiveStates();
    }

    handleLinkClick(event, link) {
        event.preventDefault();
        
        // Update active states
        this.navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Smooth scroll to target
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupActiveStates() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = '#' + entry.target.id;
                    this.navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === targetId);
                    });
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Code Copy Handler
class CodeCopyHandler {
    constructor() {
        this.codeBlocks = document.querySelectorAll('.component-code');
        this.init();
    }

    init() {
        console.log('📋 Code copy handler initialized');

        this.codeBlocks.forEach(block => {
            block.addEventListener('click', () => this.copyCode(block));
            
            // Add copy feedback element
            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = 'Copied!';
            block.appendChild(feedback);
        });
    }

    copyCode(block) {
        const code = block.textContent.trim();
        
        navigator.clipboard.writeText(code).then(() => {
            const feedback = block.querySelector('.copy-feedback');
            feedback.classList.add('show');
            
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
            
            console.log('✅ Code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy code:', err);
        });
    }
}

// Theme Toggle (for future dark mode support)
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.theme);
        console.log(`🎨 Theme set to: ${this.theme}`);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        console.log(`🎨 Theme changed to: ${this.theme}`);
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        // Create progress bar element
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: var(--color-accent);
                z-index: 1002;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(style);

        // Handle scroll
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.animatedElements = document.querySelectorAll('.component, .section');
        this.init();
    }

    init() {
        console.log('🎭 Animation observer initialized');

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Add initial hidden state
        this.animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            observer.observe(element);
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                animation: fadeIn 0.6s ease forwards;
            }
            
            @keyframes fadeIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Keyboard Navigation
class KeyboardNavigation {
    constructor() {
        this.focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.init();
    }

    init() {
        console.log('⌨️ Keyboard navigation initialized');

        // Skip to content link
        this.addSkipLink();

        // Focus visible styling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('.main-content');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add skip link styles
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--color-accent);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                z-index: 1003;
            }
            
            .skip-link:focus {
                top: 0;
            }
            
            .keyboard-nav *:focus {
                outline: 2px solid var(--color-accent);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Copy feedback styles
const copyFeedbackStyles = `
    .copy-feedback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius);
        font-size: var(--text-sm);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    
    .copy-feedback.show {
        opacity: 1;
    }
`;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Scriptarium Design System...');

    // Add copy feedback styles
    const style = document.createElement('style');
    style.textContent = copyFeedbackStyles;
    document.head.appendChild(style);

    // Initialize all modules
    const mobileNav = new MobileNavigation();
    const smoothNav = new SmoothNavigation();
    const codeCopy = new CodeCopyHandler();
    const theme = new ThemeManager();
    const scrollProgress = new ScrollProgress();
    const animations = new AnimationObserver();
    const keyboard = new KeyboardNavigation();

    console.log('✨ Scriptarium Design System Ready!');

    // Expose API for external use
    window.Scriptarium = {
        mobileNav,
        smoothNav,
        codeCopy,
        theme,
        scrollProgress,
        animations,
        keyboard,
        version: '1.0.0'
    };
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        }
    });
    
    perfObserver.observe({ entryTypes: ['measure'] });
}