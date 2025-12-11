import { useState } from 'react'
import TeamCard from '../components/TeamCard'
import SearchBar from '../components/SearchBar'
import { searchTeams } from '../api/client'

const Teams = () => {
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
      const data = await searchTeams(query.trim())
      const formatted = data.map((item) => ({
        id: item.team?.id,
        name: item.team?.name,
        logo: item.team?.logo,
        country: item.team?.country,
        founded: item.team?.founded,
      }))
      setResults(formatted)
    } catch (err) {
      console.error(err)
      setError('Unable to search teams right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Teams</p>
          <h1>Explore clubs across Premier League, La Liga, and Bundesliga</h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search for a team (e.g., Arsenal, Barcelona, Bayern)"
          />
          {error && <div className="error">{error}</div>}
        </div>
      </div>

      {loading && <div className="card">Loading teams...</div>}

      {!loading && results.length > 0 && (
        <div className="grid">
          {results.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Teams
