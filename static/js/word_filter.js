// Word filtering functions
function filterWordsByConstraints(words, startLetters, endLetters) {
    // Clean inputs
    startLetters = (startLetters || '').trim();
    endLetters = (endLetters || '').trim();
    
    if (!startLetters && !endLetters) {
        return words;
    }

    return words.filter(word => {
        word = word.toLowerCase();
        
        // Check start letters (if any)
        if (startLetters) {
            const startLetterArray = startLetters.toLowerCase().split(',')
                .map(l => l.trim())
                .filter(l => l.length > 0);
                
            if (startLetterArray.length > 0 && 
                !startLetterArray.some(letter => word.startsWith(letter))) {
                return false;
            }
        }
        
        // Check end letters (if any)
        if (endLetters) {
            const endLetterArray = endLetters.toLowerCase().split(',')
                .map(l => l.trim())
                .filter(l => l.length > 0);
                
            if (endLetterArray.length > 0 && 
                !endLetterArray.some(letter => word.endsWith(letter))) {
                return false;
            }
        }
        
        return true;
    });
}

// Validate letter input
function validateLetterInput(input) {
    if (!input || typeof input !== 'string') return '';
    
    if (input.includes(',')) {
        // Handle multiple letters (for start letters)
        return input.split(',')
            .map(letter => letter.trim())
            .filter(letter => /^[a-zA-Z]$/.test(letter))
            .join(',');
    } else {
        // Handle single letter (for end letter)
        const letter = input.trim();
        return /^[a-zA-Z]$/.test(letter) ? letter : '';
    }
}
