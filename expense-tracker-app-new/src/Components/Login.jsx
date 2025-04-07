import { useState  } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
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
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Logged in successfully!");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        navigate("/Dashboard"); 
      } else {
        alert(data.message); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="main-1">
        <form className="form-form" onSubmit={handleSubmit}>
    <div className="div-main-form">
        <div className="Sign">
            <p id="sign-p1">LOGIN</p>
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
        <button id="btn-sign" type="submit">Login</button>
       </div>
       <p id="sign-p2"> Not a user? <a href="/" >Sign In </a></p>
   </div>
    </div>
    </form>
    </div>
  )
}

export default Login;