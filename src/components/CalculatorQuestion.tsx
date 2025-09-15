import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Question as QuestionType } from '../data/questions';
import { UserResponses } from '../utils/calculator';
import { replaceTargetLanguagePlaceholder } from '../utils/languageUtils';
import SimpleLanguageSelector from './SimpleLanguageSelector';
import CommunicationPreferenceWithEmail from './CommunicationPreferenceWithEmail';

interface CalculatorQuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  responses: UserResponses;
  onResponse: (questionId: string, response: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
  onClear: () => void;
  canProceed: boolean;
  selectedLanguage?: string;
  customLanguage?: string;
}

export const CalculatorQuestion: React.FC<CalculatorQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  responses,
  onResponse,
  onNext,
  onBack,
  onClear,
  canProceed,
  selectedLanguage,
  customLanguage
}) => {
  const currentResponse = responses[question.id];

  // Special handling for communication-preference question with email
  if (question.id === 'communication-preference') {
    return (
      <CommunicationPreferenceWithEmail
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        responses={responses}
        onResponse={onResponse}
        onNext={onNext}
        onBack={onBack}
        canProceed={canProceed}
        selectedLanguage={selectedLanguage}
        customLanguage={customLanguage}
      />
    );
  }
  
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

  const displayTitle = replaceTargetLanguagePlaceholder(question.title, selectedLanguage, customLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Calculator Shell */}
        <div className="retro-calculator mx-auto" style={{ maxWidth: '800px' }}>
          {/* Calculator Screen - Shows Question */}
          <div className="calculator-screen text-left p-6 min-h-[120px]">
            <div className="calculator-lcd text-sm mb-3">
              QUESTION {questionNumber} OF {totalQuestions}
            </div>
            <div className="text-green-300 text-base leading-relaxed">
              {displayTitle}
            </div>
          </div>

          {/* Question Content Area */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-4">
            <p className="text-white text-base mb-6 leading-relaxed">
              {question.explanation}
            </p>

            {/* Answer Options as Calculator Buttons */}
            <div className="space-y-3">
              {question.type === 'single' && question.options && (
                <>
                  {question.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSingleChoice(option.value)}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                        ${currentResponse === option.value
                          ? 'bg-blue-600 border-blue-400 text-white' 
                          : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="font-semibold text-base mb-1">
                        {String.fromCharCode(65 + index)}. {option.text}
                      </div>
                      {option.description && (
                        <div className="text-sm opacity-80">
                          {option.description}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </>
              )}

              {question.type === 'multiple' && question.options && (
                <>
                  {question.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleMultipleChoice(option.value)}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                        ${((currentResponse as string[]) || []).includes(option.value)
                          ? 'bg-green-600 border-green-400 text-white' 
                          : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="font-semibold text-base mb-1">
                        {String.fromCharCode(65 + index)}. {option.text}
                      </div>
                      {option.description && (
                        <div className="text-sm opacity-80">
                          {option.description}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </>
              )}

              {question.type === 'slider' && question.sliderConfig && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-white text-lg font-semibold mb-2">
                      Daily Time Commitment
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-6 mb-4">
                      <div className="calculator-lcd text-2xl mb-2">
                        {(currentResponse as number) || question.sliderConfig.defaultValue} {question.sliderConfig.unit}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Range: {question.sliderConfig.min} - {question.sliderConfig.max} minutes
                      </div>
                    </div>
                    
                    {/* Calculator-style time entry */}
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
                      {/* Preset time buttons */}
                      <button
                        onClick={() => onResponse(question.id, 30)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 30 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        30m
                      </button>
                      <button
                        onClick={() => onResponse(question.id, 60)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 60 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        1h
                      </button>
                      <button
                        onClick={() => onResponse(question.id, 90)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 90 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        1.5h
                      </button>
                      <button
                        onClick={() => onResponse(question.id, 120)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 120 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        2h
                      </button>
                      <button
                        onClick={() => onResponse(question.id, 180)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 180 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        3h
                      </button>
                      <button
                        onClick={() => onResponse(question.id, 240)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentResponse === 240 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        4h+
                      </button>
                    </div>

                    {/* Fine-tune buttons */}
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => {
                          const current = (currentResponse as number) || question.sliderConfig!.defaultValue;
                          const newValue = Math.max(question.sliderConfig!.min, current - 15);
                          onResponse(question.id, newValue);
                        }}
                        className="calculator-button text-sm px-4 py-2"
                      >
                        -15m
                      </button>
                      <span className="text-white text-sm">Fine-tune</span>
                      <button
                        onClick={() => {
                          const current = (currentResponse as number) || question.sliderConfig!.defaultValue;
                          const newValue = Math.min(question.sliderConfig!.max, current + 15);
                          onResponse(question.id, newValue);
                        }}
                        className="calculator-button text-sm px-4 py-2"
                      >
                        +15m
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {question.type === 'dropdown-single' && question.dropdownOptions && question.options && (
                <div className="space-y-4">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
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
                    <label className="block text-white text-sm font-semibold mb-2">
                      How long have you been learning?
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            const current = (currentResponse as any) || {};
                            onResponse(question.id, { ...current, timeline: option.value });
                          }}
                          className={`
                            w-full text-left p-3 rounded-lg border-2 transition-all duration-200
                            ${(currentResponse as any)?.timeline === option.value
                              ? 'bg-blue-600 border-blue-400 text-white' 
                              : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                            }
                          `}
                        >
                          {String.fromCharCode(65 + index)}. {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculator Control Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Clear Button */}
            <button
              onClick={onClear}
              className="calculator-button special text-sm flex items-center justify-center"
              title="Clear and restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Back Button */}
            <button
              onClick={onBack}
              disabled={questionNumber === 1}
              className={`calculator-button text-sm flex items-center justify-center ${
                questionNumber === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Previous question"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Next/Calculate Button */}
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`calculator-button col-span-2 text-sm flex items-center justify-center ${
                !canProceed 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'special bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              }`}
              title={questionNumber === totalQuestions ? "Calculate results" : "Next question"}
            >
              {questionNumber === totalQuestions ? 'CALCULATE' : 'NEXT'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            {/* Decorative buttons */}
            <div className="calculator-button text-sm opacity-50">7</div>
            <div className="calculator-button text-sm opacity-50">8</div>
            <div className="calculator-button text-sm opacity-50">9</div>
            <div className="calculator-button operator text-sm opacity-50">÷</div>
            
            <div className="calculator-button text-sm opacity-50">4</div>
            <div className="calculator-button text-sm opacity-50">5</div>
            <div className="calculator-button text-sm opacity-50">6</div>
            <div className="calculator-button operator text-sm opacity-50">×</div>
            
            <div className="calculator-button text-sm opacity-50">1</div>
            <div className="calculator-button text-sm opacity-50">2</div>
            <div className="calculator-button text-sm opacity-50">3</div>
            <div className="calculator-button operator text-sm opacity-50">−</div>
            
            <div className="calculator-button col-span-2 text-sm opacity-50">0</div>
            <div className="calculator-button text-sm opacity-50">.</div>
            <div className="calculator-button operator text-sm opacity-50">+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorQuestion;
