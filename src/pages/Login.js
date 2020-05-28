import React, { useState, useContext } from 'react';
import { AuthContext } from "../App";
import { Redirect } from "react-router-dom";
import api from '../services/api';
import Logo from '../assets/logo.svg';
import './Login.css';

export default function Login({ history }) {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const { state, dispatch } = useContext(AuthContext);

  async function handlerSub(e) {
    e.preventDefault();

    await api.post('/authenticate', { email, password})
      .then(response => {
        dispatch({
          type: "LOGIN",
          payload: { user: response.data.user, isLoggedIn: true, token: response.data.auth_token }
        });
      })
      .catch(error => {
        setData({
          isLoading: false,
          errorMessage: "Sorry! Login failed"
        });
      })
  }

  function handlerClick(e){
    e.preventDefault();

    history.push('/register')
  }

  if (state.isLoggedIn) {
    return <Redirect to="/list" />;
  }

  return (
    <div className="login-container">
      <form onSubmit={handlerSub}>
        <img src={Logo} alt="Tinder"/>
        <span className="error">{data.errorMessage}</span>
        <input 
          placeholder="Email"
          value={email}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <a href={window.location.href} onClick={e => handlerClick(e)}>Criar Conta</a>
      </form>
    </div>
  );  
}