import axios from 'axios'
console.log(import.meta.env.VITE_BACKEND_BASE_URL);

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/auth`,  // Matches PORT in backend .env
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export const googleAuth = (code) => api.get(`/google?code=${code}`)
