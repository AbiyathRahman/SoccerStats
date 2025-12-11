import { Link } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard'
import { useFavorites } from '../context/FavoritesContext'

const Favorites = () => {
  const { favorites } = useFavorites()

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Favorites</p>
          <h1>Saved players</h1>
          <p className="muted">Quick access to players you have starred.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="card">
          <p>No favorites yet.</p>
          <Link to="/" className="link">Search players</Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
