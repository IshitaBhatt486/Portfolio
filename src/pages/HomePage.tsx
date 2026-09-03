import { Navbar } from '../components/Navbar'
import { PageTransition } from '../components/PageTransition'
import { PuzzleIntro } from '../components/PuzzleIntro'
import { ScrollPuzzle } from '../components/ScrollPuzzle'

export function HomePage() {
  return (
    <>
      <PageTransition>
        <PuzzleIntro />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <main id="main-content"><ScrollPuzzle /></main>
      </PageTransition>
    </>
  )
}
