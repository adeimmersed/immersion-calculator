import React from 'react';
import { motion } from 'framer-motion';
import { Question as QuestionType } from '../data/questions';
import { replaceLanguageSpecificText } from '../utils/languageUtils';
import OptionCard from './OptionCard';
import QuestionSlider from './QuestionSlider';
import DropdownSelect from './DropdownSelect';
import SimpleLanguageSelector from './SimpleLanguageSelector';
import TypewriterText from './TypewriterText';

interface QuestionProps {
  question: QuestionType;
  responses: { [key: string]: string | string[] | number };
  onResponse: (questionId: string, response: string | string[] | number) => void;
  selectedLanguage?: string;
}

export const Question: React.FC<QuestionProps> = ({ 
  question, 
  responses, 
  onResponse,
  selectedLanguage 
}) => {
  const currentResponse = responses[question.id];
  
  const handleSingleChoice = (optionValue: string) => {
    onResponse(question.id, optionValue);
  };

  const handleMultipleChoice = (optionValue: string) => {
    const currentSelections = (currentResponse as string[]) || [];
    const newSelections = currentSelections.includes(optionValue)
      ? currentSelections.filter(val => val !== optionValue)
      : [...currentSelections, optionValue];
    onResponse(question.id, newSelections);
  };

  const handleSliderChange = (value: number) => {
    onResponse(question.id, value);
  };

  const handleDropdownChange = (value: string) => {
    onResponse(question.id, value);
  };

  // Replace [Target Language] placeholder in title with properly capitalized language
  const customLanguage = (currentResponse as any)?.customLanguage;
  const displayTitle = replaceLanguageSpecificText(question.title, selectedLanguage, customLanguage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="question-card">
        {/* Question Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="question-title"
          >
            {displayTitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="question-description"
          >
            {question.explanation}
          </motion.p>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          {question.type === 'dropdown-single' && question.dropdownOptions && question.options && (
            <div className="space-y-6">
              {/* Language Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select your target language:
                </label>
                <SimpleLanguageSelector
                  options={question.dropdownOptions || []}
                  value={(currentResponse as any)?.language || ''}
                  customLanguage={(currentResponse as any)?.customLanguage}
                  onChange={(value, customLanguage) => {
                    const current = (currentResponse as any) || {};
                    onResponse(question.id, { 
                      ...current, 
                      language: value,
                      customLanguage: customLanguage || current.customLanguage
                    });
                  }}
                  placeholder="Choose a language..."
                />
              </div>

              {/* Timeline Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How long have you been learning?
                </label>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      isSelected={(currentResponse as any)?.timeline === option.value}
                      onClick={() => {
                        const current = (currentResponse as any) || {};
                        onResponse(question.id, { ...current, timeline: option.value });
                      }}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {question.type === 'single' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <OptionCard
                  key={option.id}
                  option={{
                    ...option,
                    description: replaceLanguageSpecificText(option.description, selectedLanguage, customLanguage)
                  }}
                  isSelected={currentResponse === option.value}
                  onClick={() => handleSingleChoice(option.value)}
                  index={index}
                />
              ))}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <OptionCard
                  key={option.id}
                  option={{
                    ...option,
                    description: replaceLanguageSpecificText(option.description, selectedLanguage, customLanguage)
                  }}
                  isSelected={((currentResponse as string[]) || []).includes(option.value)}
                  isMultiple={true}
                  onClick={() => handleMultipleChoice(option.value)}
                  index={index}
                />
              ))}
            </div>
          )}

          {question.type === 'slider' && question.sliderConfig && (
            <div className="py-8">
              <QuestionSlider
                min={question.sliderConfig.min}
                max={question.sliderConfig.max}
                step={question.sliderConfig.step}
                value={(currentResponse as number) || question.sliderConfig.defaultValue}
                unit={question.sliderConfig.unit}
                onChange={handleSliderChange}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Question;
