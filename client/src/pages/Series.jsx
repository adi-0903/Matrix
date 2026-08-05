import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BookOpen, Sparkles } from '../icons'
import SectionHeading from '../components/SectionHeading'
import Footer from '../components/Footer'
import ReadingJournal from '../components/ReadingJournal'
import api from '../api'

const Series = () => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [series, setSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    const filters = ['All', 'Culture', 'Travel', 'Design', 'Opinion', 'Personal', 'Technology']

    useEffect(() => {
        fetchCurrentUser()
        fetchSeries()
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

    const fetchSeries = async () => {
        try {
            setLoading(true)
            const response = await api.blog.getSeries()
            const data = response?.results || response
            setSeries(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load series')
            console.error('Fetch series error:', err)
            setSeries([])
        } finally {
            setLoading(false)
        }
    }

    const allUserSeries = currentUser 
        ? series.filter(s => s.author?.id === currentUser.id)
        : series

    const otherUsersSeries = currentUser 
        ? series.filter(s => s.author?.id !== currentUser.id)
        : series

    const filteredSeries = activeFilter === 'All' 
        ? allUserSeries 
        : allUserSeries.filter(s => s.tags_list?.some(tag => tag.toLowerCase() === activeFilter.toLowerCase()))

    const featuredSeries = otherUsersSeries.filter(s => s.status === 'active').slice(0, 4)

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
                    <p>Loading series...</p>
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
                    <button onClick={fetchSeries} className="retry-button">Try Again</button>
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
                    <span>Series</span>
                </div>
                <h1>Your Series</h1>
                <p>Your curated collections and story series</p>
                <div style={{ marginTop: '16px' }}>
                    <Link to="/series/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                        New Series
                    </Link>
                </div>
            </motion.div>

            {/* All Series Section */}
            <section className="articles-section">
                <div className="section-header">
                    <h2>All Series</h2>
                    <div className="header-line" />
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {filters.map((filter) => (
                        <motion.button
                            key={filter}
                            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {filter}
                        </motion.button>
                    ))}
                </div>

                {/* Series Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        className="articles-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredSeries.length === 0 ? (
                            <div className="no-posts">
                                <p>No series found for "{activeFilter}" category.</p>
                            </div>
                        ) : (
                            filteredSeries.map((series, i) => (
                                <Link key={series.id} to={`/series/${series.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <motion.article
                                        className="article-card"
                                        style={{ background: getGradient(series.status) }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                    >
                                        <div className="article-icon-small">{series.icon || '📚'}</div>
                                        <div className="article-header">
                                            <span className="article-category-small">{series.status}</span>
                                            <span className="read-time-small">{series.episodes_count || 0} episodes</span>
                                        </div>
                                        <h4>{series.title}</h4>
                                        <p className="article-excerpt">{series.subtitle}</p>
                                        <div className="article-footer">
                                            <div className="author-info">
                                                <span>{series.author?.username || 'Anonymous'}</span>
                                                <span className="separator">•</span>
                                                <span>{series.episodes_count === 1 ? '1 episode' : `${series.episodes_count || 0} episodes`}</span>
                                            </div>
                                            <div className="article-actions">
                                                <ReadingJournal postId={series.id} postType="series" />
                                                <ArrowRight className="arrow-icon" />
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                {filteredSeries.length === 0 && activeFilter !== 'All' && (
                    <motion.div
                        className="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>No series found in this category.</p>
                    </motion.div>
                )}
            </section>

            {/* Published Series Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Published Series</h2>
                    <div className="header-line" />
                    <Link to="/series/all" className="view-all-btn">
                        View All
                        <ArrowRight />
                    </Link>
                </div>

                <div className="featured-grid">
                    {featuredSeries.map((series, i) => (
                        <motion.article
                            key={series.id}
                            className="featured-article"
                            style={{ background: getGradient(series.status) }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.01 }}
                        >
                            <div className="article-icon">{series.icon || '📚'}</div>
                            <span className="article-category">{series.status}</span>
                            <h3>{series.title}</h3>
                            <p>{series.subtitle}</p>
                            <div className="article-meta">
                                <div className="meta-left">
                                    <span className="author">{series.author?.username || 'Anonymous'}</span>
                                    <span className="separator">•</span>
                                    <span className="date">{series.episodes_count === 1 ? '1 episode' : `${series.episodes_count || 0} episodes`}</span>
                                </div>
                                <div className="meta-right">
                                    <ReadingJournal postId={series.id} postType="series" />
                                    <span className="read-time">{series.episodes_count === 1 ? '1 episode' : `${series.episodes_count || 0} episodes`}</span>
                                </div>
                            </div>
                            <Link to={`/series/${series.slug}`} className="read-more">
                                Explore series
                                <ArrowRight />
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Series
