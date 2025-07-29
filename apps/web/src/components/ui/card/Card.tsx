import type { JSX } from 'react';
import { useId } from 'react';

export interface CardProps {
  /** Title of the card, should be a heading element for accessibility */
  title: JSX.Element;
  /** Main content of the card */
  content: JSX.Element;
  /** Controls shadow depth: larger number = more elevated */
  elevation: number;
  /** Additional classes for the container */
  className?: string;
}

/**
 * A simple, accessible Card component with controlled elevation.
 */
export const Card = ({
  title,
  content,
  elevation,
  className = '',
}: CardProps): JSX.Element => {
  const id = useId();
  const titleId = `card-title-${id}`;

  const boxShadow = `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.1)`;

  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className={`rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`}
      style={{ boxShadow }}
    >
      <div id={titleId} className="px-4 py-2">
        {title}
      </div>
      <div className="px-4 py-2">{content}</div>
    </div>
  );
};
