import type { JSX, ReactNode } from 'react';
import './scroll-section.css';
export const ScrollSection = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return (
    <div className="section flex items-center justify-center">{children}</div>
  );
};
