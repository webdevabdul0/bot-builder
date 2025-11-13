# 🔄 n8n + Google Calendar Integration Setup

This guide shows how to set up n8n to handle Google Calendar events for multiple clients, where each client has their own Google Calendar credentials.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Bot Owner     │    │   Your Server    │    │      n8n        │
│                 │    │                  │    │                 │
│ 1. Connects     │───▶│ 2. Stores        │───▶│ 3. Fetches      │
│    Google       │    │    credentials   │    │    credentials  │
│    Calendar     │    │    in database   │    │    & creates    │
│                 │    │                  │    │    events       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Website Visitor │    │   Webhook        │    │ Google Calendar │
│                 │    │                  │    │                 │
│ 4. Books        │───▶│ 5. Sends to n8n  │───▶│ 6. Creates      │
│    appointment  │    │    with botId    │    │    event in     │
│                 │    │                  │    │    client's     │
│                 │    │                  │    │    calendar     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 **Step-by-Step Setup**

### **Step 1: Import n8n Workflow**

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Upload the `n8n-workflow-google-calendar.json` file
4. The workflow will be imported with all the necessary nodes

### **Step 2: Configure Webhook URL**

1. In the imported workflow, click on the **"Appointment Webhook"** node
2. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/appointment-booking`)
3. Update your bot builder to use this webhook URL

### **Step 3: Update Bot Builder Webhook URL**

In your `BotBuilder.jsx`, update the webhook URL:

```javascript
webhookUrl: 'https://your-n8n-instance.com/webhook/appointment-booking',
```

### **Step 4: Test the Integration**

1. **Connect a bot to Google Calendar** using the bot builder
2. **Test appointment booking** using the test page
3. **Check n8n execution logs** to see the workflow in action

## 🔧 **How It Works**

### **1. Client Authentication Flow**
```
Bot Owner → Clicks "Connect Google Calendar" → OAuth popup → 
Credentials stored in database with botId
```

### **2. Appointment Booking Flow**
```
Website Visitor → Books appointment → Webhook to n8n → 
n8n checks calendar status → Creates event using client's credentials
```

### **3. n8n Workflow Steps**

1. **Webhook Trigger**: Receives appointment data
2. **Check Appointment Type**: Validates it's an appointment request
3. **Check Calendar Status**: Verifies client has connected Google Calendar
4. **Create Calendar Event**: Uses client's stored credentials to create event
5. **Response**: Returns success/error response

## 📊 **Database Schema for Multi-Client Support**

Each client's credentials are stored separately:

```sql
-- Each bot owner has their own credentials
google_tokens:
- client_id (botId) → "bot-123-abc"
- access_token → "encrypted_token_for_bot_123"
- refresh_token → "encrypted_refresh_for_bot_123"

-- Each appointment is linked to a specific client
appointments:
- client_id → "bot-123-abc" 
- customer_name → "John Doe"
- google_event_id → "google_event_456"
```

## 🔐 **Security & Credentials Management**

### **Per-Client Credentials**
- Each bot owner connects their own Google Calendar
- Credentials are encrypted and stored per `botId`
- n8n fetches the correct credentials based on `botId`

### **Token Refresh**
- Automatic token refresh when expired
- Each client's tokens are refreshed independently
- No shared credentials between clients

## 🧪 **Testing the Complete Flow**

### **Test 1: Client Connection**
1. Open bot builder
2. Save bot configuration (get botId)
3. Click "Connect Google Calendar"
4. Complete OAuth flow
5. Verify status shows "Connected"

### **Test 2: Appointment Booking**
1. Use test page with the botId
2. Fill appointment form
3. Submit booking
4. Check n8n execution logs
5. Verify event appears in Google Calendar

### **Test 3: Multiple Clients**
1. Create multiple bots with different botIds
2. Connect different Google accounts to each
3. Book appointments for each bot
4. Verify events go to correct calendars

## 📋 **n8n Workflow Configuration**

### **Webhook Node**
- **Method**: POST
- **Path**: `/webhook/appointment-booking`
- **Response**: JSON

### **HTTP Request Nodes**
- **Check Status**: `GET /api/calendar/status/{botId}`
- **Create Event**: `POST /api/calendar/create-event/{botId}`

### **Conditional Logic**
- Check if request is appointment type
- Check if calendar is connected
- Handle different response scenarios

## 🔄 **Data Flow Example**

### **Input to n8n Webhook**
```json
{
  "botId": "bot-123-abc",
  "type": "appointment",
  "formData": {
    "fullName": "John Doe",
    "contact": "john@example.com",
    "phone": "+1234567890",
    "preferredDate": "2024-01-20",
    "preferredTime": "14:00"
  }
}
```

### **n8n Processing**
1. Validates `type === "appointment"`
2. Checks calendar status for `bot-123-abc`
3. Fetches encrypted credentials for this bot
4. Creates Google Calendar event
5. Returns success response

### **Output from n8n**
```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "botId": "bot-123-abc",
  "calendarEvent": {
    "eventId": "google_event_456",
    "eventLink": "https://calendar.google.com/event/456"
  }
}
```

## 🚨 **Error Handling**

### **Common Scenarios**
- **Calendar not connected**: Returns helpful error message
- **Token expired**: Automatically refreshes and retries
- **Invalid data**: Returns validation error
- **API errors**: Logs error and returns user-friendly message

### **n8n Error Responses**
```json
{
  "success": false,
  "message": "Google Calendar not connected for this bot",
  "error": "Please connect Google Calendar in bot settings"
}
```

## 📈 **Monitoring & Logs**

### **n8n Execution Logs**
- View execution history in n8n interface
- Check for errors in each node
- Monitor webhook response times

### **Server Logs**
- Check server logs for API calls
- Monitor token refresh operations
- Track appointment creation success/failure

## 🔧 **Troubleshooting**

### **Issue: "Calendar not connected"**
- Check if client completed OAuth flow
- Verify credentials are stored in database
- Check n8n execution logs

### **Issue: "Token expired"**
- Check if refresh token is valid
- Verify Google API quotas
- Check server logs for refresh errors

### **Issue: "Webhook not receiving data"**
- Verify webhook URL is correct
- Check if n8n is running
- Test webhook with curl or Postman

## 🚀 **Production Deployment**

### **Environment Variables**
```bash
# n8n
N8N_WEBHOOK_URL=https://your-n8n.com

# Server
REDIRECT_URI=https://yourdomain.com:3001/oauth2/callback
ENCRYPTION_KEY=your-secure-key
```

### **HTTPS Requirements**
- Google OAuth requires HTTPS in production
- Update redirect URI to use HTTPS
- Use SSL certificates for webhook endpoints

### **Scaling Considerations**
- Database connection pooling
- Token refresh rate limiting
- Webhook response time monitoring
- Error alerting and logging

---

This setup ensures that each client's Google Calendar credentials are managed separately, and n8n can create events in the correct calendar based on the botId from the webhook request.
