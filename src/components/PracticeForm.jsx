import { useState, useRef } from 'react';
import IPAKeyboard from './IPAKeyboard';
import { useIPAInput } from '../hooks/useIPAInput';
import { useIsMobile } from '../hooks/useIsMobile';
import '../css/PracticeForm.css';

const PracticeForm = ({ onPractice, isLoading = false, inputRef }) => {
  const [inputText, setInputText] = useState('');
  const [ipaType, setIpaType] = useState('RP IPA');
  const [userAnswer, setUserAnswer] = useState('');
  const [showIPAKeyboard, setShowIPAKeyboard] = useState(false);
  const isMobile = useIsMobile();
  
  // Ref for the IPA input field - create local ref and use external if provided
  const localInputRef = useRef(null);
  const ipaInputRef = inputRef || localInputRef;
  
  // Use IPA input hook for keyboard shortcuts
  const { insertCharacter } = useIPAInput(ipaInputRef, setUserAnswer, userAnswer);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && userAnswer.trim()) {
      onPractice(inputText, ipaType, userAnswer);
    }
  };

  const handleClear = () => {
    setInputText('');
    setIpaType('RP IPA');
    setUserAnswer('');
    setShowIPAKeyboard(false);
  };
  
  const toggleIPAKeyboard = () => {
    setShowIPAKeyboard(!showIPAKeyboard);
  };
  
  const handleIPACharacterSelect = (character) => {
    if (character === 'BACKSPACE') {
      setUserAnswer((prev) => prev.slice(0, -1));
    } else {
      insertCharacter(character);
    }
  };

  return (
    <div className="practice-form">
      <h1 className="title">Práctica de Transcripción IPA</h1>
      <p className="description">
        Introduce un texto en inglés, selecciona el tipo de IPA y escribe tu transcripción. 
        Usa la referencia del panel izquierdo, atajos de teclado o el teclado virtual. 
        Los símbolos de estrés (ˈ ˌ) y las barras (/) serán ignorados en la comparación.
      </p>
      
      <form onSubmit={handleSubmit} className="form" aria-busy={isLoading}>
        {/* IPA Type Selection */}
        <div className="form-group">
          <label htmlFor="ipa-type">Selecciona el tipo de IPA:</label>
          <select 
            id="ipa-type"
            value={ipaType}
            onChange={(e) => setIpaType(e.target.value)}
            className="select"
          >
            <option value="RP IPA">RP IPA</option>
            <option value="AMERICAN IPA">AMERICAN IPA</option>
          </select>
        </div>

        {/* Input Text */}
        <div className="form-group">
          <label htmlFor="input-text">Texto en inglés:</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Introduce el texto en inglés que quieres transcribir..."
            rows={4}
            className="textarea"
            disabled={isLoading}
          />
        </div>

        {/* User Answer Input */}
        <div className="form-group">
          <label htmlFor="user-answer">
            Tu transcripción IPA:
            <span className="ipa-help-text">
              💡 Panel izquierdo (clic), <kbd>Alt</kbd>+letra (æ), <kbd>Alt+Shift</kbd>+letra (ɑː), doble pulsación ɛ↔ɜ, teclado virtual
            </span>
          </label>
          <div className="ipa-input-container">
            <input
              type="text"
              id="user-answer"
              ref={ipaInputRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Escribe tu transcripción IPA aquí... (usa atajos de teclado o el teclado virtual)"
              className="input ipa-input"
              disabled={isLoading}
              readOnly={isMobile}
              inputMode={isMobile ? 'none' : 'text'}
            />
            <button
              type="button"
              onClick={toggleIPAKeyboard}
              className="ipa-keyboard-toggle"
              title="Abrir/cerrar teclado virtual IPA"
              disabled={isLoading}
            >
              🔤
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button 
            type="submit" 
            disabled={!inputText.trim() || !userAnswer.trim() || isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Verificando...' : 'Verificar Respuesta'}
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Limpiar Todo
          </button>
        </div>
      </form>
      
      {/* IPA Virtual Keyboard */}
      <IPAKeyboard 
        isVisible={showIPAKeyboard}
        onCharacterSelect={handleIPACharacterSelect}
        onClose={() => setShowIPAKeyboard(false)}
        currentText={userAnswer}
      />
    </div>
  );
};

export default PracticeForm;
