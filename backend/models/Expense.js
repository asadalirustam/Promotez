const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Food',
        'Transport',
        'Shopping',
        'Bills',
        'Entertainment',
        'Education',
        'Medical',
        'Others'
      ],
      default: 'Others',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please select a payment method'],
      enum: ['Cash', 'Card', 'Bank Transfer', 'Mobile Payment', 'Other'],
      default: 'Cash',
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
