const API_BASE_URL = 'https://dev.flossly.ai/api';

class BotConfigService {
  constructor() {
    this.accessToken = this.getStoredToken();
  }

  /**
   * Get stored access token from sessionStorage (same as authService)
   * @returns {string|null} The stored access token or null
   */
  getStoredToken() {
    try {
      // Check sessionStorage first (where authService stores it)
      const token = sessionStorage.getItem('flossy_access_token');
      if (token) {
        return token;
      }
      // Fallback to localStorage for backward compatibility
      return localStorage.getItem('flossy_access_token');
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }
  
  /**
   * Refresh access token from storage (call this if token might have been updated)
   */
  refreshToken() {
    this.accessToken = this.getStoredToken();
  }

  /**
   * Save bot configuration to database
   * @param {object} botConfig - The complete bot configuration object
   * @returns {Promise<{success: boolean, botId?: string, error?: string}>}
   */
  async saveBotConfig(botConfig) {
    // Refresh token in case it was updated
    this.refreshToken();
    
    if (!this.accessToken) {
      return { 
        success: false, 
        error: 'No access token available. Please authenticate first.' 
      };
    }

    try {
      // Use correct endpoint: /api/chatbot/save
      // Note: userId and organizationId are automatically set from logged-in user
      // Only 'name' is required, botId is optional (auto-generated if not provided)
      const response = await fetch(`${API_BASE_URL}/chatbot/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botConfig)
      });

      const data = await response.json();

      // Response format: { code: 1, data: {...} } where code: 1 means success
      if (data.code === 1 && data.data) {
        return { 
          success: true, 
          botId: data.data.botId || botConfig.botId,
          config: data.data,
          message: 'Bot configuration saved successfully'
        };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to save bot configuration' 
        };
      }
    } catch (error) {
      console.error('Save bot config error:', error);
      return { 
        success: false, 
        error: 'Network error while saving bot configuration' 
      };
    }
  }

  /**
   * Get bot configuration from database
   * @param {string} botId - The bot ID to fetch configuration for
   * @returns {Promise<{success: boolean, config?: object, error?: string}>}
   */
  async getBotConfig(botId = null) {
    // Refresh token in case it was updated
    this.refreshToken();
    
    if (!this.accessToken) {
      return { 
        success: false, 
        error: 'No access token available. Please authenticate first.' 
      };
    }

    try {
      // Use correct endpoint: /api/chatbot/get
      // Note: Gets config by organizationId (from logged-in user), not by botId
      // If botId is provided, we'll filter by it after getting the config
      const response = await fetch(`${API_BASE_URL}/chatbot/get`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      // Response format: { code: 1, data: {...} } or { code: 1, data: null } if not found
      if (data.code === 1) {
        if (data.data === null) {
          return { 
            success: false, 
            error: 'No bot configuration found for this organization' 
          };
        }
        
        // If botId was provided, verify it matches
        if (botId && data.data.botId !== botId) {
          return { 
            success: false, 
            error: `Bot configuration found but botId mismatch. Expected: ${botId}, Found: ${data.data.botId}` 
          };
        }
        
        return { 
          success: true, 
          config: data.data 
        };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to fetch bot configuration' 
        };
      }
    } catch (error) {
      console.error('Get bot config error:', error);
      return { 
        success: false, 
        error: 'Network error while fetching bot configuration' 
      };
    }
  }

  /**
   * Create standardized bot configuration payload
   * @param {object} botData - The bot data from BotBuilder component
   * @returns {object} Standardized configuration object
   */
  createBotConfigPayload(botData) {
    return {
      botId: botData.botId,
      userId: botData.userId, // Will be set by the component
      organizationId: botData.organizationId, // Will be set by the component
      name: botData.name,
      companyName: botData.companyName,
      avatar: botData.avatar,
      openingMessages: botData.openingMessages,
      appointmentGreeting: botData.appointmentGreeting,
      privacyPolicyUrl: botData.privacyPolicyUrl,
      companyOwnerEmail: botData.companyOwnerEmail,
      companyPhone: botData.companyPhone,
      companyWebsite: botData.companyWebsite,
      webhookUrl: botData.webhookUrl,
      gmailBrochureUrl: botData.gmailBrochureUrl,
      gmailCallbackUrl: botData.gmailCallbackUrl,
      themeColor: botData.themeColor,
      position: botData.position,
      sideSpacing: botData.sideSpacing,
      bottomSpacing: botData.bottomSpacing,
      showDesktop: botData.showDesktop,
      showMobile: botData.showMobile,
      appointmentFlow: botData.appointmentFlow,
      treatmentFlow: botData.treatmentFlow,
      callbackFlow: botData.callbackFlow,
      googleCalendarConnected: botData.googleCalendarConnected,
      calendarStatus: botData.calendarStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Load bot configuration into BotBuilder state
   * @param {object} config - The configuration from database
   * @returns {object} State updates for BotBuilder component
   */
  loadBotConfigToState(config) {
    return {
      botName: config.name || '',
      companyName: config.companyName || '',
      selectedAvatar: config.avatar?.type || 'upload',
      uploadedAvatar: config.avatar?.url || null,
      openingMessages: config.openingMessages || [],
      appointmentGreeting: config.appointmentGreeting || '',
      privacyPolicyUrl: config.privacyPolicyUrl || '',
      companyOwnerEmail: config.companyOwnerEmail || '',
      companyPhone: config.companyPhone || '',
      companyWebsite: config.companyWebsite || '',
      themeColor: config.themeColor || '#3B82F6',
      botPosition: config.position || 'right',
      sideSpacing: config.sideSpacing || 25,
      bottomSpacing: config.bottomSpacing || 25,
      showDesktop: config.showDesktop !== undefined ? config.showDesktop : true,
      showMobile: config.showMobile !== undefined ? config.showMobile : true,
      googleCalendarConnected: config.googleCalendarConnected || false,
      calendarStatus: config.calendarStatus || null,
      treatmentOptions: config.treatmentFlow?.options || [],
      botId: config.botId || ''
    };
  }
}

// Export singleton instance
export default new BotConfigService();

