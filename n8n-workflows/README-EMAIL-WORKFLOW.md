# Email Widget Code to Developer - n8n Workflow Setup

## Overview
This workflow receives widget code via webhook and sends it to a developer's email via Gmail with formatted instructions.

## Setup Instructions

### 1. Import the Workflow
1. Open your n8n instance
2. Click on "Workflows" → "Import from File"
3. Select `n8n-email-widget-code-workflow.json`
4. The workflow will be imported with all nodes configured

### 2. Configure Gmail Connection
1. Click on the **Gmail** node
2. Click on "Create New Credential"
3. Select "Gmail OAuth2"
4. Follow the OAuth authentication flow:
   - Sign in with your Gmail account
   - Grant permissions to n8n
5. Save the credentials

### 3. Activate the Webhook
1. Click on the **Webhook** node
2. Copy the webhook URL (it will look like: `https://your-n8n-instance.com/webhook/email-widget-code`)
3. The webhook is set to `POST` method and expects JSON data

### 4. Update the Frontend Code
In `src/BotBuilder.jsx`, update the webhook URL:

```javascript
const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/email-widget-code';
```

Replace `YOUR_N8N_WEBHOOK_URL` with your actual n8n webhook URL.

## Webhook Payload Structure

The webhook expects the following JSON payload:

```json
{
  "email": "developer@example.com",
  "widgetScript": "<script>...</script>",
  "botName": "Customer Support Bot",
  "companyName": "Acme Dental",
  "botId": "bot_12345"
}
```

### Field Descriptions:
- **email** (required): The recipient's email address
- **widgetScript** (required): The complete widget embed code
- **botName** (optional): Name of the chatbot
- **companyName** (optional): Company name
- **botId** (optional): Unique bot identifier

## Email Template

The workflow sends an HTML-formatted email with:

✅ **Professional Header** - Flossly branding with blue theme  
✅ **Step-by-Step Instructions** - Clear installation guide with checkmarks  
✅ **Code Block** - Formatted widget script in a dark code editor style  
✅ **Important Notes** - Highlighted warnings and tips  
✅ **Support Information** - Contact details and help resources  
✅ **Responsive Design** - Works on all email clients  

## Response Structure

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Email sent successfully",
  "recipient": "developer@example.com",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

### Error Response (500)
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Error details...",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

## Testing the Workflow

### Using cURL:
```bash
curl -X POST https://your-n8n-instance.com/webhook/email-widget-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "widgetScript": "<script>console.log(\"test\");</script>",
    "botName": "Test Bot",
    "companyName": "Test Company",
    "botId": "test_123"
  }'
```

### Using the UI:
1. Save your bot configuration in the Bot Builder
2. Navigate to the "Embed" tab
3. Enter an email address in the email field
4. Click "Send"
5. Check the recipient's inbox (may take 1-2 minutes)

## Troubleshooting

### Email Not Sending
- ✅ Verify Gmail credentials are connected
- ✅ Check Gmail OAuth permissions haven't expired
- ✅ Ensure the webhook is active (green indicator)
- ✅ Check n8n execution logs for errors

### Invalid Email Error
- ✅ Ensure email format is valid (contains @ and domain)
- ✅ Check that email field is not empty

### Script Not Generated Error
- ✅ Save bot configuration first in the Builder tab
- ✅ Verify `generatedScript` state is populated

### Webhook Not Receiving Data
- ✅ Verify the webhook URL is correct
- ✅ Check CORS settings if calling from browser
- ✅ Ensure Content-Type header is `application/json`

## Customization

### Change Email Subject
Edit the **Gmail** node → **subject** field:
```
Your Flossly Chatbot Installation Code
```

### Modify Email Template
Edit the **Gmail** node → **message** field (HTML content)

### Add CC/BCC Recipients
Add to the **Gmail** node:
- **cc**: Carbon copy recipients
- **bcc**: Blind carbon copy recipients

### Change Sender Name
This is controlled by your Gmail account settings

## Security Notes

- 🔒 The webhook is publicly accessible - implement authentication if needed
- 🔒 Email addresses are validated before sending
- 🔒 OAuth tokens are securely stored in n8n credentials
- 🔒 Widget scripts are sent as-is (ensure they don't contain sensitive data)

## Workflow Nodes

1. **Webhook** - Receives POST requests with email data
2. **Gmail** - Sends formatted email with installation instructions
3. **Respond Success** - Returns success response
4. **Respond Error** - Returns error response (if needed)

## Support

For issues with:
- **n8n setup**: Check n8n documentation or community forums
- **Gmail connection**: Verify OAuth credentials and permissions
- **Frontend integration**: Review `src/BotBuilder.jsx` sendEmailToDeveloper function
