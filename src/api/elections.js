import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const createElection = (data) => API.post('/elections', data);
export const getElections = () => API.get('/elections');
