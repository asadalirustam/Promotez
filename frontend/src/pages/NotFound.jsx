import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fadeIn">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6">
        <ShieldAlert size={48} className="animate-pulse-subtle" />
      </div>
      
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        404 - Ledger Entry Absent
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        The requested account records or route location does not exist in our secure directory files.
      </p>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all duration-200"
      >
        <ArrowLeft size={16} />
        <span>Return Overview</span>
      </Link>
    </div>
  );
};

export default NotFound;
