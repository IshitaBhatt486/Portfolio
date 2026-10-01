import { ArrowLeft } from 'lucide-react'
import { Container } from '../components/Container'
import { PageTransition } from '../components/PageTransition'
import { portfolio } from '../data/portfolio'

export function PrivacyPage() {
  return (
    <PageTransition>
      <a className="skip-link" href="#privacy-content">Skip to legal, privacy policy and credits</a>
      <header className="projects-page-nav"><Container><a href="/"><ArrowLeft size={16} aria-hidden /> Back home</a><span>{portfolio.person.name} / Legal, Privacy Policy and Credits</span></Container></header>
      <main className="projects-page privacy-page" id="privacy-content"><Container>
        <header className="projects-page-header"><p className="eyebrow">Legal, Privacy Policy and Credits</p><h1>Legal, Privacy Policy and Credits</h1><p>Last updated: 1 October 2026</p></header>
        <div className="project-detail-layout"><div className="case-study-sections">
          <section><span>01</span><div><h2>What this site processes</h2><p>This is a static personal portfolio. It does not provide accounts, forms, uploads, payments, newsletters, analytics, advertising, or visitor tracking. It does not send visitor information to an API, AI provider, or analytics provider.</p></div></section>
          <section><span>02</span><div><h2>Browser storage</h2><p>The site stores only your selected light or dark theme in your browser&apos;s localStorage under <code>portfolio:theme</code>. This preference stays on your device until you clear it in your browser. It is not transmitted to the site owner or another service.</p></div></section>
          <section><span>03</span><div><h2>Links and email</h2><p>Links to GitHub, LinkedIn, and your email application are optional actions you choose. Those services process information under their own policies. This site does not receive a copy of an email you send through your email provider.</p></div></section>
          <section><span>04</span><div><h2>Your choices and contact</h2><p>You can delete the theme preference through your browser&apos;s site-data controls. Because this site does not hold visitor accounts or visitor data, there is no site-held visitor data to access, update, or delete. For privacy questions about this website, contact <a href={`mailto:${portfolio.person.email}`}>{portfolio.person.email}</a>.</p></div></section>
          <section><span>05</span><div><h2>Changes</h2><p>This notice will be updated before any feature that collects or transmits visitor personal data is enabled.</p></div></section>
          <section><span>06</span><div><h2>Trademarks and icon credits</h2><p>Trademarks belong to their respective owners; no endorsement implied.</p><p>Some technology icons are provided by <a href="https://github.com/devicons/devicon" target="_blank" rel="noreferrer">Devicon contributors</a> under the <a href="https://github.com/devicons/devicon/blob/master/LICENSE" target="_blank" rel="noreferrer">MIT License</a>.</p></div></section>
        </div></div>
      </Container></main>
    </PageTransition>
  )
}
