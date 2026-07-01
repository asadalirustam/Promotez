import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ToggleLeft, ToggleRight, Info, Shield } from 'lucide-react';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          System Preferences
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Toggle theme styling and review environmental attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Theme Toggles */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {isDark ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
            <span>App Theme Mode</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set default appearance mode. High contrast colors will be applied for easier visibility.
          </p>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/20 rounded-xl">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dark Interface Mode</span>
            <button
              onClick={toggleTheme}
              className="text-indigo-600 dark:text-indigo-400 focus:outline-none transition-all duration-200"
            >
              {isDark ? <ToggleRight size={44} /> : <ToggleLeft size={44} className="text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Card 2: Environment Details */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Info size={18} className="text-indigo-500" />
            <span>Environment Details</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current deployment features.
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-750">
              <span>Framework</span>
              <span className="font-semibold text-gray-900 dark:text-white">React v18 (Vite)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-750">
              <span>Styling library</span>
              <span className="font-semibold text-gray-900 dark:text-white">Tailwind CSS v3</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-750">
              <span>Database Connection</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">MongoDB Mongoose</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Security Protocols</span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                <Shield size={14} className="text-indigo-500" />
                <span>JWT + Rate Limit</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
