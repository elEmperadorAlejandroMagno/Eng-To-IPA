import { unifiedTranscriptionService } from './unifiedTranscriptionService.js';

/**
 * Validación simple de texto en inglés
 * @param {string} text - Texto a validar
 * @returns {boolean} True si el texto no está vacío
 */
function isValidEnglishText(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return Boolean(text.trim());
}

/**
 * Implementación del servicio de transcripción fonética IPA.
 * Especializado en Received Pronunciation (RP) y General American.
 * Ahora usa el servicio unificado internamente.
 */
export class PhoneticTranscriptionService {
  constructor() {
    this._unifiedService = unifiedTranscriptionService;
  }
  
  /**
   * Transcribe texto inglés a notación IPA.
   * @param {string} text - Texto en inglés para transcribir
   * @param {string} accent - Variante de acento ('rp' para Received Pronunciation, 'american' para General American)
   * @param {boolean} useWeakForms - Si aplicar formas débiles
   * @returns {string} Transcripción IPA del texto
   * @throws {Error} Si el texto está vacío, el acento no es soportado, o hay error en la transcripción
   */
  transcribeToIpa(text, accent = 'rp', useWeakForms = true) {
    try {
      // Validaciones
      if (!text || !text.trim()) {
        return '';
      }
      
      if (!this.isAccentSupported(accent)) {
        const supportedAccents = this.getSupportedAccents();
        throw new Error(`Accent '${accent}' not supported. Available accents: ${supportedAccents.join(', ')}`);
      }
      
      // Verificar que el texto parece ser inglés
      if (!isValidEnglishText(text)) {
        throw new Error('The text does not appear to be in English. IPA transcription requires English text.');
      }
      
      // Delegar al servicio unificado
      return this._unifiedService.transcribe(text, accent, useWeakForms);
        
    } catch (error) {
      // Re-throw validation errors as-is
      if (error.message.includes('not supported') || 
          error.message.includes('not appear to be') ||
          error.message.includes('not implemented')) {
        throw error;
      }
      
      // Wrap other errors
      throw new Error(`Error transcribing text: ${error.message}`);
    }
  }
  
  /**
   * Verifica si el acento especificado es soportado.
   * @param {string} accent - Código de acento a verificar
   * @returns {boolean} True si el acento es soportado, False en caso contrario
   */
  isAccentSupported(accent) {
    return this._unifiedService.isAccentSupported(accent);
  }
  
  /**
   * Obtiene la lista de variantes de acento soportadas.
   * @returns {Array<string>} Lista de códigos de acento soportados
   */
  getSupportedAccents() {
    return this._unifiedService.getSupportedAccents();
  }
  
  /**
   * Obtiene la descripción de un acento específico.
   * @param {string} accent - Código de acento
   * @returns {string} Descripción del acento
   */
  getAccentDescription(accent) {
    return this._unifiedService.getAccentDescription(accent);
  }
  
  /**
   * Método de conveniencia para transcripción RP.
   * @param {string} text - Texto a transcribir
   * @param {boolean} useWeakForms - Si usar formas débiles
   * @returns {string} Transcripción RP IPA
   */
  transcribeToRP(text, useWeakForms = true) {
    return this._unifiedService.transcribeToRP(text, useWeakForms);
  }
  
  /**
   * Método de conveniencia para transcripción American.
   * @param {string} text - Texto a transcribir
   * @param {boolean} useWeakForms - Si usar formas débiles
   * @returns {string} Transcripción American IPA
   */
  transcribeToAmerican(text, useWeakForms = true) {
    return this._unifiedService.transcribeToAmerican(text, useWeakForms);
  }
}

// Instancia global del servicio
export const phoneticTranscriptionService = new PhoneticTranscriptionService();

// Exportar función de conveniencia
export function transcribeText(text, accent = 'rp', useWeakForms = true) {
  return phoneticTranscriptionService.transcribeToIpa(text, accent, useWeakForms);
}