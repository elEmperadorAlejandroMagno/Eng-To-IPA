import { useState, useRef } from 'react';
import IPAKeyboard from './IPAKeyboard';
import { useIPAInput } from '../hooks/useIPAInput';
import '../css/IPAInput.css';

function IPAInput() {
  const [text, setText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showIPAKeyboard, setShowIPAKeyboard] = useState(false);
  
  // Ref for the textarea
  const textareaRef = useRef(null);
  
  // Use IPA input hook for keyboard shortcuts
  const { insertCharacter } = useIPAInput(textareaRef, setText, text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleClear = () => {
    setText('');
  };
  
  const toggleIPAKeyboard = () => {
    setShowIPAKeyboard(!showIPAKeyboard);
  };
  
  const handleIPACharacterSelect = (character) => {
    insertCharacter(character);
  };

  return (
    <div className="ipa-editor-container">
      <div className="ipa-editor-header">
        <h2 className="editor-title">Editor de texto IPA</h2>
        <button
          type="button"
          onClick={toggleIPAKeyboard}
          className="ipa-keyboard-toggle-editor"
          title="Abrir/cerrar teclado virtual IPA"
        >
          🔤 Teclado Virtual
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="ipa-editor-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe o pega texto IPA aquí... (usa atajos de teclado Alt+letra o el teclado virtual)"
      />
      <div className="ipa-editor-actions">
        <button 
          onClick={handleCopy}
          disabled={!text}
          className="ipa-editor-btn btn-copy"
          title="Copiar texto"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          {copySuccess && <span className="copy-tooltip">¡Copiado!</span>}
        </button>
        <button 
          onClick={handleClear}
          disabled={!text}
          className="ipa-editor-btn btn-clear"
          title="Limpiar texto"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      
      {/* IPA Virtual Keyboard */}
      <IPAKeyboard 
        isVisible={showIPAKeyboard}
        onCharacterSelect={handleIPACharacterSelect}
        onClose={() => setShowIPAKeyboard(false)}
        currentText={text}
      />
    </div>
  );
}

export default IPAInput;
