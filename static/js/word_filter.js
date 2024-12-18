// Word filtering functions
function filterWordsByConstraints(words, startLetters, endLetter) {
    return words.filter(word => {
        // Handle multiple start letters (comma-separated)
        const startLetterArray = startLetters ? startLetters.toLowerCase().split(',').map(l => l.trim()) : [];
        const matchesStart = !startLetters || startLetterArray.some(letter => word.toLowerCase().startsWith(letter));
        const matchesEnd = !endLetter || word.toLowerCase().endsWith(endLetter.toLowerCase());
        return matchesStart && matchesEnd;
    });
}

// Validate letter input
function validateLetterInput(input) {
    if (!input) return '';
    // Split by comma, trim whitespace, filter valid letters
    return input.split(',')
        .map(letter => letter.trim())
        .filter(letter => /^[a-zA-Z]$/.test(letter))
        .join(',');
}
