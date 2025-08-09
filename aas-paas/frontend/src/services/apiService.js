import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // The base URL of our Spring Boot app

export const identifyImage = (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the @RequestParam name in the controller

    return axios.post(`${API_URL}/identify`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};