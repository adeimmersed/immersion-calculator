import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calculator as CalculatorIcon } from 'lucide-react';
import { questions } from '../data/questions';
import { calculateResults, UserResponses } from '../utils/calculator';
import ProgressBar from './ProgressBar';
import Question from './Question';
import TypewriterText from './TypewriterText';
import InteractiveCalculator from './InteractiveCalculator';
import CalculatorQuestion from './CalculatorQuestion';
import CalculatorResultsComponent from './CalculatorResults';

export const Calculator: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponses>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Get selected language for display purposes
  const selectedLanguage = ((responses['language-selection'] as any)?.language) || 'your target language';

  const handleResponse = (questionId: string, response: string | string[] | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const canProceed = () => {
    const currentResponse = responses[currentQuestion.id];
    
    if (currentQuestion.type === 'dropdown-single') {
      const response = currentResponse as any;
      return response?.language && response?.timeline;
    } else if (currentQuestion.type === 'multiple') {
      return Array.isArray(currentResponse) && currentResponse.length > 0;
    } else if (currentQuestion.type === 'slider') {
      return typeof currentResponse === 'number';
    } else {
      return currentResponse !== undefined && currentResponse !== '';
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleClear = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
    setIsStarted(false);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
    setIsStarted(false);
  };

  const handleEmailCapture = async (email: string) => {
    // Here you would integrate with your email service
    // For now, we'll just log it
    console.log('Email captured:', email);
    console.log('User responses:', responses);
    
    // TODO: Send to ConvertKit/Mailchimp API
    // const results = calculateResults(responses);
    // await sendPersonalizedEmail(email, results);
    
    return Promise.resolve();
  };

  const results = showResults ? calculateResults(responses) : null;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {/* Interactive Calculator Display */}
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, duration: 0.8 }}
              className="mb-12"
            >
              <InteractiveCalculator onStartAssessment={() => setIsStarted(true)} />
            </motion.div>
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Immersion Intensity
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                  Calculator
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                Discover your personalized language learning profile and get a reality check on your immersion journey.
              </p>
              
              <p className="text-lg text-gray-600 mb-8">
                Takes 5-7 minutes, delivers insights worth months of trial and error.
              </p>
              
              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-2">14</div>
                  <div className="text-gray-600 font-semibold">Strategic Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-2">5-7</div>
                  <div className="text-gray-600 font-semibold">Minutes to Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-2">100%</div>
                  <div className="text-gray-600 font-semibold">Personalized Results</div>
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.button
                onClick={() => setIsStarted(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xl px-12 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Assessment
                <ArrowRight className="w-6 h-6 ml-3 inline" />
              </motion.button>
              
              <p className="text-gray-500 text-base mt-6">
                No email required to see your results
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <CalculatorResultsComponent
        results={results}
        selectedLanguage={selectedLanguage}
        responses={responses}
        onEmailCapture={handleEmailCapture}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <CalculatorQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        responses={responses}
        onResponse={handleResponse}
        onNext={handleNext}
        onBack={handleBack}
        onClear={handleClear}
        canProceed={canProceed()}
        selectedLanguage={selectedLanguage}
      />
    </AnimatePresence>
  );
};

export default Calculator;
