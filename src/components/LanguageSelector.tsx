import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { QuestionOption } from '../data/questions';

interface LanguageSelectorProps {
  options: QuestionOption[];
  value: string;
  onChange: (value: string, customLanguage?: string) => void;
  placeholder: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  const isOtherSelected = value === 'other';
  
  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (optionValue === 'other') {
      setShowCustomInput(true);
      setSearchTerm('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
    }
  };

  // Handle custom language input
  const handleCustomLanguageSubmit = () => {
    if (customLanguage.trim()) {
      onChange('other', customLanguage.trim());
      setIsOpen(false);
      setShowCustomInput(false);
      setSearchTerm('');
    }
  };

  // Handle custom language change
  const handleCustomLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLanguage(e.target.value);
  };

  // Handle key press for custom input
  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomLanguageSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomLanguage('');
    }
  };

  // Handle key press for search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleOptionSelect(filteredOptions[0].value);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Get display text
  const getDisplayText = () => {
    if (isOtherSelected && customLanguage) {
      return customLanguage;
    }
    return selectedOption ? selectedOption.text : placeholder;
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-4 bg-white border-2 rounded-xl flex items-center justify-between
          transition-colors duration-200 text-left
          ${isOpen 
            ? 'border-blue-500 ring-2 ring-blue-100' 
            : 'border-gray-200 hover:border-blue-300'
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <span className={selectedOption || isOtherSelected ? 'text-gray-900' : 'text-gray-500'}>
          {getDisplayText()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="Type to search languages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

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
                  No languages found matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Custom Input for "Other" */}
            <AnimatePresence>
              {showCustomInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 p-4"
                >
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      What language are you learning?
                    </label>
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={customLanguage}
                        onChange={handleCustomLanguageChange}
                        onKeyDown={handleCustomKeyPress}
                        placeholder="Enter your language..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={handleCustomLanguageSubmit}
                        disabled={!customLanguage.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomLanguage('');
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
