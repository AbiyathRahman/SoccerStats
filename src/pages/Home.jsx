import { useState } from 'react'
import PlayerCard from '../components/PlayerCard'
import SearchBar from '../components/SearchBar'
import { formatPlayerCard, searchPlayers } from '../api/client'

const Home = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    try {
      const data = await searchPlayers(query.trim())
      setResults(data.map(formatPlayerCard))
    } catch (err) {
      console.error(err)
      setError('Unable to fetch players right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Player Search</p>
          <h1>Scout real-time player data</h1>
          <p className="muted">
            Search Premier League, La Liga, and Bundesliga players. Open profiles, compare, and
            save favorites.
          </p>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search by player name (e.g., Haaland, Salah)"
          />
          {error && <div className="error">{error}</div>}
        </div>
      </div>

      {loading && <div className="card">Loading players...</div>}

      {!loading && results.length > 0 && (
        <div className="grid">
          {results.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
