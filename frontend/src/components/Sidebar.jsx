import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  Wallet
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: TrendingDown },
    { to: '/income', label: 'Income', icon: TrendingUp },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 text-white bg-indigo-600 rounded-lg dark:bg-indigo-500">
              <Wallet size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              CentWise
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 mx-4 mt-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850">
          <div className="flex items-center gap-3">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-indigo-100 dark:border-indigo-900"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white bg-indigo-500 rounded-full">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                {user?.name || 'Guest User'}
              </h4>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {user?.email || 'guest@centwise.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
