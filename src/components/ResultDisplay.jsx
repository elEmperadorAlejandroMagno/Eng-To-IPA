import '../css/ResultDisplay.css';

const ResultDisplay = ({ result, error, originalText, ipaType }) => {
  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        alert('IPA transcription copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const reportError = () => {
    // TODO: Implement error reporting functionality
    const reportData = {
      originalText,
      transcription: result,
      ipaType,
      timestamp: new Date().toISOString()
    };
    
    console.log('Error report data:', reportData);
    alert('Thank you for your feedback! Error reporting will be implemented soon.');
  };

  if (error) {
    return (
      <div className="result-display">
        <h2 className="result-title">Error</h2>
        <div className="result-content error">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="result-display">
      <div className="result-header">
        <h2 className="result-title">IPA Transcription:</h2>
        <div className="button-group">
          <button 
            onClick={copyToClipboard}
            className="copy-btn"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          <button 
            onClick={reportError}
            className="report-btn"
            title="Report transcription error"
          >
            ⚠️ Report Error
          </button>
        </div>
      </div>
      <div className="result-content">
        {result}
      </div>
    </div>
  );
};

export default ResultDisplay;