import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center bg-khaki-100 dark:bg-slate-800 rounded-lg p-1 transition-colors"
    >
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md shadow-sm transition-all duration-300 ${theme === 'light' ? 'bg-white text-primary-600' : 'bg-transparent text-slate-400'}`}>
        <Sun size={14} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Light</span>
      </div>
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md shadow-sm transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700 text-primary-400' : 'bg-transparent text-slate-500'}`}>
        <Moon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Dark</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
