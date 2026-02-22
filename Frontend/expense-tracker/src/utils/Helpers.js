import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^'s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

export const addThousandsSeperator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formatedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return fractionalPart
    ? `${formatedInteger}.${fractionalPart}`
    : formatedInteger;
};

export const prepareExpenseBarChart = (data = []) => {
  const monthMap = {};

  data.forEach((item) => {
    const month = item.month;
    if (!monthMap[month]) {
      monthMap[month] = 0;
    }
    monthMap[month] += item.amount;
  });
  const chartData = Object.keys(monthMap).map((month) => ({
    month,
    amount: monthMap[month],
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = [])=>{
    const sortedData = [...data].sort((a,b)=> new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item)=>({
        month : moment(item.date).format("Do MMMM"),
        amount : item?.amount,
        source : item?.source
    }));

    return chartData;

};

export const prepareExpenseLineChart = (data = [])=>{
  const sortedData = [...data].sort((a,b)=> new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item)=>({
    month : moment(item?.date).format("Do MM"),
    amount : item?.amount,
    category : item?.category
  }));

  return chartData;
}