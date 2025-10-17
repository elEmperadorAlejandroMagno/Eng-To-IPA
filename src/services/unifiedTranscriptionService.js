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
 * Determina si una palabra debería usar su forma débil (lógica simplificada)
 * @param {string} word - La palabra a evaluar
 * @returns {boolean} True si debería usar forma débil
 */
function shouldUseWeakFormBasic(word) {
  // Palabras que típicamente permanecen fuertes
  const typicallyStrong = ['i', 'my', 'may', 'might', 'ought', 'by', 'so', 'while'];
  if (typicallyStrong.includes(word)) {
    return false;
  }

  // Contracciones ya están en forma débil
  if (word.includes("'")) {
    return false;
  }

  // "the" se maneja especialmente
  if (word === 'the') {
    return false;
  }

  // Por defecto, usar forma débil para un inglés más natural
  return true;
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
  const thePattern = /\bðə\s+([æɑɒɔʊuiɪeəʌɜaɪaʊɔɪəeəʊɛ])/g;
  return transcription.replace(thePattern, 'ði $1');
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

    for (const word of words) {
      if (/^[.,!?;:'-]+$/.test(word)) {
        // Solo puntuación, mantener
        transcribedWords.push(word);
      } else {
        // Es palabra, buscar en diccionario unificado primero
        const dictTranscription = getTranscriptionFromUnifiedDict(word, accent, useWeakForms);
        if (dictTranscription) {
          transcribedWords.push(dictTranscription);
        } else {
          // Fallback a text-to-ipa
          const lookupResult = lookupWithTextToIPA(word, accent);
          transcribedWords.push(lookupResult);
        }
      }
    }

    // Unir y limpiar
    let result = transcribedWords.join(' ');
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