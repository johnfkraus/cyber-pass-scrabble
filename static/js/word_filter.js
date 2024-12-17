// Word filtering functions
function filterWordsByConstraints(words, startLetter, endLetter) {
    return words.filter(word => {
        const matchesStart = !startLetter || word.toLowerCase().startsWith(startLetter.toLowerCase());
        const matchesEnd = !endLetter || word.toLowerCase().endsWith(endLetter.toLowerCase());
        return matchesStart && matchesEnd;
    });
}

// Validate letter input
function validateLetterInput(input) {
    if (!input) return '';
    const letter = input.trim().charAt(0);
    return /^[a-zA-Z]$/.test(letter) ? letter : '';
}
