import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom'
import PokemonPage from './components/PokemonPage'
import { useAllPokemon, usePokemon } from './hooks/usePokemon'
import BlankPage from './components/book/BlankPage'
import HalfTitlePage from './components/book/HalfTitlePage'
import FullTitlePage from './components/book/FullTitlePage'
import CopyrightPage from './components/book/CopyrightPage'
import ForewordPage from './components/book/ForewordPage'
import HowToReadPage from './components/book/HowToReadPage'
import PokedexGridPage from './components/book/PokedexGridPage'
import AppendixPage from './components/book/AppendixPage'
import ClosingPage from './components/book/ClosingPage'
import './App.css'

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

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/pokemon/:id" element={<SinglePage />} />
        <Route path="/page/:slug" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  )
}
