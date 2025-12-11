import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PlayerChart from '../components/PlayerChart'
import { fetchPlayerById, formatPlayerCard } from '../api/client'
import { useFavorites } from '../context/FavoritesContext'

const PlayerProfile = () => {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPlayerById(id)
        if (!data) {
          setError('Player not found.')
          return
        }
        setPlayer({
          ...formatPlayerCard(data),
          leagues: data.statistics || [],
        })
      } catch (err) {
        console.error(err)
        setError('Unable to load this player right now.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="card">Loading player...</div>
  if (error) return <div className="card error">{error}</div>
  if (!player) return null

  const chartData = player.leagues.map((entry) => ({
    label: `${entry.league?.name ?? 'League'} ${entry.league?.season ?? ''}`,
    goals: entry.goals?.total ?? 0,
  }))

  return (
    <div className="page">
      <div className="card profile-card">
        <div className="profile-header">
          <img src={player.photo} alt={player.name} className="profile-avatar" />
          <div>
            <h1>{player.name}</h1>
            <p className="muted">
              {player.position} · {player.team || 'Free agent'}
            </p>
            <div className="chips">
              <span className="chip">Age {player.age || 'N/A'}</span>
              <span className="chip">{player.nationality || 'Unknown nationality'}</span>
              {player.teamId && (
                <Link className="chip link-chip" to={`/team/${player.teamId}`}>
                  View team
                </Link>
              )}
            </div>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => toggleFavorite(player)}
          >
            {isFavorite(player.id) ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Appearances</p>
            <p className="stat-number">{player.appearances ?? 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Goals</p>
            <p className="stat-number">{player.goals ?? 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Assists</p>
            <p className="stat-number">{player.assists ?? 0}</p>
          </div>
        </div>
      </div>

      <PlayerChart data={chartData} />

      <div className="card">
        <h3>Competition stats</h3>
        <div className="table">
          <div className="table-row table-head">
            <div>Competition</div>
            <div>Season</div>
            <div>Apps</div>
            <div>Goals</div>
            <div>Assists</div>
          </div>
          {player.leagues.map((entry, idx) => (
            <div className="table-row" key={`${entry.league?.id}-${idx}`}>
              <div>{entry.league?.name || 'League'}</div>
              <div>{entry.league?.season || '—'}</div>
              <div>{entry.games?.appearances ?? 0}</div>
              <div>{entry.goals?.total ?? 0}</div>
              <div>{entry.goals?.assists ?? 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerProfile
