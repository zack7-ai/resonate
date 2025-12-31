# Quick Start Guide

## ✅ Current Directory Structure

Your project is located at:
```
/Users/zackb/Desktop/Resonate/resonate/
```

**Important**: You need to be inside the `resonate` folder (not the outer `Resonate` folder) to run commands.

## 🚀 Start the Development Server

From your terminal:

```bash
# Navigate to the project folder
cd /Users/zackb/Desktop/Resonate/resonate

# Start the development server
npm run dev
```

The server will start at: http://localhost:3000

## 📁 Directory Structure

```
Resonate/                    ← Outer folder (Desktop)
└── resonate/               ← Actual project folder (cd here!)
    ├── package.json        ← You are here when commands work
    ├── .env.local          ← Your API keys
    ├── src/
    ├── supabase/
    └── ...
```

## ✅ Verify You're in the Right Place

Run this command to confirm:
```bash
cd /Users/zackb/Desktop/Resonate/resonate
ls package.json
```

If you see `package.json`, you're in the right place! ✅

If you get "No such file", you're in the wrong directory. Go up one level or navigate to the `resonate` subfolder.


