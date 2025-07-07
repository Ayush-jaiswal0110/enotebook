import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
const Login = (props) => {
  const host = "http://localhost:5000"
  let navigate = useNavigate()
  const [credentials,setCredentials] = useState({email:"",password:""})
  const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch(`${host}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const json = await response.json();
  console.log(json);

  if (json.success) {
    localStorage.setItem("token", json.authToken);
    props.showAlert("Account Logged In Successfully", "success");
    navigate("/");
  } else {
    props.showAlert("Invalid Credentials", "danger");
  }
};

    const onchange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
  return (
   <>
  <div className="login-card">
  <div className="card-header">
    <div className="log">Login</div>
  </div>
  <form onSubmit={handleSubmit}  >
    <div className="form-group">
      <label htmlFor="email">Email Address:</label>
      <input required="" name="email" id="email" type="text" autoComplete='email' value={credentials.email} onChange={onchange}/>
    </div>
    <div className="form-group">
      <label htmlFor="password">Password:</label>
      <input required="" name="password" id="password" type="password" autoComplete='current-password' value={credentials.password} onChange={onchange}/>
    </div>
    <div className="form-group">
     <input value="Login" type="submit"/>
    </div>
  </form>
</div>

   </>
  )
}

export default Login
