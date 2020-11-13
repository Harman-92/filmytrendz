import axios from 'axios'


/**
 * Backend Connection configuration
 * Replace the below baseUrl with your local IP to connect to local backend server
 **/
const api = axios.create({
    baseURL: 'https://ec2-18-188-47-194.us-east-2.compute.amazonaws.com:5000',
    timeout: 20000
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
    api.interceptors.request.use(function(config) {
        config.headers.Authorization = token;
        return config;
    });
};

export default api;
