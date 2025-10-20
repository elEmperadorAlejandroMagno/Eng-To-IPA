import { useState } from 'react';
import './TranscriptionForm.css';

const TranscriptionForm = ({ onTranscribe, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [ipaType, setIpaType] = useState('RP IPA');
  const [applySimplification, setApplySimplification] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onTranscribe(inputText, ipaType, applySimplification);
    }
  };

  const handleClear = () => {
    setInputText('');
    setIpaType('RP IPA');
    setApplySimplification(false);
  };

  return (
    <div className="transcription-form">
      <h1 className="title">IPA Phonetic Transcription Tool</h1>
      
      <form onSubmit={handleSubmit} className="form">
        {/* IPA Type Selection */}
        <div className="form-group">
          <label htmlFor="ipa-type">Select IPA Type:</label>
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

        {/* Patterns of Simplification (placeholder) */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={applySimplification}
              onChange={(e) => setApplySimplification(e.target.checked)}
              className="checkbox"
            />
            Apply Patterns of Simplification (beta)
          </label>
        </div>

        {/* Input Text */}
        <div className="form-group">
          <label htmlFor="input-text">English Text:</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter English text to transcribe..."
            rows={6}
            className="textarea"
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button 
            type="submit" 
            disabled={!inputText.trim() || isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Transcribing...' : 'Transcribe to IPA'}
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default TranscriptionForm;