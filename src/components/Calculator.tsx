import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calculator as CalculatorIcon, Clock } from 'lucide-react';
import { questions } from '../data/questions';
import { calculateResults, UserResponses } from '../utils/calculator';
import { storeAssessmentData as storeAssessmentDataLocal } from '../utils/dataStorage';
import { storeAssessmentInDatabase } from '../utils/database';
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
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  // Timer states
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [totalQuizTime, setTotalQuizTime] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState<number>(0);
  const [isIdle, setIsIdle] = useState(false);
  const [displayTime, setDisplayTime] = useState<string>('00:00');
  
  // Refs for timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Get selected language for display purposes
  const languageSelection = responses['language-selection'] as any;
  const selectedLanguage = languageSelection?.language || 'your target language';
  const customLanguage = languageSelection?.customLanguage;

  // Idle detection (15 minutes)
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Start the quiz timer
  const startQuizTimer = useCallback(() => {
    const now = Date.now();
    setQuizStartTime(now);
    setLastActivityTime(now);
    setIsTimerActive(true);
    setIsIdle(false);
    console.log('Quiz timer started');
  }, []);

  // Stop the quiz timer
  const stopQuizTimer = useCallback(() => {
    if (isTimerActive && quizStartTime > 0) {
      const now = Date.now();
      const sessionTime = now - quizStartTime;
      setTotalQuizTime(prev => prev + sessionTime);
      setIsTimerActive(false);
      console.log('Quiz timer stopped. Total time:', Math.round(totalQuizTime / 1000), 'seconds');
    }
  }, [isTimerActive, quizStartTime, totalQuizTime]);

  // Pause timer due to idle
  const pauseTimer = useCallback(() => {
    if (isTimerActive && !isIdle) {
      const now = Date.now();
      const sessionTime = now - quizStartTime;
      setTotalQuizTime(prev => prev + sessionTime);
      setIsIdle(true);
      setIsTimerActive(false);
      console.log('Timer paused due to idle');
    }
  }, [isTimerActive, isIdle, quizStartTime]);

  // Resume timer after activity
  const resumeTimer = useCallback(() => {
    if (isIdle) {
      const now = Date.now();
      setQuizStartTime(now);
      setLastActivityTime(now);
      setIsIdle(false);
      setIsTimerActive(true);
      console.log('Timer resumed after activity');
    }
  }, [isIdle]);

  // Update display time
  const updateDisplayTime = useCallback(() => {
    if (isTimerActive && quizStartTime > 0) {
      const now = Date.now();
      const currentSessionTime = now - quizStartTime;
      const totalTime = totalQuizTime + currentSessionTime;
      const minutes = Math.floor(totalTime / 60000);
      const seconds = Math.floor((totalTime % 60000) / 1000);
      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  }, [isTimerActive, quizStartTime, totalQuizTime]);

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    setLastActivityTime(now);
    
    if (isIdle) {
      resumeTimer();
    }
    
    // Reset idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      pauseTimer();
    }, IDLE_TIMEOUT);
  }, [isIdle, resumeTimer, pauseTimer]);

  // Set up activity listeners
  useEffect(() => {
    if (isStarted) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
      };
    }
  }, [isStarted, handleUserActivity]);

  // Display timer effect
  useEffect(() => {
    if (isTimerActive) {
      displayTimerRef.current = setInterval(updateDisplayTime, 1000);
    } else {
      if (displayTimerRef.current) {
        clearInterval(displayTimerRef.current);
      }
    }
    
    return () => {
      if (displayTimerRef.current) {
        clearInterval(displayTimerRef.current);
      }
    };
  }, [isTimerActive, updateDisplayTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (displayTimerRef.current) clearInterval(displayTimerRef.current);
    };
  }, []);

  const handleResponse = (questionId: string, response: string | string[] | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
    
    // Reset idle timer on response
    handleUserActivity();
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

  // Store assessment data immediately when question 14 is completed
  const storeAssessmentData = async () => {
    try {
      const results = calculateResults(responses);
      const languageSelection = responses['language-selection'] as any;
      
      const assessmentData = {
        email: typeof responses['email'] === 'string' ? responses['email'] : '', // Email from preferences question
        user_name: userName,
        selected_language: languageSelection?.language,
        custom_language: languageSelection?.customLanguage,
        intensity_level: responses['time-commitment'] as number || 0,
        learner_profile: results.learnerProfile?.title || 'Unknown',
        time_commitment: `${results.timeAllocation?.totalTime || 0} hours`,
        assessment_date: new Date().toISOString(),
        completion_time: Math.floor(totalQuizTime / 60000), // Total quiz time in minutes
        responses: { ...responses, userName },
        results,
        
        // Individual question responses for detailed analysis
        q1_name: userName,
        q2_language_selection: responses['language-selection'],
        q3_motivation: responses['motivation'],
        q4_speaking_priority: typeof responses['speaking-priority'] === 'string' ? responses['speaking-priority'] : undefined,
        q5_capability_level: typeof responses['capability-level'] === 'string' ? responses['capability-level'] : undefined,
        q6_time_commitment: typeof responses['time-commitment'] === 'number' ? responses['time-commitment'] : undefined,
        q7_lifestyle: typeof responses['lifestyle'] === 'string' ? responses['lifestyle'] : undefined,
        q8_learning_style: typeof responses['content-consumption'] === 'string' ? responses['content-consumption'] : undefined,
        q9_current_method: typeof responses['current-method'] === 'string' ? responses['current-method'] : undefined,
        q10_immersion_experience: typeof responses['vocabulary-system'] === 'string' ? responses['vocabulary-system'] : undefined,
        q11_accent_priority: typeof responses['accent-priority'] === 'string' ? responses['accent-priority'] : undefined,
        q12_goals: responses['timeline-expectations'],
        q13_challenges: responses['learning-obstacles'],
        q14_preferences: responses['communication-preference']
      };
      
      const dbResult = await storeAssessmentInDatabase(assessmentData);
      if (dbResult.success) {
        console.log('Assessment stored in database:', dbResult.id);
      } else {
        console.warn('Database storage failed:', dbResult.error);
      }
    } catch (error) {
      console.error('Error storing assessment data:', error);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Store data immediately when question 14 is completed
      await storeAssessmentData();
      stopQuizTimer();
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
    setTotalQuizTime(0);
    setIsTimerActive(false);
    setIsIdle(false);
    setDisplayTime('00:00');
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
    setIsStarted(false);
    setUserName('');
    setShowNameInput(false);
    setTotalQuizTime(0);
    setIsTimerActive(false);
    setIsIdle(false);
    setDisplayTime('00:00');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      startQuizTimer();
      setShowNameInput(false);
      setIsStarted(true);
    }
  };

  const handleStartAssessment = () => {
    if (userName.trim()) {
      // If name is already entered, start immediately
      startQuizTimer();
      setIsStarted(true);
    } else {
      // If no name, show name input and scroll to it
      setShowNameInput(true);
      
      // Scroll to the name input section on mobile
      setTimeout(() => {
        const nameInputSection = document.querySelector('.name-input-section');
        if (nameInputSection) {
          nameInputSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Auto-focus the name input
          const nameInput = nameInputSection.querySelector('input[type="text"]') as HTMLInputElement;
          if (nameInput) {
            nameInput.focus();
          }
        }
      }, 100);
    }
  };

  const handleEmailCapture = async (email: string) => {
    try {
      const results = calculateResults(responses);
      
      // Try to capture email via Beehiiv API
      try {
        const response = await fetch('/api/beehiiv-subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            responses,
            results
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('Email captured successfully:', data);
          } else {
            console.warn('Email capture failed:', data.message);
          }
        } else {
          console.warn('Email capture API not available:', response.status);
        }
      } catch (apiError) {
        console.warn('Email capture API error:', apiError);
        // Continue without throwing - email capture is optional
      }
      
      // Store assessment data in database (Supabase or localStorage fallback)
      try {
        const languageSelection = responses['language-selection'] as any;
        const assessmentData = {
          email,
          user_name: userName,
          selected_language: languageSelection?.language,
          custom_language: languageSelection?.customLanguage,
          intensity_level: responses['time-commitment'] as number || 0,
          learner_profile: results.learnerProfile?.title || 'Unknown',
          time_commitment: `${results.timeAllocation?.totalTime || 0} hours`,
          assessment_date: new Date().toISOString(),
          completion_time: Math.floor(totalQuizTime / 60000), // minutes
          responses: { ...responses, userName },
          results,
          
          // Individual question responses for detailed analysis
          q1_name: userName,
          q2_language_selection: responses['language-selection'],
          q3_motivation: responses['motivation'],
          q4_speaking_priority: typeof responses['speaking-priority'] === 'string' ? responses['speaking-priority'] : undefined,
          q5_capability_level: typeof responses['capability-level'] === 'string' ? responses['capability-level'] : undefined,
          q6_time_commitment: typeof responses['time-commitment'] === 'number' ? responses['time-commitment'] : undefined,
          q7_lifestyle: typeof responses['lifestyle'] === 'string' ? responses['lifestyle'] : undefined,
          q8_learning_style: typeof responses['content-consumption'] === 'string' ? responses['content-consumption'] : undefined,
          q9_current_method: typeof responses['current-method'] === 'string' ? responses['current-method'] : undefined,
          q10_immersion_experience: typeof responses['vocabulary-system'] === 'string' ? responses['vocabulary-system'] : undefined,
          q11_accent_priority: typeof responses['accent-priority'] === 'string' ? responses['accent-priority'] : undefined,
          q12_goals: responses['timeline-expectations'],
          q13_challenges: responses['learning-obstacles'],
          q14_preferences: responses['communication-preference']
        };
        
        const dbResult = await storeAssessmentInDatabase(assessmentData);
        if (dbResult.success) {
          console.log('Assessment stored in database:', dbResult.id);
        } else {
          console.warn('Database storage failed:', dbResult.error);
        }
      } catch (dbError) {
        console.warn('Database storage error:', dbError);
        // Fallback to localStorage
        await storeAssessmentDataLocalFallback(email, responses, results);
      }
      
    } catch (error) {
      console.error('Assessment data storage error:', error);
      // Don't throw - let the user continue even if storage fails
    }
  };

  const storeAssessmentDataLocalFallback = async (email: string, responses: UserResponses, results: any) => {
    try {
      const id = storeAssessmentDataLocal({
        email,
        responses: { ...responses, userName },
        results,
        timestamp: new Date().toISOString()
      });
      
      console.log('Assessment data stored with ID:', id);
    } catch (error) {
      console.error('Error storing assessment data:', error);
    }
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
              <InteractiveCalculator onStartAssessment={handleStartAssessment} />
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
              
              {/* Name Input */}
              {!showNameInput ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 name-input-section p-6 bg-blue-50 rounded-2xl border-2 border-blue-200"
                >
                  <p className="text-lg text-gray-700 mb-4">
                    First, what should I call you?
                  </p>
                  <div className="flex gap-4 justify-center items-center max-w-md mx-auto">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit(e)}
                    />
                    <motion.button
                      onClick={() => setShowNameInput(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 name-input-section p-6 bg-blue-50 rounded-2xl border-2 border-blue-200"
                >
                  <p className="text-lg text-gray-700 mb-4">
                    {userName ? `Nice to meet you, ${userName}!` : 'What should I call you?'}
                  </p>
                  <form onSubmit={handleNameSubmit} className="flex gap-4 justify-center items-center max-w-md mx-auto">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
                      autoFocus
                    />
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </motion.button>
                  </form>
                </motion.div>
              )}
              
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
        customLanguage={customLanguage}
        responses={responses}
        userName={userName}
        onEmailCapture={handleEmailCapture}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Timer Display */}
      {isStarted && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2"
          >
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              {displayTime}
            </span>
            {isIdle && (
              <span className="text-xs text-orange-600 font-medium">
                (Paused)
              </span>
            )}
          </motion.div>
        </div>
      )}
      
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
          customLanguage={customLanguage}
        />
      </AnimatePresence>
    </div>
  );
};

export default Calculator;
