import { useState } from 'react';
import { IPA_CHARACTERS } from '../utils/ipaCharacters';
import '../css/IPAKeyboard.css';

const IPAKeyboard = ({ onCharacterSelect, isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('vowelsShort');

  if (!isVisible) return null;

  const tabs = [
    { key: 'vowelsShort', label: 'Vocales Cortas', icon: 'ɪ' },
    { key: 'vowelsLong', label: 'Vocales Largas', icon: 'iː' },
    { key: 'diphthongs', label: 'Diptongos', icon: 'aɪ' },
    { key: 'consonantsFricatives', label: 'Fricativas', icon: 'θ' },
    { key: 'consonantsPlosives', label: 'Oclusivas', icon: 'p' },
    { key: 'consonantsAffricates', label: 'Africadas', icon: 'tʃ' },
    { key: 'consonantsNasals', label: 'Nasales', icon: 'ŋ' },
    { key: 'consonantsLiquids', label: 'Líquidas', icon: 'ɹ' },
    { key: 'consonantsGlides', label: 'Deslizantes', icon: 'j' },
    { key: 'stress', label: 'Estrés', icon: 'ˈ' },
    { key: 'punctuation', label: 'Puntuación', icon: '/' }
  ];

  const handleCharacterClick = (character) => {
    onCharacterSelect(character.char);
  };

  return (
    <div className="ipa-keyboard-overlay">
      <div className="ipa-keyboard">
        {/* Header */}
        <div className="ipa-keyboard-header">
          <h3>Teclado Virtual IPA</h3>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar teclado"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="ipa-keyboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Character Grid */}
        <div className="ipa-character-grid">
          {IPA_CHARACTERS[activeTab]?.map((character, index) => (
            <button
              key={index}
              className="ipa-character-button"
              onClick={() => handleCharacterClick(character)}
              title={`${character.char} - ${character.name}${character.shortcut ? ` (${character.shortcut})` : ''}`}
            >
              <span className="character">{character.char}</span>
              {character.shortcut && (
                <span className="shortcut">{character.shortcut}</span>
              )}
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="ipa-keyboard-help">
          <p>
            💡 <strong>Tip:</strong> También puedes usar atajos de teclado. 
            Mantén presionado <kbd>Alt</kbd> o <kbd>Ctrl</kbd> + la tecla correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPAKeyboard;