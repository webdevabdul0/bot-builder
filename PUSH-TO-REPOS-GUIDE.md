# 🚀 Push Code to Both Repositories

## 📦 Two Separate Repositories

You have two different repos that need to be pushed:

### 1️⃣ **Bot Builder** (Frontend - React App)
- **Location**: Root directory
- **Contains**: React app, BotBuilder.jsx, auth components
- **Repository**: Your bot-builder repo

### 2️⃣ **VPS Deployment** (Backend - Node.js Server)
- **Location**: `vps-deployment/` folder
- **Contains**: AI agent, server, widget.js
- **Repository**: Your vps-deployment repo

---

## 🔐 Security Check

✅ **API keys removed from code**
- ❌ No hardcoded keys in `ai-tools.js`
- ❌ No hardcoded keys in `ai-agent.js`
- ✅ Keys are in `.env` file (ignored by git)

---

## 📝 Push Instructions

### **Option 1: Push Both from Root (If they're separate repos)**

#### Step 1: Push Bot Builder (Frontend)
```bash
# From root directory
git add src/services/authService.js
git add src/BotBuilder.jsx
git commit -m "feat: Add AI agent with website scraping and improve UX

- Integrated OpenAI GPT-4o-mini for intelligent conversations
- Added Firecrawl for real-time website browsing
- AI can now browse practice websites and answer questions
- Made Company Website field required with validation
- Replaced alert popups with snackbar notifications
- Hidden 'No config found' message for better UX
- Added aiMode configuration to bot settings"

git push origin main
```

#### Step 2: Push VPS Deployment (Backend)
```bash
# Go to vps-deployment folder
cd vps-deployment

# Initialize git if not already done
git init
git remote add origin YOUR_VPS_DEPLOYMENT_REPO_URL

# Add all AI agent files
git add ai-agent.js
git add ai-tools.js
git add server.js
git add widget.js
git add .env.example
git add package.json
git add package-lock.json

# Commit
git commit -m "feat: Add AI agent with real-time website scraping

- Implemented AI agent using OpenAI GPT-4o-mini
- Added Firecrawl for website browsing capability
- AI can browse practice websites in real-time
- Added tool calling for appointments, leads, callbacks
- Integrated with existing Flossly APIs
- Added 6 new API endpoints for AI chat
- Widget now supports AI mode with aiMode flag
- API keys stored securely in .env file"

# Push
git push origin main
```

---

### **Option 2: If vps-deployment is a subfolder (not separate repo)**

```bash
# From root directory
git add vps-deployment/ai-agent.js
git add vps-deployment/ai-tools.js
git add vps-deployment/server.js
git add vps-deployment/widget.js
git add vps-deployment/.env.example
git add vps-deployment/package.json
git add vps-deployment/package-lock.json
git add src/services/authService.js
git add src/BotBuilder.jsx

git commit -m "feat: Complete AI agent integration with website scraping

Backend (VPS):
- Implemented AI agent using OpenAI GPT-4o-mini
- Added Firecrawl for real-time website browsing
- AI can browse practice websites and extract information
- Added tool calling for appointments, leads, callbacks
- Integrated with existing Flossly APIs
- Added 6 new API endpoints for AI chat
- Widget now supports AI mode

Frontend (Bot Builder):
- Made Company Website field required
- Replaced alert popups with snackbar notifications
- Hidden 'No config found' message for better UX
- Added aiMode configuration to bot settings

All API keys secured in .env file (not committed)"

git push origin main
```

---

## ✅ Files Changed - Summary

### **Frontend (Bot Builder)**
```
src/services/authService.js     ✅ (UX improvements)
src/BotBuilder.jsx              ✅ (Required field + snackbar)
```

### **Backend (VPS Deployment)**
```
vps-deployment/ai-agent.js      ✅ NEW - AI agent logic
vps-deployment/ai-tools.js      ✅ NEW - Web browsing tools
vps-deployment/server.js        ✅ MODIFIED - Added AI endpoints
vps-deployment/widget.js        ✅ MODIFIED - AI mode support
vps-deployment/.env             ❌ NOT COMMITTED (has secrets)
vps-deployment/.env.example     ✅ Updated with AI keys
vps-deployment/package.json     ✅ Added openai, firecrawl
vps-deployment/package-lock.json ✅ Updated
```

### **Documentation**
```
vps-deployment/AI-AGENT-SETUP.md         ✅ NEW
vps-deployment/QUICK-START.md            ✅ NEW
vps-deployment/IMPLEMENTATION-SUMMARY.md ✅ NEW
WHERE-IS-EVERYTHING-SAVED.md             ✅ NEW
ACCESS-BOT-BUILDER.md                    ✅ NEW
WHY-AUTHENTICATION-WORKS-ON-PRODUCTION-NOT-LOCAL.md ✅ NEW
```

---

## 🔍 Verify Before Push

Run these checks:

```bash
# 1. Check .gitignore includes .env
cat .gitignore | grep .env

# 2. Make sure .env is not staged
git status | grep .env

# 3. Verify no secrets in staged files
git diff --cached | grep -E "sk-|fc-"

# 4. Check what files will be committed
git status
```

**Expected:**
- ✅ `.env` should appear as "Untracked files" or not at all
- ❌ Should NOT see `.env` in "Changes to be committed"
- ❌ Should NOT see any API keys in git diff

---

## 🚨 Important Notes

1. **Never commit `.env` file**
   - It contains your API keys
   - Already in `.gitignore`
   - Team members create their own `.env` from `.env.example`

2. **After team pulls code, they need to:**
   ```bash
   # In vps-deployment folder
   cp .env.example .env
   # Then edit .env and add real API keys
   ```

3. **On production server:**
   - Set environment variables directly
   - Or create `.env` file with production keys
   - Never use the same keys as development

---

## 📋 Commit Message Template

Use this format for clear commit messages:

```
feat: Add AI agent with real-time website scraping

Backend changes:
- Implemented AI agent using OpenAI GPT-4o-mini
- Added Firecrawl for website browsing
- Created tool calling system
- Added 6 new API endpoints
- Integrated with existing APIs

Frontend changes:
- Made Company Website field required
- Improved validation UX with snackbars
- Added AI mode configuration

Security:
- API keys moved to .env file
- Updated .env.example
```

---

## 🎯 Quick Push Commands

**If you're ready to push right now:**

```bash
# Check what will be committed
git status

# Add files (adjust based on your repo structure)
git add src/services/authService.js src/BotBuilder.jsx
git add vps-deployment/ai-agent.js vps-deployment/ai-tools.js
git add vps-deployment/server.js vps-deployment/widget.js
git add vps-deployment/.env.example vps-deployment/package*.json

# Verify no secrets
git diff --cached | grep -E "sk-proj|fc-" || echo "✅ No secrets found"

# Commit
git commit -m "feat: Add AI agent with website scraping and UX improvements"

# Push
git push origin main
```

---

## ✅ After Pushing

1. **On production server**, update `.env`:
   ```bash
   cd /path/to/vps-deployment
   nano .env
   # Add the API keys
   ```

2. **Restart services**:
   ```bash
   pm2 restart all
   # or
   npm run start
   ```

3. **Verify it works**:
   ```bash
   # Test the AI endpoint
   curl -X POST http://localhost:3001/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"botId":"test","message":"Hello"}'
   ```

---

**Ready to push? Double-check no secrets are committed, then go ahead!** 🚀
