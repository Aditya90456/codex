const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    try {
      this.token = localStorage.getItem('authToken');
    } catch (error) {
      console.warn('localStorage not available:', error);
      this.token = null;
    }
  }

  // Helper method to make requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Problem methods
  async getProblems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/problems${queryString ? `?${queryString}` : ''}`);
  }

  async getProblem(id) {
    return this.request(`/problems/${id}`);
  }

  async getRandomProblem(difficulty = null) {
    const params = difficulty ? `?difficulty=${difficulty}` : '';
    return this.request(`/problems/random/pick${params}`);
  }

  // Code execution methods
  async executeCode(codeData) {
    return this.request('/execute', {
      method: 'POST',
      body: codeData,
    });
  }

  async executeCustomCode(codeData) {
    return this.request('/execute/custom', {
      method: 'POST',
      body: codeData,
    });
  }

  // Submission methods
  async submitSolution(submissionData) {
    return this.request('/submissions', {
      method: 'POST',
      body: submissionData,
    });
  }

  async getSubmission(id) {
    return this.request(`/submissions/${id}`);
  }

  async getUserSubmissions(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/submissions/user/${userId}${queryString ? `?${queryString}` : ''}`);
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getActivity(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/activity${queryString ? `?${queryString}` : ''}`);
  }

  async getLeaderboard(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/leaderboard${queryString ? `?${queryString}` : ''}`);
  }

  // User methods
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(identifier) {
    return this.request(`/users/${identifier}`);
  }

  async getUserStats(identifier) {
    return this.request(`/users/${identifier}/stats`);
  }

  // Utility methods
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    try {
      return this.token || localStorage.getItem('authToken');
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new ApiService();