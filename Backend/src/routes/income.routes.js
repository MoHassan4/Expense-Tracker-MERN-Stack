const express = require("express");

const {
    getAllIncome,
    addIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/incomeController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/add",protect,addIncome);
router.get("/get",protect,getAllIncome);
router.get("/downloadexcel",protect,downloadIncomeExcel);
router.delete("/:id",protect,deleteIncome);

module.exports = router;
