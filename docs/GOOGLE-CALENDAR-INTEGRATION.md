# 📅 Google Calendar Integration for Flossy Chatbot

This integration allows your Flossy chatbot to automatically add appointments to your Google Calendar when customers book through the chatbot.

## 🚀 Features

- **OAuth2 Authentication**: Secure connection to Google Calendar
- **Automatic Event Creation**: Appointments are automatically added to your calendar
- **Token Management**: Automatic token refresh when expired
- **Customer Invites**: Customers receive calendar invites
- **Email Reminders**: Automatic reminders 24 hours before appointments
- **Database Storage**: All appointments and tokens are securely stored

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://your-domain.com:3001/oauth2/callback`
   - Note down your `client_id` and `client_secret`

### 2. Backend Setup

1. Install dependencies:
```bash
cd vps-deployment
npm install
```

2. Update the Google OAuth credentials in `server.js`:
```javascript
const GOOGLE_CLIENT_ID = 'your-client-id';
const GOOGLE_CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'http://your-domain.com:3001/oauth2/callback';
```

3. Set environment variable for encryption (optional):
```bash
export ENCRYPTION_KEY="your-secure-encryption-key"
```

4. Start the server:
```bash
npm start
```

### 3. Frontend Integration

The Google Calendar integration is already built into the BotBuilder component. Users can:

1. Save their bot configuration to get a Bot ID
2. Click "Connect Google Calendar" in the bot settings
3. Complete OAuth flow in popup window
4. Start receiving automatic calendar events

## 📋 API Endpoints

### OAuth Flow
- `GET /oauth2/authorize/:clientId` - Get Google OAuth URL
- `GET /oauth2/callback` - Handle OAuth callback

### Calendar Management
- `GET /api/calendar/status/:clientId` - Check connection status
- `POST /api/calendar/refresh/:clientId` - Refresh expired tokens
- `POST /api/calendar/create-event/:clientId` - Create calendar event

### Webhook
- `POST /webhook/appointment` - Handle appointment bookings from chatbot

## 🔐 Security Features

- **Token Encryption**: All tokens are encrypted before database storage
- **Secure OAuth**: Uses Google's OAuth 2.0 flow
- **Token Refresh**: Automatic token refresh when expired
- **Database Security**: SQLite with prepared statements

## 📊 Database Schema

### Clients Table
```sql
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  bot_name TEXT,
  company_name TEXT,
  config TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Google Tokens Table
```sql
CREATE TABLE google_tokens (
  client_id TEXT PRIMARY KEY,
  access_token TEXT,
  refresh_token TEXT,
  expiry_date INTEGER,
  scope TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients (id)
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  appointment_date TEXT,
  appointment_time TEXT,
  status TEXT DEFAULT 'pending',
  google_event_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients (id)
);
```

## 🧪 Testing

1. Open `test-google-calendar.html` in your browser
2. Enter your Bot ID (from bot builder)
3. Click "Check Status" to verify connection
4. Click "Connect Google Calendar" to authenticate
5. Use "Test Appointment Booking" to create test events

## 🔄 How It Works

1. **Client Setup**: Bot owner connects their Google Calendar via OAuth
2. **Customer Booking**: Customer books appointment through chatbot
3. **Webhook Trigger**: Chatbot sends appointment data to webhook
4. **Calendar Creation**: Server creates Google Calendar event
5. **Notifications**: Both bot owner and customer receive calendar invites

## 📱 Frontend Components

### Google Calendar Connection UI
- Connection status indicator
- Connect/Disconnect buttons
- Loading states and error handling
- Integration instructions

### Bot Builder Integration
- Seamless integration in bot settings
- Real-time status updates
- User-friendly interface

## 🛠️ Troubleshooting

### Common Issues

1. **"Popup blocked" error**
   - Allow popups for your domain
   - Try again after enabling popups

2. **"Calendar not connected" error**
   - Check if OAuth flow completed successfully
   - Verify client ID is correct
   - Check server logs for errors

3. **"Token expired" error**
   - Tokens are automatically refreshed
   - If refresh fails, user needs to reconnect

4. **Database errors**
   - Check file permissions for SQLite database
   - Ensure server has write access to directory

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 🚀 Production Deployment

1. **Environment Variables**:
   ```bash
   export REDIRECT_URI="https://yourdomain.com:3001/oauth2/callback"
   export ENCRYPTION_KEY="your-secure-key"
   ```

2. **HTTPS Required**: Google OAuth requires HTTPS in production

3. **Database Backup**: Regular backups of SQLite database

4. **Monitoring**: Monitor token refresh and API usage

## 📈 Monitoring

- Check `/health` endpoint for server status
- Monitor `/metrics` for performance metrics
- Log all calendar events for audit trail

## 🔄 Updates

To update the integration:

1. Update dependencies: `npm update`
2. Restart server: `npm restart`
3. Check for breaking changes in Google Calendar API

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Test with the provided test page
4. Contact support with specific error messages

---

**Note**: This integration requires a running server with the Google Calendar API enabled. Make sure your Google Cloud Console project has the necessary permissions and quotas.
