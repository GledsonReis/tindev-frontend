import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import Logo from '../assets/logo.svg';

export default function Login({ history }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handlerSub(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      username,
      password,
    });
    const { _id } = response.data;

    history.push(`/list/${_id}`);
  }

  function handlerClick(e){
    e.preventDefault();

    history.push('/signup')
  }

  return (
    <div className="login-container">
      <form onSubmit={handlerSub}>
        <img src={Logo} alt="Tinder"/>
        <input 
          placeholder="Digite o nome de usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          placeholder="Digite o nome de usuário"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      <button type="button" onClick={e => handlerClick(e)}>Cadastrar</button>
    </div>
  );  
}