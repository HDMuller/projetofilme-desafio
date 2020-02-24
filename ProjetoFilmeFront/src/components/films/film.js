import React, { Component, Fragment } from 'react';
import api from '../../services/api.service';
import NavbarGlobal from '../navbar/navbar';

class Film extends Component {
    //Inicializa o state
    state = {
        new: true,
        genres: [],
        film: {
            Nome: '',
            Ativo: false,
            GeneroID: 0
        },
        filmID: null
    };

    componentDidMount() {
        //Ao iniciar o componente pega o id passado por parâmetro
        let filmId = this.props.match.params.id;
        if (filmId) {
            //Se passou id, coloca ele no state
            this.setState({ filmID: filmId });
            //Define que não é um novo
            this.setState({ new: false });
            //Pega na API o filme
            api.get("/films/" + filmId)
                .then(res => {
                    //Coloca no state
                    console.log(res.data);
                    this.setState({ film: res.data });
                });
        }

        //Pega os gêneros filtrando por somente ativos, para dar bind no select
        api.get('/genres?ativo=true')
            .then(res => {
                this.setState({ genres: res.data });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        //Ao submeter valida o nome e o gênero para não ser vazio
        if (!this.state.film.Nome) {
            alert("Por gentileza, informe o nome do filme.");
            return;
        }
        if (this.state.film.GeneroID <= 0) {
            alert("Por gentileza, informe o gênero do filme.");
            return;
        }

        if (this.state.new) {
            //Se for novo, cadastra um novo filme
            api.post('/films', this.state.film)
                .then(() => {
                    //Leva para a listagem para visualizar o novo filme na listagem
                    this.props.history.push('/films');
                })
                .catch(() => {
                    alert("Não foi possível salvar o filme, por favor, tente novamente!");
                });
        } else {
            //Se não for novo, faz update do filme
            api.put('/films/' + this.state.filmID, this.state.film)
                .then(() => {
                    //Leva para a listagem para visualizar o filme atualizado na listagem
                    this.props.history.push(`/films`);
                })
                .catch(() => {
                    alert("Não foi possível salvar o filme, por favor, tente novamente!");
                });
        }
    }

    myChangeHandler = (e) => {
        //Lida com as mudanças nos campos de input
        //Para ser atualizado o state
        let filmTemp = this.state.film;
        if (e.target.name == "Ativo") {
            filmTemp[e.target.name] = e.target.checked;
        } else {
            filmTemp[e.target.name] = e.target.value;
        }
        this.setState({ film: filmTemp });
    }

    render() {
        return (
            <Fragment>
                <NavbarGlobal ativo="films" />
                <div className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <h1>{this.state.new ? 'Cadastrar' : 'Editar'} Filme</h1>
                        <input
                            type="text"
                            placeholder="Nome do filme"
                            name="Nome"
                            value={this.state.film.Nome}
                            onChange={this.myChangeHandler}
                        />
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="Ativo"
                                checked={this.state.film.Ativo}
                                onChange={this.myChangeHandler}
                            />
                            Ativo
                        </label>
                        <select
                            name="GeneroID"
                            value={this.state.film.GeneroID}
                            onChange={this.myChangeHandler}
                        >
                            <option value="">Selecione...</option>
                            {this.state.genres.map(genre => (
                                <option
                                    key={genre.ID}
                                    value={genre.ID}
                                >
                                    {genre.Nome}
                                </option>
                            ))}
                        </select>
                        <input type="submit" value="Submit" className="button" value={this.state.new ? 'Cadastrar' : 'Editar'} />
                        <a href="/films">voltar</a>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default Film;