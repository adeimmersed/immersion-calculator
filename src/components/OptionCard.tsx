import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { QuestionOption } from '../data/questions';

interface OptionCardProps {
  option: QuestionOption;
  isSelected: boolean;
  isMultiple?: boolean;
  onClick: () => void;
  index: number;
}

export const OptionCard: React.FC<OptionCardProps> = ({ 
  option, 
  isSelected, 
  isMultiple = false, 
  onClick, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        relative cursor-pointer transition-all duration-200 rounded-2xl border-2 p-6
        hover:shadow-lg hover:-translate-y-1 min-h-[100px] flex items-center
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-blue-300'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-1">
        <div className="flex items-start gap-4">
          {isMultiple && (
            <div className={`
              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
              ${isSelected 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-300'
              }
            `}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className={`
              font-semibold text-lg mb-2 leading-tight
              ${isSelected ? 'text-blue-700' : 'text-gray-800'}
            `}>
              {option.text}
            </h3>
            
            {option.description && (
              <p className={`
                text-base leading-relaxed
                ${isSelected ? 'text-blue-600' : 'text-gray-600'}
              `}>
                {option.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator for single choice */}
      {!isMultiple && isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default OptionCard;
