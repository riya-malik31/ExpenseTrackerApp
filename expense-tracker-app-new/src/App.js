import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Signup from './Components/Signup';
import Login from './Components/Login';
import Income from './Components/Income';
import Expense from './Components/Expense';
import Dashboard from './Components/Dashboard';
import Transactions from './Components/Transactions';
import "./Components/Style.css";
import "boxicons/css/boxicons.min.css";

const App = () =>{
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Signup />
    },
    {
      path:"/Login",
      element:<Login />
    },
    {
      path:"/Dashboard",
      element:<Dashboard />
    },
    {
      path:"/Income",
      element:<Income />
    },
    {
      path:"/Expense",
      element:<Expense />
    },
    {
      path:"/Transactions",
      element:<Transactions />
    },
  
  ]);
  return <RouterProvider router={router}/>;
};
export default App;
