import * as React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Register: React.FC = () =>  {

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signup = async (event) => {

    event.preventDefault();
    const response = await fetch('http://localhost:9000/register', 
    {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name: name, email: email, password: password})
    })
    const data = await response.json();

    alert("Signed Up")
  }

  return (
    <div>
        <div>
          Name: <input type="textbox" 
            onChange={(e) => {setName(e.target.value)}}></input> <br/>
          Email: <input type="textbox" 
            onChange={(e) => {setEmail(e.target.value)}}></input> <br/>
          Password: <input type="textbox" 
            onChange={(e) => {setPassword(e.target.value)}}></input> <br/>
          <Link className="button-inv" to="/login">Log In</Link>
          <button onClick={signup}>Sign Up</button>
        </div>
    </div>
  );
}

export default Register;
