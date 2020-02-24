import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:52165/api',
    baseURL: 'https://projetofilmesapi.azurewebsites.net/api',
    headers: {
        'Accept': 'application/json'
    }
})

export default api;