import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';

import api from '../../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await api.post('/devs', {
            username
        });

        const { _id } = response.data;

        localStorage.setItem('@tindev/userId', _id)

        history.push('/dev')
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev logo" />
                <input
                    placeholder="Digite seu usuário do github"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Login;