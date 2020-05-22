import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import './Form.css';

import Logo from '../assets/logo.svg';

export default function Form({history}) {
  const [newUser, setNewUser] = useState({ email: '', password: '', bio: '' });
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const { state, dispatch } = useContext(AuthContext);
  
  const { avatar_url, name, login, bio } = state.user
  
  useEffect(() => {
    const value = (bio === null) ? "" : bio;
    setNewUser(prevState => {
      return { ...prevState, bio: value }
    });
  }, []);

  async function handlerSub(e) {
    e.preventDefault();
    setData({ ...data, isLoading: true });

    const requestData = {
      user: {
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password,
        avatar: avatar_url,
        username: login,
        name: name,
        bio: newUser.bio
      }
    };

    const proxy_url = state.proxy_url;

    fetch(proxy_url+"/register", {
      method: "POST",
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 422) {
          setData({
            isLoading: false,
            errorMessage: "Sorry! Signup failled."
          });
        } else {
          dispatch({
            type: "LOGOUT"
          });
          history.push(`/`);
        }
      })
      .catch(error => {
        setData({
          isLoading: false,
          errorMessage: "Sorry! Signup failled."
        });
      });
  }

  function updateEmail(e) {
    const email = e.target.value;
    setNewUser(prevState => {
      return { ...prevState, email: email }
    });
  }

  function updatePassword(e) {
    const password = e.target.value;
    setNewUser(prevState => {
      return { ...prevState, password: password }
    });
  }

  function updateBio(e) {
    const bio = e.target.value;
    setNewUser(prevState => {
      return { ...prevState, bio: bio }
    });
  }

  return (
    <div className="login-container">
      <form onSubmit={handlerSub}>
        <img className="logo" src={Logo} alt="Tinder"/>
        <span className="error">{data.errorMessage}</span>
        <input 
          name="email"
          placeholder="Digite o email"
          value={newUser.email}
          onChange={e => updateEmail(e)}
        />
        <input 
          name="password"
          placeholder="Senha"
          type="password"
          value={newUser.password}
          onChange={e => updatePassword(e)}
        />
        <img className="avatar" src={avatar_url} alt="Avatar"/>
        <input 
          readOnly
          hidden
          value={avatar_url}
        />
        <input 
          readOnly
          value={name}
        />
        <input 
          readOnly
          value={login}
        />
        <textarea
          placeholder="Bio"
          value={newUser.bio}
          onChange={e=>updateBio(e)}
        />
        {data.isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {
              // Link to request GitHub access
            }
            <button
              className="login-link"
              type="submit"
            >
              <span>Criar conta</span>
            </button>
          </>
        )}
      </form>
    </div>
  );
}