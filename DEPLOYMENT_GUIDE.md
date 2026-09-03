# Free Deployment Guide

This portfolio can be deployed to multiple free hosting platforms. Choose one based on your preference.

---

## Option 1: GitHub Pages (Recommended)

**Pros**: Easiest, tightly integrated with GitHub, zero config
**Cons**: Subdomain only (unless you add custom domain)
**Cost**: $0/month

### Step 1: Set Repository Settings

1. Push your code to GitHub
2. Go to **Settings → Pages**
3. Choose **Deploy from a branch**
4. Select branch: `main` (or your default branch)
5. Select folder: `/ (root)`

### Step 2: Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

### Step 3: Deploy

```bash
git push origin main
# GitHub Actions automatically builds and deploys
```

**Your site is live at**: `https://username.github.io`

### Add Custom Domain (Optional)

1. **DNS Setup**:
   - Point your domain's `A` records to GitHub's IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or use `CNAME` → `username.github.io`

2. **GitHub Settings**:
   - Settings → Pages → Custom domain
   - Enter your domain
   - GitHub auto-enables HTTPS

---

## Option 2: Cloudflare Pages (Advanced)

**Pros**: Global CDN, faster, more features, auto-deploys
**Cons**: Slightly more setup
**Cost**: $0/month (free tier)

### Step 1: Create Cloudflare Account

1. Sign up at [cloudflare.com](https://www.cloudflare.com)
2. Add your domain (free)

### Step 2: Connect GitHub

1. Go to Cloudflare **Pages**
2. Click **Connect to Git**
3. Authorize Cloudflare to access your GitHub repos
4. Select your portfolio repository

### Step 3: Configure Build

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Environment variables: (leave empty)
```

### Step 4: Deploy

```bash
git push origin main
# Cloudflare auto-deploys on push
```

**Your site is live at**: `https://username.pages.dev` (or custom domain)

### Benefits
- Global CDN (faster worldwide)
- Free SSL/HTTPS
- Automatic deployments
- Analytics dashboard (free tier)

---

## Option 3: Vercel (Quick Setup)

**Pros**: One-click setup, optimized for React
**Cons**: Less control than Cloudflare
**Cost**: $0/month (free tier sufficient for portfolios)

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite

### Step 2: Deploy

```bash
# Push to GitHub
git push origin main
# Vercel auto-deploys
```

**Your site is live at**: `https://username.vercel.app`

---

## Option 4: Netlify (Alternative)

**Pros**: Straightforward, good docs
**Cons**: Can be slower than Cloudflare
**Cost**: $0/month (free tier)

### Quick Setup

1. Go to [netlify.com](https://www.netlify.com)
2. Click **Add new site → Import an existing project**
3. Select GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

**Your site is live at**: `https://username.netlify.app`

---

## Comparison

| Feature | GitHub Pages | Cloudflare Pages | Vercel | Netlify |
|---------|--------------|------------------|--------|---------|
| **Cost** | $0 | $0 | $0 | $0 |
| **Setup Time** | 5 min | 10 min | 3 min | 5 min |
| **Global CDN** | ✅ | ✅ | ✅ | ✅ |
| **Auto-deploy** | ✅ | ✅ | ✅ | ✅ |
| **Custom domain** | ✅ (requires DNS change) | ✅ | ✅ | ✅ |
| **Automatic HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **Free SSL** | ✅ | ✅ | ✅ | ✅ |
| **Analytics** | ❌ | ✅ | Limited | ✅ |
| **Recommended** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## Local Testing Before Deploy

```bash
# Build production bundle
npm run build

# Preview locally (serves dist/ folder)
npm run preview

# Open http://localhost:4173 in browser
# Test all routes and links
```

---

## Custom Domain (Any Provider)

### 1. Buy Domain
- Namecheap ($0.99/yr)
- Porkbun ($0.40/yr)
- Google Domains ($12/yr)
- GoDaddy ($11.99/yr)

### 2. Point to Hosting
**GitHub Pages**:
```
A record → 185.199.108.153
CNAME → username.github.io
```

**Cloudflare Pages**:
```
Nameservers → Cloudflare
Cloudflare adds CNAME automatically
```

**Vercel**:
```
CNAME → cname.vercel-dns.com
```

### 3. Enable HTTPS
- Automatic with all three platforms
- No additional cost

---

## Monitoring & Maintenance (Free)

### GitHub
```bash
git log  # See deployment history
```

### Cloudflare Dashboard
- Real-time analytics
- Request tracking
- Performance metrics
- Free tier included

### Vercel Dashboard
- Deployment history
- Performance analytics
- Error logs

---

## Troubleshooting

### Site shows 404
- Check build output directory: should be `dist/`
- Verify `npm run build` completes successfully
- Check routing: SPA needs fallback to `index.html`

### Slow performance
- Use Cloudflare Pages for best CDN performance
- Check bundle size: `npm run build` should show gzip size
- Current: 118KB JS + 12KB CSS (excellent)

### Analytics needed
- Add optional Cloudflare Analytics (free)
- Or self-host simple visit counter (see ANALYTICS.md)

---

## Rollback & Updates

### GitHub Pages
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main
# Auto-redeploys previous version
```

### Cloudflare/Vercel
- Dashboard shows deployment history
- Click to rollback to any previous deployment

---

## Maintenance Schedule

- **Weekly**: Check if dependencies have updates (`npm outdated`)
- **Monthly**: Run `npm audit` for security vulnerabilities
- **Quarterly**: Update all dependencies (`npm update`)
- **Anytime**: Deploy changes by pushing to main branch

---

## Final Checklist

Before going live:

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` works locally
- [ ] All pages render correctly
- [ ] All links work (internal and external)
- [ ] Responsive on mobile (test at 375px width)
- [ ] No console errors in browser DevTools
- [ ] Open Graph tags correct (test with Twitter Card Validator)
- [ ] favicon.svg displays correctly
- [ ] Resume link works
- [ ] No broken images or fonts

---

## Cost Summary

| Item | Cost | Notes |
|------|------|-------|
| Hosting | $0/month | GitHub Pages, Cloudflare, or Vercel |
| Domain | $0–10/yr | Optional; free subdomain available |
| SSL/HTTPS | $0 | Automatic with all hosts |
| Analytics | $0 | Free tier or optional backend |
| Total | $0/month | **Completely free** |

---

**Questions?** Check the [COST_AUDIT.md](./COST_AUDIT.md) for detailed breakdown.
