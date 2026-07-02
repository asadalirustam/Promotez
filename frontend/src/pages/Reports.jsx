import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FileText, Calendar, BarChart3, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly'); // 'daily', 'weekly', 'monthly', 'yearly'
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(() => String(new Date().getMonth() + 1));
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Get all transactions for processing locally to maximize flexibility
      const [incomeRes, expenseRes] = await Promise.all([
        api.getIncomes(),
        api.getExpenses(),
      ]);

      if (incomeRes.success && expenseRes.success) {
        let filteredIncomes = [];
        let filteredExpenses = [];

        const checkDateMatch = (dateStr) => {
          const itemDate = new Date(dateStr);
          const filterDate = new Date(selectedDate);
          
          if (reportType === 'daily') {
            return (
              itemDate.getFullYear() === filterDate.getFullYear() &&
              itemDate.getMonth() === filterDate.getMonth() &&
              itemDate.getDate() === filterDate.getDate()
            );
          } else if (reportType === 'weekly') {
            // Last 7 days including filter date
            const oneDay = 24 * 60 * 60 * 1000;
            const diffDays = Math.round((filterDate - itemDate) / oneDay);
            return diffDays >= 0 && diffDays < 7;
          } else if (reportType === 'monthly') {
            const m = parseInt(selectedMonth);
            const y = parseInt(selectedYear);
            return itemDate.getFullYear() === y && (itemDate.getMonth() + 1) === m;
          } else if (reportType === 'yearly') {
            const y = parseInt(selectedYear);
            return itemDate.getFullYear() === y;
          }
          return true;
        };

        filteredIncomes = incomeRes.data.filter((item) => checkDateMatch(item.date));
        filteredExpenses = expenseRes.data.filter((item) => checkDateMatch(item.date));

        setIncomes(filteredIncomes);
        setExpenses(filteredExpenses);
      } else {
        toast.error('Failed to load transaction archives');
      }
    } catch (error) {
      toast.error('Network error loading reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  // Aggregate stats
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // Expenses grouped by Category
  const categorySummary = {};
  expenses.forEach((item) => {
    categorySummary[item.category] = (categorySummary[item.category] || 0) + item.amount;
  });

  const categorySortedList = Object.keys(categorySummary)
    .map((cat) => ({
      category: cat,
      amount: categorySummary[cat],
      percentage: totalExpense > 0 ? ((categorySummary[cat] / totalExpense) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Unified Transaction History inside this report duration
  const unifiedTransactions = [
    ...incomes.map((item) => ({ ...item, type: 'income', title: item.source })),
    ...expenses.map((item) => ({ ...item, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handlePrint = () => {
    const element = document.getElementById('report-sheet');
    const opt = {
      margin:       [0.4, 0.4, 0.4, 0.4],
      filename:     `CentWise_Statement_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    toast.promise(
      html2pdf().set(opt).from(element).save(),
      {
        loading: 'Generating PDF statement...',
        success: 'PDF statement downloaded successfully!',
        error: 'Failed to generate PDF.'
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration filters (Hidden during print) */}
      <div className="print:hidden p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-indigo-500" />
          <span>Report Configuration</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Duration selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>

          {/* Conditional inputs */}
          {reportType === 'daily' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Select Day</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {reportType === 'weekly' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ending Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 dark:text-white focus:outline-none"
                >
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
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none"
                />
              </div>
            </>
          )}

          {reportType === 'yearly' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Year</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Report Sheet Layout */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div
          id="report-sheet"
          className="bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 space-y-8"
        >
          
          {/* Sheet Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                CentWise Statement
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report ({
                  reportType === 'daily' || reportType === 'weekly'
                    ? formatDate(selectedDate)
                    : reportType === 'monthly'
                    ? `${new Date(0, parseInt(selectedMonth) - 1).toLocaleString('en', { month: 'long' })} ${selectedYear}`
                    : selectedYear
                })
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="print:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <FileText size={16} />
              <span>Save PDF Statement</span>
            </button>
          </div>

          {/* Statement Summaries */}
          <div className="grid grid-cols-3 gap-4 border border-gray-200 p-5 rounded-2xl bg-gray-50">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Inflow</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Outflow</p>
              <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">
                {formatCurrency(totalExpense)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Savings</p>
              <p className={`text-xl sm:text-2xl font-bold mt-1 ${netSavings >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                {formatCurrency(netSavings)}
              </p>
            </div>
          </div>

          {/* Details Splits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category summary distribution */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Expense Category Allocations
              </h4>
              {categorySortedList.length > 0 ? (
                <div className="space-y-3">
                  {categorySortedList.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-gray-700">{item.category}</span>
                        <span className="text-gray-900">
                          {formatCurrency(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-650 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No expenses recorded in this period.</p>
              )}
            </div>

            {/* General metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                General Ledger Statistics
              </h4>
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Incomes Count</span>
                  <span className="font-semibold text-gray-900">{incomes.length} records</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Expenses Count</span>
                  <span className="font-semibold text-gray-900">{expenses.length} records</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Average Expense Amount</span>
                  <span className="font-semibold text-gray-900">
                    {expenses.length > 0 ? formatCurrency(totalExpense / expenses.length) : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Average Income Amount</span>
                  <span className="font-semibold text-gray-900">
                    {incomes.length > 0 ? formatCurrency(totalIncome / incomes.length) : '$0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Statement Table */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Itemized Records
            </h4>
            {unifiedTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400">
                      <th className="py-2.5 font-semibold">Title/Source</th>
                      <th className="py-2.5 font-semibold">Type</th>
                      <th className="py-2.5 font-semibold">Category</th>
                      <th className="py-2.5 font-semibold">Date</th>
                      <th className="py-2.5 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unifiedTransactions.map((tx) => (
                      <tr key={tx._id} className="text-gray-750">
                        <td className="py-3 font-medium">
                          {tx.title}
                          {tx.description && <span className="block text-xs text-gray-400">{tx.description}</span>}
                        </td>
                        <td className="py-3 capitalize">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>{tx.type}</span>
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {tx.type === 'income' ? 'Salary & Inflow' : tx.category}
                        </td>
                        <td className="py-3 text-gray-500">
                          {formatDate(tx.date)}
                        </td>
                        <td className={`py-3 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4">No records to display.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Reports;
