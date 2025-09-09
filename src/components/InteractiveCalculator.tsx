import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InteractiveCalculatorProps {
  onStartAssessment: () => void;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({ onStartAssessment }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [displayText, setDisplayText] = useState('IMMERSION INTENSITY 0');

  // Intensity levels with descriptions
  const intensityLevels = [
    { level: 0, title: 'TOURIST', description: 'Occasional exposure, basic phrases' },
    { level: 1, title: 'DABBLER', description: 'Weekly practice, simple conversations' },
    { level: 2, title: 'CASUAL', description: 'Regular study, basic media consumption' },
    { level: 3, title: 'COMMITTED', description: 'Daily practice, structured learning' },
    { level: 4, title: 'SERIOUS', description: 'Multiple hours daily, varied content' },
    { level: 5, title: 'FOCUSED', description: 'Immersive environment, active usage' },
    { level: 6, title: 'INTENSIVE', description: 'Near-native environment simulation' },
    { level: 7, title: 'OBSESSED', description: 'Total immersion, thinking in language' },
    { level: 8, title: 'NATIVE-LIKE', description: 'Complete integration, cultural fluency' },
    { level: 9, title: 'LEGENDARY', description: 'Teaching others, mastery achieved' }
  ];

  const currentLevel = intensityLevels[currentValue] || intensityLevels[0];

  useEffect(() => {
    setDisplayText(`IMMERSION INTENSITY ${currentValue}`);
  }, [currentValue]);

  const handleButtonClick = (action: string) => {
    switch (action) {
      case '+':
        if (currentValue < 9) {
          setCurrentValue(prev => prev + 1);
        }
        break;
      case '-':
        if (currentValue > 0) {
          setCurrentValue(prev => prev - 1);
        }
        break;
      case 'C':
        setCurrentValue(0);
        break;
      case '=':
        onStartAssessment();
        break;
    }
  };

  return (
    <div className="retro-calculator mx-auto" style={{ maxWidth: '400px' }}>
      {/* Calculator Screen */}
      <div className="calculator-screen text-center">
        <div className="calculator-lcd text-lg mb-2">
          {displayText}
        </div>
        <div className="text-xs text-green-300 opacity-80">
          {currentLevel.title}
        </div>
      </div>

      {/* Level Description */}
      <motion.div
        key={currentValue}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-white text-sm font-semibold mb-1">
          Level {currentValue}: {currentLevel.title}
        </div>
        <div className="text-gray-300 text-xs">
          {currentLevel.description}
        </div>
      </motion.div>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          onClick={() => handleButtonClick('C')}
          className="calculator-button special text-sm"
        >
          C
        </button>
        <button
          onClick={() => handleButtonClick('-')}
          className="calculator-button operator text-sm"
          disabled={currentValue <= 0}
        >
          −
        </button>
        <button
          onClick={() => handleButtonClick('+')}
          className="calculator-button operator text-sm"
          disabled={currentValue >= 9}
        >
          +
        </button>
        <button
          onClick={() => handleButtonClick('=')}
          className="calculator-button special text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        >
          =
        </button>

        {/* Number pad for show */}
        <div className="calculator-button text-sm">7</div>
        <div className="calculator-button text-sm">8</div>
        <div className="calculator-button text-sm">9</div>
        <div className="calculator-button operator text-sm">÷</div>
        
        <div className="calculator-button text-sm">4</div>
        <div className="calculator-button text-sm">5</div>
        <div className="calculator-button text-sm">6</div>
        <div className="calculator-button operator text-sm">×</div>
        
        <div className="calculator-button text-sm">1</div>
        <div className="calculator-button text-sm">2</div>
        <div className="calculator-button text-sm">3</div>
        <div className="calculator-button operator text-sm">−</div>
        
        <div className="calculator-button col-span-2 text-sm">0</div>
        <div className="calculator-button text-sm">.</div>
        <div className="calculator-button operator text-sm">+</div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-white text-xs opacity-80 mb-2">
          Use + and − to explore intensity levels
        </p>
        <p className="text-white text-xs opacity-80">
          Press = to start your personalized assessment
        </p>
      </div>
    </div>
  );
};

export default InteractiveCalculator;
