import React, { Component, Fragment } from 'react';
import api from '../../services/api.service';
import NavbarGlobal from '../navbar/navbar';

class Genre extends Component {
    //Inicializa o state
    state = {
        new: true,
        genre: {
            Nome: '',
            Ativo: false
        },
        genreID: null
    };

    componentDidMount() {
        //Ao iniciar o componente pega o id passado por parâmetro
        let genreId = this.props.match.params.id;
        if (genreId) {
            //Se passou id, coloca ele no state
            this.setState({ genreID: genreId });
            //Define que não é um novo
            this.setState({ new: false });
            //Pega na API o gênero
            api.get("/genres/" + genreId)
                .then(res => {
                    //Coloca no state
                    this.setState({ genre: res.data });
                });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //Ao submeter valida o nome para não ser vazio
        if (!this.state.genre.Nome) {
            alert("Por gentileza, informe o nome do gênero.");
            return;
        }

        if (this.state.new) {
            //Se for novo, cadastra um novo gênero
            api.post('/genres', this.state.genre)
                .then(() => {
                    //Leva para a listagem para visualizar o novo gênero na listagem
                    this.props.history.push('/genres');
                })
                .catch(() => {
                    alert("Não foi possível salvar o gênero, por favor, tente novamente!");
                });
        } else {
            //Se não for novo, faz update do gênero
            api.put('/genres/' + this.state.genreID, this.state.genre)
                .then(() => {
                    //Leva para a listagem para visualizar o gênero atualizado na listagem
                    this.props.history.push(`/genres`);
                })
                .catch(() => {
                    alert("Não foi possível salvar o gênero, por favor, tente novamente!");
                });
        }
    }

    myChangeHandler = (e) => {
        //Lida com as mudanças nos campos de input
        //Para ser atualizado o state
        let genreTemp = this.state.genre;
        if (e.target.name == "Ativo") {
            genreTemp[e.target.name] = e.target.checked;
        } else {
            genreTemp[e.target.name] = e.target.value;
        }
        this.setState({ genre: genreTemp });
    }

    render() {
        return (
            <Fragment>
                <NavbarGlobal ativo="genres" />
                <div className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <h1>{this.state.new ? 'Cadastrar' : 'Editar'} Gênero</h1>
                        <input
                            type="text"
                            placeholder="Nome do gênero"
                            name="Nome"
                            value={this.state.genre.Nome}
                            onChange={this.myChangeHandler}
                        />
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="Ativo"
                                checked={this.state.genre.Ativo}
                                onChange={this.myChangeHandler}
                            />
                            Ativo
                        </label>
                        <input type="submit" value="Submit" className="button" value={this.state.new ? 'Cadastrar' : 'Editar'} />
                        <a href="/genres">voltar</a>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default Genre;