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

        minLength = Math.max(2, Math.min(minLength, maxLength));
        maxLength = Math.min(15, Math.max(minLength, maxLength));

        let filteredWords = SCRABBLE_WORDS.filter(word => 
            word.length >= minLength && word.length <= maxLength
        );

        console.log(`Found ${filteredWords.length} words matching length criteria`);

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

        if ((startLetters || endLetters) && filteredWords.length > 0) {
            console.log('Applying letter constraints');
            const constrainedWords = filterWordsByConstraints(filteredWords, startLetters, endLetters);

            if (constrainedWords.length > 0) {
                console.log(`Found ${constrainedWords.length} words matching all constraints`);
                return constrainedWords[Math.floor(Math.random() * constrainedWords.length)];
            }

            console.warn('Letter constraints produced no matches, falling back to length-filtered words');
        }

        if (filteredWords.length > 0) {
            console.log(`Using ${filteredWords.length} length-filtered words`);
            return filteredWords[Math.floor(Math.random() * filteredWords.length)];
        }

        console.warn('No matching words found, using complete dictionary');
        return SCRABBLE_WORDS[Math.floor(Math.random() * SCRABBLE_WORDS.length)];
    }

    calculateEntropy(wordCount) {
        const entropy = wordCount * Math.log2(SCRABBLE_WORDS.length);
        return Math.round(entropy);
    }

    updateEntropyMeter(entropy) {
        const maxEntropy = 128;
        const percentage = Math.min((entropy / maxEntropy) * 100, 100);

        this.entropyBar.style.width = `${percentage}%`;
        this.entropyValue.textContent = entropy;

        const strengthClass = percentage >= 80 ? 'strong' :
                            percentage >= 60 ? 'medium' : 'weak';

        this.entropyBar.className = `entropy-bar strength-${strengthClass}`;
    }

    async copyToClipboard(text, element) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyIndicator(element, 'Copied!', false);
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showCopyIndicator(element, 'Copy failed', true);
        }
    }

    showCopyIndicator(element, message, isError) {
        const indicator = document.createElement('div');
        indicator.className = `copy-indicator${isError ? ' error' : ''}`;
        indicator.textContent = message;

        const rect = element.getBoundingClientRect();
        indicator.style.position = 'fixed';
        indicator.style.left = `${rect.right + 10}px`;
        indicator.style.top = `${rect.top}px`;

        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.classList.add('fade-out');
            setTimeout(() => document.body.removeChild(indicator), 300);
        }, 1000);
    }

    generatePasswords() {
        const wordCount = parseInt(this.wordCountInput.value);
        const passwordCount = parseInt(this.passwordCountInput.value);
        const minLength = parseInt(this.minLengthInput.value);
        const maxLength = parseInt(this.maxLengthInput.value);
        const delimiter = this.delimiterInput.value;

        if (isNaN(wordCount) || isNaN(passwordCount) || isNaN(minLength) || isNaN(maxLength)) {
            console.error('Invalid input values');
            return;
        }

        this.passwordList.innerHTML = '';

        for (let i = 0; i < passwordCount; i++) {
            const words = [];
            const startLetters = validateLetterInput(this.startLetterInput.value);
            const endLetter = validateLetterInput(this.endLetterInput.value);

            for (let j = 0; j < wordCount; j++) {
                words.push(this.getRandomWord(minLength, maxLength, startLetters, endLetter));
            }

            const password = words.join(delimiter);
            const entropy = this.calculateEntropy(wordCount);

            const passwordElement = document.createElement('div');
            passwordElement.className = 'password-item';
            passwordElement.innerHTML = `
                <div>
                    <span class="password-text">${password}</span>
                    <span class="entropy-badge">${entropy} bits</span>
                </div>
            `;

            this.passwordList.appendChild(passwordElement);
            this.updateEntropyMeter(entropy);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});