import { useState } from 'react';
import { IPA_VIRTUAL_KEYBOARD_ROWS, IPA_VIRTUAL_KEYBOARD_SYMBOLS } from '../utils/ipaCharacters';
import '../css/IPAKeyboard.css';

const IPAKeyboard = ({ onCharacterSelect, isVisible, onClose, currentText = '' }) => {
  const [showSymbols, setShowSymbols] = useState(false);

  if (!isVisible) return null;

  const handleCharacterClick = (character) => {
    // Si es el botón especial '.?/', cambia a vista de símbolos
    if (character === '.?/') {
      setShowSymbols(true);
    } 
    // Si es el botón 'abc', vuelve al teclado principal
    else if (character === 'abc') {
      setShowSymbols(false);
    } 
    // Para cualquier otro carácter, insertarlo
    else {
      onCharacterSelect(character);
    }
  };

  return (
    <div className="ipa-keyboard-overlay">
      <div className="ipa-keyboard">
        {/* Header */}
        <div className="ipa-keyboard-header">
          <h3>Teclado Virtual IPA</h3>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar teclado"
          >
            ✕
          </button>
        </div>
        
        {/* Display Area */}
        <div className="ipa-keyboard-display">
          <label className="display-label">Texto actual:</label>
          <div className="display-text">
            {currentText || <span className="placeholder">Comienza a escribir...</span>}
          </div>
        </div>

        {/* Keyboard Rows */}
        <div className="ipa-keyboard-rows">
          {!showSymbols ? (
            // Main keyboard layout
            IPA_VIRTUAL_KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="keyboard-row">
                {row.map((char, charIndex) => (
                  <button
                    key={charIndex}
                    className={`keyboard-key ${char === '.?/' ? 'special-key' : ''}`}
                    onClick={() => handleCharacterClick(char)}
                    title={char === '.?/' ? 'Símbolos especiales' : char}
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))
          ) : (
            // Special symbols view
            IPA_VIRTUAL_KEYBOARD_SYMBOLS.map((row, rowIndex) => (
              <div key={rowIndex} className="keyboard-row">
                {row.map((char, charIndex) => (
                  <button
                    key={charIndex}
                    className={`keyboard-key symbol-key ${char === 'abc' ? 'special-key' : ''}`}
                    onClick={() => handleCharacterClick(char)}
                    title={char === 'abc' ? 'Volver al teclado principal' : char}
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Help Text */}
        <div className="ipa-keyboard-help">
          <p>
            💡 <strong>Tip:</strong> También puedes usar atajos de teclado. 
            Mantén presionado <kbd>Alt</kbd> o <kbd>Ctrl</kbd> + la tecla correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPAKeyboard;