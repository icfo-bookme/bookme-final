
import api from './api';

// Register a user
export async function register({ name, email, password, phone}) {
  try {
    const response = await api.post('/api/register', { name, email, password, phone });
    return response.data; // contains { token }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
}

// Login user
export async function login({ email, password }) {
  try {
    const response = await api.post('/api/login', { email, password });
    return response.data; // contains { token }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
}

// Get authenticated user data
export async function getUser(token) {
  try {
    const response = await api.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // user object
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

// Logout user
export async function logout(token) {
  try {
    const response = await api.post(
      '/logout',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Logout failed');
  }
}
