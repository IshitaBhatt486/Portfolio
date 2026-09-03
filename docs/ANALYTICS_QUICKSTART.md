# Analytics Quick Start: Deploy in 5 Minutes

**Status**: Production Ready ✅
**Cost**: $0/month
**Time**: 5 minutes

---

## Prerequisites

- Cloudflare account (free at cloudflare.com)
- Wrangler CLI installed: `npm install -g @cloudflare/wrangler`
- (Already created: Frontend + D1 database code)

---

## Step 1: Create D1 Database (1 min)

```bash
cd your-portfolio-directory
wrangler d1 create analytics
```

**You'll see output like**:
```
🌍 Remote database created
✓ Database ID: abc123def456ghi789
✓ Database name: analytics
```

**Copy the Database ID** — you'll need it next.

---

## Step 2: Update wrangler.toml (1 min)

Open `wrangler.toml` in your project:

```toml
[[d1_databases]]
binding = "ANALYTICS_DB"
database_name = "analytics"
database_id = "abc123def456ghi789"    ← Paste your ID here

[env.production]
d1_databases = [
  { binding = "ANALYTICS_DB", database_name = "analytics", database_id = "abc123def456ghi789" }
]
```

---

## Step 3: Deploy Worker (1 min)

```bash
wrangler deploy
```

**You'll see**:
```
✨ Uploaded portfolio-analytics successfully
✨ Deployed to https://portfolio-analytics.YOUR-USERNAME.workers.dev
```

**Copy this URL** — you'll need it for the environment variable.

---

## Step 4: Configure Environment (1 min)

Create or update `.env` in your project:

```
VITE_ANALYTICS_URL=https://portfolio-analytics.YOUR-USERNAME.workers.dev/api
```

**Replace** `YOUR-USERNAME` with your actual Cloudflare Workers subdomain.

---

## Step 5: Build & Deploy Frontend (1 min)

```bash
npm run build
```

Deploy the `dist/` folder to your hosting:

**GitHub Pages**:
```bash
git add dist/
git commit -m "deploy: add analytics"
git push
```

**Cloudflare Pages**:
```bash
wrangler pages deploy dist/
```

**Vercel**:
```bash
vercel
```

---

## Step 6: Test It Works (30 sec)

1. Open your deployed site
2. Look at homepage — should see "VISITORS" card
3. Open DevTools → Network tab
4. Refresh page
5. Look for POST to `/api/visit` ✅

**If it shows a number**: Success! 🎉

**If blank**: Check console for errors (analytics URL or backend issue)

---

## You're Done! 

Your portfolio now tracks real visitor metrics with:
- ✅ Zero cost
- ✅ Complete privacy
- ✅ No IP addresses stored
- ✅ Graceful fallback if unavailable

**Next**: Monitor your visitors at https://YOUR-SITE.com! 

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `POST /api/visit` 404 | Worker not deployed. Run `wrangler deploy` |
| `POST /api/visit` 502 | Database ID wrong in wrangler.toml |
| VisitorStats blank | Check `VITE_ANALYTICS_URL` in .env |
| Build fails | Make sure worker.ts is in project root, not src/ |

---

**Need help?** See `docs/analytics.md` for full guide.

**Questions?** Check `docs/analytics-testing.md` for verification steps.
