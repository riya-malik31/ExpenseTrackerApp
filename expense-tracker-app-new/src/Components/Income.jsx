import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

const Income = () => {
  const [incomeData, setIncomeData] = useState({
    title: "",
    amount: "",
    date: "",
  });

  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchTotalIncome();
    }
  });

  const fetchTotalIncome = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-income/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setTotalIncome(data.totalIncome);
        setIncomeHistory(data.incomes || []);

      } else {
        console.error("Error fetching income:", data.message);
      }
    } catch (error) {
      console.error("Error fetching total income:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIncomeData({ ...incomeData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...incomeData, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Income added successfully!");
        setIncomeData({ title: "", amount: "", date: "" });
        fetchTotalIncome();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-income/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Income deleted successfully!');
        fetchTotalIncome();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  return (
    <>
      <div className="main-sect-inc">
        <Sidebar />
        <section className='main-inc'>
          <div className="div-inc1">
            <p id='p-inc1'>INCOME</p>
          </div>
          <div className="total-inc">
            <p id='tot'>TOTAL INCOME = Rs. {totalIncome}</p>
          </div>
          <div className="income-form-container">
            <form onSubmit={handleSubmit} className="income-form">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter income title"
                  value={incomeData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={incomeData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">

                <input
                  type="date"
                  name="date"
                  value={incomeData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="button-inc">
                <button id='bt-inc' type="submit" className="add-income-btn">Add Income</button>
              </div>
            </form>
          </div>
          <div className="income-history">
           <div className="hist">
           <p id='p-hist'>Income History</p>
           </div>
            <div className="div-inc-hist">
            <ul id='ul-inc'>
              {incomeHistory.map((income) => (
                <li key={income._id}>
                 <div className="aa">
                 <div className='data'> Rs. {income.amount} on {income.title} on {income.date}</div>
                 <div className="delete">
                 <button id='bt-del' onClick={() => handleDelete(income._id)}>  <i className='bx bx-trash'></i></button>
                 </div>
                 </div>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Income
