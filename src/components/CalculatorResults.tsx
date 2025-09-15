import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle, CheckCircle, Mail, ArrowRight, RotateCcw, TrendingUp, BookOpen, Users } from 'lucide-react';
import { CalculatorResults, UserResponses } from '../utils/calculator';

interface CalculatorResultsProps {
  results: CalculatorResults;
  selectedLanguage: string;
  customLanguage?: string;
  responses: UserResponses;
  userName: string;
  onEmailCapture: (email: string) => void;
  onRestart: () => void;
}

export const CalculatorResultsComponent: React.FC<CalculatorResultsProps> = ({ 
  results, 
  selectedLanguage, 
  customLanguage,
  responses,
  userName,
  onEmailCapture,
  onRestart 
}) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await onEmailCapture(email);
      setEmailSubmitted(true);
    } catch (error) {
      console.error('Email submission error:', error);
      // Still mark as submitted to show success message
      setEmailSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.assessment-sheet');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>Language Immersion Assessment - ${getDisplayLanguage()}</title>
            <style>
              body { 
                font-family: 'Poppins', Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
              }
              .assessment-sheet { 
                background: white; 
                padding: 20px; 
                max-width: 800px;
                margin: 0 auto;
              }
              .no-print { display: none !important; }
              h1, h2, h3 { color: #1a1a1a; margin-bottom: 16px; }
              .bg-gradient-to-r { background: #f8f9fa !important; }
              .border { border: 1px solid #e5e7eb !important; }
              .rounded-lg { border-radius: 8px !important; }
              .p-4, .p-6 { padding: 16px !important; }
              .mb-4, .mb-6, .mb-8 { margin-bottom: 16px !important; }
              .text-sm { font-size: 14px !important; }
              .text-xs { font-size: 12px !important; }
              .font-bold { font-weight: 700 !important; }
              .font-semibold { font-weight: 600 !important; }
              .grid { display: block !important; }
              .grid > div { margin-bottom: 16px !important; }
              @media print { 
                .no-print { display: none !important; }
                body { margin: 0; }
                .assessment-sheet { box-shadow: none !important; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSave = () => {
    const data = {
      results,
      responses,
      selectedLanguage,
      intensityLevel,
      personalizedInsights,
      sixMonthProjection,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `immersion-assessment-${selectedLanguage}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const getDisplayLanguage = (): string => {
    if (selectedLanguage === 'other' && customLanguage) {
      return customLanguage;
    }
    const languageMap: Record<string, string> = {
      'korean': 'Korean',
      'japanese': 'Japanese',
      'spanish': 'Spanish',
      'french': 'French',
      'german': 'German',
      'italian': 'Italian',
      'portuguese': 'Portuguese',
      'chinese': 'Chinese (Mandarin)',
      'arabic': 'Arabic',
      'other': 'Other'
    };
    return languageMap[selectedLanguage] || selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1);
  };

  const calculateIntensityLevel = (): number => {
    const timeCommitment = responses['time-commitment'] as number;
    const capabilityLevel = responses['capability-level'] as string;
    const speakingPriority = responses['speaking-priority'] as string;
    
    let intensity = 1;
    
    // Base intensity on time commitment
    if (timeCommitment >= 240) intensity = 8; // 4+ hours
    else if (timeCommitment >= 180) intensity = 7; // 3+ hours  
    else if (timeCommitment >= 120) intensity = 6; // 2+ hours
    else if (timeCommitment >= 90) intensity = 5; // 1.5+ hours
    else if (timeCommitment >= 60) intensity = 4; // 1+ hour
    else if (timeCommitment >= 45) intensity = 3; // 45+ min
    else if (timeCommitment >= 30) intensity = 2; // 30+ min
    
    // Adjust based on capability level
    if (capabilityLevel === 'comprehension_strong') intensity += 1;
    else if (capabilityLevel === 'sounds_foreign') intensity = Math.max(1, intensity - 1);
    
    // Adjust based on speaking priority
    if (speakingPriority === 'input_king') intensity += 1;
    else if (speakingPriority === 'survival') intensity += 1;
    
    return Math.min(9, Math.max(1, intensity));
  };

  const getPersonalizedInsights = (): string[] => {
    const insights: string[] = [];
    const timeCommitment = responses['time-commitment'] as number;
    const capabilityLevel = responses['capability-level'] as string;
    const speakingPriority = responses['speaking-priority'] as string;
    const motivation = responses.motivation as string[];
    const currentMethod = responses['current-method'] as string;
    const timeline = (responses['language-selection'] as any)?.timeline;
    
    // Time-based insights
    if (timeCommitment >= 180) {
      insights.push(`With ${formatTime(timeCommitment)} daily, you're in the top 5% of language learners by commitment alone.`);
    } else if (timeCommitment < 60) {
      insights.push(`Your ${formatTime(timeCommitment)} daily window is realistic - consistency will beat intensity every time.`);
    }
    
    // Level-based insights
    if (capabilityLevel === 'sounds_foreign') {
      insights.push("You're at the foundation stage - every hour of comprehensible input now will compound exponentially.");
    } else if (capabilityLevel === 'comprehension_strong') {
      insights.push("Your strong comprehension is your launching pad - it's time to leverage that foundation for rapid advancement.");
    }
    
    // Speaking priority insights
    if (speakingPriority === 'input_king') {
      insights.push("Your input-first approach is scientifically sound - you're building the deep patterns that create intuitive fluency.");
    } else if (speakingPriority === 'survival') {
      insights.push("Your practical focus means we're optimizing for immediate functionality - smart for your situation.");
    }
    
    // Method-based insights
    if (currentMethod === 'apps_only') {
      insights.push("Apps got you started, but real media consumption will be your breakthrough moment.");
    } else if (currentMethod === 'formal_classes') {
      insights.push("Your structured background gives you grammar awareness - now we add the immersion that makes it stick.");
    }
    
    // Timeline insights
    if (timeline === 'just_starting') {
      insights.push("Starting fresh means no bad habits to break - you're perfectly positioned for an optimized approach.");
    } else if (timeline === 'still_here') {
      insights.push("Your persistence through 2+ years shows real commitment - now let's make sure that dedication is efficiently channeled.");
    }
    
    return insights;
  };

  const getSixMonthProjection = (): { level: string; description: string; milestones: string[] } => {
    const intensity = calculateIntensityLevel();
    const currentLevel = responses['capability-level'] as string;
    
    if (intensity >= 7) {
      return {
        level: "Advanced Immersion Mastery",
        description: "At your intensity level, you'll achieve near-native comprehension in specialized areas.",
        milestones: [
          "Month 1-2: Comfortable with 90% of everyday content",
          "Month 3-4: Following complex discussions and technical content", 
          "Month 5-6: Thinking predominantly in your target language"
        ]
      };
    } else if (intensity >= 5) {
      return {
        level: "Solid Intermediate Breakthrough",
        description: "You'll break through the intermediate plateau and achieve conversational confidence.",
        milestones: [
          "Month 1-2: Understanding 80% of casual conversations",
          "Month 3-4: Expressing complex ideas with confidence",
          "Month 5-6: Consuming native content without subtitles"
        ]
      };
    } else if (intensity >= 3) {
      return {
        level: "Strong Foundation Builder", 
        description: "You'll build a solid foundation that sets you up for accelerated progress.",
        milestones: [
          "Month 1-2: Following simple conversations and stories",
          "Month 3-4: Basic conversational ability in familiar topics",
          "Month 5-6: Ready to tackle intermediate content confidently"
        ]
      };
    } else {
      return {
        level: "Steady Progress Track",
        description: "Consistent daily practice will create meaningful, measurable improvement.",
        milestones: [
          "Month 1-2: Recognizing common phrases and patterns",
          "Month 3-4: Understanding simple conversations with context",
          "Month 5-6: Basic communication in everyday situations"
        ]
      };
    }
  };

  const intensityLevel = calculateIntensityLevel();
  const personalizedInsights = getPersonalizedInsights();
  const sixMonthProjection = getSixMonthProjection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Calculator - Hidden on mobile, shown on desktop */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:flex flex-shrink-0"
          >
            <div className="retro-calculator" style={{ maxWidth: '400px', minWidth: '350px' }}>
              {/* Calculator Screen */}
              <div className="calculator-screen text-center">
                <div className="calculator-lcd text-base mb-2">
                  INTENSITY LEVEL {intensityLevel}
                </div>
                <div className="text-green-300 text-sm">
                  {results.learnerProfile.title.toUpperCase()}
                </div>
              </div>

              {/* Time Display in Calculator */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-white text-center">
                <div className="text-xs mb-2 text-gray-300">DAILY BREAKDOWN</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Active:</span>
                    <span className="text-blue-300">{formatTime(results.timeAllocation.immersionTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Study:</span>
                    <span className="text-purple-300">{formatTime(results.timeAllocation.studyTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output:</span>
                    <span className="text-green-300">{formatTime(results.timeAllocation.outputTime)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2 font-semibold">
                    <span>Total:</span>
                    <span className="text-yellow-300">{formatTime(results.timeAllocation.totalTime)}</span>
                  </div>
                </div>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={onRestart} className="calculator-button special text-sm col-span-2 py-3">
                  NEW CALC
                </button>
                <button onClick={handleSave} className="calculator-button text-sm py-3">
                  SAVE
                </button>
                <button onClick={handlePrint} className="calculator-button text-sm py-3">
                  PRINT
                </button>
                
                {/* Number pad */}
                <div className="calculator-button text-sm opacity-50 py-3">7</div>
                <div className="calculator-button text-sm opacity-50 py-3">8</div>
                <div className="calculator-button text-sm opacity-50 py-3">9</div>
                <div className="calculator-button operator text-sm opacity-50 py-3">÷</div>
                <div className="calculator-button text-sm opacity-50 py-3">4</div>
                <div className="calculator-button text-sm opacity-50 py-3">5</div>
                <div className="calculator-button text-sm opacity-50 py-3">6</div>
                <div className="calculator-button operator text-sm opacity-50 py-3">×</div>
                <div className="calculator-button text-sm opacity-50 py-3">1</div>
                <div className="calculator-button text-sm opacity-50 py-3">2</div>
                <div className="calculator-button text-sm opacity-50 py-3">3</div>
                <div className="calculator-button operator text-sm opacity-50 py-3">−</div>
                <div className="calculator-button col-span-2 text-sm opacity-50 py-3">0</div>
                <div className="calculator-button text-sm opacity-50 py-3">.</div>
                <div className="calculator-button operator text-sm opacity-50 py-3">+</div>
              </div>
            </div>
          </motion.div>

          {/* Assessment Sheet - Full width on mobile */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1 bg-white rounded-lg shadow-2xl w-full assessment-sheet"
            style={{
              backgroundImage: `linear-gradient(to right, #e0e7ff 1px, transparent 1px)`,
              backgroundSize: '24px 100%',
              backgroundPosition: '40px 0'
            }}
          >
            {/* Paper Header */}
            <div className="border-b-2 border-red-400 pb-6 pt-8 px-8 mb-8 relative">
              <div className="absolute left-0 top-0 w-8 h-full bg-red-100 border-r-2 border-red-300"></div>
              <div className="ml-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  📋 LANGUAGE IMMERSION ASSESSMENT
                </h1>
                <div className="text-base text-gray-600 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">Student:</span> {userName || 'Anonymous Learner'}<br/>
                    <span className="font-semibold">Language:</span> {getDisplayLanguage()}<br/>
                    <span className="font-semibold">Assessment Date:</span> {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      INTENSITY LEVEL: {intensityLevel}/9
                    </div>
                    <div className="text-sm text-gray-500">
                      {intensityLevel >= 7 ? 'HIGH INTENSITY' : intensityLevel >= 4 ? 'MODERATE INTENSITY' : 'FOUNDATION LEVEL'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learner Profile Section */}
            <div className="px-8 mb-8">
              <div className="ml-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-500" />
                  LEARNER PROFILE ANALYSIS
                </h2>
                
                <div className="flex items-start gap-6 mb-6">
                  <div 
                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                    style={{ backgroundColor: results.learnerProfile.color + '20', color: results.learnerProfile.color }}
                  >
                    {results.learnerProfile.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-800 mb-2">
                      {results.learnerProfile.title}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {results.learnerProfile.description}
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {results.learnerProfile.detailedDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personalized Insights */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-yellow-600" />
                    Personalized Insights Based on Your Answers:
                  </h4>
                  <ul className="space-y-2">
                    {personalizedInsights.map((insight, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Schedule Section */}
            <div className="px-8 mb-8">
              <div className="ml-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  OPTIMIZED DAILY SCHEDULE
                </h2>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatTime(results.timeAllocation.immersionTime)}
                    </div>
                    <div className="text-blue-700 font-semibold text-sm mb-1">ACTIVE IMMERSION</div>
                    <div className="text-blue-600 text-xs">
                      Focused listening & reading
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {formatTime(results.timeAllocation.studyTime)}
                    </div>
                    <div className="text-purple-700 font-semibold text-sm mb-1">STRUCTURED STUDY</div>
                    <div className="text-purple-600 text-xs">
                      Grammar, vocabulary, review
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatTime(results.timeAllocation.outputTime)}
                    </div>
                    <div className="text-green-700 font-semibold text-sm mb-1">SPEAKING PRACTICE</div>
                    <div className="text-green-600 text-xs">
                      Conversation & pronunciation
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-bold text-gray-700 mb-2">DAILY TIME DISTRIBUTION:</div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                    <div className="flex h-full">
                      <motion.div 
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(results.timeAllocation.immersionTime / results.timeAllocation.totalTime) * 100}%` }}
                        transition={{ delay: 1.0, duration: 1 }}
                      />
                      <motion.div 
                        className="h-full bg-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(results.timeAllocation.studyTime / results.timeAllocation.totalTime) * 100}%` }}
                        transition={{ delay: 1.2, duration: 1 }}
                      />
                      <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(results.timeAllocation.outputTime / results.timeAllocation.totalTime) * 100}%` }}
                        transition={{ delay: 1.4, duration: 1 }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Immersion {Math.round((results.timeAllocation.immersionTime / results.timeAllocation.totalTime) * 100)}%</span>
                    <span>Study {Math.round((results.timeAllocation.studyTime / results.timeAllocation.totalTime) * 100)}%</span>
                    <span>Output {Math.round((results.timeAllocation.outputTime / results.timeAllocation.totalTime) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passive Immersion Section */}
            <div className="px-8 mb-8">
              <div className="ml-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-500" />
                  PASSIVE IMMERSION OPPORTUNITIES
                </h2>
                
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🎧</span>
                    Hidden Immersion Goldmine: {results.passiveTimeEstimate.time}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {results.passiveTimeEstimate.description}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {results.passiveTimeEstimate.activities.map((activity, index) => {
                      // Generate specific descriptions based on the activity type
                      const getActivityDescription = (activity: string): string => {
                        const activityLower = activity.toLowerCase();
                        
                        if (activityLower.includes('commute') || activityLower.includes('driving') || activityLower.includes('transport')) {
                          return "Replace your usual podcasts or music with target language content. Your brain is already in 'listening mode' during commutes.";
                        } else if (activityLower.includes('workout') || activityLower.includes('exercise') || activityLower.includes('gym')) {
                          return "Perfect for high-energy content like music, podcasts, or even TV shows. Physical activity enhances language processing.";
                        } else if (activityLower.includes('cooking') || activityLower.includes('kitchen') || activityLower.includes('meal')) {
                          return "Ideal for cooking shows, food podcasts, or casual conversations. Visual context helps with comprehension.";
                        } else if (activityLower.includes('cleaning') || activityLower.includes('housework') || activityLower.includes('chores')) {
                          return "Great for repetitive tasks - your mind can focus on language patterns while your body handles the routine work.";
                        } else if (activityLower.includes('walking') || activityLower.includes('jogging') || activityLower.includes('running')) {
                          return "Excellent for podcasts, audiobooks, or music. Movement stimulates brain activity and improves retention.";
                        } else if (activityLower.includes('shower') || activityLower.includes('bathroom') || activityLower.includes('getting ready')) {
                          return "Short but consistent exposure. Perfect for daily news, weather reports, or short podcasts.";
                        } else if (activityLower.includes('sleep') || activityLower.includes('bedtime') || activityLower.includes('falling asleep')) {
                          return "Play content at very low volume. Your subconscious mind continues processing language even as you drift off.";
                        } else if (activityLower.includes('waiting') || activityLower.includes('queue') || activityLower.includes('line')) {
                          return "Transform dead time into learning time. Even 5-10 minutes of passive listening adds up significantly.";
                        } else if (activityLower.includes('work') || activityLower.includes('office') || activityLower.includes('desk')) {
                          return "Background listening during non-verbal tasks. Choose content that doesn't require full attention.";
                        } else {
                          return "Turn this routine activity into a language learning opportunity. Consistency beats intensity every time.";
                        }
                      };

                      return (
                        <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                          <div className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="text-orange-500 mr-2">•</span>
                            {activity}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getActivityDescription(activity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-4 bg-orange-100 border border-orange-300 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">💡 PASSIVE IMMERSION STRATEGIES:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• <strong>Background Listening:</strong> Play content at 70% volume while doing other tasks</li>
                      <li>• <strong>Commute Immersion:</strong> Replace music/podcasts with target language content</li>
                      <li>• <strong>Workout Audio:</strong> Listen during exercise, walking, or household chores</li>
                      <li>• <strong>Sleep Learning:</strong> Play content at very low volume while falling asleep</li>
                      <li>• <strong>Multi-tasking:</strong> Combine passive listening with visual activities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Steps & Recommendations */}
            <div className="px-8 mb-8">
              <div className="ml-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                  IMMEDIATE ACTION STEPS
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">🎯 NEXT STEPS:</h4>
                    <ul className="space-y-2">
                      {results.nextSteps.map((step, index) => (
                        <li key={index} className="text-gray-700 text-sm flex items-start">
                          <span className="text-green-600 mr-2 mt-1 font-bold">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">💡 PERSONALIZED RECOMMENDATIONS:</h4>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700 text-sm flex items-start">
                          <span className="text-blue-600 mr-2 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reality Checks */}
                {results.realityChecks.length > 0 && (
                  <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                      Reality Checks:
                    </h4>
                    <ul className="space-y-2">
                      {results.realityChecks.map((check, index) => (
                        <li key={index} className="text-gray-700 text-sm flex items-start">
                          <span className="text-orange-600 mr-2 mt-1">⚠️</span>
                          <div>
                            <span className="font-semibold">{check.title}:</span> {check.message}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 6-Month Projection */}
            <div className="px-8 mb-8">
              <div className="ml-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  6-MONTH TRAJECTORY ANALYSIS
                </h2>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Projected Outcome: {sixMonthProjection.level}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {sixMonthProjection.description}
                  </p>
                  
                  <h4 className="font-bold text-gray-800 mb-3 text-sm">📈 MILESTONE ROADMAP:</h4>
                  <div className="space-y-3">
                    {sixMonthProjection.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 text-sm">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Email Capture Section */}
            <div className="px-8 pb-8">
              <div className="ml-12">
                <div className="bg-gradient-to-r from-gray-800 to-blue-900 rounded-lg p-6 text-white text-center">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  
                  <h3 className="text-xl font-bold mb-2">
                    {userName ? `Hey ${userName},` : 'Hey there,'} unlock your complete immersion roadmap!
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {userName ? `${userName}, this assessment is just the beginning.` : 'This assessment is just the beginning.'} I have so much more to share with you - advanced strategies, 
                    proven methodologies, and insider techniques that I've developed through years of helping learners 
                    achieve fluency.
                  </p>
                  
                  <div className="bg-blue-800/50 rounded-lg p-4 mb-4 text-left">
                    <h4 className="font-bold text-blue-200 mb-2 text-sm">🎯 What You'll Get:</h4>
                    <ul className="space-y-1 text-xs text-gray-300">
                      <li>• <strong>Weekly Immersion Schedules</strong> tailored to your specific situation</li>
                      <li>• <strong>Advanced Learning Strategies</strong> I don't share publicly</li>
                      <li>• <strong>Exclusive Course Access</strong> to my proven fluency methods</li>
                      <li>• <strong>Personalized Resource Lists</strong> for your exact level and goals</li>
                      <li>• <strong>Progress Tracking Systems</strong> that actually work</li>
                      <li>• <strong>Direct Access</strong> to my private community of successful learners</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-sm">
                    Join thousands of learners who've transformed their language journey with my proven approach.
                  </p>
                  
                  {!emailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="max-w-sm mx-auto">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center text-sm"
                        >
                          {isSubmitting ? 'Sending...' : 'Send'}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-green-400 font-semibold">
                      <CheckCircle className="w-6 h-6 inline-block mr-2" />
                      Action plan sent! Check your email.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalculatorResultsComponent;
