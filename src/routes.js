import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import List from './pages/List';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/list/:id" component={List} />
    </BrowserRouter>
  );
}