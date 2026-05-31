import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom'
import PokemonPage from './components/PokemonPage'
import { useAllPokemon, usePokemon } from './hooks/usePokemon'
import './App.css'

function BrowsePage() {
  const all = useAllPokemon()
  return (
    <div>
      {all.map(pokemon => (
        <PokemonPage key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}

function SinglePage() {
  const { id } = useParams()
  const pokemon = usePokemon(id)
  if (!pokemon) return <p style={{ padding: '2rem' }}>Pokémon #{id} not found.</p>
  return <PokemonPage pokemon={pokemon} />
}

function Nav() {
  return (
    <nav className="app-nav">
      <Link to="/browse">All 151</Link>
      <span className="app-nav-hint">Go to /pokemon/1–151 for a single card</span>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/pokemon/:id" element={<SinglePage />} />
      </Routes>
    </BrowserRouter>
  )
}
