# Email Widget Code - SaaS-Level Implementation ✅

## Overview
This document describes the clean, production-ready implementation for sending widget installation code via email.

---

## 🎯 Implementation Summary

### Problem Solved
- **Issue**: Email clients and n8n strip `<script>` tags when sent as raw HTML
- **Solution**: Escape HTML entities before sending to webhook, display as text in email

---

## 📦 Webhook Payload Structure

### Endpoint
```
POST https://n8n.flossly.ai/webhook/email-widget-code
```

### Payload Schema
```json
{
  "email": "developer@example.com",
  "widgetScriptRaw": "<script>...</script>",           // Raw JS for copy-paste
  "widgetScriptEscaped": "&lt;script&gt;...&lt;/script&gt;",  // Escaped for email display
  "widgetScript": "&lt;script&gt;...&lt;/script&gt;",         // Default (backward compatible)
  "botName": "Your Bot",
  "companyName": "Your Company", 
  "botId": "uuid-here",
  "timestamp": "2026-01-31T12:00:00.000Z"
}
```

---

## 🔧 Frontend Implementation

### HTML Escape Function
```javascript
const escapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

### Key Features
- ✅ Escapes HTML entities before sending to webhook
- ✅ Sends **both** raw and escaped versions
- ✅ Raw version: For dashboard "Copy Code" button
- ✅ Escaped version: For email display
- ✅ Validation: Email format, script generation check
- ✅ Error handling with user feedback
- ✅ Loading states and success messages

---

## 📧 n8n Workflow (Email Template)

### Usage in HTML Template
```html
<div class="code-block" style="
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
">{{ $json.body.widgetScriptEscaped }}</div>
```

### Why This Works
- ✅ Email clients display escaped code as **text**, not execute it
- ✅ Code remains **copyable** from email
- ✅ No security issues with executable scripts
- ✅ n8n doesn't strip or modify the content

---

## 🚀 Widget Script Structure

### Generated Script Format
```html
<script>
  window.flossyConfig = {"botId":"UUID"};
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(d.getElementById(id))return;
    js=d.createElement(s);js.id=id;
    js.src="https://widget.flossly.ai/widget.js";
    fjs.parentNode.insertBefore(js,fjs);
  }(document,"script","flossy-widget"));
</script>
```

### After HTML Escaping
```
&lt;script&gt;
  window.flossyConfig = {&quot;botId&quot;:&quot;UUID&quot;};
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(d.getElementById(id))return;
    js=d.createElement(s);js.id=id;
    js.src=&quot;https://widget.flossly.ai/widget.js&quot;;
    fjs.parentNode.insertBefore(js,fjs);
  }(document,&quot;script&quot;,&quot;flossy-widget&quot;));
&lt;/script&gt;
```

---

## ✅ Best Practices Followed

### 1. Never Send Executable JS in Email
- ❌ `<script>` tags get stripped
- ✅ Escaped HTML entities display as text

### 2. Send Both Versions
- `widgetScriptRaw`: For programmatic use, copy buttons
- `widgetScriptEscaped`: For email display

### 3. Backend Responsibility
- Frontend escapes before sending
- n8n displays escaped version
- No complex sanitization in n8n workflow

### 4. SaaS-Level Architecture
This is exactly how **Intercom**, **Crisp**, and **Chatwoot** handle widget installation codes.

---

## 🧪 Testing

### Test Cases
1. ✅ Empty email validation
2. ✅ Invalid email format validation
3. ✅ Script not generated validation
4. ✅ Successful email send
5. ✅ Network error handling
6. ✅ Webhook error response handling

### Manual Testing
```javascript
// Test payload (what gets sent to n8n)
{
  "email": "test@example.com",
  "widgetScriptRaw": "<script>window.flossyConfig={\"botId\":\"test-123\"};(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src=\"https://widget.flossly.ai/widget.js\";fjs.parentNode.insertBefore(js,fjs);}(document,\"script\",\"flossy-widget\"));</script>",
  "widgetScriptEscaped": "&lt;script&gt;window.flossyConfig={&quot;botId&quot;:&quot;test-123&quot;};(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src=&quot;https://widget.flossly.ai/widget.js&quot;;fjs.parentNode.insertBefore(js,fjs);}(document,&quot;script&quot;,&quot;flossy-widget&quot;));&lt;/script&gt;",
  "botName": "Test Bot",
  "companyName": "Test Company",
  "botId": "test-123"
}
```

---

## 🔄 n8n Workflow Configuration

### Function Node (Optional Processing)
```javascript
// If you need to process the data in n8n
const raw = $json.body.widgetScriptRaw;
const escaped = $json.body.widgetScriptEscaped;

