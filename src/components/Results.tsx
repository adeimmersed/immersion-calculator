import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { CalculatorResults } from '../utils/calculator';
import TypewriterText from './TypewriterText';

interface ResultsProps {
  results: CalculatorResults;
  selectedLanguage: string;
  onEmailCapture: (email: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ results, selectedLanguage, onEmailCapture }) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    await onEmailCapture(email);
    setEmailSubmitted(true);
    setIsSubmitting(false);
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto"
      >
        {/* Calculator Shell for Results */}
        <div className="retro-calculator mx-auto" style={{ maxWidth: '900px' }}>
          {/* Calculator Screen - Shows Final Result */}
          <div className="calculator-screen text-center">
            <div className="calculator-lcd text-lg mb-2">
              CALCULATION COMPLETE
            </div>
            <div className="text-green-300 text-base">
              INTENSITY LEVEL: 5
            </div>
          </div>
          {/* Calculation Breakdown Paper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-8 mb-6 shadow-2xl"
            style={{
              backgroundImage: `linear-gradient(to right, #e0e7ff 1px, transparent 1px)`,
              backgroundSize: '20px 100%',
              backgroundPosition: '40px 0'
            }}
          >
            {/* Paper Header */}
            <div className="border-b-2 border-red-400 pb-4 mb-6 relative">
              <div className="absolute left-0 top-0 w-8 h-full bg-red-100 border-r-2 border-red-300"></div>
              <div className="ml-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  🧮 IMMERSION INTENSITY CALCULATION
                </h1>
                <div className="text-sm text-gray-600 flex justify-between">
                  <span>Language: {selectedLanguage}</span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Profile Result - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8 ml-12"
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4 shadow-lg"
                style={{ backgroundColor: results.learnerProfile.color + '20', color: results.learnerProfile.color }}
              >
                {results.learnerProfile.icon}
              </div>
              
              <h2 className="text-2xl font-black text-gray-800 mb-2">
                RESULT: {results.learnerProfile.title}
              </h2>
              
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                <p className="text-gray-700 font-medium">
                  {results.learnerProfile.description}
                </p>
              </div>
            </motion.div>

            {/* Calculation Steps */}
            <div className="ml-12 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2">
                📊 CALCULATION BREAKDOWN:
              </h3>
              
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>Base Intensity Score:</span>
                  <span className="font-bold">{Math.round(5 * 0.6)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>Time Commitment Multiplier:</span>
                  <span className="font-bold">×{(results.timeAllocation.totalTime / 60).toFixed(1)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>Lifestyle Integration Bonus:</span>
                  <span className="font-bold">+{Math.round(5 * 0.2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>Motivation Factor:</span>
                  <span className="font-bold">×{(5 / 10).toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t-2 border-blue-300">
                  <span>FINAL INTENSITY LEVEL:</span>
                  <span>5/10</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Time Allocation Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="content-dialog mb-8"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center flex items-center justify-center">
            <Clock className="w-8 h-8 mr-3 text-blue-500" />
            Your Personalized Daily Schedule
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="text-4xl font-black text-blue-600 mb-3">
                {formatTime(results.timeAllocation.immersionTime)}
              </div>
              <div className="text-blue-700 font-semibold text-lg mb-2">Active Immersion</div>
              <div className="text-blue-600 text-base">
                Focused listening & reading
              </div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="text-4xl font-black text-purple-600 mb-3">
                {formatTime(results.timeAllocation.studyTime)}
              </div>
              <div className="text-purple-700 font-semibold text-lg mb-2">Structured Study</div>
              <div className="text-purple-600 text-base">
                Grammar, vocabulary, review
              </div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <div className="text-4xl font-black text-green-600 mb-3">
                {formatTime(results.timeAllocation.outputTime)}
              </div>
              <div className="text-green-700 font-semibold text-lg mb-2">Speaking Practice</div>
              <div className="text-green-600 text-base">
                Conversation & pronunciation
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
            <div className="flex h-full">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(results.timeAllocation.immersionTime / results.timeAllocation.totalTime) * 100}%` }}
                transition={{ delay: 1.5, duration: 1 }}
              />
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(results.timeAllocation.studyTime / results.timeAllocation.totalTime) * 100}%` }}
                transition={{ delay: 1.8, duration: 1 }}
              />
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${(results.timeAllocation.outputTime / results.timeAllocation.totalTime) * 100}%` }}
                transition={{ delay: 2.1, duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

      {/* Passive Time Goldmine */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 mb-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3" />
          Hidden Immersion Goldmine: {results.passiveTimeEstimate.time}
        </h2>
        
        <p className="text-lg mb-6 text-white/90">
          {results.passiveTimeEstimate.description}
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {results.passiveTimeEstimate.activities.map((activity, index) => (
            <div key={index} className="bg-white/20 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 mb-2" />
              <div className="text-sm font-medium">{activity}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reality Checks */}
      {results.realityChecks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-orange-500" />
            Reality Checks
          </h2>
          
          <div className="space-y-4">
            {results.realityChecks.map((check, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border-l-4 bg-orange-50 border-orange-400"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{check.title}</h3>
                <p className="text-gray-700">{check.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Personalized Recommendations for {selectedLanguage}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategic Focus Areas</h3>
            <ul className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Next 3 Action Steps</h3>
            <ol className="space-y-3">
              {results.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>

        {/* Email Capture - Dark Gradient Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-gradient-to-br from-gray-900 via-blue-900 to-black rounded-3xl shadow-2xl p-12 text-white text-center mt-16"
          style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          }}
        >
          {!emailSubmitted ? (
            <>
              <Mail className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
              <h2 className="text-4xl font-black mb-6">
                Get Your Personalized 6-Month Reality Check
              </h2>
              <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Where will you be in 6 months if you continue like this? I'll send you a personalized assessment of your trajectory, plus exclusive immersion strategies that aren't in this calculator.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto">
                <div className="flex gap-4 mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="flex-1 px-6 py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-black rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 flex items-center text-lg shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send It
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <p className="text-gray-400 text-base">
                No spam. Unsubscribe anytime. Privacy policy respected.
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12"
            >
              <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-400" />
              <h2 className="text-4xl font-black mb-6">Check Your Email!</h2>
              <p className="text-xl text-gray-300">
                Your personalized reality check is on its way. Check your inbox (and spam folder) in the next few minutes.
              </p>
            </motion.div>
          )}
      </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0 }}
          className="text-center mt-16 text-gray-500"
        >
          <p className="text-lg">
            Created with ❤️ for serious language learners by{' '}
            <a href="https://adeimmersed.com" className="text-blue-500 hover:text-blue-600 font-semibold">
              AdeImmersed.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
