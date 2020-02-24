import React, { Component } from 'react';
import Moment from 'react-moment';
import api from '../../services/api.service';
import NavbarGlobal from '../navbar/navbar';
import { Table, UncontrolledTooltip, Button } from 'reactstrap';

class Leases extends Component {
    //Inicializa o state
    state = {
        leases: [],
        films: []
    };

    componentDidMount() {
        //Pega a listagem de locações
        api.get('/leases')
            .then(res => {
                res.data.forEach(element => {
                    element.Filmes = JSON.parse(element.Filmes);
                });
                this.setState({ leases: res.data });
            });

        //Pega os filmes para dar bind do nome na listagem
        api.get('/films?ativo=false')
            .then(res => {
                this.setState({ films: res.data });
            });
    }

    async onDelete(leaseID) {
        //Chama a API para deletar o lease
        api.delete('/leases/' + leaseID)
            .then(() => {
                //Cria uma cópia do state atual
                let array = [...this.state.leases];
                //Pega o item do array que foi deletado
                let item = array.find(q => q.ID == leaseID);
                //Pega o index do item a ser deletado no array
                var index = array.indexOf(item);
                if (index !== -1) {
                    //Deleta o item no array
                    array.splice(index, 1);
                    //Atualiza o state
                    this.setState({ leases: array });
                }
            });
    }

    render() {
        return (
            <div>
                <NavbarGlobal ativo="leases" />
                <div className="newButton">
                    <Button href="/add-lease" color="success">Nova Locação</Button>{' '}
                </div>
                <Table hover bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CPF</th>
                            <th>Filmes</th>
                            <th>Data da Locação</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.leases.map(lease =>
                            <tr key={lease.ID}>
                                <td>{lease.ID}</td>
                                <td>{lease.CPF}</td>
                                <td>
                                    <ul>
                                        {lease.Filmes.map(film =>
                                            <li>{this.state.films.length > 0 ? this.state.films.find(q => q.ID == film).Nome : ''}</li>
                                        )}
                                    </ul>
                                </td>
                                <td><Moment format="DD/MM/YYYY">{lease.DataLocacao}</Moment></td>
                                <td>
                                    <svg
                                        onClick={() => { this.props.history.push('lease/' + lease.ID) }}
                                        id="Editar" className="bi bi-pencil" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fillRule="evenodd" d="M13.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM14 4l2 2-9 9-3 1 1-3 9-9z" clipRule="evenodd"></path><path fillRule="evenodd" d="M14.146 8.354l-2.5-2.5.708-.708 2.5 2.5-.708.708zM5 12v.5a.5.5 0 00.5.5H6v.5a.5.5 0 00.5.5H7v.5a.5.5 0 00.5.5H8v-1.5a.5.5 0 00-.5-.5H7v-.5a.5.5 0 00-.5-.5H5z" clipRule="evenodd"></path></svg>
                                    <UncontrolledTooltip placement="top" target="Editar">
                                        Editar
                                    </UncontrolledTooltip>
                                    <svg
                                        onClick={() => { if (window.confirm('Você tem certeza que deseja deletar esta locação?')) this.onDelete(lease.ID) }}
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

export default Leases;