import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Signup from './components/Signup';
import Home from './components/Home';
import Login from './pages/Login';
import Form from './pages/Form';

export default function Routes() {
  return (
  <Router>
    <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/home" component={Home}/>
      <Route path="/register" component={Form}/>
    </Switch>
  </Router>
  );
}