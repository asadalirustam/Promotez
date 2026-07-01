const { check, validationResult } = require('express-validator');

// Error check resolver
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const registerValidation = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate,
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validate,
];

const expenseValidation = [
  check('title', 'Title is required').notEmpty().trim(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').notEmpty().trim(),
  check('paymentMethod', 'Payment method is required').notEmpty().trim(),
  check('date', 'Date is required').notEmpty(),
  validate,
];

const incomeValidation = [
  check('source', 'Source is required').notEmpty().trim(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  check('date', 'Date is required').notEmpty(),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  expenseValidation,
  incomeValidation,
};
