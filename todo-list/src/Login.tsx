import * as React  from 'react';
import { Link, useHistory } from 'react-router-dom';
import './index.css';

const Login: React.FC = () =>  {
  const history = useHistory();
  const [error , setError] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  let [response, setResponse] = React.useState({msg:""});
  
  const loginHandler = async (event) => {

    event.preventDefault();
    const res = await fetch('http://localhost:9000/login', 
    {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password})
    })
    const data = await res.json();
    setError(data.err);
    setResponse(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("id", data.id);

    if(data.token){
      history.push("/todo")
    }
  }

  return (
    <div>
        <div>
          Email: <input type="textbox" 
            onChange={(e) => {setEmail(e.target.value)}}></input> <br/>
          Password: <input type="textbox" 
            onChange={(e) => {setPassword(e.target.value)}}></input> <br/>
          <button onClick={loginHandler}>Log In</button>
          {
            error ? <div>{response && response.msg}</div> : null
          }
          <Link to="/register">Sign Up</Link>
        </div>
    </div>
  );
}

export default Login;