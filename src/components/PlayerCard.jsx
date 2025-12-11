import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

const PlayerCard = ({ player }) => {
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(player.id)

  return (
    <div className="card player-card">
      <div className="player-card__header">
        <div className="player-card__identity">
          <img src={player.photo} alt={player.name} className="avatar" />
          <div>
            <Link to={`/player/${player.id}`} className="player-name">
              {player.name}
            </Link>
            <div className="muted">
              {player.team || 'Unknown team'} · {player.position || 'N/A'}
            </div>
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={() => toggleFavorite(player)}>
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <div className="player-card__stats">
        <div>
          <div className="stat-label">Goals</div>
          <div className="stat-value">{player.goals ?? 0}</div>
        </div>
        <div>
          <div className="stat-label">Assists</div>
          <div className="stat-value">{player.assists ?? 0}</div>
        </div>
        <div>
          <div className="stat-label">Apps</div>
          <div className="stat-value">{player.appearances ?? 0}</div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
