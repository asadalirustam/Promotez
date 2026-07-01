const express = require('express');
const router = express.Router();
const {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');
const { incomeValidation } = require('../middleware/validationMiddleware');

router.use(protect);

router.route('/')
  .get(getIncomes)
  .post(incomeValidation, addIncome);

router.route('/:id')
  .put(incomeValidation, updateIncome)
  .delete(deleteIncome);

module.exports = router;
