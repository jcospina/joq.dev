import type { JSX } from 'react';

import { ScrollIndicator } from '@ui/scroll-indicator/ScrollIndicator';
import { Typewriter } from '@ui/typewritter-text/TypewritterText';
import './welcome.css';

export const Welcome = (): JSX.Element => {
  return (
    <div className="relative">
      <ScrollIndicator />
      <div className="flex items-center justify-center flex-col gap-3">
        <h1 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center">
          <Typewriter speed={75} variance={10}>
            Hello, I'm Juan Ospina.
          </Typewriter>
        </h1>
        <div className="text-3xl welcome-text">Welcome to my page</div>
      </div>
    </div>
  );
};
