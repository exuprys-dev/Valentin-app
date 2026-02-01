import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios avec la configuration par défaut
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Services API
export const apiService = {
    // Vérifier la santé de l'API
    checkHealth: () => api.get('/health'),
    
    // Récupérer tous les partenaires
    getPartners: () => api.get('/partners'),
    
    // Enregistrer un utilisateur
    registerUser: (userData) => api.post('/users', userData),
    
    // Calculer les compatibilités
    calculateCompatibility: (userId, userData) => 
        api.post('/calculate-compatibility', { userId, userData }),
    
    // Envoyer un message
    sendMessage: (matchId, senderId, content) => 
        api.post('/messages', { matchId, senderId, content }),
    
    // Récupérer les messages
    getMessages: (matchId) => api.get(`/messages/${matchId}`),
    
    // Récupérer les matches d'un utilisateur
    getUserMatches: (userId) => api.get(`/users/${userId}/matches`),
};