import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BookOpen, Sparkles } from '../icons'
import Footer from '../components/Footer'
import ReadingJournal from '../components/ReadingJournal'
import api from '../api'

const AllSeries = () => {
    const [series, setSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        fetchCurrentUser()
        fetchAllSeries()
    }, [])

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (token) {
                const user = await api.auth.getUser()
                setCurrentUser(user)
            }
        } catch (err) {
            console.error('Failed to fetch user:', err)
        }
    }

    const fetchAllSeries = async () => {
        try {
            setLoading(true)
            const response = await api.blog.getSeries()
            const data = response?.results || response
            setSeries(Array.isArray(data) && data.length > 0 ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load series')
            console.error('Fetch series error:', err)
            setSeries([])
        } finally {
            setLoading(false)
        }
    }

    const getGradient = (status) => {
        return status === 'active' 
            ? 'linear-gradient(135deg, rgba(99, 221, 190, 0.3), rgba(76, 175, 215, 0.2))'
            : 'linear-gradient(135deg, rgba(181, 169, 255, 0.3), rgba(120, 88, 255, 0.2))'
    }

    if (loading) {
        return (
            <div className="series-page">
                <div className="series-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading all series...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="series-page">
                <div className="series-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchAllSeries} className="retry-button">Try Again</button>
                </div>
            </div>
        )
    }

    return (
        <div className="series-page">
            <div className="series-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="series-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="pill">
                    <BookOpen />
                    <span>All Series</span>
                </div>
                <h1>All Published Series</h1>
                <p>Explore all series from our community</p>
                <div style={{ marginTop: '16px' }}>
                    <Link to="/series" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Back to Your Series
                    </Link>
                </div>
            </motion.div>

            <div className="series-content">
                {series.length === 0 ? (
                    <div className="no-series">
                        <p>No series available at the moment.</p>
                    </div>
                ) : (
                    <div className="featured-grid">
                        {series.map((seriesItem, i) => (
                            <motion.article
                                key={seriesItem.id}
                                className="featured-article"
                                style={{ background: getGradient(seriesItem.status) }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.01 }}
                            >
                                <div className="article-icon">{seriesItem.icon || '📚'}</div>
                                <span className="article-category">{seriesItem.status}</span>
                                <h3>{seriesItem.title}</h3>
                                <p>{seriesItem.subtitle}</p>
                                <div className="article-meta">
                                    <div className="meta-left">
                                        <span className="author">{seriesItem.author?.username || 'Anonymous'}</span>
                                        <span className="separator">•</span>
                                        <span className="date">{seriesItem.episodes_count === 1 ? '1 episode' : `${seriesItem.episodes_count || 0} episodes`}</span>
                                    </div>
                                    <div className="meta-right">
                                        <ReadingJournal postId={seriesItem.id} postType="series" />
                                        <span className="read-time">{seriesItem.episodes_count === 1 ? '1 episode' : `${seriesItem.episodes_count || 0} episodes`}</span>
                                    </div>
                                </div>
                                <Link to={`/series/${seriesItem.slug}`} className="read-more">
                                    Explore series
                                    <ArrowRight />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default AllSeries
