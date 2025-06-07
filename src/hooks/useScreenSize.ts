import { useEffect, useState } from 'react';

type ScreenSize = 'XXL' | 'XL' | 'LG' | 'MD' | 'SM';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('MD'); // default

  useEffect(() => {
    const mediaQueries = {
      XXL: window.matchMedia('(min-width: 1920px)'), // 1080p
      XL: window.matchMedia('(min-width: 1440px)'),
      LG: window.matchMedia('(min-width: 1280px)'),
      MD: window.matchMedia('(min-width: 1024px)'),
      SM: window.matchMedia('(min-width: 768px)'),
    };

    const getScreenSize = (): ScreenSize => {
      if (mediaQueries.XXL.matches) return 'XXL';
      if (mediaQueries.XL.matches) return 'XL';
      if (mediaQueries.LG.matches) return 'LG';
      if (mediaQueries.MD.matches) return 'MD';
      return 'SM';
    };

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    // Initial check
    handleResize();

    // Add listeners
    Object.values(mediaQueries).forEach(mq => 
      mq.addEventListener('change', handleResize)
    );

    // Cleanup
    return () => {
      Object.values(mediaQueries).forEach(mq => 
        mq.removeEventListener('change', handleResize)
      );
    };
  }, []);

  return screenSize;
};

export default useScreenSize; 