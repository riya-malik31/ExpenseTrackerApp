import React , {useState, useEffect} from 'react'
import Sidebar from './Sidebar'

const Expense = () => {
    const [expenseData, setExpenseData] = useState({
      title: "",
      amount: "",
      date: "",
    });
     const [totalExpense, setTotalExpense] = useState(0); 
     const [expenseHistory, setExpenseHistory] = useState([]);
      const userId = localStorage.getItem("userId");
    
      useEffect(() => {
        if (userId) {
          fetchTotalExpense();
        }
      });
    
      const fetchTotalExpense = async () => {
        try {
          const response = await fetch(`http://localhost:5000/get-expenses/${userId}`);
          const data = await response.json();
    
          if (response.ok) {
            setTotalExpense(data.totalExpense);
            setExpenseHistory(data.expenses);
          } else {
            console.error("Error fetching expense:", data.message);
          }
        } catch (error) {
          console.error("Error fetching total expense:", error);
        }
      };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setExpenseData({ ...expenseData, [name]: value });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      alert("User not logged in!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expenseData, userId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("expense added successfully!");
        setExpenseData({ title: "", amount: "", date: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-expense/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Expense deleted successfully!');
        fetchTotalExpense(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
   <div className="main-sect-exp">
   <Sidebar/>
    <section className='main-exp'>
        <div className="div-exp1">
            <p id='p-exp1'>EXPENSES</p>
        </div>
        <div className="total-exp">
              <p id='tot'>TOTAL EXPENSES = Rs. {totalExpense}</p>
            </div>
            <div className="expense-form-container">
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Enter expense title"
                value={expenseData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
            
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={expenseData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
    
              <input
                type="date"
                name="date"
                value={expenseData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="button-exp">
            <button id='bt-exp' type="submit" className="add-expense-btn">Add Expense</button>
            </div>
          </form>
        </div>
        <div className="expense-history">
           <div className="hist">
           <p id='p-hist'>Expense History</p>
           </div>
            <div className="div-exp-hist">
            <ul id='ul-exp'>
              {expenseHistory.map((expense) => (
                <li key={expense._id}>
                 <div className="aa">
                 <div className='data'> Rs. {expense.amount} on {expense.title} on {expense.date}</div>
                 <div className="delete">
                 <button id='bt-del' onClick={() => handleDelete(expense._id)}>  <i className='bx bx-trash'></i></button>
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

export default Expense
