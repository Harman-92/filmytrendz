import axios from 'axios';
import response from "./response";
import {removeAccessToken} from "./session";

/**
 * Backend Connection configuration
 * Replace the below baseUrl with your local IP to connect to local backend server
 **/
const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000
});
api.interceptors.response.use(response => {
    return response;
}, error => {
    console.log(error)
    if (error.response.status === 401) {
        alert(response.INVALID_TOKEN)
        removeAccessToken()
    }
    return error.response;
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
    api.interceptors.request.use(function(config) {
        config.headers.Authorization = token;
        return config;
    });
};

export default api;
