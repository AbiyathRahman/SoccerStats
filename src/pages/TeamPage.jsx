import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard'
import { fetchTeamById, fetchTeamPlayers, formatPlayerCard } from '../api/client'

const TeamPage = () => {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const season = 2023

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [teamData, rosterData] = await Promise.all([
          fetchTeamById(id),
          fetchTeamPlayers(id, season),
        ])
        if (!teamData) {
          setError('Team not found.')
          return
        }
        setTeam({ ...teamData.team, venue: teamData.venue })
        setPlayers(rosterData.map(formatPlayerCard))
        if (!rosterData.length) {
          setError(`No roster data for season ${season}.`)
        }
      } catch (err) {
        console.error(err)
        setError(`Unable to load this team for season ${season}.`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="card">Loading team...</div>
  if (error) return <div className="card error">{error}</div>

  return (
    <div className="page">
      <div className="card team-card">
        <div className="team-header">
          <img src={team.logo} alt={team.name} className="team-logo" />
          <div>
            <h1>{team.name}</h1>
            <p className="muted">
              {team.country} · Founded {team.founded || 'N/A'}
            </p>
            <p className="muted small">{team.venue?.name}</p>
          </div>
          <div className="muted small">Season {season}</div>
        </div>
      </div>

      <div className="section-heading">
        <h3>Roster</h3>
        <p className="muted">Season {season}</p>
      </div>
      <div className="grid">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

export default TeamPage
