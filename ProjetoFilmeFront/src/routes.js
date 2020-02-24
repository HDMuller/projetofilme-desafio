import React from "react"
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Films from "./components/films/films";
import Film from "./components/films/film";
import Genres from "./components/genres/genres";
import Genre from "./components/genres/genre";
import Leases from "./components/leases/leases";
import Lease from "./components/leases/lease";

// Essa parte é responsável por travar as rotas caso o usuário não esteja autenticado no sistema
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        JSON.parse(localStorage.getItem('ProjetoFilmeAutenticado')) == true
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/'
          }} />
    )} />
  )

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/films" component={Films} />
            <PrivateRoute path="/add-film" component={Film} />
            <PrivateRoute path="/film/:id" component={Film} />
            <PrivateRoute path="/genres" component={Genres} />
            <PrivateRoute path="/add-genre" component={Genre} />
            <PrivateRoute path="/genre/:id" component={Genre} />
            <PrivateRoute path="/leases" component={Leases} />
            <PrivateRoute path="/add-lease" component={Lease} />
            <PrivateRoute path="/lease/:id" component={Lease} />
        </BrowserRouter>
    )
}