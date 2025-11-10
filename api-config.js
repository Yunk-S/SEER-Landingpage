// API Configuration
// Change this to your deployed Vercel URL after deployment

const API_CONFIG = {
  // For local development
  local: 'http://localhost:3000/api',
  
  // For production (change to your Vercel domain)
  production: 'https://your-app.vercel.app/api',
  
  // Auto-detect environment
  get baseURL() {
    if (typeof window !== 'undefined') {
      // Check if we're on localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return this.local;
      }
      // Use current origin's API
      return `${window.location.origin}/api`;
    }
    return this.production;
  }
};

// API endpoints
const API_ENDPOINTS = {
  surveys: '/surveys',
};

// API helper functions
const API = {
  async getSurveys() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.surveys}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        console.error('Surveys API responded with', response.status);
        throw new Error(`Surveys API responded with ${response.status}`);
      }
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching surveys:', error);
      // Fallback to localStorage if API fails
      return JSON.parse(localStorage.getItem('seer_surveys') || '[]');
    }
  },

  async submitSurvey(surveyData) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.surveys}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      if (!response.ok) {
        console.error('Submit survey failed with', response.status);
        throw new Error(`Submit survey failed with ${response.status}`);
      }
      const data = await response.json();
      
      // Also save to localStorage as backup
      const localSurveys = JSON.parse(localStorage.getItem('seer_surveys') || '[]');
      localSurveys.push(surveyData);
      localStorage.setItem('seer_surveys', JSON.stringify(localSurveys));
      
      return data;
    } catch (error) {
      console.error('Error submitting survey:', error);
      // Fallback to localStorage only
      const surveys = JSON.parse(localStorage.getItem('seer_surveys') || '[]');
      surveys.push(surveyData);
      localStorage.setItem('seer_surveys', JSON.stringify(surveys));
      return { success: true, offline: true };
    }
  }
};

// Make API available globally
if (typeof window !== 'undefined') {
  window.SEER_API = API;
}

