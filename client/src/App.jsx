import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import Events from './pages/Events'
import Series from './pages/Series'
import AllSeries from './pages/AllSeries'
import AllBlogs from './pages/AllBlogs'
import AllJournals from './pages/AllJournals'
import Journal from './pages/Journal'
import JournalPost from './pages/JournalPost'
import BlogPost from './pages/BlogPost'
import Blogs from './pages/Blogs'
import CreatePost from './pages/CreatePost'
import CreateJournal from './pages/CreateJournal'
import CreateSeries from './pages/CreateSeries'
import CreateBlogs from './pages/CreateBlogs'
import SeriesDetail from './pages/SeriesDetail'
import SeasonDetail from './pages/SeasonDetail'
import Profile from './pages/Profile'
import Creators from './pages/Creators'
import ThreeBackground from './components/ThreeBackground'
import api from './api'
import Splash from './components/Splash'
import './styles.css'

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  const backendRoot = apiBase.replace('/api', '')
  return `${backendRoot}${avatarPath}`
}

function App() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'))
  const [showSplash, setShowSplash] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.auth.getUser()
          setUser(response)
        } catch (err) {
          console.error('Failed to fetch user in App:', err)
        }
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [isAuthenticated])


  const handleSignOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }

  return (
    <div className="page">
      <ThreeBackground />
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      <nav className="nav">
        <Link to="/" className="logo link-plain">
          Mind Matrix
        </Link>
        <div className="nav-links">
          <Link to="/journal" className={location.pathname === '/journal' ? 'active' : ''}>
            Journal
          </Link>
          <Link to="/blogs" className={location.pathname === '/blogs' ? 'active' : ''}>
            Blogs
          </Link>
          <Link to="/series" className={location.pathname === '/series' ? 'active' : ''}>
            Series
          </Link>
          <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
            Events
          </Link>
          <Link to="/creators" className={location.pathname === '/creators' ? 'active' : ''}>
            Creators
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About
          </Link>
          <Link to="/pricing" className="pricing-link">
            Pricing
          </Link>
        </div>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="profile-icon" title="Profile">
                <div className="profile-avatar">
                  {user?.avatar ? (
                    <img 
                      src={getAvatarUrl(user.avatar)} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '18px' }}>👤</span>
                  )}
                </div>
              </Link>
              <button type="button" onClick={handleSignOut} className="ghost link-button">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="ghost link-button">
                Sign in
              </Link>
              <Link to="/journal/new" className="primary link-button">
                Start Writing
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/all" element={<AllJournals />} />
        <Route path="/journal/:slug" element={<JournalPost />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/all" element={<AllBlogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/series" element={<Series />} />
        <Route path="/series/all" element={<AllSeries />} />
        <Route path="/series/new" element={<CreateSeries />} />
        <Route path="/series/:slug" element={<SeriesDetail />} />
        <Route path="/series/:slug/season/:seasonSlug" element={<SeasonDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/journal/new" element={<CreateJournal />} />
        <Route path="/blogs/new" element={<CreateBlogs />} />
        <Route path="/signin" element={<Auth mode="signin" setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Auth mode="signup" setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile onProfileUpdate={setUser} />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
