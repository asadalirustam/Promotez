import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Medical',
  'Others'
];

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Mobile Payment', 'Other'];

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null, defaultType = 'expense' }) => {
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize fields on modal open or transaction edit change
  useEffect(() => {
    if (transaction) {
      setType(transaction.type || (transaction.source ? 'income' : 'expense'));
      setTitle(transaction.title || transaction.source || '');
      setAmount(transaction.amount || '');
      setCategory(transaction.category || 'Others');
      setPaymentMethod(transaction.paymentMethod || 'Cash');
      
      // format date to YYYY-MM-DD
      if (transaction.date) {
        const d = new Date(transaction.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDate('');
      }
      
      setDescription(transaction.description || '');
    } else {
      setType(defaultType);
      setTitle('');
      setAmount('');
      setCategory('Others');
      setPaymentMethod('Cash');
      // Set default date to today's date in YYYY-MM-DD
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setDescription('');
    }
  }, [transaction, isOpen, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(type === 'income' ? 'Source is required' : 'Title is required');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    if (!date) {
      toast.error('Date is required');
      return;
    }

    const payload = {
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description,
    };

    if (type === 'income') {
      payload.source = title;
    } else {
      payload.title = title;
      payload.category = category;
      payload.paymentMethod = paymentMethod;
    }

    setIsSubmitting(true);
    try {
      await onSave(payload, type, transaction?._id);
      onClose();
    } catch (error) {
      toast.error('Failed to submit transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Type Toggle Selector (Only editable for new entries) */}
          {!transaction && (
            <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 text-sm font-semibold rounded-md transition-all ${
                  type === 'expense'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 text-sm font-semibold rounded-md transition-all ${
                  type === 'income'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                Income
              </button>
            </div>
          )}

          {/* Title or Source field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {type === 'income' ? 'Income Source' : 'Expense Title'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'Salary, Freelance, etc.' : 'Grocery, Rent, Electric Bill...'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Amount field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Conditional Category & Payment fields for Expense */}
          {type === 'expense' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add brief details about this transaction..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
