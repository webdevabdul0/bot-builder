const API_BASE_URL = 'https://dev.flossly.ai/api';

class AuthService {
  constructor() {
    this.accessToken = this.getStoredToken();
  }

  /**
   * Exchange short token for access token
   * @param {string} shortToken - The short token from URL query params
   * @returns {Promise<{success: boolean, accessToken?: string, error?: string}>}
   */
  async exchangeShortToken(shortToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/exchangeShortToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortToken: shortToken
        })
      });

      const data = await response.json();

      if (data.Success && data.Code === 0) {
        this.storeAccessToken(data.Data);
        return { success: true, accessToken: data.Data };
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
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.Success && data.Code === 0) {
        return { success: true, profile: data.Data };
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
   * Store access token in localStorage
   * @param {string} token - The access token to store
   */
  storeAccessToken(token) {
    try {
      localStorage.setItem('flossy_access_token', token);
      this.accessToken = token;
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Get stored access token from localStorage
   * @returns {string|null} The stored access token or null
   */
  getStoredToken() {
    try {
      return localStorage.getItem('flossy_access_token');
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
      localStorage.removeItem('flossy_access_token');
      this.accessToken = null;
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

