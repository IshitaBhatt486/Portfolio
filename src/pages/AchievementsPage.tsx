import { ArrowLeft, ExternalLink, Trophy } from 'lucide-react'
import { Container } from '../components/Container'
import { PageTransition } from '../components/PageTransition'
import { portfolio } from '../data/portfolio'

export function AchievementsPage() {
  const achievementGroups = [
    { title: 'Achievements', items: portfolio.achievements },
    { title: 'Certificates', items: portfolio.certifications },
  ]

  return (
    <PageTransition>
      <a className="skip-link" href="#achievement-gallery">Skip to achievements</a>
      <header className="projects-page-nav">
        <Container>
          <a href="/" aria-label="Back home"><ArrowLeft size={16} aria-hidden /> Back home</a>
          <span>{portfolio.person.name} / Achievement gallery</span>
        </Container>
      </header>

      <main className="projects-page achievements-page">
        <Container>
          <header className="projects-page-header">
            <p className="eyebrow">Portfolio record / {String(portfolio.achievements.length + portfolio.certifications.length).padStart(2, '0')}</p>
            <h1>Achievement gallery</h1>
            <p>Selected signals of effort, leadership, and curiosity across product, research, and community work.</p>
          </header>

          <div id="achievement-gallery" className="achievement-gallery">
            {achievementGroups.map(group => (
              <section key={group.title} className="achievement-group">
                <div className="achievement-group__header">
                  <p className="eyebrow">{group.title}</p>
                  <Trophy size={18} aria-hidden />
                </div>

                <div className="achievement-grid">
                  {group.items.map(item => (
                    <article className="achievement-card" key={`${group.title}-${item.title}`}>
                      <div className="achievement-card__meta">
                        <span>{item.type}</span>
                        <time>{item.year}</time>
                      </div>
                      <h2>{item.title}</h2>
                      <p className="achievement-card__issuer">{item.issuer}</p>
                      {item.category && <p className="achievement-card__category">{item.category}</p>}
                      <p>{item.description}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          View reference <ExternalLink size={14} aria-hidden />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </main>
    </PageTransition>
  )
}
