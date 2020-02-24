import React, { useState } from 'react';
import "./login.css"
import api from "../../services/api.service";

export default function Login({ history }) {
    async function handleSubmit(e) {
        e.preventDefault()

        api.put('/register', { username, password })
            .then(() => {
                localStorage.setItem('ProjetoFilmeAutenticado', true);
                history.push(`/films`);
            })
            .catch(() => {
                alert("Usuário ou senha incorretos!");
            });
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1>Bem vindo!</h1>
                <input
                    type="text"
                    placeholder="Seu usuário"
                    name="username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Sua senha"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <input type="submit" value="Submit" className="button" value="Entrar" />
                <a href="/register">cadastre-se</a>
            </form>
        </div>
    )
}
