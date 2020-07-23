import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

import api from "../../services/api";
import io from "socket.io-client";

import logo from "../../assets/logo.svg";
import like from "../../assets/like.svg";
import dislike from "../../assets/dislike.svg";
import itsamatch from "../../assets/itsamatch.png";

function Main() {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  const userId = localStorage.getItem("@tindev/userId");

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: userId,
        },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [userId]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:7777", {
      query: { user: userId },
    });

    socket.on("match", (dev) => {
      setMatchDev(dev);
    });
  }, [userId]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: {
        user: userId,
      },
    });

    setUsers(users.filter((user) => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: {
        user: userId,
      },
    });

    setUsers(users.filter((user) => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/" onClick={() => localStorage.clear()}>
        <img src={logo} alt="Tindev logo" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio ?? "A stronger Paladin!"}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike button" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like button" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
          <div className="empty">Acabou :(</div>
        )}

      {!!matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="Itsamatch" />
          <img
            className="avatar"
            src={matchDev.avatar}
            alt={matchDev.name}
          />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      )}
    </div>
  );
}

export default Main;
