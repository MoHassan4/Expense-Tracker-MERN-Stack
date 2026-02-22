const express = require("express");

const {
    getAllExpenses,
    addExpense,
    deleteExpense,
    downloadExpenseExcel
} = require("../controllers/expenseController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/add",protect,addExpense);
router.get("/get",protect,getAllExpenses);
router.get("/downloadexcel",protect,downloadExpenseExcel);
router.delete("/:id",protect,deleteExpense);

module.exports = router;