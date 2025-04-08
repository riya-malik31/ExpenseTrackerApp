import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Tooltip, ResponsiveContainer ,Bar, Legend ,YAxis, XAxis, CartesianGrid, BarChart} from 'recharts';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  });

  const fetchData = async () => {
    try {
      const incomeResponse = await fetch(`https://expense-tracker-app-backend-steel.vercel.app/get-income/${userId}`);
      const expenseResponse = await fetch(`https://expense-tracker-app-backend-steel.vercel.app/get-expenses/${userId}`);

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      if (incomeResponse.ok && expenseResponse.ok) {
        setTotalIncome(incomeData.totalIncome || 0);
        setTotalExpense(expenseData.totalExpense || 0);
        setBalance((incomeData.totalIncome || 0) - (expenseData.totalExpense || 0));
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const chartData = [
    {
      name: 'Income vs Expense',
      income: totalIncome,
      expense: totalExpense,
    },
  ];
  // const COLORS = ['#28a745', '#dc3545'];

  return (
    <div className="main-sect-dash">
      <Sidebar />
      <section className="main-dash">
        <div className="div-dash1">
          <p id="dash">DASHBOARD</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expense" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="summary">
         <div className="inc"> <p id='inc'>Total Income: Rs. {totalIncome}</p></div>
          <div className="exp"><p id='exp'>Total Expenses: Rs. {totalExpense}</p></div>
        <div className="bal"><p id='bal'>Balance: Rs. {balance}</p></div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
