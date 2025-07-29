import type { JSX } from 'react';

import { ScrollSection } from './components/scroll-section/ScrollSection';
import { SnapScrollContainer } from './components/snap-scroll-container/SnapScrollContainer';
import { Welcome } from './components/welcome/Welcome';

export const Landing = (): JSX.Element => {
  return (
    <SnapScrollContainer className="bg-stone-50 text-neutral-900">
      <ScrollSection>
        <Welcome />
      </ScrollSection>
      <ScrollSection>This is my journey</ScrollSection>
    </SnapScrollContainer>
  );
};
