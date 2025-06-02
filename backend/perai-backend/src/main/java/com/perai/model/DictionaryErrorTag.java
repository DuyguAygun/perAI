package com.perai.model;

public enum DictionaryErrorTag {
    SPELLING_ERROR,      // Misspelled the word
    GRAMMAR_ERROR,       // Incorrect grammar usage
    PRONUNCIATION_ERROR, // Mispronounced the word
    FORGOT_MEANING,      // Forgot the meaning of the word
    FORGOT_USAGE,        // Forgot how to use the word in a sentence
    WRONG_CONTEXT,       // Used the word in an incorrect context
    TYPO,                // Made a simple typo
    MISHEARD_WORD,       // Misheard the word when listening
    CONFUSED_SIMILAR_WORDS, // Confused with a similar-sounding or looking word
    OTHER                // Any other type of error
}