import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Index from './pages/Index'
import Home from './pages/Home'
import Music from './pages/Music'
import Profile from './pages/Profile'
import Memories from './pages/Memories'
import Diary from './pages/Diary'
import Login from './pages/Login'
import Movie from './pages/Movie'
import Series from './pages/Series'
import React, { useState } from 'react'
import { MusicProvider } from './context/MusicContext'
import GlobalMusicPlayer from './components/GlobalMusicPlayer'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', backgroundColor: '#fff', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/series" element={<Series />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/'
  
  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <AnimatedRoutes />
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bro_authenticated') === 'true'
  })

  const handleLoginSuccess = () => {
    localStorage.setItem('bro_authenticated', 'true')
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Login onLoginSuccess={handleLoginSuccess} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <MusicProvider>
        <Router>
          <AppContent />
          <GlobalMusicPlayer />
        </Router>
      </MusicProvider>
    </ErrorBoundary>
  )
}

export default App