import React, { useEffect, useState } from 'react';
import './List.css';
import Logo from '../assets/logo.svg';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function List({ match }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id))
  }
  
  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    })

    setUsers(users.filter(user => user._id !== id))
  }

  return(
    <div className="list-container">
      <Link to="/">
        <img src={Logo} className="logo" alt="Tinder"/>
      </Link>
      { users.length > 0 ? (
        <ul>
          {users.map(user =>(
            <li key={user._id}>
              <img src={user.avatar} alt=""/>
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button">
                  <img src={dislike} alt="" onClick={() => handleDislike(user._id)}/>
                </button>
                <button type="button">
                  <img src={like} alt="" onClick={() => handleLike(user._id)}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty"> Nenhum usúario encontrado. </div>     
      ) }
    </div>
  );
}