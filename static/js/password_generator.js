class PasswordGenerator {
    constructor() {
        this.bindElements();
        this.attachEventListeners();
    }

    bindElements() {
        this.wordCountInput = document.getElementById('wordCount');
        this.passwordCountInput = document.getElementById('passwordCount');
        this.minLengthInput = document.getElementById('minLength');
        this.maxLengthInput = document.getElementById('maxLength');
        this.delimiterInput = document.getElementById('delimiter');
        this.generateBtn = document.getElementById('generateBtn');
        this.passwordList = document.getElementById('passwordList');
        this.entropyValue = document.getElementById('entropyValue');
        this.entropyBar = document.querySelector('.entropy-bar');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePasswords());
        this.passwordList.addEventListener('click', (e) => {
            if (e.target.classList.contains('password-text')) {
                this.copyToClipboard(e.target.textContent);
            }
        });
    }

    getRandomWord(minLength, maxLength) {
        const filteredWords = SCRABBLE_WORDS.filter(word => 
            word.length >= minLength && word.length <= maxLength
        );
        return filteredWords[Math.floor(Math.random() * filteredWords.length)];
    }

    calculateEntropy(password) {
        const charset = 26; // lowercase letters
        const passwordLength = password.replace(/[^a-z]/g, '').length;
        const entropy = Math.log2(Math.pow(charset, passwordLength));
        return Math.round(entropy);
    }

    updateEntropyMeter(entropy) {
        const maxEntropy = 128;
        const percentage = Math.min((entropy / maxEntropy) * 100, 100);
        
        // Animate the entropy value counting up
        const currentValue = parseInt(this.entropyValue.textContent);
        const step = Math.ceil(Math.abs(entropy - currentValue) / 20);
        let value = currentValue;
        
        const animateValue = () => {
            if (value < entropy) {
                value = Math.min(value + step, entropy);
                this.entropyValue.textContent = value;
                requestAnimationFrame(animateValue);
            } else if (value > entropy) {
                value = Math.max(value - step, entropy);
                this.entropyValue.textContent = value;
                requestAnimationFrame(animateValue);
            }
        };
        
        animateValue();
        
        // Animate the bar width
        this.entropyBar.style.width = `${percentage}%`;
        
        // Trigger particle effects
        if (window.particleSystem) {
            window.particleSystem.startEmitting(percentage);
        }
        
        // Play sound effect based on strength
        if (window.soundEffects) {
            window.soundEffects.playGenerateSound(percentage);
        }
        
        // Update text color based on strength
        this.entropyValue.style.color = percentage > 80 ? 'var(--neon-blue)' : 
                                      percentage > 60 ? 'var(--neon-purple)' : 
                                      'var(--neon-pink)';
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Password copied!');
            if (window.soundEffects) {
                window.soundEffects.playCopySound();
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    generatePasswords() {
        const wordCount = parseInt(this.wordCountInput.value);
        const passwordCount = parseInt(this.passwordCountInput.value);
        const minLength = parseInt(this.minLengthInput.value);
        const maxLength = parseInt(this.maxLengthInput.value);
        const delimiter = this.delimiterInput.value;

        this.passwordList.innerHTML = '';
        
        for (let i = 0; i < passwordCount; i++) {
            const words = [];
            for (let j = 0; j < wordCount; j++) {
                words.push(this.getRandomWord(minLength, maxLength));
            }
            
            const password = words.join(delimiter);
            const entropy = this.calculateEntropy(password);
            
            const passwordElement = document.createElement('div');
            passwordElement.className = 'password-item';
            passwordElement.innerHTML = `
                <span class="password-text">${password}</span>
                <span class="entropy-badge">${entropy} bits</span>
            `;
            
            this.passwordList.appendChild(passwordElement);
            this.updateEntropyMeter(entropy);
        }

        // Log generation parameters
        this.logGeneration({
            wordCount,
            minLength,
            maxLength,
            delimiter,
            countGenerated: passwordCount
        });
    }

    async logGeneration(params) {
        try {
            await fetch('/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });
        } catch (err) {
            console.error('Failed to log generation:', err);
        }
    }
}

// Initialize the password generator
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});
