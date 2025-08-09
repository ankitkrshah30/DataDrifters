import axios from 'axios';

// IMPORTANT: This URL will be updated later when we deploy the backend
const API_URL = 'http://localhost:8080/api';

export const identifyImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/identify`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};