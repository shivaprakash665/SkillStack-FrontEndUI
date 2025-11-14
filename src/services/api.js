class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Debug info
    console.log('🔐 API Request:', endpoint);
    console.log('🔐 Token exists:', !!token);
    if (token) console.log('🔐 Token length:', token.length);

    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Authorization header added');
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Debug response
      console.log('🔐 Response status:', response.status);
      const text = await response.text();
      console.log('🔐 Response body:', text);

      // Parse JSON safely
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      // Handle unauthorized
      if (response.status === 401) {
        console.log('🔐 401 Unauthorized - clearing storage and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      console.error('🔐 API request failed:', err);
      throw err;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password, confirmPassword) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify', { method: 'POST' });
  }

  // Learning endpoints
  async createLearningGoal(goalData) {
    return this.request('/learning/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async getLearningGoals() {
    return this.request('/learning/goals', { method: 'GET' });
  }

  async getLearningGoal(goalId) {
    return this.request(`/learning/goals/${goalId}`, { method: 'GET' });
  }

  async getStudyAnalytics() {
    return this.request('/learning/analytics', { method: 'GET' });
  }
}

// Export single instance
export default new ApiService();
