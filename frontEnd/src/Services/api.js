import axios from 'axios';

// const urlBase = 'http://localhost:3333';
const urlBase = process.env.URL_API_PAINEL;

const api = axios.create({
    baseURL: urlBase,
});

export default api;