const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
    icon : {type : String},
    category : {type : String , required : true},
    amount : {type : Number , required : true},
    date : {type : Date , default : Date.now},
},{timeStamps : true});

expenseSchema.index({userId: 1 , date:-1});

module.exports = mongoose.model("Expense" , expenseSchema);