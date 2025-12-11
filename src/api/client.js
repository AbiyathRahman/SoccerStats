import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://v3.football.api-sports.io'
const API_KEY = import.meta.env.VITE_API_KEY

const requestCache = new Map()
// Prefer latest season first, then fall back to earlier free-tier seasons to avoid errors.
const SEASONS = [2024, 2023, 2022, 2021]
const LEAGUES = [39, 140, 78] // Premier League, La Liga, Bundesliga
export const SEASON_OPTIONS = Array.from({ length: 2024 - 2014 + 1 }, (_, idx) => 2024 - idx)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
})

const buildCacheKey = (url, params) => `${url}-${JSON.stringify(params || {})}`

const get = async (url, params = {}) => {
  const key = buildCacheKey(url, params)
  if (requestCache.has(key)) {
    return requestCache.get(key)
  }

  const response = await api.get(url, { params })
  if (response.data?.errors && Object.keys(response.data.errors).length) {
    throw new Error(
      response.data.errors[0] || response.data.errors.general || 'API returned an error',
    )
  }
  const data = response.data?.response ?? []
  requestCache.set(key, data)
  return data
}

const getWithSeasonFallback = async (url, params) => {
  for (const season of SEASONS) {
    try {
      const data = await get(url, { ...params, season })
      if (Array.isArray(data) && data.length) return data
      // If empty, try the next season rather than throwing to reduce API errors.
    } catch (err) {
      // On season-specific error, continue to next season.
      continue // eslint-disable-line no-continue
    }
  }
  // Final attempt without forcing season to return any available payload (may be empty).
  return get(url, params)
}

export const searchPlayers = async (query) => {
  if (!query) return []

  const seen = new Set()
  const aggregated = []

  for (const league of LEAGUES) {
    const data = await getWithSeasonFallback('/players', { search: query, league })
    data.forEach((item) => {
      const id = item.player?.id
      if (id && !seen.has(id)) {
        seen.add(id)
        aggregated.push(item)
      }
    })
  }

  return aggregated
}

export const searchTeams = async (query) => {
  if (!query) return []

  const seen = new Set()
  const aggregated = []

  for (const league of LEAGUES) {
    // API does not allow search + league together; fetch league teams and filter locally.
    const data = await getWithSeasonFallback('/teams', { league })
    data
      .filter((item) =>
        item.team?.name?.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .forEach((item) => {
        const id = item.team?.id
        if (id && !seen.has(id)) {
          seen.add(id)
          aggregated.push(item)
        }
      })
  }

  return aggregated
}

export const fetchPlayerById = async (id) => {
  const data = await getWithSeasonFallback('/players', { id })
  return data?.[0] || null
}

export const fetchTeamById = async (id) => {
  const data = await get('/teams', { id })
  return data?.[0] || null
}

export const fetchTeamPlayers = async (teamId, season) => {
  const fetchPaged = async (s) => {
    const all = []
    let page = 1
    let done = false

    while (!done) {
      const response = await api.get('/players', {
        params: { team: teamId, season: s, page },
      })
      const data = response.data?.response ?? []
      const paging = response.data?.paging
      all.push(...data)
      if (!paging || paging.current >= paging.total) {
        done = true
      } else {
        page += 1
      }
    }
    return all
  }

  // If a season is explicitly requested (from the dropdown), honor it directly.
  if (season) {
    return fetchPaged(season)
  }

  // Otherwise, try the latest first then fallback.
  for (const s of [2023, 2024]) {
    try {
      const data = await fetchPaged(s)
      if (data.length) return data
    } catch (err) {
      continue // eslint-disable-line no-continue
    }
  }

  return fetchPaged(2023)
}

export const fetchPlayerStatistics = async (id) => {
  return getWithSeasonFallback('/players', { id })
}

export const formatPlayerCard = (item) => {
  const stats = item.statistics?.[0] || {}
  return {
    id: item.player?.id,
    name: item.player?.name,
    team: stats.team?.name,
    teamId: stats.team?.id,
    position: stats.games?.position,
    nationality: item.player?.nationality,
    age: item.player?.age,
    photo: item.player?.photo || 'https://via.placeholder.com/80?text=Player',
    goals: stats.goals?.total ?? 0,
    assists: stats.goals?.assists ?? 0,
    appearances: stats.games?.appearances ?? 0,
  }
}
