import { useState, useRef } from 'react';
import TranscriptionForm from './components/TranscriptionForm';
import ResultDisplay from './components/ResultDisplay';
import PracticeForm from './components/PracticeForm';
import PracticeResult from './components/PracticeResult';
import IPASidebar from './components/IPASidebar';
import { apiTranscriptionService } from './services/apiTranscriptionService';
import StatusBar from './components/StatusBar';
import './css/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('transcribe');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTranscription, setLastTranscription] = useState(null);
  
  // Estados para la práctica
  const [practiceResult, setPracticeResult] = useState(null);
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  
  // Referencias para insertar caracteres IPA
  const practiceInputRef = useRef(null);

  const handleTranscribe = async (text, ipaType, applySimplification) => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const accent = ipaType === 'RP IPA' ? 'rp' : 'american';
      const { ipa } = await apiTranscriptionService.transcribe({
        text,
        accent,
        useWeakForms: true,
        applySimplification: !!applySimplification,
        ignoreStress: false,
      });
      const finalResult = accent === 'american' ? `/${ipa}/` : ipa;
      setResult(finalResult);
      setLastTranscription({ text, ipaType, useWeakForms: true, applySimplification, result: finalResult });
      setIsLoading(false);
    } catch (err) {
      setError(`Error transcribing text: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handlePractice = async (text, ipaType, userAnswer) => {
    setIsPracticeLoading(true);
    try {
      const accent = ipaType === 'RP IPA' ? 'rp' : 'american';
      const { ipa: correct } = await apiTranscriptionService.transcribe({
        text,
        accent,
        useWeakForms: true,
        ignoreStress: false,
      });
      const finalCorrect = accent === 'american' ? `/${correct}/` : correct;
      const isCorrect = compareTranscriptions(userAnswer, finalCorrect);
      setPracticeResult({ text, ipaType, userAnswer, correctAnswer: finalCorrect, isCorrect });
    } catch (err) {
      setPracticeResult({ error: `Error checking answer: ${err.message}` });
    } finally {
      setIsPracticeLoading(false);
    }
  };

  // Function to compare transcriptions ignoring stress symbols and RP punctuation
  const compareTranscriptions = (userAnswer, correctAnswer) => {
    const normalize = (str) => {
      return str
        .replace(/[ˈˌ]/g, '')           // Remove primary and secondary stress
        .replace(/[\/]/g, '')           // Remove forward slashes  
        .replace(/\(!\)/g, '')        // Remove (!)
        .replace(/\(\?\)/g, '')        // Remove (?)
        .replace(/\s*\/\/\s*/g, ' ')    // Remove // (sentence endings)
        .replace(/\s*\/\s*/g, ' ')      // Remove / (commas)
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim()
        .toLowerCase();
    };
    
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);
    
    return normalizedUser === normalizedCorrect;
  };
  
  // Handle character insertion from sidebar
  const handleIPACharacterInsert = (character) => {
    if (activeTab === 'practice' && practiceInputRef.current) {
      const input = practiceInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;
      
      // Insert character at cursor position
      const newValue = currentValue.slice(0, start) + character + currentValue.slice(end);
      
      // Update the input value through the practice form
      const event = { target: { value: newValue } };
      input.value = newValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Set cursor position after inserted character
      setTimeout(() => {
        const newCursorPos = start + character.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
      }, 0);
    }
  };

  return (
    <div className="app">
      {/* IPA Sidebar */}
      <IPASidebar 
        onCharacterSelect={handleIPACharacterInsert}
      />
      
      {/* Main Content */}
      <div className="main-content">
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

      {/* Global status */}
      <StatusBar 
        loading={isLoading || isPracticeLoading}
        message={isLoading ? 'Transcribiendo en el servidor...' : (isPracticeLoading ? 'Verificando respuesta...' : '')}
        error={error || practiceResult?.error || ''}
      />

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
            <PracticeForm 
              onPractice={handlePractice} 
              isLoading={isPracticeLoading}
              inputRef={practiceInputRef}
            />
            <PracticeResult result={practiceResult} />
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
