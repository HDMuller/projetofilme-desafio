import React, { useState } from 'react';
import api from "../../services/api.service";

export default function Register({ history }) {
    async function handleSubmit(e) {
        e.preventDefault();

        //Ao submeter valida o usuário e senha para não ser vazio
        if (!username) {
            alert("Por gentileza, informe um usuário.");
            return;
        }
        if (!password) {
            alert("Por gentileza, informe uma senha.");
            return;
        }

        //Salva o usuário
        api.post('/register', { username, password })
            .then(() => {
                //Informa ao usuário que o usuário foi cadastrado e retorna para o login
                alert("Usuário cadastrado.\nFaça login para acessar.");
                history.push(`/`);
            })
            .catch(() => {
                alert("Não foi possível salvar o usuário, tente novamente.");
            });
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1>Cadastre-se!</h1>
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
                <input type="submit" className="button" value="Cadastrar" />
                <a href="/">voltar</a>
            </form>
        </div>
    )
}
