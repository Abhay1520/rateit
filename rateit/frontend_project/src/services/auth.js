import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Update this

export const loginUser = (credentials) =>
  axios.post(`${BASE_URL}/token/`, credentials);

export const registerUser = (data) =>
  axios.post(`${BASE_URL}/users/`, data);
