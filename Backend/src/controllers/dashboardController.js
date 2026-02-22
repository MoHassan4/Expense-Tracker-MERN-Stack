const Income = require("../models/Income.js");
const Expense = require("../models/Expense.js");
const { Types } = require("mongoose");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Dates
    const now = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [
      totalIncomeResult,
      totalExpenseResult,
      totalExpenseLast30DaysResult,
      totalIncomeLast60DaysResult,
      recentIncomes,
      recentExpenses,
    ] = await Promise.all([
      // Total Incomes
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      // Total Expense
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Expense last 30 days (transactions , total)
      Expense.aggregate([
        { $match: { userId: userObjectId, date: { $gte: thirtyDaysAgo } } },
        {
          $addFields: {
            month: { $dateToString: { format: "%b", date: "$date" } }, // "Feb", "Mar", ...
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            transactions: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } }, // sort by month
      ]),
      // Expense.aggregate([
      //   { $match: { userId: userObjectId, date: { $gte: thirtyDaysAgo } } },
      //   { $sort: { date: -1 } },
      //   {
      //     $group: {
      //       _id: null,
      //       total: { $sum: "$amount" },
      //       transactions: { $push: "$$ROOT" },
      //     },
      //   },
      // ]),

      // Income last 60 days (transactions , total)
      Income.aggregate([
        { $match: { userId: userObjectId, date: { $gte: sixtyDaysAgo } } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            transactions: { $push: "$$ROOT" },
          },
        },
      ]),

      // Last 5 Incomes
      Income.find({
        userId: userObjectId,
      })
        .sort({ date: -1 })
        .limit(5)
        .lean(),

      // Last 5 Expenses
      Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
    ]);

    // Get Values Safely
    const totalIncome = totalIncomeResult[0]?.total || 0;
    const totalExpense = totalExpenseResult[0]?.total || 0;

    const last60DaysIncomes = totalIncomeLast60DaysResult[0] || {
      total: 0,
      transactions: [],
    };

    const last30DaysExpenses = totalExpenseLast30DaysResult[0] || {
      total: 0,
      transactions: [],
    };

    // Merge Recent Expenses & Incomes
    const recentTransactions = [
      ...recentIncomes.map((txn) => ({ ...txn, type: "income" })),
      ...recentExpenses.map((txn) => ({ ...txn, type: "expense" })),
    ].sort((a, b) => b.date - a.date);
    // Fetch Total Income and Expenses
    // const totalIncome = await Income.aggregate([
    //   { $match: { userId: userObjectId } },
    //   { $group: { _id: null, total: { $sum: "$amount" } } },
    // ]);

    // const totalExpense = await Expense.aggregate([
    //   { $match: { userId: userObjectId } },
    //   { $group: { _id: null, total: { $sum: "$amount" } } },
    // ]);

    // Get income transactions in last 60 days
    // const last60DaysIncomeTransactions = await Income.find({
    //   userId: userObjectId,
    //   date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    // }).sort({
    //   date: -1,
    // });

    // Get Total Income for last 60 days
    // const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
    //   (sum, transaction) => sum + transaction.amount,
    //   0,
    // );

    // // Get Expense transactions for last 30 days
    // const last30DaysExpenseTransactions = await Expense.find({
    //   userId: userObjectId,
    //   date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    // }).sort({
    //   date: -1,
    // });

    // // Get Total Expense for last 30 days
    // const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce(
    //   (sum, transaction) => sum + transaction.amount,
    //   0,
    // );

    // // Fetch last 5 transactions (expenses + incomes)
    // const lastTranscations = [
    //   ...(await Income.find({ userId }).lean().sort({ date: -1 }).limit(5)).map(
    //     (txn) => ({
    //       ...txn.toObject(),
    //       type: "income",
    //     }),
    //   ),

    //   ...(
    //     await Expense.find({ userId }).lean().sort({ date: -1 }).limit(5)
    //   ).map((txn) => ({
    //     ...txn.toObject(),
    //     type: "expense",
    //   })),
    // ].sort((a, b) => b.date - a.date); // sort latest first

    // Final Response
    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpenses: last30DaysExpenses,
      last60DaysIncomes: last60DaysIncomes,
      recentTransactions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error In Fetching Dashboard Data",
      error: err.message,
      errorStack: err.stack,
    });
  }
};

module.exports = getDashboardData;
