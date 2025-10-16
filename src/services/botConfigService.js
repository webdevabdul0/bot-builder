const API_BASE_URL = 'https://dev.flossly.ai/api';

class BotConfigService {
  constructor() {
    this.accessToken = this.getStoredToken();
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
   * Save bot configuration to database
   * @param {object} botConfig - The complete bot configuration object
   * @returns {Promise<{success: boolean, botId?: string, error?: string}>}
   */
  async saveBotConfig(botConfig) {
    if (!this.accessToken) {
      return { 
        success: false, 
        error: 'No access token available. Please authenticate first.' 
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crm/saveBotConfig`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botConfig)
      });

      const data = await response.json();

      if (data.Success && data.Code === 0) {
        return { 
          success: true, 
          botId: botConfig.botId,
          message: data.Data || 'Bot configuration saved successfully'
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
  async getBotConfig(botId) {
    if (!this.accessToken) {
      return { 
        success: false, 
        error: 'No access token available. Please authenticate first.' 
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crm/getBotConfig?botId=${botId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.Success && data.Code === 0) {
        return { 
          success: true, 
          config: data.Data 
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

