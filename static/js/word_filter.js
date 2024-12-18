// Word filtering functions
function filterWordsByConstraints(words, startLetters, endLetters) {
    // Clean and validate inputs
    startLetters = (startLetters || '').trim().toLowerCase();
    endLetters = (endLetters || '').trim().toLowerCase();
    
    // Early return if no constraints
    if (!startLetters && !endLetters) {
        console.log('No letter constraints provided, returning all words');
        return words;
    }

    // Create a copy of the word list
    let filteredWords = Array.from(words);
    console.log(`Starting word filter with ${filteredWords.length} words`);
    
    // Process start letters if provided
    if (startLetters) {
        const startLetterArray = startLetters.split(',')
            .map(l => l.trim())
            .filter(l => l.length === 1 && /^[a-z]$/.test(l));
            
        if (startLetterArray.length > 0) {
            console.log(`Filtering for words starting with: ${startLetterArray.join(', ')}`);
            const filtered = filteredWords.filter(word => {
                const lowercaseWord = word.toLowerCase();
                return startLetterArray.some(letter => lowercaseWord.startsWith(letter));
            });
            
            if (filtered.length > 0) {
                console.log(`Found ${filtered.length} words matching start letter criteria`);
                filteredWords = filtered;
            } else {
                console.warn(`No words found starting with ${startLetterArray.join(', ')}`);
                return words; // Return original list if no matches
            }
        } else {
            console.warn('Invalid start letters provided, ignoring constraint');
        }
    }
    
    // Process end letters if provided
    if (endLetters) {
        const endLetterArray = endLetters.split(',')
            .map(l => l.trim())
            .filter(l => l.length === 1 && /^[a-z]$/.test(l));
            
        if (endLetterArray.length > 0) {
            console.log(`Filtering for words ending with: ${endLetterArray.join(', ')}`);
            const filtered = filteredWords.filter(word => {
                const lowercaseWord = word.toLowerCase();
                return endLetterArray.some(letter => lowercaseWord.endsWith(letter));
            });
            
            if (filtered.length > 0) {
                console.log(`Found ${filtered.length} words matching end letter criteria`);
                filteredWords = filtered;
            } else {
                console.warn(`No words found ending with ${endLetterArray.join(', ')}`);
                return words; // Return original list if no matches
            }
        } else {
            console.warn('Invalid end letters provided, ignoring constraint');
        }
    }
    
    // Return filtered results if we have any, otherwise return original list
    const finalCount = filteredWords.length;
    console.log(`Final word count after filtering: ${finalCount}`);
    return finalCount > 0 ? filteredWords : words;
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
