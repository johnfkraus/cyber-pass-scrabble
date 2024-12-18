// Word filtering functions
function filterWordsByConstraints(words, startLetters, endLetters) {
    // Clean inputs
    startLetters = (startLetters || '').trim();
    endLetters = (endLetters || '').trim();
    
    if (!startLetters && !endLetters) {
        return words;
    }

    let filteredWords = [...words];
    
    // Apply start letter filter if specified
    if (startLetters) {
        const startLetterArray = startLetters.toLowerCase().split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);
            
        if (startLetterArray.length > 0) {
            filteredWords = filteredWords.filter(word => 
                startLetterArray.some(letter => word.toLowerCase().startsWith(letter))
            );
        }
    }
    
    // Apply end letter filter if specified
    if (endLetters) {
        const endLetterArray = endLetters.toLowerCase().split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);
            
        if (endLetterArray.length > 0) {
            filteredWords = filteredWords.filter(word => 
                endLetterArray.some(letter => word.toLowerCase().endsWith(letter))
            );
        }
    }
    
    return filteredWords;
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
