import { useState } from 'react';
import { IPA_CHARACTERS } from '../utils/ipaCharacters';
import '../css/IPAReference.css';

const IPAReference = ({ isVisible, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('vowelsShort');

  if (!isVisible) return null;

  const categories = [
    { key: 'vowelsShort', label: 'Vocales Cortas' },
    { key: 'vowelsLong', label: 'Vocales Largas' },
    { key: 'diphthongs', label: 'Diptongos' },
    { key: 'consonantsFricatives', label: 'Fricativas' },
    { key: 'consonantsPlosives', label: 'Oclusivas' },
    { key: 'consonantsAffricates', label: 'Africadas' },
    { key: 'consonantsNasals', label: 'Nasales' },
    { key: 'consonantsLiquids', label: 'Líquidas' },
    { key: 'consonantsGlides', label: 'Deslizantes' },
    { key: 'stress', label: 'Estrés y Suprasegmentales' }
  ];

  return (
    <div className="ipa-reference-overlay">
      <div className="ipa-reference">
        {/* Header */}
        <div className="ipa-reference-header">
          <h3>Referencia de Caracteres IPA</h3>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar referencia"
          >
            ✕
          </button>
        </div>

        {/* Category selector */}
        <div className="ipa-reference-categories">
          <select 
            value={activeCategory} 
            onChange={(e) => setActiveCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Character list */}
        <div className="ipa-reference-content">
          <h4>{categories.find(c => c.key === activeCategory)?.label}</h4>
          <div className="character-list">
            {IPA_CHARACTERS[activeCategory]?.map((character, index) => (
              <div key={index} className="character-item">
                <div className="character-symbol">{character.char}</div>
                <div className="character-info">
                  <div className="character-name">{character.name}</div>
                  {character.shortcut && (
                    <div className="character-shortcut">
                      <kbd>{character.shortcut}</kbd>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help text */}
        <div className="ipa-reference-help">
          <h4>💡 Cómo usar los atajos:</h4>
          <ul>
            <li>Mantén presionado <kbd>Alt</kbd> + la letra para caracteres especiales</li>
            <li>Usa <kbd>Ctrl</kbd> + vocal para algunos diptongos</li>
            <li>Los atajos funcionan en el campo de transcripción</li>
            <li>También puedes usar el teclado virtual haciendo clic en 🔤</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IPAReference;