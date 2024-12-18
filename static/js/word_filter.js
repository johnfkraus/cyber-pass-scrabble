// Word filtering functions
function filterWordsByConstraints(words, startLetters, endLetters) {
    // Clean inputs
    startLetters = (startLetters || '').trim().toLowerCase();
    endLetters = (endLetters || '').trim().toLowerCase();
    
    if (!startLetters && !endLetters) {
        return words;
    }

    let filteredWords = [...words];
    
    // Apply start letter filter if specified
    if (startLetters) {
        const startLetterArray = startLetters.split(',')
            .map(l => l.trim())
            .filter(l => l.length === 1 && /^[a-z]$/.test(l));
            
        if (startLetterArray.length > 0) {
            const filtered = filteredWords.filter(word => {
                const lowercaseWord = word.toLowerCase();
                return startLetterArray.some(letter => lowercaseWord.startsWith(letter));
            });
            
            // Only update if we found matches
            if (filtered.length > 0) {
                filteredWords = filtered;
            } else {
                console.log('No matches found for start letters:', startLetters);
            }
        }
    }
    
    // Apply end letter filter if specified
    if (endLetters) {
        const endLetterArray = endLetters.split(',')
            .map(l => l.trim())
            .filter(l => l.length === 1 && /^[a-z]$/.test(l));
            
        if (endLetterArray.length > 0) {
            const filtered = filteredWords.filter(word => {
                const lowercaseWord = word.toLowerCase();
                return endLetterArray.some(letter => lowercaseWord.endsWith(letter));
            });
            
            // Only update if we found matches
            if (filtered.length > 0) {
                filteredWords = filtered;
            } else {
                console.log('No matches found for end letters:', endLetters);
            }
        }
    }
    
    return filteredWords.length > 0 ? filteredWords : words;
}

// Validate letter input
function validateLetterInput(input) {
    if (!input || typeof input !== 'string') return '';
    
    // Split by comma, trim whitespace, filter valid letters
    const letters = input.split(',')
        .map(letter => letter.trim())
        .filter(letter => /^[a-zA-Z]$/.test(letter));
        
    return letters.join(',');
}
