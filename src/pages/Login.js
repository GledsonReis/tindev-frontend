import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import Logo from '../assets/logo.svg';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handlerSub(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      username,
    });
    const { _id } = response.data;

    history.push(`/list/${_id}`);
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
        <button type="submit">Enviar</button>
      </form>
    </div>
  );  
}