const Income = require('../models/Income');

// @desc    Add income
// @route   POST /api/income
// @access  Private
const addIncome = async (req, res, next) => {
  try {
    const { source, amount, date, description } = req.body;

    const income = await Income.create({
      user: req.user._id,
      source,
      amount,
      date,
      description,
    });

    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get income
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;
    let query = { user: req.user._id };

    // Search by source or description
    if (search) {
      query.$or = [
        { source: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort order
    let sort = {};
    if (sortBy === 'amount') {
      sort.amount = sortOrder === 'asc' ? 1 : -1;
    } else {
      // Default: sort by date latest
      sort.date = sortOrder === 'asc' ? 1 : -1;
    }

    const incomes = await Income.find(query).sort(sort);

    res.json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      throw new Error('Income record not found');
    }

    // Check ownership
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      throw new Error('Income record not found');
    }

    // Check ownership
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await income.deleteOne();

    res.json({
      success: true,
      message: 'Income record removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
};
