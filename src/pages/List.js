import React, { useEffect, useState, useContext } from 'react';
import './List.css';
import Logo from '../assets/logo.svg';
import ItsaMatch from '../assets/itsamatch.svg';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import api from '../services/api';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from "../App";
import { ActionCableConsumer } from 'react-actioncable-provider';

export default function List({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const { state, dispatch } = useContext(AuthContext);
  const token = state.token;
  const isLoggedIn = state.isLoggedIn;
  
  async function handleLogout(){
    await api.delete('/logout')
    dispatch({
      type: "LOGOUT"
    });
  }

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/users')

      setUsers(response.data);
    }

    if (!(token == null)){
      loadUsers();
    }
  }, [token]);

  // useEffect(() => {
  //   consumer.subscriptions.create({ channel: "MatchChannel", target_id: state.user.id},
  //   {
  //     received: (data) => {
  //     console.log(data)
  //   }})
  //   // const socket = io('http://localhost:3333', {
  //   //   query: { user: state.user }
  //   // });

  //   // socket.on('match', dev => {
  //   //   setMatchDev(dev)
  //   // })
  // }, [state.user.id, consumer]);

  async function handleLike(id) {
    await api.post(`/like`, { target_id: id })

    setUsers(users.filter(user => user.id !== id))
  }
  
  async function handleDislike(id) {
    await api.post(`dislike`, { target_id: id })
   

    setUsers(users.filter(user => user.id !== id))
  }

 
  function handleReceived(message) {
    setMatchDev(message)
  }

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }
  
  return(
    <div className="list-container">
      <button className="cancel" onClick={()=> handleLogout()}>Logout</button>
      <Link to="/">
        <img src={Logo} className="logo" alt="Tinder"/>
      </Link>
      { users.length > 0 ? (
        <ul>
          {users.map(user =>(
            <li key={user.id}>
              <img src={user.avatar} alt=""/>
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button">
                  <img src={dislike} alt="" onClick={() => handleDislike(user.id)}/>
                </button>
                <button type="button">
                  <img src={like} alt="" onClick={() => handleLike(user.id)}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty"> Nenhum usúario encontrado. </div>     
      ) }
      <ActionCableConsumer
        channel={{channel: "MatchChannel", target_id: state.user.id}}
        onReceived={handleReceived}
      >
      </ActionCableConsumer>

      { matchDev && (
        <div className="match-container">
          <img className="itsamatch" src={ItsaMatch} alt=""/>
          <img className="avatar" src={matchDev.avatar} alt=""/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
        </div>
      ) }
    </div>
  );
}