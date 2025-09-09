import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { QuestionOption } from '../data/questions';

interface DropdownSelectProps {
  options: QuestionOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-4 bg-white border-2 rounded-xl flex items-center justify-between
          transition-colors duration-200 text-left
          ${isOpen 
            ? 'border-primary-500 ring-2 ring-primary-100' 
            : 'border-gray-200 hover:border-primary-300'
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.text : placeholder}
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
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150
                  flex items-center justify-between
                  ${index === 0 ? 'rounded-t-xl' : ''}
                  ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                  ${value === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <span>{option.text}</span>
                {value === option.value && (
                  <Check className="w-5 h-5 text-primary-500" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownSelect;
