# 🔄 How to Pull After Force Push (Clean History)

## ⚠️ Situation

You force-pushed a clean history to GitHub (without secrets).
Your server still has the old history (with secrets in commits).
Git doesn't know how to reconcile these "divergent branches."

---

## ✅ Solution: Reset Server to Match GitHub

**On your VPS server**, run these commands:

```bash
cd /root/flossy-widget  # or wherever your repo is

# 1. Fetch the new clean history from GitHub
git fetch origin

# 2. HARD reset to match GitHub (discards local history)
git reset --hard origin/main

# 3. Verify you're clean
git log --oneline -5
```

---

## 📊 What This Does

| Command | Action |
|---------|--------|
| `git fetch origin` | Downloads the new clean history from GitHub |
| `git reset --hard origin/main` | Throws away your old local history and matches GitHub exactly |
| `git log` | Shows you now have the clean commit history |

---

## ⚠️ Important Notes

1. **This discards any uncommitted changes on the server**
   - Any files you edited but didn't commit will be LOST
   - Make sure you don't have important changes before running this

2. **Your .env file is safe**
   - It's not tracked by git (in .gitignore)
   - Won't be affected by the reset

3. **This is what you want**
   - Old history had secrets = BAD
   - New history is clean = GOOD
   - Server should use the new clean history

---

## 🔍 Before Running (Optional Safety Check)

Check if you have any uncommitted changes:

```bash
cd /root/flossy-widget
git status
```

**If you see uncommitted changes:**
- Back them up if important
- Or commit them first (but make sure no secrets!)

**If you see "nothing to commit, working tree clean":**
- Safe to proceed with reset

---

## 🚀 Complete Steps

```bash
# SSH into your server
ssh root@your-server

# Navigate to repo
cd /root/flossy-widget

# Check current status
git status
git log --oneline -3

# Fetch and reset to clean history
git fetch origin
git reset --hard origin/main

# Verify it worked
git log --oneline -3
# Should show: cda1bc6 feat: Add AI agent with website scraping

# Check your files are there
ls -la

# Restart services if needed
pm2 restart all
```

---

## ✅ After Reset

Your server will now have:
- ✅ Clean git history (no secrets in commits)
- ✅ All the new AI agent files
- ✅ .env file still intact (not touched)
- ✅ Same as what's on GitHub

---

## 🎯 Quick Command (One-Liner)

If you're confident and want to do it in one go:

```bash
cd /root/flossy-widget && git fetch origin && git reset --hard origin/main && git log --oneline -5
```

---

## 🐛 If Something Goes Wrong

**Backup first (before reset):**
```bash
cd /root/flossy-widget
git branch backup-before-reset
```

**To restore backup:**
```bash
git reset --hard backup-before-reset
```

---

**Ready to run on your server!** 🚀
