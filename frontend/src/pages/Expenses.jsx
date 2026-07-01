import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/TransactionModal';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Medical', 'Others'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilterType, setDateFilterType] = useState('none'); // 'none', 'month-year', 'range'
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('latest'); // 'latest', 'oldest', 'amount-desc', 'amount-asc'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Build query arguments
      const query = {
        search,
        category: category !== 'All' ? category : undefined,
      };

      if (dateFilterType === 'month-year') {
        if (month) query.month = month;
        if (year) query.year = year;
      } else if (dateFilterType === 'range') {
        if (startDate) query.startDate = startDate;
        if (endDate) query.endDate = endDate;
      }

      if (sort === 'latest') {
        query.sortBy = 'date';
        query.sortOrder = 'desc';
      } else if (sort === 'oldest') {
        query.sortBy = 'date';
        query.sortOrder = 'asc';
      } else if (sort === 'amount-desc') {
        query.sortBy = 'amount';
        query.sortOrder = 'desc';
      } else if (sort === 'amount-asc') {
        query.sortBy = 'amount';
        query.sortOrder = 'asc';
      }

      const res = await api.getExpenses(query);
      if (res.success) {
        setExpenses(res.data);
      } else {
        toast.error('Failed to retrieve expense ledger');
      }
    } catch (error) {
      toast.error('Network error loading expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input or fetch instantly on dropdown shifts
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, dateFilterType, month, year, startDate, endDate, sort]);

  const handleSaveExpense = async (payload, type, id) => {
    try {
      let res;
      if (id) {
        res = await api.updateExpense(id, payload);
      } else {
        res = await api.addExpense(payload);
      }

      if (res.success) {
        toast.success(id ? 'Expense entry updated!' : 'Expense entry saved!');
        fetchExpenses();
      } else {
        toast.error(res.message || 'Error processing expense');
      }
    } catch (error) {
      toast.error('Server error processing operation');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      const res = await api.deleteExpense(id);
      if (res.success) {
        toast.success('Expense removed successfully');
        fetchExpenses();
      } else {
        toast.error(res.message || 'Failed to remove expense');
      }
    } catch (error) {
      toast.error('Server error removing expense');
    }
  };

  const handleEditClick = (exp) => {
    setEditingTransaction({
      ...exp,
      type: 'expense'
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Helper to get total of matching expenses
  const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Expense Log
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total matching expenses: <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(expenseTotal)}</span>
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-555 bg-indigo-600 rounded-xl shadow-sm transition-all"
        >
          <Plus size={16} />
          <span>New Expense</span>
        </button>
      </div>

      {/* Filter and Query Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm space-y-4">
        {/* Row 1: Global Search & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses by title, details..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-750 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Filter & Date Filter Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Date Filter Method
            </label>
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none"
            >
              <option value="none">All Dates</option>
              <option value="month-year">By Month / Year</option>
              <option value="range">Custom Range</option>
            </select>
          </div>

          {/* Conditional Date inputs based on selector */}
          {dateFilterType === 'month-year' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none"
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('en', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Year</label>
                <input
                  type="number"
                  placeholder={new Date().getFullYear()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {dateFilterType === 'range' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expense Ledger Content */}
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Expense Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{exp.title}</p>
                      {exp.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{exp.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 dark:text-gray-400">
                      {exp.paymentMethod}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-6 py-4.5 text-sm font-bold text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(exp)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Edit expense details"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="p-1.5 text-gray-400 hover:text-red-650 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          title="Remove expense entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
            <TrendingDown size={40} className="text-gray-300 animate-pulse-subtle" />
            <p className="text-sm font-semibold">No expenses match your filters</p>
            <p className="text-xs">Create new entries or adjust parameters to update the table</p>
          </div>
        )}
      </div>

      {/* Insert Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        transaction={editingTransaction}
        defaultType="expense"
      />
    </div>
  );
};

export default Expenses;
