import { useState } from 'react';
import React from 'react'
import profile from './images/image.png';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const username = localStorage.getItem('username');

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

  return (
    <>
    <div className="menu-icon" onClick={toggleSidebar}>
                <i className='bx bx-menu'></i>
            </div>
   <aside>
    <div className={`sidebar-main ${isOpen ? 'open' : ''}`}>
        <div className="side">
            <div className="profile">
            <img id='profile-image' src={profile} alt='' ></img>
            <p id='name'>{username ? username : "Guest"}</p>
            </div>
            <div className="items">
                <ul id='ul-side'>
                    <li><i className="bx bx-home"></i>
                   <Link to= "/Dashboard">Dashboard</Link>
                    </li>
                    <li><i className="bx bx-transfer"></i>
                      <Link to= "/Transactions"> View Transactions </Link>
                    </li>
                    <li> <i className="bx bx-money"></i>
                       <Link to= '/Income'>Income</Link> 
                    </li>
                    <li><i className="bx bx-money-withdraw"></i>
                        <Link to= '/Expense'>Expenses</Link>
                    </li>
                </ul>
                <div className="bt-log">
                    <button id='logout'> <Link to= '/Login'>LOGOUT</Link> </button>
                </div>
            </div>
        </div>
    </div>
   </aside>
   </>
  )
}

export default Sidebar
