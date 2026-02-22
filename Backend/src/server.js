require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const authRoutes = require('./routes/authRoutes.routes.js');
const incomeRoutes = require('./routes/income.routes.js');
const expenseRoutes = require('./routes/expense.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');

const app = express();

app.use(
    cors({
        origin : process.env.CLIENT_URL || "*",
        methods : ["GET" , "POST" , "PUT" , "DELETE"],
        allowedHeaders : ["Content-Type" , "Authorization"],
    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // optional
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Serve uploads folder
app.use("/uploads" , express.static(path.join(__dirname,"/uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`Server Running on PORT ${PORT}`)
})

