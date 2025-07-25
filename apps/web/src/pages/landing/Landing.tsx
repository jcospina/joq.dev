import type { JSX } from 'react';

import { ScrollSection } from './components/scroll-section/ScrollSection';
import { SnapScrollContainer } from './components/snap-scroll-container/SnapScrollContainer';
import { Welcome } from './components/welcome/Welcome';
export const Landing = (): JSX.Element => {
  return (
    <SnapScrollContainer>
      <ScrollSection>
        <Welcome />
      </ScrollSection>

      <ScrollSection>
        This is my personal site where I share my projects, blog posts, and
        more.
      </ScrollSection>
    </SnapScrollContainer>
  );
};
