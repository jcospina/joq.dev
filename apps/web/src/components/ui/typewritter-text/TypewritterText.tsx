import { useEffect, useState, useRef, useCallback, type JSX } from 'react';
import './typewritter-text.css';

// Typewriter component: animates text typing and deletion with a single rAF loop
// Improvements:
// 1. External CSS file for blink animation (no inline <style>)
// 2. No "as any" — use refs for timing instead of function properties

export interface TypewriterProps {
  /** The full string to display via typing animations */
  children: string;
  /** Average delay (ms) between each character typed/deleted */
  speed?: number;
  /** Maximum randomized variance (± ms) added to each tick for a human feel */
  variance?: number;
  /** Whether typing starts immediately on mount or children changes */
  playing?: boolean;
  /** Optional callback when full text has been reached (or fully cleared) */
  onComplete?: () => void;
  /** Tailwind classes for the outer wrapper */
  className?: string;
  /** Tailwind classes for the text span */
  textClassName?: string;
  /** Tailwind classes for the cursor span (include "tw-cursor" in your class list) */
  cursorClassName?: string;
}

const DEFAULT_SPEED = 100;
const DEFAULT_VARIANCE = 50;

export const Typewriter = ({
  children,
  speed = DEFAULT_SPEED,
  variance = DEFAULT_VARIANCE,
  playing = true,
  onComplete,
  className = '',
  textClassName = '',
  cursorClassName = '',
}: TypewriterProps): JSX.Element => {
  // -- State & Refs ---------------------------------------------------------
  const [displayText, setDisplayText] = useState('');

  // Config refs to keep our loop identity stable
  const speedRef = useRef(speed);
  const varianceRef = useRef(variance);

  // The target string for typing/deletion
  const targetRef = useRef(children);

  // Controls whether typing is paused
  const pausedRef = useRef(!playing);
  // Ensures onComplete fires only once per cycle
  const finishedRef = useRef(false);

  // Timing refs (no more function properties)
  const lastTimeRef = useRef<number>(0);
  const nextTimeRef = useRef<number>(0);

  // -- Sync props into refs -------------------------------------------------
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    varianceRef.current = variance;
  }, [variance]);
  useEffect(() => {
    pausedRef.current = !playing;
  }, [playing]);

  useEffect(() => {
    targetRef.current = children;
    finishedRef.current = false;
    if (playing) pausedRef.current = false;
  }, [children, playing]);

  // -- Core typing loop using requestAnimationFrame ------------------------
  const loop = useCallback(
    (time: number) => {
      // Schedule next animation frame
      window.requestAnimationFrame(loop);

      // Skip if paused or already finished
      if (pausedRef.current || finishedRef.current) return;

      // Read timing from refs
      const lastTime = lastTimeRef.current || time;
      const nextTime = nextTimeRef.current || time;
      lastTimeRef.current = lastTime;
      nextTimeRef.current = nextTime;

      // If it's not time yet, wait
      if (time < nextTime) return;

      // Update displayText by one character toward target
      setDisplayText(prev => {
        const target = targetRef.current;
        let next = '';
        if (prev.length < target.length) {
          next = prev + target[prev.length];
        } else if (prev.length > target.length) {
          next = prev.slice(0, -1);
        } else {
          finishedRef.current = true;
          onComplete?.();
          return prev;
        }
        return next;
      });

      // Compute randomized delay and schedule next tick
      const delta = (Math.random() * 2 - 1) * varianceRef.current;
      const delay = Math.max(20, speedRef.current + delta);
      nextTimeRef.current = time + delay;
    },
    [onComplete],
  );

  // Kick off the loop once on mount
  useEffect(() => {
    const handle = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(handle);
  }, [loop]);

  // -- Render ---------------------------------------------------------------
  return (
    <div className={className} aria-live="polite">
      <span className={textClassName} role="text">
        {displayText}
        <span className={`${cursorClassName} cursor`} aria-hidden="true">
          |
        </span>
      </span>
    </div>
  );
};
