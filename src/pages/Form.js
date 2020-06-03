import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import GithubIcon from "mdi-react/GithubIcon";
import api from '../services/api';
import Logo from '../assets/logo.svg';
import './Form.css';

export default function Form({history}) {
  const [newUser, setNewUser] = useState({ email: '', password: '', bio: '', avatar: '', name: '', username: '' });
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const { state, dispatch } = useContext(AuthContext);
  
  const { client_id, redirect_uri } = state;
  
  useEffect(() => {
    if (state.isOauthed) {
      const { avatar_url, name, login, bio } = state.gituser;
      const value = (bio === null) ? "" : bio;
      setNewUser(prevState => {
        return { ...prevState, bio: value, avatar: avatar_url, name: name, username: login}
      });
    }
  
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setData({ ...data, isLoading: true });

      const requestData = {
        client_id: state.client_id,
        redirect_uri: state.redirect_uri,
        client_secret: state.client_secret,
        code: newUrl[1]
      };

      const proxy_url = state.proxy_url;

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxy_url+"/authenticate", {
        method: "POST",
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
          dispatch({
            type: "GITLOGIN",
            payload: { gituser: data, isOauthed: true }
          });
          setData({ ...data, isLoading: false });
        })
        .catch(error => {
          setData({
            isLoading: false,
            errorMessage: "Sorry! Login failed"
          });
        });
    }
  }, [state, dispatch, data]);

  const handleLogout = () => {
    setData({ ...data, isLoading: false });
    dispatch({
      type: "GITLOGOUT"
    });
  } 

  async function handlerSub(e) {
    e.preventDefault();
    setData({ ...data, isLoading: true });

    const user = {
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password,
        avatar: newUser.avatar,
        username: newUser.username,
        name: newUser.name,
        bio: newUser.bio
    };

    await api.post('/signup', { user })
      .then(response => {
        // setData({...data, isLoading: false});
        dispatch({
          type: "GITLOGOUT"
        });
        history.push(`/`);
      })
      .catch(error => {
        console.log(error)
         setData({
          isLoading: false,
          errorMessage: "Sorry! Signup failled."
        });
      })
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
    <div className="signup-container">
      {state.isOauthed ? (
        <>
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
            <img className="avatar" src={newUser.avatar} alt="Avatar"/>
            <input 
              readOnly
              hidden
              value={newUser.avatar}
            />
            <input 
              readOnly
              value={newUser.name}
            />
            <input 
              readOnly
              value={newUser.username}
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
                  className="success"
                  type="submit">
                  <span>Criar conta</span>
                </button>
              </>
            )}
            <button className="cancel" onClick={()=> handleLogout()}>Tentar outra conta</button>
          </form>
        </>
      ) : (
        <>
          <form>
            <img className="logo" src={Logo} alt="Tinder"/>
            <div className="gitbutton">
              {data.isLoading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  <a
                    href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
                    onClick={() => {
                      setData({ ...data, errorMessage: "" });
                    }}
                  >
                    <GithubIcon className="giticon"/>
                    <span>Registrar com GitHub</span>
                  </a>
                </>
              )}
            </div>
          </form>
        </>
      ) }
    </div>
  );
}