/**
 * COST AUDIT: ZERO-COST PORTFOLIO
 * ============================================
 * This portfolio is completely free to deploy and maintain.
 * 
 * Architecture:
 * - Static SPA built with React + TypeScript + Vite
 * - All dependencies are open-source (MIT/Apache 2.0 licenses)
 * - No external API calls, no analytics, no paid services
 * - Deployable to GitHub Pages, Cloudflare Pages, or Vercel for $0/month
 * 
 * Dependencies (all free):
 * - React: UI framework (MIT)
 * - Framer Motion: Animations (MIT)
 * - Tailwind CSS: Styling (MIT)
 * - Lucide React: Icons (ISC)
 * - Vite: Build tool (MIT)
 * 
 * No paid services required:
 * ✅ No analytics tools (Segment, Mixpanel, Google Analytics)
 * ✅ No databases (Firebase, Supabase, MongoDB)
 * ✅ No CDNs (Cloudinary, imgix)
 * ✅ No email services (SendGrid, Mailgun)
 * ✅ No payment processors (Stripe, Braintree)
 * ✅ No AI APIs (OpenAI, Anthropic)
 * ✅ No error tracking (Sentry, LogRocket)
 * 
 * Hosting cost: $0/month (GitHub Pages, Cloudflare Pages, or Vercel)
 * Domain cost: $0/month (free subdomain) or $10/yr (custom domain)
 * Total: $0–10/year
 * 
 * See COST_AUDIT.md for detailed breakdown
 * See DEPLOYMENT_GUIDE.md for free hosting options
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
