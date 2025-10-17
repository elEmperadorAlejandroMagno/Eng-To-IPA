// Diccionario unificado de transcripción IPA
// Formato: 
// { palabra: { 
//     rp: { strong: "forma_fuerte", weak: "forma_débil" }, 
//     american: { strong: "forma_fuerte", weak: "forma_débil" } 
//   } 
// }
// O para palabras sin formas débiles:
// { palabra: { rp: "transcripción", american: "transcripción" } }

export const UNIFIED_DICTIONARY = {
  // ARTÍCULOS
  "a": {
    rp: { strong: "eɪ", weak: "ə" },
    american: { strong: "eɪ", weak: "ə" }
  },
  "an": {
    rp: { strong: "æn", weak: "ən" },
    american: { strong: "æn", weak: "ən" }
  },
  "the": {
    rp: "ðə",      // Se maneja especialmente (ðə/ði según contexto)
    american: "ðə"
  },

  // PRONOMBRES BÁSICOS
  "I": {
    rp: "aɪ",
    american: "aɪ"
  },
  "i": {
    rp: "aɪ",
    american: "aɪ"
  },
  "you": {
    rp: { strong: "juː", weak: "jə" },
    american: { strong: "juː", weak: "jə" }
  },
  "he": {
    rp: { strong: "hiː", weak: "hi" },
    american: { strong: "hiː", weak: "hi" }
  },
  "she": {
    rp: { strong: "ʃiː", weak: "ʃi" },
    american: { strong: "ʃiː", weak: "ʃi" }
  },
  "it": {
    rp: "ɪt",
    american: "ɪt"
  },
  "we": {
    rp: { strong: "wiː", weak: "wi" },
    american: { strong: "wiː", weak: "wi" }
  },
  "they": {
    rp: "ðeɪ",
    american: "ðeɪ"
  },
  
  // PRONOMBRES OBJETO
  "me": {
    rp: { strong: "miː", weak: "mi" },
    american: { strong: "miː", weak: "mi" }
  },
  "him": {
    rp: { strong: "hɪm", weak: "ɪm" },
    american: { strong: "hɪm", weak: "ɪm" }
  },
  "her": {
    rp: { strong: "hɜː", weak: "hə" },
    american: { strong: "hɜr", weak: "hər" }
  },
  "us": {
    rp: { strong: "ʌs", weak: "əs" },
    american: { strong: "ʌs", weak: "əs" }
  },
  "them": {
    rp: { strong: "ðem", weak: "ðəm" },
    american: { strong: "ðem", weak: "ðəm" }
  },

  // AUXILIARES - BE
  "am": {
    rp: { strong: "æm", weak: "əm" },
    american: { strong: "æm", weak: "əm" }
  },
  "is": {
    rp: { strong: "ɪz", weak: "s" },
    american: { strong: "ɪz", weak: "s" }
  },
  "are": {
    rp: { strong: "ɑː", weak: "ə" },
    american: { strong: "ɑr", weak: "ər" }
  },
  "was": {
    rp: { strong: "wɒz", weak: "wəz" },
    american: { strong: "wʌz", weak: "wəz" }
  },
  "were": {
    rp: { strong: "wɜː", weak: "wə" },
    american: { strong: "wɜr", weak: "wər" }
  },
  "be": {
    rp: "biː",
    american: "biː"
  },
  "been": {
    rp: "biːn",
    american: "biːn"
  },

  // AUXILIARES - HAVE
  "have": {
    rp: { strong: "hæv", weak: "əv" },
    american: { strong: "hæv", weak: "əv" }
  },
  "has": {
    rp: { strong: "hæz", weak: "əz" },
    american: { strong: "hæz", weak: "əz" }
  },
  "had": {
    rp: { strong: "hæd", weak: "əd" },
    american: { strong: "hæd", weak: "əd" }
  },

  // AUXILIARES - DO
  "do": {
    rp: { strong: "duː", weak: "də" },
    american: { strong: "duː", weak: "də" }
  },
  "does": {
    rp: "dʌz",
    american: "dʌz"
  },
  "did": {
    rp: "dɪd",
    american: "dɪd"
  },

  // MODALES
  "will": {
    rp: { strong: "wɪl", weak: "əl" },
    american: { strong: "wɪl", weak: "əl" }
  },
  "would": {
    rp: { strong: "wʊd", weak: "əd" },
    american: { strong: "wʊd", weak: "əd" }
  },
  "can": {
    rp: { strong: "kæn", weak: "kən" },
    american: { strong: "kæn", weak: "kən" }
  },
  "could": {
    rp: "kʊd",
    american: "kʊd"
  },
  "should": {
    rp: "ʃʊd",
    american: "ʃʊd"
  },
  "must": {
    rp: { strong: "mʌst", weak: "məst" },
    american: { strong: "mʌst", weak: "məst" }
  },

  // PREPOSICIONES
  "of": {
    rp: { strong: "ɒv", weak: "əv" },
    american: { strong: "ʌv", weak: "əv" }
  },
  "to": {
    rp: { strong: "tuː", weak: "tə" },
    american: { strong: "tuː", weak: "tə" }
  },
  "for": {
    rp: { strong: "fɔː", weak: "fə" },
    american: { strong: "fɔr", weak: "fər" }
  },
  "from": {
    rp: { strong: "frɒm", weak: "frəm" },
    american: { strong: "frʌm", weak: "frəm" }
  },
  "at": {
    rp: { strong: "æt", weak: "ət" },
    american: { strong: "æt", weak: "ət" }
  },
  "in": {
    rp: "ɪn",
    american: "ɪn"
  },
  "on": {
    rp: "ɒn",
    american: "ɑn"
  },
  "with": {
    rp: "wɪð",
    american: "wɪð"
  },

  // CONJUNCIONES
  "and": {
    rp: { strong: "ænd", weak: "ən" },
    american: { strong: "ænd", weak: "ən" }
  },
  "or": {
    rp: { strong: "ɔː", weak: "ə" },
    american: { strong: "ɔr", weak: "ər" }
  },
  "but": {
    rp: { strong: "bʌt", weak: "bət" },
    american: { strong: "bʌt", weak: "bət" }
  },
  "that": {
    rp: { strong: "ðæt", weak: "ðət" },
    american: { strong: "ðæt", weak: "ðət" }
  },
  "as": {
    rp: { strong: "æz", weak: "əz" },
    american: { strong: "æz", weak: "əz" }
  },

  // CONTRACCIONES
  "i'm": {
    rp: "aɪm",
    american: "aɪm"
  },
  "you're": {
    rp: "jʊə",
    american: "jʊr"
  },
  "he's": {
    rp: "hiːz", 
    american: "hiːz"
  },
  "she's": {
    rp: "ʃiːz",
    american: "ʃiːz"
  },
  "it's": {
    rp: "ɪts",
    american: "ɪts"
  },
  "we're": {
    rp: "wɪə",
    american: "wɪr"
  },
  "they're": {
    rp: "ðeə",
    american: "ðer"
  },
  "i've": {
    rp: "aɪv",
    american: "aɪv"
  },
  "you've": {
    rp: "juːv",
    american: "juːv"
  },
  "we've": {
    rp: "wiːv",
    american: "wiːv"
  },
  "they've": {
    rp: "ðeɪv",
    american: "ðeɪv"
  },
  "i'll": {
    rp: "aɪl",
    american: "aɪl"
  },
  "you'll": {
    rp: "juːl",
    american: "juːl"
  },
  "he'll": {
    rp: "hiːl",
    american: "hiːl"
  },
  "she'll": {
    rp: "ʃiːl",
    american: "ʃiːl"
  },
  "it'll": {
    rp: "ɪtəl",
    american: "ɪtəl"
  },
  "we'll": {
    rp: "wiːl",
    american: "wiːl"
  },
  "they'll": {
    rp: "ðeɪl",
    american: "ðeɪl"
  },
  "won't": {
    rp: "wəʊnt",
    american: "woʊnt"
  },
  "can't": {
    rp: "kɑːnt",
    american: "kænt"
  },
  "couldn't": {
    rp: "kʊdənt",
    american: "kʊdənt"
  },
  "shouldn't": {
    rp: "ʃʊdənt",
    american: "ʃʊdənt"
  },
  "wouldn't": {
    rp: "wʊdənt",
    american: "wʊdənt"
  },
  "don't": {
    rp: "dəʊnt",
    american: "doʊnt"
  },
  "doesn't": {
    rp: "dʌzənt",
    american: "dʌzənt"
  },
  "didn't": {
    rp: "dɪdənt",
    american: "dɪdənt"
  },
  "haven't": {
    rp: "hævənt",
    american: "hævənt"
  },
  "hasn't": {
    rp: "hæzənt",
    american: "hæzənt"
  },
  "hadn't": {
    rp: "hædənt",
    american: "hædənt"
  },
  "isn't": {
    rp: "ɪzənt",
    american: "ɪzənt"
  },
  "aren't": {
    rp: "ɑːnt",
    american: "ɑrnt"
  },
  "wasn't": {
    rp: "wɒzənt",
    american: "wʌzənt"
  },
  "weren't": {
    rp: "wɜːnt",
    american: "wɜrnt"
  },

  // PALABRAS COMUNES CON DIFERENCIAS RP/AMERICAN
  "hello": {
    rp: "həˈləʊ",
    american: "həˈloʊ"
  },
  "world": {
    rp: "wɜːld",
    american: "wɜrld"
  },
  "car": {
    rp: "kɑː",
    american: "kɑr"
  },
  "park": {
    rp: "pɑːk",
    american: "pɑrk"
  },
  "start": {
    rp: "stɑːt",
    american: "stɑrt"
  },
  "learning": {
    rp: "ˈlɜːnɪŋ",
    american: "ˈlɜrnɪŋ"
  },
  "water": {
    rp: "ˈwɔːtə",
    american: "ˈwɔtər"
  },
  "after": {
    rp: "ˈɑːftə",
    american: "ˈæftər"
  },
  "dance": {
    rp: "dɑːns",
    american: "dæns"
  },
  "path": {
    rp: "pɑːθ",
    american: "pæθ"
  },
  "ask": {
    rp: "ɑːsk",
    american: "æsk"
  },
  "answer": {
    rp: "ˈɑːnsə",
    american: "ˈænsər"
  },
  "class": {
    rp: "klɑːs",
    american: "klæs"
  },
  "fast": {
    rp: "fɑːst",
    american: "fæst"
  },
  "last": {
    rp: "lɑːst",
    american: "læst"
  },

  // LOT words (RP /ɒ/ vs American /ɑ/)
  "hot": {
    rp: "hɒt",
    american: "hɑt"
  },
  "got": {
    rp: "ɡɒt",
    american: "ɡɑt"
  },
  "lot": {
    rp: "lɒt",
    american: "lɑt"
  },
  "not": {
    rp: "nɒt",
    american: "nɑt"
  },
  "stop": {
    rp: "stɒp",
    american: "stɑp"
  },
  "top": {
    rp: "tɒp",
    american: "tɑp"
  },

  // GOAT words (RP /əʊ/ vs American /oʊ/)
  "go": {
    rp: "ɡəʊ",
    american: "ɡoʊ"
  },
  "no": {
    rp: "nəʊ",
    american: "noʊ"
  },
  "so": {
    rp: "səʊ",
    american: "soʊ"
  },
  "home": {
    rp: "həʊm",
    american: "hoʊm"
  },
  "phone": {
    rp: "fəʊn",
    american: "foʊn"
  },

  // Rótica vs no rótica
  "here": {
    rp: "hɪə",
    american: "hɪr"
  },
  "there": {
    rp: "ðeə",
    american: "ðer"
  },
  "where": {
    rp: "weə",
    american: "wer"
  },
  "care": {
    rp: "keə",
    american: "ker"
  },
  "hair": {
    rp: "heə",
    american: "her"
  },
  "year": {
    rp: "jɪə",
    american: "jɪr"
  },
  "near": {
    rp: "nɪə",
    american: "nɪr"
  },

  // PALABRAS BÁSICAS
  "cat": {
    rp: "kæt",
    american: "kæt"
  },
  "happy": {
    rp: "ˈhæpi",
    american: "ˈhæpi"
  },
  "test": {
    rp: "test",
    american: "test"
  },
  "great": {
    rp: "ɡreɪt",
    american: "ɡreɪt"
  },
  "right": {
    rp: "raɪt",
    american: "raɪt"
  },
  "good": {
    rp: "ɡʊd",
    american: "ɡʊd"
  },
  "book": {
    rp: "bʊk",
    american: "bʊk"
  },
  "look": {
    rp: "lʊk",
    american: "lʊk"
  },
  "see": {
    rp: "siː",
    american: "siː"
  },
  "get": {
    rp: "ɡet",
    american: "ɡet"
  },
  "come": {
    rp: "kʌm",
    american: "kʌm"
  },
  "time": {
    rp: "taɪm",
    american: "taɪm"
  },
  "day": {
    rp: "deɪ",
    american: "deɪ"
  },
  "way": {
    rp: "weɪ",
    american: "weɪ"
  },
  "new": {
    rp: "njuː",
    american: "nuː"
  },
  "first": {
    rp: "fɜːst",
    american: "fɜrst"
  },
  "work": {
    rp: "wɜːk",
    american: "wɜrk"
  },
  "word": {
    rp: "wɜːd",
    american: "wɜrd"
  }
};