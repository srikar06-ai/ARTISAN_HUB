// ═══════════════════════════════════════════════════════════
// ARTISAN HUB — Auth Utility
// JWT login, signup, logout, token storage, auth guard
// ═══════════════════════════════════════════════════════════

const AUTH_TOKEN_KEY = 'artisan_token';
const AUTH_USER_KEY = 'artisan_user';

// Login
async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    return data;
}

// Signup
async function signup(userData) {
    const data = await api.post('/auth/signup', userData);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    return data;
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '/index.html';
}

// Get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Get token
function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Check if logged in
function isLoggedIn() {
    return !!getToken();
}

// Auth guard — redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

// Refresh user data from server
async function refreshUser() {
    try {
        const data = await api.get('/auth/me');
        const token = getToken();
        data.token = token;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
        return data;
    } catch (e) {
        logout();
        return null;
    }
}
