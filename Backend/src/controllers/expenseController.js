const Expense = require("../models/Expense");
const xlsx = require("xlsx");

// Add Expense Source
const addExpense = async (req, res) => {
  const userId = req.user.id;

  const { category, icon, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = new Expense({
      userId,
      category,
      icon,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Expense Addition Failed", error: err.message });
  }
};

// Get All Expenses
const getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res
        .status(400)
        .json({ message: "No Expenses Are Found For This User" });
    }

    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching expenses", error: err.message });
  }
};

// Delete Expense 
const deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  if (!expenseId) {
    return res.status(400).json({ message: "Not expense Found" });
  }

  try {
    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({ message: "Expense Deleted Sucessfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Expense Deletion Failed", error: err.message });
  }
};

// Download Expenses As Excel
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res
        .status(200)
        .json({ message: "No Expenses Found For This User" });
    }

    // Prepare Data For Excel Sheet
    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    const buffer = xlsx.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.send(buffer);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Download Expenses As Excel Sheet Failed",
        error: err.message,
      });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense, downloadExpenseExcel };