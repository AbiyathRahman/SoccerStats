import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { FavoritesProvider } from './context/FavoritesContext'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import PlayerProfile from './pages/PlayerProfile'
import TeamPage from './pages/TeamPage'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'
import Teams from './pages/Teams'
import './App.css'

const App = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/team/:id" element={<TeamPage />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  )
}

export default App
