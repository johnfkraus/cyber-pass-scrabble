class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
    }

    createParticle(x, strength) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: ${strength > 80 ? 'var(--neon-blue)' : 'var(--neon-pink)'};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            left: ${x}px;
            bottom: 0;
        `;
        
        this.container.appendChild(particle);
        return particle;
    }

    animate(strength) {
        const x = Math.random() * this.container.offsetWidth;
        const particle = this.createParticle(x, strength);
        
        const animation = particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.8 },
            { transform: `translateY(-${50 + Math.random() * 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => particle.remove();
    }

    startEmitting(strength) {
        const particleCount = Math.floor(strength / 10);
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => this.animate(strength), Math.random() * 1000);
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cyber-notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--neon-blue);
        color: var(--cyber-black);
        padding: 1rem 2rem;
        border-radius: 5px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        box-shadow: 0 0 20px var(--neon-blue);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function addGlitchEffect(element) {
    element.addEventListener('mouseover', () => {
        element.style.animation = 'glitch 0.3s infinite';
    });

    element.addEventListener('mouseout', () => {
        element.style.animation = 'none';
    });
}

let particleSystem;

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add glitch animation on theme change
        themeToggle.style.animation = 'glitch 0.3s';
        setTimeout(() => themeToggle.style.animation = '', 300);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.innerHTML = theme === 'dark' 
        ? '🌙' 
        : '☀️';
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const entropyMeter = document.querySelector('.entropy-meter');
    particleSystem = new ParticleSystem(entropyMeter);
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Add glitch effect to cyber-title
    const title = document.querySelector('.cyber-title');
    addGlitchEffect(title);

    // Add hover animations to buttons
    document.querySelectorAll('.cyber-button').forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Expose particleSystem globally for use in password_generator.js
    window.particleSystem = particleSystem;
});

// Tutorial Modal Functionality
function initTutorial() {
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    const steps = document.querySelectorAll('.tutorial-step');
    const stepIndicator = document.querySelector('.step-indicator');
    let currentStep = 1;

    function updateStepIndicator() {
        stepIndicator.textContent = `${currentStep}/3`;
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === 3 ? 'Finish' : 'Next';
    }

    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNumber) {
                step.classList.add('active');
            }
        });
        currentStep = stepNumber;
        updateStepIndicator();
    }

    tutorialBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'block';
        showStep(1);
    });

    closeModal.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < 3) {
            showStep(currentStep + 1);
        } else {
            tutorialModal.style.display = 'none';
        }
    });

    // Close modal when clicking outside
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (tutorialModal.style.display === 'block') {
            if (e.key === 'Escape') {
                tutorialModal.style.display = 'none';
            } else if (e.key === 'ArrowRight' && currentStep < 3) {
                showStep(currentStep + 1);
            } else if (e.key === 'ArrowLeft' && currentStep > 1) {
                showStep(currentStep - 1);
            }
        }
    });
}

// Configuration Modal Functionality
function initConfig() {
    const configBtn = document.getElementById('configBtn');
    const configModal = document.getElementById('configModal');
    const configForm = document.getElementById('configForm');
    const closeConfigModal = configModal.querySelector('.close-modal');

    // Load saved settings
    function loadSavedSettings() {
        const settings = JSON.parse(localStorage.getItem('passwordSettings') || '{}');
        if (settings.wordCount) document.getElementById('defaultWordCount').value = settings.wordCount;
        if (settings.passwordCount) document.getElementById('defaultPasswordCount').value = settings.passwordCount;
        if (settings.minLength) document.getElementById('defaultMinLength').value = settings.minLength;
        if (settings.maxLength) document.getElementById('defaultMaxLength').value = settings.maxLength;
    }

    // Save settings
    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
            wordCount: parseInt(document.getElementById('defaultWordCount').value),
            passwordCount: parseInt(document.getElementById('defaultPasswordCount').value),
            minLength: parseInt(document.getElementById('defaultMinLength').value),
            maxLength: parseInt(document.getElementById('defaultMaxLength').value)
        };
        localStorage.setItem('passwordSettings', JSON.stringify(settings));
        
        // Update main form with new defaults
        document.getElementById('wordCount').value = settings.wordCount;
        document.getElementById('passwordCount').value = settings.passwordCount;
        document.getElementById('minLength').value = settings.minLength;
        document.getElementById('maxLength').value = settings.maxLength;
        
        configModal.style.display = 'none';
        showNotification('Settings saved successfully!');
    });

    configBtn.addEventListener('click', () => {
        loadSavedSettings();
        configModal.style.display = 'block';
    });

    closeConfigModal.addEventListener('click', () => {
        configModal.style.display = 'none';
    });

    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) {
            configModal.style.display = 'none';
        }
    });
}

// Initialize tutorial and configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing initialization code)
    
    // Initialize tutorial and config
    initTutorial();
    initConfig();
});