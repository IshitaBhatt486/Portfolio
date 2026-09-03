# Ishita Bhatt — Portfolio

A modern, zero-cost portfolio built with React, TypeScript, and Vite.

**Cost**: $0/month | **Deploy time**: 2 minutes | **Build time**: 1.27s | **Bundle**: 118 KB gzipped

---

## Features

✅ **Fast** — Vite build, optimized bundle, instant navigation
✅ **Modern** — React 18, TypeScript, Framer Motion animations
✅ **Responsive** — Mobile-first design, works on all devices
✅ **Accessible** — WCAG compliant, keyboard navigation, skip links
✅ **SEO-friendly** — Open Graph tags, meta descriptions, structured data
✅ **Privacy-first** — No tracking, no cookies, no analytics
✅ **Zero-cost** — Free hosting, free tools, free to scale
✅ **Offline-capable** — Works without internet (except external links)

---

## Tech Stack

| Tool | Purpose | License |
|------|---------|---------|
| React | UI framework | MIT |
| TypeScript | Type safety | Apache 2.0 |
| Vite | Build tool | MIT |
| Tailwind CSS | Styling | MIT |
| Framer Motion | Animations | MIT |
| Lucide React | Icons | ISC |

**All free and open-source. No paid dependencies.**

---

## Quick Start

### Development

```bash
npm install
npm run dev
# Open http://127.0.0.1:5173
```

### Production Build

```bash
npm run build
npm run preview
```

### Deployment

```bash
# Option 1: GitHub Pages (free)
npm run build
# Push dist/ to gh-pages branch

# Option 2: Cloudflare Pages (free + fast)
# Connect GitHub repo at cloudflare.com
# Auto-deploys on git push

# Option 3: Vercel (free)
# Import GitHub repo at vercel.com
# Auto-deploys on git push
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## File Structure

```
src/
  App.tsx                    # Route handler and page transitions
  main.tsx                   # Entry point
  
  components/
    Button.tsx              # Reusable CTA button
    Container.tsx           # Layout wrapper
    EditorialSections.tsx   # Education, leadership, experience
    Navbar.tsx              # Site header and navigation
    PageTransition.tsx       # Route transition animations
    ProjectCard.tsx         # Project summary component
    PuzzleIntro.tsx         # Landing animation
    PuzzleTile.tsx          # Puzzle grid cell
    RectangularInfoCard.tsx # Info block component
    ScrollPuzzle.tsx        # Scroll-driven animation
    SectionHeading.tsx      # Section header
    SkillsPuzzle.tsx        # Skills tabbed interface
    SocialLinks.tsx         # Social media links
    
  pages/
    HomePage.tsx            # Landing page (/)
    ProjectsPage.tsx        # Projects archive (/projects)
    ProjectDetailPage.tsx   # Case study view (/projects/:slug)
    AchievementsPage.tsx    # Achievements gallery (/achievements)
    
  sections/
    HomeSections.tsx        # Homepage section layout
    
  data/
    portfolio.ts            # All content (static data source)
    
  hooks/
    useMediaQuery.ts        # Responsive hook
    useReducedMotion.ts     # Accessibility hook
    
  lib/
    motion.ts               # Animation constants
    
  styles/
    globals.css             # Design system and layout

dist/                       # Built output (generated)
public/                     # Static assets
  favicon.svg              # Brand icon
  resume.html              # Resume page
```

---

## Configuration

### Update Content

Edit `src/data/portfolio.ts` to customize:

```typescript
const portfolio = {
  person: { /* identity */ },
  projects: [ /* case studies */ ],
  skills: [ /* capabilities */ ],
  leadership: [ /* roles */ ],
  // ... more sections
}
```

### Customize Styles

Edit `src/styles/globals.css` to change:

```css
:root {
  --accent: #7c3aed;      /* Purple theme */
  --ink: #1b1324;         /* Dark background */
  --paper: #f7f2fb;       /* Light background */
}
```

### Update Metadata

Edit `index.html` to change:

```html
<title>Your Name — Title</title>
<meta name="description" content="Your description" />
```

---

## Cost Audit

**This portfolio costs $0/month to deploy and maintain.**

See [COST_AUDIT_SUMMARY.md](./COST_AUDIT_SUMMARY.md) for complete breakdown.

### What's Included (Free)

✅ All dependencies (open-source)
✅ Hosting (GitHub Pages, Cloudflare, Vercel)
✅ SSL/HTTPS (automatic)
✅ CDN (global delivery)
✅ Build tools (Vite, TypeScript)
✅ Analytics (optional, free)

### What's NOT Included

❌ No paid services
❌ No API subscriptions
❌ No database costs
❌ No analytics tracking
❌ No hidden fees

---

## Deployment

### GitHub Pages (Recommended)

1. Push to GitHub
2. Go to Settings → Pages
3. Select branch `main`, folder `/`
4. Deploy via GitHub Actions
5. Site live at `username.github.io`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#option-1-github-pages-recommended)

### Cloudflare Pages (Fastest)

1. Connect GitHub repo at cloudflare.com
2. Configure build: `npm run build`, output: `dist`
3. Auto-deploys on push
4. Site live at `username.pages.dev`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#option-2-cloudflare-pages-advanced)

### Vercel (One-Click)

1. Import GitHub repo at vercel.com
2. Vercel auto-detects Vite
3. Auto-deploys on push
4. Site live at `username.vercel.app`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#option-3-vercel-quick-setup)

---

## Development

### Commands

```bash
npm run dev              # Start dev server (127.0.0.1:5173)
npm run build            # Production build
npm run preview          # Preview built output
npm run lint             # Run ESLint
```

### Environment

No environment variables needed. The app works without a `.env` file.

### Routing

Routes are handled client-side:
- `/` — HomePage
- `/projects` — ProjectsPage
- `/projects/:slug` — ProjectDetailPage
- `/achievements` — AchievementsPage

All routes work with deep linking, browser back/forward, and direct navigation.

---

## Performance

### Bundle Size

```
dist/index.html              1.54 kB
dist/assets/index.css       57.63 kB (gzip: 11.59 kB)
dist/assets/index.js       374.04 kB (gzip: 118.40 kB)

