import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const host = process.env.REACT_APP_API_URL;
  let navigate = useNavigate()
  const [user,setUser] = useState({name:"",email:"",password:"",cpassword:""})
  const {name,email,password} = user
  const handleSignup = async(e) =>
    {
        e.preventDefault();
       
        const response = await fetch(`${host}/api/auth/createuser`, {
          
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({name,email,password}),
        });
        const json = await response.json();
        console.log(json);
        if(json.sucess){
          //redirect
          localStorage.setItem('token',json.authToken)
          navigate("/")
          props.showAlert("Account created Sucessfully","success")
        }
        else{
          props.showAlert("User with these credentials exists","danger")
        }
     
    }
    const onchange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  return (
    <div className='container'>
      <div className="container">
      <div className="containers">
        <div className="heading">SignIn to your account</div>
        <form  onSubmit={handleSignup} className="form" >
          <div className="input-field">
            <input
              required=""
              autoComplete="off"
              type="text"
              name="name"
              id="name"
              onChange={onchange}
              
            />
            <label htmlFor="name">Full Name</label>
          </div>
          <div className="input-field">
            <input
              required=""
              autoComplete="off"
              type="email"
              name="email"
              id="email"
              onChange={onchange}
              
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input
              required=""
              autoComplete="off"
              type="password"
              name="password"
              id="password"
              onChange={onchange}
              minLength={5}
              
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-field">
            <input
              required=""
              autoComplete="off"
              type="password"
              name="password"
              id="cpassword"
              onChange={onchange}
              minLength={5}
            />
            <label htmlFor="cpassword">Confirm Password</label>
          </div>

          <div className="btn-container">
            <button  className="btn">Sign Up</button>
            <div className="acc-text">
              New here ?
              <span style={{color :"#0000ff" ,cursor : "pointer"}}>Create Account</span>
            </div>
          </div>
        </form>
      </div>
      </div>

    </div>
  )
}

export default Signup
