import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { QuestionOption } from '../data/questions';

interface SimpleLanguageSelectorProps {
  options: QuestionOption[];
  value: string;
  customLanguage?: string;
  onChange: (value: string, customLanguage?: string) => void;
  placeholder: string;
}

export const SimpleLanguageSelector: React.FC<SimpleLanguageSelectorProps> = ({
  options,
  value,
  customLanguage,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  const isOtherSelected = value === 'other';
  
  // Filter options based on input value
  const filteredOptions = options.filter(option =>
    option.text.toLowerCase().includes(inputValue.toLowerCase()) && option.value !== 'other'
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Show dropdown when user starts typing
    if (newValue.length > 0 && !isOpen) {
      setIsOpen(true);
    }
    
    // If user starts typing, clear any existing selection
    if (newValue.length > 0 && selectedOption && !isOtherSelected) {
      // User is typing over a selected option, clear the selection
      onChange('', '');
    }
    
    // If user clears the input completely, reset the selection
    if (newValue === '') {
      onChange('', '');
      setInputValue('');
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (optionValue === 'other') {
      // When "Other" is selected, allow user to type in the main input
      onChange(optionValue);
      setInputValue('');
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Select the option and clear any typing
      onChange(optionValue);
      setInputValue('');
      setIsOpen(false);
    }
  };

  // Handle when user types in the main input and wants to use it as custom language
  const handleMainInputSubmit = () => {
    if (inputValue.trim()) {
      // User typed something, treat as custom language
      onChange('other', inputValue.trim());
      setIsOpen(false);
      setInputValue('');
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isOtherSelected && inputValue.trim()) {
        // If "other" is selected and user typed something, treat as custom language
        handleMainInputSubmit();
      } else if (filteredOptions.length === 1) {
        // If there's exactly one match, select it
        handleOptionSelect(filteredOptions[0].value);
      } else if (inputValue.trim()) {
        // If user typed something but no exact match, treat as custom language
        handleMainInputSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue('');
    }
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Don't clear input if "other" is selected or if user is typing
        if (!selectedOption && !isOtherSelected && !inputValue) {
          setInputValue('');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, selectedOption, isOtherSelected, inputValue]);

  // Get display text for the input
  const getDisplayText = () => {
    // Always show what the user is typing
    if (inputValue) {
      return inputValue;
    }
    // If "other" is selected and has custom language, show it
    if (isOtherSelected && customLanguage) {
      return customLanguage;
    }
    // If "other" is selected but no custom language yet, show empty to allow typing
    if (isOtherSelected) {
      return '';
    }
    // If no typing and not "other", show selected option
    if (selectedOption && !isOtherSelected) {
      return selectedOption.text;
    }
    return '';
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayText()}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setIsOpen(true);
            // If there's a selected option and user clicks to focus, clear it for typing
            if (selectedOption && !isOtherSelected) {
              setInputValue('');
            }
          }}
          onClick={() => {
            setIsOpen(true);
            // If there's a selected option and user clicks, clear it for typing
            if (selectedOption && !isOtherSelected) {
              setInputValue('');
            }
          }}
          placeholder={placeholder}
          className={`
            w-full p-4 bg-white border-2 rounded-xl pr-12
            transition-colors duration-200 text-left
            ${isOpen 
              ? 'border-blue-500 ring-2 ring-blue-100' 
              : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
            }
            ${selectedOption || isOtherSelected ? 'text-gray-900' : 'text-gray-500'}
          `}
        />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden"
          >
            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150
                      flex items-center justify-between
                      ${index === 0 ? 'rounded-t-xl' : ''}
                      ${index === filteredOptions.length - 1 ? 'rounded-b-xl' : ''}
                      ${value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span>{option.text}</span>
                    {value === option.value && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-center text-sm">
                  {inputValue ? `No languages found matching "${inputValue}"` : 'Type to search languages...'}
                </div>
              )}
              
              {/* Other Option */}
              <motion.button
                type="button"
                onClick={() => handleOptionSelect('other')}
                className={`
                  w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150
                  flex items-center justify-between border-t border-gray-100
                  ${value === 'other' ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span>Other (specify language)</span>
                {value === 'other' && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </motion.button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleLanguageSelector;
