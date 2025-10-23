import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import '../css/WordSearch.css';

function WordSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      const data = await apiClient.get('/ipa', { word: searchTerm.trim() });
      setResult(data);
    } catch (err) {
      setError(`Error al buscar la palabra: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (!result.found) {
      return (
        <div className="word-result not-found">
          <p>❌ Palabra "<strong>{result.word}</strong>" no encontrada en la base de datos</p>
        </div>
      );
    }

    return (
      <div className="word-result found">
        <h3>"{result.word}"</h3>
        
        <div className="pronunciation-section">
          <div className="pronunciation-item">
            <span className="accent-label">🇺🇸 American:</span>
            <span className="ipa-text">{result.american || 'N/A'}</span>
          </div>
          
          <div className="pronunciation-item">
            <span className="accent-label">🇬🇧 RP:</span>
            {typeof result.rp === 'object' ? (
              <div className="weak-strong-forms">
                <div className="form-item">
                  <span className="form-label">Strong:</span>
                  <span className="ipa-text">{result.rp.strong}</span>
                </div>
                <div className="form-item">
                  <span className="form-label">Weak:</span>
                  <span className="ipa-text">{result.rp.weak}</span>
                </div>
              </div>
            ) : (
              <span className="ipa-text">{result.rp || 'N/A'}</span>
            )}
          </div>
        </div>
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
      
      {renderResult()}
    </div>
  );
}

export default WordSearch;
