import { UNIFIED_DICTIONARY } from '../data/unifiedDictionary.js';
import textToIPAPackage from 'text-to-ipa';

// Inicializar la librería text-to-ipa
let isTextToIPALoaded = false;
let textToIPAAvailable = true;

function ensureTextToIPALoaded() {
  if (!isTextToIPALoaded && textToIPAAvailable) {
    try {
      textToIPAPackage.loadDict();
      isTextToIPALoaded = true;
    } catch (error) {
      console.warn('text-to-ipa library failed to load:', error.message);
      textToIPAAvailable = false;
    }
  }
}

/**
 * Obtiene la transcripción de una palabra desde el diccionario unificado
 * @param {string} word - Palabra a transcribir
 * @param {string} accent - 'rp' o 'american'
 * @param {boolean} useWeakForm - Si usar forma débil cuando esté disponible
 * @returns {string|null} Transcripción IPA o null si no está en el diccionario
 */
function getTranscriptionFromUnifiedDict(word, accent = 'rp', useWeakForm = true) {
  const wordClean = word.toLowerCase().trim();
  const cleanWord = wordClean.replace(/[^\w']/g, ''); // Mantener apostrofes para contracciones
  
  const entry = UNIFIED_DICTIONARY[cleanWord];
  if (!entry) {
    return null;
  }

  const accentData = entry[accent];
  if (!accentData) {
    return null;
  }

  // Si accentData es un string, devolver directamente
  if (typeof accentData === 'string') {
    return accentData;
  }

  // Si accentData es un objeto con strong/weak, decidir cuál usar
  if (typeof accentData === 'object' && accentData.strong) {
    // Determinar si usar forma débil
    if (useWeakForm && accentData.weak && shouldUseWeakFormBasic(cleanWord)) {
      return accentData.weak;
    } else {
      return accentData.strong;
    }
  }

  return null;
}

/**
 * Determina si una palabra debería usar su forma débil basado en reglas contextuales
 * @param {string} word - La palabra a evaluar
 * @param {number} wordIndex - Posición en el array de palabras
 * @param {Array<string>} allWords - Todas las palabras de la oración
 * @param {string} originalText - Texto original para contexto
 * @returns {boolean} True si debería usar forma débil
 */
function shouldUseWeakForm(word, wordIndex, allWords, originalText) {
  const lowerWord = word.toLowerCase().replace(/[^\w']/g, '');
  
  // Regla 1: Palabras que SIEMPRE son fuertes
  const alwaysStrong = ['i', 'my', 'may', 'might', 'ought', 'by', 'so', 'while'];
  if (alwaysStrong.includes(lowerWord)) {
    return false;
  }
  
  // Regla 2: Contracciones ya están en forma débil
  if (lowerWord.includes("'")) {
    return false;
  }
  
  // Regla 3: "the" se maneja especialmente (variación alofónica)
  if (lowerWord === 'the') {
    return false;
  }
  
  // Regla 4: Primera palabra de oración tiende a ser fuerte (excepto "the", "a", "an")
  if (wordIndex === 0) {
    const weakAtStart = ['the', 'a', 'an'];
    if (!weakAtStart.includes(lowerWord)) {
      return false; // Fuerte al inicio
    }
  }
  
  // Regla 5: Última palabra antes de pausa fuerte (coma, punto, etc.)
  if (wordIndex < allWords.length - 1) {
    const nextWord = allWords[wordIndex + 1];
    if (/^[.,!?;:]/.test(nextWord)) {
      return false; // Fuerte antes de pausa
    }
  }
  
  // Regla 6: Última palabra de oración tiende a ser fuerte
  if (wordIndex === allWords.length - 1 || 
      (wordIndex === allWords.length - 2 && /^[.,!?;:]/.test(allWords[allWords.length - 1]))) {
    return false; // Fuerte al final
  }
  
  // Regla 7: Auxiliares en preguntas (al inicio) son fuertes
  const auxiliaries = ['is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 
                      'will', 'would', 'can', 'could', 'should', 'must'];
  if (auxiliaries.includes(lowerWord) && wordIndex === 0) {
    return false; // Auxiliar fuerte en pregunta
  }
  
  // Regla 8: Palabras con énfasis (mayúsculas en texto original)
  const originalWord = originalText.split(/\s+/)[wordIndex];
  if (originalWord && /^[A-Z]/.test(originalWord) && lowerWord !== 'i' && wordIndex > 0) {
    return false; // Posible énfasis
  }
  
  // Regla 9: Por defecto usar forma débil en posiciones no prominentes
  return true;
}

/**
 * Función básica para compatibilidad
 * @param {string} word - Palabra
 * @returns {boolean} 
 */
function shouldUseWeakFormBasic(word) {
  return shouldUseWeakForm(word, 1, [word], word); // Posición media por defecto
}

/**
 * Lookup fallback usando text-to-ipa
 * @param {string} word - Palabra a transcribir
 * @param {string} accent - 'rp' o 'american'
 * @returns {string} Transcripción IPA o palabra original si falla
 */
function lookupWithTextToIPA(word, accent = 'rp') {
  ensureTextToIPALoaded();
  
  if (!textToIPAAvailable || !isTextToIPALoaded) {
    return word;
  }
  
  try {
    const result = textToIPAPackage.lookup(word.toLowerCase());
    
    if (result && result.text) {
      let ipaText = result.text;
      if (ipaText.includes(' OR ')) {
        ipaText = ipaText.split(' OR ')[0];
      }
      
      // Aplicar correcciones básicas según el acento
      return applyAccentCorrections(ipaText, accent);
    }
    
    return word;
  } catch (error) {
    console.warn(`text-to-ipa lookup failed for "${word}": ${error.message}`);
    return word;
  }
}

/**
 * Aplica correcciones básicas según el acento
 * @param {string} text - Texto IPA
 * @param {string} accent - 'rp' o 'american'  
 * @returns {string} Texto corregido
 */
function applyAccentCorrections(text, accent) {
  let corrected = text;
  
  // Limpieza básica
  corrected = corrected.replace(/ɹ/g, 'r'); // Usar r en lugar de ɹ
  corrected = corrected.replace(/ɛ/g, 'e'); // Usar e en lugar de ɛ
  corrected = corrected.replace(/ɐ/g, 'ə'); // Normalizar schwa
  
  if (accent === 'american') {
    // Correcciones específicas para American
    corrected = corrected.replace(/ɒ/g, 'ɑ');      // LOT vowel
    corrected = corrected.replace(/əʊ/g, 'oʊ');     // GOAT vowel
    corrected = corrected.replace(/ɪə/g, 'ɪr');     // NEAR
    corrected = corrected.replace(/eə/g, 'er');     // SQUARE
    corrected = corrected.replace(/ʊə/g, 'ʊr');     // CURE
    corrected = corrected.replace(/ɜː/g, 'ɜr');     // NURSE
    corrected = corrected.replace(/ɑː(\\s|$)/g, 'ɑr$1'); // Rótica
  }
  
  return corrected;
}

/**
 * Aplica variación alofónica a "the"
 * @param {string} transcription - Transcripción base
 * @returns {string} Transcripción con variación aplicada
 */
function applyTheVariation(transcription) {
  // "the" + vocal = /ði/
  // "the" + consonante = /ðə/
  const thePattern = /\bðə\s+([æɑɒɔʊu iɪeəʌɜaɪaʊɔɪɪəeəʊəɛ])/g;
  return transcription.replace(thePattern, 'ði $1');
}

/**
 * Detecta si una transcripción termina en vocal
 * @param {string} transcription - Transcripción IPA
 * @returns {boolean} True si termina en vocal
 */
function endsWithVowel(transcription) {
  if (!transcription) return false;
  
  // Vocales IPA comunes (simplificado y corregido)
  const vowelPattern = /[æɑɒɔʊuɪieoəʌɜɪaʊɔɪɛœ]ː?$/;
  return vowelPattern.test(transcription.trim());
}

/**
 * Detecta si una transcripción empieza con vocal
 * @param {string} transcription - Transcripción IPA
 * @returns {boolean} True si empieza con vocal
 */
function startsWithVowel(transcription) {
  if (!transcription) return false;
  
  const vowelPattern = /^[æɑɒɔʊʉuiɪeəʌɜoɘaɪaʊɔɪɜɟɨɪəeəʊəɛʎœɶɨɘɵɯɤɦɐʉɦɜɽɨɘɵɯɤ]/;
  return vowelPattern.test(transcription.trim());
}

/**
 * Aplica Linking R para RP basado en el spelling original de las palabras
 * @param {Array<string>} transcribedWords - Array de transcripciones
 * @param {Array<string>} originalWords - Array de palabras originales
 * @param {string} accent - Acento ('rp' o 'american')
 * @returns {Array<string>} Array con linking R aplicado
 */
function applyLinkingR(transcribedWords, originalWords, accent) {
  if (accent !== 'rp' || transcribedWords.length < 2 || originalWords.length !== transcribedWords.length) {
    return transcribedWords;
  }
  
  const result = [...transcribedWords];
  
  for (let i = 0; i < result.length - 1; i++) {
    const currentTranscription = result[i];
    const nextTranscription = result[i + 1];
    const currentOriginal = originalWords[i];
    const nextOriginal = originalWords[i + 1];
    
    // Saltar puntuación
    if (/^[.,!?;:'-]+$/.test(nextOriginal)) {
      continue;
    }
    
    // Aplicar linking R si:
    // 1. La palabra original termina en 'r' o tiene 'r' en la última sílaba
    // 2. La transcripción actual termina en vocal
    // 3. La siguiente transcripción empieza con vocal
    const originalEndsInR = /r\w*$/i.test(currentOriginal) || /\w*r$/i.test(currentOriginal);
    
    if (originalEndsInR && 
        endsWithVowel(currentTranscription) && 
        startsWithVowel(nextTranscription)) {
      
      // Excepciones donde NO aplicar linking R
      const exceptions = ['more', 'sure', 'pure']; // Palabras que ya tienen R en RP
      const cleanOriginal = currentOriginal.toLowerCase().replace(/[^\w]/g, '');
      
      if (!exceptions.includes(cleanOriginal) && !currentTranscription.endsWith('r')) {
        result[i] = currentTranscription + 'r';
      }
    }
  }
  
  return result;
}

/**
 * Servicio unificado de transcripción IPA
 */
export class UnifiedTranscriptionService {
  constructor() {
    this.supportedAccents = ['rp', 'american'];
  }

  /**
   * Transcribe texto inglés a notación IPA
   * @param {string} text - Texto en inglés para transcribir
   * @param {string} accent - Variante de acento ('rp' o 'american')
   * @param {boolean} useWeakForms - Si aplicar formas débiles
   * @returns {string} Transcripción IPA del texto
   */
  transcribe(text, accent = 'rp', useWeakForms = true) {
    if (!text || !text.trim()) {
      return '';
    }

    if (!this.isAccentSupported(accent)) {
      throw new Error(`Accent '${accent}' not supported. Available accents: ${this.supportedAccents.join(', ')}`);
    }

    // Procesar línea por línea
    const lines = text.split('\n');
    const transcribedLines = [];

    for (const line of lines) {
      if (!line.trim()) {
        transcribedLines.push('');
        continue;
      }

      try {
        const transcribedLine = this._transcribeLine(line.trim(), accent, useWeakForms);
        transcribedLines.push(transcribedLine);
      } catch (error) {
        throw new Error(`Error in ${accent} IPA transcription: ${error.message}`);
      }
    }

    let result = transcribedLines.join('\n');
    
    // Aplicar variación alofónica para "the"
    result = applyTheVariation(result);
    
    // Aplicar transformaciones de símbolos para RP
    if (accent === 'rp') {
      result = this._applyRPSymbolTransforms(result);
    }

    return result;
  }

  /**
   * Transcribe una línea de texto
   * @param {string} line - Línea a transcribir
   * @param {string} accent - Acento a usar
   * @param {boolean} useWeakForms - Si usar formas débiles
   * @returns {string} Línea transcrita
   */
  _transcribeLine(line, accent, useWeakForms) {
    if (!line) return '';

    // Dividir en palabras, preservando puntuación y contracciones
    const words = line.match(/\b\w+'\w+\b|\b\w+\b|[.,!?;:'-]/g) || [];
    const transcribedWords = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      if (/^[.,!?;:'-]+$/.test(word)) {
        // Solo puntuación, mantener
        transcribedWords.push(word);
      } else {
        // Es palabra, determinar si usar forma débil con contexto completo
        let useWeakFormForThisWord = useWeakForms;
        
        if (useWeakForms) {
          useWeakFormForThisWord = shouldUseWeakForm(word, i, words, line);
        }
        
        // Buscar en diccionario unificado primero
        const dictTranscription = getTranscriptionFromUnifiedDict(word, accent, useWeakFormForThisWord);
        if (dictTranscription) {
          transcribedWords.push(dictTranscription);
        } else {
          // Fallback a text-to-ipa
          const lookupResult = lookupWithTextToIPA(word, accent);
          transcribedWords.push(lookupResult);
        }
      }
    }

    // Aplicar Linking R (solo para RP) - pasar tanto transcripciones como palabras originales
    let finalWords = applyLinkingR(transcribedWords, words, accent);

    // Unir y limpiar
    let result = finalWords.join(' ');
    result = result.replace(/\s+([.,!?;:'-])/g, '$1');
    result = result.replace(/\s{2,}/g, ' ').trim();

    return result;
  }

  /**
   * Aplica transformaciones de símbolos para RP
   * @param {string} text - Texto IPA
   * @returns {string} Texto con símbolos transformados
   */
  _applyRPSymbolTransforms(text) {
    let transformed = text;
    
    // Transformar símbolos según las reglas específicas
    transformed = transformed.replace(/!/g, '(!)');
    transformed = transformed.replace(/\?/g, '(?)');
    transformed = transformed.replace(/\./g, ' //');
    transformed = transformed.replace(/,/g, ' /');
    
    return transformed;
  }

  /**
   * Verifica si el acento es soportado
   * @param {string} accent - Código de acento
   * @returns {boolean} True si es soportado
   */
  isAccentSupported(accent) {
    return this.supportedAccents.includes(accent.toLowerCase());
  }

  /**
   * Obtiene los acentos soportados
   * @returns {Array<string>} Lista de acentos soportados
   */
  getSupportedAccents() {
    return [...this.supportedAccents];
  }

  /**
   * Obtiene la descripción de un acento
   * @param {string} accent - Código de acento
   * @returns {string} Descripción del acento
   */
  getAccentDescription(accent) {
    const descriptions = {
      'rp': 'Received Pronunciation (British Standard)',
      'american': 'General American (American Standard)'
    };
    
    return descriptions[accent.toLowerCase()] || `Unknown accent: ${accent}`;
  }

  /**
   * Método de conveniencia para transcripción RP
   * @param {string} text - Texto a transcribir
   * @param {boolean} useWeakForms - Si usar formas débiles
   * @returns {string} Transcripción RP IPA
   */
  transcribeToRP(text, useWeakForms = true) {
    return this.transcribe(text, 'rp', useWeakForms);
  }

  /**
   * Método de conveniencia para transcripción American
   * @param {string} text - Texto a transcribir
   * @param {boolean} useWeakForms - Si usar formas débiles
   * @returns {string} Transcripción American IPA
   */
  transcribeToAmerican(text, useWeakForms = true) {
    return this.transcribe(text, 'american', useWeakForms);
  }
}

// Instancia global del servicio
export const unifiedTranscriptionService = new UnifiedTranscriptionService();

// Función de conveniencia
export function transcribeText(text, accent = 'rp', useWeakForms = true) {
  return unifiedTranscriptionService.transcribe(text, accent, useWeakForms);
}