import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Signup() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
 const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post("http://localhost:5000/signup", inputs);
    alert(response.data.message); 
    navigate("/Login")
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed");
  }
};
  return (
    <div className="main-1">
        <form className="form-form" onSubmit={handleSubmit}>
    <div className="div-main-form">
        <div className="Sign">
            <p id="sign-p1">SIGN UP</p>
        </div>
   <div className="div-form">
   <div className="form-input">
     <input 
        type="text" 
        name="username" 
        placeholder="Enter your username"
        value={inputs.username || ""} 
        onChange={handleChange}
      />
     </div>
        <div className="form-input">
        <input 
          type="password" 
          name="password" 
          placeholder="Enter your password"
          value={inputs.password || ""} 
          onChange={handleChange}
        />
        </div>
       <div className="form-input">
        <button id="btn-sign" type="submit"> Sign Up</button>
       </div>
       <p id="sign-p2"> Already have an account? <a href="/Login">Login </a></p>
   </div>
    </div>
    </form>
    </div>
  )
}

export default Signup;