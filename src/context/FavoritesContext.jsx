import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage('soccer-favorites', [])

  const toggleFavorite = (player) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === player.id)
      if (exists) {
        return prev.filter((p) => p.id !== player.id)
      }
      return [...prev, player]
    })
  }

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite: (id) => favorites.some((p) => p.id === id),
    }),
    [favorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => useContext(FavoritesContext)
