import { useState } from 'react';
import TranscriptionForm from './components/TranscriptionForm';
import ResultDisplay from './components/ResultDisplay';
import { phoneticTranscriptionService } from './services/phoneticTranscriptionService';
import './App.css';

function App() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTranscription, setLastTranscription] = useState(null);

  const handleTranscribe = async (text, ipaType, useWeakForms) => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Convert IPA type to accent code
      const accent = ipaType === 'RP IPA' ? 'rp' : 'american';
      
      // Perform actual IPA transcription
      const transcriptionResult = phoneticTranscriptionService.transcribeToIpa(
        text, 
        accent, 
        useWeakForms
      );
      
      // Add slashes for American IPA as per original logic
      const finalResult = accent === 'american' ? `/${transcriptionResult}/` : transcriptionResult;
      
      setResult(finalResult);
      setLastTranscription({ 
        text, 
        ipaType, 
        useWeakForms, 
        result: finalResult 
      });
      setIsLoading(false);
      
    } catch (err) {
      setError(`Error transcribing text: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <TranscriptionForm 
        onTranscribe={handleTranscribe}
        isLoading={isLoading}
      />
      <ResultDisplay 
        result={result}
        error={error}
        originalText={lastTranscription?.text}
        ipaType={lastTranscription?.ipaType}
      />
    </div>
  );
}

export default App;
