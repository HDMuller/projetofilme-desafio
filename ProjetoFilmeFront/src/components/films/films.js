import React, { Component } from 'react';
import Moment from 'react-moment';
import api from '../../services/api.service';
import NavbarGlobal from '../navbar/navbar';
import { Table, UncontrolledTooltip, Button } from 'reactstrap';

class Films extends Component {
    //Inicializa o state
    state = {
        films: [],
        genres: [],
        selected: []
    };

    componentDidMount() {
        //Pega a listagem de filmes
        api.get('/films?ativo=false')
            .then(res => {
                this.setState({ films: res.data });
            });

        //Pega os gêneros para dar bind do nome na listagem
        api.get('/genres?ativo=false')
            .then(res => {
                this.setState({ genres: res.data });
            });
    }

    onDelete(filmID) {
        //Chama a API para deletar o filme
        api.delete('/films/' + filmID)
            .then(() => {
                //Cria uma cópia do state atual
                let array = [...this.state.films];
                //Pega o item do array que foi deletado
                let item = array.find(q => q.ID == filmID);
                //Pega o index do item a ser deletado no array
                var index = array.indexOf(item);
                if (index !== -1) {
                    //Deleta o item no array
                    array.splice(index, 1);
                    //Atualiza o state
                    this.setState({ films: array });
                }
            })
            .catch(error => {
                alert(error.response.data.Message);
            });
    }

    selectChangeHandler = (e, filmID) => {
        //Lida com as mudanças nos campo de select da lista
        //Para ser atualizado o state
        let selected = this.state.selected;
        if (e.target.checked) {
            // Se foi selecionado concatena na lista de selecionados para deletar
            selected = selected.concat(filmID);
        } else {
            // Se não foi selecionado deleta da lista de selecionados para deletar
            var index = selected.indexOf(filmID);
            if (index !== -1) {
                selected.splice(index, 1);
            }
        }
        //Atualiza a lista
        this.setState({
            selected: selected
        });
    }

    deleteMany() {
        this.state.selected.forEach(element => {
            this.onDelete(element);
        });
        this.setState({ selected: [] });
    }

    render() {
        return (
            <div>
                <NavbarGlobal ativo="films" />
                <div className="newButton">
                    <Button href="/add-film" color="success">Novo Filme</Button>{' '}
                </div>
                <Table hover bordered>
                    <thead>
                        <tr>
                            <th>
                                <svg
                                    onClick={() => { if (window.confirm('Você tem certeza que deseja deletar estes filmes?')) this.deleteMany() }}
                                    id="DeleteMany" className="bi bi-trash" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path><path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd" /></svg>
                                <UncontrolledTooltip placement="top" target="DeleteMany">
                                    Deletar Vários
                                </UncontrolledTooltip>
                            </th>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Data de Criação</th>
                            <th>Ativo</th>
                            <th>Gênero</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.films.map(film =>
                            <tr key={film.ID}>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            this.selectChangeHandler(e, film.ID)
                                        }}
                                    />
                                </td>
                                <td>{film.ID}</td>
                                <td>{film.Nome}</td>
                                <td><Moment format="DD/MM/YYYY">{film.DataCriacao}</Moment></td>
                                <td>{film.Ativo ? 'Sim' : 'Não'}</td>
                                <td>{this.state.genres.length > 0 ? this.state.genres.find(q => q.ID == film.GeneroID).Nome : ''}</td>
                                <td>
                                    <svg
                                        onClick={() => { this.props.history.push('film/' + film.ID) }}
                                        id="Editar" className="bi bi-pencil" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fillRule="evenodd" d="M13.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM14 4l2 2-9 9-3 1 1-3 9-9z" clipRule="evenodd"></path><path fillRule="evenodd" d="M14.146 8.354l-2.5-2.5.708-.708 2.5 2.5-.708.708zM5 12v.5a.5.5 0 00.5.5H6v.5a.5.5 0 00.5.5H7v.5a.5.5 0 00.5.5H8v-1.5a.5.5 0 00-.5-.5H7v-.5a.5.5 0 00-.5-.5H5z" clipRule="evenodd"></path></svg>
                                    <UncontrolledTooltip placement="top" target="Editar">
                                        Editar
                                    </UncontrolledTooltip>
                                    <svg
                                        onClick={() => { if (window.confirm('Você tem certeza que deseja deletar este filme?')) this.onDelete(film.ID) }}
                                        id="Deletar" className="bi bi-trash" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path><path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd" /></svg>
                                    <UncontrolledTooltip placement="top" target="Deletar">
                                        Deletar
                                    </UncontrolledTooltip>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Films;