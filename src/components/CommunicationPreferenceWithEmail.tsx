import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mail } from 'lucide-react';

interface CommunicationPreferenceWithEmailProps {
  question: any;
  questionNumber: number;
  totalQuestions: number;
  responses: any;
  onResponse: (questionId: string, response: any) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  selectedLanguage?: string;
  customLanguage?: string;
}

export default function CommunicationPreferenceWithEmail({
  question,
  questionNumber,
  totalQuestions,
  responses,
  onResponse,
  onNext,
  onBack,
  canProceed,
  selectedLanguage,
  customLanguage
}: CommunicationPreferenceWithEmailProps) {
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailRequired, setEmailRequired] = useState<boolean>(false);

  const handlePreferenceSelect = (value: string) => {
    setSelectedPreference(value);
    setEmailRequired(value !== 'just_plan'); // Email required unless they choose "just give me the plan"
    
    // Update responses with both preference and email
    onResponse(question.id, {
      preference: value,
      email: email
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Update responses with both preference and email
    onResponse(question.id, {
      preference: selectedPreference,
      email: newEmail
    });
  };

  const canProceedWithEmail = () => {
    if (selectedPreference === 'just_plan') {
      return true; // No email required for "just give me the plan"
    }
    return selectedPreference && email && email.includes('@');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((questionNumber / totalQuestions) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            {question.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {question.explanation}
          </p>

          {/* Communication Preference Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option: any, index: number) => (
              <motion.button
                key={option.id}
                onClick={() => handlePreferenceSelect(option.value)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  selectedPreference === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 mt-1 flex-shrink-0 ${
                    selectedPreference === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPreference === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full m-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.text}
                    </h3>
                    <p className="text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Email Input Section */}
          {selectedPreference && selectedPreference !== 'just_plan' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Get Your Personalized Results
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Enter your email to receive your detailed immersion intensity results and personalized recommendations.
              </p>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg"
                  required
                />
                {email && !email.includes('@') && (
                  <p className="text-red-500 text-sm mt-2">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {selectedPreference === 'just_plan' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    No Email Required
                  </h3>
                  <p className="text-gray-600">
                    You'll see your results immediately after completing this question.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={onBack}
            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>

          <motion.button
            onClick={onNext}
            disabled={!canProceedWithEmail()}
            className={`flex items-center px-8 py-3 font-semibold rounded-xl transition-colors ${
              canProceedWithEmail()
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={canProceedWithEmail() ? { scale: 1.05 } : {}}
            whileTap={canProceedWithEmail() ? { scale: 0.95 } : {}}
          >
            {questionNumber === totalQuestions ? 'Get Results' : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
