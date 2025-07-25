import type { JSX } from 'react';

export const Welcome = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
        Hello, I'm Juan Ospina
      </h1>
    </div>
  );
};
