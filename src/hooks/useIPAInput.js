import { useCallback, useEffect, useRef } from 'react';
import { isIPAShortcut, getAlternateCharacter } from '../utils/ipaCharacters';

/**
 * Custom hook for handling IPA character input with keyboard shortcuts
 * @param {React.RefObject} inputRef - Reference to the input/textarea element
 * @param {Function} setValue - Function to update the input value
 * @param {string} value - Current input value
 * @returns {Object} - Object with character insertion function and shortcut handler
 */
export const useIPAInput = (inputRef, setValue, value) => {
  const lastInsertRef = useRef({ character: null, timestamp: 0, position: -1 });
  
  /**
   * Insert character at cursor position with double-tap alternation
   * @param {string} character - IPA character to insert
   */
  const insertCharacter = useCallback((character) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentTime = Date.now();
    const lastInsert = lastInsertRef.current;
    
    let characterToInsert = character;
    
    // Check for double-tap alternation (within 800ms and same position)
    if (
      lastInsert.character && 
      currentTime - lastInsert.timestamp < 800 &&
      start === lastInsert.position &&
      getAlternateCharacter(lastInsert.character)
    ) {
      // This is a double-tap, check if we should alternate
      if (character === lastInsert.character) {
        // Replace the previous character with its alternate
        const alternate = getAlternateCharacter(lastInsert.character);
        if (alternate) {
          const prevStart = start - lastInsert.character.length;
          const newValue = value.slice(0, prevStart) + alternate + value.slice(start);
          setValue(newValue);
          
          // Update tracking for potential triple-tap
          lastInsertRef.current = {
            character: alternate,
            timestamp: currentTime,
            position: prevStart + alternate.length
          };
          
          // Set cursor position after alternate character
          setTimeout(() => {
            const newCursorPos = prevStart + alternate.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
            input.focus();
          }, 0);
          
          return;
        }
      }
    }
    
    // Normal insertion
    const newValue = value.slice(0, start) + characterToInsert + value.slice(end);
    setValue(newValue);
    
    // Track this insertion for potential double-tap
    lastInsertRef.current = {
      character: characterToInsert,
      timestamp: currentTime,
      position: start + characterToInsert.length
    };
    
    // Set cursor position after inserted character
    setTimeout(() => {
      const newCursorPos = start + characterToInsert.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
      input.focus();
    }, 0);
  }, [inputRef, setValue, value]);

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = useCallback((event) => {
    // Check if this is an IPA shortcut
    const ipaCharacter = isIPAShortcut(event);
    
    if (ipaCharacter) {
      event.preventDefault();
      insertCharacter(ipaCharacter);
      
      // Visual feedback - briefly highlight the input
      const input = inputRef.current;
      if (input) {
        input.style.boxShadow = '0 0 8px rgba(74, 158, 255, 0.5)';
        setTimeout(() => {
          input.style.boxShadow = '';
        }, 200);
      }
    }
  }, [insertCharacter, inputRef]);

  /**
   * Set up keyboard event listeners
   */
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.addEventListener('keydown', handleKeyDown);
    
    return () => {
      input.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, inputRef]);

  return {
    insertCharacter,
    handleKeyDown
  };
};