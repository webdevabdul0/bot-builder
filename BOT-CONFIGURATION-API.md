# Bot Configuration API Documentation

## Overview
The Bot Builder now includes comprehensive database integration for saving and loading bot configurations. This allows users to persist their bot settings and retrieve them later.

## API Endpoints

### 1. Save Bot Configuration
**POST** `https://dev.flossly.ai/api/crm/saveBotConfig`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "botId": "uuid-string",
  "userId": 65,
  "organizationId": 46,
  "name": "Dental Bot",
  "companyName": "Responsive Test Practice edited",
  "avatar": {
    "type": "upload",
    "url": "https://example.com/avatar.jpg"
  },
  "openingMessages": [
    {
      "id": "uuid-string",
      "text": "Welcome to Responsive Test Practice edited",
      "showAvatar": true
    }
  ],
  "appointmentGreeting": "Hello! 👋 I can help you book an appointment at our clinic.\nWhat's your full name?",
  "privacyPolicyUrl": "https://example.com/privacy",
  "companyOwnerEmail": "hhumza673@gmail.com",
  "companyPhone": "+92333333333",
  "companyWebsite": "https://example.com",
  "webhookUrl": "https://n8n.flossly.ai/webhook/appointment-booking",
  "gmailBrochureUrl": "https://n8n.flossly.ai/webhook/gmail-brochure",
  "gmailCallbackUrl": "https://n8n.flossly.ai/webhook/gmail-callback",
  "themeColor": "#3B82F6",
  "position": "right",
  "sideSpacing": 25,
  "bottomSpacing": 25,
  "showDesktop": true,
  "showMobile": true,
  "googleCalendarConnected": false,
  "calendarStatus": null,
  "appointmentFlow": {
    "fields": [
      {
        "name": "fullName",
        "type": "text",
        "label": "Full Name",
        "required": true
      },
      {
        "name": "contact",
        "type": "email",
        "label": "Email Address",
        "required": true
      },
      {
        "name": "phone",
        "type": "tel",
        "label": "Phone Number",
        "required": true
      },
      {
        "name": "preferredDate",
        "type": "date",
        "label": "Preferred Date",
        "required": true
      },
      {
        "name": "preferredTime",
        "type": "time",
        "label": "Preferred Time",
        "required": true
      }
    ]
  },
  "treatmentFlow": {
    "options": [
      {
        "id": "uuid-string",
        "name": "Teeth Whitening",
        "description": "Professional teeth whitening treatments for a brighter smile",
        "brochureUrl": ""
      }
    ],
    "webhookUrl": "https://n8n.flossly.ai/webhook/gmail-brochure"
  },
  "callbackFlow": {
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Full Name",
        "required": true
      },
      {
        "name": "phone",
        "type": "tel",
        "label": "Phone Number",
        "required": true
      },
      {
        "name": "reason",
        "type": "text",
        "label": "Reason for Callback",
        "required": true
      },
      {
        "name": "timing",
        "type": "text",
        "label": "Preferred Time",
        "required": true
      }
    ]
  },
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "Success": true,
  "Code": 0,
  "Data": "Done"
}
```

### 2. Get Bot Configuration
**GET** `https://dev.flossly.ai/api/crm/getBotConfig?botId={botId}`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response:**
```json
{
  "Success": true,
  "Code": 0,
  "Data": {
    // Same structure as saveBotConfig request body
  }
}
```

## Implementation Details

### Bot Configuration Service
The `botConfigService.js` provides:
- **saveBotConfig()**: Saves bot configuration to database
- **getBotConfig()**: Retrieves bot configuration by botId
- **createBotConfigPayload()**: Standardizes configuration data
- **loadBotConfigToState()**: Maps database data to component state

### BotBuilder Integration
The BotBuilder component now includes:
- **Save Functionality**: Enhanced save button with loading states
- **Load Functionality**: Load existing configurations by botId
- **Status Messages**: Success/error feedback for all operations
- **Loading States**: Visual indicators during API calls

### Data Flow
1. **User Configuration**: User fills out bot settings in the interface
2. **Save Process**: Click "Save Bot" → API call → Database storage → Success feedback
3. **Load Process**: Click "Load Bot" → Enter botId → API call → Load data → Success feedback
4. **State Management**: All form fields are updated with loaded data

### Error Handling
- **Network Errors**: Graceful fallback with user-friendly messages
- **Invalid Bot IDs**: Clear error messages for non-existent configurations
- **Authentication Errors**: Automatic redirect to unauthorized page
- **Validation Errors**: Field-specific error messages

## Database Schema Requirements

The backend should support the following structure:

```sql
CREATE TABLE bot_configurations (
  id SERIAL PRIMARY KEY,
  bot_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_type VARCHAR(50),
  avatar_url TEXT,
  opening_messages JSONB,
  appointment_greeting TEXT,
  privacy_policy_url TEXT,
  company_owner_email VARCHAR(255),
  company_phone VARCHAR(50),
  company_website VARCHAR(255),
  webhook_url TEXT,
  gmail_brochure_url TEXT,
  gmail_callback_url TEXT,
  theme_color VARCHAR(7),
  position VARCHAR(10),
  side_spacing INTEGER,
  bottom_spacing INTEGER,
  show_desktop BOOLEAN,
  show_mobile BOOLEAN,
  google_calendar_connected BOOLEAN,
  calendar_status JSONB,
  appointment_flow JSONB,
  treatment_flow JSONB,
  callback_flow JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Save a New Bot
```javascript
const botConfig = {
  botId: "new-bot-id",
  userId: 65,
  organizationId: 46,
  name: "My Dental Bot",
  companyName: "Dental Practice",
  // ... other configuration
};

const result = await botConfigService.saveBotConfig(botConfig);
if (result.success) {
  console.log('Bot saved successfully!');
}
```

### Load Existing Bot
```javascript
const result = await botConfigService.getBotConfig("existing-bot-id");
if (result.success) {
  const config = result.config;
  // Load configuration into BotBuilder state
  setBotName(config.name);
  setCompanyName(config.companyName);
  // ... update other fields
}
```

## Security Considerations

- **Authentication Required**: All API calls require valid access token
- **User Isolation**: Users can only access their own bot configurations
- **Organization Scoping**: Bots are scoped to specific organizations
- **Input Validation**: All configuration data is validated before saving
- **Rate Limiting**: API calls are rate-limited to prevent abuse

## Testing

### Test Save Configuration
1. Fill out bot configuration form
2. Click "Save Bot" button
3. Verify success message appears
4. Check database for saved configuration

### Test Load Configuration
1. Click "Load Bot" button
2. Enter valid bot ID
3. Verify configuration loads into form
4. Verify success message appears

### Test Error Handling
1. Try loading non-existent bot ID
2. Test with invalid authentication
3. Test network error scenarios
