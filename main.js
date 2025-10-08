// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Page Loader: ensure at least one full animation cycle is shown, with a hard cap
    const loader = document.getElementById('pageLoader');
    if (loader) {
        const MIN_SHOW_MS = 2000; // show at least one full animation cycle (~2s)
        const HARD_CAP_MS = 2500; // never exceed this after DOM is ready
        const domStart = performance.now();
        let finished = false;
        let scheduled = false;

        const fadeOut = () => {
            if (finished) return;
            finished = true;
            loader.style.transition = 'opacity .35s ease';
            loader.style.opacity = '0';
            setTimeout(() => loader && loader.remove(), 350);
        };

        const scheduleRespectingMinimum = () => {
            if (scheduled) return;
            scheduled = true;
            const elapsed = performance.now() - domStart;
            const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
            setTimeout(fadeOut, remaining);
        };

        // Hard cap as a backstop
        const hardCapTimer = setTimeout(fadeOut, HARD_CAP_MS);

        // Prefer to schedule once the inline SVG logo has loaded so the animation is visible
        const svgObject = loader.querySelector('object.loader-logo');
        if (svgObject) {
            svgObject.addEventListener('load', scheduleRespectingMinimum, { once: true });
            // If cached and already available
            if (svgObject.contentDocument) scheduleRespectingMinimum();
        } else {
            // No logo object; still respect the minimum time
            scheduleRespectingMinimum();
        }

        // Also schedule when the page becomes visible (in case of prerender/background)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') scheduleRespectingMinimum();
        }, { once: true });
    }
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add smooth scrolling to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            console.log('Navigation clicked:', targetId);
            
            // Only prevent default for anchor links (starting with #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                console.log('Preventing default for anchor link');
                
                const targetSection = document.querySelector(targetId);
                console.log('Target section found:', targetSection);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    console.log('Scrolling to position:', targetPosition);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.log('Target section not found for:', targetId);
                }
            } else {
                console.log('Page link, allowing default behavior');
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = '#fff';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Make the hero section visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
    
    // Add pricing card interactions
    const enhancePricingCards = () => {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('featured')) {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.12)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (this.classList.contains('featured')) {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 12px 30px rgba(51, 51, 51, 0.15)';
                } else {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                }
            });
        });
    };

    // Add pricing button interactions
    const enhancePricingButtons = () => {
        const planButtons = document.querySelectorAll('.plan-btn');
        
        planButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
                
                // Show plan selection feedback
                const planName = this.closest('.pricing-card').querySelector('.plan-name').textContent;
                showPlanSelection(planName);
            });
        });
    };

    // Show plan selection feedback
    const showPlanSelection = (planName) => {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: planFeedback 3s ease forwards;
        `;
        feedback.textContent = `Selected: ${planName}`;
        
        document.body.appendChild(feedback);
        
        // Add animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes planFeedback {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    };

    // Initialize pricing interactions
    enhancePricingCards();
    enhancePricingButtons();

    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-btn, .cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to pricing section
            const pricingSection = document.querySelector('#pricing');
            if (pricingSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = pricingSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // If no pricing section, scroll to about section
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = aboutSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add mobile menu toggle (for smaller screens)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #333;
        `;
        
        // Insert mobile menu button
        nav.insertBefore(mobileMenuBtn, navLinks);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });
        
        // Media query for mobile menu
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleMobileMenu = (e) => {
            if (e.matches) {
                mobileMenuBtn.style.display = 'block';
                navLinks.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #fff;
                    flex-direction: column;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                `;
            } else {
                mobileMenuBtn.style.display = 'none';
                navLinks.style.cssText = '';
                navLinks.classList.remove('mobile-open');
            }
        };
        
        mediaQuery.addListener(handleMobileMenu);
        handleMobileMenu(mediaQuery);
        
        // Add mobile menu open class styles
        const style = document.createElement('style');
        style.textContent = `
            .nav-links.mobile-open {
                transform: translateY(0) !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);
    };
    
    createMobileMenu();
    
    // Category dropdown functionality for tools page
    const initializeCategoryFilter = () => {
        const categorySelect = document.getElementById('categorySelect');
        const productCards = document.querySelectorAll('.product-card');
        
        if (categorySelect && productCards.length > 0) {
            categorySelect.addEventListener('change', function() {
                const selectedCategory = this.value;
                
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // Add fade-out effect
                    card.classList.add('fade-out');
                    
                    setTimeout(() => {
                        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                            card.classList.remove('hidden', 'fade-out');
                            card.classList.add('fade-in');
                        } else {
                            card.classList.add('hidden');
                            card.classList.remove('fade-in');
                        }
                    }, 150);
                });
                
                // Show selection feedback
                const selectedText = this.options[this.selectedIndex].text;
                showCategorySelection(selectedText);
            });
        }
    };
    
    // Show category selection feedback
    const showCategorySelection = (categoryName) => {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: categoryFeedback 2s ease forwards;
        `;
        feedback.textContent = `Showing: ${categoryName}`;
        
        document.body.appendChild(feedback);
        
        // Add animation CSS if not already added
        if (!document.getElementById('categoryFeedbackStyle')) {
            const style = document.createElement('style');
            style.id = 'categoryFeedbackStyle';
            style.textContent = `
                @keyframes categoryFeedback {
                    0% { opacity: 0; transform: translateX(100%); }
                    20% { opacity: 1; transform: translateX(0); }
                    80% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    };
    
    // Initialize category filter
    initializeCategoryFilter();
    
    // Authentication Modal Functionality
    const initializeAuthModal = () => {
        const authModal = document.getElementById('authModal');
        const signUpBtn = document.querySelector('.contact-btn');
        const closeBtn = document.querySelector('.auth-close');
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const authModalTitle = document.getElementById('authModalTitle');
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        
        // Open modal when sign up button is clicked
        if (signUpBtn) {
            signUpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }
        
        // Close modal when X is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Tab switching functionality
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and forms
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding form
                if (targetTab === 'signup') {
                    document.getElementById('signupForm').classList.add('active');
                    authModalTitle.textContent = 'Sign Up';
                } else if (targetTab === 'login') {
                    document.getElementById('loginForm').classList.add('active');
                    authModalTitle.textContent = 'Login';
                }
            });
        });
        
        // Form submission handling
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('signupConfirmPassword').value;
                
                // Basic validation
                if (password !== confirmPassword) {
                    showAuthMessage('Passwords do not match!', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showAuthMessage('Password must be at least 6 characters long!', 'error');
                    return;
                }
                
                // Simulate successful signup
                showAuthMessage('Account created successfully! Welcome!', 'success');
                setTimeout(() => {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    signupForm.reset();
                }, 2000);
            });
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                // Simulate successful login
                showAuthMessage('Login successful! Welcome back!', 'success');
                setTimeout(() => {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    loginForm.reset();
                }, 2000);
            });
        }
    };
    
    // Show authentication messages
    const showAuthMessage = (message, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Add animation CSS if not already added
        if (!document.getElementById('authMessageStyle')) {
            const style = document.createElement('style');
            style.id = 'authMessageStyle';
            style.textContent = `
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    };
    
    // Initialize authentication modal
    initializeAuthModal();

    // Optimize 3D model loading and hide AR button on mobile
    const optimizeModelViewer = () => {
        const modelViewer = document.querySelector('model-viewer');
        if (modelViewer) {
            // Preload the model for faster loading
            modelViewer.setAttribute('preload', '');
            modelViewer.setAttribute('loading', 'eager');
            
            // Hide AR button on mobile devices
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // Remove AR attribute on mobile
                modelViewer.removeAttribute('ar');
                
                // Add CSS to hide AR button
                const style = document.createElement('style');
                style.textContent = `
                    model-viewer::part(default-ar-button) {
                        display: none !important;
                    }
                    .model-3d::part(default-ar-button) {
                        display: none !important;
                    }
                    model-viewer .default-ar-button {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add loading optimization and progress tracking
            let loadStartTime = performance.now();
            
            modelViewer.addEventListener('load', () => {
                const loadTime = performance.now() - loadStartTime;
                console.log(`3D model loaded successfully in ${loadTime.toFixed(2)}ms`);
                
                // Add smooth fade-in animation
                modelViewer.style.opacity = '0';
                modelViewer.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    modelViewer.style.opacity = '1';
                }, 100);
            });
            
            modelViewer.addEventListener('error', (e) => {
                console.error('3D model failed to load:', e);
                // Show fallback content if model fails to load
                const fallback = document.createElement('div');
                fallback.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-size: 16px;
                    border-radius: 8px;
                `;
                fallback.textContent = '3D Model Loading...';
                modelViewer.parentNode.insertBefore(fallback, modelViewer);
            });
            
            // Optimize for mobile performance
            if (isMobile) {
                modelViewer.setAttribute('interaction-prompt', 'none');
                modelViewer.setAttribute('interaction-prompt-threshold', '0');
            }
        }
    };

    // Initialize model optimization
    optimizeModelViewer();

    // Dashboard interactions
    const initDashboard = () => {
        const menuButtons = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.dash-section');
        const badge = document.getElementById('notifyBadge');

        if (menuButtons.length === 0 || sections.length === 0) return;

        menuButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active state for menu
                menuButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Section switch
                const id = btn.getAttribute('data-section');
                sections.forEach(sec => sec.classList.remove('active'));
                const target = document.getElementById(id);
                if (target) target.classList.add('active');

                // Simple badge clear when viewing messages
                if (id === 'messages' && badge) {
                    badge.textContent = '0';
                }
            });
        });
    };

    initDashboard();

    // Add Tool button feedback
    const addToolBtn = document.getElementById('addTool');
    if (addToolBtn) {
        addToolBtn.addEventListener('click', () => {
            const toast = document.createElement('div');
            toast.textContent = 'Add Tool clicked';
            toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:10px 14px;border-radius:8px;z-index:10000;';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 1500);
        });
    }

    // Chat Widget Logic
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatText = document.getElementById('chatText');
    const chatMessages = document.getElementById('chatMessages');

    const appendMessage = (text, role = 'user') => {
        if (!chatMessages) return;
        const msg = document.createElement('div');
        msg.className = `chat-message ${role}`;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const setOpen = (open) => {
        if (!chatWindow || !chatToggle) return;
        chatWindow.classList.toggle('open', open);
        chatWindow.style.display = open ? 'grid' : 'none';
        chatToggle.setAttribute('aria-expanded', String(open));
        if (open) setTimeout(() => chatText && chatText.focus(), 50);
        try { localStorage.setItem('chatOpen', open ? '1' : '0'); } catch(e) {}
    };

    const botReply = (userText) => {
        const lower = userText.trim().toLowerCase();
        let reply = "Thanks! We'll get back to you shortly.";
        if (lower.includes('price') || lower.includes('pricing')) reply = 'Our plans start at $29/mo. Check the Pricing section.';
        if (lower.includes('contact')) reply = 'You can reach us via the Contact section or this chat.';
        setTimeout(() => appendMessage(reply, 'bot'), 400);
    };

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => setOpen(!chatWindow.classList.contains('open')));
    }
    if (chatClose) {
        chatClose.addEventListener('click', () => setOpen(false));
    }
    if (chatForm && chatText) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatText.value.trim();
            if (!text) return;
            appendMessage(text, 'user');
            chatText.value = '';
            botReply(text);
        });
    }

    // Restore open state
    try {
        const wasOpen = localStorage.getItem('chatOpen') === '1';
        if (wasOpen) setOpen(true);
    } catch(e) {}

    // Contact form submission to n8n webhook
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                const response = await fetch('https://adminuserz32.app.n8n.cloud/webhook/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message, source: 'website' })
                });

                if (!response.ok) {
                    throw new Error('Failed to send. Please try again.');
                }

                alert('Message sent!');
                contactForm.reset();
            } catch (err) {
                alert(err.message || 'Something went wrong.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }
});

// Animated Chart for About Section
class AboutAnimatedChart {
    constructor() {
        this.container = document.getElementById('aboutChart');
        if (!this.container) return;
        
        // iOS Safari compatibility fix
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        // Get responsive dimensions
        this.updateDimensions();
        
        this.points = this.isIOS ? 60 : 80; // Reduce points for iOS performance
        this.isAnimating = false;
        this.animationId = null;
        this.time = 0;
        
        this.redData = [];
        this.blueData = [];
        
        // Delay initialization for iOS
        if (this.isIOS) {
            setTimeout(() => {
                this.generateInitialData();
                this.drawChart();
                this.start();
            }, 500);
        } else {
            this.generateInitialData();
            this.drawChart();
            this.start();
        }
        
        // Add resize listener with iOS compatibility
        this.resizeTimeout = null;
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
    }
    
    updateDimensions() {
        // iOS Safari viewport fix
        if (this.isIOS) {
            // Force layout recalculation for iOS
            this.container.style.display = 'none';
            this.container.offsetHeight; // Trigger reflow
            this.container.style.display = 'block';
        }
        
        const containerRect = this.container.getBoundingClientRect();
        this.width = Math.min(containerRect.width - 40, 360);
        this.height = Math.min(containerRect.height - 40, 260);
        this.startX = 20;
        this.startY = this.height / 2;
        
        // Ensure minimum dimensions for iOS
        if (this.isIOS) {
            this.width = Math.max(this.width, 200);
            this.height = Math.max(this.height, 120);
        }
    }
    
    handleResize() {
        // Debounce resize for iOS
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.updateDimensions();
            this.generateInitialData();
            this.drawChart();
        }, this.isIOS ? 300 : 100);
    }
    
    handleOrientationChange() {
        // iOS orientation change fix
        if (this.isIOS) {
            setTimeout(() => {
                this.updateDimensions();
                this.generateInitialData();
                this.drawChart();
            }, 500);
        }
    }
    
    generateInitialData() {
        this.redData = [];
        this.blueData = [];
        
        for (let i = 0; i < this.points; i++) {
            const x = this.startX + (i * (this.width / (this.points - 1)));
            
            // Generate dramatic initial data with significant bends
            const redY = this.startY + 
                Math.sin(i * 0.2) * 50 + 
                Math.cos(i * 0.25) * 35 + 
                Math.sin(i * 0.4) * 20;
                
            const blueY = this.startY + 
                Math.cos(i * 0.18) * 60 + 
                Math.sin(i * 0.3) * 40 + 
                Math.cos(i * 0.5) * 25;
            
            this.redData.push({ x, y: redY });
            this.blueData.push({ x, y: blueY });
        }
    }
    
    updateData() {
        this.time += this.isIOS ? 0.012 : 0.008; // Slightly faster for iOS
        
        for (let i = 0; i < this.points; i++) {
            const x = this.startX + (i * (this.width / (this.points - 1)));
            
            // Create dramatic, fluctuating wave patterns with significant bends
            const redY = this.startY + 
                Math.sin(this.time + i * 0.15) * 60 + 
                Math.cos(this.time * 0.8 + i * 0.12) * 40 + 
                Math.sin(this.time * 0.4 + i * 0.2) * 25 +
                Math.cos(this.time * 0.2 + i * 0.08) * 15;
                
            const blueY = this.startY + 
                Math.cos(this.time * 0.9 + i * 0.18) * 70 + 
                Math.sin(this.time * 0.6 + i * 0.14) * 45 + 
                Math.cos(this.time * 0.3 + i * 0.16) * 30 +
                Math.sin(this.time * 0.15 + i * 0.1) * 20;
            
            this.redData[i] = { x, y: redY };
            this.blueData[i] = { x, y: blueY };
        }
    }
    
    drawChart() {
        // Draw red line with smooth curves
        const redPath = this.redData.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');
        const redLineElement = document.getElementById('aboutRedLine');
        if (redLineElement) {
            redLineElement.setAttribute('d', redPath);
        }
        
        // Draw blue line with smooth curves
        const bluePath = this.blueData.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');
        const blueLineElement = document.getElementById('aboutBlueLine');
        if (blueLineElement) {
            blueLineElement.setAttribute('d', bluePath);
        }
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.updateData();
        this.drawChart();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.isAnimating = true;
        this.animate();
    }
    
    stop() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the about chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to fully load
    setTimeout(() => {
        const aboutChart = document.getElementById('aboutChart');
        if (aboutChart) {
            new AboutAnimatedChart();
        }
        
        // Initialize wireframe model
        initWireframeModel();
    }, 1000);
});

// Wireframe 3D Model
function initWireframeModel() {
    const container = document.getElementById('wireframe-container');
    if (!container) return;
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height, 400);
    
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000);
    camera.position.z = 8;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0); // Completely transparent background
    container.appendChild(renderer.domElement);
    
    // Model Creation: Two Gray Wireframe Layers
    const radius = 4; // Increased from 3 to 4 for larger model
    const detail = 3;
    const baseGeometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Layer 1: Dense Wireframe (Darker Gray)
    const material1 = new THREE.MeshBasicMaterial({
        color: 0x808080, // Dark Gray
        wireframe: true,
        wireframeLinewidth: 1.5,
    });
    const denseWireframe = new THREE.Mesh(baseGeometry, material1);
    scene.add(denseWireframe);
    
    // Layer 2: Sparse Wireframe (Lighter Gray)
    const material2 = new THREE.MeshBasicMaterial({
        color: 0xa0a0a0, // Lighter Gray
        wireframe: true,
        wireframeLinewidth: 1,
        transparent: true,
        opacity: 0.5,
        depthTest: false,
    });
    
    const sparseGeometry = new THREE.IcosahedronGeometry(radius * 1.02, 1);
    const sparseWireframe = new THREE.Mesh(sparseGeometry, material2);
    scene.add(sparseWireframe);
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate both models together (slower rotation)
        denseWireframe.rotation.x += 0.002;
        denseWireframe.rotation.y += 0.002;
        
        sparseWireframe.rotation.x += 0.002;
        sparseWireframe.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    
    // Responsive handler
    function handleResize() {
        const newSize = Math.min(container.getBoundingClientRect().width, container.getBoundingClientRect().height, 400);
        camera.aspect = newSize / newSize;
        camera.updateProjectionMatrix();
        renderer.setSize(newSize, newSize);
    }
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
}
