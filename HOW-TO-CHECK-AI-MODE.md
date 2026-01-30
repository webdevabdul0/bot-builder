# 🔍 How to Check if AI Mode is Enabled

## 5 Ways to Verify AI Mode is Active

---

## 1️⃣ **Check Browser Console (Widget)**

When the widget loads, it logs AI mode status.

**Steps:**
1. Open your website with the widget
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these messages:

**AI Mode Enabled:**
```
Flossy Widget: Loading config for botId: your-bot-id
Flossy Widget: Config loaded successfully
Flossy Widget: AI Mode enabled ✅
```

**AI Mode Disabled:**
```
Flossy Widget: Loading config for botId: your-bot-id
Flossy Widget: Config loaded successfully
(No "AI Mode enabled" message)
```

---

## 2️⃣ **Check Bot Configuration File**

Look directly in the database/config file.

**Steps:**
```bash
cd vps-deployment
cat flossy_data.json | grep -A 5 "your-bot-id"
```

**Look for:**
```json
{
  "botId": "your-bot-id",
  "companyName": "Your Practice",
  "companyWebsite": "https://yourpractice.com",
  "aiMode": true,  ← CHECK THIS LINE
  ...
}
```

---

## 3️⃣ **Test with a Message**

Send a test message and check the response behavior.

**Traditional Mode (No AI):**
- Generic response: "Thanks for your message: '...'. How else can I help?"
- No website browsing
- Hardcoded flows only

**AI Mode Enabled:**
- Intelligent, contextual responses
- May say things like: "Let me check your website..."
- Can answer specific questions about your practice
- Uses information from your website

**Example Test:**
```
User: "Can you browse example.com and tell me what you find?"

Traditional: "Thanks for your message..."
AI Mode:    "I found the following information on the website: 
             Title: Example Domain. This domain is for use in 
             illustrative examples..."
```

---

## 4️⃣ **Check Network Tab (API Calls)**

Watch what API endpoint gets called.

**Steps:**
1. Open widget
2. Press **F12** → **Network** tab
3. Type a message
4. Look at the requests:

**AI Mode Enabled:**
```
POST https://widget.flossly.ai/api/ai/chat
Status: 200 OK
Response: { "success": true, "content": "..." }
```

**Traditional Mode:**
```
(No API call - handled locally in widget.js)
```

---

## 5️⃣ **Check Via API Endpoint**

Query the bot configuration directly.

**Request:**
```bash
curl https://widget.flossly.ai/api/bot-config/YOUR_BOT_ID
```

**Response:**
```json
{
  "success": true,
  "data": {
    "botId": "your-bot-id",
    "companyName": "Your Practice",
    "aiMode": true,  ← HERE
    "companyWebsite": "https://yourpractice.com"
  }
}
```

---

## 🎯 **Visual Indicators (What You See)**

### **Conversation Behavior:**

| Feature | Traditional | AI Mode |
|---------|-------------|---------|
| **Website Questions** | "I don't have that info" | Browses and answers |
| **Context Memory** | No memory | Remembers conversation |
| **Natural Language** | Rigid responses | Understands context |
| **Specific Info** | Generic answers | Detailed, accurate |
| **Tool Usage** | None | Books appointments, creates leads |

---

## 🧪 **Quick Test Script**

Use this to definitively check AI mode:

```javascript
// Paste in browser console on page with widget
(async () => {
  const botId = 'your-bot-id'; // Replace with your bot ID
  
  try {
    const response = await fetch(`https://widget.flossly.ai/api/bot-config/${botId}`);
    const data = await response.json();
    
    console.log('='.repeat(50));
    console.log('AI MODE CHECK');
    console.log('='.repeat(50));
    console.log('Bot ID:', data.data.botId);
    console.log('Company:', data.data.companyName);
    console.log('Website:', data.data.companyWebsite);
    console.log('AI Mode:', data.data.aiMode ? '✅ ENABLED' : '❌ DISABLED');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Error checking AI mode:', error);
  }
})();
```

---

## 📊 **Expected Server Logs**

When AI mode is active, server logs show:

```bash
pm2 logs flossy-widget

# You should see:
[AI Agent] Processing message for bot your-bot-id: "Hello"
[AI Agent] Calling tool: search_practice_website
[AI Agent] Final response: "..."
```

---

## 🎨 **Add Visual Indicator (Optional)**

Want to show AI mode status in the widget? Add this to widget.js:

```javascript
// After loading config (line 100-103)
if (botConfig.aiMode) {
    console.log('Flossy Widget: AI Mode enabled');
    aiMode = true;
    
    // Add visual badge (optional)
    const badge = document.createElement('div');
    badge.innerHTML = '🤖 AI Mode';
    badge.style.cssText = 'position:absolute;top:10px;right:10px;background:#10B981;color:white;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:600;';
    header.appendChild(badge);
}
```

---

## ✅ **Quick Checklist**

To verify AI mode is working:

- [ ] Browser console shows "AI Mode enabled"
- [ ] `aiMode: true` in bot config
- [ ] API calls go to `/api/ai/chat`
- [ ] Bot can answer practice-specific questions
- [ ] Bot browses website for information
- [ ] Server logs show `[AI Agent]` messages

If all checked ✅ → **AI Mode is fully active!**

---

## 🚨 **If AI Mode Not Working**

**Check:**
1. Is `companyWebsite` set in config?
2. Are API keys in `.env` file on server?
3. Are `openai` and `@mendable/firecrawl-js` installed?
4. Is server restarted after config change?

**Fix:**
```bash
cd /var/www/flossy-widget
cat .env | grep -E "OPENAI|FIRECRAWL"  # Check keys
npm install                            # Install deps
pm2 restart flossy-widget             # Restart
pm2 logs flossy-widget                # Check logs
```

---

**The easiest way: Open browser console, load widget, look for "AI Mode enabled" message!** 🚀
