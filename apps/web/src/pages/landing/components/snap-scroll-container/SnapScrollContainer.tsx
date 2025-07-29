import type { JSX, ReactNode } from 'react';

export const SnapScrollContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}): JSX.Element => {
  return (
    <div className={`snap-y snap-mandatory scroll-smooth ${className}`}>
      {children}
    </div>
  );
};
