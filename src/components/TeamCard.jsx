import { Link } from 'react-router-dom'

const TeamCard = ({ team }) => {
  return (
    <Link to={`/team/${team.id}`} className="card team-card-link">
      <div className="team-card-row">
        <div className="team-card-left">
          <img src={team.logo} alt={team.name} className="team-logo small" />
          <div>
            <div className="player-name">{team.name}</div>
            <div className="muted small">
              {team.country} · Founded {team.founded || 'N/A'}
            </div>
          </div>
        </div>
        <span className="pill">View</span>
      </div>
    </Link>
  )
}

export default TeamCard
