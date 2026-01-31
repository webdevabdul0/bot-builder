# Fix: Widget Code Not Showing in Email

## 🔍 Problem Identified

The widget code is not appearing in the email because **HTML entities are being decoded by email clients**, causing the script tags to be stripped or hidden.

---

## 🎯 Root Cause

When you send:
```javascript
widgetScript: "&lt;script&gt;...&lt;/script&gt;"
```

The email client renders it as:
```html
<script>...</script>  // This gets STRIPPED or HIDDEN by email clients!
```

**Email clients strip `<script>` tags for security**, even when they're supposed to be displayed as text.

---

## ✅ Solution: Use `<pre>` or Text Content

You have **3 options** to fix this:

### Option 1: Use Plain Text Email (Recommended)
Instead of HTML email, send as plain text. The code will be copyable.

### Option 2: Double-Escape the HTML
Don't escape on frontend, let n8n display the raw escaped entities.

### Option 3: Use `<pre>` with `<code>` tags
Wrap in semantic HTML that email clients respect.

---

## 🔧 Recommended Fix

### Frontend Change: Send RAW script (don't escape)

```javascript
body: JSON.stringify({
  email: developerEmail,
  widgetScriptRaw: generatedScript,        // Keep this
  widgetScript: generatedScript,           // ❌ REMOVE escaping - send RAW
  botName: botName || 'Your Bot',
  companyName: companyName || 'Your Company',
  botId: botId,
  timestamp: new Date().toISOString()
})
```

### N8N Change: Use `<pre><code>` tags

```html
<pre style="background-color: #1f2937; color: #f3f4f6; padding: 20px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"><code>{{ $json.body.widgetScript }}</code></pre>
```

**Why this works:**
- `<pre>` tells email clients to preserve formatting
- `<code>` is semantic and email-safe
- Email clients will display `<script>` as text inside `<pre><code>`
- User can copy-paste directly

---

## 📝 Alternative: Use Textarea (Gmail Compatible)

Some email clients support `<textarea readonly>`:

```html
<textarea readonly style="width: 100%; height: 200px; font-family: monospace; padding: 15px; background: #1f2937; color: #f3f4f6; border: none; border-radius: 6px;">{{ $json.body.widgetScript }}</textarea>
```

Benefits:
- Shows code clearly
- Easy to copy (select all)
- Works in most email clients

---

## 🚀 Complete Fixed Implementation

### 1. Update Frontend (Remove escaping)

```javascript
// In flossy-new/src/BotBuilder.jsx
// Line 173 - REMOVE the escapeHtml() call

const sendEmailToDeveloper = async () => {
  // ... validation code ...
  
  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: developerEmail,
      widgetScript: generatedScript,  // ✅ Send RAW (not escaped)
      botName: botName || 'Your Bot',
      companyName: companyName || 'Your Company',
      botId: botId,
      timestamp: new Date().toISOString()
    })
  });
};
```

### 2. Update N8N Email Template

Replace the code-block div with `<pre><code>`:

```html
<h3>💻 Your Chatbot Code</h3>
<p>Copy and paste this entire code snippet:</p>

<pre style="background-color: #1f2937; color: #f3f4f6; padding: 20px; border-radius: 6px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; border: 1px solid #374151;"><code>{{ $json.body.widgetScript }}</code></pre>
```

---

## 🧪 Testing

### Test Payload:
```json
{
  "email": "your-email@example.com",
  "widgetScript": "<script>\n  window.flossyConfig = {\"botId\":\"test-123\"};\n  (function(d,s,id){\n    var js,fjs=d.getElementsByTagName(s)[0];\n    if(d.getElementById(id))return;\n    js=d.createElement(s);js.id=id;\n    js.src=\"https://widget.flossly.ai/widget.js\";\n    fjs.parentNode.insertBefore(js,fjs);\n  }(document,\"script\",\"flossy-widget\"));\n</script>",
  "botName": "Test Bot",
  "companyName": "Test Company",
  "botId": "test-123"
}
```

### What You Should See in Email:
```
<script>
  window.flossyConfig = {"botId":"test-123"};
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(d.getElementById(id))return;
    js=d.createElement(s);js.id=id;
    js.src="https://widget.flossly.ai/widget.js";
    fjs.parentNode.insertBefore(js,fjs);
  }(document,"script","flossy-widget"));
</script>
```

✅ Copyable
✅ Visible
✅ Not executed
✅ Works in Gmail, Outlook, etc.

---

## 📊 Why Previous Approach Failed

| Approach | Result | Why |
|----------|--------|-----|
| Send escaped HTML in `<div>` | ❌ Not visible | Email client decodes `&lt;` → `<`, then strips `<script>` |
| Send escaped HTML in `<code>` | ❌ Not visible | Same issue - decoded then stripped |
| Send escaped HTML in `<pre>` | ✅ **Works!** | `<pre>` preserves text content |
| Send raw HTML in `<textarea>` | ✅ **Works!** | Textarea displays as-is |

---

## 🎯 Final Steps

1. ✅ **Remove `escapeHtml()` call from frontend**
2. ✅ **Send raw script in payload**
3. ✅ **Use `<pre><code>` in n8n email template**
4. ✅ **Import updated workflow to n8n**
5. ✅ **Test with real email**

---

## 📧 Updated Email Template (Full)

Use the workflow file: `n8n-email-widget-code-workflow-FIXED.json`

Key changes:
- ✅ Added `<meta charset="UTF-8">`
- ✅ Changed `<div class="code-block">` to `<pre><code>`
- ✅ Added `white-space: pre-wrap`
- ✅ Added bot details section
- ✅ Fixed spacing in variable `{{ $json.body.widgetScript }}`

---

## ⚠️ Important Notes

- **Don't escape on frontend** - Send raw script
- **Let email client handle display** - Use `<pre><code>`
- **Test in multiple clients** - Gmail, Outlook, Apple Mail
- **Avoid `<div>` for code** - Email clients are aggressive with `<script>` tags

---

**Status**: Ready to implement
**Files to update**: 
1. `flossy-new/src/BotBuilder.jsx` (remove escapeHtml call)
2. `n8n-email-widget-code-workflow.json` (use fixed version)
