"""
Phonetic Rules Module
Contains all phonetic rules for weak forms, strong forms, and contextual analysis.
"""
import re
from typing import List, Dict
from abc import ABC, abstractmethod


class PhoneticRule(ABC):
    """Abstract base class for phonetic rules"""
    
    @abstractmethod
    def applies_to(self, word: str, context: Dict) -> bool:
        """Check if this rule applies to the given word and context"""
        pass
    
    @abstractmethod
    def apply(self, word: str, context: Dict) -> bool:
        """Apply the rule and return result"""
        pass


class ContractionRule(PhoneticRule):
    """Rule for contractions (already in weak form)"""
    
    def applies_to(self, word: str, context: Dict) -> bool:
        return "'" in word
    
    def apply(self, word: str, context: Dict) -> bool:
        return False  # Don't apply weak form (already contracted)


class TheVariationRule(PhoneticRule):
    """Rule for 'the' allophonic variation"""
    
    def applies_to(self, word: str, context: Dict) -> bool:
        return re.sub(r"[^\w']", '', word.lower()) == 'the'
    
    def apply(self, word: str, context: Dict) -> bool:
        return False  # Handle specially in post-processing


class ThereRule(PhoneticRule):
    """Rule for 'there' - weak when followed by 'to be' verbs"""
    
    def __init__(self):
        self.be_verbs = ['is', 'are', 'was', 'were', 'will', 'would', "'s", "'re", "'ll"]
    
    def applies_to(self, word: str, context: Dict) -> bool:
        clean_word = re.sub(r"[^\w']", '', word.lower())
        return clean_word == 'there'
    
    def apply(self, word: str, context: Dict) -> bool:
        word_index = context.get('word_index', 0)
        words = context.get('words', [])
        
        # Check if followed by 'to be' verb
        if word_index < len(words) - 1:
            next_word = re.sub(r"[^\w']", '', words[word_index + 1].lower())
            if next_word in self.be_verbs:
                return True  # Use weak form before 'to be'
        
        return False  # Use strong form otherwise


class ThatRule(PhoneticRule):
    """Rule for 'that' - weak when used as logical conclusion/subordinating conjunction"""
    
    def __init__(self):
        # Words that often precede 'that' in logical conclusions
        self.conclusion_indicators = [
            'know', 'think', 'believe', 'feel', 'say', 'said', 'tell', 'told',
            'see', 'saw', 'hear', 'heard', 'understand', 'realize', 'realized',
            'assume', 'suppose', 'hope', 'wish', 'remember', 'forget', 'noticed',
            'mean', 'means', 'meant', 'show', 'shows', 'showed', 'prove', 'proves'
        ]
    
    def applies_to(self, word: str, context: Dict) -> bool:
        clean_word = re.sub(r"[^\w']", '', word.lower())
        return clean_word == 'that'
    
    def apply(self, word: str, context: Dict) -> bool:
        word_index = context.get('word_index', 0)
        words = context.get('words', [])
        
        # Check if preceded by a verb that introduces logical conclusions
        if word_index > 0:
            prev_word = re.sub(r"[^\w']", '', words[word_index - 1].lower())
            if prev_word in self.conclusion_indicators:
                return True  # Use weak form for logical conclusions
        
        # Check if it's followed by a clause (indicating subordinating conjunction)
        if word_index < len(words) - 2:
            # Look for patterns like "that he", "that she", "that it", etc.
            next_word = re.sub(r"[^\w']", '', words[word_index + 1].lower())
            if next_word in ['he', 'she', 'it', 'they', 'we', 'you', 'i']:
                return True  # Use weak form for subordinating conjunction
        
        return False  # Use strong form for demonstrative pronoun


class PositionalRule(PhoneticRule):
    """Rule for positional strong forms"""
    
    def __init__(self):
        self.weak_at_start = ['the', 'a', 'an']
        self.auxiliaries = ['is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did',
                           'will', 'would', 'can', 'could', 'should', 'must']
    
    def applies_to(self, word: str, context: Dict) -> bool:
        return True  # This rule always applies
    
    def apply(self, word: str, context: Dict) -> bool:
        clean_word = re.sub(r"[^\w']", '', word.lower())
        word_index = context.get('word_index', 0)
        words = context.get('words', [])
        punct_re = context.get('punct_re')
        
        # First word tends to be strong (except special cases)
        if word_index == 0:
            if clean_word not in self.weak_at_start:
                return False
        
        # Strong before pause (comma, period, etc.)
        if word_index < len(words) - 1 and punct_re and punct_re.match(words[word_index + 1] or ''):
            return False
        
        # Last word tends to be strong
        if word_index == len(words) - 1:
            return False
        
        # Auxiliaries at start of questions are strong
        if clean_word in self.auxiliaries and word_index == 0:
            return False
        
        return True  # Use weak form


class WeakFormProcessor:
    """Processor for determining weak vs strong forms"""
    
    def __init__(self):
        self.rules = [
            ContractionRule(),
            TheVariationRule(),
            ThereRule(),
            ThatRule(),
            PositionalRule(),
        ]
        self.punct_re = re.compile(r"^[.,!?;:'-]+$")
    
    def should_use_weak(self, word: str, word_index: int, words: List[str]) -> bool:
        """
        Determine if a word should use its weak form
        
        Args:
            word: The word to analyze
            word_index: Position of word in sentence
            words: All words in the sentence
            
        Returns:
            True if weak form should be used
        """
        context = {
            'word_index': word_index,
            'words': words,
            'punct_re': self.punct_re
        }
        
        # Apply rules in order - first matching rule wins
        for rule in self.rules:
            if rule.applies_to(word, context):
                return rule.apply(word, context)
        
        # Default: use weak form in non-prominent positions
        return True
    
    def add_rule(self, rule: PhoneticRule, position: int = -1):
        """Add a new rule at specified position"""
        if position == -1:
            self.rules.append(rule)
        else:
            self.rules.insert(position, rule)
    
    def remove_rule(self, rule_class):
        """Remove a rule by class type"""
        self.rules = [rule for rule in self.rules if not isinstance(rule, rule_class)]


class WeakStrongParser:
    """Parser for weak/strong format strings"""
    
    @staticmethod
    def parse_format(ipa_text: str) -> Dict[str, str]:
        """
        Parse formato / [strong], [weak] / and return dict with forms
        
        Args:
            ipa_text: IPA text in format "/ strong, weak /" or simple format
            
        Returns:
            Dict with 'strong', 'weak' keys or 'single' key
        """
        if not ipa_text or not ipa_text.startswith('/ ') or not ipa_text.endswith(' /'):
            return {'single': ipa_text}  # Simple format
        
        # Extract content between slashes
        content = ipa_text[2:-2]  # Remove "/ " and " /"
        
        if ', ' in content:
            strong, weak = content.split(', ', 1)
            return {'strong': strong.strip(), 'weak': weak.strip()}
        else:
            return {'single': content.strip()}