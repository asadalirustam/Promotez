import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, Bell } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Helper to determine page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview';
      case '/expenses':
        return 'Expense Journal';
      case '/income':
        return 'Income Stream';
      case '/reports':
        return 'Financial Reports';
      case '/profile':
        return 'Personal Account';
      case '/settings':
        return 'Preferences';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Toolbar Options */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dummy Icon */}
        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200">
          <Bell size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* User profile picture link */}
        <Link to="/profile" className="flex items-center gap-2 group">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-indigo-500 rounded-full">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {user?.name || 'Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
