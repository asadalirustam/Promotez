const Expense = require('../models/Expense');

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res, next) => {
  try {
    const { title, amount, category, paymentMethod, date, description } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      paymentMethod,
      date,
      description,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses with query parameters
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, month, year, sortBy, sortOrder, search } = req.query;
    let query = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Date range filter
    let dateFilter = {};
    let hasDateFilter = false;

    if (startDate) {
      dateFilter.$gte = new Date(startDate);
      hasDateFilter = true;
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
      hasDateFilter = true;
    }

    // Month and Year filters
    if (month && year) {
      const parsedMonth = parseInt(month);
      const parsedYear = parseInt(year);
      const startOfMonth = new Date(parsedYear, parsedMonth - 1, 1);
      const endOfMonth = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (year) {
      const parsedYear = parseInt(year);
      const startOfYear = new Date(parsedYear, 0, 1);
      const endOfYear = new Date(parsedYear, 11, 31, 23, 59, 59, 999);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    } else if (hasDateFilter) {
      query.date = dateFilter;
    }

    // Global Search (title, description, category)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy === 'amount') {
      sort.amount = sortOrder === 'asc' ? 1 : -1;
    } else {
      // Default latest
      sort.date = sortOrder === 'asc' ? 1 : -1;
    }

    const expenses = await Expense.find(query).sort(sort);

    res.json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Check ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Check ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
