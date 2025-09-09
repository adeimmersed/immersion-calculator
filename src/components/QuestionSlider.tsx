import React from 'react';
import { motion } from 'framer-motion';

interface QuestionSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}

export const QuestionSlider: React.FC<QuestionSliderProps> = ({
  min,
  max,
  step,
  value,
  unit,
  onChange
}) => {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Value Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-32 h-16 bg-primary-100 rounded-xl border-2 border-primary-200">
          <span className="text-2xl font-bold text-primary-700">
            {formatTime(value)}
          </span>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative mb-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
        
        {/* Custom thumb styling via CSS */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #4F46E5;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          }
          
          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #4F46E5;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          }
        `}</style>
      </div>

      {/* Range Labels */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(min)}</span>
        <span>{formatTime(max)}</span>
      </div>

      {/* Helpful markers */}
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>Minimal</span>
        <span>Moderate</span>
        <span>Intensive</span>
        <span>Extreme</span>
      </div>
    </motion.div>
  );
};

export default QuestionSlider;
