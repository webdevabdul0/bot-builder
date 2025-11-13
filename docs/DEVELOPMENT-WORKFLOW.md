# 🔄 Flossy Widget Development Workflow

## Current Setup Status ✅

Your widget is now **LIVE** and accessible at: **http://213.165.249.205/widget.js**

## 🎯 How to Make Changes (UI/Functionality)

### **For Bot Configuration Changes (Easy)**

#### 1. **Edit Bot Settings**
```bash
cd /Users/mac/Documents/flossy-new
npm run dev  # Opens Bot Builder at localhost:5173
```

#### 2. **Make Changes**
- Update bot name, colors, messages
- Add/remove appointment options
- Change theme colors
- Test with "Test Bot" button

#### 3. **Generate New Script**
- Click "Save" button
- Go to "Add to website" tab
- Copy new embed script
- Send to client

**Result**: Client updates their embed script, gets new configuration instantly!

---

### **For Widget Code Changes (Advanced)**

When you need to change the **widget.js** file itself (UI improvements, new features, bug fixes):

#### **Method 1: Direct VPS Edit (Quick)**
```bash
# SSH to your VPS
ssh root@213.165.249.205

# Edit widget directly
cd /var/www/flossy-widget
nano widget.js

# Restart service
pm2 restart flossy-widget
```

#### **Method 2: Git Workflow (Recommended)**

##### **Setup (One-time)**
```bash
cd /Users/mac/Documents/flossy-new/vps-deployment

# Initialize Git (if not done)
git init
git add .
git commit -m "Initial widget deployment"

# Add your VPS as remote
git remote add production root@213.165.249.205:/var/www/flossy-widget
```

##### **Making Changes**
```bash
# 1. Edit widget.js locally
nano widget.js

# 2. Test changes locally (optional)
node server.js  # Test on localhost:3001

# 3. Commit changes
git add .
git commit -m "Add new feature: improved animations"

# 4. Deploy to VPS
git push production main

# 5. SSH and restart
ssh root@213.165.249.205 "cd /var/www/flossy-widget && pm2 restart flossy-widget"
```

#### **Method 3: Automated Deployment Script**

Create a deployment script:

```bash
#!/bin/bash
# deploy-widget.sh

echo "🚀 Deploying widget updates..."

# Upload widget.js to VPS
scp widget.js root@213.165.249.205:/var/www/flossy-widget/

# Restart service
ssh root@213.165.249.205 "pm2 restart flossy-widget"

echo "✅ Deployment complete!"
echo "Widget URL: http://213.165.249.205/widget.js"
```

---

## 🧪 Testing Changes

### **1. Test Locally First**
```bash
cd vps-deployment
node server.js  # Runs on localhost:3001

# Test URL: http://localhost:3001/widget.js
```

### **2. Test on VPS**
Open: `test-widget.html` in your browser (already created for you)

### **3. Test with Real Website**
Use the embed script generated from Bot Builder

---

## 📁 File Organization

```
flossy-new/
├── src/BotBuilder.jsx           # ← Bot configuration interface
├── vps-deployment/              # ← Widget code for VPS
│   ├── widget.js               # ← Main widget file (edit for UI changes)
│   ├── server.js               # ← Server (rarely needs changes)
│   └── package.json            # ← Dependencies
├── test-widget.html            # ← Test your widget locally
└── DEVELOPMENT-WORKFLOW.md     # ← This guide
```

---

## 🔄 Common Change Scenarios

### **Scenario 1: Change Widget Colors/Styling**

**File to edit**: `vps-deployment/widget.js`

**What to change**:
```javascript
// Find the styles section
const styles = `
  .flossy-widget {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    /* Add your custom styles here */
  }
`;
```

**Deploy**: Upload widget.js and restart PM2

### **Scenario 2: Add New Widget Features**

**File to edit**: `vps-deployment/widget.js`

**Examples**:
- Add typing indicators
- New animation effects
- Additional form fields
- Custom message templates

**Deploy**: Upload widget.js and restart PM2

### **Scenario 3: Change Bot Behavior**

**File to edit**: `src/BotBuilder.jsx`

**Examples**:
- Different greeting messages
- New appointment options
- Theme colors
- Company branding

**Deploy**: Generate new embed script, send to client

### **Scenario 4: Add New Bot Configuration Options**

**Files to edit**: 
1. `src/BotBuilder.jsx` (add UI controls)
2. `vps-deployment/widget.js` (handle new config)

**Deploy**: Both files need updates

---

## 🚀 Quick Commands Reference

### **Deploy Widget Changes**
```bash
# Quick deployment
scp vps-deployment/widget.js root@213.165.249.205:/var/www/flossy-widget/
ssh root@213.165.249.205 "pm2 restart flossy-widget"
```

### **Check Widget Status**
```bash
# Test widget URL
curl -I http://213.165.249.205/widget.js

# Check service status
ssh root@213.165.249.205 "pm2 status flossy-widget"

# View logs
ssh root@213.165.249.205 "pm2 logs flossy-widget"
```

### **Test Widget Locally**
```bash
cd vps-deployment
node server.js
# Open: http://localhost:3001/widget.js
```

---

## 🎯 Best Practices

### **1. Always Test First**
- Test locally before deploying
- Use `test-widget.html` for quick tests
- Test on different devices/browsers

### **2. Version Control**
- Commit changes before deploying
- Use descriptive commit messages
- Tag releases: `git tag v1.0.1`

### **3. Backup Before Changes**
```bash
# Backup current widget
ssh root@213.165.249.205 "cp /var/www/flossy-widget/widget.js /var/www/flossy-widget/widget.js.backup"
```

### **4. Monitor After Deployment**
- Check widget loads: `curl http://213.165.249.205/widget.js`
- Check service status: `pm2 status`
- Monitor logs: `pm2 logs flossy-widget`

---

## 🚨 Troubleshooting

### **Widget Not Loading**
```bash
# Check service status
ssh root@213.165.249.205 "pm2 status"

# Restart service
ssh root@213.165.249.205 "pm2 restart flossy-widget"

# Check logs
ssh root@213.165.249.205 "pm2 logs flossy-widget --lines 50"
```

### **Changes Not Appearing**
- Clear browser cache (Ctrl+F5)
- Check file was uploaded correctly
- Verify PM2 restart completed
- Check for JavaScript errors in browser console

### **Service Won't Start**
```bash
# Check for syntax errors
ssh root@213.165.249.205 "cd /var/www/flossy-widget && node -c widget.js"

# Check server.js
ssh root@213.165.249.205 "cd /var/www/flossy-widget && node -c server.js"
```

---

## 🎉 Summary

**Your widget is LIVE and ready!** 🚀

- **Widget URL**: http://213.165.249.205/widget.js
- **Bot Builder**: Edit configurations easily
- **Widget Code**: Edit for UI/functionality changes
- **Deployment**: Simple file upload + PM2 restart

**Next Steps**:
1. Open `test-widget.html` to test your widget
2. Use Bot Builder to create client configurations
3. Make UI changes by editing `widget.js`
4. Deploy changes with simple file upload

Your professional chat widget system is now complete! 🎊
