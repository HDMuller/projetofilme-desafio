import React, { Component, Fragment } from 'react';
import api from '../../services/api.service';
import NavbarGlobal from '../navbar/navbar';
import DatePicker from 'react-datepicker';
import { cpfMask } from '../../services/cpfMask';
import "react-datepicker/dist/react-datepicker.css";

class Lease extends Component {
    //Inicializa o state
    state = {
        new: true,
        films: [],
        lease: {
            CPF: '',
            Filmes: [],
            DataLocacao: new Date()
        },
        leaseID: null
    };

    componentDidMount() {
        //Ao iniciar o componente pega o id passado por parâmetro
        let leaseId = this.props.match.params.id;
        if (leaseId) {
            //Se passou id, coloca ele no state
            this.setState({ leaseID: leaseId });
            //Define que não é um novo
            this.setState({ new: false });
            //Pega na API o filme
            api.get("/leases/" + leaseId)
                .then(res => {
                    //Ajusta a data quando vem, pois vem como string
                    res.data.DataLocacao = new Date(res.data.DataLocacao);
                    res.data.Filmes = JSON.parse(res.data.Filmes);
                    //Coloca no state
                    this.setState({ lease: res.data });
                });
        }

        //Pega os filmes filtrando por somente ativos, para dar bind no select
        api.get('/films?ativo=true')
            .then(res => {
                this.setState({ films: res.data });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        //Ao submeter valida o CPF, os Filmes e a Data da Locação para não ser vazio
        if (!this.state.lease.CPF) {
            alert("Por gentileza, informe o CPF do cliente.");
            return;
        }
        if (this.state.lease.Filmes.length <= 0) {
            alert("Por gentileza, informe ao menos um filme.");
            return;
        }

        let leaseTemp = this.state.lease;
        leaseTemp.Filmes = JSON.stringify(leaseTemp.Filmes);
        this.setState({ lease: leaseTemp });

        if (this.state.new) {
            //Se for novo, cadastra uma nova locação
            api.post('/leases', this.state.lease)
                .then(() => {
                    //Leva para a listagem para visualizar a nova locação na listagem
                    this.props.history.push('/leases');
                })
                .catch(() => {
                    alert("Não foi possível salvar a locação, por favor, tente novamente!");
                });
        } else {
            //Se não for novo, faz update da locação
            api.put('/leases/' + this.state.leaseID, this.state.lease)
                .then(() => {
                    //Leva para a listagem para visualizar a locação atualizado na listagem
                    this.props.history.push(`/leases`);
                })
                .catch(() => {
                    alert("Não foi possível salvar a locação, por favor, tente novamente!");
                });
        }
    }

    myChangeHandler = (e) => {
        //Lida com as mudanças nos campos de input
        let leaseTemp = this.state.lease;
        if (e.target) {
            if (e.target.name == "Filmes") {
                //Caso for filme, como é um select multiple necessita de um tratamento diferente
                leaseTemp[e.target.name] = Array.from(e.target.selectedOptions, o => o.value);
            } else {
                //Somente o cpf vai se encaixar nesse else, então mascara para CPF
                leaseTemp[e.target.name] = cpfMask(e.target.value);
            }
        } else {
            //O DatePicker passa o valor da data diretamente no e
            leaseTemp['DataLocacao'] = e;
        }
        //Atualiza o state
        this.setState({ lease: leaseTemp });
    }

    render() {
        return (
            <Fragment>
                <NavbarGlobal ativo="leases" />
                <div className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <h1>{this.state.new ? 'Cadastrar' : 'Editar'} Locação</h1>
                        <input
                            type="text"
                            placeholder="CPF do Cliente"
                            name="CPF"
                            value={this.state.lease.CPF}
                            onChange={this.myChangeHandler}
                            maxLength="14"
                        />
                        <label>Selecione os filmes:</label>
                        <select
                            name="Filmes"
                            value={this.state.lease.Filmes}
                            onChange={this.myChangeHandler}
                            multiple
                            style={{ height: 300 + 'px', marginTop: 0 }}
                        >
                            {this.state.films.map(film => (
                                <option
                                    key={film.ID}
                                    value={film.ID}
                                >
                                    {film.Nome}
                                </option>
                            ))}
                        </select>
                        <label>Data da Locação:</label>
                        <DatePicker
                            id="DataLocacao"
                            name="DataLocacao"
                            selected={this.state.lease.DataLocacao}
                            onChange={this.myChangeHandler}
                            dateFormat="dd/MM/yyyy"
                        />
                        <input type="submit" value="Submit" className="button" value={this.state.new ? 'Cadastrar' : 'Editar'} />
                        <a href="/leases">voltar</a>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default Lease;