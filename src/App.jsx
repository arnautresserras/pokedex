import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet, useParams, Link } from 'react-router-dom'
import { useAllPokemon, usePokemon } from './hooks/usePokemon'
import PlayApp from './play/PlayApp'
import './App.css'

// The print book is lazy-loaded: the iPad should not download 160 A4 pages to play a guessing game.
const PokemonPage    = lazy(() => import('./components/PokemonPage'))
const BlankPage      = lazy(() => import('./components/book/BlankPage'))
const HalfTitlePage  = lazy(() => import('./components/book/HalfTitlePage'))
const FullTitlePage  = lazy(() => import('./components/book/FullTitlePage'))
const CopyrightPage  = lazy(() => import('./components/book/CopyrightPage'))
const ForewordPage   = lazy(() => import('./components/book/ForewordPage'))
const HowToReadPage  = lazy(() => import('./components/book/HowToReadPage'))
const PokedexGridPage = lazy(() => import('./components/book/PokedexGridPage'))
const AppendixPage   = lazy(() => import('./components/book/AppendixPage'))
const ClosingPage    = lazy(() => import('./components/book/ClosingPage'))

const SECTION_LINKS = [
  { to: '/page/half-title',   label: 'Half-title' },
  { to: '/page/full-title',   label: 'Title page' },
  { to: '/page/foreword',     label: 'Foreword' },
  { to: '/page/how-to-read',  label: 'How to read' },
  { to: '/page/pokedex-grid', label: 'Index grid' },
  { to: '/page/appendix',     label: 'Appendix' },
  { to: '/page/closing',      label: 'Closing' },
]

function Nav() {
  return (
    <nav className="app-nav">
      <Link to="/play">Play</Link>
      <span className="app-nav-sep">·</span>
      <Link to="/browse">Full book</Link>
      <span className="app-nav-sep">·</span>
      {SECTION_LINKS.map(({ to, label }) => (
        <Link key={to} to={to}>{label}</Link>
      ))}
      <span className="app-nav-hint">Single card: /pokemon/1–151</span>
    </nav>
  )
}

// Pagination: HowToRead=1, PokedexGrid=2-4, Pokémon #001=5…#151=155, Appendix A=156, B=157, Closing=158
function BrowsePage() {
  const all = useAllPokemon()
  return (
    <div>
      <BlankPage />
      <FullTitlePage />
      <CopyrightPage />
      <ForewordPage />
      <HowToReadPage pageNum={1} />
      <PokedexGridPage pokemon={all} startPage={2} />
      {all.map((pokemon, i) => (
        <PokemonPage key={pokemon.id} pokemon={pokemon} pageNum={5 + i} />
      ))}
      <AppendixPage pokemon={all} startPage={156} />
      <ClosingPage pageNum={158} />
      <BlankPage />
    </div>
  )
}

function SinglePage() {
  const { id } = useParams()
  const pokemon = usePokemon(id)
  if (!pokemon) return <p style={{ padding: '2rem' }}>Pokémon #{id} not found.</p>
  return <PokemonPage pokemon={pokemon} />
}

function BookPage() {
  const { slug } = useParams()
  const all = useAllPokemon()
  switch (slug) {
    case 'half-title':   return <HalfTitlePage />
    case 'full-title':   return <FullTitlePage />
    case 'copyright':    return <CopyrightPage />
    case 'foreword':     return <ForewordPage />
    case 'how-to-read':  return <HowToReadPage />
    case 'pokedex-grid': return <PokedexGridPage pokemon={all} />
    case 'appendix':     return <AppendixPage pokemon={all} />
    case 'closing':      return <ClosingPage />
    default: return <p style={{ padding: '2rem' }}>Page "{slug}" not found.</p>
  }
}

/** Everything print: dev nav on top, one Suspense boundary around the lazy page components. */
function BookLayout() {
  return (
    <>
      <Nav />
      <Suspense fallback={<p className="app-loading">Loading the book…</p>}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play/*" element={<PlayApp />} />
        <Route element={<BookLayout />}>
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/pokemon/:id" element={<SinglePage />} />
          <Route path="/page/:slug" element={<BookPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
