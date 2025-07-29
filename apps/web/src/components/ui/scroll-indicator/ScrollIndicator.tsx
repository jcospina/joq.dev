import { useState, useEffect, type JSX } from 'react';

export const ScrollIndicator = (): JSX.Element => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

      setScrollProgress(progress);
      setIsVisible(progress < 0.9);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-opacity duration-500 ${
        isVisible
          ? 'opacity-60 hover:opacity-100'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-px h-16 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="w-full rounded-full transition-all duration-300 ease-out bg-gray-800 dark:bg-gray-200"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse" />
        <div className="mt-4 text-xs font-medium tracking-wider text-gray-800 transform rotate-90 origin-center">
          SCROLL
        </div>
      </div>
    </div>
  );
};
