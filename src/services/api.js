class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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

  // Learning goals endpoints
  async createLearningGoal(goalData) {
    return this.request('/learning/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async getLearningGoals() {
    return this.request('/learning/goals');
  }

  async getLearningGoal(goalId) {
    return this.request(`/learning/goals/${goalId}`);
  }

  async getStudyAnalytics() {
    return this.request('/learning/analytics');
  }
}

export default new ApiService();