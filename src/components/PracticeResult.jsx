import { useState } from 'react';
import './PracticeResult.css';

const PracticeResult = ({ result }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  if (!result) {
    return null;
  }

  if (result.error) {
    return (
      <div className="practice-result">
        <h2 className="result-title">Error</h2>
        <div className="result-content error">
          {result.error}
        </div>
      </div>
    );
  }

  const toggleCorrectAnswer = () => {
    setShowCorrectAnswer(!showCorrectAnswer);
  };

  return (
    <div className="practice-result">
      <div className="result-header">
        <h2 className="result-title">Resultado de la Práctica</h2>
      </div>
      
      <div className="result-content">
        <div className="original-text">
          <h3>Texto original:</h3>
          <p>"{result.text}"</p>
          <small>Tipo de IPA: {result.ipaType}</small>
        </div>

        <div className="answer-comparison">
          <div className="user-answer">
            <h3>Tu respuesta:</h3>
            <p className="transcription">{result.userAnswer}</p>
          </div>

          <div className={`result-indicator ${result.isCorrect ? 'correct' : 'incorrect'}`}>
            {result.isCorrect ? (
              <div className="correct-message">
                <span className="icon">✅</span>
                <span>¡Correcto! Tu transcripción es exacta.</span>
              </div>
            ) : (
              <div className="incorrect-message">
                <span className="icon">❌</span>
                <span>Incorrecto. Revisa tu transcripción.</span>
              </div>
            )}
          </div>
        </div>

        <div className="correct-answer-section">
          <button 
            onClick={toggleCorrectAnswer}
            className="toggle-answer-btn"
          >
            {showCorrectAnswer ? 'Ocultar respuesta correcta' : 'Mostrar respuesta correcta'}
          </button>
          
          {showCorrectAnswer && (
            <div className="correct-answer">
              <h3>Transcripción correcta:</h3>
              <p className="transcription correct">{result.correctAnswer}</p>
              <small className="note">
                Nota: La comparación ignora los símbolos de estrés (ˈ ˌ) y las barras diagonales (/)
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeResult;