import { useState } from 'react'
import { formatPlayerCard, searchPlayers } from '../api/client'

const Compare = () => {
  const [queries, setQueries] = useState({ a: '', b: '' })
  const [results, setResults] = useState({ a: [], b: [] })
  const [selection, setSelection] = useState({ a: null, b: null })
  const [loading, setLoading] = useState({ a: false, b: false })
  const [error, setError] = useState(null)

  const handleSearch = async (slot) => {
    const q = queries[slot]
    if (!q.trim()) return
    setLoading((prev) => ({ ...prev, [slot]: true }))
    setError(null)
    try {
      const data = await searchPlayers(q.trim())
      setResults((prev) => ({ ...prev, [slot]: data.map(formatPlayerCard) }))
    } catch (err) {
      console.error(err)
      setError('Unable to search right now.')
    } finally {
      setLoading((prev) => ({ ...prev, [slot]: false }))
    }
  }

  const renderResultList = (slot) => (
    <div className="list">
      {results[slot].map((player) => (
        <button
          key={player.id}
          type="button"
          className="list-item"
          onClick={() => setSelection((prev) => ({ ...prev, [slot]: player }))}
        >
          <div className="list-left">
            <img src={player.photo} alt={player.name} className="avatar tiny" />
            <div>
              <div className="player-name">{player.name}</div>
              <div className="muted small">
                {player.team || 'Unknown'} · {player.position || 'N/A'}
              </div>
            </div>
          </div>
          <span className="pill">Select</span>
        </button>
      ))}
    </div>
  )

  const renderComparisonStat = (label, key) => (
    <div className="compare-row" key={key}>
      <div className="muted">{label}</div>
      <div className="compare-number">{selection.a?.[key] ?? '—'}</div>
      <div className="compare-number">{selection.b?.[key] ?? '—'}</div>
    </div>
  )

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Player Comparison</p>
          <h1>Line up two players side-by-side</h1>
          {error && <div className="error">{error}</div>}
        </div>
      </div>

      <div className="compare-grid">
        {['a', 'b'].map((slot) => (
          <div className="card" key={slot}>
            <p className="muted small">Player {slot === 'a' ? 'One' : 'Two'}</p>
            <form
              className="search-bar inline"
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch(slot)
              }}
            >
              <input
                value={queries[slot]}
                onChange={(e) =>
                  setQueries((prev) => ({ ...prev, [slot]: e.target.value }))
                }
                placeholder="Search player"
              />
              <button
                type="submit"
                className="primary-btn"
                disabled={loading[slot]}
              >
                {loading[slot] ? 'Searching...' : 'Search'}
              </button>
            </form>
            {selection[slot] && (
              <div className="selected-player">
                <img src={selection[slot].photo} alt={selection[slot].name} className="avatar" />
                <div>
                  <div className="player-name">{selection[slot].name}</div>
                  <div className="muted small">
                    {selection[slot].team} · {selection[slot].position}
                  </div>
                </div>
              </div>
            )}
            {renderResultList(slot)}
          </div>
        ))}
      </div>

      <div className="card compare-table">
        <div className="compare-row head">
          <div />
          <div>{selection.a?.name || 'Player A'}</div>
          <div>{selection.b?.name || 'Player B'}</div>
        </div>
        {renderComparisonStat('Goals', 'goals')}
        {renderComparisonStat('Assists', 'assists')}
        {renderComparisonStat('Appearances', 'appearances')}
      </div>
    </div>
  )
}

export default Compare
