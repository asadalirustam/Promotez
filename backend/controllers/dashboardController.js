const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Helper to get month name
const getMonthName = (monthIndex) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex];
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all records for the user
    const expenses = await Expense.find({ user: userId });
    const incomes = await Income.find({ user: userId });

    // 1. Totals
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    // 2. Current Month calculations
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const monthlyIncome = incomes
      .filter((item) => {
        const d = new Date(item.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyExpense = expenses
      .filter((item) => {
        const d = new Date(item.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    // 3. Recent Transactions (Incomes + Expenses merged and sorted, limited to 5)
    const formattedIncomes = incomes.map((inc) => ({
      _id: inc._id,
      title: inc.source,
      amount: inc.amount,
      type: 'income',
      category: 'Salary & Income',
      date: inc.date,
      description: inc.description,
    }));

    const formattedExpenses = expenses.map((exp) => ({
      _id: exp._id,
      title: exp.title,
      amount: exp.amount,
      type: 'expense',
      category: exp.category,
      paymentMethod: exp.paymentMethod,
      date: exp.date,
      description: exp.description,
    }));

    const recentTransactions = [...formattedIncomes, ...formattedExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // 4. Expense Category Pie Chart Data
    const categoryMap = {};
    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const categoryPieData = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));

    // 5. Monthly charts (for the current calendar year)
    // Initialize monthly tracker
    const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
      month: getMonthName(i),
      income: 0,
      expense: 0,
    }));

    incomes.forEach((inc) => {
      const d = new Date(inc.date);
      if (d.getFullYear() === currentYear) {
        const m = d.getMonth();
        monthlyTrend[m].income += inc.amount;
      }
    });

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      if (d.getFullYear() === currentYear) {
        const m = d.getMonth();
        monthlyTrend[m].expense += exp.amount;
      }
    });

    res.json({
      success: true,
      data: {
        totals: {
          totalBalance,
          totalIncome,
          totalExpense,
          monthlyIncome,
          monthlyExpense,
        },
        recentTransactions,
        categoryPieData,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
