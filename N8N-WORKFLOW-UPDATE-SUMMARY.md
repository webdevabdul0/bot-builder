# N8N Email Widget Workflow - Update Summary ✅

## 🎯 Issue Fixed
**Problem**: Widget code was not appearing in emails sent to developers.

**Root Cause**: The n8n workflow was using the wrong variable path `{{ $json.widgetScript }}` instead of `{{ $json.body.widgetScriptEscaped }}`.

---

## ✅ Changes Made

### 1. Updated Email Template Variable
**Before:**
```html
<div class="code-block">{{ $json.widgetScript }}</div>
```

**After:**
```html
<div class="code-block">{{ $json.body.widgetScriptEscaped }}</div>
```

### 2. Added Bot Personalization
The email now displays:
- Bot Name: `{{ $json.body.botName }}`
- Company Name: `{{ $json.body.companyName }}`
- Bot ID: `{{ $json.body.botId }}`

---

## 📦 Complete Payload Structure

```json
{
  "email": "developer@example.com",
  "widgetScriptRaw": "<script>...</script>",
  "widgetScriptEscaped": "&lt;script&gt;...&lt;/script&gt;",
  "widgetScript": "&lt;script&gt;...&lt;/script&gt;",
  "botName": "Your Bot",
  "companyName": "Your Company",
  "botId": "uuid-here",
  "timestamp": "2026-01-31T..."
}
```

---

## 🔧 Variable Mapping in N8N

| Frontend Sends | N8N Template Uses | Purpose |
|---------------|-------------------|---------|
| `widgetScriptRaw` | *(Not used in email)* | Raw JS for future use |
| `widgetScriptEscaped` | `{{ $json.body.widgetScriptEscaped }}` | Display in email |
| `widgetScript` | *(Backup/compatibility)* | Same as escaped |
| `botName` | `{{ $json.body.botName }}` | Display bot name |
| `companyName` | `{{ $json.body.companyName }}` | Display company |
| `botId` | `{{ $json.body.botId }}` | Display bot ID |
| `email` | `{{ $json.body.email }}` | Recipient email |

---

## 📧 Email Template Structure

```html
<div class="header">
    <h1>🤖 Flossly Chatbot Installation</h1>
</div>

<div class="content">
    <h2>Hello! 👋</h2>
    <p><strong>Bot Name:</strong> {{ $json.body.botName }}</p>
    <p><strong>Company:</strong> {{ $json.body.companyName }}</p>
    <p><strong>Bot ID:</strong> <code>{{ $json.body.botId }}</code></p>
    
    <h3>💻 Your Chatbot Code</h3>
    <div class="code-block">{{ $json.body.widgetScriptEscaped }}</div>
</div>
```

---

## 🚀 Deploying to N8N Cloud

### Step 1: Import Updated Workflow
1. Open n8n at `https://n8n.flossly.ai`
2. Go to **Workflows**
3. Click **Import from File**
4. Select: `flossy-new/n8n-workflows/n8n-email-widget-code-workflow.json`
5. Click **Import**

### Step 2: Configure Gmail Credentials
1. Click on the **Gmail** node
2. Under **Credentials**, select or add your Gmail OAuth2 credentials
3. If adding new:
   - Click **+ Create New Credential**
   - Select **Gmail OAuth2 API**
   - Follow Google OAuth setup
   - Authorize the app

### Step 3: Activate Workflow
1. Click **Active** toggle in top right
2. Test with a sample request (see below)

### Step 4: Test the Webhook
```bash
curl -X POST https://n8n.flossly.ai/webhook/email-widget-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "widgetScriptEscaped": "&lt;script&gt;test&lt;/script&gt;",
    "botName": "Test Bot",
    "companyName": "Test Company",
    "botId": "test-123"
  }'
```

---

## ✅ Verification Checklist

- [x] Frontend sends escaped HTML in `widgetScriptEscaped`
- [x] Frontend sends both raw and escaped versions
- [x] N8N workflow uses `{{ $json.body.widgetScriptEscaped }}`
- [x] Email template displays bot name, company, and ID
- [x] Code block styling is preserved
- [x] HTML entities render as text (not executed)
- [ ] **Deploy to n8n cloud** ⚠️ *Action Required*
- [ ] **Test with real email** ⚠️ *Action Required*

---

## 🧪 Testing

### Test 1: Webhook Response
```bash
curl -X POST https://n8n.flossly.ai/webhook/email-widget-code \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "recipient": "test@example.com",
  "timestamp": "2026-01-31T..."
}
```

### Test 2: Email Content
Check that the email contains:
- ✅ Bot name and company name
- ✅ Bot ID in monospace font
- ✅ Widget code in dark code block
- ✅ Code is copyable (not executed)
- ✅ HTML entities display correctly (`<script>` shows as text)

---

## 🔒 Security Notes

- ✅ No executable JavaScript in email
- ✅ HTML entities properly escaped
- ✅ No XSS vulnerabilities
- ✅ Bot ID is safe to share (public identifier)
- ✅ Email validation on frontend

---

## 📊 What Changed

### Files Modified:
1. ✅ `flossy-new/src/BotBuilder.jsx` - Added `escapeHtml()` function and updated payload
2. ✅ `flossy-new/n8n-workflows/n8n-email-widget-code-workflow.json` - Fixed variable paths

### Frontend Changes:
- Added HTML escape utility function
- Sends 3 versions of script (raw, escaped, default)
- Enhanced error handling
- Added timestamp to payload

### N8N Workflow Changes:
- Updated variable path: `$json.widgetScript` → `$json.body.widgetScriptEscaped`
- Added bot details to email template
- Proper variable mapping for all fields

---

## 🎯 Next Steps

1. **Import updated workflow to n8n cloud**
2. **Configure Gmail credentials**
3. **Activate the workflow**
4. **Test with real email address**
5. **Verify code appears in email**
6. **Confirm code is copyable**

---

## 📞 Support

If emails still don't contain the code:
1. Check n8n workflow execution logs
2. Verify Gmail node credentials
3. Check spam/junk folder
4. Verify webhook is receiving correct payload
5. Test with curl command above

---

**Status**: ✅ Ready for Deployment
**Last Updated**: 2026-01-31
**Version**: 2.0.0
