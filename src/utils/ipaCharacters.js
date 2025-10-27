/**
 * IPA Character Sets and Keyboard Shortcuts
 * Comprehensive set of IPA characters for English transcription
 */

export const IPA_VIRTUAL_KEYBOARD_ROWS = [
  ['ɑ','ɜ','i','ɔ','u','ð','θ','ɹ','ɛ'],
  ['ə','w','e','r','t','ɪ','ʊ','ɒ','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['æ','z','ʒ','ʃ','ʌ','v','b','n','m'],
  [':.?/','SPACE','⌫']
]

export const IPA_VIRTUAL_KEYBOARD_SYMBOLS = [
  ['/','[',']','(',')','!'],
  ['ˈ','ˌ','ː','.','-','?'],
  ['əðc','SPACE','⌫']
]

//IPA Characters organized by category
export const IPA_CHARACTERS = {
  // Vowels - Monophthongs
  vowelsShort: [
    { char: 'ɪ', name: 'Near-close near-front unrounded vowel', shortcut: 'Alt+i' },
    { char: 'ʊ', name: 'Near-close near-back rounded vowel', shortcut: 'Alt+u' },
    { char: 'ʌ', name: 'Open-mid back unrounded vowel', shortcut: 'Alt+v' },
    { char: 'ɒ', name: 'Open back rounded vowel', shortcut: 'Alt+o' },
    { char: 'æ', name: 'Near-open front unrounded vowel', shortcut: 'Alt+a' },
    { char: 'ɛ', name: 'Open-mid front unrounded vowel', shortcut: 'Alt+e' },
    { char: 'ɜ', name: 'Open-mid central unrounded vowel', shortcut: 'Alt+e x2' },
    { char: 'ə', name: 'Mid central vowel (schwa)', shortcut: 'Alt+3' }
  ],
  
  vowelsLong: [
    { char: 'iː', name: 'Close front unrounded vowel (long)', shortcut: 'Alt+Shift+i' },
    { char: 'uː', name: 'Close back rounded vowel (long)', shortcut: 'Alt+Shift+u' },
    { char: 'ɑː', name: 'Open back unrounded vowel (long)', shortcut: 'Alt+Shift+a' },
    { char: 'ɔː', name: 'Open-mid back rounded vowel (long)', shortcut: 'Alt+Shift+o' },
    { char: 'ɜː', name: 'Open-mid central unrounded vowel (long)', shortcut: 'Alt+Shift+e' }
  ],

  // Diphthongs
  diphthongs: [
    { char: 'eɪ', name: 'Close-mid front to near-close near-front', shortcut: 'Alt+8' },
    { char: 'aɪ', name: 'Open front to near-close near-front', shortcut: 'Alt+y' },
    { char: 'ɔɪ', name: 'Open-mid back rounded to near-close near-front', shortcut: 'Alt+9' },
    { char: 'əʊ', name: 'Mid central to near-close near-back', shortcut: 'Alt+0' },
    { char: 'aʊ', name: 'Open front to near-close near-back', shortcut: 'Alt+w' },
    { char: 'ɪə', name: 'Near-close near-front to mid central', shortcut: 'Ctrl+i' },
    { char: 'eə', name: 'Close-mid front to mid central', shortcut: 'Ctrl+e' },
    { char: 'ʊə', name: 'Near-close near-back to mid central', shortcut: 'Ctrl+u' }
  ],

  // Consonants - Plosives
  consonantsPlosives: [
    { char: 'p', name: 'Voiceless bilabial plosive', shortcut: null },
    { char: 'b', name: 'Voiced bilabial plosive', shortcut: null },
    { char: 't', name: 'Voiceless alveolar plosive', shortcut: null },
    { char: 'd', name: 'Voiced alveolar plosive', shortcut: null },
    { char: 'k', name: 'Voiceless velar plosive', shortcut: null },
    { char: 'g', name: 'Voiced velar plosive', shortcut: null },
    { char: 'ʔ', name: 'Glottal stop', shortcut: 'Alt+?' }
  ],

  // Consonants - Fricatives
  consonantsFricatives: [
    { char: 'f', name: 'Voiceless labiodental fricative', shortcut: null },
    { char: 'v', name: 'Voiced labiodental fricative', shortcut: null },
    { char: 'θ', name: 'Voiceless dental fricative', shortcut: 'Alt+t' },
    { char: 'ð', name: 'Voiced dental fricative', shortcut: 'Alt+d' },
    { char: 's', name: 'Voiceless alveolar fricative', shortcut: null },
    { char: 'z', name: 'Voiced alveolar fricative', shortcut: null },
    { char: 'ʃ', name: 'Voiceless postalveolar fricative', shortcut: 'Alt+s' },
    { char: 'ʒ', name: 'Voiced postalveolar fricative', shortcut: 'Alt+z' },
    { char: 'h', name: 'Voiceless glottal fricative', shortcut: null }
  ],

  // Consonants - Affricates
  consonantsAffricates: [
    { char: 'tʃ', name: 'Voiceless postalveolar affricate', shortcut: 'Alt+c' },
    { char: 'dʒ', name: 'Voiced postalveolar affricate', shortcut: 'Alt+j' }
  ],

  // Consonants - Nasals
  consonantsNasals: [
    { char: 'm', name: 'Voiced bilabial nasal', shortcut: null },
    { char: 'n', name: 'Voiced alveolar nasal', shortcut: null },
    { char: 'ŋ', name: 'Voiced velar nasal', shortcut: 'Alt+n' }
  ],

  // Consonants - Liquids
  consonantsLiquids: [
    { char: 'l', name: 'Voiced alveolar lateral approximant', shortcut: null },
    { char: 'r', name: 'Voiced postalveolar approximant', shortcut: null },
    { char: 'ɹ', name: 'Voiced alveolar approximant', shortcut: 'Alt+r' }
  ],

  // Consonants - Glides
  consonantsGlides: [
    { char: 'w', name: 'Voiced labio-velar approximant', shortcut: null },
    { char: 'j', name: 'Voiced palatal approximant', shortcut: null }
  ],

  // Stress and Suprasegmentals
  stress: [
    { char: 'ˈ', name: 'Primary stress', shortcut: 'Alt+\'' },
    { char: 'ˌ', name: 'Secondary stress', shortcut: 'Alt+,' },
    { char: 'ː', name: 'Length mark', shortcut: 'Alt+:' }
  ],

  // Punctuation and Boundaries
  punctuation: [
    { char: '.', name: 'Syllable break', shortcut: null },
    { char: '/', name: 'Phonemic boundaries', shortcut: null },
    { char: '[', name: 'Phonetic transcription start', shortcut: null },
    { char: ']', name: 'Phonetic transcription end', shortcut: null }
  ]
};

// Keyboard shortcuts mapping for quick access
export const KEYBOARD_SHORTCUTS = {};

// Build shortcuts mapping
Object.values(IPA_CHARACTERS).forEach(category => {
  category.forEach(({ char, shortcut }) => {
    if (shortcut) {
      // Store exact shortcut preserving case
      KEYBOARD_SHORTCUTS[shortcut] = char;
    }
  });
});

// Common IPA character sequences for quick insertion
export const COMMON_SEQUENCES = [
  { sequence: 'iː', label: 'Long i', shortcut: 'Alt+I' },
  { sequence: 'uː', label: 'Long u', shortcut: 'Alt+U' },
  { sequence: 'ɑː', label: 'Long a', shortcut: 'Alt+A' },
  { sequence: 'ɔː', label: 'Long o', shortcut: 'Alt+O' },
  { sequence: 'ɜː', label: 'Long ə', shortcut: 'Alt+E' },
  { sequence: 'tʃ', label: 'ch sound', shortcut: 'Alt+c' },
  { sequence: 'dʒ', label: 'j sound', shortcut: 'Alt+j' }
];

// Helper function to get all characters as flat array
export const getAllIPACharacters = () => {
  const allChars = [];
  Object.values(IPA_CHARACTERS).forEach(category => {
    category.forEach(item => allChars.push(item));
  });
  return allChars;
};

// Helper function to get character by shortcut
export const getCharacterByShortcut = (shortcut) => {
  return KEYBOARD_SHORTCUTS[shortcut];
};

// Character alternates for double-tap functionality
export const CHARACTER_ALTERNATES = {
  'ɛ': 'ɜ', // ɛ -> ɜ (epsilon flipped)
  'ɜ': 'ɛ', // ɜ -> ɛ (back to epsilon)
};

// Helper function to get alternate character
export const getAlternateCharacter = (char) => {
  return CHARACTER_ALTERNATES[char] || null;
};

// Helper function to check if a key combination matches a shortcut
export const isIPAShortcut = (event) => {
  const key = event.key.toLowerCase();
  
  // Build shortcut string considering Shift key for capital letters
  let shortcut;
  if (event.altKey && event.shiftKey && /^[a-z]$/.test(key)) {
    // Alt + Shift + letter = Alt + CAPITAL_LETTER
    shortcut = `Alt+Shift+${key}`;
  } else {
    // Regular shortcut
    shortcut = `${event.altKey ? 'Alt+' : ''}${event.ctrlKey ? 'Ctrl+' : ''}${key}`;
  }
  
  return KEYBOARD_SHORTCUTS[shortcut];
};
