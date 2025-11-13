# 🔄 Complete Google Calendar Integration Flow

## **Multi-Client Architecture with n8n**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT SETUP PHASE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Bot Owner A │    │   Your Server    │    │   Database      │    │ Google API  │
│             │    │                  │    │                 │    │             │
│ 1. Clicks   │───▶│ 2. OAuth URL     │───▶│ 3. Store        │◀───│ 4. OAuth    │
│ "Connect    │    │ Generation       │    │ Credentials     │    │ Tokens      │
│ Calendar"   │    │                  │    │ for botId-A     │    │             │
└─────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Bot Owner B │    │   Your Server    │    │   Database      │    │ Google API  │
│             │    │                  │    │                 │    │             │
│ 1. Clicks   │───▶│ 2. OAuth URL     │───▶│ 3. Store        │◀───│ 4. OAuth    │
│ "Connect    │    │ Generation       │    │ Credentials     │    │ Tokens      │
│ Calendar"   │    │                  │    │ for botId-B     │    │             │
└─────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              APPOINTMENT BOOKING PHASE                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Website     │    │   n8n Workflow   │    │   Your Server   │    │ Google      │
│ Visitor     │    │                  │    │                 │    │ Calendar    │
│             │    │                  │    │                 │    │             │
│ 1. Books    │───▶│ 2. Webhook       │───▶│ 3. Fetch        │───▶│ 4. Create   │
│ appointment │    │ Receives         │    │ Client's        │    │ Event in    │
│ on Bot A's  │    │ botId + data     │    │ Credentials     │    │ Bot A's     │
│ website     │    │                  │    │ for botId-A     │    │ Calendar    │
└─────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Website     │    │   n8n Workflow   │    │   Your Server   │    │ Google      │
│ Visitor     │    │                  │    │                 │    │ Calendar    │
│             │    │                  │    │                 │    │             │
│ 1. Books    │───▶│ 2. Webhook       │───▶│ 3. Fetch        │───▶│ 4. Create   │
│ appointment │    │ Receives         │    │ Client's        │    │ Event in    │
│ on Bot B's  │    │ botId + data     │    │ Credentials     │    │ Bot B's     │
│ website     │    │                  │    │ for botId-B     │    │ Calendar    │
└─────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘
```

## **Detailed Step-by-Step Flow**

### **Phase 1: Client Authentication (One-time setup per client)**

```
Step 1: Bot Owner Setup
├── Bot Owner opens Bot Builder
├── Saves bot configuration → Gets unique botId (e.g., "bot-123-abc")
├── Clicks "Connect Google Calendar"
└── OAuth popup opens

Step 2: Google OAuth
├── User authorizes access to their Google Calendar
├── Google returns authorization code
├── Server exchanges code for access_token + refresh_token
└── Tokens encrypted and stored in database with botId

Database Storage:
┌─────────────────────────────────────────────────────────────┐
│ google_tokens table                                        │
├─────────────────────────────────────────────────────────────┤
│ client_id: "bot-123-abc"                                   │
│ access_token: "encrypted_access_token_for_bot_123"         │
│ refresh_token: "encrypted_refresh_token_for_bot_123"       │
│ expiry_date: 1640995200000                                 │
│ scope: "https://www.googleapis.com/auth/calendar.events"   │
└─────────────────────────────────────────────────────────────┘
```

### **Phase 2: Appointment Booking (Every time a visitor books)**

```
Step 1: Website Visitor Books Appointment
├── Visitor fills appointment form on Bot A's website
├── Form data: {fullName, email, phone, date, time}
└── Chatbot sends webhook to n8n with botId

Step 2: n8n Workflow Processing
├── Webhook receives: {botId: "bot-123-abc", formData: {...}}
├── Validates it's an appointment request
├── Calls your server: GET /api/calendar/status/bot-123-abc
├── Server returns: {connected: true, expired: false}
└── n8n proceeds to create calendar event

Step 3: Calendar Event Creation
├── n8n calls: POST /api/calendar/create-event/bot-123-abc
├── Server fetches encrypted credentials for bot-123-abc
├── Decrypts access_token and refresh_token
├── Creates Google Calendar event using Bot A's credentials
└── Returns success response with event details

Step 4: Event Created
├── Event appears in Bot A's Google Calendar
├── Bot A receives email notification
├── Customer receives calendar invite
└── Both get reminders 24 hours before appointment
```

## **Key Benefits of This Architecture**

### **🔐 Security**
- Each client's credentials are stored separately
- Tokens are encrypted in the database
- No shared credentials between clients

### **🔄 Scalability**
- Unlimited number of clients
- Each client manages their own calendar
- Independent token refresh per client

### **🛠️ Flexibility**
- Clients can disconnect/reconnect anytime
- Easy to add new clients
- Centralized management through n8n

### **📊 Monitoring**
- All operations logged in n8n
- Easy to track which client's calendar was used
- Error handling per client

## **Database Schema for Multi-Client Support**

```sql
-- Each bot owner has unique credentials
CREATE TABLE google_tokens (
  client_id TEXT PRIMARY KEY,           -- "bot-123-abc"
  access_token TEXT,                    -- Encrypted access token
  refresh_token TEXT,                   -- Encrypted refresh token
  expiry_date INTEGER,                  -- Token expiry timestamp
  scope TEXT,                          -- OAuth scope
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Each appointment is linked to specific client
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,                  -- Unique appointment ID
  client_id TEXT,                       -- "bot-123-abc" (links to google_tokens)
  customer_name TEXT,                   -- "John Doe"
  customer_email TEXT,                  -- "john@example.com"
  customer_phone TEXT,                  -- "+1234567890"
  appointment_date TEXT,                -- "2024-01-20"
  appointment_time TEXT,                -- "14:00"
  status TEXT DEFAULT 'confirmed',      -- "confirmed", "cancelled", etc.
  google_event_id TEXT,                 -- Google Calendar event ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES google_tokens (client_id)
);
```

## **n8n Workflow Logic**

```
1. Webhook Trigger
   ├── Receives: {botId, type, formData}
   └── Validates: type === "appointment"

2. Check Calendar Status
   ├── Calls: GET /api/calendar/status/{botId}
   ├── Expects: {connected: true/false, expired: true/false}
   └── Routes: Connected → Create Event, Not Connected → Error

3. Create Calendar Event
   ├── Calls: POST /api/calendar/create-event/{botId}
   ├── Sends: {customerName, email, phone, date, time}
   ├── Server: Fetches client's credentials, creates event
   └── Returns: {success: true, eventId, eventLink}

4. Response
   ├── Success: Returns event details
   └── Error: Returns helpful error message
```

This architecture ensures that each client's Google Calendar credentials are managed independently, and n8n can create events in the correct calendar based on the botId from the webhook request.
