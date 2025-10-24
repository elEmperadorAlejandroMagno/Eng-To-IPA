import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { useServiceWarmup } from '../hooks/useServiceWarmup';
import '../css/WordSearch.css';

function WordSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isWarming: serviceWarmingUp, withWarmupFeedback } = useServiceWarmup();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Por favor ingresa una palabra');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await withWarmupFeedback(async () => {
        return apiClient.get('/ipa', { word: searchTerm.trim() });
      });
      setResult(data);
    } catch (err) {
      setError(`Error al buscar la palabra: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPronunciation = (data) => {
    if (!data) return <span className="ipa-text">N/A</span>;
    
    if (typeof data === 'object' && (data.strong || data.weak)) {
      return (
        <div className="weak-strong-forms">
          {data.strong && (
            <div className="form-item">
              <span className="form-label">Strong:</span>
              <span className="ipa-text">{data.strong}</span>
            </div>
          )}
          {data.weak && (
            <div className="form-item">
              <span className="form-label">Weak:</span>
              <span className="ipa-text">{data.weak}</span>
            </div>
          )}
        </div>
      );
    }
    
    return <span className="ipa-text">{data}</span>;
  };

  const renderResult = () => {
    if (!result) return null;

    if (!result.found) {
      return (
        <div className="word-result not-found">
          <p>❌ Palabra "<strong>{result.word}</strong>" no encontrada</p>
        </div>
      );
    }

    if (!result.sources || result.sources.length === 0) {
      return (
        <div className="word-result not-found">
          <p>❌ No se encontraron fuentes para la palabra "<strong>{result.word}</strong>"</p>
        </div>
      );
    }

    return (
      <div className="word-result found">
        <h3>"{result.word}"</h3>
        
        {result.sources.map((source, index) => (
          <div key={index} className="source-section">
            <h4 className="source-name">
              {source.source === 'database' && '📚 Database'}
              {source.source === 'wiktionary' && '📖 Wiktionary'}
              {source.source === 'cambridge' && '🎓 Cambridge'}
              {!['database', 'wiktionary', 'cambridge'].includes(source.source) && `📝 ${source.source}`}
            </h4>
            
            <div className="pronunciation-section">
              <div className="pronunciation-item">
                <span className="accent-label">🇺🇸 American:</span>
                {renderPronunciation(source.american)}
              </div>
              
              <div className="pronunciation-item">
                <span className="accent-label">🇬🇧 RP:</span>
                {renderPronunciation(source.rp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="word-search-container">
      <h2>Buscador de Palabras IPA</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar palabra..."
          className="search-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn-search"
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {serviceWarmingUp && (
        <div className="warmup-message">
          ⏳ El servicio está iniciándose, esto puede tardar hasta un minuto...
        </div>
      )}
      
      {renderResult()}
    </div>
  );
}

export default WordSearch;
