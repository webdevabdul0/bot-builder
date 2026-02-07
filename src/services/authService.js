class AuthService {
  constructor() {
    this.accessToken = this.getStoredToken();
    this.apiBaseUrl = this.getStoredApiBase();
  }

  /**
   * Decode JWT token to extract environment
   * @param {string} token - JWT token to decode
   * @returns {string} environment value ('production' or 'development')
   */
  decodeTokenEnvironment(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.environment || 'development';
    } catch (error) {
      console.error('Failed to decode token:', error);
      return 'development';
    }
  }

  /**
   * Get API base URL from sessionStorage or default
   * @returns {string} API base URL
   */
  getStoredApiBase() {
    try {
      const stored = sessionStorage.getItem('flossy_api_base');
      return stored || 'https://dev.flossly.ai/api';
    } catch (error) {
      console.error('Failed to get stored API base:', error);
      return 'https://dev.flossly.ai/api';
    }
  }

  /**
   * Store API base URL in sessionStorage
   * @param {string} environment - Environment from token ('production' or 'development')
   */
  storeApiBase(environment) {
    try {
      const apiBase = environment === 'production' 
        ? 'https://app.flossly.ai/api'
        : 'https://dev.flossly.ai/api';
      
      sessionStorage.setItem('flossy_api_base', apiBase);
      this.apiBaseUrl = apiBase;
      console.log(`✅ API Base URL set to: ${apiBase} (environment: ${environment})`);
    } catch (error) {
      console.error('Failed to store API base:', error);
    }
  }

  /**
   * Exchange short token for access token
   * @param {string} shortToken - The short token from URL query params
   * @returns {Promise<{success: boolean, accessToken?: string, error?: string}>}
   */
  async exchangeShortToken(shortToken) {
    try {
      // Decode environment from short token and set API base
      const environment = this.decodeTokenEnvironment(shortToken);
      this.storeApiBase(environment);

      const response = await fetch(`${this.apiBaseUrl}/auth/exchangeShortToken`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          shortToken: shortToken
        })
      });

      const data = await response.json();

      if (data.success && data.code === 0) {
        this.storeAccessToken(data.data);
        return { success: true, accessToken: data.data };
      } else {
        return { 
          success: false, 
          error: data.message || 'Token exchange failed' 
        };
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      return { 
        success: false, 
        error: 'Network error during token exchange' 
      };
    }
  }

  /**
   * Get user profile data
   * @returns {Promise<{success: boolean, profile?: object, error?: string}>}
   */
  async getUserProfile() {
    if (!this.accessToken) {
      return { 
        success: false, 
        error: 'No access token available' 
      };
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/profile`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success && data.code === 0) {
        return { success: true, profile: data.data };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to fetch profile' 
        };
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { 
        success: false, 
        error: 'Network error while fetching profile' 
      };
    }
  }

  /**
   * Store access token in sessionStorage
   * @param {string} token - The access token to store
   */
  storeAccessToken(token) {
    try {
      sessionStorage.setItem('flossy_access_token', token);
      this.accessToken = token;
      console.log('✅ Access token stored in sessionStorage');
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Get stored access token from sessionStorage
   * @returns {string|null} The stored access token or null
   */
  getStoredToken() {
    try {
      return sessionStorage.getItem('flossy_access_token');
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuth() {
    try {
      sessionStorage.removeItem('flossy_access_token');
      sessionStorage.removeItem('flossy_api_base');
      this.accessToken = null;
      this.apiBaseUrl = 'https://dev.flossly.ai/api';
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if access token exists
   */
  isAuthenticated() {
    return !!this.accessToken;
  }

  /**
   * Extract organization data for current logged in org
   * @param {object} profile - User profile data
   * @returns {object|null} Organization data or null
   */
  getCurrentOrganization(profile) {
    if (!profile || !profile.userOrganisations || !profile.currentLoggedInOrgId) {
      return null;
    }

    const currentOrg = profile.userOrganisations.find(
      userOrg => userOrg.organisationId === profile.currentLoggedInOrgId
    );

    return currentOrg ? currentOrg.organisation : null;
  }
}

// Export singleton instance
export default new AuthService();

