// Real authentication service using API
import { authAPI } from '@/services/api';

export async function handleLogin(role, credentials) {
  try {
    // Map frontend credentials to API format
    const loginData = {
      email: credentials.username, // Frontend uses 'username' but API expects 'email'
      password: credentials.password
    };

    const response = await authAPI.login(loginData);
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Trigger storage event for navbar update
    window.dispatchEvent(new Event('storage'));
    
    return { 
      success: true, 
      role: response.user.role,
      user: response.user
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.message || 'Login failed' 
    };
  }
}

export async function handleRegister(role, userData) {
  try {
    // Add role to user data
    const registerData = {
      ...userData,
      role: role === 'client' ? 'partner' : 'admin' // Map frontend roles to API roles
    };

    const response = await authAPI.register(registerData);
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Trigger storage event for navbar update
    window.dispatchEvent(new Event('storage'));
    
    return { 
      success: true, 
      message: 'Registration successful',
      user: response.user
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error.message || 'Registration failed' 
    };
  }
}

export async function handleForgotPassword(email) {
  try {
    // TODO: Implement forgot password API call
    return { 
      success: true, 
      message: 'Thank you! An email has been sent' 
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to send reset email' 
    };
  }
}

export async function handleOAuthLogin(provider, role) {
  try {
    // TODO: Implement OAuth login
    return { 
      success: true, 
      provider, 
      role 
    };
  } catch (error) {
    console.error('OAuth login error:', error);
    return { 
      success: false, 
      message: error.message || 'OAuth login failed' 
    };
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Trigger storage event for navbar update
  window.dispatchEvent(new Event('storage'));
  
  window.location.href = '/login';
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
