# 🚀 Deploying Spend Analyzer to GitHub Pages

This guide will help you deploy your Spend Analyzer app to GitHub Pages for free hosting.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- The spendanlayzer project

## 🎯 Deployment Steps

### Method 1: Automatic Deployment (Recommended)

#### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `spendanlayzer` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (we already have files)
6. Click **"Create repository"**

#### Step 2: Initialize Git and Push Code

Open terminal in the `spendanlayzer` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Spend Analyzer PWA"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/spendanlayzer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. The workflow will automatically run and deploy your app

#### Step 4: Access Your App

After deployment completes (2-3 minutes):
- Your app will be live at: `https://YOUR_USERNAME.github.io/spendanlayzer/`
- You can now install it on any mobile device!

---

### Method 2: Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Install gh-pages package
npm install -D gh-pages

# Add deploy script to package.json (already configured)
# Then deploy
npx gh-pages -d dist
```

---

## 📱 Installing on Mobile (After Deployment)

### Android
1. Open Chrome on your phone
2. Go to: `https://YOUR_USERNAME.github.io/spendanlayzer/`
3. Tap menu (⋮) → **"Add to Home screen"**
4. Done! App is installed

### iPhone
1. Open Safari on your phone
2. Go to: `https://YOUR_USERNAME.github.io/spendanlayzer/`
3. Tap Share (□↑) → **"Add to Home Screen"**
4. Done! App is installed

---

## 🔄 Updating Your App

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Actions will automatically rebuild and redeploy!

---

## ⚙️ Configuration Notes

The following files have been configured for GitHub Pages:

1. **vite.config.js** - Set base path to `/spendanlayzer/`
2. **.github/workflows/deploy.yml** - Automatic deployment workflow

**Important**: If you named your repository something other than `spendanlayzer`, update the `base` path in `vite.config.js`:

```javascript
base: '/your-repo-name/',
```

---

## 🐛 Troubleshooting

**Problem**: Page shows 404
- **Solution**: Make sure GitHub Pages is enabled in Settings → Pages
- Check that the base path in vite.config.js matches your repo name

**Problem**: App not updating
- **Solution**: Check Actions tab for deployment status
- Clear browser cache and hard refresh (Ctrl+Shift+R)

**Problem**: Workflow failing
- **Solution**: Check Actions tab for error details
- Ensure repository is public

---

## ✅ Checklist

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Enabled GitHub Pages (Source: GitHub Actions)
- [ ] Waited for deployment to complete
- [ ] Accessed app at GitHub Pages URL
- [ ] Installed on mobile device
- [ ] Tested offline functionality

---

## 🎉 You're Done!

Your Spend Analyzer app is now:
- ✅ Hosted for free on GitHub Pages
- ✅ Accessible from anywhere in the world
- ✅ Installable on any mobile device
- ✅ Automatically deployed on every push

Share your app URL with anyone: `https://YOUR_USERNAME.github.io/spendanlayzer/`
