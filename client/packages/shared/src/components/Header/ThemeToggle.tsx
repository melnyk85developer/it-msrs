import React, { useContext } from 'react';
import { ThemeContext } from '../providers/themeProvider';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext) as { theme: string; setTheme: React.Dispatch<React.SetStateAction<string>> };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div onClick={toggleTheme}>
      {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
    </div>
  );
};

export default ThemeToggle;
