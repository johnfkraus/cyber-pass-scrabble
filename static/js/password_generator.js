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
        this.startLetterInput = document.getElementById('startLetter');
        this.endLetterInput = document.getElementById('endLetter');
        this.delimiterInput = document.getElementById('delimiter');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.passwordList = document.getElementById('passwordList');
        this.entropyValue = document.getElementById('entropyValue');
        this.entropyBar = document.querySelector('.entropy-bar');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePasswords());
        this.clearBtn.addEventListener('click', () => this.clearPasswords());
        this.passwordList.addEventListener('click', (e) => {
            if (e.target.classList.contains('password-text')) {
                this.copyToClipboard(e.target.textContent, e.target);
            }
        });
    }

    clearPasswords() {
        this.passwordList.innerHTML = '';
        this.updateEntropyMeter(0);
    }

    getRandomWord(minLength, maxLength, startLetters, endLetters) {
        console.log(`Getting random word with length ${minLength}-${maxLength}`);
        
        // Validate and normalize length constraints
        minLength = Math.max(2, Math.min(minLength, maxLength));
        maxLength = Math.min(15, Math.max(minLength, maxLength));
        
        // First filter by length
        let filteredWords = SCRABBLE_WORDS.filter(word => 
            word.length >= minLength && word.length <= maxLength
        );
        
        console.log(`Found ${filteredWords.length} words matching length criteria`);
        
        // If no words match the length criteria, gradually adjust the range
        if (filteredWords.length === 0) {
            let adjustedMin = minLength;
            let adjustedMax = maxLength;
            
            while (filteredWords.length === 0 && (adjustedMin > 2 || adjustedMax < 15)) {
                adjustedMin = Math.max(2, adjustedMin - 1);
                adjustedMax = Math.min(15, adjustedMax + 1);
                console.log(`Adjusting length range to ${adjustedMin}-${adjustedMax}`);
                
                filteredWords = SCRABBLE_WORDS.filter(word => 
                    word.length >= adjustedMin && word.length <= adjustedMax
                );
            }
        }
        
        // Apply letter constraints if specified and we have words to filter
        if ((startLetters || endLetters) && filteredWords.length > 0) {
            console.log('Applying letter constraints');
            const constrainedWords = filterWordsByConstraints(filteredWords, startLetters, endLetters);
            
            if (constrainedWords.length > 0) {
                console.log(`Found ${constrainedWords.length} words matching all constraints`);
                return constrainedWords[Math.floor(Math.random() * constrainedWords.length)];
            }
            
            console.warn('Letter constraints produced no matches, falling back to length-filtered words');
        }
        
        // Use length-filtered words if available
        if (filteredWords.length > 0) {
            console.log(`Using ${filteredWords.length} length-filtered words`);
            return filteredWords[Math.floor(Math.random() * filteredWords.length)];
        }
        
        // Ultimate fallback - use any word from the dictionary
        console.warn('No matching words found, using complete dictionary');
        return SCRABBLE_WORDS[Math.floor(Math.random() * SCRABBLE_WORDS.length)];
    }

    calculateEntropy(passwordCount) {
        # const charset = 26; // lowercase letters
        # const passwordLength = password.replace(/[^a-z]/g, '').length;
        const entropy = passwordCount * Math.log2(SCRABBLE_WORDS.length);
        return Math.round(entropy);
    }

    updateEntropyMeter(entropy) {
        const maxEntropy = 128;
        const percentage = Math.min((entropy / maxEntropy) * 100, 100);
        
        // Animate the entropy value counting up with easing
        const currentValue = parseInt(this.entropyValue.textContent);
        const duration = 1000; // 1 second animation
        const startTime = performance.now();
        const startValue = currentValue;
        const endValue = entropy;
        
        const easeOutQuart = x => 1 - Math.pow(1 - x, 4);
        
        const animateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                const easedProgress = easeOutQuart(progress);
                const currentNum = Math.round(startValue + (endValue - startValue) * easedProgress);
                this.entropyValue.textContent = currentNum;
                requestAnimationFrame(animateValue);
            } else {
                this.entropyValue.textContent = endValue;
            }
        };
        
        requestAnimationFrame(animateValue);
        
        // Animate the bar width with spring effect
        this.entropyBar.style.width = `${percentage}%`;
        this.entropyBar.style.transform = 'scaleX(1.05)';
        setTimeout(() => {
            this.entropyBar.style.transform = 'scaleX(1)';
        }, 150);
        
        // Update visual feedback based on strength
        const strengthClass = percentage >= 80 ? 'strong' :
                            percentage >= 60 ? 'medium' : 'weak';
                            
        this.entropyBar.className = `entropy-bar strength-${strengthClass}`;
        this.entropyValue.className = `entropy-value strength-${strengthClass}`;
        
        // Add glitch effect on significant strength changes
        if (Math.abs(percentage - (currentValue / maxEntropy * 100)) > 20) {
            this.entropyValue.style.animation = 'glitch 0.3s ease-out';
            setTimeout(() => {
                this.entropyValue.style.animation = '';
            }, 300);
        }
        
        // Update text color and glow based on strength
        const colors = {
            strong: 'var(--neon-blue)',
            medium: 'var(--neon-purple)',
            weak: 'var(--neon-pink)'
        };
        
        const color = colors[strengthClass];
        this.entropyValue.style.color = color;
        this.entropyValue.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    }

    async copyToClipboard(text, clickedElement) {
        try {
            await navigator.clipboard.writeText(text);
            // Show temporary success indicator
            const indicator = document.createElement('div');
            indicator.className = 'copy-indicator';
            indicator.textContent = 'Copied!';
            
            // Position the indicator near the clicked password
            const rect = clickedElement.getBoundingClientRect();
            indicator.style.position = 'fixed';
            indicator.style.left = `${rect.right + 10}px`;
            indicator.style.top = `${rect.top}px`;
            
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.classList.add('fade-out');
                setTimeout(() => document.body.removeChild(indicator), 300);
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
            // Show error indicator
            const indicator = document.createElement('div');
            indicator.className = 'copy-indicator error';
            indicator.textContent = 'Copy failed';
            
            // Position the indicator near the clicked password
            const rect = clickedElement.getBoundingClientRect();
            indicator.style.position = 'fixed';
            indicator.style.left = `${rect.right + 10}px`;
            indicator.style.top = `${rect.top}px`;
            
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.classList.add('fade-out');
                setTimeout(() => document.body.removeChild(indicator), 300);
            }, 1000);
        }
    }

    generatePasswords() {
        const wordCount = parseInt(this.wordCountInput.value);
        const passwordCount = parseInt(this.passwordCountInput.value);
        const minLength = parseInt(this.minLengthInput.value);
        const maxLength = parseInt(this.maxLengthInput.value);
        const delimiter = this.delimiterInput.value;

        // Validate inputs
        if (isNaN(wordCount) || isNaN(passwordCount) || isNaN(minLength) || isNaN(maxLength)) {
            console.error('Invalid input values');
            return;
        }

        this.passwordList.innerHTML = '';
        
        for (let i = 0; i < passwordCount; i++) {
            const words = [];
            // Handle multiple start letters and single end letter
            const startLetters = validateLetterInput(this.startLetterInput.value);
            const endLetter = validateLetterInput(this.endLetterInput.value);
            
            for (let j = 0; j < wordCount; j++) {
                words.push(this.getRandomWord(minLength, maxLength, startLetters, endLetter));
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