return {
  json: {
    email: $json.body.email,
    rawScript: raw,
    displayScript: escaped,
    botInfo: {
      name: $json.body.botName,
      company: $json.body.companyName,
      id: $json.body.botId
    }
  }
};
```

### Email Template Variables
- `{{ $json.body.email }}` - Recipient email
- `{{ $json.body.widgetScriptEscaped }}` - Display in email (escaped)
- `{{ $json.body.widgetScriptRaw }}` - Available if needed (not recommended for email body)
- `{{ $json.body.botName }}` - Bot name
- `{{ $json.body.companyName }}` - Company name
- `{{ $json.body.botId }}` - Bot ID

---

## 📋 Checklist for n8n Workflow Setup

- [ ] Webhook node listening on `/webhook/email-widget-code`
- [ ] POST method enabled
- [ ] JSON response type
- [ ] Email node configured with SMTP or Gmail
- [ ] HTML email template using `widgetScriptEscaped`
- [ ] Code block styling for readability
- [ ] Success response: `{"success": true}`
- [ ] Error response: `{"success": false, "message": "error details"}`

---

## 🎨 Recommended Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0061FB; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .code-block { 
      background: #f5f5f5; 
      padding: 16px; 
      border-radius: 8px; 
      font-family: 'Courier New', monospace; 
      font-size: 13px; 
      overflow-x: auto; 
      white-space: pre-wrap;
      word-wrap: break-word;
      border: 1px solid #ddd;
    }
    .button {
      display: inline-block;
      background: #0061FB;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Flossly Widget is Ready!</h1>
    </div>
    <div class="content">
      <p>Hi there!</p>
      <p>Your chatbot <strong>{{ $json.body.botName }}</strong> for <strong>{{ $json.body.companyName }}</strong> is configured and ready to go!</p>
      
      <h2>📋 Installation Instructions</h2>
      <ol>
        <li>Copy the code snippet below</li>
        <li>Paste it before the closing <code>&lt;/body&gt;</code> tag in your website's HTML</li>
        <li>Save and publish your website</li>
      </ol>
      
      <h2>💻 Your Widget Code</h2>
      <div class="code-block">{{ $json.body.widgetScriptEscaped }}</div>
      
      <p><strong>Note:</strong> Simply copy this entire code block and paste it into your website.</p>
      
      <h2>🆔 Your Bot ID</h2>
      <p><code>{{ $json.body.botId }}</code></p>
      
      <a href="https://dev.flossly.ai/botbuilder" class="button">Manage Your Bot</a>
      
      <p>Need help? Contact our support team or check our <a href="#">documentation</a>.</p>
      
      <p>Best regards,<br>The Flossly Team</p>
    </div>
  </div>
</body>
</html>
```

---

## 🔐 Security Notes

- ✅ No XSS vulnerabilities (escaped HTML)
- ✅ No script injection risks
- ✅ Email-safe content
- ✅ Token/credentials not exposed in email
- ✅ Bot ID is safe to share (public identifier)

---

## 📚 References

This implementation follows industry best practices from:
- Intercom widget installation
- Crisp chat widget setup
- Chatwoot embed code delivery
- Mailchimp HTML email handling

---

## ✨ Future Enhancements

- [ ] Add "Copy to Clipboard" button in email (via web view link)
- [ ] Version widget scripts for rollback capability
- [ ] Track widget installation status
- [ ] Add widget preview in email
- [ ] Multi-language support for email templates

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-01-31
**Version**: 1.0.0
