import { useState } from 'react';
import TranscriptionForm from './components/TranscriptionForm';
import ResultDisplay from './components/ResultDisplay';
import PracticeForm from './components/PracticeForm';
import PracticeResult from './components/PracticeResult';
import { phoneticTranscriptionService } from './services/phoneticTranscriptionService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('transcribe');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTranscription, setLastTranscription] = useState(null);
  
  // Estados para la práctica
  const [practiceResult, setPracticeResult] = useState(null);

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

  const handlePractice = (text, ipaType, userAnswer) => {
    try {
      // Convert IPA type to accent code
      const accent = ipaType === 'RP IPA' ? 'rp' : 'american';
      
      // Get correct transcription
      const correctTranscription = phoneticTranscriptionService.transcribeToIpa(
        text, 
        accent, 
        true // Always use weak forms for practice
      );
      
      // Add slashes for American IPA
      const finalCorrect = accent === 'american' ? `/${correctTranscription}/` : correctTranscription;
      
      // Compare answers (ignoring stress symbols)
      const isCorrect = compareTranscriptions(userAnswer, finalCorrect);
      
      setPracticeResult({
        text,
        ipaType,
        userAnswer,
        correctAnswer: finalCorrect,
        isCorrect
      });
      
    } catch (err) {
      setPracticeResult({
        error: `Error checking answer: ${err.message}`
      });
    }
  };

  // Function to compare transcriptions ignoring stress symbols and slashes
  const compareTranscriptions = (userAnswer, correctAnswer) => {
    const normalize = (str) => {
      return str
        .replace(/[ˈˌ]/g, '')     // Remove primary and secondary stress
        .replace(/[\/]/g, '')     // Remove forward slashes
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim()
        .toLowerCase();
    };
    
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);
    
    return normalizedUser === normalizedCorrect;
  };

  return (
    <div className="app">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'transcribe' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcribe')}
        >
          Transcriptor IPA
        </button>
        <button 
          className={`tab-button ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          Práctica
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'transcribe' && (
          <>
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
          </>
        )}
        
        {activeTab === 'practice' && (
          <>
            <PracticeForm onPractice={handlePractice} />
            <PracticeResult result={practiceResult} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
