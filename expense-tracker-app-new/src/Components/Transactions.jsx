import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, );

  const fetchTransactions = async () => {
    try {
      // Fetch both income and expenses
      const incomeRes = await fetch(`https://expense-tracker-app-backend-steel.vercel.app/get-income/${userId}`);
      const expenseRes = await fetch(`https://expense-tracker-app-backend-steel.vercel.app/get-expenses/${userId}`);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();

      if (incomeRes.ok && expenseRes.ok) {
        // Add type field to differentiate transactions
        const incomeList = incomeData.incomes.map((inc) => ({ ...inc, type: 'Income' }));
        const expenseList = expenseData.expenses.map((exp) => ({ ...exp, type: 'Expense' }));

        // Merge both lists and sort by date (latest first)
        const allTransactions = [...incomeList, ...expenseList].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(allTransactions);
      } else {
        console.error('Error fetching transactions:', incomeData.message, expenseData.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async (id, type) => {
    const url = type === 'Income' 
      ? `http://localhost:5000/delete-income/${id}`
      : `http://localhost:5000/delete-expense/${id}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        alert(`${type} deleted successfully!`);
        fetchTransactions();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(`Error deleting ${type.toLowerCase()}:`, error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="main-sect-trans">
        <Sidebar />
        <section className="main-trans">
          <div className="div-trans1">
            <p id="p-trans1">TRANSACTIONS</p>
          </div>

          <div className="transactions-history">
            <div className="hist">
              <p id="p-hist">Transaction History</p>
            </div>
            <div className="div-trans-hist">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.title}</td>
                      <td>Rs. {transaction.amount}</td>
                      <td style={{ color: transaction.type === 'Income' ? 'green' : 'red' }}>
                        {transaction.type}
                      </td>
                      <td>
                        <button
                          id="bt-del"
                          onClick={() => handleDelete(transaction._id, transaction.type)}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Transactions;
