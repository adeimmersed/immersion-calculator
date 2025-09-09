import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  startDelay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  className = '', 
  onComplete,
  startDelay = 0 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (startDelay > 0) {
      const delayTimer = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(delayTimer);
    } else {
      setHasStarted(true);
    }
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted || isComplete || currentIndex >= text.length) {
      if (currentIndex >= text.length && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isComplete, hasStarted, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setHasStarted(startDelay === 0);
  }, [text, startDelay]);

  return (
    <span className={`${className} ${!isComplete ? 'typewriter-cursor' : ''}`}>
      {displayText}
      {!isComplete && hasStarted && (
        <span className="inline-block w-3 h-5 bg-current ml-1 animate-pulse" />
      )}
    </span>
  );
};

export default TypewriterText;
