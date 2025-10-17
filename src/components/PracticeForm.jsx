import { useState } from 'react';
import './PracticeForm.css';

const PracticeForm = ({ onPractice }) => {
  const [inputText, setInputText] = useState('');
  const [ipaType, setIpaType] = useState('RP IPA');
  const [userAnswer, setUserAnswer] = useState('');

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
  };

  return (
    <div className="practice-form">
      <h1 className="title">Práctica de Transcripción IPA</h1>
      <p className="description">
        Introduce un texto en inglés, selecciona el tipo de IPA y escribe tu transcripción. 
        Los símbolos de estrés (ˈ ˌ) y las barras (/) serán ignorados en la comparación.
      </p>
      
      <form onSubmit={handleSubmit} className="form">
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
          />
        </div>

        {/* User Answer Input */}
        <div className="form-group">
          <label htmlFor="user-answer">Tu transcripción IPA:</label>
          <input
            type="text"
            id="user-answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe tu transcripción IPA aquí..."
            className="input"
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button 
            type="submit" 
            disabled={!inputText.trim() || !userAnswer.trim()}
            className="btn btn-primary"
          >
            Verificar Respuesta
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
    </div>
  );
};

export default PracticeForm;