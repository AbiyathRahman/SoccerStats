import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useFavorites } from '../context/FavoritesContext'

const navItems = [
  { to: '/', label: 'Search' },
  { to: '/teams', label: 'Teams' },
  { to: '/compare', label: 'Compare' },
  { to: '/favorites', label: 'Favorites' },
]

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme()
  const { favorites } = useFavorites()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="logo-mark">PitchIntel</div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={item.to === '/'}
            >
              {item.label}
              {item.to === '/favorites' && favorites.length > 0 && (
                <span className="pill">{favorites.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="topbar-actions">
          <button type="button" className="ghost-btn" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}

export default Layout