Total: 433 kB (uncompressed) / 130 kB (gzipped)
```

### Build Time

```
npm run build: 1.27 seconds
```

### Page Load

- First Contentful Paint: < 1s (depends on host)
- Time to Interactive: < 2s
- Lighthouse Score: 90+ (on Cloudflare Pages)

---

## Accessibility

✅ Semantic HTML
✅ ARIA labels for navigation
✅ Keyboard navigation (arrows, Home, End)
✅ Reduced motion support (prefers-reduced-motion)
✅ Skip links
✅ Color contrast > 4.5:1
✅ Focus indicators

---

## Security

✅ No authentication (not needed)
✅ No API keys in code
✅ No personal data collection
✅ No tracking or analytics (by default)
✅ HTTPS everywhere (automatic)
✅ Content Security Policy ready
✅ No vulnerable dependencies

Run `npm audit` to verify security status.

---

## Analytics (Optional)

By default, the site has **zero tracking**.

To add optional free analytics, see [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md)

Options:
- **Cloudflare Analytics** (free, if hosting on Cloudflare Pages)
- **Plausible** (free tier: 10 sites)
- **Fathom** (free tier: 1 site)
- **No analytics** (recommended for portfolios)

---

## Maintenance

### Monthly

- [ ] Check `npm outdated`
- [ ] Review deployment logs
- [ ] Test all links

### Quarterly

- [ ] Run `npm audit`
- [ ] Update dependencies (`npm update`)
- [ ] Test across browsers

### As Needed

- [ ] Update content in `src/data/portfolio.ts`
- [ ] Rebuild and redeploy

---

## Contributing

This is a personal portfolio. To customize:

1. Fork or clone the repo
2. Edit `src/data/portfolio.ts` with your content
3. Customize colors in `src/styles/globals.css`
4. Update metadata in `index.html`
5. Deploy to your chosen free host

---

## License

All code is yours to use, modify, and deploy. The starter template is provided as-is.

Third-party licenses:
- React: MIT
- Framer Motion: MIT
- Tailwind CSS: MIT
- Lucide React: ISC
- Vite: MIT
- TypeScript: Apache 2.0

---

## Support

### Documentation

- [COST_AUDIT_SUMMARY.md](./COST_AUDIT_SUMMARY.md) — Cost breakdown
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — How to deploy
- [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md) — Optional tracking
- [COST_AUDIT.md](./COST_AUDIT.md) — Detailed analysis

### Troubleshooting

**Site doesn't deploy**: See DEPLOYMENT_GUIDE.md
**Build fails**: Run `npm install`, then `npm run build`
**Pages don't work**: Check routing in `src/App.tsx`
**Styling issues**: Check colors in `src/styles/globals.css`

---

## Roadmap (Optional Enhancements)

- [ ] Blog integration (static markdown)
- [ ] Dark mode toggle
- [ ] Search functionality
- [ ] Advanced filtering on projects
- [ ] Contact form (with email backend)
- [ ] Custom analytics (self-hosted)

All can be added without increasing costs.

---

## Zero-Cost Deployment

This portfolio is designed to cost absolutely nothing to deploy and maintain:

- ✅ Free hosting (GitHub Pages, Cloudflare Pages, Vercel)
- ✅ Free tools (Vite, React, TypeScript)
- ✅ Free fonts (system fonts)
- ✅ Free icons (Lucide React)
- ✅ Free animations (Framer Motion)
- ✅ Zero API calls
- ✅ Zero database costs
- ✅ Zero tracking costs

**Result**: Enterprise portfolio at zero cost. Deploy with confidence.

---

**Built with ❤️ using React, TypeScript, and Vite.**

See [COST_AUDIT_SUMMARY.md](./COST_AUDIT_SUMMARY.md) for complete cost verification.
