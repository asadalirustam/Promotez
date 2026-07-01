const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { expenseValidation } = require('../middleware/validationMiddleware');

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(expenseValidation, addExpense);

router.route('/:id')
  .put(expenseValidation, updateExpense)
  .delete(deleteExpense);

module.exports = router;
