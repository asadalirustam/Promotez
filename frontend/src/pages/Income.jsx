import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/TransactionModal';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest'); // 'latest', 'oldest', 'amount-desc', 'amount-asc'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const query = { search };

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

      const res = await api.getIncomes(query);
      if (res.success) {
        setIncomes(res.data);
      } else {
        toast.error('Failed to retrieve income stream data');
      }
    } catch (error) {
      toast.error('Network error loading income streams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIncomes();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sort]);

  const handleSaveIncome = async (payload, type, id) => {
    try {
      let res;
      if (id) {
        res = await api.updateIncome(id, payload);
      } else {
        res = await api.addIncome(payload);
      }

      if (res.success) {
        toast.success(id ? 'Income record updated!' : 'Income record saved!');
        fetchIncomes();
      } else {
        toast.error(res.message || 'Error processing income');
      }
    } catch (error) {
      toast.error('Server error processing operation');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    try {
      const res = await api.deleteIncome(id);
      if (res.success) {
        toast.success('Income entry removed successfully');
        fetchIncomes();
      } else {
        toast.error(res.message || 'Failed to remove income');
      }
    } catch (error) {
      toast.error('Server error removing income');
    }
  };

  const handleEditClick = (inc) => {
    setEditingTransaction({
      ...inc,
      type: 'income',
      title: inc.source // Modal maps 'title' as input display
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const incomeTotal = incomes.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Income Streams
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total inflow calculated: <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(incomeTotal)}</span>
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all"
        >
          <Plus size={16} />
          <span>New Income</span>
        </button>
      </div>

      {/* Query Filter Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm">
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incomes by source, description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Income Streams Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : incomes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {incomes.map((inc) => (
                  <tr key={inc._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                          <ArrowUpRight size={14} />
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{inc.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(inc.date)}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {inc.description || <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-6 py-4.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(inc.amount)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(inc)}
                          className="p-1.5 text-gray-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Edit income stream"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteIncome(inc._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          title="Delete income entry"
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
            <TrendingUp size={40} className="text-gray-300 animate-pulse-subtle" />
            <p className="text-sm font-semibold">No income records found</p>
            <p className="text-xs">Select "New Income" to write an entry to the database</p>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIncome}
        transaction={editingTransaction}
        defaultType="income"
      />
    </div>
  );
};

export default Income;
