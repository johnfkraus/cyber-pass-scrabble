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
