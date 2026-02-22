const Income = require("../models/Income");
const xlsx = require("xlsx");

// Add Income Source
const addIncome = async (req, res) => {
  const userId = req.user.id;

  const { source, icon, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newIncome = new Income({
      userId,
      source,
      icon,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Income Addition Failed", error: err.message });
  }
};

// Get All Income Sources
const getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (incomes.length === 0) {
      return res
        .status(400)
        .json({ message: "No Incomes Are Found For This User" });
    }

    res.status(200).json(incomes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching incomes", error: err.message });
  }
};

// Delete Income Source
const deleteIncome = async (req, res) => {
  const incomeId = req.params.id;

  if (!incomeId) {
    return res.status(400).json({ message: "Not Income Found" });
  }

  try {
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({ message: "Income Deleted Sucessfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Income Deletion Failed", error: err.message });
  }
};

// Download Income As Excel
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (incomes.length === 0) {
      return res
        .status(200)
        .json({ message: "No Incomes Found For This User" });
    }

    // Prepare Data For Excel Sheet
    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    const buffer = xlsx.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx",
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
        message: "Download Incomes As Excel Sheet Failed",
        error: err.message,
      });
  }
};

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };
