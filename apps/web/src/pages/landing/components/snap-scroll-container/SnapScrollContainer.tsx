import type { JSX, ReactNode } from 'react';

export const SnapScrollContainer = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return <div className="snap-y snap-mandatory scroll-smooth">{children}</div>;
};
