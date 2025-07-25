import { useState, useEffect, type JSX } from 'react';
import './typewritter-text.css';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TypewriterText = ({
  text,
  delay = 100,
  className = '',
}: TypewriterTextProps): JSX.Element => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 750);

      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={`typewriter-text ${className}`.trim()}>
      {displayText}
      <span
        className={`typewriter-cursor ${showCursor ? 'visible' : 'hidden'}`}
      />
    </span>
  );
};
