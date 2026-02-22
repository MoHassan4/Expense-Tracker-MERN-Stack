import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {


  const categoryMap = {};

  data.forEach((item) => {
    const name = item.source; // أو item.category حسب النوع

    if (!categoryMap[name]) {
      categoryMap[name] = 0;
    }

    categoryMap[name] += item.amount;
  });

  const chartData = Object.keys(categoryMap).map((name) => ({
    name,
    amount: categoryMap[name],
  }));


    setChartData(chartData);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  },[data]);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        colors={COLORS}
        showTextAnchor
        totalAmount={`$${totalIncome}`}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
