import axios from 'axios'

console.log('VITE_API_URL =>', import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})

export default axiosInstance;