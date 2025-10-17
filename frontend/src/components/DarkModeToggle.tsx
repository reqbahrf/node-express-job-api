import { useEffect, useState } from 'react';
import { RiSunFill, RiMoonFill } from '@remixicon/react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.themeIsDark === 'true' ||
      (!('themeIsDark' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });
  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
      localStorage.themeIsDark = 'true';
    } else {
      root.classList.remove('dark');
      localStorage.themeIsDark = 'false';
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className='rounded-full p-2'
    >
      {darkMode ? (
        <RiSunFill className='text-white' />
      ) : (
        <RiMoonFill className='text-black' />
      )}
    </button>
  );
};

export default DarkModeToggle;
