import * as React from 'react';
import Todo from './Todo';
import './index.css';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Switch,
  Route } from "react-router-dom";

const App: React.FC = () =>  {


  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/todo">
          <Todo />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
