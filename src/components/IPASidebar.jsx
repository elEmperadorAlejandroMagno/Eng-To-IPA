import { useState } from 'react';
import { IPA_CHARACTERS } from '../utils/ipaCharacters';
import '../css/IPASidebar.css';

const IPASidebar = ({ onCharacterSelect }) => {
  const [activeCategory, setActiveCategory] = useState('vowelsShort');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = [
    { key: 'vowelsShort', label: 'Vocales Cortas', icon: 'ɪ' },
    { key: 'vowelsLong', label: 'Vocales Largas', icon: 'iː' },
    { key: 'diphthongs', label: 'Diptongos', icon: 'aɪ' },
    { key: 'consonantsFricatives', label: 'Fricativas', icon: 'θ' },
    { key: 'consonantsPlosives', label: 'Oclusivas', icon: 'p' },
    { key: 'consonantsAffricates', label: 'Africadas', icon: 'tʃ' },
    { key: 'consonantsNasals', label: 'Nasales', icon: 'ŋ' },
    { key: 'consonantsLiquids', label: 'Líquidas', icon: 'ɹ' },
    { key: 'consonantsGlides', label: 'Deslizantes', icon: 'j' },
    { key: 'stress', label: 'Estrés', icon: 'ˈ' }
  ];

  const handleCharacterClick = (character) => {
    if (onCharacterSelect) {
      onCharacterSelect(character.char);
    }
  };
  

  if (isCollapsed) {
    return (
      <div className="ipa-sidebar collapsed">
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(false)}
          title="Mostrar referencia IPA"
        >
          📖
        </button>
      </div>
    );
  }

  return (
    <div className="ipa-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h3>Referencia IPA</h3>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(true)}
          title="Ocultar referencia"
        >
          ◀
        </button>
      </div>

      {/* Category selector */}
      <div className="sidebar-categories">
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
      <div className="sidebar-content">
        <div className="character-list">
          {IPA_CHARACTERS[activeCategory]?.map((character, index) => (
            <div 
              key={index} 
              className="character-item"
              onClick={() => handleCharacterClick(character)}
              title={`Insertar ${character.char} - ${character.name}${character.shortcut ? ` (${character.shortcut})` : ''}`}
            >
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
      <div className="sidebar-help">
        <div className="help-section">
          <h4>💡 Atajos:</h4>
          <ul>
            <li><kbd>Alt</kbd> + letra para caracteres especiales</li>
            <li><kbd>Alt+Shift</kbd> + letra para vocales largas</li>
            <li><kbd>Ctrl</kbd> + vocal para diptongos</li>
            <li>Haz clic en cualquier carácter para insertarlo</li>
            <li><strong>Doble pulsación:</strong> ɛ ↔ ɜ (Alt+e dos veces)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IPASidebar;