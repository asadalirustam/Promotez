import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/TransactionModal';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowRightLeft,
  Calendar,
  Wallet
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState('expense');

  const fetchStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        toast.error('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      toast.error('Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveTransaction = async (payload, type) => {
    try {
      let res;
      if (type === 'income') {
        res = await api.addIncome(payload);
      } else {
        res = await api.addExpense(payload);
      }

      if (res.success) {
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} saved successfully!`);
        fetchStats();
      } else {
        toast.error(res.message || 'Error saving transaction');
      }
    } catch (error) {
      toast.error('Server error saving transaction');
    }
  };

  const openAddModal = (type) => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { totals, recentTransactions = [], categoryPieData = [], monthlyTrend = [] } = stats || {};

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Realtime analysis of your income streams, categories, and monthly expenditures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAddModal('income')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => openAddModal('expense')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-555 bg-indigo-600 rounded-xl shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 text-gray-900 dark:text-white">
            <Wallet size={120} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Net Balance</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-3xl font-bold tracking-tight ${totals?.totalBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
              {formatCurrency(totals?.totalBalance || 0)}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Aggregated lifetime ledger</p>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Inflow</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totals?.totalIncome || 0)}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>This month: {formatCurrency(totals?.monthlyIncome || 0)}</span>
            </div>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Outflow</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(totals?.totalExpense || 0)}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>This month: {formatCurrency(totals?.monthlyExpense || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Income vs Expense Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 lg:col-span-2">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Cash Inflow vs Outflow (This Year)</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Expense category breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Expense Categories</h4>
          <div className="h-72 flex flex-col justify-center">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend iconType="circle" layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-sm">No expenses recorded yet</p>
                <p className="text-xs">Add expenses to view breakdowns</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expense Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Monthly Expenditure</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="expense" name="Expense" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-indigo-500" />
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Recent Transactions</h4>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`p-2 rounded-xl text-sm font-bold flex items-center justify-center w-10 h-10 ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                        {tx.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    {tx.paymentMethod && (
                      <p className="text-xs text-gray-400">{tx.paymentMethod}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p className="text-sm">No recent transactions</p>
                <p className="text-xs">Insert values using the actions above</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction insertion Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        defaultType={modalDefaultType}
      />
    </div>
  );
};

export default Dashboard;
